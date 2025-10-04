import { CircularLoader } from "@/components/loaders/circular-loader";

export default function Loading() {
  return (
    <section className="h-screen flex justify-center items-center">
      <CircularLoader />
    </section>
  );
}
