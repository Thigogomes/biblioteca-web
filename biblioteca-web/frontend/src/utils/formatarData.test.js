import { formatarData } from './formatarData';

test('converte AAAA-MM-DD para DD/MM/AAAA', () => {
  expect(formatarData('1839-06-21')).toBe('21/06/1839');
});

test('retorna "-" para valor vazio', () => {
  expect(formatarData(null)).toBe('-');
  expect(formatarData('')).toBe('-');
});
