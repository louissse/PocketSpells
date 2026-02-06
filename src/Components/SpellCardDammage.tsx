import type { SpellDetail } from "../types/spell";
import { getDamageTypeColor } from "../lib/utils";
import RangedAttackIcon from "./ui/RangedAttackIcon";
import MeleeAttackIcon from "./ui/MeleeAttackIcon";
import FlameIcon from "./ui/FlameIcon";
import AreaOfEffectIcon from "./ui/AreaOfEffectIcon";
import VerbalIcon from "./ui/VerbalIcon";
import SomaticIcon from "./ui/SomaticIcon";
import MaterialIcon from "./ui/MaterialIcon";

export default function SpellCardDammage(spell: SpellDetail) {
  const iconColor = spell.damage
    ? getDamageTypeColor(spell.damage.damage_type.index)
    : "text-orange-400";

  return (
    <div className="flex flex-row justify-between">
      <div className="flex flex-row items-center justify-start gap-3 text-xs text-slate-700">
        {spell.damage && (
          <div className="flex flex-row items-center gap-1">
            {spell.attack_type === "ranged" ? (
              <RangedAttackIcon className={`h-4 w-4 ${iconColor}`} />
            ) : spell.attack_type === "melee" ? (
              <MeleeAttackIcon className={`h-4 w-4 ${iconColor}`} />
            ) : (
              <FlameIcon className={`h-4 w-4 ${iconColor}`} />
            )}
            <p className="text-xs text-slate-700">
              {
                Object.values(
                  spell.damage.damage_at_slot_level ||
                    spell.damage.damage_at_character_level,
                )[0]
              }
            </p>
          </div>
        )}
        {spell.area_of_effect && (
          <div className="flex flex-row items-center gap-1">
            <AreaOfEffectIcon areaType={spell.area_of_effect.type} />
            <p>{spell.area_of_effect.size + "ft"}</p>
          </div>
        )}

        {spell.dc && (
          <div className="flex flex-row items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 640 640"
              className="h-4 w-4"
              fill="currentColor"
            >
              <path d="M288.4 55.8C308 44.7 332 44.7 351.5 55.8L543.5 164.6C563.5 176 575.9 197.2 575.9 220.3L575.9 435.9C575.9 458.9 563.5 480.2 543.5 491.6L351.5 600.4C331.9 611.5 307.9 611.5 288.4 600.4L96.4 491.5C76.4 480.1 64 458.8 64 435.8L64 220.2C64 197.2 76.4 175.9 96.4 164.5L288.4 55.8zM340.4 129C331 113.8 309 113.8 299.6 129L223 252.7L137.6 206.4L133.8 204.8C124.9 202.1 115 205.9 110.4 214.4C105.8 222.9 108 233.3 115.1 239.2L118.4 241.5L201.8 286.7L127.2 407.3C119.3 420.2 125 437 139 442.4L300 504.3L300 544C300 555 309 564 320 564C331 564 340 555 340 544L340 504.3L501 442.4C515 437 520.7 420.2 512.8 407.4L438.1 286.8L521.5 241.6C531.2 236.3 534.8 224.2 529.6 214.5C524.4 204.8 512.2 201.2 502.5 206.4L417 252.7L340.4 129zM293.4 458.9L171.4 412L225.9 323.9L293.4 458.9zM468.6 412L346.6 458.9L414.1 323.9L468.6 412zM383.3 296L320 422.6L256.7 296L383.3 296zM372 256L267.9 256L319.9 172L371.9 256z" />
            </svg>
            <p>{spell.dc.dc_type.name}</p>
          </div>
        )}
      </div>

      <div id="components" className="flex flex-row gap-2">
        {spell.components.map((component) => {
          let icon = <></>;
          switch (component) {
            case "V":
              icon = <VerbalIcon />;
              break;
            case "S":
              icon = <SomaticIcon />;
              break;
            case "M":
              icon = <MaterialIcon />;
              break;
            default:
              break;
          }
          return (
            <div key={component} className="flex flex-row">
              {icon}
              <span className="text-xs text-slate-700">{component}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
