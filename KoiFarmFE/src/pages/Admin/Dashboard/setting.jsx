function Settings() {

  return (
    <div className="container my-4">
      <h2 className="text-center mb-4">User Settings</h2>
      <form>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email Address
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            required
          />
        </div>
        
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="text"
            className="form-control"
            id="password"
            name="password"
            required
          />
        </div>

        <div className="mb-3 form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="notifications"
            name="notifications"
          />
          <label className="form-check-label" htmlFor="notifications">
            Enable Notifications
          </label>
        </div>

        <div className="mb-3">
          <label htmlFor="theme" className="form-label">
            Theme
          </label>
          <select
            className="form-select"
            id="theme"
            name="theme"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary">
          Save Settings
        </button>
      </form>
    </div>
  );
}

export default Settings;
