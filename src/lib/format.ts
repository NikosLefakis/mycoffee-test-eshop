export function formatPrice(cents: number): string {
  return new Intl.NumberFormat("el-GR", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

export const CATEGORY_LABELS: Record<string, string> = {
  beans: "Κόκκοι καφέ",
  equipment: "Εξοπλισμός",
  cups: "Κούπες",
};
