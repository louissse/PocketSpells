import type { SpellDetail } from "../types/spell";
import SchoolIcon from "./ui/SchoolIcon";

export default function SpellCard(spell: SpellDetail) {
  return (
    <div
      className="p-2 bg-linear-to-b from-rose-50 to-slate-100 border border-slate-900/30 rounded shadow-xs min-h-20 flex flex-col justify-between
"
    >
      <div className="flex gap-2 items-center justify-between">
        <p className="font-semibold flex items-center gap-1">
          <SchoolIcon size={18} school={spell.school.index} />
          {spell.name}
        </p>

        <div
          className="w-5 h-5 rounded-full bg-linear-to-br from-slate-700 to-gray-900 flex items-center justify-center
"
        >
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
