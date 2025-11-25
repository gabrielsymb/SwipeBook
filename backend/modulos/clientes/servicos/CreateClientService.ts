import { CreateClientDTO } from "../dtos/CreateClientDTO";
import { clientRepository } from "../repositorios/ClientRepository";

// Serviço que CONTÉM REGRA DE NEGÓCIO para criação de cliente.
// Aqui validamos condições antes de delegar a persistência ao repositório.
// Comentários detalhados explicam decisões e facilitam evolução futura.
export class CreateClientService {
  // Regra: email (quando fornecido) não pode estar duplicado para o mesmo prestador.
  // Regra: nome é obrigatório e deve ter tamanho mínimo (protege contra registros vazios).
  // Observação: validações mais complexas (ex: formato de telefone) podem ser extraídas para helpers.
  async execute(prestadorId: string, data: CreateClientDTO) {
    // Validação do nome
    if (!data.nome || data.nome.trim().length < 2) {
      throw new Error(
        "Nome do cliente é obrigatório e deve ter ao menos 2 caracteres"
      );
    }

    // Se email foi fornecido, validar unicidade
    if (data.email) {
      const existing = await clientRepository.findByEmail(
        prestadorId,
        data.email
      );
      if (existing) {
        throw new Error("Email já cadastrado para este prestador");
      }
    }

    // Delegar persistência ao repositório
    const created = await clientRepository.create(prestadorId, data);

    // Retornar entidade criada (pode ser mapeada para DTO de saída futuramente)
    return created;
  }
}

export const createClientService = new CreateClientService();
