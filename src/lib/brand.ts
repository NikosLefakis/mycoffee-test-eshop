// Single source of truth for the shop identity. Change the name here and it
// updates the metadata, logo, header, footer and the product labels.
// Every "O" in `name` is drawn as a coffee bean in the logo.
export const BRAND = {
  name: "My Coffee",
  tagline: "Από τον σπόρο στο φλιτζάνι.",
  description:
    "Καφές ειδικής ποιότητας σε μικρές παρτίδες, και ό,τι χρειάζεσαι για να τον φτιάξεις σωστά: κόκκοι, μύλοι, μπρίκια και κούπες.",
} as const;
