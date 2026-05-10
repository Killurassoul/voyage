import { Sidebar } from "./Sidebar";
import { AIPanel } from "./AIPanel";
import { useStore } from "@/src/lib/store";
import { motion, AnimatePresence } from "motion/react";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { isAIPanelOpen } = useStore();

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-300 overflow-hidden selection:bg-sky-500/30 font-sans">
      <Sidebar />
      
      <main className={`flex-1 flex flex-col relative transition-all duration-300 ${isAIPanelOpen ? "mr-[400px]" : "mr-0"}`}>
        {/* Top bar */}
        <header className="h-14 border-b border-zinc-800 flex items-center px-6 bg-zinc-950/80 backdrop-blur-md z-10">
          <div className="flex-1">
            <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-md h-9 px-3 flex items-center text-sm text-zinc-500 group focus-within:border-sky-500/50 transition-colors cursor-text">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 opacity-50 group-hover:opacity-100 transition-opacity"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              Search flights, hotels, or command (⌘K)...
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-400">Ollama Active</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] font-bold text-zinc-500">AD</div>
          </div>
        </header>

        {/* Content area */}
        <div className="flex-1 overflow-auto bg-zinc-950">
          <AnimatePresence mode="wait">
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Context Bar */}
        <footer className="h-8 border-t border-zinc-800 bg-zinc-950 px-4 flex items-center justify-between text-[10px] text-zinc-500 font-medium">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 uppercase tracking-tighter"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Local DB Connected</span>
            <span className="border-l border-zinc-800 h-3 ml-1 pl-4 uppercase tracking-tighter">SQLite 3.46.1</span>
          </div>
          <div className="flex gap-4 uppercase tracking-tighter">
            <span>v1.0.4-BUILD_2026</span>
            <span className="text-zinc-600">Env: AI Studio / Node.js 22</span>
          </div>
        </footer>
      </main>

      <AIPanel />
    </div>
  );
}
