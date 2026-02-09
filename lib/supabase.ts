import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          password_hash: string
          role: string
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          password_hash: string
          role?: string
          is_active?: boolean
        }
        Update: {
          id?: string
          email?: string
          password_hash?: string
          role?: string
          is_active?: boolean
        }
      }
      products: {
        Row: {
          id: string
          name: string
          description: string | null
          price: number
          stock: number
          status: 'active' | 'paused'
          is_featured: boolean
          featured_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          price: number
          stock?: number
          status?: 'active' | 'paused'
          is_featured?: boolean
          featured_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          price?: number
          stock?: number
          status?: 'active' | 'paused'
          is_featured?: boolean
          featured_at?: string | null
        }
      }
      product_media: {
        Row: {
          id: string
          product_id: string
          type: string
          url: string
          is_primary: boolean
          order: number
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          type: string
          url: string
          is_primary?: boolean
          order?: number
        }
        Update: {
          id?: string
          product_id?: string
          type?: string
          url?: string
          is_primary?: boolean
          order?: number
        }
      }
      orders: {
        Row: {
          id: string
          customer_name: string
          customer_phone: string
          customer_email: string | null
          notes: string | null
          total_amount: number
          payment_method: string
          current_status: string
          created_at: string
        }
        Insert: {
          id?: string
          customer_name: string
          customer_phone: string
          customer_email?: string | null
          notes?: string | null
          total_amount: number
          payment_method: string
          current_status?: string
        }
        Update: {
          id?: string
          customer_name?: string
          customer_phone?: string
          customer_email?: string | null
          notes?: string | null
          total_amount?: number
          payment_method?: string
          current_status?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          product_name: string
          quantity: number
          unit_price: number
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          product_name: string
          quantity: number
          unit_price: number
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          product_name?: string
          quantity?: number
          unit_price?: number
        }
      }
    }
  }
}