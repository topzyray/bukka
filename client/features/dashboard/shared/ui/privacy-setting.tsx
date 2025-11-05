export function PrivacySettings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          Privacy Settings
        </h1>
        <p className="text-muted-foreground">
          Control who can see your data and manage data sharing preferences.
        </p>
      </div>

      <div className="space-y-3">
        <label className="flex items-center gap-2">
          <input type="checkbox" className="accent-primary" /> Allow others to
          see my profile
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" className="accent-primary" /> Share anonymized
          usage data
        </label>
      </div>

      <button
        type="submit"
        className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition"
      >
        Save Changes
      </button>
    </div>
  );
}
