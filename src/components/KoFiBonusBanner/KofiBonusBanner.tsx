
const KoFiBonusBanner = () => {
  const tierLink = "https://ko-fi.com/summary/d1bb2d8d-3db8-4b96-a22c-fe7bc932701c";

  return (
    <div style={{
      backgroundColor: "#FEEBCB",
      border: "2px solid #F7C59F",
      borderRadius: "12px",
      padding: "20px",
      textAlign: "center",
      maxWidth: "600px",
      margin: "20px auto",
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
    }}>
      <h2 style={{ color: "#6B4C3B" }}>Débloquez les Bonus Exclusifs !</h2>
      <p style={{ color: "#5A3928" }}>
        Soutenez-moi sur Ko-fi pour accéder à des fonctionnalités exclusives dans l'application.
        Rejoignez le <strong>Tier Bonus</strong> dès maintenant !
      </p>
      <a
        href={tierLink}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-block",
          backgroundColor: "#29ABE0",
          color: "#fff",
          padding: "12px 24px",
          borderRadius: "8px",
          textDecoration: "none",
          fontWeight: "bold",
          marginTop: "12px"
        }}
      >
        Rejoindre le Tier Bonus
      </a>
    </div>
  );
};

export default KoFiBonusBanner;
