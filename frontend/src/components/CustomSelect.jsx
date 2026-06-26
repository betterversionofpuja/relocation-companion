import { useState } from "react";
import { Combobox } from "@headlessui/react";
import {
    ChevronUpDownIcon,
    CheckIcon,
} from "@heroicons/react/24/solid";

function CustomSelect({
    value,
    onChange,
    options,
    placeholder,
}) {
    const [query, setQuery] = useState("");

    const selected = options.find(
        (option) => option.slug === value
    );

    const filteredOptions =
        query === ""
            ? options
            : options.filter((city) =>
                city.label
                    .toLowerCase()
                    .includes(query.toLowerCase())
            );

    return (
        <div className="relative w-full md:w-[240px]">
            <Combobox value={value} onChange={onChange}>
                <div className="relative">

                    <Combobox.Input
                        className="
    w-full
    h-12
    px-4
    rounded-2xl
    border
    border-blue-500/20
    bg-[#050816]/70
    backdrop-blur-xl
    text-white
    outline-none
    shadow-[0_0_20px_rgba(37,99,235,0.08)]
    hover:border-blue-500/40
    transition
  "
                        displayValue={(slug) => {
  const city = options.find((option) => option.slug === slug);
  return city ? city.label : "";
}}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder={placeholder}
                    />

                    <Combobox.Button className="absolute inset-y-0 right-3 flex items-center">
                        <ChevronUpDownIcon className="w-5 h-5 text-blue-400" />
                    </Combobox.Button>

                    <Combobox.Options
                        className="
              absolute
              mt-2
              w-full
              max-h-96
              overflow-auto
              rounded-2xl
              border
              border-blue-500/20
              bg-[#050816]
              shadow-xl
              z-50
            "
                    >
                        {filteredOptions.map((city) => (
                            <Combobox.Option
                                key={city.slug}
                                value={city.slug}
                                className={({ active }) =>
                                    `cursor-pointer px-4 py-3 flex items-center justify-between ${active
                                        ? "bg-blue-500/20"
                                        : ""
                                    }`
                                }
                            >
                                {({ selected }) => (
                                    <>
                                        <span className="text-white">
                                            {city.label}
                                        </span>

                                        {selected && (
                                            <CheckIcon className="w-5 h-5 text-blue-400" />
                                        )}
                                    </>
                                )}
                            </Combobox.Option>
                        ))}
                    </Combobox.Options>

                </div>
            </Combobox>
        </div>
    );
}

export default CustomSelect;