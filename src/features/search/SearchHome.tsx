import { useState, useRef, useEffect } from "react";
import { Search, Plane, Hotel, Map, History, Sparkles, X, ArrowRight } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Card } from "@/src/components/ui/card";
import { motion, AnimatePresence } from "motion/react";
import { useStore } from "@/src/lib/store";

export function SearchHome() {
  const { settings, toggleAIPanel } = useStore();
  const [isFocused, setIsFocused] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const aiSuggestions = [
    { text: "Paris pour le week-end prochain", icon: "🗼" },
    { text: "Dakar en Business Class", icon: "✈️" },
    { text: "Tokyo au printemps", icon: "🌸" },
    { text: "New York pour Noël", icon: "🗽" },
    { text: "Safari au Kenya en Juillet", icon: "🦁" }
  ];

  const filteredSuggestions = query 
    ? aiSuggestions.filter(s => s.text.toLowerCase().includes(query.toLowerCase()))
    : aiSuggestions;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] p-6 bg-zinc-950">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl space-y-12 text-center"
      >
        {/* Hero Section */}
        <div className="space-y-4">
          <h1 className="text-5xl font-black tracking-tight text-white sm:text-6xl">
            Où partent vos <span className="text-sky-500">voyageurs</span> ?
          </h1>
          <p className="text-xl text-zinc-500 font-medium max-w-xl mx-auto">
            Recherchez des vols, hôtels ou utilisez l'assistant IA pour créer un itinéraire complet en quelques secondes.
          </p>
        </div>

        {/* Master Search Bar */}
        <div ref={containerRef} className="relative z-50">
          <motion.div 
            animate={{ 
              scale: isFocused ? 1.02 : 1,
              y: isFocused ? -5 : 0
            }}
            className="relative group"
          >
            <div className={`absolute inset-0 bg-sky-500/10 blur-2xl transition-all duration-500 rounded-full ${isFocused ? "opacity-100 scale-110" : "opacity-0 scale-95"}`} />
            
            <div className={`relative flex items-center bg-zinc-900 border-2 transition-all p-2 duration-300 ${isFocused ? "border-sky-500 shadow-2xl rounded-2xl" : "border-zinc-800 rounded-full shadow-lg"}`}>
              <Search className={`w-8 h-8 ml-4 transition-colors ${isFocused ? "text-sky-500" : "text-zinc-600"}`} />
              <Input 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                placeholder="Ex: Vol Dakar-Paris pour 15 jours en Business..." 
                className="border-none bg-transparent h-16 text-xl text-zinc-100 placeholder:text-zinc-700 focus-visible:ring-0 px-6 font-medium"
              />
              
              {query && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setQuery("")}
                  className="mr-2 text-zinc-600 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </Button>
              )}

              <Button size="lg" className="h-14 px-8 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-lg shadow-lg shadow-sky-500/20 transition-all active:scale-95">
                {isFocused ? <ArrowRight className="w-6 h-6" /> : "RECHERCHER"}
              </Button>
            </div>
          </motion.div>

          {/* AI Suggestions Dropdown */}
          <AnimatePresence>
            {isFocused && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-full left-0 right-0 mt-4 bg-zinc-900 border-2 border-zinc-800 rounded-2xl shadow-2xl overflow-hidden text-left"
              >
                <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest flex items-center gap-2">
                    <Sparkles className="w-3 h-3 text-sky-500" />
                    Suggestions IA
                  </span>
                  <span className="text-[10px] text-zinc-600 font-medium">Smart recommendations</span>
                </div>
                
                <div className="p-2 space-y-1">
                  {filteredSuggestions.length > 0 ? (
                    filteredSuggestions.map((suggestion, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setQuery(suggestion.text);
                          setIsFocused(false);
                        }}
                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-800/50 transition-colors text-zinc-300 hover:text-white group text-left"
                      >
                        <span className="text-xl group-hover:scale-125 transition-transform">{suggestion.icon}</span>
                        <span className="font-medium text-sm flex-1">{suggestion.text}</span>
                        <ArrowRight className="w-4 h-4 text-zinc-700 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      </button>
                    ))
                  ) : (
                    <div className="p-4 text-center text-zinc-600 text-sm italic">
                      Pas de suggestions pour "{query}"
                    </div>
                  )}
                </div>

                <div className="bg-zinc-800/50 p-3 px-4 flex items-center justify-between text-[10px] font-bold text-zinc-500">
                  <div className="flex gap-4">
                    <span>↑↓ Naviguer</span>
                    <span>⏎ Entrer</span>
                  </div>
                  <span className="text-sky-500/50">Assistant Voyage IA v1.0</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Quick Actions / Beginner Support */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Plane, label: "Vols", color: "text-sky-400" },
            { icon: Hotel, label: "Hôtels", color: "text-emerald-400" },
            { icon: Map, label: "Forfaits", color: "text-amber-400" },
            { icon: Sparkles, label: "IA Assistant", color: "text-purple-400", action: toggleAIPanel },
          ].map((action, i) => (
            <motion.button
              key={i}
              whileHover={{ y: -5 }}
              onClick={action.action}
              className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:bg-zinc-900/80 hover:border-zinc-700 transition-all group"
            >
              <action.icon className={`w-8 h-8 ${action.color} transition-transform group-hover:scale-110`} />
              <span className="text-sm font-bold uppercase tracking-widest text-zinc-500 group-hover:text-zinc-200">{action.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Offline / Stats context */}
        <div className="flex items-center justify-center gap-8 pt-8">
          <div className="flex items-center gap-2 text-xs font-bold text-zinc-600 uppercase tracking-widest">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Stockage Local : Prêt
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-zinc-600 uppercase tracking-widest">
             <History className="w-3 h-3" />
             12 Dernières recherches
          </div>
        </div>
      </motion.div>
    </div>
  );
}
