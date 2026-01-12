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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      coupon_redemptions: {
        Row: {
          coupon_id: string
          discount_applied_cents: number
          id: string
          redeemed_at: string
          subscription_id: string | null
          user_id: string
        }
        Insert: {
          coupon_id: string
          discount_applied_cents: number
          id?: string
          redeemed_at?: string
          subscription_id?: string | null
          user_id: string
        }
        Update: {
          coupon_id?: string
          discount_applied_cents?: number
          id?: string
          redeemed_at?: string
          subscription_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "coupon_redemptions_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "coupons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coupon_redemptions_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "user_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      coupons: {
        Row: {
          code: string
          coupon_type: Database["public"]["Enums"]["coupon_type"]
          created_at: string
          currency: string | null
          description: string | null
          discount_value: number
          duration: string
          duration_in_months: number | null
          eligibility: Database["public"]["Enums"]["coupon_eligibility"]
          eligible_plan_ids: string[] | null
          first_time_only: boolean
          id: string
          is_active: boolean
          max_redemptions: number | null
          metadata: Json | null
          min_purchase_amount: number | null
          name: string
          redemptions_count: number
          stripe_coupon_id: string | null
          updated_at: string
          valid_from: string
          valid_until: string | null
        }
        Insert: {
          code: string
          coupon_type: Database["public"]["Enums"]["coupon_type"]
          created_at?: string
          currency?: string | null
          description?: string | null
          discount_value: number
          duration?: string
          duration_in_months?: number | null
          eligibility?: Database["public"]["Enums"]["coupon_eligibility"]
          eligible_plan_ids?: string[] | null
          first_time_only?: boolean
          id?: string
          is_active?: boolean
          max_redemptions?: number | null
          metadata?: Json | null
          min_purchase_amount?: number | null
          name: string
          redemptions_count?: number
          stripe_coupon_id?: string | null
          updated_at?: string
          valid_from?: string
          valid_until?: string | null
        }
        Update: {
          code?: string
          coupon_type?: Database["public"]["Enums"]["coupon_type"]
          created_at?: string
          currency?: string | null
          description?: string | null
          discount_value?: number
          duration?: string
          duration_in_months?: number | null
          eligibility?: Database["public"]["Enums"]["coupon_eligibility"]
          eligible_plan_ids?: string[] | null
          first_time_only?: boolean
          id?: string
          is_active?: boolean
          max_redemptions?: number | null
          metadata?: Json | null
          min_purchase_amount?: number | null
          name?: string
          redemptions_count?: number
          stripe_coupon_id?: string | null
          updated_at?: string
          valid_from?: string
          valid_until?: string | null
        }
        Relationships: []
      }
      mentor_availability: {
        Row: {
          created_at: string
          day_of_week: number
          end_time: string
          id: string
          is_available: boolean
          mentor_id: string
          start_time: string
        }
        Insert: {
          created_at?: string
          day_of_week: number
          end_time: string
          id?: string
          is_available?: boolean
          mentor_id: string
          start_time: string
        }
        Update: {
          created_at?: string
          day_of_week?: number
          end_time?: string
          id?: string
          is_available?: boolean
          mentor_id?: string
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentor_availability_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "mentors"
            referencedColumns: ["id"]
          },
        ]
      }
      mentoring_sessions: {
        Row: {
          created_at: string
          duration_minutes: number
          id: string
          meeting_url: string | null
          mentee_id: string
          mentor_id: string
          notes: string | null
          scheduled_at: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          duration_minutes?: number
          id?: string
          meeting_url?: string | null
          mentee_id: string
          mentor_id: string
          notes?: string | null
          scheduled_at: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          duration_minutes?: number
          id?: string
          meeting_url?: string | null
          mentee_id?: string
          mentor_id?: string
          notes?: string | null
          scheduled_at?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentoring_sessions_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "mentors"
            referencedColumns: ["id"]
          },
        ]
      }
      mentors: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          expertise: string[]
          id: string
          is_active: boolean
          linkedin_url: string | null
          name: string
          title: string
          updated_at: string
          user_id: string | null
          years_experience: number | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          expertise?: string[]
          id?: string
          is_active?: boolean
          linkedin_url?: string | null
          name: string
          title: string
          updated_at?: string
          user_id?: string | null
          years_experience?: number | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          expertise?: string[]
          id?: string
          is_active?: boolean
          linkedin_url?: string | null
          name?: string
          title?: string
          updated_at?: string
          user_id?: string | null
          years_experience?: number | null
        }
        Relationships: []
      }
      payment_events: {
        Row: {
          created_at: string
          error_message: string | null
          event_type: Database["public"]["Enums"]["payment_event_type"]
          id: string
          payload: Json
          processed: boolean
          processed_at: string | null
          retry_count: number
          stripe_customer_id: string | null
          stripe_event_id: string
          stripe_subscription_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          event_type: Database["public"]["Enums"]["payment_event_type"]
          id?: string
          payload: Json
          processed?: boolean
          processed_at?: string | null
          retry_count?: number
          stripe_customer_id?: string | null
          stripe_event_id: string
          stripe_subscription_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          error_message?: string | null
          event_type?: Database["public"]["Enums"]["payment_event_type"]
          id?: string
          payload?: Json
          processed?: boolean
          processed_at?: string | null
          retry_count?: number
          stripe_customer_id?: string | null
          stripe_event_id?: string
          stripe_subscription_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      plan_features: {
        Row: {
          created_at: string
          description: string | null
          feature_key: string
          feature_name: string
          feature_value: Json
          id: string
          plan_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          feature_key: string
          feature_name: string
          feature_value?: Json
          id?: string
          plan_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          feature_key?: string
          feature_name?: string
          feature_value?: Json
          id?: string
          plan_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "plan_features_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          created_at: string
          currency: string
          description: string | null
          id: string
          interval: string
          interval_count: number
          is_active: boolean
          is_public: boolean
          metadata: Json | null
          name: string
          price_cents: number
          slug: string
          sort_order: number
          stripe_price_id: string | null
          stripe_product_id: string | null
          trial_days: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          interval?: string
          interval_count?: number
          is_active?: boolean
          is_public?: boolean
          metadata?: Json | null
          name: string
          price_cents?: number
          slug: string
          sort_order?: number
          stripe_price_id?: string | null
          stripe_product_id?: string | null
          trial_days?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          interval?: string
          interval_count?: number
          is_active?: boolean
          is_public?: boolean
          metadata?: Json | null
          name?: string
          price_cents?: number
          slug?: string
          sort_order?: number
          stripe_price_id?: string | null
          stripe_product_id?: string | null
          trial_days?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      user_plans: {
        Row: {
          created_at: string
          id: string
          plan: Database["public"]["Enums"]["subscription_plan"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          plan?: Database["public"]["Enums"]["subscription_plan"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          plan?: Database["public"]["Enums"]["subscription_plan"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          cancel_at_period_end: boolean
          canceled_at: string | null
          coupon_id: string | null
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          ended_at: string | null
          id: string
          metadata: Json | null
          plan_id: string
          status: Database["public"]["Enums"]["subscription_status"]
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          trial_end: string | null
          trial_start: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean
          canceled_at?: string | null
          coupon_id?: string | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          ended_at?: string | null
          id?: string
          metadata?: Json | null
          plan_id: string
          status?: Database["public"]["Enums"]["subscription_status"]
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_end?: string | null
          trial_start?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean
          canceled_at?: string | null
          coupon_id?: string | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          ended_at?: string | null
          id?: string
          metadata?: Json | null
          plan_id?: string
          status?: Database["public"]["Enums"]["subscription_status"]
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_end?: string | null
          trial_start?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      count_monthly_sessions: { Args: { user_uuid: string }; Returns: number }
      get_user_feature: {
        Args: { p_feature_key: string; p_user_id: string }
        Returns: Json
      }
      get_user_plan_slug: { Args: { p_user_id: string }; Returns: string }
      has_active_subscription: { Args: { p_user_id: string }; Returns: boolean }
      has_premium_plan: { Args: { user_uuid: string }; Returns: boolean }
      validate_coupon: {
        Args: { p_code: string; p_plan_id?: string; p_user_id: string }
        Returns: {
          coupon_id: string
          discount_type: Database["public"]["Enums"]["coupon_type"]
          discount_value: number
          error_message: string
          is_valid: boolean
        }[]
      }
    }
    Enums: {
      coupon_eligibility:
        | "all_plans"
        | "specific_plans"
        | "new_users_only"
        | "upgrade_only"
      coupon_type: "percentage" | "fixed_amount" | "trial_extension"
      payment_event_type:
        | "payment_succeeded"
        | "payment_failed"
        | "subscription_created"
        | "subscription_updated"
        | "subscription_canceled"
        | "subscription_renewed"
        | "invoice_paid"
        | "invoice_payment_failed"
        | "customer_created"
        | "refund_processed"
      subscription_plan: "free" | "premium"
      subscription_status:
        | "active"
        | "past_due"
        | "canceled"
        | "unpaid"
        | "trialing"
        | "incomplete"
        | "incomplete_expired"
        | "paused"
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
      coupon_eligibility: [
        "all_plans",
        "specific_plans",
        "new_users_only",
        "upgrade_only",
      ],
      coupon_type: ["percentage", "fixed_amount", "trial_extension"],
      payment_event_type: [
        "payment_succeeded",
        "payment_failed",
        "subscription_created",
        "subscription_updated",
        "subscription_canceled",
        "subscription_renewed",
        "invoice_paid",
        "invoice_payment_failed",
        "customer_created",
        "refund_processed",
      ],
      subscription_plan: ["free", "premium"],
      subscription_status: [
        "active",
        "past_due",
        "canceled",
        "unpaid",
        "trialing",
        "incomplete",
        "incomplete_expired",
        "paused",
      ],
    },
  },
} as const
