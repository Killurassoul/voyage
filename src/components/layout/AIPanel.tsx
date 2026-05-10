import { motion, AnimatePresence } from "motion/react";
import { useState, useRef, useEffect } from "react";
import { useStore } from "@/src/lib/store";
import { getAICompletion } from "@/src/services/ai";
import { Send, X, Bot, User, Trash2, History, Save, PlusCircle, FileText, ChevronRight, Settings as SettingsIcon } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { ScrollArea } from "@/src/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Label } from "@/src/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/src/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/src/components/ui/sheet";
import ReactMarkdown from "react-markdown";

export function AIPanel() {
  const { 
    messages, 
    addMessage, 
    clearMessages, 
    isAIPanelOpen, 
    toggleAIPanel, 
    settings,
    updateSettings,
    sessions,
    activeSessionId,
    saveCurrentSession,
    loadSession,
    deleteSession,
    createNewSession
  } = useStore();
  const [input, setInput] = useState("");
  const [sessionName, setSessionName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [configError, setConfigError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const validateSettings = () => {
    if (settings.aiModel === "gemini") {
      // If we have a custom key, validate it. If not, we rely on the environment key.
      if (settings.geminiKey && !settings.geminiKey.startsWith("AIza")) {
        return "La clé Gemini semble invalide (elle doit commencer par 'AIza').";
      }
      // If no custom key and no environment key, it's missing.
      // Note: process.env.GEMINI_API_KEY is handled in the service, 
      // but let's check it here for immediate feedback if possible.
    } else if (settings.aiModel === "ollama") {
      if (!settings.ollamaEndpoint) {
        return "Le point d'accès Ollama est obligatoire.";
      }
      try {
        new URL(settings.ollamaEndpoint);
      } catch {
        return "Le point d'accès Ollama doit être une URL valide (ex: http://localhost:11434).";
      }
    }
    return null;
  };

  useEffect(() => {
    setConfigError(validateSettings());
  }, [settings.aiModel, settings.geminiKey, settings.ollamaEndpoint]);

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsLoading(false);
      addMessage({ role: "system", content: "_La requête a été annulée par l'utilisateur._" });
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const validationError = validateSettings();
    if (validationError) {
      addMessage({ 
        role: "assistant", 
        content: `⚠️ **Erreur de configuration :** ${validationError}\n\nCliquez sur l'icône **Réglages** en haut pour corriger votre configuration.` 
      });
      return;
    }

    const userQuery = input.trim();
    setInput("");
    addMessage({ role: "user", content: userQuery });
    setIsLoading(true);

    // Initialize AbortController
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const timeoutId = setTimeout(() => {
      controller.abort("TIMEOUT");
    }, 60000); // 60 seconds timeout

    try {
      const history = messages.map((m) => ({ role: m.role, content: m.content }));
      const response = await getAICompletion(
        userQuery, 
        history, 
        controller.signal,
        settings.geminiKey, // Key provided by user in Settings
        settings.aiModel,
        settings.ollamaEndpoint
      );

      if (!controller.signal.aborted) {
        addMessage({ role: "assistant", content: response });
      }
    } catch (error: any) {
      if (controller.signal.aborted) {
        if (controller.signal.reason === "TIMEOUT") {
          addMessage({ role: "assistant", content: "⌛ **Request timed out.** La requête a mis plus de 60 secondes à répondre. Veuillez réessayer plus tard." });
        } else {
          console.log("Request aborted successfully");
        }
      } else {
        let errorMessage = "Une erreur inattendue est survenue.";
        
        if (error.message === "MISSING_API_KEY") {
          errorMessage = "⚠️ **Clé API manquante.** Veuillez configurer votre clé Google Gemini dans les paramètres pour activer l'assistant IA.";
        } else if (error.message === "INVALID_API_KEY") {
          errorMessage = "⚠️ **Clé API invalide.** La clé fournie n'est pas reconnue par Google. Veuillez la vérifier dans vos paramètres.";
        } else if (error.message === "NETWORK_ERROR") {
          errorMessage = "🌐 **Erreur réseau.** Impossible de contacter les serveurs de Google AI. Veuillez vérifier votre connexion internet et réessayer l'opération.";
        } else if (error.message === "EMPTY_RESPONSE") {
          errorMessage = "🤔 **Pas de réponse.** Le modèle n'a pas pu générer de contenu pour cette requête. Essayez de reformuler.";
        } else if (error.message?.includes("quota")) {
          errorMessage = "⏳ **Quota dépassé.** Vous avez atteint la limite de requêtes gratuites pour aujourd'hui. Réessayez plus tard.";
        } else {
          errorMessage = `❌ **Erreur technique :** ${error.message || "Impossible de traiter votre demande pour le moment."}`;
        }

        addMessage({ role: "assistant", content: errorMessage });
      }
    } finally {
      clearTimeout(timeoutId);
      if (abortControllerRef.current === controller) {
        setIsLoading(false);
        abortControllerRef.current = null;
      }
    }
  };

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages, isLoading]);

  return (
    <AnimatePresence>
      {isAIPanelOpen && (
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed right-0 top-0 h-full w-[400px] border-l border-zinc-800 bg-zinc-950/50 backdrop-blur-xl z-50 flex flex-col shadow-2xl"
        >
          {/* Header */}
          <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/80">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-sky-500/20 rounded-lg">
                <Bot className="w-5 h-5 text-sky-500" />
              </div>
              <div>
                <h2 className="font-semibold text-white text-sm">Sky Intelligence</h2>
                <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold">
                  {settings.aiModel === "gemini" ? "Google Gemini" : "Ollama (Local)"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Dialog>
                <DialogTrigger
                  render={
                    <Button variant="ghost" size="icon" title="Modèle" className="hover:bg-zinc-800 rounded relative">
                      <SettingsIcon className={`w-4 h-4 ${configError ? "text-amber-500" : "text-zinc-600"}`} />
                      {configError && (
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-zinc-950" />
                      )}
                    </Button>
                  }
                />
                <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
                  <DialogHeader>
                    <DialogTitle className="text-white">Configuration IA</DialogTitle>
                    <DialogDescription className="text-zinc-400">
                      Choisissez votre moteur d'intelligence artificielle.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label className="text-zinc-400 text-xs">Moteur IA</Label>
                      <Select 
                        value={settings.aiModel} 
                        onValueChange={(val: "gemini" | "ollama") => updateSettings({ aiModel: val })}
                      >
                        <SelectTrigger className="bg-zinc-950 border-zinc-800 text-white">
                          <SelectValue placeholder="Sélectionner un modèle" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-950 border-zinc-800 text-white">
                          <SelectItem value="gemini">Google Gemini (Cloud)</SelectItem>
                          <SelectItem value="ollama">Ollama (Local)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {settings.aiModel === "ollama" && (
                      <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                        <Label className="text-zinc-400 text-xs">Point d'accès Ollama</Label>
                        <Input 
                          placeholder="http://localhost:11434" 
                          value={settings.ollamaEndpoint}
                          onChange={(e) => updateSettings({ ollamaEndpoint: e.target.value })}
                          className={`bg-zinc-950 border-zinc-800 text-white ${configError && settings.aiModel === "ollama" ? "border-red-500/50" : ""}`}
                        />
                        <p className="text-[10px] text-zinc-600">Assurez-vous qu'Ollama est démarré sur votre machine.</p>
                      </div>
                    )}

                    {configError && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg"
                      >
                        <p className="text-[11px] text-red-500 font-medium flex items-center gap-2">
                          <X className="w-3 h-3" />
                          {configError}
                        </p>
                      </motion.div>
                    )}
                  </div>
                  <DialogFooter>
                    <DialogClose render={<Button className="bg-sky-500 hover:bg-sky-600 text-white w-full">Terminer</Button>} />
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Sheet>
                <SheetTrigger 
                  render={
                    <Button variant="ghost" size="icon" title="Historique" className="hover:bg-zinc-800 rounded">
                      <History className="w-4 h-4 text-zinc-600" />
                    </Button>
                  }
                />
                <SheetContent className="bg-zinc-950 border-zinc-800 text-zinc-100 p-0 w-[350px]">
                  <SheetHeader className="p-6 border-b border-zinc-900 bg-zinc-950">
                    <SheetTitle className="text-white flex items-center gap-2">
                       <History className="w-4 h-4 text-sky-500" />
                       Sessions Sauvegardées
                    </SheetTitle>
                    <SheetDescription className="text-zinc-500">
                      Retrouvez et chargez vos anciennes conversations.
                    </SheetDescription>
                  </SheetHeader>
                  <ScrollArea className="h-[calc(100vh-120px)] p-4">
                    <div className="space-y-2">
                      {sessions.length === 0 && (
                        <div className="text-center py-10">
                          <p className="text-zinc-600 text-sm">Aucune session enregistrée.</p>
                        </div>
                      )}
                      {sessions.map((s) => (
                        <div 
                          key={s.id} 
                          className={`group p-3 rounded-lg border transition-all cursor-pointer ${
                            activeSessionId === s.id 
                              ? "bg-sky-500/10 border-sky-500/30 ring-1 ring-sky-500/20" 
                              : "bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900"
                          }`}
                          onClick={() => loadSession(s.id)}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-3 overflow-hidden">
                              <div className={`p-2 rounded-md ${activeSessionId === s.id ? "bg-sky-500 text-white" : "bg-zinc-800 text-zinc-500"}`}>
                                <FileText className="w-3.5 h-3.5" />
                              </div>
                              <div className="overflow-hidden">
                                <p className="text-[13px] font-medium text-zinc-200 truncate">{s.name}</p>
                                <p className="text-[10px] text-zinc-600">{new Date(s.updatedAt).toLocaleDateString()} • {s.messages.length} messages</p>
                              </div>
                            </div>
                            <div className="flex items-center">
                               <Button 
                                 variant="ghost" 
                                 size="icon" 
                                 className="h-7 w-7 text-zinc-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                 onClick={(e) => {
                                   e.stopPropagation();
                                   deleteSession(s.id);
                                 }}
                               >
                                 <Trash2 className="w-3.5 h-3.5" />
                               </Button>
                               <ChevronRight className={`w-4 h-4 transition-transform ${activeSessionId === s.id ? "text-sky-500" : "text-zinc-700 group-hover:translate-x-0.5"}`} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </SheetContent>
              </Sheet>

              <Dialog>
                <DialogTrigger
                  render={
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      title="Sauvegarder" 
                      className="hover:bg-zinc-800 rounded disabled:opacity-30"
                      disabled={messages.length === 0}
                    >
                      <Save className="w-4 h-4 text-zinc-600" />
                    </Button>
                  }
                />
                <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
                  <DialogHeader>
                    <DialogTitle className="text-white">Sauvegarder la session</DialogTitle>
                    <DialogDescription className="text-zinc-400">
                      Donnez un nom à cette conversation pour la retrouver plus tard.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <Input 
                      placeholder="Nom de la session..." 
                      value={sessionName || sessions.find(s => s.id === activeSessionId)?.name || ""}
                      onChange={(e) => setSessionName(e.target.value)}
                      className="bg-zinc-950 border-zinc-800 focus:border-sky-500/50"
                    />
                  </div>
                  <DialogFooter>
                    <DialogClose render={<Button variant="ghost" className="text-zinc-400 hover:text-white">Annuler</Button>} />
                    <DialogClose 
                      render={
                        <Button 
                          onClick={() => {
                            saveCurrentSession(sessionName);
                            setSessionName("");
                          }}
                          className="bg-sky-500 hover:bg-sky-600 text-white"
                        >
                          Sauvegarder
                        </Button>
                      } 
                    />
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Button 
                variant="ghost" 
                size="icon" 
                title="Nouvelle Chat" 
                onClick={createNewSession}
                className="hover:bg-zinc-800 rounded"
              >
                <PlusCircle className="w-4 h-4 text-zinc-600" />
              </Button>

              <Dialog>
                <DialogTrigger
                  render={
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      title="Effacer la conversation" 
                      className="hover:bg-zinc-800 rounded disabled:opacity-30 text-zinc-600"
                      disabled={messages.length === 0}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  }
                />
                <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
                  <DialogHeader>
                    <DialogTitle className="text-white flex items-center gap-2">
                       <Trash2 className="w-4 h-4 text-red-500" />
                       Effacer la conversation ?
                    </DialogTitle>
                    <DialogDescription className="text-zinc-400">
                      Êtes-vous sûr de vouloir effacer le chat ? Cette action ne peut pas être annulée.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="gap-2 mt-4">
                    <DialogClose render={<Button variant="ghost" className="text-zinc-400 hover:text-white">Annuler</Button>} />
                    <DialogClose 
                      render={
                        <Button 
                          variant="destructive" 
                          onClick={clearMessages}
                          className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20"
                        >
                          Effacer le chat
                        </Button>
                      } 
                    />
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <div className="w-px h-4 bg-zinc-800 mx-1" />

              <Button variant="ghost" size="icon" onClick={toggleAIPanel} className="hover:bg-zinc-800 rounded">
                <X className="w-4 h-4 text-zinc-600" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4 bg-zinc-950/20" ref={scrollRef}>
            <div className="space-y-6">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4 opacity-50">
                  <div className="w-12 h-12 bg-sky-500/10 rounded-2xl flex items-center justify-center border border-sky-500/20">
                    <Bot className="w-6 h-6 text-sky-500" />
                  </div>
                  <p className="text-zinc-500 text-sm font-medium">Assistant Sky Dex prêt.<br/>Comment puis-je vous aider aujourd'hui ?</p>
                </div>
              )}
              {messages.map((m) => (
                <div key={m.id} className={`flex flex-col gap-1.5 ${m.role === "user" ? "items-end" : "items-start"}`}>
                  <div className="flex items-center gap-2 text-[10px] text-zinc-600 uppercase tracking-tighter px-1">
                    {m.role === "user" ? (
                      <>
                        <span>VOUS • {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </>
                    ) : m.role === "assistant" ? (
                      <>
                        <span className="text-sky-500 font-bold">SKY DEX • {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </>
                    ) : (
                      <>
                        <span className="text-zinc-700 font-bold tracking-widest text-[8px]">SYSTEM</span>
                      </>
                    )}
                  </div>
                  <div className={`p-3 rounded-xl text-sm leading-relaxed shadow-sm ${
                    m.role === "user" 
                      ? "bg-sky-600 text-white rounded-tr-none border border-sky-500/50" 
                      : m.role === "system"
                        ? "bg-transparent text-zinc-600 italic border-none shadow-none py-0"
                        : "bg-zinc-900 text-zinc-300 border border-zinc-800 rounded-tl-none"
                  }`}>
                    <div className="markdown-body">
                      <ReactMarkdown>
                        {m.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between px-1">
                    <div className="text-[10px] text-sky-500 font-bold uppercase tracking-tighter animate-pulse">
                      AI THINKING...
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleCancel}
                      className="h-4 text-[9px] uppercase font-bold text-zinc-600 hover:text-red-500 p-0"
                    >
                      Arrêter
                    </Button>
                  </div>
                  <div className="bg-zinc-900/50 p-4 rounded-xl rounded-tl-none border border-dashed border-zinc-700 w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="space-y-2">
                      <div className="h-2 bg-zinc-800 rounded w-full"></div>
                      <div className="h-2 bg-zinc-800 rounded w-4/5"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 bg-zinc-950 border-t border-zinc-800 shadow-[0_-10px_20px_rgba(0,0,0,0.4)]">
            <div className="relative bg-zinc-900 border border-zinc-800 rounded-xl p-3 focus-within:border-sky-500/50 transition-all shadow-inner">
              <textarea 
                className="bg-transparent border-none w-full text-sm text-zinc-100 focus:outline-none resize-none h-20 placeholder:text-zinc-700" 
                placeholder="Posez une question à votre co-pilote..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
              <div className="flex justify-between items-center mt-2">
                <div className="flex gap-2">
                  {/* File/Voice mocks */}
                  <div className="p-1 text-zinc-600 hover:text-sky-400 cursor-pointer transition-colors">
                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.51a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                  </div>
                </div>
                <Button 
                  size="icon" 
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="bg-sky-500 hover:bg-sky-600 text-white h-8 w-8 rounded-lg shadow-lg shadow-sky-500/20"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <p className="text-[9px] text-zinc-600 mt-2 text-center font-medium tracking-tight">
              Appuyez sur Entrée pour envoyer • Sky Intelligence v1.2
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
