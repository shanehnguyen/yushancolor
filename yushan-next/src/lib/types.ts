export type Pigment = {
  id: string;
  name: string;
  ci: string;
  pigmentCount: number;
  house: boolean;
  hex: string;
  blueWool: number;
  transparency: string;
  granulation: "None" | "Light" | "Medium" | "Heavy" | "Very heavy";
  staining: string;
  note: string;
  hueFamily?: string;
};

export type PaperSpec = {
  gsm: string;
  cotton: string;
  sizing: string;
  surface: string;
  deckle: string;
  sheets: string;
  sheetSize: string;
};

export type Product = {
  id: string;
  sku: string;
  name: string;
  rung: string;
  price: number;
  isTrial?: boolean;
  isFlagship?: boolean;
  isPaper?: boolean;
  format: string;
  variantOf?: "pigments";
  shortDescription: string;
  description: string[];
  benefits: string[];
  includesPigments?: string[];
  paperSpec?: PaperSpec;
};

export type SharedPanSpec = {
  format: string;
  binder: string;
  fillers: string;
  lightfastnessRange: string;
  certification: string;
  madeIn: string;
  batchSize: number;
};

export type Shipping = {
  origin: string;
  transit: string;
  cost: string;
  freeThreshold: number;
  duty: string;
  returns: string;
};

export type Catalog = {
  sharedPanSpec: SharedPanSpec;
  shipping: Shipping;
  products: Product[];
};

export type CartLineItem = {
  key: string;
  productId: string;
  variantId: string | null;
  name: string;
  unitPrice: number;
  variantLabel?: string;
  qty: number;
};
