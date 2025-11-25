// Modelos de domínio usados na UI
export function toAppointmentViewModel(apiData) {
  return {
    id: apiData.id,
    clientName: apiData.clientName,
    date: apiData.date,
    status: apiData.status,
  };
}
