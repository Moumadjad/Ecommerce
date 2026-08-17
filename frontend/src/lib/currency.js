const formatter = new Intl.NumberFormat("fr-FR");

export function formatCurrency(amount) {
  return `${formatter.format(Math.round(amount))} FCFA`;
}
