import { generateKeyBetween } from "fractional-indexing";

/**
 * Classe utilitária para geração de chaves lexicais (Lexorank / Fractional Indexing)
 * usada para ordenação estável e eficiente de agendamentos.
 */
export class LexicalReorderUtility {
  // Âncoras globais (menor e maior possível). A string vazia será sempre menor.
  private static readonly MIN_KEY = "";
  private static readonly MAX_KEY = "~"; // '~' é maior que letras/dígitos em ordenação ASCII

  /**
   * Gera uma nova chave entre before e after.
   * Se before for null => assume MIN_KEY (inserção no início)
   * Se after for null  => assume MAX_KEY (inserção no fim)
   */
  static getNewKey(before: string | null, after: string | null): string {
    const b = before ?? LexicalReorderUtility.MIN_KEY;
    const a = after ?? LexicalReorderUtility.MAX_KEY;
    return generateKeyBetween(b, a);
  }
}
