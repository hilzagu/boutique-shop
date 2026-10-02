import { supabaseAdmin } from "./supabase";

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price_cents: number;
  category: string;
  sizes: string[];
  colors: string[];
  image_url: string;
  stock: number;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabaseAdmin
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Failed to fetch products: ${error.message}`);
  return data || [];
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const { data, error } = await supabaseAdmin
    .from("products")
    .select("*")
    .eq("featured", true)
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Failed to fetch featured products: ${error.message}`);
  return data || [];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabaseAdmin
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) return null;
  return data;
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const { data, error } = await supabaseAdmin
    .from("products")
    .select("*")
    .eq("category", category)
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Failed to fetch products: ${error.message}`);
  return data || [];
}
