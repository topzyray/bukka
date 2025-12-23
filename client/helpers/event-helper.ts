export class EventHelper {
  public static AUTH_EVENTS = {
    LOGOUT: "auth:logout",
  };

  static broadcastLogout = () => {
    // Modern browsers
    if (typeof BroadcastChannel !== "undefined") {
      const channel = new BroadcastChannel(this.AUTH_EVENTS.LOGOUT);
      channel.postMessage("logout");
      channel.close();
    }

    // Fallback (also triggers storage event)
    try {
      localStorage.setItem(this.AUTH_EVENTS.LOGOUT, Date.now().toString());
    } catch {}
  };
}
