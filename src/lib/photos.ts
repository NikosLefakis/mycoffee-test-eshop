// Stock photos from Unsplash (free licence, commercial use allowed, no
// attribution required). Served through next/image from images.unsplash.com.
// Keep PHOTO_QUERY in sync with remotePatterns.search in next.config.ts.
export const PHOTO_QUERY = "?auto=format&fit=crop&w=1600";

export function photoUrl(id: string) {
  return `https://images.unsplash.com/photo-${id}${PHOTO_QUERY}`;
}

export const PRODUCT_PHOTOS: Record<string, string> = {
  "ethiopia-guji": "1524350876685-274059332603",
  "colombia-huila": "1562051036-e0eea191d42f",
  "kenya-aa": "1587734195503-904fca47e0e9",
  "house-espresso-blend": "1675306408031-a9aad9f23308",
  "decaf-colombia": "1513530176992-0cf39c4cbed4",
  "hand-grinder": "1573066516618-70e8e69506e7",
  "ceramic-dripper": "1743584643724-95eb6e62d065",
  "copper-briki": "1530225027979-f22e35df7b01",
  "coffee-scale": "1712664436140-3bb6b9b4d576",
  "porcelain-mug": "1616241673111-508b4662c707",
  "greek-coffee-cups": "1600628129418-fb34b9a2c484",
  "double-wall-glass": "1631305588911-a223ec83ddbc",
};

export const HERO_PHOTO = "1522012188892-24beb302783d";
export const STORY_PHOTO = "1774296479035-4c6075e0c340";

export const COLLECTION_PHOTOS = {
  beans: "1447933601403-0c6688de566e",
  equipment: "1741170112939-e972f019c81d",
  cups: "1521302080334-4bebac2763a6",
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
