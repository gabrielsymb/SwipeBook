// DTO para atualização parcial do cliente
export interface UpdateClientDTO {
  nome?: string;
  email?: string | null;
  telefone?: string | null;
  pendencia?: boolean;
}
