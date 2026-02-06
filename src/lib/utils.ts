import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getDamageTypeColor = (damageTypeIndex: string): string => {
  const colorMap: { [key: string]: string } = {
    fire: "text-red-500",
    cold: "text-blue-400",
    acid: "text-green-500",
    lightning: "text-yellow-400",
    thunder: "text-purple-500",
    poison: "text-green-600",
    necrotic: "text-gray-800",
    radiant: "text-yellow-200",
    psychic: "text-pink-500",
    force: "text-indigo-500",
    piercing: "text-gray-600",
    slashing: "text-red-600",
    bludgeoning: "text-stone-600",
  };

  return colorMap[damageTypeIndex] || "text-orange-400";
};
