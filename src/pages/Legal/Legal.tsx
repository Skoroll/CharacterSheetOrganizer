import { useEffect } from "react";
import "./Legal.scss";
const Legal = () => {
    useEffect(() => {
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 100);
    }, []);


  return (
    <div className="legal-container">
      <h1>Mentions Légales</h1>

      <section>
        <h2>Informations Générales</h2>
        <p>
          Ce site est un outil communautaire permettant aux joueurs de gérer leurs personnages dans l’univers du jeu de rôle <strong>Aria</strong>, créé par <strong>FibreTigre</strong> et publié par <strong>ElderCraft</strong>. Il ne détient aucun droit sur les règles du jeu et n’est en aucun cas affilié officiellement aux créateurs ou aux éditeurs.
        </p>
      </section>

      <section>
        <h2>Utilisation des Données Utilisateurs</h2>
        <p>
          Les données collectées sont uniquement utilisées pour le bon fonctionnement du site et ne sont en aucun cas revendues ou utilisées à des fins commerciales.
        </p>
      </section>

      <section>
        <h2>Données Stockées</h2>
        <p>
          Le site stocke uniquement les informations nécessaires à son fonctionnement :
        </p>
        <ul>
          <li>Pseudonyme</li>
          <li>Mot de passe (chiffré, non visible en clair)</li>
          <li>Adresse email</li>
          <li>Caractéristiques des personnages créés</li>
        </ul>
        <p>
          Ces données ne sont accessibles qu’aux administrateurs du site et aux utilisateurs concernés.
        </p>
      </section>

      <section>
        <h2>Responsabilité</h2>
        <p>
          En utilisant ce site, vous acceptez que l’administrateur ne puisse être tenu responsable des contenus partagés par les utilisateurs, ni de l’utilisation faite des outils mis à disposition.
        </p>
      </section>

      <section>
        <h2>Contact</h2>
        <p>
          Pour toute question ou demande de suppression de compte, contactez-nous à l’adresse suivante : <strong>contact.skorol@gmail.com</strong>
        </p>
      </section>
    </div>
  );
};

export default Legal;
