import {
  featuresForAll,
  featuresForPlayers,
  featuresForGMs,
  ComparativeFeature,
} from "./Features";
import "./PricingTable.scss";

function ComparativeTable({
  title,
  icon,
  features,
}: {
  title: string;
  icon?: string;
  features: ComparativeFeature[];
}) {
  return (
    <div className="comparative-table">
      <h2>
        {icon && <i className={`fa-solid ${icon}`}></i>} {title}
      </h2>
      <table>
        <thead>
          <tr>
            <th>Fonctionnalité</th>
            <th>Gratuit</th>
            <th>Premium</th>
          </tr>
        </thead>
        <tbody>
          {features.map((f, i) => (
            <tr key={i}>
              <td>{f.label}</td>
              <td className="icon-cell">
                <i className={`fa-solid ${f.free ? "fa-check" : "fa-xmark"}`}></i>
              </td>
              <td className="icon-cell">
                <i className={`fa-solid ${f.premium ? "fa-check" : "fa-xmark"}`}></i>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function PremiumTables() {
  return (
    <div className="premium-tables">
      <ComparativeTable
        title="Pour tous"
        icon="fa-star"
        features={featuresForAll}
      />
      <ComparativeTable
        title="Pour les joueurs"
        icon="fa-dice-d20"
        features={featuresForPlayers}
      />
      <ComparativeTable
        title="Pour les maîtres de jeu"
        icon="fa-hat-wizard"
        features={featuresForGMs}
      />
    </div>
  );
}
