export function PersonalizationSettings() {
  return (
    <section className="space-y-6">
      <section>
        <h1 className="text-2xl font-semibold text-foreground">
          Personalization Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your food preferences, dietary restrictions, and delivery
          options.
        </p>
      </section>

      <section className="space-y-4">
        {/* Example form */}
        <form className="space-y-4">
          <section>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              Dietary Restrictions
            </label>
            <input
              type="text"
              placeholder="E.g., Vegetarian, Gluten-Free"
              className="w-full p-2 rounded-md border border-input bg-background"
            />
          </section>

          <section>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              Preferred Delivery Time
            </label>
            <select className="w-full p-2 rounded-md border border-input bg-background">
              <option>Morning</option>
              <option>Afternoon</option>
              <option>Evening</option>
              <option>Anytime of the day</option>
            </select>
          </section>

          <button
            type="submit"
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition"
          >
            Save Preferences
          </button>
        </form>
      </section>
    </section>
  );
}

// "use client";

// import React, { useState, useEffect } from "react";
// import { SettingsCard } from "@/components/settings/settings-card";
// import { cn } from "@/lib/utils";
// import type { PersonalizationSettings } from "@/types/settings";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Switch } from "@/components/ui/switch";

// export  function PersonalizationSettings() {
//   const [state, setState] = useState<PersonalizationSettings>({
//     dietaryRestrictions: [],
//     preferredDeliveryTime: "Anytime",
//     preferredCuisines: [],
//   });

//   useEffect(() => {
//     // Fetch existing preferences (stub)
//     async function load() {
//       try {
//         const res = await fetch('/api/settings/personalization');
//         if (res.ok) {
//           const data = await res.json();
//           setState((s) => ({ ...s, ...(data || {}) }));
//         }
//       } catch (err) {
//         // ignore for now
//       }
//     }
//     load();
//   }, []);

//   const save = async (e: React.FormEvent) => {
//     e.preventDefault();
//     await fetch('/api/settings/personalization', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(state),
//     });
//     // add toast or success state
//   };

//   return (
//     <div className="space-y-6">
//       <header>
//         <h1 className="text-2xl font-semibold">Personalization</h1>
//         <p className="text-sm text-muted-foreground">Manage dietary restrictions, delivery preferences and cuisines.</p>
//       </header>

//       <form onSubmit={save} className="space-y-4">
//         <SettingsCard title="Dietary restrictions">
//           <div className="space-y-2">
//             <Input
//               placeholder="Comma separated like: Vegetarian, Gluten-Free"
//               value={state.dietaryRestrictions.join(', ')}
//               onChange={(e) => setState({ ...state, dietaryRestrictions: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
//             />
//             <p className="text-xs text-muted-foreground">Tip: use comma to add multiple restrictions.</p>
//           </div>
//         </SettingsCard>

//         <SettingsCard title="Preferred delivery time">
//           <select
//             className="w-full p-2 rounded-md border border-input bg-background"
//             value={state.preferredDeliveryTime}
//             onChange={(e) => setState({ ...state, preferredDeliveryTime: e.target.value as any })}
//           >
//             <option>Morning</option>
//             <option>Afternoon</option>
//             <option>Evening</option>
//             <option>Night</option>
//             <option>Anytime</option>
//           </select>
//         </SettingsCard>

//         <SettingsCard title="Preferred cuisines">
//           <Input
//             placeholder="Comma separated like: Italian, Chinese"
//             value={state.preferredCuisines.join(', ')}
//             onChange={(e) => setState({ ...state, preferredCuisines: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
//           />
//         </SettingsCard>

//         <div className="flex justify-end">
//           <Button type="submit">Save Personalization</Button>
//         </div>
//       </form>
//     </div>
//   );
// }
