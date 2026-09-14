import { describe, expect, it } from "vitest";
import type { SpellDetail } from "../types/spell";
import {
  createEmptyCustomSpellDraft,
  customSpellDraftToSpellInput,
  customSpellToDraft,
  validateCustomSpellDraft,
} from "./customSpellDraft";

const customSpell: SpellDetail = {
  index: "custom-moon-snare",
  name: "Moon Snare",
  desc: ["Silver vines restrain one creature."],
  higher_level: ["One extra target for each slot above 1st."],
  range: "60 feet",
  components: ["V", "S", "M"],
  material: "A silver thread",
  ritual: false,
  duration: "Concentration, up to 1 minute",
  concentration: true,
  casting_time: "1 action",
  level: 1,
  attack_type: "",
  damage: {
    damage_type: {
      index: "radiant",
      name: "Radiant",
      url: "",
    },
    damage_at_slot_level: {
      custom: "1d8",
    },
    damage_at_character_level: {},
  },
  area_of_effect: {
    type: "sphere",
    size: 10,
  },
  dc: {
    dc_type: {
      index: "dex",
      name: "DEX",
      url: "",
    },
    dc_success: "none",
    desc: "",
  },
  school: {
    index: "evocation",
    name: "Evocation",
    url: "",
  },
  classes: [
    {
      index: "ranger",
      name: "Ranger",
      url: "",
    },
  ],
  subclasses: [],
  url: "",
  updated_at: "2026-09-14T00:00:00.000Z",
  custom: true,
};

describe("custom spell draft", () => {
  it("creates the same empty draft defaults the form used before", () => {
    expect(createEmptyCustomSpellDraft()).toEqual({
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
    });
  });

  it("converts a saved custom spell into an editable draft", () => {
    expect(customSpellToDraft(customSpell)).toEqual({
      name: "Moon Snare",
      level: 1,
      school: "Evocation",
      casting_time: "1 action",
      duration: "Concentration, up to 1 minute",
      range: "60 feet",
      concentration: true,
      ritual: false,
      components: ["V", "S", "M"],
      material: "A silver thread",
      desc: "Silver vines restrain one creature.",
      higher_level: "One extra target for each slot above 1st.",
      damage_type: "Radiant",
      damage_dice: "1d8",
      aoe_type: "sphere",
      aoe_size: "10",
      saving_throw: "DEX",
      dc_success: "none",
      classes: ["Ranger"],
    });
  });

  it("validates the required draft fields", () => {
    const result = validateCustomSpellDraft({
      ...createEmptyCustomSpellDraft(),
      name: " ",
      casting_time: "",
      duration: "",
    });

    expect(result).toEqual({
      valid: false,
      errors: {
        name: "Name is required",
        casting_time: "Casting time is required",
        duration: "Duration is required",
      },
    });
  });

  it("converts a draft into the spell input shape used for saving", () => {
    const input = customSpellDraftToSpellInput({
      ...customSpellToDraft(customSpell),
      name: " Moon Snare ",
      desc: "First paragraph\n\nSecond paragraph",
      higher_level: "Higher one\n\nHigher two",
    });

    expect(input).toEqual({
      name: "Moon Snare",
      level: 1,
      school: { index: "evocation", name: "Evocation", url: "" },
      casting_time: "1 action",
      duration: "Concentration, up to 1 minute",
      range: "60 feet",
      concentration: true,
      ritual: false,
      components: ["V", "S", "M"],
      material: "A silver thread",
      desc: ["First paragraph", "Second paragraph"],
      higher_level: ["Higher one", "Higher two"],
      attack_type: "",
      damage: {
        damage_type: { index: "radiant", name: "Radiant", url: "" },
        damage_at_slot_level: { custom: "1d8" },
        damage_at_character_level: {},
      },
      area_of_effect: { type: "sphere", size: 10 },
      dc: {
        dc_type: { index: "dex", name: "DEX", url: "" },
        dc_success: "none",
        desc: "",
      },
      classes: [{ index: "ranger", name: "Ranger", url: "" }],
      subclasses: [],
    });
  });
});
