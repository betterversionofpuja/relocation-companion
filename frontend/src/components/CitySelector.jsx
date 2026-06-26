import { ArrowLeftRight } from "lucide-react";
import CustomSelect from "./CustomSelect";

function CitySelector({
  cities,
  cityOne,
  cityTwo,
  setCityOne,
  setCityTwo,
}) {
  return (
    <div className="mt-10 flex justify-center px-4">
  <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">

        {/* City 1 */}
        <CustomSelect
          value={cityOne}
          onChange={setCityOne}
          options={cities}
          placeholder="Select City"
        />

        {/* Swap Icon */}
        <div
  className="
    w-10
    h-10
    shrink-0
    rounded-full
    border
    border-blue-500/20
    bg-blue-500/5
    backdrop-blur-xl
    flex
    items-center
    justify-center
    shadow-[0_0_20px_rgba(37,99,235,0.12)]
  "
>
          <ArrowLeftRight
            size={16}
            className="text-blue-400"
          />
        </div>

        {/* City 2 */}
        <CustomSelect
          value={cityTwo}
          onChange={setCityTwo}
          options={cities}
          placeholder="Select City"
        />

      </div>
    </div>
  );
}

export default CitySelector;