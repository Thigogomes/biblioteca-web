// Converte "AAAA-MM-DD" (formato da API) para "DD/MM/AAAA" (exibição).
export function formatarData(iso) {
  if (!iso) return '-';
  const [ano, mes, dia] = String(iso).slice(0, 10).split('-');
  if (!ano || !mes || !dia) return '-';
  return `${dia}/${mes}/${ano}`;
}
