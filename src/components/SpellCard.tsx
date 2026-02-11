import type { SpellDetail } from "../types/spell";
import SpellCardDammage from "./SpellCardDammage";
import SpellCardDetails from "./SpellCardDetails";
//import SchoolIcon from "./ui/SchoolIcon";
import { useState } from "react";
import ConcentrationIcon from "./ui/ConcentrationIcon";
import RitualIcon from "./ui/RitualIcon copy";

export default function SpellCard(spell: SpellDetail) {
  let borderClass = "border-slate-900/30";
  let schoolTextClass = "text-slate-900";

  switch (spell.school.index.toLowerCase()) {
    case "abjuration":
      borderClass = "border-cyan-600/70";
      schoolTextClass = "text-school-abjuration";
      break;
    case "conjuration":
      borderClass = "border-violet-700/70";
      schoolTextClass = "text-school-conjuration";
      break;
    case "divination":
      borderClass = "border-sky-700/70";
      schoolTextClass = "text-school-divination";
      break;
    case "enchantment":
      borderClass = "border-fuchsia-700/50";
      schoolTextClass = "text-school-enchantment";
      break;
    case "evocation":
      borderClass = "border-orange-500/50";
      schoolTextClass = "text-school-evocation";
      break;
    case "illusion":
      borderClass = "border-red-700/50";
      schoolTextClass = "text-school-illusion";
      break;
    case "necromancy":
      borderClass = "border-zinc-900/50";
      schoolTextClass = "text-school-necromancy";
      break;
    case "transmutation":
      borderClass = "border-lime-600/70";
      schoolTextClass = "text-school-transmutation";
  }

  const [seeDetails, setSeeDetails] = useState(false);

  function toggleDetails() {
    const newSetSeeDetails = !seeDetails;
    setSeeDetails(newSetSeeDetails);
  }

  return (
    <div
      onClick={toggleDetails}
      className={
        borderClass +
        " flex min-h-20 flex-col justify-between gap-2 rounded border bg-linear-to-b from-rose-50/30 to-pink-100/30 p-2 shadow-xs"
      }
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-row items-center gap-2">
          <p className="flex gap-1 font-semibold">
            {/* <SchoolIcon size={18} school={spell.school.index} /> */}
            {spell.name}
          </p>
          <ul className="flex flex-row gap-3">
            <li className="flex flex-row items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 640 640"
                className="h-4 w-4 text-slate-700"
                fill="currentColor"
              >
                <path d="M320 64C461.4 64 576 178.6 576 320C576 461.4 461.4 576 320 576C178.6 576 64 461.4 64 320C64 178.6 178.6 64 320 64zM296 184L296 320C296 328 300 335.5 306.7 340L402.7 404C413.7 411.4 428.6 408.4 436 397.3C443.4 386.2 440.4 371.4 429.3 364L344 307.2L344 184C344 170.7 333.3 160 320 160C306.7 160 296 170.7 296 184z" />
              </svg>
              <p className="text-xs text-slate-700">{spell.casting_time}</p>
            </li>
            {spell.concentration && (
              <li>
                <ConcentrationIcon className="h-4 w-4 text-slate-700" />
              </li>
            )}
            {spell.ritual && (
              <li className="flex flex-row gap-1">
                <RitualIcon className="h-4 w-4 text-slate-700" />{" "}
                <span className="text-xs text-slate-700">Ritual</span>
              </li>
            )}
          </ul>
        </div>

        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-linear-to-br from-slate-700 to-gray-900">
          <p className="text-xs font-bold text-white">{spell.level}</p>
        </div>
      </div>

      <SpellCardDammage {...spell} />

      <div
        id="spell-details"
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          seeDetails ? "max-h-600 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <SpellCardDetails {...spell} />
      </div>
      <div className="flex flex-row justify-between">
        <ul className="flex flex-row flex-wrap gap-1">
          {spell.classes.map((classes) => (
            <li
              className="text-xs font-bold text-slate-600"
              key={classes.index}
            >
              {classes.name}
            </li>
          ))}
        </ul>
        <p className={"text-xs font-bold " + schoolTextClass}>
          {spell.school.name}
        </p>
      </div>
    </div>
  );
}
