import { useState } from "react";
import type { SpellDetail } from "../types/spell";
import {
  CUSTOM_SPELL_AOE_TYPES,
  CUSTOM_SPELL_CLASSES,
  CUSTOM_SPELL_DAMAGE_TYPES,
  CUSTOM_SPELL_SAVING_THROWS,
  CUSTOM_SPELL_SCHOOLS,
  createEmptyCustomSpellDraft,
  customSpellDraftToSpellInput,
  customSpellToDraft,
  validateCustomSpellDraft,
  type CustomSpellDraft,
  type CustomSpellDraftErrors,
  type CustomSpellInput,
} from "../lib/customSpellDraft";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CustomSpellFormProps {
  initialValues?: SpellDetail;
  onSubmit: (data: CustomSpellInput) => void;
  onCancel: () => void;
  onDelete?: () => void;
}

const labelClass = "block text-sm font-medium text-gray-700 mb-1";
const sectionClass = "flex flex-col gap-1";

export default function CustomSpellForm({
  initialValues,
  onSubmit,
  onCancel,
  onDelete,
}: CustomSpellFormProps) {
  const [form, setForm] = useState<CustomSpellDraft>(
    initialValues
      ? customSpellToDraft(initialValues)
      : createEmptyCustomSpellDraft(),
  );
  const [errors, setErrors] = useState<CustomSpellDraftErrors>({});

  function set<K extends keyof CustomSpellDraft>(
    key: K,
    value: CustomSpellDraft[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function toggleArrayItem(key: "components" | "classes", value: string) {
    setForm((prev) => {
      const arr = prev[key] as string[];
      return {
        ...prev,
        [key]: arr.includes(value)
          ? arr.filter((v) => v !== value)
          : [...arr, value],
      };
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validation = validateCustomSpellDraft(form);
    setErrors(validation.errors);
    if (!validation.valid) return;

    onSubmit(customSpellDraftToSpellInput(form));
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-6 pb-8">
      {/* Name */}
      <div className={sectionClass}>
        <label className={labelClass}>
          Name <span className="text-rose-500">*</span>
        </label>
        <Input
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          placeholder="Dissonant Whispers"
        />
        {errors.name && <p className="text-xs text-rose-500">{errors.name}</p>}
      </div>

      {/* Level + School */}
      <div className="grid grid-cols-2 gap-3">
        <div className={sectionClass}>
          <label className={labelClass}>Level</label>
          <Select
            value={String(form.level)}
            onValueChange={(v) => set("level", Number(v))}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Cantrip</SelectItem>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((l) => (
                <SelectItem key={l} value={String(l)}>
                  Level {l}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className={sectionClass}>
          <label className={labelClass}>School</label>
          <Select value={form.school} onValueChange={(v) => set("school", v)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CUSTOM_SPELL_SCHOOLS.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Casting time + Duration */}
      <div className="grid grid-cols-2 gap-3">
        <div className={sectionClass}>
          <label className={labelClass}>
            Casting time <span className="text-rose-500">*</span>
          </label>
          <Input
            value={form.casting_time}
            onChange={(e) => set("casting_time", e.target.value)}
            placeholder="1 action"
          />
          {errors.casting_time && (
            <p className="text-xs text-rose-500">{errors.casting_time}</p>
          )}
        </div>
        <div className={sectionClass}>
          <label className={labelClass}>
            Duration <span className="text-rose-500">*</span>
          </label>
          <Input
            value={form.duration}
            onChange={(e) => set("duration", e.target.value)}
            placeholder="Instantaneous"
          />
          {errors.duration && (
            <p className="text-xs text-rose-500">{errors.duration}</p>
          )}
        </div>
      </div>

      {/* Range */}
      <div className={sectionClass}>
        <label className={labelClass}>Range</label>
        <Input
          value={form.range}
          onChange={(e) => set("range", e.target.value)}
          placeholder="60 feet"
        />
      </div>

      {/* Components */}
      <div className={sectionClass}>
        <label className={labelClass}>Components</label>
        <div className="flex gap-4">
          {["V", "S", "M"].map((c) => (
            <label key={c} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.components.includes(c)}
                onChange={() => toggleArrayItem("components", c)}
                className="accent-rose-500"
              />
              {c}
            </label>
          ))}
        </div>
        {form.components.includes("M") && (
          <Input
            className="mt-2"
            value={form.material}
            onChange={(e) => set("material", e.target.value)}
            placeholder="Material component description..."
          />
        )}
      </div>

      {/* Concentration + Ritual */}
      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.concentration}
            onChange={(e) => set("concentration", e.target.checked)}
            className="accent-rose-500"
          />
          Concentration
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.ritual}
            onChange={(e) => set("ritual", e.target.checked)}
            className="accent-rose-500"
          />
          Ritual
        </label>
      </div>

      {/* Description */}
      <div className={sectionClass}>
        <label className={labelClass}>Description</label>
        <Textarea
          className="min-h-24 resize-y"
          value={form.desc}
          onChange={(e) => set("desc", e.target.value)}
          placeholder="Describe the spell effect..."
        />
      </div>

      {/* Higher levels */}
      <div className={sectionClass}>
        <label className={labelClass}>At Higher Levels</label>
        <Textarea
          className="min-h-16 resize-y"
          value={form.higher_level}
          onChange={(e) => set("higher_level", e.target.value)}
          placeholder="What happens when cast at higher spell levels..."
        />
      </div>

      {/* Damage type + dice */}
      <div className="grid grid-cols-2 gap-3">
        <div className={sectionClass}>
          <label className={labelClass}>Damage type</label>
          <Select
            value={form.damage_type}
            onValueChange={(v) => set("damage_type", v === "none" ? "" : v)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="None" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {CUSTOM_SPELL_DAMAGE_TYPES.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {form.damage_type && (
          <div className={sectionClass}>
            <label className={labelClass}>Damage dice</label>
            <Input
              value={form.damage_dice}
              onChange={(e) => set("damage_dice", e.target.value)}
              placeholder="2d8"
            />
          </div>
        )}
      </div>

      {/* Area of effect */}
      <div className="grid grid-cols-2 gap-3">
        <div className={sectionClass}>
          <label className={labelClass}>Area of effect</label>
          <Select
            value={form.aoe_type}
            onValueChange={(v) => set("aoe_type", v === "none" ? "" : v)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="None" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {CUSTOM_SPELL_AOE_TYPES.map((a) => (
                <SelectItem key={a} value={a}>
                  {a}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {form.aoe_type && (
          <div className={sectionClass}>
            <label className={labelClass}>Size (ft)</label>
            <Input
              type="number"
              value={form.aoe_size}
              onChange={(e) => set("aoe_size", e.target.value)}
              placeholder="20"
              min={0}
            />
          </div>
        )}
      </div>

      {/* Saving throw */}
      <div className={sectionClass}>
        <label className={labelClass}>Saving throw</label>
        <Select
          value={form.saving_throw}
          onValueChange={(v) => set("saving_throw", v === "none" ? "" : v)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="None" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            {CUSTOM_SPELL_SAVING_THROWS.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* DC Success - kun vist hvis saving throw er valgt */}
      {form.saving_throw && (
        <div className={sectionClass}>
          <label className={labelClass}>DC Success</label>
          <Select
            value={form.dc_success}
            onValueChange={(v) => set("dc_success", v)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select outcome..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="half">Half damage</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Classes */}
      <div className={sectionClass}>
        <label className={labelClass}>Classes</label>
        <div className="flex flex-wrap gap-3">
          {CUSTOM_SPELL_CLASSES.map((c) => (
            <label key={c} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.classes.includes(c)}
                onChange={() => toggleArrayItem("classes", c)}
                className="accent-rose-500"
              />
              {c}
            </label>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-md border border-gray-300 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 rounded-md bg-rose-500 py-2 text-sm font-semibold text-white hover:bg-rose-600"
        >
          {initialValues ? "Save changes" : "Add to Pocket"}
        </button>
      </div>

      {/* Delete — only shown when editing */}
      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          className="w-full rounded-md border border-rose-200 py-2 text-sm font-medium text-rose-500 hover:bg-rose-50"
        >
          Delete spell
        </button>
      )}
    </form>
  );
}
