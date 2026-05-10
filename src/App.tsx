/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AppShell } from "./components/layout/AppShell";
import { Dashboard } from "./features/dashboard/Dashboard";
import { ClientList } from "./features/crm/ClientList";
import { SearchHome } from "./features/search/SearchHome";
import { SettingsPage } from "./features/settings/SettingsPage";
import { useStore } from "./lib/store";

export default function App() {
  const { activeTab } = useStore();

  const renderContent = () => {
    switch (activeTab) {
      case "search":
        return <SearchHome />;
      case "dashboard":
        return <Dashboard />;
      case "crm":
        return <ClientList />;
      case "settings":
        return <SettingsPage />;
      case "bookings":
        return (
          <div className="p-8 flex flex-col items-center justify-center h-full text-zinc-500 opacity-50">
            <h2 className="text-xl font-bold italic serif font-serif">Gestion de Dossiers Voyage</h2>
            <p className="mt-2">Module de gestion des dossiers en attente d'implémentation Phase 2.1</p>
          </div>
        );
      default:
        return <SearchHome />;
    }
  };

  return (
    <AppShell>
      {renderContent()}
    </AppShell>
  );
}
