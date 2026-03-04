import { Sparkles, BookMarked } from "lucide-react";

type Tab = "spells" | "pocket";

interface BottomNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const tabs: {
  id: Tab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: "spells", label: "Spells", icon: Sparkles },
  { id: "pocket", label: "Pocket", icon: BookMarked },
];

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="border-border pb-safe fixed right-0 bottom-0 left-0 z-40 border-t bg-white">
      <div className="flex h-16 items-stretch">
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`flex flex-1 flex-col items-center justify-center gap-1 transition-colors ${
                isActive
                  ? "text-rose-500"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon
                className={`h-5 w-5 ${isActive ? "stroke-[2.5]" : "stroke-2"}`}
              />
              <span
                className={`text-xs font-medium ${isActive ? "font-semibold" : ""}`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
