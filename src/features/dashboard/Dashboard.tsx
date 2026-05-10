import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { motion } from "motion/react";
import { TrendingUp, Users, CreditCard, Activity, ArrowUpRight, Plane } from "lucide-react";

const salesData = [
  { name: 'Jan', sales: 4000, bookings: 24 },
  { name: 'Feb', sales: 3000, bookings: 18 },
  { name: 'Mar', sales: 5000, bookings: 32 },
  { name: 'Apr', sales: 2780, bookings: 21 },
  { name: 'May', sales: 1890, bookings: 12 },
  { name: 'Jun', sales: 2390, bookings: 15 },
  { name: 'Jul', sales: 3490, bookings: 22 },
];

export function Dashboard() {
  return (
    <div className="p-8 space-y-8 bg-zinc-950">
      {/* Welcome Section */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1 font-sans">Workspace Intelligente</h1>
          <p className="text-zinc-500 font-medium text-sm">Performance opérationnelle au 10 Mai 2026</p>
        </div>
        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-4 py-1.5 text-[10px] uppercase font-bold tracking-widest">
          LIVE DATA SYNCED
        </Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Ventes Totales", value: "48,250 €", icon: CreditCard, trend: "+12.5%", color: "text-sky-500" },
          { label: "Nouveaux Clients", value: "+14", icon: Users, trend: "+3.2%", color: "text-emerald-500" },
          { label: "Taux Conversion", value: "24.2%", icon: TrendingUp, trend: "+1.8%", color: "text-zinc-400" },
          { label: "Dossiers Actifs", value: "32", icon: Plane, trend: "Stable", color: "text-sky-500" },
        ].map((stat, i) => (
          <Card key={i} className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm overflow-hidden group hover:border-zinc-700 transition-colors shadow-sm relative">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{stat.label}</CardTitle>
              <stat.icon className={`w-4 h-4 ${stat.color} opacity-50 group-hover:opacity-100 transition-opacity`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-mono tracking-tighter text-white">{stat.value}</div>
              <p className="text-[10px] text-zinc-600 mt-2 flex items-center gap-1 font-medium">
                <span className="text-emerald-500 font-bold">{stat.trend}</span>
                vs mois dernier
              </p>
            </CardContent>
            {/* Minimalist visual flair */}
            <div className={`absolute bottom-0 left-0 h-[1px] bg-zinc-700 w-0 group-hover:w-full transition-all duration-700 ${stat.color === 'text-sky-500' ? 'bg-sky-500' : ''}`} />
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-zinc-900/30 border-zinc-800 pb-6 border shadow-none">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-zinc-400">Revenue & Performance (2026)</CardTitle>
            <Button variant="ghost" size="sm" className="h-8 text-[10px] uppercase tracking-tighter border border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:text-white font-mono rounded">
              Exporter PDF <ArrowUpRight className="ml-2 w-3 h-3" />
            </Button>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#18181b" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#52525b', fontWeight: 500 }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#52525b', fontWeight: 500 }}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '8px', fontSize: '12px' }}
                  itemStyle={{ color: '#0ea5e9' }}
                />
                <Area type="monotone" dataKey="sales" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorSales)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/30 border-zinc-800 shadow-none">
          <CardHeader>
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-zinc-400">Répartition Destinations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {[
              { name: "Maldives", percentage: 45, color: "bg-sky-500" },
              { name: "Japon", percentage: 28, color: "bg-red-500" },
              { name: "Islande", percentage: 15, color: "bg-zinc-100" },
              { name: "Kenya", percentage: 12, color: "bg-emerald-500" },
            ].map((item, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-tight text-zinc-500">
                  <span>{item.name}</span>
                  <span className="font-mono text-white/80">{item.percentage}%</span>
                </div>
                <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percentage}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className={`h-full ${item.color}`}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Activity / Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
        <Card className="bg-zinc-900/30 border-zinc-800 border-dashed shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-500 flex items-center gap-2">
              <Activity className="w-3 h-3" /> Critical Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              "Vol AF24 (CDG-JFK) - Changement de porte",
              "Visa expiré pour Client #2490 - Alerte CRM",
              "Nouvelle demande d'itinéraire premium - Maldives 15j"
            ].map((alert, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-zinc-900/50 rounded-xl border border-zinc-800 text-[11px] text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 transition-colors cursor-default">
                <div className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0" />
                {alert}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* AI Insight Box */}
        <div className="p-6 bg-zinc-900/40 border border-sky-500/10 rounded-2xl flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity translate-x-4 -translate-y-4">
            <Sparkles className="w-24 h-24 text-sky-500" />
          </div>
          <div className="flex items-center gap-2 mb-4 relative">
            <Sparkles className="w-4 h-4 text-sky-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-sky-500">Sky Intelligence Insight</span>
          </div>
          <p className="text-sm text-zinc-300 italic relative leading-relaxed">
            "Le volume de réservations vers le **Japon** a augmenté de **22%** cette semaine. Suggestion : Créez une campagne flash 'Hokkaido Winter' pour vos clients segmentés 'Premium' d'ici vendredi."
          </p>
          <Button variant="link" className="text-sky-500 text-[11px] p-0 h-auto justify-start mt-4 font-mono font-bold tracking-tight hover:text-sky-400 relative">
            VOIR L'ANALYSE COMPLÈTE →
          </Button>
        </div>
      </div>
    </div>
  );
}

function Sparkles(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  );
}
