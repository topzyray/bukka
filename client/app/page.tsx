import { Home } from "@/features/public/landing-page";
import { BukkaWaitList } from "@/features/public/waitlist";

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <BukkaWaitList />
      {/* <Home /> */}
    </div>
  );
}
