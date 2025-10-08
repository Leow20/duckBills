/**
 * Utilitários para manipulação de datas
 */

/**
 * Formata uma data ISO string para o formato brasileiro (DD/MM/AAAA)
 * Evita problemas de timezone ao tratar a data como local
 */
export function formatDateToBR(dateString: string): string {
  // Se a data já está no formato DD/MM/AAAA, retorna como está
  if (dateString.includes('/')) {
    return dateString;
  }

  // Para datas no formato ISO (YYYY-MM-DD), parseia manualmente para evitar timezone issues
  const [year, month, day] = dateString.split('-');
  return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
}

/**
 * Converte uma data no formato brasileiro (DD/MM/AAAA) para ISO (YYYY-MM-DD)
 */
export function formatDateToISO(dateString: string): string {
  // Se a data já está no formato ISO, retorna como está
  if (dateString.includes('-') && dateString.length === 10) {
    return dateString;
  }

  // Para datas no formato DD/MM/AAAA
  const [day, month, year] = dateString.split('/');
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

/**
 * Obtém a data atual no formato ISO (YYYY-MM-DD) para inputs de data
 */
export function getCurrentDateISO(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Compara duas datas no formato brasileiro ou ISO
 * Retorna: -1 se a primeira é anterior, 1 se é posterior, 0 se são iguais
 */
export function compareDates(date1: string, date2: string): number {
  const iso1 = formatDateToISO(date1);
  const iso2 = formatDateToISO(date2);
  
  if (iso1 < iso2) return -1;
  if (iso1 > iso2) return 1;
  return 0;
}