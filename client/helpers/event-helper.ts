export class EventHelper {
  private static CHANNEL_NAME = "auth-session";
  private static LOGOUT_EVENT = "logout";

  private static channel: BroadcastChannel | null =
    typeof BroadcastChannel !== "undefined"
      ? new BroadcastChannel(EventHelper.CHANNEL_NAME)
      : null;

  static broadcastLogout() {
    if (this.channel) {
      this.channel.postMessage(this.LOGOUT_EVENT);
    }

    try {
      localStorage.setItem(
        `${this.CHANNEL_NAME}:${this.LOGOUT_EVENT}`,
        Date.now().toString()
      );
    } catch {}
  }

  static listenForLogout(cb: () => void) {
    if (this.channel) {
      this.channel.onmessage = (event) => {
        if (event.data === this.LOGOUT_EVENT) {
          cb();
        }
      };
    }

    window.addEventListener("storage", (event) => {
      if (event.key === `${this.CHANNEL_NAME}:${this.LOGOUT_EVENT}`) {
        cb();
      }
    });
  }
}
