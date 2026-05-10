import { Shield, Key, Eye, EyeOff, Save, Database, BrainCircuit, Globe, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Switch } from "@/src/components/ui/switch";
import { Label } from "@/src/components/ui/label";
import { useStore } from "@/src/lib/store";
import { useState } from "react";

export function SettingsPage() {
  const { settings, updateSettings } = useStore();
  const [showKeys, setShowKeys] = useState(false);

  // Simple validation logic
  const isGeminiValid = (key: string) => {
    if (!key) return null;
    return /^[A-Za-z0-9_-]{30,60}$/.test(key);
  };

  const isAmadeusValid = (key: string) => {
    if (!key) return null;
    return /^[A-Za-z0-9]{15,50}$/.test(key);
  };

  const geminiStatus = isGeminiValid(settings.geminiKey);
  const amadeusStatus = isAmadeusValid(settings.amadeusKey);

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 bg-zinc-950">
      <div className="flex items-end justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-white underline decoration-sky-500 decoration-4">Configuration Sky Dex</h1>
          <p className="text-zinc-500">Configurez vos services IA et APIs de voyage ici. Vos clés sont chiffrées localement.</p>
        </div>
        <Button onClick={() => setShowKeys(!showKeys)} variant="outline" className="border-zinc-800 text-zinc-400">
          {showKeys ? <EyeOff className="mr-2 w-4 h-4" /> : <Eye className="mr-2 w-4 h-4" />}
          {showKeys ? "Masquer les clés" : "Afficher les clés"}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* IA Settings */}
        <Card className="bg-zinc-900/30 border-zinc-800 shadow-none overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <BrainCircuit className="w-24 h-24 text-sky-500" />
          </div>
          <CardHeader>
            <div className="flex items-center gap-3">
              <BrainCircuit className="w-5 h-5 text-sky-500" />
              <CardTitle className="text-lg">Intelligence Artificielle</CardTitle>
            </div>
            <CardDescription className="text-zinc-500">Configurez les moteurs qui propulsent votre assistant Sky Intelligence.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs uppercase font-bold text-zinc-500 tracking-widest">Clé Gemini (Par défaut)</Label>
                  {geminiStatus === true && <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> FORMAT VALIDE</span>}
                  {geminiStatus === false && <span className="text-[10px] text-red-500 font-bold flex items-center gap-1"><AlertCircle className="w-3 h-3" /> FORMAT INCORECT</span>}
                </div>
                <div className="flex gap-2">
                  <Input 
                    type={showKeys ? "text" : "password"}
                    value={settings.geminiKey}
                    onChange={(e) => updateSettings({ geminiKey: e.target.value })}
                    placeholder="Saisissez votre clé Google AI Studio..."
                    className={`bg-zinc-950 border-zinc-800 focus:border-sky-500/50 font-mono text-xs ${
                      geminiStatus === false ? "border-red-500/50 focus:border-red-500" : ""
                    }`}
                  />
                  {geminiStatus === true ? (
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-3">PRÊT</Badge>
                  ) : (
                    <Badge variant="outline" className="bg-zinc-500/10 text-zinc-500 border-zinc-500/20 px-3 opacity-50">INVALIDE</Badge>
                  )}
                </div>
                {geminiStatus === false && <p className="text-[10px] text-red-500/70">La clé doit être une chaîne alphanumérique de 30 à 60 caractères.</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-xs uppercase font-bold text-zinc-500 tracking-widest">Ollama (Local)</Label>
                <div className="flex items-center justify-between p-3 bg-zinc-950 rounded-lg border border-zinc-800">
                  <div className="space-y-0.5">
                    <div className="text-sm font-bold text-zinc-300">Activer Ollama en local</div>
                    <div className="text-[10px] text-zinc-500 uppercase">Utilise llama3 pour plus de confidentialité</div>
                  </div>
                  <Switch checked={true} disabled />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Travel APIs */}
        <Card className="bg-zinc-900/30 border-zinc-800 shadow-none overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Globe className="w-24 h-24 text-emerald-500" />
          </div>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-emerald-500" />
              <CardTitle className="text-lg">APIs de Voyage</CardTitle>
            </div>
            <CardDescription className="text-zinc-500">Connectez vos plateformes de réservation (GDS, NDC, Aggregated).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs uppercase font-bold text-zinc-500 tracking-widest">Clé Amadeus Service</Label>
                  {amadeusStatus === true && <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> FORMAT VALIDE</span>}
                  {amadeusStatus === false && <span className="text-[10px] text-red-500 font-bold flex items-center gap-1"><AlertCircle className="w-3 h-3" /> FORMAT INCORECT</span>}
                </div>
                <Input 
                  type={showKeys ? "text" : "password"}
                  value={settings.amadeusKey}
                  onChange={(e) => updateSettings({ amadeusKey: e.target.value })}
                  placeholder="Amadeus API Key..."
                  className={`bg-zinc-950 border-zinc-800 focus:border-emerald-500/50 font-mono text-xs ${
                    amadeusStatus === false ? "border-red-500/50 focus:border-red-500" : ""
                  }`}
                />
                {amadeusStatus === false && <p className="text-[10px] text-red-500/70">La clé Amadeus doit être une chaîne alphanumérique.</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Regional Settings */}
        <Card className="bg-zinc-900/30 border-zinc-800 shadow-none">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Database className="w-5 h-5 text-amber-500" />
              <CardTitle className="text-lg">Préférences Régionales</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-xs uppercase font-bold text-zinc-500 tracking-widest">Devise de l'agence</Label>
              <select 
                className="w-full bg-zinc-950 border border-zinc-800 rounded-md h-10 px-3 text-sm text-zinc-300 focus:border-sky-500 outline-none"
                value={settings.currency}
                onChange={(e) => updateSettings({ currency: e.target.value })}
              >
                <option value="XOF">Franc CFA (XOF)</option>
                <option value="EUR">Euro (€)</option>
                <option value="USD">Dollar ($)</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase font-bold text-zinc-500 tracking-widest">Mode Débutant (Guidé)</Label>
              <div className="flex items-center gap-4 h-10">
                <Switch 
                  checked={settings.beginnerMode} 
                  onCheckedChange={(val) => updateSettings({ beginnerMode: val })}
                />
                <span className="text-sm font-medium text-zinc-400">Activé (Recommandé)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="pt-8 border-t border-zinc-800 flex justify-end">
        <Button className="bg-sky-500 hover:bg-sky-600 text-white font-bold h-12 px-8 rounded-xl shadow-lg shadow-sky-500/20">
          <Save className="mr-2 w-4 h-4" /> ENREGISTRER TOUT
        </Button>
      </div>
    </div>
  );
}
