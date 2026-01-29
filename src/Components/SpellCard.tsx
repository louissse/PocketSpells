import type { SpellDetail } from "../types/spell";
import SchoolIcon from "./ui/SchoolIcon";

export default function SpellCard(spell: SpellDetail) {
  return (
    <div className="flex min-h-20 flex-col justify-between rounded border border-slate-900/30 bg-linear-to-b from-rose-50 to-slate-100 p-2 shadow-xs">
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
