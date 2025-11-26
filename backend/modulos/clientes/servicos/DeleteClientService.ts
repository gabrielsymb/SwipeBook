import { appointmentRepository } from "../../agendamentos/repositorios/AppointmentRepository.js";
import { clientRepository } from "../repositorios/ClientRepository.js";

export class DeleteClientService {
  // Remove cliente após validações de pertença
  async execute(prestadorId: string, id: string) {
    const existing = await clientRepository.findByIdAndPrestadorId(
      id,
      prestadorId
    );
    if (!existing) throw new Error("Cliente não encontrado");
    // Bloqueia exclusão (soft-delete) se existirem agendamentos ativos ou históricos
    const hasAppointments = await appointmentRepository.existsByClienteId(id);
    if (hasAppointments) {
      throw new Error(
        "Não é possível remover cliente: existem agendamentos associados. Considere inativar manualmente ou remover agendamentos primeiro."
      );
    }
    return clientRepository.delete(id);
  }
}

export const deleteClientService = new DeleteClientService();
