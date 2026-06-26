function Hero() {
  return (
    <section className="flex flex-col items-center text-center pt-32 px-5">
      <p className="text-blue-400 text-[9px] sm:text-[10px] tracking-[4px] uppercase font-medium">
        Relocation Companion
      </p>

      <h1 className="mt-2 font-bold text-[clamp(1.7rem,5vw,3.2rem)] leading-none whitespace-nowrap">
        Find your{" "}
        <span className="text-blue-500">
          next city.
        </span>
      </h1>

      <p className="mt-4 text-gray-300 text-sm md:text-base leading-relaxed max-w-md">
        Compare cost of living, quality of life,
        <br />
        safety and more before you move.
      </p>
    </section>
  );
}

export default Hero;