// ─────────────────────────────────────────────────────────────────────────────
// Hard-coded listing data (Step 1, extended in Step 2).
//
// This shape matches the latest design (docs/design/kazis-garage-reference.html,
// "take 5 · shop mode"): a mix of one-off used items AND new items Kazi
// restocks (`isNew`, `stock`). The actual cart/checkout/shipping-cost logic
// shown in that reference is intentionally NOT implemented yet — this step
// only renders the data. That comes in a dedicated later step.
//
// In Step 5 this array moves into the database; every other file only reads
// from `listings`, so swapping the data source later won't touch the UI code.
// ─────────────────────────────────────────────────────────────────────────────

export type Category = "garage" | "home" | "outdoor";
export type Condition = "Like new" | "Good" | "Fair" | "New" | "Used";
// How a listing can reach the buyer. "any" = ships or picked up (buyer's
// choice); "ship" = mailed only (e.g. drop-shipped); "pickup" = too big to
// ship, East Van pickup only.
export type DeliveryMode = "any" | "ship" | "pickup";
// Canada Post box tiers, smallest to largest — see SHIP_RATES below.
export type ShipSize = "S" | "M" | "L";

// A single "photo". There are no real product photos yet, so each one is
// just a caption plus a color/shape — the same placeholder-block system
// used everywhere else, reused once per photo instead of once per listing.
export type Photo = {
  label: string;
  color: "red" | "yellow" | "blue";
  shape: "square" | "circle" | "pill";
};

export type Listing = {
  id: string;
  name: string;
  story: string; // one honest sentence about the item's condition/history
  price: number; // CAD, whole dollars
  wasPrice?: number; // shown struck through, if the price was lowered
  category: Category;
  condition: Condition;
  isNew: boolean;
  stock: number; // 0 = sold/out of stock. 1 = one-of-a-kind. >1 = restockable.
  size: ShipSize;
  mode: DeliveryMode;
  media: { color: Photo["color"]; shape: Photo["shape"] };
  photos: Photo[]; // shown on the detail page/modal gallery. media = photos[0].
  soldDate?: string; // only meaningful when stock === 0
};

// Estimated Canada Post rates by box size, for later use (shipping cost
// calculation is not implemented yet — see the note above).
export const SHIP_RATES: Record<ShipSize, { label: string; estimate: number }> =
  {
    S: { label: "Small packet", estimate: 14 },
    M: { label: "Small box", estimate: 22 },
    L: { label: "Medium box", estimate: 32 },
  };

export const listings: Listing[] = [
  {
    id: "torque",
    name: "Digital Torque Wrench Set",
    story: "Used for one set of winter tires. Case and manual included.",
    price: 134,
    wasPrice: 210,
    category: "garage",
    condition: "Like new",
    isNew: false,
    stock: 1,
    size: "M",
    mode: "any",
    media: { color: "red", shape: "square" },
    photos: [
      { label: "Front", color: "red", shape: "square" },
      { label: "Case open", color: "yellow", shape: "circle" },
      { label: "Display reading", color: "blue", shape: "pill" },
      { label: "Manual and box", color: "red", shape: "circle" },
    ],
  },
  {
    id: "gloves",
    name: "Nitrile Mechanic Gloves, box of 100",
    story: "The ones I use for every oil change. Size L.",
    price: 18,
    category: "garage",
    condition: "New",
    isNew: true,
    stock: 8,
    size: "S",
    mode: "any",
    media: { color: "blue", shape: "pill" },
    photos: [
      { label: "Box", color: "blue", shape: "pill" },
      { label: "Glove close-up", color: "blue", shape: "square" },
    ],
  },
  {
    id: "tent",
    name: "MEC 2-Person Tent",
    story: "Three summers on Vancouver Island. No holes, one bent stake.",
    price: 90,
    category: "outdoor",
    condition: "Good",
    isNew: false,
    stock: 1,
    size: "L",
    mode: "any",
    media: { color: "yellow", shape: "circle" },
    photos: [
      { label: "Pitched", color: "yellow", shape: "circle" },
      { label: "Packed in bag", color: "yellow", shape: "square" },
      { label: "Vestibule", color: "red", shape: "circle" },
      { label: "The bent stake", color: "blue", shape: "square" },
    ],
  },
  {
    id: "light",
    name: "LED Shop Light, 1200 lm",
    story: "Magnetic base, rechargeable. Sealed in box.",
    price: 38,
    wasPrice: 55,
    category: "garage",
    condition: "New",
    isNew: true,
    stock: 3,
    size: "S",
    mode: "any",
    media: { color: "yellow", shape: "square" },
    photos: [
      { label: "Sealed box", color: "yellow", shape: "square" },
      { label: "Magnetic base", color: "blue", shape: "circle" },
      { label: "Lit up", color: "yellow", shape: "pill" },
    ],
  },
  {
    id: "kallax",
    name: "IKEA Kallax Shelf, 2×4",
    story: "White. Small scuff on one corner. Already disassembled.",
    price: 40,
    category: "home",
    condition: "Fair",
    isNew: false,
    stock: 1,
    size: "L",
    mode: "pickup", // too big to box up
    media: { color: "blue", shape: "square" },
    photos: [
      { label: "Assembled, before", color: "blue", shape: "square" },
      { label: "Flat-packed", color: "red", shape: "square" },
      { label: "Corner scuff", color: "blue", shape: "circle" },
    ],
  },
  {
    id: "cloth",
    name: "Microfiber Detail Cloths, 6-pack",
    story: "Lint-free, dual-pile. Safe on paint and glass.",
    price: 14,
    category: "garage",
    condition: "New",
    isNew: true,
    stock: 12,
    size: "S",
    mode: "any",
    media: { color: "red", shape: "circle" },
    photos: [
      { label: "6-pack", color: "red", shape: "circle" },
      { label: "Dual pile", color: "red", shape: "pill" },
    ],
  },
  {
    id: "rice",
    name: "Zojirushi Rice Cooker, 5.5 cup",
    story: "Works perfectly. I upgraded to a bigger one.",
    price: 60,
    category: "home",
    condition: "Good",
    isNew: false,
    stock: 1,
    size: "L",
    mode: "any",
    media: { color: "red", shape: "pill" },
    photos: [
      { label: "Front", color: "red", shape: "pill" },
      { label: "Inner pot", color: "yellow", shape: "circle" },
      { label: "Accessories", color: "blue", shape: "square" },
    ],
  },
  {
    id: "lantern",
    name: "Rechargeable Camp Lantern",
    story:
      "Mailed straight from the supplier, so it can't be picked up. USB-C.",
    price: 26,
    category: "outdoor",
    condition: "New",
    isNew: true,
    stock: 4,
    size: "S",
    mode: "ship", // drop-shipped, never in Kazi's hands
    media: { color: "blue", shape: "circle" },
    photos: [
      { label: "Lantern", color: "blue", shape: "circle" },
      { label: "USB-C port", color: "blue", shape: "square" },
      { label: "Low mode at night", color: "yellow", shape: "circle" },
    ],
  },
  {
    id: "bike",
    name: "Kona Commuter Bike, 54 cm",
    story: "Went to a student at UBC. Ride safe!",
    price: 280,
    category: "outdoor",
    condition: "Used",
    isNew: false,
    stock: 0,
    size: "L",
    mode: "pickup",
    media: { color: "yellow", shape: "circle" },
    photos: [
      { label: "Side view", color: "yellow", shape: "circle" },
      { label: "Drivetrain", color: "blue", shape: "square" },
      { label: "Cockpit", color: "red", shape: "pill" },
    ],
    soldDate: "Sep 21",
  },
];

export function getListing(id: string): Listing | undefined {
  return listings.find((l) => l.id === id);
}
