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
      badges: {
        Row: {
          category: string
          created_at: string
          description: string
          icon_name: string
          id: string
          is_master_badge: boolean
          is_phase_completion: boolean
          name: string
          phase_id: string | null
          rarity: string
          requirement_type: string
          requirement_value: Json
          sort_order: number
          xp_reward: number
        }
        Insert: {
          category?: string
          created_at?: string
          description: string
          icon_name: string
          id?: string
          is_master_badge?: boolean
          is_phase_completion?: boolean
          name: string
          phase_id?: string | null
          rarity?: string
          requirement_type: string
          requirement_value?: Json
          sort_order?: number
          xp_reward?: number
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          icon_name?: string
          id?: string
          is_master_badge?: boolean
          is_phase_completion?: boolean
          name?: string
          phase_id?: string | null
          rarity?: string
          requirement_type?: string
          requirement_value?: Json
          sort_order?: number
          xp_reward?: number
        }
        Relationships: [
          {
            foreignKeyName: "badges_phase_id_fkey"
            columns: ["phase_id"]
            isOneToOne: false
            referencedRelation: "migrei_phases"
            referencedColumns: ["id"]
          },
        ]
      }
      career_wheel_assessments: {
        Row: {
          created_at: string
          current_rating: number
          desired_rating: number
          dimension: string
          id: string
          notes: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_rating?: number
          desired_rating?: number
          dimension: string
          id?: string
          notes?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_rating?: number
          desired_rating?: number
          dimension?: string
          id?: string
          notes?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      clarity_reports: {
        Row: {
          areas_to_develop: Json | null
          core_motivators: Json | null
          generated_at: string
          id: string
          professional_identity: string | null
          recommended_routes: Json | null
          top_competencies: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          areas_to_develop?: Json | null
          core_motivators?: Json | null
          generated_at?: string
          id?: string
          professional_identity?: string | null
          recommended_routes?: Json | null
          top_competencies?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          areas_to_develop?: Json | null
          core_motivators?: Json | null
          generated_at?: string
          id?: string
          professional_identity?: string | null
          recommended_routes?: Json | null
          top_competencies?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      coach_conversations: {
        Row: {
          context_type: string
          created_at: string
          id: string
          messages: Json
          phase_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          context_type?: string
          created_at?: string
          id?: string
          messages?: Json
          phase_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          context_type?: string
          created_at?: string
          id?: string
          messages?: Json
          phase_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "coach_conversations_phase_id_fkey"
            columns: ["phase_id"]
            isOneToOne: false
            referencedRelation: "migrei_phases"
            referencedColumns: ["id"]
          },
        ]
      }
      commitment_declarations: {
        Row: {
          confirmed_at: string
          created_at: string
          custom_text: string | null
          declaration_text: string
          id: string
          user_id: string
        }
        Insert: {
          confirmed_at?: string
          created_at?: string
          custom_text?: string | null
          declaration_text?: string
          id?: string
          user_id: string
        }
        Update: {
          confirmed_at?: string
          created_at?: string
          custom_text?: string | null
          declaration_text?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      community_events: {
        Row: {
          created_at: string
          description: string
          ends_at: string
          event_type: Database["public"]["Enums"]["event_type"]
          id: string
          is_active: boolean
          max_participants: number | null
          meeting_url: string | null
          phase_id: string | null
          starts_at: string
          title: string
        }
        Insert: {
          created_at?: string
          description: string
          ends_at: string
          event_type: Database["public"]["Enums"]["event_type"]
          id?: string
          is_active?: boolean
          max_participants?: number | null
          meeting_url?: string | null
          phase_id?: string | null
          starts_at: string
          title: string
        }
        Update: {
          created_at?: string
          description?: string
          ends_at?: string
          event_type?: Database["public"]["Enums"]["event_type"]
          id?: string
          is_active?: boolean
          max_participants?: number | null
          meeting_url?: string | null
          phase_id?: string | null
          starts_at?: string
          title?: string
        }
        Relationships: []
      }
      community_notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          message: string
          reference_id: string | null
          reference_type: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          reference_id?: string | null
          reference_type?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          reference_id?: string | null
          reference_type?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      community_posts: {
        Row: {
          comments_count: number
          content: string
          created_at: string
          id: string
          is_active: boolean
          is_pinned: boolean
          likes_count: number
          phase_id: string
          post_type: Database["public"]["Enums"]["post_type"]
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          comments_count?: number
          content: string
          created_at?: string
          id?: string
          is_active?: boolean
          is_pinned?: boolean
          likes_count?: number
          phase_id: string
          post_type?: Database["public"]["Enums"]["post_type"]
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          comments_count?: number
          content?: string
          created_at?: string
          id?: string
          is_active?: boolean
          is_pinned?: boolean
          likes_count?: number
          phase_id?: string
          post_type?: Database["public"]["Enums"]["post_type"]
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      community_xp_actions: {
        Row: {
          action_type: string
          daily_limit: number | null
          description: string | null
          id: string
          xp_reward: number
        }
        Insert: {
          action_type: string
          daily_limit?: number | null
          description?: string | null
          id?: string
          xp_reward?: number
        }
        Update: {
          action_type?: string
          daily_limit?: number | null
          description?: string | null
          id?: string
          xp_reward?: number
        }
        Relationships: []
      }
      competency_assessments: {
        Row: {
          category: string
          competency_name: string
          created_at: string
          evidence: string | null
          id: string
          is_neglected: boolean | null
          is_top_strength: boolean | null
          self_rating: number
          updated_at: string
          user_id: string
        }
        Insert: {
          category: string
          competency_name: string
          created_at?: string
          evidence?: string | null
          id?: string
          is_neglected?: boolean | null
          is_top_strength?: boolean | null
          self_rating?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          competency_name?: string
          created_at?: string
          evidence?: string | null
          id?: string
          is_neglected?: boolean | null
          is_top_strength?: boolean | null
          self_rating?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      consciousness_responses: {
        Row: {
          created_at: string
          id: string
          question_key: string
          question_text: string
          response_text: string | null
          response_value: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          question_key: string
          question_text: string
          response_text?: string | null
          response_value: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          question_key?: string
          question_text?: string
          response_text?: string | null
          response_value?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      content_reports: {
        Row: {
          content_id: string
          content_type: string
          created_at: string
          id: string
          reason: string
          reporter_id: string
          resolved_at: string | null
          resolved_by: string | null
          status: string
        }
        Insert: {
          content_id: string
          content_type: string
          created_at?: string
          id?: string
          reason: string
          reporter_id: string
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
        }
        Update: {
          content_id?: string
          content_type?: string
          created_at?: string
          id?: string
          reason?: string
          reporter_id?: string
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
        }
        Relationships: []
      }
      conversation_requests: {
        Row: {
          created_at: string
          feedback_requested: string | null
          feedback_requester: string | null
          id: string
          meeting_url: string | null
          rating_requested: number | null
          rating_requester: number | null
          reason: string
          requested_id: string
          requester_id: string
          scheduled_at: string | null
          status: Database["public"]["Enums"]["conversation_status"]
          suggested_duration: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          feedback_requested?: string | null
          feedback_requester?: string | null
          id?: string
          meeting_url?: string | null
          rating_requested?: number | null
          rating_requester?: number | null
          reason: string
          requested_id: string
          requester_id: string
          scheduled_at?: string | null
          status?: Database["public"]["Enums"]["conversation_status"]
          suggested_duration?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          feedback_requested?: string | null
          feedback_requester?: string | null
          id?: string
          meeting_url?: string | null
          rating_requested?: number | null
          rating_requester?: number | null
          reason?: string
          requested_id?: string
          requester_id?: string
          scheduled_at?: string | null
          status?: Database["public"]["Enums"]["conversation_status"]
          suggested_duration?: number
          updated_at?: string
        }
        Relationships: []
      }
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
      diagnostic_results: {
        Row: {
          answers: Json
          completed_at: string | null
          created_at: string
          diagnostic_type: string
          id: string
          result_summary: string | null
          scores: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          answers?: Json
          completed_at?: string | null
          created_at?: string
          diagnostic_type: string
          id?: string
          result_summary?: string | null
          scores?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          answers?: Json
          completed_at?: string | null
          created_at?: string
          diagnostic_type?: string
          id?: string
          result_summary?: string | null
          scores?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      discovery_diary_entries: {
        Row: {
          completed_at: string | null
          created_at: string
          day_number: number
          emotional_reaction: string | null
          id: string
          question: string
          response: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          day_number: number
          emotional_reaction?: string | null
          id?: string
          question: string
          response?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          day_number?: number
          emotional_reaction?: string | null
          id?: string
          question?: string
          response?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      event_registrations: {
        Row: {
          attended: boolean | null
          created_at: string
          event_id: string
          feedback: string | null
          id: string
          rating: number | null
          user_id: string
        }
        Insert: {
          attended?: boolean | null
          created_at?: string
          event_id: string
          feedback?: string | null
          id?: string
          rating?: number | null
          user_id: string
        }
        Update: {
          attended?: boolean | null
          created_at?: string
          event_id?: string
          feedback?: string | null
          id?: string
          rating?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "community_events"
            referencedColumns: ["id"]
          },
        ]
      }
      give_ask_posts: {
        Row: {
          created_at: string
          description: string
          id: string
          is_active: boolean
          phase_id: string | null
          responses_count: number
          skills_related: string[] | null
          title: string
          type: Database["public"]["Enums"]["give_ask_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          is_active?: boolean
          phase_id?: string | null
          responses_count?: number
          skills_related?: string[] | null
          title: string
          type: Database["public"]["Enums"]["give_ask_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          is_active?: boolean
          phase_id?: string | null
          responses_count?: number
          skills_related?: string[] | null
          title?: string
          type?: Database["public"]["Enums"]["give_ask_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      give_ask_responses: {
        Row: {
          created_at: string
          id: string
          is_accepted: boolean | null
          message: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_accepted?: boolean | null
          message: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_accepted?: boolean | null
          message?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "give_ask_responses_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "give_ask_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      match_suggestions: {
        Row: {
          created_at: string
          id: string
          match_reasons: Json
          match_score: number
          status: string
          suggested_user_id: string
          user_id: string
          week_of: string
        }
        Insert: {
          created_at?: string
          id?: string
          match_reasons?: Json
          match_score?: number
          status?: string
          suggested_user_id: string
          user_id: string
          week_of: string
        }
        Update: {
          created_at?: string
          id?: string
          match_reasons?: Json
          match_score?: number
          status?: string
          suggested_user_id?: string
          user_id?: string
          week_of?: string
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
          cancelled_at: string | null
          counts_towards_limit: boolean
          created_at: string
          duration_minutes: number
          id: string
          meeting_url: string | null
          mentee_id: string
          mentor_id: string
          notes: string | null
          rescheduled_from: string | null
          scheduled_at: string
          status: string
          updated_at: string
        }
        Insert: {
          cancelled_at?: string | null
          counts_towards_limit?: boolean
          created_at?: string
          duration_minutes?: number
          id?: string
          meeting_url?: string | null
          mentee_id: string
          mentor_id: string
          notes?: string | null
          rescheduled_from?: string | null
          scheduled_at: string
          status?: string
          updated_at?: string
        }
        Update: {
          cancelled_at?: string | null
          counts_towards_limit?: boolean
          created_at?: string
          duration_minutes?: number
          id?: string
          meeting_url?: string | null
          mentee_id?: string
          mentor_id?: string
          notes?: string | null
          rescheduled_from?: string | null
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
          {
            foreignKeyName: "mentoring_sessions_rescheduled_from_fkey"
            columns: ["rescheduled_from"]
            isOneToOne: false
            referencedRelation: "mentoring_sessions"
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
      migrei_phases: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          icon_name: string | null
          id: string
          level_description: string | null
          level_name: string
          name: string
          objective: string | null
          phase_number: number
          slug: string
          sort_order: number
          xp_to_complete: number
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon_name?: string | null
          id?: string
          level_description?: string | null
          level_name: string
          name: string
          objective?: string | null
          phase_number: number
          slug: string
          sort_order?: number
          xp_to_complete?: number
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon_name?: string | null
          id?: string
          level_description?: string | null
          level_name?: string
          name?: string
          objective?: string | null
          phase_number?: number
          slug?: string
          sort_order?: number
          xp_to_complete?: number
        }
        Relationships: []
      }
      missions: {
        Row: {
          badge_id: string | null
          created_at: string
          description: string
          ends_at: string | null
          id: string
          is_active: boolean
          mission_type: Database["public"]["Enums"]["mission_type"]
          phase_id: string | null
          requirement_type: string
          requirement_value: Json
          starts_at: string | null
          title: string
          xp_reward: number
        }
        Insert: {
          badge_id?: string | null
          created_at?: string
          description: string
          ends_at?: string | null
          id?: string
          is_active?: boolean
          mission_type?: Database["public"]["Enums"]["mission_type"]
          phase_id?: string | null
          requirement_type: string
          requirement_value?: Json
          starts_at?: string | null
          title: string
          xp_reward?: number
        }
        Update: {
          badge_id?: string | null
          created_at?: string
          description?: string
          ends_at?: string | null
          id?: string
          is_active?: boolean
          mission_type?: Database["public"]["Enums"]["mission_type"]
          phase_id?: string | null
          requirement_type?: string
          requirement_value?: Json
          starts_at?: string | null
          title?: string
          xp_reward?: number
        }
        Relationships: [
          {
            foreignKeyName: "missions_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "missions_phase_id_fkey"
            columns: ["phase_id"]
            isOneToOne: false
            referencedRelation: "migrei_phases"
            referencedColumns: ["id"]
          },
        ]
      }
      pain_map: {
        Row: {
          created_at: string
          description: string
          id: string
          intensity: number
          pain_type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          intensity: number
          pain_type: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          intensity?: number
          pain_type?: string
          user_id?: string
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
      phase_activities: {
        Row: {
          activity_type: Database["public"]["Enums"]["activity_type"]
          content_url: string | null
          created_at: string
          description: string | null
          estimated_minutes: number | null
          id: string
          is_checkpoint: boolean
          is_required: boolean
          metadata: Json | null
          phase_id: string
          sort_order: number
          title: string
          xp_reward: number
        }
        Insert: {
          activity_type?: Database["public"]["Enums"]["activity_type"]
          content_url?: string | null
          created_at?: string
          description?: string | null
          estimated_minutes?: number | null
          id?: string
          is_checkpoint?: boolean
          is_required?: boolean
          metadata?: Json | null
          phase_id: string
          sort_order?: number
          title: string
          xp_reward?: number
        }
        Update: {
          activity_type?: Database["public"]["Enums"]["activity_type"]
          content_url?: string | null
          created_at?: string
          description?: string | null
          estimated_minutes?: number | null
          id?: string
          is_checkpoint?: boolean
          is_required?: boolean
          metadata?: Json | null
          phase_id?: string
          sort_order?: number
          title?: string
          xp_reward?: number
        }
        Relationships: [
          {
            foreignKeyName: "phase_activities_phase_id_fkey"
            columns: ["phase_id"]
            isOneToOne: false
            referencedRelation: "migrei_phases"
            referencedColumns: ["id"]
          },
        ]
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
      post_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          is_active: boolean
          post_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_active?: boolean
          post_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_active?: boolean
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_likes: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      profession_recommendations: {
        Row: {
          created_at: string
          growth_outlook: string | null
          id: string
          is_selected: boolean | null
          match_reasons: Json | null
          match_score: number
          profession_description: string | null
          profession_name: string
          required_skills: Json | null
          salary_range: string | null
          skills_gap: Json | null
          updated_at: string
          user_id: string
          user_matching_skills: Json | null
        }
        Insert: {
          created_at?: string
          growth_outlook?: string | null
          id?: string
          is_selected?: boolean | null
          match_reasons?: Json | null
          match_score?: number
          profession_description?: string | null
          profession_name: string
          required_skills?: Json | null
          salary_range?: string | null
          skills_gap?: Json | null
          updated_at?: string
          user_id: string
          user_matching_skills?: Json | null
        }
        Update: {
          created_at?: string
          growth_outlook?: string | null
          id?: string
          is_selected?: boolean | null
          match_reasons?: Json | null
          match_score?: number
          profession_description?: string | null
          profession_name?: string
          required_skills?: Json | null
          salary_range?: string | null
          skills_gap?: Json | null
          updated_at?: string
          user_id?: string
          user_matching_skills?: Json | null
        }
        Relationships: []
      }
      professional_timeline: {
        Row: {
          ai_suggested_learning: string | null
          created_at: string
          event_description: string | null
          event_title: string
          event_type: string
          event_year: number
          id: string
          learnings: string | null
          sort_order: number
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_suggested_learning?: string | null
          created_at?: string
          event_description?: string | null
          event_title: string
          event_type?: string
          event_year: number
          id?: string
          learnings?: string | null
          sort_order?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_suggested_learning?: string | null
          created_at?: string
          event_description?: string | null
          event_title?: string
          event_type?: string
          event_year?: number
          id?: string
          learnings?: string | null
          sort_order?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
      progress_events: {
        Row: {
          created_at: string
          event_type: string
          id: string
          metadata: Json | null
          phase_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          metadata?: Json | null
          phase_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          metadata?: Json | null
          phase_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "progress_events_phase_id_fkey"
            columns: ["phase_id"]
            isOneToOne: false
            referencedRelation: "migrei_phases"
            referencedColumns: ["id"]
          },
        ]
      }
      readiness_assessments: {
        Row: {
          created_at: string
          emotional_answers: Json | null
          emotional_score: number
          financial_answers: Json | null
          financial_score: number
          id: string
          professional_answers: Json | null
          professional_score: number
          readiness_level: string | null
          total_score: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          emotional_answers?: Json | null
          emotional_score?: number
          financial_answers?: Json | null
          financial_score?: number
          id?: string
          professional_answers?: Json | null
          professional_score?: number
          readiness_level?: string | null
          total_score?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          emotional_answers?: Json | null
          emotional_score?: number
          financial_answers?: Json | null
          financial_score?: number
          id?: string
          professional_answers?: Json | null
          professional_score?: number
          readiness_level?: string | null
          total_score?: number | null
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
      user_activity_completions: {
        Row: {
          activity_id: string
          completed_at: string
          id: string
          notes: string | null
          phase_id: string
          time_spent_minutes: number | null
          user_id: string
          xp_earned: number
        }
        Insert: {
          activity_id: string
          completed_at?: string
          id?: string
          notes?: string | null
          phase_id: string
          time_spent_minutes?: number | null
          user_id: string
          xp_earned?: number
        }
        Update: {
          activity_id?: string
          completed_at?: string
          id?: string
          notes?: string | null
          phase_id?: string
          time_spent_minutes?: number | null
          user_id?: string
          xp_earned?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_activity_completions_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "phase_activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_activity_completions_phase_id_fkey"
            columns: ["phase_id"]
            isOneToOne: false
            referencedRelation: "migrei_phases"
            referencedColumns: ["id"]
          },
        ]
      }
      user_badges: {
        Row: {
          badge_id: string
          earned_at: string
          id: string
          user_id: string
        }
        Insert: {
          badge_id: string
          earned_at?: string
          id?: string
          user_id: string
        }
        Update: {
          badge_id?: string
          earned_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
        ]
      }
      user_blocks: {
        Row: {
          blocked_id: string
          blocker_id: string
          created_at: string
          id: string
          reason: string | null
        }
        Insert: {
          blocked_id: string
          blocker_id: string
          created_at?: string
          id?: string
          reason?: string | null
        }
        Update: {
          blocked_id?: string
          blocker_id?: string
          created_at?: string
          id?: string
          reason?: string | null
        }
        Relationships: []
      }
      user_connections: {
        Row: {
          created_at: string
          id: string
          match_reason: string | null
          requested_id: string
          requester_id: string
          status: Database["public"]["Enums"]["connection_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          match_reason?: string | null
          requested_id: string
          requester_id: string
          status?: Database["public"]["Enums"]["connection_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          match_reason?: string | null
          requested_id?: string
          requester_id?: string
          status?: Database["public"]["Enums"]["connection_status"]
          updated_at?: string
        }
        Relationships: []
      }
      user_missions: {
        Row: {
          assigned_at: string
          completed_at: string | null
          expires_at: string | null
          id: string
          is_completed: boolean
          mission_id: string
          progress: number
          target: number
          user_id: string
        }
        Insert: {
          assigned_at?: string
          completed_at?: string | null
          expires_at?: string | null
          id?: string
          is_completed?: boolean
          mission_id: string
          progress?: number
          target?: number
          user_id: string
        }
        Update: {
          assigned_at?: string
          completed_at?: string | null
          expires_at?: string | null
          id?: string
          is_completed?: boolean
          mission_id?: string
          progress?: number
          target?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_missions_mission_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "missions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_monthly_cancellations: {
        Row: {
          created_at: string
          free_cancellations_used: number
          id: string
          month_year: string
          paid_cancellations: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          free_cancellations_used?: number
          id?: string
          month_year: string
          paid_cancellations?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          free_cancellations_used?: number
          id?: string
          month_year?: string
          paid_cancellations?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_networking_profiles: {
        Row: {
          career_objective: string | null
          created_at: string
          id: string
          interest_areas: string[] | null
          is_public: boolean
          linkedin_url: string | null
          previous_experience: string | null
          skills: string[] | null
          updated_at: string
          user_id: string
          what_offering: string | null
          what_seeking: string | null
        }
        Insert: {
          career_objective?: string | null
          created_at?: string
          id?: string
          interest_areas?: string[] | null
          is_public?: boolean
          linkedin_url?: string | null
          previous_experience?: string | null
          skills?: string[] | null
          updated_at?: string
          user_id: string
          what_offering?: string | null
          what_seeking?: string | null
        }
        Update: {
          career_objective?: string | null
          created_at?: string
          id?: string
          interest_areas?: string[] | null
          is_public?: boolean
          linkedin_url?: string | null
          previous_experience?: string | null
          skills?: string[] | null
          updated_at?: string
          user_id?: string
          what_offering?: string | null
          what_seeking?: string | null
        }
        Relationships: []
      }
      user_phase_progress: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          phase_id: string
          progress_percentage: number
          started_at: string | null
          status: Database["public"]["Enums"]["phase_status"]
          time_spent_minutes: number
          updated_at: string
          user_id: string
          xp_earned: number
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          phase_id: string
          progress_percentage?: number
          started_at?: string | null
          status?: Database["public"]["Enums"]["phase_status"]
          time_spent_minutes?: number
          updated_at?: string
          user_id: string
          xp_earned?: number
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          phase_id?: string
          progress_percentage?: number
          started_at?: string | null
          status?: Database["public"]["Enums"]["phase_status"]
          time_spent_minutes?: number
          updated_at?: string
          user_id?: string
          xp_earned?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_phase_progress_phase_id_fkey"
            columns: ["phase_id"]
            isOneToOne: false
            referencedRelation: "migrei_phases"
            referencedColumns: ["id"]
          },
        ]
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
      user_progress: {
        Row: {
          created_at: string
          current_level: number
          current_phase_id: string | null
          current_phase_number: number
          id: string
          journey_started_at: string
          last_activity_at: string | null
          longest_streak: number
          streak_days: number
          total_xp: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_level?: number
          current_phase_id?: string | null
          current_phase_number?: number
          id?: string
          journey_started_at?: string
          last_activity_at?: string | null
          longest_streak?: number
          streak_days?: number
          total_xp?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_level?: number
          current_phase_id?: string | null
          current_phase_number?: number
          id?: string
          journey_started_at?: string
          last_activity_at?: string | null
          longest_streak?: number
          streak_days?: number
          total_xp?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_current_phase_id_fkey"
            columns: ["current_phase_id"]
            isOneToOne: false
            referencedRelation: "migrei_phases"
            referencedColumns: ["id"]
          },
        ]
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
      xp_transactions: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          id: string
          phase_id: string | null
          source_id: string | null
          source_type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          id?: string
          phase_id?: string | null
          source_id?: string | null
          source_type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          phase_id?: string | null
          source_id?: string | null
          source_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "xp_transactions_phase_id_fkey"
            columns: ["phase_id"]
            isOneToOne: false
            referencedRelation: "migrei_phases"
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
      get_mentor_booked_slots: {
        Args: { p_end_date: string; p_mentor_id: string; p_start_date: string }
        Returns: {
          scheduled_at: string
        }[]
      }
      get_monthly_cancellation_info: {
        Args: { p_user_id: string }
        Returns: {
          can_cancel_free: boolean
          free_cancellations_used: number
          paid_cancellations: number
        }[]
      }
      get_user_feature: {
        Args: { p_feature_key: string; p_user_id: string }
        Returns: Json
      }
      get_user_plan_slug: { Args: { p_user_id: string }; Returns: string }
      has_active_subscription: { Args: { p_user_id: string }; Returns: boolean }
      has_premium_plan: { Args: { user_uuid: string }; Returns: boolean }
      is_slot_available: {
        Args: {
          p_exclude_session_id?: string
          p_mentor_id: string
          p_scheduled_at: string
        }
        Returns: boolean
      }
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
      activity_type:
        | "lesson"
        | "exercise"
        | "checkpoint"
        | "quiz"
        | "reflection"
      connection_status: "pending" | "accepted" | "rejected" | "blocked"
      conversation_status:
        | "pending"
        | "accepted"
        | "declined"
        | "completed"
        | "cancelled"
      coupon_eligibility:
        | "all_plans"
        | "specific_plans"
        | "new_users_only"
        | "upgrade_only"
      coupon_type: "percentage" | "fixed_amount" | "trial_extension"
      event_type:
        | "networking_round"
        | "workshop"
        | "q_and_a"
        | "mentoring_group"
      give_ask_type: "give" | "ask"
      mission_type: "daily" | "weekly" | "phase" | "special"
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
      phase_status: "locked" | "available" | "in_progress" | "completed"
      post_type:
        | "stuck_at"
        | "completed_phase"
        | "need_help"
        | "can_help"
        | "opportunity"
        | "general"
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
      activity_type: ["lesson", "exercise", "checkpoint", "quiz", "reflection"],
      connection_status: ["pending", "accepted", "rejected", "blocked"],
      conversation_status: [
        "pending",
        "accepted",
        "declined",
        "completed",
        "cancelled",
      ],
      coupon_eligibility: [
        "all_plans",
        "specific_plans",
        "new_users_only",
        "upgrade_only",
      ],
      coupon_type: ["percentage", "fixed_amount", "trial_extension"],
      event_type: [
        "networking_round",
        "workshop",
        "q_and_a",
        "mentoring_group",
      ],
      give_ask_type: ["give", "ask"],
      mission_type: ["daily", "weekly", "phase", "special"],
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
      phase_status: ["locked", "available", "in_progress", "completed"],
      post_type: [
        "stuck_at",
        "completed_phase",
        "need_help",
        "can_help",
        "opportunity",
        "general",
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
