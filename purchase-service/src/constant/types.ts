export interface TokenPayload {
  user_id: number;
  email: string;
  username: string;
  iat: number;
  exp: number;
}

export interface User {
  user_id: number;
  username: string;
  email: string;
  password: string;
  full_name: string;
  phone_number: string;
  address: string;
  role: string;
  created_at: string;
  updated_at: string;
  avatar: string;
  date_of_birth: string;
}

export interface StoresProducts {
  stores_products_id: number;
  store_id: number;
  product_id: number;
  stock_quantity: number;
  rating: string;
  view: number;
  sold: number;
  price_before_discount: string;
  price: string;
  stores: Store;
  products: Product;
}

export interface Store {
  store_id: number;
  store_name: string;
  address: string;
  phone_number: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  product_id: number;
  product_name: string;
  description: string;
  category_id: number;
  image_url: string;
  images: string[];
  created_at: string;
  updated_at: string;
}

export interface ProductElastic {
  updated_at: string;
  view: number;
  sold: number;
  rating: number;
  price: number;
  store_id: number;
  product_id: number;
  product_name: string;
  created_at: string;
  price_before_discount: number;
  category_name: string;
  stores_products_id: number;
  store_name: string;
  stock_quantity: number;
  category_id: number;
}

export interface Pagination {
  total: any;
  page: number;
  limit: number;
  page_size: number;
}

export interface Shipping {
  shipping_id: number;
  purchase_id: number;
  created_at: string;
  updated_at: string;
}
