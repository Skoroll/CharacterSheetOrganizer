import React from "react";
import weapons from "../../../assets/Memo/Aria/weapons.json"
import armors from "../../../assets/Memo/Aria/armor.json"
import foodDrinks from "../../../assets/Memo/Aria/food_and_drinks.json"
import rangedWeapons from "../../../assets/Memo/Aria/ranged.json"
import vehicles from "../../../assets/Memo/Aria/vehicles.json"
import services from "../../../assets/Memo/Aria/services.json"

const ItemListing: React.FC = () => {
  return (
    <div className="item-listing gm-tool">
      <h2>Objets</h2>
      <div className="item-listing__buttons">
        <button>Ajouter</button>
        <button>Armes</button>
        <button>Alimentaire</button>
        <button>Véhicules</button>
        <button>Services</button>
      </div>
    </div>
    
  );
};

export default ItemListing;
