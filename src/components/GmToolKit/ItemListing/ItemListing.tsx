import React, { useEffect, useState } from "react";
import accessories from "../../../assets/Memo/Aria/accessories.json";
import armors from "../../../assets/Memo/Aria/armor.json";
import foodDrinks from "../../../assets/Memo/Aria/food_and_drinks.json";
import rangedWeapons from "../../../assets/Memo/Aria/ranged.json";
import services from "../../../assets/Memo/Aria/services.json";
import vehicles from "../../../assets/Memo/Aria/vehicles.json";
import weapons from "../../../assets/Memo/Aria/weapons.json";
import Modal from "../../Modal/Modal";
import "./ItemListing.scss";

interface ItemListingProps {
  tableId: string;
}

const API_URL = import.meta.env.VITE_API_URL;

const typeOptions = [
  { value: "accessories", label: "Accessoires" },
  { value: "melee", label: "Armes" },
  { value: "ranged", label: "Armes à distance" },
  { value: "equipment", label: "Équipements" },
  { value: "food", label: "Alimentaire" },
  { value: "vehicle", label: "Véhicules" },
  { value: "service", label: "Services" },
];

const jsonData = [
  { type: "accessories", label: "Accessoires", data: accessories },
  { type: "melee", label: "Armes", data: weapons },
  { type: "ranged", label: "Armes à distance", data: rangedWeapons },
  { type: "equipment", label: "Équipements", data: armors },
  { type: "food", label: "Alimentaire", data: foodDrinks },
  { type: "vehicle", label: "Véhicules", data: vehicles },
  { type: "service", label: "Services", data: services },
];

const ItemListing: React.FC<ItemListingProps> = ({ tableId }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    _id: string;
    name: string;
  } | null>(null);
  const [formVisible, setFormVisible] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>("melee");
  const [createdItems, setCreatedItems] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    type: "",
    name: "",
    price: "",
    description: "",
    use: "",
    range: "",
    damages: "",
  });

  useEffect(() => {
    fetch(`${API_URL}/api/items?tableId=${tableId}`)
      .then((res) => res.json())
      .then((data) => setCreatedItems(data))
      .catch((err) => console.error("Erreur récupération objets :", err));
  }, [tableId]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, price, type } = formData;
    if (!name || !price || !type)
      return alert("Champs obligatoires manquants.");

    try {
      const res = await fetch(`${API_URL}/api/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, tableId, price: parseInt(formData.price) }),
      });

      if (!res.ok) throw new Error("Erreur lors de la création");

      const newItem = await res.json();
      setCreatedItems((prev) => [...prev, newItem]);
      setFormVisible(false);
      setFormData({
        type: "",
        name: "",
        price: "",
        description: "",
        use: "",
        range: "",
        damages: "",
      });
    } catch (err) {
      console.error("❌", err);
      alert("Erreur lors de l'ajout");
    }
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      const res = await fetch(`${API_URL}/api/items/${itemToDelete._id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Erreur lors de la suppression");

      setCreatedItems((prev) =>
        prev.filter((item) => item._id !== itemToDelete._id)
      );
      setModalVisible(false);
      setItemToDelete(null);
    } catch (err) {
      console.error("Erreur suppression :", err);
      alert("Impossible de supprimer l’objet.");
    }
  };

  const renderItemDetails = (item: any, type: string) => {
    if (type === "melee") {
      return (
        <>
          {item.use && (
            <p>
              <strong>Utilisation :</strong> {item.use}
            </p>
          )}
          {item.damages && (
            <p>
              <strong>Dégâts :</strong> {item.damages}
            </p>
          )}
        </>
      );
    }
    if (type === "ranged") {
      return (
        <>
          {item.range && (
            <p>
              <strong>Portée :</strong> {item.range}
            </p>
          )}
          {item.damages && (
            <p>
              <strong>Dégâts :</strong> {item.damages}
            </p>
          )}
        </>
      );
    }
    if (["equipment", "food", "vehicle", "service"].includes(type)) {
      return item.description ? (
        <p>
          <strong>Description :</strong> {item.description}
        </p>
      ) : null;
    }
    return null;
  };

  const mergedCategories = jsonData.map((cat) => ({
    ...cat,
    data: [
      ...cat.data,
      ...createdItems.filter((item) => item.type === cat.type),
    ],
  }));

  const filteredCategories = mergedCategories.filter(
    (cat) => cat.type === selectedType
  );

  return (
    <div className="item-listing gm-tool">
      <h2>Objets</h2>

      <div className="item-listing__search">
        <input
          type="text"
          placeholder="Rechercher un objet..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="item-listing__buttons">
        <button onClick={() => setFormVisible((prev) => !prev)}>
          {formVisible ? "Annuler" : "+ Ajouter un objet"}
        </button>
        {typeOptions.map((opt) => (
          <button key={opt.value} onClick={() => setSelectedType(opt.value)}>
            {opt.label}
          </button>
        ))}
      </div>

      {formVisible && (
        <form className="item-form" onSubmit={handleSubmit}>
          <label>
            Type d'objet *
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="">-- Choisir --</option>
              {typeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>

          <label>
            Nom *
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Prix *
            <input
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              type="number"
            />
          </label>

          {formData.type === "melee" && (
            <>
              <label>
                Utilisation
                <input
                  name="use"
                  value={formData.use}
                  onChange={handleChange}
                />
              </label>
              <label>
                Dégâts
                <input
                  name="damages"
                  value={formData.damages}
                  onChange={handleChange}
                />
              </label>
            </>
          )}

          {formData.type === "ranged" && (
            <>
              <label>
                Portée
                <input
                  name="range"
                  value={formData.range}
                  onChange={handleChange}
                />
              </label>
              <label>
                Dégâts
                <input
                  name="damages"
                  value={formData.damages}
                  onChange={handleChange}
                />
              </label>
            </>
          )}

          {["equipment", "food", "vehicle", "service", "accessories"].includes(formData.type) && (

            <label>
              Description
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </label>
          )}

          <button type="submit">Créer l’objet</button>
        </form>
      )}

      <div className="item-listing__content">
        {filteredCategories.map((cat) =>
          cat.data
            .filter((item) =>
              item.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((item, idx) => (
              <div key={`${cat.label}-${idx}`} className="item-listing__item">
                    {"_id" in item && (
                      <button
                        title="Supprimer cet objet"
                        onClick={() => {
                          setItemToDelete({ _id: item._id, name: item.name });
                          setModalVisible(true);
                        }}
                      >
                        <i className="fa-solid fa-x" />
                      </button>
                    )}
                <div className="item-listing__item--details">
                  <div className="item-header">
                    <h4>{item.name}</h4>
                  </div>
                  <p>
                    <strong>Prix :</strong> {item.price} 🪙
                  </p>
                  {renderItemDetails(item, cat.type)}
                </div>
              </div>
            ))
        )}
      </div>

      {modalVisible && itemToDelete && (
        <Modal
          title="Supprimer un objet"
          onClose={() => {
            setModalVisible(false);
            setItemToDelete(null);
          }}
        >
          <p>
            Supprimer <strong>{itemToDelete.name}</strong> ?
          </p>
          <div className="modal__actions">
            <button onClick={confirmDelete}>Oui</button>
            <button onClick={() => setModalVisible(false)}>Annuler</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ItemListing;
