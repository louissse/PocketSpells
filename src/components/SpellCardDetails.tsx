import type { SpellDetail } from "../types/spell";
import RangedAttackIcon from "./ui/RangedAttackIcon";
import MeleeAttackIcon from "./ui/MeleeAttackIcon";
import { getDamageTypeColor } from "../lib/utils";

export default function SpellCardDetails(spell: SpellDetail) {
  return (
    <div className="text-left text-sm">
      <p>
        <span className="font-bold text-slate-600">Range: </span> {spell.range}
      </p>
      <p>
        <span className="font-bold text-slate-600">Duration: </span>
        {spell.duration}
      </p>
      {spell.damage && (
        <p>
          <span className="font-bold text-slate-600">Dammage: </span>
          <span
            className={
              getDamageTypeColor(spell.damage.damage_type.index) + " font-bold"
            }
          >
            {
              Object.values(
                spell.damage.damage_at_slot_level ||
                  spell.damage.damage_at_character_level,
              )[0]
            }{" "}
            {spell.damage.damage_type.name}
          </span>
        </p>
      )}
      <p>
        {spell.dc && (
          <div>
            <span className="font-bold text-slate-600">Save: </span>
            <span>
              {spell.dc.dc_type.name} {" Save"} {" (Success:"}{" "}
              {spell.dc.dc_success}
              {" damage)"}
            </span>
          </div>
        )}
        {spell.attack_type && (
          <div>
            <span className="font-bold text-slate-600">Attack: </span>
            <span className="capitalize">
              {spell.attack_type === "ranged" ? (
                <RangedAttackIcon className="inline h-4 w-4 text-slate-600" />
              ) : spell.attack_type === "melee" ? (
                <MeleeAttackIcon className="inline h-4 w-4 text-slate-600" />
              ) : null}{" "}
              {spell.attack_type}
            </span>
          </div>
        )}
      </p>
      {spell.material && (
        <p>
          <span className="font-bold text-slate-600">Materials: </span>
          {spell.material}
        </p>
      )}
      <div className="mt-4 h-fit">
        {spell.desc.map((paragraph, index) => (
          <p key={index} className="mb-2">
            {paragraph}
          </p>
        ))}
        {spell.higher_level.length !== 0 && (
          <>
            <p className="font-bold text-slate-600">
              Using a higher level spell slot:
            </p>
            {spell.higher_level.map((paragraph, index) => (
              <p key={index} className="mb-2">
                {paragraph}
              </p>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
