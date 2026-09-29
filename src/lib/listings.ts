// ─────────────────────────────────────────────────────────────────────────────
// Hard-coded listing data (Step 1).
//
// This is NOT a shop with SKUs and stock counts — it's a personal garage sale:
// each listing is exactly ONE physical item Kazi owns. Once it sells, it's
// marked `sold: true` and stays on the page (crossed out) rather than being
// deleted, so a buyer can see it was real and moved fast.
//
// In Step 5 this array moves into the database; every other file only reads
// from `listings`, so swapping the data source later won't touch the UI code.
// ─────────────────────────────────────────────────────────────────────────────

export type Category = "garage" | "home" | "outdoor";

// The listing "photo" is a flat color block with a simple shape, not a real
// photo yet (see docs/design/kazis-garage-reference.html). `media` picks
// which token color and which shape to render.
export type Listing = {
  id: string;
  name: string;
  story: string; // one honest sentence about the item's condition/history
  price: number; // CAD, whole dollars
  wasPrice?: number; // shown struck through, if the price was lowered
  category: Category;
  condition: "Like new" | "Good" | "Fair";
  pickup: "Pickup" | "Pickup or ship";
  media: { color: "red" | "yellow" | "blue"; shape: "square" | "circle" };
  sold?: boolean;
  soldDate?: string;
};

export const listings: Listing[] = [
  {
    id: "torque-wrench-set",
    name: "Digital Torque Wrench Set",
    story: "Used for one set of winter tires. Case and manual included.",
    price: 134,
    wasPrice: 210,
    category: "garage",
    condition: "Like new",
    pickup: "Pickup",
    media: { color: "red", shape: "square" },
  },
  {
    id: "mec-tent",
    name: "MEC 2-Person Tent",
    story: "Three summers on Vancouver Island. No holes, one bent stake.",
    price: 90,
    category: "outdoor",
    condition: "Good",
    pickup: "Pickup",
    media: { color: "yellow", shape: "circle" },
  },
  {
    id: "kallax-shelf",
    name: "IKEA Kallax Shelf, 2×4",
    story: "White. Small scuff on one corner. Already disassembled.",
    price: 40,
    category: "home",
    condition: "Fair",
    pickup: "Pickup",
    media: { color: "blue", shape: "square" },
  },
  {
    id: "led-shop-light",
    name: "LED Shop Light, 1200 lm",
    story: "Magnetic base, rechargeable. Bought a second one by mistake.",
    price: 38,
    wasPrice: 55,
    category: "garage",
    condition: "Like new",
    pickup: "Pickup or ship",
    media: { color: "yellow", shape: "square" },
  },
  {
    id: "rice-cooker",
    name: "Zojirushi Rice Cooker, 5.5 cup",
    story: "Works perfectly. Upgraded to a bigger one.",
    price: 60,
    category: "home",
    condition: "Good",
    pickup: "Pickup",
    media: { color: "red", shape: "circle" },
  },
  {
    id: "kona-bike",
    name: "Kona Commuter Bike, 54 cm",
    story: "Went to a student at UBC. Ride safe!",
    price: 280,
    category: "outdoor",
    condition: "Good",
    pickup: "Pickup",
    media: { color: "blue", shape: "circle" },
    sold: true,
    soldDate: "Sep 21",
  },
];
