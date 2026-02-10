// Database types - will be generated from Supabase schema
// For now, define the core types manually

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      leads: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          email: string
          first_name: string | null
          last_name: string | null
          phone: string | null
          interest: string | null
          project_type: string | null
          message: string | null
          source: string | null
          utm_source: string | null
          utm_medium: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_term: string | null
          referrer: string | null
          landing_page: string | null
          session_id: string | null
          status: string
          assigned_to: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          email: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          interest?: string | null
          project_type?: string | null
          message?: string | null
          source?: string | null
          utm_source?: string | null
          utm_medium?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_term?: string | null
          referrer?: string | null
          landing_page?: string | null
          session_id?: string | null
          status?: string
          assigned_to?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          email?: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          interest?: string | null
          project_type?: string | null
          message?: string | null
          source?: string | null
          utm_source?: string | null
          utm_medium?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_term?: string | null
          referrer?: string | null
          landing_page?: string | null
          session_id?: string | null
          status?: string
          assigned_to?: string | null
        }
      }
      projects: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          customer_id: string | null
          email: string
          first_name: string | null
          last_name: string | null
          phone: string | null
          product_type: string
          project_type: string | null
          mesh_type: string | null
          top_attachment: string | null
          total_width: number | null
          number_of_sides: number | null
          notes: string | null
          estimated_total: number | null
          status: string
          assigned_to: string | null
          share_token: string | null
          utm_source: string | null
          utm_medium: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_term: string | null
          referrer: string | null
          landing_page: string | null
          session_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          customer_id?: string | null
          email: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          product_type: string
          project_type?: string | null
          mesh_type?: string | null
          top_attachment?: string | null
          total_width?: number | null
          number_of_sides?: number | null
          notes?: string | null
          estimated_total?: number | null
          status?: string
          assigned_to?: string | null
          share_token?: string | null
          utm_source?: string | null
          utm_medium?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_term?: string | null
          referrer?: string | null
          landing_page?: string | null
          session_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          customer_id?: string | null
          email?: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          product_type?: string
          project_type?: string | null
          mesh_type?: string | null
          top_attachment?: string | null
          total_width?: number | null
          number_of_sides?: number | null
          notes?: string | null
          estimated_total?: number | null
          status?: string
          assigned_to?: string | null
          share_token?: string | null
          utm_source?: string | null
          utm_medium?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_term?: string | null
          referrer?: string | null
          landing_page?: string | null
          session_id?: string | null
        }
      }
      customers: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          email: string
          first_name: string | null
          last_name: string | null
          phone: string | null
          auth_user_id: string | null
          city: string | null
          state: string | null
          total_orders: number | null
          total_spent: number | null
          avg_order_value: number | null
          first_order_date: string | null
          last_order_date: string | null
          ltv_tier: string | null
          rfm_segment: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          email: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          auth_user_id?: string | null
          city?: string | null
          state?: string | null
          total_orders?: number | null
          total_spent?: number | null
          avg_order_value?: number | null
          first_order_date?: string | null
          last_order_date?: string | null
          ltv_tier?: string | null
          rfm_segment?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          email?: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          auth_user_id?: string | null
          city?: string | null
          state?: string | null
          total_orders?: number | null
          total_spent?: number | null
          avg_order_value?: number | null
          first_order_date?: string | null
          last_order_date?: string | null
          ltv_tier?: string | null
          rfm_segment?: string | null
        }
      }
      staff: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          auth_user_id: string | null
          name: string
          first_name: string | null
          last_name: string | null
          email: string
          role: string
          is_active: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          auth_user_id?: string | null
          name: string
          first_name?: string | null
          last_name?: string | null
          email: string
          role?: string
          is_active?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          auth_user_id?: string | null
          name?: string
          first_name?: string | null
          last_name?: string | null
          email?: string
          role?: string
          is_active?: boolean
        }
      }
      orders: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          order_number: string | null
          order_status: string
          payment_status: string
          customer_id: string | null
          customer_email: string
          customer_first_name: string | null
          customer_last_name: string | null
          subtotal: number | null
          shipping: number | null
          tax: number | null
          total_amount: number
          shipping_address: string | null
          city: string | null
          state: string | null
          zip_code: string | null
          paypal_order_id: string | null
          paypal_capture_id: string | null
          payer_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          order_number?: string | null
          order_status?: string
          payment_status?: string
          customer_id?: string | null
          customer_email: string
          customer_first_name?: string | null
          customer_last_name?: string | null
          subtotal?: number | null
          shipping?: number | null
          tax?: number | null
          total_amount: number
          shipping_address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          paypal_order_id?: string | null
          paypal_capture_id?: string | null
          payer_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          order_number?: string | null
          order_status?: string
          payment_status?: string
          customer_id?: string | null
          customer_email?: string
          customer_first_name?: string | null
          customer_last_name?: string | null
          subtotal?: number | null
          shipping?: number | null
          tax?: number | null
          total_amount?: number
          shipping_address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          paypal_order_id?: string | null
          paypal_capture_id?: string | null
          payer_id?: string | null
        }
      }
      products: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          sku: string
          name: string
          description: string | null
          product_type: string
          base_price: number
          is_active: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          sku: string
          name: string
          description?: string | null
          product_type: string
          base_price: number
          is_active?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          sku?: string
          name?: string
          description?: string | null
          product_type?: string
          base_price?: number
          is_active?: boolean
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
