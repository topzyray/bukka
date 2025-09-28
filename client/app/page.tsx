import Image from "next/image";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/images/bukka-tr.png"
          alt="Bukka logo"
          width={180}
          height={38}
          priority
        />

        <section>
          <h1 className="text-5xl text-amber-950">Welcome to Bukka</h1>
          <p className="text-lg text-amber-900">
            Where you will be able to find any restaurant close by.
          </p>
        </section>
      </main>
    </div>
  );
}
