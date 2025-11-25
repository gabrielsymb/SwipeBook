// DTO de entrada para criação de cliente
// Mantemos separado para facilitar validação e evolução futura (ex: adicionar campos opcionais)
export interface CreateClientDTO {
  nome: string; // nome identificador do cliente
  email?: string; // email opcional (pode ser usado para contato / login futuro)
  telefone?: string; // telefone opcional para confirmação / contato rápido
  pendencia?: boolean; // flag de pendência financeira (default false se não enviado)
}
