
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import { ErrorBoundary } from "./app/components/ErrorBoundary.tsx";
  import "./styles/index.css";
  import "./app/i18n";

  import { WortnetzProvider } from "./app/context/WortnetzContext.tsx";
  import { AppShell } from "./app/components/shell/AppShell.tsx";

  createRoot(document.getElementById("root")!).render(
    <ErrorBoundary>
      <WortnetzProvider>
        <AppShell>
          <App />
        </AppShell>
      </WortnetzProvider>
    </ErrorBoundary>
  );
  