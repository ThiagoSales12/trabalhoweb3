import { AppContent } from "./AppContent";
import AppProvider from "./context/AppContext";

export function App() {
    return (
        <AppProvider>
            <AppContent />
        </AppProvider>
    );
}