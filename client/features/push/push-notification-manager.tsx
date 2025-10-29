import { useEffect, useState } from "react";
import { urlBase64ToUint8Array } from "./url-base-64-to-unit-8-array";
import { subscribeUser, unsubscribeUser } from "@/app/action";
import { sendNotification } from "@/app/action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function PushNotificationManager() {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true);
      registerServiceWorker();
    }
  }, []);

  async function registerServiceWorker() {
    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
      updateViaCache: "none",
    });
    const sub = await registration.pushManager.getSubscription();
    setSubscription(sub);
  }

  async function subscribeToPush() {
    const registration = await navigator.serviceWorker.ready;
    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
      ),
    });
    setSubscription(sub);
    const serializedSub = JSON.parse(JSON.stringify(sub));
    await subscribeUser(serializedSub);
  }

  async function unsubscribeFromPush() {
    await subscription?.unsubscribe();
    setSubscription(null);
    await unsubscribeUser();
  }

  async function sendTestNotification() {
    if (subscription) {
      await sendNotification(message);
      setMessage("");
    }
  }

  if (!isSupported) {
    return <p>Push notifications are not supported in this browser.</p>;
  }

  return (
    <div>
      <h3>Push Notifications</h3>
      {subscription ? (
        <>
          <p>You are subscribed to push notifications.</p>
          <Button onClick={unsubscribeFromPush}>Unsubscribe</Button>
          <Input
            type="text"
            placeholder="Enter notification message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button onClick={sendTestNotification}>Send Test</Button>
        </>
      ) : (
        <>
          <p>You are not subscribed to push notifications.</p>
          <Button onClick={subscribeToPush}>Subscribe</Button>
        </>
      )}
    </div>
  );
}

// "use client";

// import React, { useEffect, useState } from "react";
// import { urlBase64ToUint8Array } from "@/lib/urlBase64ToUint8Array";

// // --- Type for what we send to backend
// type SubscriptionPayload = {
//   endpoint: string;
//   expirationTime?: number | null;
//   keys: { p256dh: string; auth: string };
// };

// export function PushNotificationManager() {
//   const [isSupported, setIsSupported] = useState(false);
//   const [subscription, setSubscription] = useState<PushSubscription | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");

//   // ✅ Using NEXT_PUBLIC_API_BASE_URL from env for Render backend
//   const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;
//   const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;

//   useEffect(() => {
//     const supported = "serviceWorker" in navigator && "PushManager" in window;
//     setIsSupported(supported);

//     if (!supported) return;

//     // Register service worker if not already registered
//     (async () => {
//       try {
//         let reg = await navigator.serviceWorker.getRegistration();
//         if (!reg) {
//           reg = await navigator.serviceWorker.register("/sw.js");
//         }

//         const sub = await reg.pushManager.getSubscription();
//         setSubscription(sub);
//       } catch (err) {
//         console.error("Service Worker registration failed:", err);
//       }
//     })();
//   }, []);

//   // --- SUBSCRIBE ---
//   async function subscribeToPush() {
//     if (!isSupported) return;
//     if (Notification.permission === "denied") {
//       alert("Notifications are blocked. Please enable them in your browser settings.");
//       return;
//     }

//     setLoading(true);
//     try {
//       const reg = await navigator.serviceWorker.ready;
//       const sub = await reg.pushManager.subscribe({
//         userVisibleOnly: true,
//         applicationServerKey: urlBase64ToUint8Array(publicKey),
//       });

//       setSubscription(sub);

//       // ✅ Convert to plain object to avoid serialization mismatch
//       const payload: SubscriptionPayload = sub.toJSON();

//       // ✅ Use your Nest.js backend on Render
//       await fetch(`${API_BASE}/notifications/subscribe`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });
//     } catch (err) {
//       console.error("Push subscription failed:", err);
//     } finally {
//       setLoading(false);
//     }
//   }

//   // --- UNSUBSCRIBE ---
//   async function unsubscribeFromPush() {
//     if (!subscription) return;
//     setLoading(true);
//     try {
//       const endpoint = subscription.endpoint;
//       await subscription.unsubscribe();

//       await fetch(`${API_BASE}/notifications/unsubscribe`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ endpoint }),
//       });

//       setSubscription(null);
//     } catch (err) {
//       console.error("Unsubscribe failed:", err);
//     } finally {
//       setLoading(false);
//     }
//   }

//   // --- SEND TEST NOTIFICATION ---
//   async function sendTestNotification() {
//     if (!subscription) return alert("You must subscribe first.");

//     setLoading(true);
//     try {
//       // ✅ Send through backend (Nest.js route)
//       await fetch(`${API_BASE}/notifications/test`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ message }),
//       });
//       setMessage("");
//       alert("Test notification sent!");
//     } catch (err) {
//       console.error("Send test failed:", err);
//     } finally {
//       setLoading(false);
//     }
//   }

//   if (!isSupported) {
//     return <p className="text-red-500">Push notifications not supported on this browser.</p>;
//   }

//   return (
//     <div className="p-4 space-y-2">
//       <h3 className="text-lg font-semibold">Push Notifications</h3>

//       {subscription ? (
//         <>
//           <p className="text-sm text-gray-600">✅ Subscribed to push notifications.</p>

//           <div className="flex gap-2 items-center">
//             <input
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//               placeholder="Enter message"
//               className="border rounded p-2 w-full"
//             />
//             <button
//               onClick={sendTestNotification}
//               disabled={!message || loading}
//               className="bg-blue-600 text-white px-3 py-2 rounded"
//             >
//               {loading ? "Sending..." : "Send Test"}
//             </button>
//           </div>

//           <button
//             onClick={unsubscribeFromPush}
//             disabled={loading}
//             className="bg-gray-400 text-white px-3 py-2 rounded"
//           >
//             {loading ? "Working..." : "Unsubscribe"}
//           </button>
//         </>
//       ) : (
//         <button
//           onClick={subscribeToPush}
//           disabled={loading}
//           className="bg-green-600 text-white px-3 py-2 rounded"
//         >
//           {loading ? "Subscribing..." : "Subscribe to Notifications"}
//         </button>
//       )}
//     </div>
//   );
// }
