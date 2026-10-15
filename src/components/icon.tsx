// Icons come from a Google Fonts Material Symbols subset (see layout.tsx).
// A name missing from that subset renders as plain text, so add it to the URL too.
export type IconName =
  | "add"
  | "arrow_back"
  | "check"
  | "close"
  | "favorite"
  | "menu"
  | "remove"
  | "schedule"
  | "shopping_bag"
  | "verified";

export function Icon({
  name,
  className = "",
}: {
  name: IconName;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`material-symbols-outlined select-none ${className}`}
    >
      {name}
    </span>
  );
}
