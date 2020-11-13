export type PreCreationItem = {
  category_id: number;
  link: string;
}

export type CreationItem = PreCreationItem & {
  last_scraped_at?: string;
  created_at?: string;
}

export type UnfinishedItem = CreationItem & {
  id: string;
  vendor_id: number;
}

type Item = UnfinishedItem & {
  price_usd: number;
  price_msrp_usd: number | null;
  title: string;
  z_in: number[];
  x_in: number[];
  y_in: number[];
  star_count: number;
  reviewers_count: number;
  manufacturer: string | null;
  has_free_shipping: boolean;
  colors: string[] | null;
  materials: string[] | null;
  image_links: string[] | null;
  shipping_speed_days: number | null;
  in_stock: boolean;
  restock_date: string | null;
}

export default Item;