import type { SpellDetail } from "../types/spell";

export const CUSTOM_SPELL_SCHOOLS = [
  "Abjuration",
  "Conjuration",
  "Divination",
  "Enchantment",
  "Evocation",
  "Illusion",
  "Necromancy",
  "Transmutation",
];

export const CUSTOM_SPELL_DAMAGE_TYPES = [
  "Acid",
  "Bludgeoning",
  "Cold",
  "Fire",
  "Force",
  "Lightning",
  "Necrotic",
  "Piercing",
  "Poison",
  "Psychic",
  "Radiant",
  "Slashing",
  "Thunder",
];

export const CUSTOM_SPELL_SAVING_THROWS = [
  "STR",
  "DEX",
  "CON",
  "INT",
  "WIS",
  "CHA",
];

export const CUSTOM_SPELL_AOE_TYPES = [
  "Sphere",
  "Cube",
  "Cone",
  "Line",
  "Cylinder",
];

export const CUSTOM_SPELL_CLASSES = [
  "Bard",
  "Cleric",
  "Druid",
  "Paladin",
  "Ranger",
  "Sorcerer",
  "Warlock",
  "Wizard",
];

export type CustomSpellDraft = {
  name: string;
  level: number;
  school: string;
  casting_time: string;
  duration: string;
  range: string;
  concentration: boolean;
  ritual: boolean;
  components: string[];
  material: string;
  desc: string;
  higher_level: string;
  damage_type: string;
  damage_dice: string;
  aoe_type: string;
  aoe_size: string;
  saving_throw: string;
  dc_success: string;
  classes: string[];
};

export type CustomSpellInput = Omit<
  SpellDetail,
  "index" | "url" | "updated_at" | "custom"
>;

export type CustomSpellDraftErrors = Partial<
  Record<keyof CustomSpellDraft, string>
>;

export type CustomSpellDraftValidationResult = {
  valid: boolean;
  errors: CustomSpellDraftErrors;
};

export function createEmptyCustomSpellDraft(): CustomSpellDraft {
  return {
    name: "",
    level: 1,
    school: "Evocation",
    casting_time: "1 action",
    duration: "Instantaneous",
    range: "",
    concentration: false,
    ritual: false,
    components: [],
    material: "",
    desc: "",
    higher_level: "",
    damage_type: "",
    damage_dice: "",
    aoe_type: "",
    aoe_size: "",
    saving_throw: "",
    dc_success: "",
    classes: [],
  };
}

export function customSpellToDraft(spell: SpellDetail): CustomSpellDraft {
  return {
    name: spell.name,
    level: spell.level,
    school: spell.school.name,
    casting_time: spell.casting_time,
    duration: spell.duration,
    range: spell.range,
    concentration: spell.concentration,
    ritual: spell.ritual,
    components: spell.components ?? [],
    material: spell.material ?? "",
    desc: spell.desc?.join("\n\n") ?? "",
    higher_level: spell.higher_level?.join("\n\n") ?? "",
    damage_type: spell.damage?.damage_type?.name ?? "",
    damage_dice:
      Object.values(spell.damage?.damage_at_slot_level ?? {})[0] ??
      Object.values(spell.damage?.damage_at_character_level ?? {})[0] ??
      "",
    aoe_type: spell.area_of_effect?.type ?? "",
    aoe_size: spell.area_of_effect?.size
      ? String(spell.area_of_effect.size)
      : "",
    saving_throw: spell.dc?.dc_type?.index?.toUpperCase() ?? "",
    dc_success: spell.dc?.dc_success ?? "",
    classes: spell.classes?.map((c) => c.name) ?? [],
  };
}

export function validateCustomSpellDraft(
  draft: CustomSpellDraft,
): CustomSpellDraftValidationResult {
  const errors: CustomSpellDraftErrors = {};

  if (!draft.name.trim()) errors.name = "Name is required";
  if (!draft.casting_time.trim())
    errors.casting_time = "Casting time is required";
  if (!draft.duration.trim()) errors.duration = "Duration is required";

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function customSpellDraftToSpellInput(
  draft: CustomSpellDraft,
): CustomSpellInput {
  return {
    name: draft.name.trim(),
    level: draft.level,
    school: {
      index: draft.school.toLowerCase(),
      name: draft.school,
      url: "",
    },
    casting_time: draft.casting_time.trim(),
    duration: draft.duration.trim(),
    range: draft.range.trim(),
    concentration: draft.concentration,
    ritual: draft.ritual,
    components: draft.components,
    material: draft.material.trim(),
    desc: draft.desc.trim() ? draft.desc.trim().split("\n\n") : [],
    higher_level: draft.higher_level.trim()
      ? draft.higher_level.trim().split("\n\n")
      : [],
    attack_type: "",
    damage: draft.damage_type
      ? {
          damage_type: {
            index: draft.damage_type.toLowerCase(),
            name: draft.damage_type,
            url: "",
          },
          damage_at_slot_level: draft.damage_dice
            ? { custom: draft.damage_dice.trim() }
            : {},
          damage_at_character_level: {},
        }
      : undefined,
    area_of_effect:
      draft.aoe_type && draft.aoe_size
        ? { type: draft.aoe_type.toLowerCase(), size: Number(draft.aoe_size) }
        : undefined,
    dc: draft.saving_throw
      ? {
          dc_type: {
            index: draft.saving_throw.toLowerCase(),
            name: draft.saving_throw,
            url: "",
          },
          dc_success: draft.dc_success,
          desc: "",
        }
      : undefined,
    classes: draft.classes.map((c) => ({
      index: c.toLowerCase(),
      name: c,
      url: "",
    })),
    subclasses: [],
  };
}
