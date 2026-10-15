import Image from "next/image";
import { Emblem } from "@/components/logo";
import { photoUrl, PRODUCT_PHOTOS } from "@/lib/photos";

// Product image: the stock photo mapped to this slug, or a neutral tile with
// the brand emblem for products that do not have a photo yet.
export function ProductVisual({
  slug,
  name,
  sizes = "(min-width: 1024px) 33vw, 50vw",
  priority = false,
  className = "",
}: {
  slug: string;
  name: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  const photo = PRODUCT_PHOTOS[slug];

  if (!photo) {
    return (
      <div
        role="img"
        aria-label={name}
        className="grid h-full w-full place-items-center bg-secondary"
      >
        <Emblem className="h-1/3 w-auto text-primary/40" />
      </div>
    );
  }

  return (
    <div className="relative h-full w-full bg-secondary">
      <Image
        src={photoUrl(photo)}
        alt={name}
        fill
        sizes={sizes}
        priority={priority}
        className={`object-cover ${className}`}
      />
    </div>
  );
}
