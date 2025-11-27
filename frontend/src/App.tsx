import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { useActiveSessionQuery } from "./modules/session/hooks/useSession";
import { useSessionHeartbeat } from "./modules/session/hooks/useSessionHeartbeat";
// import { AppRoutes } from './routes'; // Criaremos isso em breve

// Configuração do React Query (Cache e Re-fetch)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
    },
  },
});

function App() {
  // Inicializa a sessão ativa no boot do app
  useActiveSessionQuery();
  // Inicia o heartbeat (sincronização periódica) quando houver sessão ativa
  useSessionHeartbeat();
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {/* <AppRoutes /> Aqui entrarão suas rotas */}
        <h1>SwipeBook Setup Inicial</h1>
        <p>Infraestrutura pronta: Axios, Query, Router.</p>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
