export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      ab_experiments: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          end_date: string | null
          hypothesis: string | null
          id: string
          name: string
          primary_metric: string
          secondary_metrics: Json | null
          start_date: string | null
          status: string
          target_audience: string | null
          traffic_allocation: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          hypothesis?: string | null
          id?: string
          name: string
          primary_metric: string
          secondary_metrics?: Json | null
          start_date?: string | null
          status?: string
          target_audience?: string | null
          traffic_allocation?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          hypothesis?: string | null
          id?: string
          name?: string
          primary_metric?: string
          secondary_metrics?: Json | null
          start_date?: string | null
          status?: string
          target_audience?: string | null
          traffic_allocation?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      ab_results: {
        Row: {
          confidence_level: number | null
          conversion_rate: number | null
          experiment_id: string
          id: string
          is_significant: boolean | null
          metric_name: string
          metric_value: number
          recorded_at: string
          sample_size: number | null
          variant_id: string
        }
        Insert: {
          confidence_level?: number | null
          conversion_rate?: number | null
          experiment_id: string
          id?: string
          is_significant?: boolean | null
          metric_name: string
          metric_value: number
          recorded_at?: string
          sample_size?: number | null
          variant_id: string
        }
        Update: {
          confidence_level?: number | null
          conversion_rate?: number | null
          experiment_id?: string
          id?: string
          is_significant?: boolean | null
          metric_name?: string
          metric_value?: number
          recorded_at?: string
          sample_size?: number | null
          variant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ab_results_experiment_id_fkey"
            columns: ["experiment_id"]
            isOneToOne: false
            referencedRelation: "ab_experiments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ab_results_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "ab_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      ab_user_assignments: {
        Row: {
          assigned_at: string
          conversion_value: number | null
          converted: boolean | null
          converted_at: string | null
          experiment_id: string
          id: string
          session_id: string | null
          user_id: string | null
          variant_id: string
        }
        Insert: {
          assigned_at?: string
          conversion_value?: number | null
          converted?: boolean | null
          converted_at?: string | null
          experiment_id: string
          id?: string
          session_id?: string | null
          user_id?: string | null
          variant_id: string
        }
        Update: {
          assigned_at?: string
          conversion_value?: number | null
          converted?: boolean | null
          converted_at?: string | null
          experiment_id?: string
          id?: string
          session_id?: string | null
          user_id?: string | null
          variant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ab_user_assignments_experiment_id_fkey"
            columns: ["experiment_id"]
            isOneToOne: false
            referencedRelation: "ab_experiments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ab_user_assignments_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "ab_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      ab_variants: {
        Row: {
          created_at: string
          description: string | null
          experiment_id: string
          id: string
          is_control: boolean | null
          name: string
          traffic_weight: number | null
          variant_config: Json | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          experiment_id: string
          id?: string
          is_control?: boolean | null
          name: string
          traffic_weight?: number | null
          variant_config?: Json | null
        }
        Update: {
          created_at?: string
          description?: string | null
          experiment_id?: string
          id?: string
          is_control?: boolean | null
          name?: string
          traffic_weight?: number | null
          variant_config?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "ab_variants_experiment_id_fkey"
            columns: ["experiment_id"]
            isOneToOne: false
            referencedRelation: "ab_experiments"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          message: string
          notification_type: string
          target_admin_id: string | null
          title: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          notification_type?: string
          target_admin_id?: string | null
          title: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          notification_type?: string
          target_admin_id?: string | null
          title?: string
        }
        Relationships: []
      }
      admin_settings: {
        Row: {
          created_at: string
          description: string | null
          id: string
          key: string
          updated_at: string
          updated_by: string | null
          value: Json
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          key: string
          updated_at?: string
          updated_by?: string | null
          value: Json
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          key?: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Relationships: []
      }
      ai_predictions: {
        Row: {
          confidence_score: number | null
          created_at: string
          expires_at: string | null
          id: string
          input_data: Json
          model_version: string | null
          prediction_result: Json
          prediction_type: string
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string
          expires_at?: string | null
          id?: string
          input_data: Json
          model_version?: string | null
          prediction_result: Json
          prediction_type: string
        }
        Update: {
          confidence_score?: number | null
          created_at?: string
          expires_at?: string | null
          id?: string
          input_data?: Json
          model_version?: string | null
          prediction_result?: Json
          prediction_type?: string
        }
        Relationships: []
      }
      api_usage: {
        Row: {
          created_at: string
          endpoint: string
          id: string
          method: string
          request_body: Json | null
          response_time_ms: number | null
          status_code: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          endpoint: string
          id?: string
          method: string
          request_body?: Json | null
          response_time_ms?: number | null
          status_code?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          endpoint?: string
          id?: string
          method?: string
          request_body?: Json | null
          response_time_ms?: number | null
          status_code?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: string | null
          new_values: Json | null
          old_values: Json | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: string | null
          new_values?: Json | null
          old_values?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: string | null
          new_values?: Json | null
          old_values?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      clickstream_events: {
        Row: {
          created_at: string
          element_class: string | null
          element_id: string | null
          element_text: string | null
          event_type: string
          id: string
          metadata: Json | null
          page_url: string | null
          session_id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          element_class?: string | null
          element_id?: string | null
          element_text?: string | null
          event_type: string
          id?: string
          metadata?: Json | null
          page_url?: string | null
          session_id: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          element_class?: string | null
          element_id?: string | null
          element_text?: string | null
          event_type?: string
          id?: string
          metadata?: Json | null
          page_url?: string | null
          session_id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      client_feedback: {
        Row: {
          comment: string | null
          created_at: string
          feedback_type: string | null
          id: string
          milestone_id: string | null
          project_id: string | null
          rating: number | null
          user_id: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string
          feedback_type?: string | null
          id?: string
          milestone_id?: string | null
          project_id?: string | null
          rating?: number | null
          user_id?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string
          feedback_type?: string | null
          id?: string
          milestone_id?: string | null
          project_id?: string | null
          rating?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_feedback_milestone_id_fkey"
            columns: ["milestone_id"]
            isOneToOne: false
            referencedRelation: "project_milestones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_feedback_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_feedback_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      client_files: {
        Row: {
          created_at: string
          file_path: string
          file_size: number | null
          file_type: string | null
          folder: string | null
          id: string
          name: string
          project_id: string | null
          uploaded_by: string | null
          user_id: string | null
          version: number | null
        }
        Insert: {
          created_at?: string
          file_path: string
          file_size?: number | null
          file_type?: string | null
          folder?: string | null
          id?: string
          name: string
          project_id?: string | null
          uploaded_by?: string | null
          user_id?: string | null
          version?: number | null
        }
        Update: {
          created_at?: string
          file_path?: string
          file_size?: number | null
          file_type?: string | null
          folder?: string | null
          id?: string
          name?: string
          project_id?: string | null
          uploaded_by?: string | null
          user_id?: string | null
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "client_files_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_files_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      client_msp_alerts: {
        Row: {
          alert_type: string
          created_at: string
          id: string
          is_resolved: boolean
          message: string
          resolved_at: string | null
          server_id: string
          severity: string
          tenant_id: string
        }
        Insert: {
          alert_type: string
          created_at?: string
          id?: string
          is_resolved?: boolean
          message: string
          resolved_at?: string | null
          server_id: string
          severity?: string
          tenant_id: string
        }
        Update: {
          alert_type?: string
          created_at?: string
          id?: string
          is_resolved?: boolean
          message?: string
          resolved_at?: string | null
          server_id?: string
          severity?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_msp_alerts_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "client_msp_servers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_msp_alerts_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "client_tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      client_msp_metrics: {
        Row: {
          cpu_usage: number | null
          disk_usage: number | null
          id: string
          memory_usage: number | null
          network_in: number | null
          network_out: number | null
          recorded_at: string
          server_id: string
          uptime_seconds: number | null
        }
        Insert: {
          cpu_usage?: number | null
          disk_usage?: number | null
          id?: string
          memory_usage?: number | null
          network_in?: number | null
          network_out?: number | null
          recorded_at?: string
          server_id: string
          uptime_seconds?: number | null
        }
        Update: {
          cpu_usage?: number | null
          disk_usage?: number | null
          id?: string
          memory_usage?: number | null
          network_in?: number | null
          network_out?: number | null
          recorded_at?: string
          server_id?: string
          uptime_seconds?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "client_msp_metrics_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "client_msp_servers"
            referencedColumns: ["id"]
          },
        ]
      }
      client_msp_servers: {
        Row: {
          created_at: string
          hostname: string | null
          id: string
          ip_address: string | null
          last_ping_at: string | null
          name: string
          server_type: string
          status: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          hostname?: string | null
          id?: string
          ip_address?: string | null
          last_ping_at?: string | null
          name: string
          server_type?: string
          status?: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          hostname?: string | null
          id?: string
          ip_address?: string | null
          last_ping_at?: string | null
          name?: string
          server_type?: string
          status?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_msp_servers_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "client_tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      client_notices: {
        Row: {
          content: string
          created_at: string
          created_by: string | null
          expires_at: string | null
          id: string
          is_active: boolean
          notice_type: string
          target_type: string
          target_users: Json | null
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean
          notice_type?: string
          target_type?: string
          target_users?: Json | null
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean
          notice_type?: string
          target_type?: string
          target_users?: Json | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      client_onboarding: {
        Row: {
          company_name: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          notes: string | null
          phone: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          service_interests: Json | null
          status: string
          updated_at: string
        }
        Insert: {
          company_name?: string | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          notes?: string | null
          phone?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          service_interests?: Json | null
          status?: string
          updated_at?: string
        }
        Update: {
          company_name?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          notes?: string | null
          phone?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          service_interests?: Json | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      client_tenant_users: {
        Row: {
          created_at: string
          id: string
          role: string
          tenant_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: string
          tenant_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: string
          tenant_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_tenant_users_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "client_tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      client_tenants: {
        Row: {
          address: string | null
          contact_email: string
          contact_phone: string | null
          created_at: string
          id: string
          logo_url: string | null
          name: string
          settings: Json | null
          slug: string
          status: string
          tenant_type: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          contact_email: string
          contact_phone?: string | null
          created_at?: string
          id?: string
          logo_url?: string | null
          name: string
          settings?: Json | null
          slug: string
          status?: string
          tenant_type?: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          contact_email?: string
          contact_phone?: string | null
          created_at?: string
          id?: string
          logo_url?: string | null
          name?: string
          settings?: Json | null
          slug?: string
          status?: string
          tenant_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      compliance_items: {
        Row: {
          assigned_to: string | null
          category: string
          completed_at: string | null
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          category: string
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          category?: string
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      coupon_codes: {
        Row: {
          code: string
          created_at: string
          current_uses: number | null
          discount_type: string
          discount_value: number
          id: string
          is_active: boolean
          max_uses: number | null
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          code: string
          created_at?: string
          current_uses?: number | null
          discount_type?: string
          discount_value?: number
          id?: string
          is_active?: boolean
          max_uses?: number | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          current_uses?: number | null
          discount_type?: string
          discount_value?: number
          id?: string
          is_active?: boolean
          max_uses?: number | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: []
      }
      inquiries: {
        Row: {
          company: string | null
          created_at: string | null
          email: string
          id: string
          message: string | null
          name: string
          phone: string | null
          service_interest: string | null
          source: string | null
          user_id: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string | null
          email: string
          id?: string
          message?: string | null
          name: string
          phone?: string | null
          service_interest?: string | null
          source?: string | null
          user_id?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string | null
          email?: string
          id?: string
          message?: string | null
          name?: string
          phone?: string | null
          service_interest?: string | null
          source?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inquiries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      integrations: {
        Row: {
          config: Json | null
          created_at: string
          id: string
          is_active: boolean
          last_sync_at: string | null
          name: string
          type: string
          updated_at: string
        }
        Insert: {
          config?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean
          last_sync_at?: string | null
          name: string
          type: string
          updated_at?: string
        }
        Update: {
          config?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean
          last_sync_at?: string | null
          name?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      invoice_downloads: {
        Row: {
          created_at: string
          download_type: string
          downloaded_by: string | null
          downloaded_by_email: string | null
          downloaded_by_name: string | null
          id: string
          invoice_id: string | null
          ip_address: string | null
          user_agent: string | null
        }
        Insert: {
          created_at?: string
          download_type?: string
          downloaded_by?: string | null
          downloaded_by_email?: string | null
          downloaded_by_name?: string | null
          id?: string
          invoice_id?: string | null
          ip_address?: string | null
          user_agent?: string | null
        }
        Update: {
          created_at?: string
          download_type?: string
          downloaded_by?: string | null
          downloaded_by_email?: string | null
          downloaded_by_name?: string | null
          id?: string
          invoice_id?: string | null
          ip_address?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoice_downloads_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          amount: number
          created_at: string | null
          due_date: string | null
          id: string
          invoice_number: string
          notes: string | null
          paid_at: string | null
          quote_id: string | null
          reminder_count: number | null
          reminder_sent_at: string | null
          status: Database["public"]["Enums"]["invoice_status"] | null
          tax_amount: number
          tax_percent: number | null
          total_amount: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          due_date?: string | null
          id?: string
          invoice_number: string
          notes?: string | null
          paid_at?: string | null
          quote_id?: string | null
          reminder_count?: number | null
          reminder_sent_at?: string | null
          status?: Database["public"]["Enums"]["invoice_status"] | null
          tax_amount: number
          tax_percent?: number | null
          total_amount: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          due_date?: string | null
          id?: string
          invoice_number?: string
          notes?: string | null
          paid_at?: string | null
          quote_id?: string | null
          reminder_count?: number | null
          reminder_sent_at?: string | null
          status?: Database["public"]["Enums"]["invoice_status"] | null
          tax_amount?: number
          tax_percent?: number | null
          total_amount?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          assigned_to: string | null
          company: string | null
          converted_at: string | null
          created_at: string
          email: string
          id: string
          last_contact_at: string | null
          name: string
          notes: string | null
          phone: string | null
          score: number | null
          source: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          company?: string | null
          converted_at?: string | null
          created_at?: string
          email: string
          id?: string
          last_contact_at?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          score?: number | null
          source?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          company?: string | null
          converted_at?: string | null
          created_at?: string
          email?: string
          id?: string
          last_contact_at?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          score?: number | null
          source?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      meetings: {
        Row: {
          created_at: string
          description: string | null
          duration_minutes: number | null
          id: string
          meeting_link: string | null
          meeting_type: string | null
          notes: string | null
          project_id: string | null
          recording_url: string | null
          scheduled_at: string
          status: string | null
          title: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          meeting_link?: string | null
          meeting_type?: string | null
          notes?: string | null
          project_id?: string | null
          recording_url?: string | null
          scheduled_at: string
          status?: string | null
          title: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          meeting_link?: string | null
          meeting_type?: string | null
          notes?: string | null
          project_id?: string | null
          recording_url?: string | null
          scheduled_at?: string
          status?: string | null
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "meetings_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meetings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_sessions: {
        Row: {
          approval_notes: string | null
          approved_at: string | null
          approved_by: string | null
          assigned_pm: string | null
          assigned_team: Json | null
          client_id: string
          client_type: string
          company_name: string | null
          consent_accepted: Json | null
          created_at: string
          current_step: number | null
          dashboard_tier: string | null
          email: string
          full_name: string
          id: string
          industry_subtype: string | null
          industry_type: string
          phone: string | null
          pricing_snapshot: Json | null
          quote_id: string | null
          selected_addons: Json | null
          selected_services: Json | null
          status: string
          updated_at: string
          user_id: string | null
          verification_code: string | null
          verification_sent_at: string | null
          verified_at: string | null
        }
        Insert: {
          approval_notes?: string | null
          approved_at?: string | null
          approved_by?: string | null
          assigned_pm?: string | null
          assigned_team?: Json | null
          client_id: string
          client_type: string
          company_name?: string | null
          consent_accepted?: Json | null
          created_at?: string
          current_step?: number | null
          dashboard_tier?: string | null
          email: string
          full_name: string
          id?: string
          industry_subtype?: string | null
          industry_type: string
          phone?: string | null
          pricing_snapshot?: Json | null
          quote_id?: string | null
          selected_addons?: Json | null
          selected_services?: Json | null
          status?: string
          updated_at?: string
          user_id?: string | null
          verification_code?: string | null
          verification_sent_at?: string | null
          verified_at?: string | null
        }
        Update: {
          approval_notes?: string | null
          approved_at?: string | null
          approved_by?: string | null
          assigned_pm?: string | null
          assigned_team?: Json | null
          client_id?: string
          client_type?: string
          company_name?: string | null
          consent_accepted?: Json | null
          created_at?: string
          current_step?: number | null
          dashboard_tier?: string | null
          email?: string
          full_name?: string
          id?: string
          industry_subtype?: string | null
          industry_type?: string
          phone?: string | null
          pricing_snapshot?: Json | null
          quote_id?: string | null
          selected_addons?: Json | null
          selected_services?: Json | null
          status?: string
          updated_at?: string
          user_id?: string | null
          verification_code?: string | null
          verification_sent_at?: string | null
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_sessions_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      portal_settings: {
        Row: {
          created_at: string
          description: string | null
          id: string
          key: string
          updated_at: string
          updated_by: string | null
          value: Json
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          key: string
          updated_at?: string
          updated_by?: string | null
          value: Json
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          key?: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Relationships: []
      }
      pricing_modifiers: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          modifier_key: string
          modifier_type: string
          multiplier: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          modifier_key: string
          modifier_type: string
          multiplier?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          modifier_key?: string
          modifier_type?: string
          multiplier?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          company_name: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          phone: string | null
          tenant_id: string | null
          updated_at: string | null
        }
        Insert: {
          company_name?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          phone?: string | null
          tenant_id?: string | null
          updated_at?: string | null
        }
        Update: {
          company_name?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          tenant_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "client_tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      project_milestones: {
        Row: {
          completed_at: string | null
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          name: string
          project_id: string | null
          status: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          name: string
          project_id?: string | null
          status?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          name?: string
          project_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_milestones_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          budget: number | null
          created_at: string
          description: string | null
          due_date: string | null
          health_score: number | null
          id: string
          name: string
          phase: string | null
          progress: number | null
          start_date: string | null
          status: string
          team_members: Json | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          budget?: number | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          health_score?: number | null
          id?: string
          name: string
          phase?: string | null
          progress?: number | null
          start_date?: string | null
          status?: string
          team_members?: Json | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          budget?: number | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          health_score?: number | null
          id?: string
          name?: string
          phase?: string | null
          progress?: number | null
          start_date?: string | null
          status?: string
          team_members?: Json | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      quotes: {
        Row: {
          addons: Json | null
          client_type: string
          complexity: string
          contact_company: string | null
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          coupon_code: string | null
          created_at: string | null
          discount_percent: number | null
          estimated_price: number
          features: Json | null
          final_price: number
          id: string
          notes: string | null
          quote_number: string
          service_type: string
          status: Database["public"]["Enums"]["quote_status"] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          addons?: Json | null
          client_type: string
          complexity: string
          contact_company?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          coupon_code?: string | null
          created_at?: string | null
          discount_percent?: number | null
          estimated_price: number
          features?: Json | null
          final_price: number
          id?: string
          notes?: string | null
          quote_number: string
          service_type: string
          status?: Database["public"]["Enums"]["quote_status"] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          addons?: Json | null
          client_type?: string
          complexity?: string
          contact_company?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          coupon_code?: string | null
          created_at?: string | null
          discount_percent?: number | null
          estimated_price?: number
          features?: Json | null
          final_price?: number
          id?: string
          notes?: string | null
          quote_number?: string
          service_type?: string
          status?: Database["public"]["Enums"]["quote_status"] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quotes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      service_addons: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          price: number
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          price?: number
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          price?: number
        }
        Relationships: []
      }
      service_pricing: {
        Row: {
          base_price: number
          created_at: string
          description: string | null
          features: Json | null
          id: string
          is_active: boolean
          plan_tier: string
          service_category: string
          service_name: string
          updated_at: string
        }
        Insert: {
          base_price?: number
          created_at?: string
          description?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean
          plan_tier?: string
          service_category: string
          service_name: string
          updated_at?: string
        }
        Update: {
          base_price?: number
          created_at?: string
          description?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean
          plan_tier?: string
          service_category?: string
          service_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      session_recordings: {
        Row: {
          created_at: string
          device_fingerprint: string | null
          duration_ms: number | null
          end_time: string | null
          event_count: number | null
          events: Json
          geolocation: Json | null
          id: string
          ip_address: string | null
          metadata: Json | null
          page_count: number | null
          pages_visited: Json | null
          session_id: string
          start_time: string
          updated_at: string
          user_agent: string | null
          visitor_id: string | null
        }
        Insert: {
          created_at?: string
          device_fingerprint?: string | null
          duration_ms?: number | null
          end_time?: string | null
          event_count?: number | null
          events?: Json
          geolocation?: Json | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          page_count?: number | null
          pages_visited?: Json | null
          session_id: string
          start_time?: string
          updated_at?: string
          user_agent?: string | null
          visitor_id?: string | null
        }
        Update: {
          created_at?: string
          device_fingerprint?: string | null
          duration_ms?: number | null
          end_time?: string | null
          event_count?: number | null
          events?: Json
          geolocation?: Json | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          page_count?: number | null
          pages_visited?: Json | null
          session_id?: string
          start_time?: string
          updated_at?: string
          user_agent?: string | null
          visitor_id?: string | null
        }
        Relationships: []
      }
      sidebar_access_logs: {
        Row: {
          action_type: string
          admin_user_id: string | null
          copy_from_role: string | null
          created_at: string
          id: string
          metadata: Json | null
          module_id: string | null
          new_value: boolean | null
          previous_value: boolean | null
          role_affected: string
          tenant_id: string | null
        }
        Insert: {
          action_type?: string
          admin_user_id?: string | null
          copy_from_role?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          module_id?: string | null
          new_value?: boolean | null
          previous_value?: boolean | null
          role_affected: string
          tenant_id?: string | null
        }
        Update: {
          action_type?: string
          admin_user_id?: string | null
          copy_from_role?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          module_id?: string | null
          new_value?: boolean | null
          previous_value?: boolean | null
          role_affected?: string
          tenant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sidebar_access_logs_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "client_tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      support_tickets: {
        Row: {
          assigned_to: string | null
          created_at: string
          description: string | null
          id: string
          priority: string | null
          project_id: string | null
          resolved_at: string | null
          sla_due_at: string | null
          status: string | null
          subject: string
          ticket_number: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          description?: string | null
          id?: string
          priority?: string | null
          project_id?: string | null
          resolved_at?: string | null
          sla_due_at?: string | null
          status?: string | null
          subject: string
          ticket_number: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          description?: string | null
          id?: string
          priority?: string | null
          project_id?: string | null
          resolved_at?: string | null
          sla_due_at?: string | null
          status?: string | null
          subject?: string
          ticket_number?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "support_tickets_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "support_tickets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      system_logs: {
        Row: {
          created_at: string
          id: string
          level: string
          message: string
          metadata: Json | null
          source: string
        }
        Insert: {
          created_at?: string
          id?: string
          level: string
          message: string
          metadata?: Json | null
          source: string
        }
        Update: {
          created_at?: string
          id?: string
          level?: string
          message?: string
          metadata?: Json | null
          source?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          availability: string | null
          avatar_url: string | null
          created_at: string
          department: string | null
          email: string
          id: string
          name: string
          role: string
          skills: Json | null
          user_id: string | null
        }
        Insert: {
          availability?: string | null
          avatar_url?: string | null
          created_at?: string
          department?: string | null
          email: string
          id?: string
          name: string
          role: string
          skills?: Json | null
          user_id?: string | null
        }
        Update: {
          availability?: string | null
          avatar_url?: string | null
          created_at?: string
          department?: string | null
          email?: string
          id?: string
          name?: string
          role?: string
          skills?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      ticket_messages: {
        Row: {
          created_at: string
          id: string
          is_internal: boolean | null
          message: string
          ticket_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_internal?: boolean | null
          message: string
          ticket_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_internal?: boolean | null
          message?: string
          ticket_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ticket_messages_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "support_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      traceflow_ai_queue: {
        Row: {
          completed_at: string | null
          created_at: string
          error_message: string | null
          id: string
          llm_model: string | null
          llm_used: string | null
          payload: Json
          priority: number | null
          processing_time_ms: number | null
          result: Json | null
          started_at: string | null
          status: string | null
          task_type: string
          tenant_id: string | null
          tokens_used: number | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          llm_model?: string | null
          llm_used?: string | null
          payload: Json
          priority?: number | null
          processing_time_ms?: number | null
          result?: Json | null
          started_at?: string | null
          status?: string | null
          task_type: string
          tenant_id?: string | null
          tokens_used?: number | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          llm_model?: string | null
          llm_used?: string | null
          payload?: Json
          priority?: number | null
          processing_time_ms?: number | null
          result?: Json | null
          started_at?: string | null
          status?: string | null
          task_type?: string
          tenant_id?: string | null
          tokens_used?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "traceflow_ai_queue_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "client_tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      traceflow_api_keys: {
        Row: {
          created_at: string | null
          created_by: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          key_hash: string
          key_prefix: string
          last_used_at: string | null
          name: string
          permissions: string[] | null
          rate_limit: number | null
          subscription_id: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          key_hash: string
          key_prefix: string
          last_used_at?: string | null
          name: string
          permissions?: string[] | null
          rate_limit?: number | null
          subscription_id?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          key_hash?: string
          key_prefix?: string
          last_used_at?: string | null
          name?: string
          permissions?: string[] | null
          rate_limit?: number | null
          subscription_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "traceflow_api_keys_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "traceflow_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      traceflow_audit_logs: {
        Row: {
          action: string
          created_at: string | null
          id: string
          ip_address: string | null
          new_value: Json | null
          old_value: Json | null
          resource_id: string | null
          resource_type: string
          subscription_id: string | null
          user_agent: string | null
          user_email: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
          new_value?: Json | null
          old_value?: Json | null
          resource_id?: string | null
          resource_type: string
          subscription_id?: string | null
          user_agent?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
          new_value?: Json | null
          old_value?: Json | null
          resource_id?: string | null
          resource_type?: string
          subscription_id?: string | null
          user_agent?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "traceflow_audit_logs_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "traceflow_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      traceflow_compliance_settings: {
        Row: {
          allowed_domains: string[] | null
          blocked_ips: string[] | null
          created_at: string | null
          data_retention_days: number | null
          gdpr_mode: boolean | null
          hipaa_mode: boolean | null
          id: string
          pii_masking_enabled: boolean | null
          session_recording_enabled: boolean | null
          subscription_id: string | null
          updated_at: string | null
        }
        Insert: {
          allowed_domains?: string[] | null
          blocked_ips?: string[] | null
          created_at?: string | null
          data_retention_days?: number | null
          gdpr_mode?: boolean | null
          hipaa_mode?: boolean | null
          id?: string
          pii_masking_enabled?: boolean | null
          session_recording_enabled?: boolean | null
          subscription_id?: string | null
          updated_at?: string | null
        }
        Update: {
          allowed_domains?: string[] | null
          blocked_ips?: string[] | null
          created_at?: string | null
          data_retention_days?: number | null
          gdpr_mode?: boolean | null
          hipaa_mode?: boolean | null
          id?: string
          pii_masking_enabled?: boolean | null
          session_recording_enabled?: boolean | null
          subscription_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "traceflow_compliance_settings_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: true
            referencedRelation: "traceflow_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      traceflow_events: {
        Row: {
          browser: string | null
          created_at: string
          device_type: string | null
          element_selector: string | null
          element_text: string | null
          event_type: string
          id: string
          metadata: Json | null
          os: string | null
          page_url: string | null
          session_id: string
          tenant_id: string | null
          timestamp: string
          viewport_height: number | null
          viewport_width: number | null
          x_position: number | null
          y_position: number | null
        }
        Insert: {
          browser?: string | null
          created_at?: string
          device_type?: string | null
          element_selector?: string | null
          element_text?: string | null
          event_type: string
          id?: string
          metadata?: Json | null
          os?: string | null
          page_url?: string | null
          session_id: string
          tenant_id?: string | null
          timestamp?: string
          viewport_height?: number | null
          viewport_width?: number | null
          x_position?: number | null
          y_position?: number | null
        }
        Update: {
          browser?: string | null
          created_at?: string
          device_type?: string | null
          element_selector?: string | null
          element_text?: string | null
          event_type?: string
          id?: string
          metadata?: Json | null
          os?: string | null
          page_url?: string | null
          session_id?: string
          tenant_id?: string | null
          timestamp?: string
          viewport_height?: number | null
          viewport_width?: number | null
          x_position?: number | null
          y_position?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "traceflow_events_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "client_tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      traceflow_feature_access: {
        Row: {
          created_at: string | null
          current_usage: number | null
          enabled_for_roles:
            | Database["public"]["Enums"]["traceflow_role"][]
            | null
          feature_description: string | null
          feature_id: string
          feature_name: string
          id: string
          is_enabled: boolean | null
          subscription_id: string | null
          updated_at: string | null
          usage_limit: number | null
        }
        Insert: {
          created_at?: string | null
          current_usage?: number | null
          enabled_for_roles?:
            | Database["public"]["Enums"]["traceflow_role"][]
            | null
          feature_description?: string | null
          feature_id: string
          feature_name: string
          id?: string
          is_enabled?: boolean | null
          subscription_id?: string | null
          updated_at?: string | null
          usage_limit?: number | null
        }
        Update: {
          created_at?: string | null
          current_usage?: number | null
          enabled_for_roles?:
            | Database["public"]["Enums"]["traceflow_role"][]
            | null
          feature_description?: string | null
          feature_id?: string
          feature_name?: string
          id?: string
          is_enabled?: boolean | null
          subscription_id?: string | null
          updated_at?: string | null
          usage_limit?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "traceflow_feature_access_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "traceflow_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      traceflow_funnels: {
        Row: {
          ai_causality_analysis: string | null
          ai_improvement_suggestions: Json | null
          conversion_rate: number | null
          created_at: string
          description: string | null
          drop_off_analysis: Json | null
          id: string
          name: string
          status: string | null
          steps: Json
          tenant_id: string | null
          total_sessions: number | null
          updated_at: string
        }
        Insert: {
          ai_causality_analysis?: string | null
          ai_improvement_suggestions?: Json | null
          conversion_rate?: number | null
          created_at?: string
          description?: string | null
          drop_off_analysis?: Json | null
          id?: string
          name: string
          status?: string | null
          steps?: Json
          tenant_id?: string | null
          total_sessions?: number | null
          updated_at?: string
        }
        Update: {
          ai_causality_analysis?: string | null
          ai_improvement_suggestions?: Json | null
          conversion_rate?: number | null
          created_at?: string
          description?: string | null
          drop_off_analysis?: Json | null
          id?: string
          name?: string
          status?: string | null
          steps?: Json
          tenant_id?: string | null
          total_sessions?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "traceflow_funnels_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "client_tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      traceflow_heatmaps: {
        Row: {
          created_at: string
          data_points: Json
          date_range_end: string | null
          date_range_start: string | null
          device_type: string | null
          heatmap_type: string
          id: string
          page_url: string
          tenant_id: string | null
          total_sessions: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          data_points?: Json
          date_range_end?: string | null
          date_range_start?: string | null
          device_type?: string | null
          heatmap_type: string
          id?: string
          page_url: string
          tenant_id?: string | null
          total_sessions?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          data_points?: Json
          date_range_end?: string | null
          date_range_start?: string | null
          device_type?: string | null
          heatmap_type?: string
          id?: string
          page_url?: string
          tenant_id?: string | null
          total_sessions?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "traceflow_heatmaps_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "client_tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      traceflow_invoices: {
        Row: {
          billing_address: string | null
          billing_city: string | null
          billing_country: string | null
          billing_email: string | null
          billing_gst: string | null
          billing_name: string | null
          created_at: string | null
          id: string
          invoice_number: string
          paid_at: string | null
          payment_method: string | null
          plan: string
          status: string | null
          subtotal: number
          tax: number
          total: number
          user_id: string | null
        }
        Insert: {
          billing_address?: string | null
          billing_city?: string | null
          billing_country?: string | null
          billing_email?: string | null
          billing_gst?: string | null
          billing_name?: string | null
          created_at?: string | null
          id?: string
          invoice_number: string
          paid_at?: string | null
          payment_method?: string | null
          plan: string
          status?: string | null
          subtotal: number
          tax: number
          total: number
          user_id?: string | null
        }
        Update: {
          billing_address?: string | null
          billing_city?: string | null
          billing_country?: string | null
          billing_email?: string | null
          billing_gst?: string | null
          billing_name?: string | null
          created_at?: string | null
          id?: string
          invoice_number?: string
          paid_at?: string | null
          payment_method?: string | null
          plan?: string
          status?: string | null
          subtotal?: number
          tax?: number
          total?: number
          user_id?: string | null
        }
        Relationships: []
      }
      traceflow_neurorouter_logs: {
        Row: {
          cost_estimate: number | null
          created_at: string
          error_message: string | null
          id: string
          input_tokens: number | null
          latency_ms: number | null
          output_tokens: number | null
          routing_reason: string | null
          selected_llm: string
          selected_model: string
          success: boolean | null
          task_complexity: string | null
          task_type: string
        }
        Insert: {
          cost_estimate?: number | null
          created_at?: string
          error_message?: string | null
          id?: string
          input_tokens?: number | null
          latency_ms?: number | null
          output_tokens?: number | null
          routing_reason?: string | null
          selected_llm: string
          selected_model: string
          success?: boolean | null
          task_complexity?: string | null
          task_type: string
        }
        Update: {
          cost_estimate?: number | null
          created_at?: string
          error_message?: string | null
          id?: string
          input_tokens?: number | null
          latency_ms?: number | null
          output_tokens?: number | null
          routing_reason?: string | null
          selected_llm?: string
          selected_model?: string
          success?: boolean | null
          task_complexity?: string | null
          task_type?: string
        }
        Relationships: []
      }
      traceflow_sessions: {
        Row: {
          ai_analysis_status: string | null
          ai_root_cause: string | null
          ai_suggested_fix: string | null
          ai_summary: string | null
          browser: string | null
          city: string | null
          country: string | null
          created_at: string
          dead_click_count: number | null
          device_type: string | null
          duration_ms: number | null
          end_time: string | null
          error_count: number | null
          event_count: number | null
          frustration_score: number | null
          id: string
          ip_address: string | null
          metadata: Json | null
          os: string | null
          page_count: number | null
          rage_click_count: number | null
          replay_data: Json | null
          session_id: string
          start_time: string
          tenant_id: string | null
          updated_at: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          ai_analysis_status?: string | null
          ai_root_cause?: string | null
          ai_suggested_fix?: string | null
          ai_summary?: string | null
          browser?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          dead_click_count?: number | null
          device_type?: string | null
          duration_ms?: number | null
          end_time?: string | null
          error_count?: number | null
          event_count?: number | null
          frustration_score?: number | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          os?: string | null
          page_count?: number | null
          rage_click_count?: number | null
          replay_data?: Json | null
          session_id: string
          start_time?: string
          tenant_id?: string | null
          updated_at?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          ai_analysis_status?: string | null
          ai_root_cause?: string | null
          ai_suggested_fix?: string | null
          ai_summary?: string | null
          browser?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          dead_click_count?: number | null
          device_type?: string | null
          duration_ms?: number | null
          end_time?: string | null
          error_count?: number | null
          event_count?: number | null
          frustration_score?: number | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          os?: string | null
          page_count?: number | null
          rage_click_count?: number | null
          replay_data?: Json | null
          session_id?: string
          start_time?: string
          tenant_id?: string | null
          updated_at?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "traceflow_sessions_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "client_tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      traceflow_sso_config: {
        Row: {
          certificate: string | null
          client_id: string | null
          created_at: string | null
          domain: string | null
          enforce_sso: boolean | null
          id: string
          is_enabled: boolean | null
          metadata_url: string | null
          provider: string
          subscription_id: string | null
          updated_at: string | null
        }
        Insert: {
          certificate?: string | null
          client_id?: string | null
          created_at?: string | null
          domain?: string | null
          enforce_sso?: boolean | null
          id?: string
          is_enabled?: boolean | null
          metadata_url?: string | null
          provider: string
          subscription_id?: string | null
          updated_at?: string | null
        }
        Update: {
          certificate?: string | null
          client_id?: string | null
          created_at?: string | null
          domain?: string | null
          enforce_sso?: boolean | null
          id?: string
          is_enabled?: boolean | null
          metadata_url?: string | null
          provider?: string
          subscription_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "traceflow_sso_config_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: true
            referencedRelation: "traceflow_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      traceflow_subscriptions: {
        Row: {
          company_size: string | null
          created_at: string | null
          id: string
          industry: string | null
          invoice_id: string | null
          plan: string
          role: string | null
          status: string
          updated_at: string | null
          use_cases: Json | null
          user_id: string | null
          website: string | null
        }
        Insert: {
          company_size?: string | null
          created_at?: string | null
          id?: string
          industry?: string | null
          invoice_id?: string | null
          plan?: string
          role?: string | null
          status?: string
          updated_at?: string | null
          use_cases?: Json | null
          user_id?: string | null
          website?: string | null
        }
        Update: {
          company_size?: string | null
          created_at?: string | null
          id?: string
          industry?: string | null
          invoice_id?: string | null
          plan?: string
          role?: string | null
          status?: string
          updated_at?: string | null
          use_cases?: Json | null
          user_id?: string | null
          website?: string | null
        }
        Relationships: []
      }
      traceflow_team_members: {
        Row: {
          accepted_at: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          invited_at: string | null
          invited_by: string | null
          role: Database["public"]["Enums"]["traceflow_role"]
          status: string | null
          subscription_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id?: string
          invited_at?: string | null
          invited_by?: string | null
          role?: Database["public"]["Enums"]["traceflow_role"]
          status?: string | null
          subscription_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          accepted_at?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          invited_at?: string | null
          invited_by?: string | null
          role?: Database["public"]["Enums"]["traceflow_role"]
          status?: string | null
          subscription_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "traceflow_team_members_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "traceflow_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      traceflow_user_features: {
        Row: {
          created_at: string | null
          enabled_by: string | null
          feature_id: string
          id: string
          is_enabled: boolean | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          enabled_by?: string | null
          feature_id: string
          id?: string
          is_enabled?: boolean | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          enabled_by?: string | null
          feature_id?: string
          id?: string
          is_enabled?: boolean | null
          user_id?: string | null
        }
        Relationships: []
      }
      traceflow_ux_issues: {
        Row: {
          affected_sessions: number | null
          affected_users: number | null
          ai_code_hint: string | null
          ai_diagnosis: string | null
          ai_suggested_fix: string | null
          created_at: string
          element_screenshot_url: string | null
          element_selector: string | null
          estimated_revenue_impact: number | null
          first_seen: string
          github_issue_id: string | null
          id: string
          issue_type: string
          jira_ticket_id: string | null
          last_seen: string
          metadata: Json | null
          occurrence_count: number | null
          page_url: string
          severity: string | null
          status: string | null
          tenant_id: string | null
          updated_at: string
        }
        Insert: {
          affected_sessions?: number | null
          affected_users?: number | null
          ai_code_hint?: string | null
          ai_diagnosis?: string | null
          ai_suggested_fix?: string | null
          created_at?: string
          element_screenshot_url?: string | null
          element_selector?: string | null
          estimated_revenue_impact?: number | null
          first_seen?: string
          github_issue_id?: string | null
          id?: string
          issue_type: string
          jira_ticket_id?: string | null
          last_seen?: string
          metadata?: Json | null
          occurrence_count?: number | null
          page_url: string
          severity?: string | null
          status?: string | null
          tenant_id?: string | null
          updated_at?: string
        }
        Update: {
          affected_sessions?: number | null
          affected_users?: number | null
          ai_code_hint?: string | null
          ai_diagnosis?: string | null
          ai_suggested_fix?: string | null
          created_at?: string
          element_screenshot_url?: string | null
          element_selector?: string | null
          estimated_revenue_impact?: number | null
          first_seen?: string
          github_issue_id?: string | null
          id?: string
          issue_type?: string
          jira_ticket_id?: string | null
          last_seen?: string
          metadata?: Json | null
          occurrence_count?: number | null
          page_url?: string
          severity?: string | null
          status?: string | null
          tenant_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "traceflow_ux_issues_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "client_tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      traceflow_voice_feedback: {
        Row: {
          ai_analysis: string | null
          audio_url: string | null
          correlated_session_id: string | null
          created_at: string
          id: string
          sentiment: string | null
          sentiment_score: number | null
          session_id: string | null
          tenant_id: string | null
          topics: Json | null
          transcript: string | null
        }
        Insert: {
          ai_analysis?: string | null
          audio_url?: string | null
          correlated_session_id?: string | null
          created_at?: string
          id?: string
          sentiment?: string | null
          sentiment_score?: number | null
          session_id?: string | null
          tenant_id?: string | null
          topics?: Json | null
          transcript?: string | null
        }
        Update: {
          ai_analysis?: string | null
          audio_url?: string | null
          correlated_session_id?: string | null
          created_at?: string
          id?: string
          sentiment?: string | null
          sentiment_score?: number | null
          session_id?: string | null
          tenant_id?: string | null
          topics?: Json | null
          transcript?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "traceflow_voice_feedback_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "client_tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_client_id: { Args: never; Returns: string }
      generate_invoice_number: { Args: never; Returns: string }
      generate_quote_number: { Args: never; Returns: string }
      generate_ticket_number: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_traceflow_admin: { Args: { check_user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "user"
      invoice_status: "draft" | "sent" | "paid" | "overdue" | "cancelled"
      quote_status: "draft" | "pending" | "approved" | "rejected" | "converted"
      traceflow_role: "owner" | "admin" | "analyst" | "viewer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
      invoice_status: ["draft", "sent", "paid", "overdue", "cancelled"],
      quote_status: ["draft", "pending", "approved", "rejected", "converted"],
      traceflow_role: ["owner", "admin", "analyst", "viewer"],
    },
  },
} as const
