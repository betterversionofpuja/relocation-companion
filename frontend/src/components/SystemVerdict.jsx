import {
  Sparkles,
  Wallet,
  User,
  Leaf,
} from "lucide-react";

function SystemVerdict({ comparison }) {
  const progress = comparison.confidence * 3.6;

  return (
    <section className="max-w-5xl mx-auto px-6 mt-16 pt-8">
      {/* Badge */}
      <div className="flex justify-center mb-4">
        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-blue-500/20 bg-blue-500/[0.03] backdrop-blur-xl">

          <Sparkles
            size={12}
            className="text-blue-400"
          />

          <span className="text-blue-400 uppercase tracking-[3px] text-xs">
            System Verdict
          </span>

        </div>
      </div>

      {/* Desktop Heading */}
<div className="hidden md:grid grid-cols-[1fr_auto_1fr] items-center mt-5 max-w-5xl mx-auto">

  <h2 className="justify-self-end text-3xl font-bold text-white">
  {comparison.cityOne.city}, {comparison.cityOne.country}
</h2>

<span className="mx-5 text-3xl font-bold text-blue-500">
  vs
</span>

<h2 className="justify-self-start text-3xl font-bold text-white">
  {comparison.cityTwo.city}, {comparison.cityTwo.country}
</h2>

</div>

{/* Mobile Heading */}
<div className="md:hidden mt-5 text-center">

  <h2 className="text-3xl font-bold text-white break-words">
    {comparison.cityOne.city}
  </h2>

  <span className="inline-block my-3 px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-500 text-xs font-semibold uppercase tracking-wider">
    VS
  </span>

  <h2 className="text-3xl font-bold text-white break-words">
    {comparison.cityTwo.city}
  </h2>

</div>

      {/* Divider */}
      <div className="flex items-center justify-center gap-3 mt-5">

        <div className="w-28 h-px bg-blue-500/20" />

        <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6]" />

        <div className="w-28 h-px bg-blue-500/20" />

      </div>

      {/* Main Card */}
      <div className="mt-6 rounded-[24px] border border-blue-500/15 bg-[#050816]/70 backdrop-blur-2xl overflow-hidden shadow-[0_0_30px_rgba(37,99,235,0.08)]">

        <div
  className="
    grid
    grid-cols-1
    md:grid-cols-[1fr_200px]
    gap-8
    items-center
    p-5
    md:p-6
  "
>

          {/* Left */}
          <div>

            <div className="flex items-center gap-2">

              <Sparkles
                size={14}
                className="text-blue-400"
              />

              <span className="uppercase tracking-[3px] text-blue-400 text-xs">
                Recommended Destination
              </span>

            </div>

            <h3 className="mt-3 text-4xl font-bold text-white">
              {comparison.overallResult.winner}
            </h3>

            <p className="mt-4 text-base text-gray-300 leading-relaxed max-w-md">
              Based on overall performance across
              financial, lifestyle and environmental
              indicators.
            </p>

          </div>

          {/* Circle */}
          <div className="flex justify-center">

            <div className="relative w-36 h-36">

              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `conic-gradient(
                    #4ea3ff ${progress}deg,
                    rgba(255,255,255,0.08) ${progress}deg
                  )`,
                }}
              />

              <div className="absolute inset-[10px] rounded-full bg-[#050816]" />

              <div className="absolute inset-0 flex flex-col items-center justify-center">

                <h3 className="text-4xl font-bold text-white">
                  {comparison.confidence}%
                </h3>

                <p className="mt-1 text-blue-400 uppercase tracking-[2px] text-[10px]">
                  Match Score
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Winner Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">

        {/* Financial */}
        <div className="rounded-2xl border border-blue-500/15 bg-[#050816]/70 backdrop-blur-xl p-4">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Wallet
                size={18}
                className="text-blue-400"
              />
            </div>

            <div>

              <p className="text-blue-400 uppercase tracking-[2px] text-[10px]">
                Financial Winner
              </p>

              <h3 className="mt-1 text-xl font-bold text-white">
                {comparison.financialResult.winner}
              </h3>

            </div>

          </div>

        </div>

        {/* Lifestyle */}
        <div className="rounded-2xl border border-purple-500/15 bg-[#050816]/70 backdrop-blur-xl p-4">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <User
                size={18}
                className="text-purple-400"
              />
            </div>

            <div>

              <p className="text-purple-400 uppercase tracking-[2px] text-[10px]">
                Lifestyle Winner
              </p>

              <h3 className="mt-1 text-xl font-bold text-white">
                {comparison.lifestyleResult.winner}
              </h3>

            </div>

          </div>

        </div>

        {/* Environmental */}
        <div className="rounded-2xl border border-green-500/15 bg-[#050816]/70 backdrop-blur-xl p-4">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <Leaf
                size={18}
                className="text-green-400"
              />
            </div>

            <div>

              <p className="text-green-400 uppercase tracking-[2px] text-[10px]">
                Environmental Winner
              </p>

              <h3 className="mt-1 text-xl font-bold text-white">
                {comparison.environmentResult.winner}
              </h3>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

export default SystemVerdict;