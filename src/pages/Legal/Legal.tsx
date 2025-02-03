

const Legal = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto text-gray-200">
      <h1 className="text-2xl font-bold mb-4">Mentions Légales</h1>
      <p>
        Ce site est édité par <strong>Skorol Web</strong>.
      </p>
      <p>
        Hébergement : <strong>Nom de l'hébergeur</strong>.
      </p>
      <p>
        Pour toute question, vous pouvez nous contacter à{" "}
        <a href="mailto:contact@skorolweb.com" className="text-blue-400">
          contact@skorolweb.com
        </a>
        .
      </p>
      <h2 className="text-xl font-semibold mt-4">Données personnelles</h2>
      <p>
        Ce site collecte des données uniquement pour améliorer l'expérience des
        utilisateurs. Aucune donnée n'est vendue ou partagée.
      </p>
      <h2 className="text-xl font-semibold mt-4">Cookies</h2>
      <p>Nous utilisons des cookies pour garantir un bon fonctionnement du site.</p>
    </div>
  );
};

export default Legal;
