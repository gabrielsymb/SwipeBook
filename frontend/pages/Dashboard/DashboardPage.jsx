import useDashboard from '../../hooks/useDashboard';

export default function DashboardPage() {
  const { items, loading, error, createAppointment } = useDashboard();

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>Erro: {String(error.message || error)}</p>;

  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={() => createAppointment({ date: new Date().toISOString() })}>
        Criar agendamento agora
      </button>
      <ul>
        {items.map((it) => (
          <li key={it.id}>{it.clientName} — {new Date(it.date).toLocaleString()}</li>
        ))}
      </ul>
    </div>
  );
}
