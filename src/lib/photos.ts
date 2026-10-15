// Stock photos from Unsplash (free licence, commercial use allowed, no
// attribution required), stored in public/images so they never depend on
// an external service. Add a file there and an entry here for a new product.
const image = (name: string) => `/images/${name}.jpg`;

export const PRODUCT_PHOTOS: Record<string, string> = {
  "ethiopia-guji": image("ethiopia-guji"),
  "colombia-huila": image("colombia-huila"),
  "kenya-aa": image("kenya-aa"),
  "house-espresso-blend": image("house-espresso-blend"),
  "decaf-colombia": image("decaf-colombia"),
  "hand-grinder": image("hand-grinder"),
  "ceramic-dripper": image("ceramic-dripper"),
  "copper-briki": image("copper-briki"),
  "coffee-scale": image("coffee-scale"),
  "porcelain-mug": image("porcelain-mug"),
  "greek-coffee-cups": image("greek-coffee-cups"),
  "double-wall-glass": image("double-wall-glass"),
};

export const HERO_PHOTO = image("hero");
export const STORY_PHOTO = image("story");

export const COLLECTION_PHOTOS = {
  beans: image("collection-beans"),
  equipment: image("collection-equipment"),
  cups: image("collection-cups"),
} as const;

// Short factual labels shown on product photos.
export const PRODUCT_BADGES: Record<string, string> = {
  "ethiopia-guji": "Washed",
  "kenya-aa": "Φίλτρο",
  "house-espresso-blend": "Espresso",
  "decaf-colombia": "Χωρίς καφεΐνη",
  "copper-briki": "Παραδοσιακό",
  "greek-coffee-cups": "Σετ 2 τεμ.",
};
