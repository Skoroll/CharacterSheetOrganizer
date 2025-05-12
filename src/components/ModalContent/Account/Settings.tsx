import SelectTheme from "../../SelectTheme/SelectTheme";

interface SettingsProps {
  isPremium: boolean;
}

const Settings = ({ isPremium }: SettingsProps) => {
  return (
    <div className="settings">
      <SelectTheme isPremium={isPremium} />
    </div>
  );
};

export default Settings;