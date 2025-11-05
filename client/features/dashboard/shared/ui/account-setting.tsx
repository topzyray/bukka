export function AccountSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          Account Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your login credentials and account details.
        </p>
      </div>

      <div className="space-y-4">
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              Current Password
            </label>
            <input
              type="password"
              className="w-full p-2 rounded-md border border-input bg-background"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              New Password
            </label>
            <input
              type="password"
              className="w-full p-2 rounded-md border border-input bg-background"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}
