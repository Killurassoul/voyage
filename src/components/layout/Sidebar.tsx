import { 
  LayoutDashboard, 
  Search, 
  Users, 
  Briefcase, 
  Settings, 
  HelpCircle, 
  LogOut,
  Sparkles
} from "lucide-react";
import { useStore } from "@/src/lib/store";
import { Button } from "@/src/components/ui/button";
import { Separator } from "@/src/components/ui/separator";

export function Sidebar() {
  const { activeTab, setActiveTab, toggleAIPanel } = useStore();

  const menuItems = [
    { id: "search", icon: Search, label: "Recherche" },
    { id: "dashboard", icon: LayoutDashboard, label: "Performance" },
    { id: "crm", icon: Users, label: "Clients CRM" },
    { id: "bookings", icon: Briefcase, label: "Dossiers Voyage" },
    { id: "settings", icon: Settings, label: "Paramètres" },
  ];

  return (
    <div className="w-64 h-full bg-zinc-950 border-r border-zinc-800 flex flex-col">
      {/* Logo */}
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-sky-500/20">
            S
          </div>
          <div>
            <h1 className="font-bold text-white tracking-tight">Sky Dex</h1>
            <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold">Afrique v1.0</p>
          </div>
        </div>
      </div>

      {/* Main Menu */}
      <nav className="flex-1 px-3 space-y-1 mt-4">
        {menuItems.map((item) => (
          <Button
            key={item.id}
            variant={activeTab === item.id ? "secondary" : "ghost"}
            className={`w-full justify-start gap-3 h-11 rounded-xl px-4 transition-all ${
              activeTab === item.id 
                ? "bg-zinc-900 text-sky-400 border border-zinc-800" 
                : "text-zinc-500 hover:text-white hover:bg-zinc-900/50"
            }`}
            onClick={() => setActiveTab(item.id as any)}
          >
            <item.icon className={`w-4 h-4 ${activeTab === item.id ? "text-sky-500" : ""}`} />
            <span className="font-medium text-sm">{item.label}</span>
          </Button>
        ))}

        <Separator className="bg-zinc-800 my-6" />

        <Button
          variant="ghost"
          className="w-full justify-start gap-3 h-11 rounded-xl px-4 text-sky-500 hover:bg-sky-500/10 hover:text-sky-400 group"
          onClick={toggleAIPanel}
        >
          <Sparkles className="w-4 h-4 animate-pulse group-hover:scale-110 transition-transform" />
          <span className="font-medium text-sm">Sky AI Assistant</span>
        </Button>
      </nav>

      {/* Footer Actions */}
      <div className="p-4 space-y-1">
        <Button variant="ghost" className="w-full justify-start gap-3 h-10 text-zinc-500 hover:text-white px-3">
          <HelpCircle className="w-4 h-4" />
          <span className="text-sm">Aide en ligne</span>
        </Button>
        <Separator className="bg-zinc-800 my-2" />
        <Button variant="ghost" className="w-full justify-start gap-3 h-10 text-red-500/70 hover:text-red-500 hover:bg-red-500/5 px-3">
          <LogOut className="w-4 h-4" />
          <span className="text-sm">Déconnexion</span>
        </Button>
      </div>
    </div>
  );
}
