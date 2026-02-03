import type { SpellDetail } from "../types/spell";
import SchoolIcon from "./ui/SchoolIcon";

export default function SpellCard(spell: SpellDetail) {
  let borderClass = "border-slate-900/30";
  switch (spell.school.index.toLowerCase()) {
    case "abjuration":
      borderClass = "border-cyan-600/70";
      break;
    case "conjuration":
      borderClass = "border-violet-700/70";
      break;
    case "divination":
      borderClass = "border-sky-700/70";
      break;
    case "enchantment":
      borderClass = "border-fuchsia-700/50";
      break;
    case "evocation":
      borderClass = "border-orange-500/50";
      break;
    case "illusion":
      borderClass = "border-red-700/50";
      break;
    case "necromancy":
      borderClass = "border-zinc-900/50";
      break;
    case "transmutation":
      borderClass = "border-lime-600/70";
  }

  return (
    <div
      className={
        borderClass +
        " flex min-h-20 flex-col justify-between rounded border bg-linear-to-b from-rose-50/30 to-pink-100/30 p-2 shadow-xs"
      }
    >
      <div className="flex items-center justify-between gap-2">
        <p className="flex items-center gap-1 font-semibold">
          <SchoolIcon size={18} school={spell.school.index} />
          {spell.name}
        </p>

        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-linear-to-br from-slate-700 to-gray-900">
          <p className="text-xs font-bold text-white">{spell.level}</p>
        </div>
      </div>

      <ul className="flex flex-row flex-wrap gap-1">
        {spell.classes.map((classes) => (
          <li className="text-xs font-bold text-stone-600" key={classes.index}>
            {classes.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
