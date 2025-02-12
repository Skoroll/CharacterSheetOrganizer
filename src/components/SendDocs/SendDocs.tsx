import { useState } from "react";
import "./SendDocs.scss";

export default function SendDocs() {
  const [isDoc, setIsDoc] = useState(false);

  function toggleDoc() {
    setIsDoc((prev) => !prev);
  }

  return (
    <div className="share-pannel">
      <h2>Partager </h2>
      <div className="share-pannel__buttons">
        <button onClick={toggleDoc}>Doc</button>
        <button onClick={toggleDoc}>Text</button>
      </div>
      <div className="share-pannel__container">
        {!isDoc ? (
          <label>
            Envoyez un document
            <input type="file" />
          </label>
        ) : (
          <label>
            Texte
            <textarea name="text-share" />
          </label>
        )}
      </div>
    </div>
  );
}
