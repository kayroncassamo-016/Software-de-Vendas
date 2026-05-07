export function formatMoney(value: string | number|undefined): string {
  const num = Number(value) || 0;

  return num.toLocaleString('pt-MZ', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatPercent(value: string | number): string {
  const num = Number(value) || 0;

  return `${Math.round(num)}%`;
}