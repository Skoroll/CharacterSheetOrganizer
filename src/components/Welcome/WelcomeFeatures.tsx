export default function WelcomeFeatures () {
    return (
                <ul className="welcome__features">
          <li>
            <div className="welcome__features--desc">
              <i className="fa-solid fa-user"></i>
              <h2>Créez vos propres personnages</h2>
            </div>
            <p>Créez et gérer vos personnages à souhait.</p>
          </li>
          <li>
            <div className="welcome__features--desc">
              <i className="fa-solid fa-dice-d20"></i>
              <h2>Table de jeu en ligne</h2>
            </div>
            <p>Rejoingez ou créez des campagnes en tant que MJ ou joueur.</p>
          </li>
          <li>
            <div className="welcome__features--desc">
              <i className="fa-solid fa-book"></i>
              <h2>Bibliothèque de quêtes</h2>
            </div>
            <p>
              En manque d'inspiration ? Consultez la bibliothèque de quête
              communautaire ou ajoutez les votres.
            </p>
          </li>
        </ul>
    )
}