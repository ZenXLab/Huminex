import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Plug, Key, CreditCard, FileDown, Globe, Settings, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

const settingsNavItems = [
  { path: "/tenant/settings", label: "General", icon: Settings, exact: true },
  { path: "/tenant/settings/integrations", label: "Integrations", icon: Plug },
  { path: "/tenant/settings/api-keys", label: "API Keys", icon: Key },
  { path: "/tenant/settings/billing", label: "Billing & Plans", icon: CreditCard },
  { path: "/tenant/settings/export", label: "Data Export", icon: FileDown },
  { path: "/tenant/settings/domain", label: "Custom Domain", icon: Globe },
  { path: "/tenant/settings/widgets", label: "Widget Access", icon: LayoutGrid },
];

export const SettingsSubNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string, exact?: boolean) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-2 mb-6">
      <div className="flex items-center gap-1 overflow-x-auto">
        {settingsNavItems.map((item) => {
          const active = isActive(item.path, item.exact);
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200",
                active
                  ? "bg-[#005EEB] text-white shadow-sm"
                  : "text-[#6B7280] hover:bg-[#F7F9FC] hover:text-[#0F1E3A]"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
