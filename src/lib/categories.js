// Habit categories: a fixed, small palette so colors stay meaningful and
// consistent across the app (cards, chips, filters, heatmaps).

export const CATEGORIES = [
  { id: "general", label: "General", color: "#6b6f76" },
  { id: "health", label: "Health", color: "#2f6f4f" },
  { id: "fitness", label: "Fitness", color: "#e8482c" },
  { id: "mind", label: "Mindfulness", color: "#1f5fae" },
  { id: "work", label: "Work", color: "#6a4fb3" },
  { id: "learning", label: "Learning", color: "#0f8a8a" },
  { id: "personal", label: "Personal", color: "#c2437a" },
];

export const DEFAULT_CATEGORY_ID = "general";

export function getCategory(categoryId) {
  return CATEGORIES.find((c) => c.id === categoryId) ?? CATEGORIES[0];
}
