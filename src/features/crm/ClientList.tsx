import { useStore } from "@/src/lib/store";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/src/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { Badge } from "@/src/components/ui/badge";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { Search, Plus, Filter, MoreHorizontal } from "lucide-react";

export function ClientList() {
  const { clients } = useStore();

  return (
    <div className="p-8 space-y-6 bg-zinc-950">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1 font-sans">Base Clientèle CRM</h1>
          <p className="text-zinc-500 font-medium text-sm">Gestion des profils et enrichissement des préférences IA.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 text-xs font-bold uppercase tracking-widest px-4 h-9">
            <Filter className="mr-2 w-3 h-3" /> Filtres
          </Button>
          <Button className="bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs uppercase tracking-widest px-6 h-9 shadow-lg shadow-sky-500/20 shadow-sky-500/10">
            <Plus className="mr-2 w-4 h-4" /> Ajouter
          </Button>
        </div>
      </div>

      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-sky-500 transition-colors" />
        <Input 
          placeholder="Rechercher par nom, email, tag ou destination favorite..." 
          className="pl-12 bg-zinc-900/50 border-zinc-800 focus:border-sky-500/50 h-12 rounded-xl text-zinc-300 placeholder:text-zinc-700 transition-all font-medium"
        />
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/20 backdrop-blur-sm overflow-hidden shadow-2xl">
        <Table>
          <TableHeader className="bg-zinc-900/50 border-zinc-800">
            <TableRow className="border-zinc-800 hover:bg-transparent">
              <TableHead className="w-[300px] text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-black py-4">Profil Voyageur</TableHead>
              <TableHead className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-black">Segments & Préférences</TableHead>
              <TableHead className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-black text-right">LTV (Lifetime Value)</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.id} className="border-zinc-800 hover:bg-zinc-800/30 transition-colors cursor-pointer group">
                <TableCell className="py-5">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10 border border-zinc-700 transition-transform group-hover:scale-105 duration-300">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${client.name}`} />
                      <AvatarFallback className="bg-zinc-800 text-zinc-500">{client.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-0.5">
                      <div className="font-bold text-zinc-100 group-hover:text-sky-400 transition-colors tracking-tight">{client.name}</div>
                      <div className="text-[11px] text-zinc-500 font-mono lower-case opacity-70">{client.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1.5">
                    {client.preferences.map((pref, i) => (
                      <Badge key={i} variant="outline" className="bg-zinc-950 border-zinc-800 text-[9px] text-zinc-500 font-bold uppercase tracking-tighter px-2 py-0">
                        {pref}
                      </Badge>
                    ))}
                    <Badge variant="ghost" className="text-[9px] text-sky-500/50 font-bold hover:text-sky-500 cursor-pointer">+ Ajouter tag</Badge>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="font-mono text-white font-bold text-sm tracking-tighter">
                    {client.totalSpent.toLocaleString()} €
                  </div>
                  <div className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest mt-1 opacity-70">Top Tier</div>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" className="text-zinc-600 hover:text-white hover:bg-zinc-800 rounded-lg h-8 w-8">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
