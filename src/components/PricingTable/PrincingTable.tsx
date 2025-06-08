import "./PricingTable.scss";

export default function PricingTable () {
    return (
        <>
                  <h2>Gratuit vs. Premium</h2>
        <table className="pricing-table">
  <thead>
    <tr>
      <th>Fonctionalité</th>
      <th>Gratuit</th>
      <th>Premium</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Créer des personnages</td>
      <td><i className="fa-solid fa-check"></i></td>
      <td><i className="fa-solid fa-check"></i></td>
    </tr>
    <tr>
      <td>Créer/Rejoindre des tables</td>
      <td><i className="fa-solid fa-check"></i></td>
      <td><i className="fa-solid fa-check"></i></td>
    </tr>
    <tr>
      <td>Limitation de personnage</td>
      <td>3</td>
      <td>6</td>
    </tr>
    <tr>
      <td>Exporter les feuilles en PDF</td>
      <td><i className="fa-solid fa-x"></i></td>
      <td><i className="fa-solid fa-check"></i></td>
    </tr>
    <tr>
      <td>Cadre de portrait thématiques</td>
      <td><i className="fa-solid fa-x"></i></td>
      <td><i className="fa-solid fa-check"></i></td>
    </tr>
    <tr>
      <td>Soundboard pour MJ</td>
      <td><i className="fa-solid fa-x"></i></td>
      <td>A venir</td>
    </tr>
    <tr>
      <td>Accès aux futurs jeux</td>
      <td><i className="fa-solid fa-x"></i></td>
      <td><i className="fa-solid fa-check"></i></td>
    </tr>
  </tbody>
</table>
</>
    )
}