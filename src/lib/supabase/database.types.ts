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
        }
      }
      staff: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          auth_user_id: string
          name: string
          email: string
          role: string
          is_active: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          auth_user_id: string
          name: string
          email: string
          role?: string
          is_active?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          auth_user_id?: string
          name?: string
          email?: string
          role?: string
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
