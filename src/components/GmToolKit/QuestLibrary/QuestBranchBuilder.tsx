

interface Choice {
  id: string;
  text: string;
  subChoices?: Choice[];
}

export default function QuestBranchBuilder({ branches, setBranches }: {
  branches: Choice[];
  setBranches: (choices: Choice[]) => void;
}) {
  const addChoice = () => {
    const newChoice: Choice = { id: Date.now().toString(), text: "", subChoices: [] };
    setBranches([...branches, newChoice]);
  };

  const updateChoiceText = (id: string, newText: string) => {
    const updated = branches.map((choice) =>
      choice.id === id ? { ...choice, text: newText } : choice
    );
    setBranches(updated);
  };

  const addSubChoice = (parentId: string) => {
    const addToBranch = (choices: Choice[]): Choice[] =>
      choices.map((choice) => {
        if (choice.id === parentId) {
          return {
            ...choice,
            subChoices: [
              ...(choice.subChoices || []),
              { id: Date.now().toString(), text: "", subChoices: [] },
            ],
          };
        }
        return {
          ...choice,
          subChoices: choice.subChoices ? addToBranch(choice.subChoices) : [],
        };
      });

    setBranches(addToBranch(branches));
  };

const renderChoices = (choices: Choice[], prefix = "", level = 0): JSX.Element[] =>
  choices.map((choice, index) => {
    const currentPrefix = prefix ? `${prefix}.${index + 1}` : `${index + 1}`;

    return (
      <div
        className="quest-branch-builder__choice"
        key={choice.id}
        style={{ marginLeft: `${level * 16}px` }}
      >
        <div className="quest-branch-builder__choice--input">
          <span className="quest-branch-builder__choice--prefix">{currentPrefix}</span>
          <input
            type="text"
            placeholder="Texte du choix"
            value={choice.text}
            onChange={(e) => updateChoiceText(choice.id, e.target.value)}
          />
          <button type="button" onClick={() => addSubChoice(choice.id)}>
            Ajouter un sous-choix
          </button>
        </div>
        {choice.subChoices && renderChoices(choice.subChoices, currentPrefix, level + 1)}
      </div>
    );
  });

  return (
    <div className="quest-branch-builder">
      <h4>Embranchements de quête</h4>
      {renderChoices(branches)}
      <button type="button" onClick={addChoice}>
        Ajouter un choix principal
      </button>
    </div>
  );
}
