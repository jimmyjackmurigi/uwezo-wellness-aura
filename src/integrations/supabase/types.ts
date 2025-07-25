export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          category: string
          created_at: string
          criteria: Json
          description: string
          icon: string
          id: string
          name: string
          points: number
        }
        Insert: {
          category: string
          created_at?: string
          criteria: Json
          description: string
          icon: string
          id?: string
          name: string
          points?: number
        }
        Update: {
          category?: string
          created_at?: string
          criteria?: Json
          description?: string
          icon?: string
          id?: string
          name?: string
          points?: number
        }
        Relationships: []
      }
      ai_recommendations: {
        Row: {
          action_taken: boolean | null
          created_at: string
          description: string
          expires_at: string | null
          id: string
          is_dismissed: boolean | null
          is_read: boolean | null
          priority: string | null
          recommendation_type: string
          title: string
          user_id: string
        }
        Insert: {
          action_taken?: boolean | null
          created_at?: string
          description: string
          expires_at?: string | null
          id?: string
          is_dismissed?: boolean | null
          is_read?: boolean | null
          priority?: string | null
          recommendation_type: string
          title: string
          user_id: string
        }
        Update: {
          action_taken?: boolean | null
          created_at?: string
          description?: string
          expires_at?: string | null
          id?: string
          is_dismissed?: boolean | null
          is_read?: boolean | null
          priority?: string | null
          recommendation_type?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      daily_activities: {
        Row: {
          active_minutes: number | null
          calories_burned: number | null
          created_at: string
          date: string
          distance_km: number | null
          exercise_duration_minutes: number | null
          exercise_type: string | null
          id: string
          steps: number | null
          updated_at: string
          user_id: string
          water_intake_ml: number | null
        }
        Insert: {
          active_minutes?: number | null
          calories_burned?: number | null
          created_at?: string
          date: string
          distance_km?: number | null
          exercise_duration_minutes?: number | null
          exercise_type?: string | null
          id?: string
          steps?: number | null
          updated_at?: string
          user_id: string
          water_intake_ml?: number | null
        }
        Update: {
          active_minutes?: number | null
          calories_burned?: number | null
          created_at?: string
          date?: string
          distance_km?: number | null
          exercise_duration_minutes?: number | null
          exercise_type?: string | null
          id?: string
          steps?: number | null
          updated_at?: string
          user_id?: string
          water_intake_ml?: number | null
        }
        Relationships: []
      }
      doctor_patient_access: {
        Row: {
          access_level: string
          doctor_id: string
          expires_at: string | null
          granted_at: string
          granted_by: string
          id: string
          is_active: boolean | null
          patient_id: string
        }
        Insert: {
          access_level: string
          doctor_id: string
          expires_at?: string | null
          granted_at?: string
          granted_by: string
          id?: string
          is_active?: boolean | null
          patient_id: string
        }
        Update: {
          access_level?: string
          doctor_id?: string
          expires_at?: string | null
          granted_at?: string
          granted_by?: string
          id?: string
          is_active?: boolean | null
          patient_id?: string
        }
        Relationships: []
      }
      health_alerts: {
        Row: {
          acknowledged_at: string | null
          alert_type: string
          created_at: string
          emergency_contact_notified: boolean | null
          id: string
          is_acknowledged: boolean | null
          message: string
          metric_id: string | null
          severity: string
          title: string
          user_id: string
        }
        Insert: {
          acknowledged_at?: string | null
          alert_type: string
          created_at?: string
          emergency_contact_notified?: boolean | null
          id?: string
          is_acknowledged?: boolean | null
          message: string
          metric_id?: string | null
          severity: string
          title: string
          user_id: string
        }
        Update: {
          acknowledged_at?: string | null
          alert_type?: string
          created_at?: string
          emergency_contact_notified?: boolean | null
          id?: string
          is_acknowledged?: boolean | null
          message?: string
          metric_id?: string | null
          severity?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "health_alerts_metric_id_fkey"
            columns: ["metric_id"]
            isOneToOne: false
            referencedRelation: "health_metrics"
            referencedColumns: ["id"]
          },
        ]
      }
      health_journal: {
        Row: {
          created_at: string
          date: string
          energy_level: number | null
          id: string
          medication_taken: string[] | null
          mood_emoji: string | null
          mood_rating: number | null
          notes: string | null
          sleep_quality: number | null
          symptoms: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date?: string
          energy_level?: number | null
          id?: string
          medication_taken?: string[] | null
          mood_emoji?: string | null
          mood_rating?: number | null
          notes?: string | null
          sleep_quality?: number | null
          symptoms?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          energy_level?: number | null
          id?: string
          medication_taken?: string[] | null
          mood_emoji?: string | null
          mood_rating?: number | null
          notes?: string | null
          sleep_quality?: number | null
          symptoms?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      health_metrics: {
        Row: {
          anomaly_confidence: number | null
          created_at: string
          device_id: string | null
          id: string
          is_anomaly: boolean | null
          metric_type: string
          recorded_at: string
          source: string | null
          unit: string
          user_id: string
          value: number
        }
        Insert: {
          anomaly_confidence?: number | null
          created_at?: string
          device_id?: string | null
          id?: string
          is_anomaly?: boolean | null
          metric_type: string
          recorded_at?: string
          source?: string | null
          unit: string
          user_id: string
          value: number
        }
        Update: {
          anomaly_confidence?: number | null
          created_at?: string
          device_id?: string | null
          id?: string
          is_anomaly?: boolean | null
          metric_type?: string
          recorded_at?: string
          source?: string | null
          unit?: string
          user_id?: string
          value?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          activity_level: string | null
          avatar_url: string | null
          created_at: string
          date_of_birth: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          first_name: string | null
          gender: string | null
          health_goals: string[] | null
          height_cm: number | null
          id: string
          last_name: string | null
          updated_at: string
          user_id: string
          weight_kg: number | null
        }
        Insert: {
          activity_level?: string | null
          avatar_url?: string | null
          created_at?: string
          date_of_birth?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          first_name?: string | null
          gender?: string | null
          health_goals?: string[] | null
          height_cm?: number | null
          id?: string
          last_name?: string | null
          updated_at?: string
          user_id: string
          weight_kg?: number | null
        }
        Update: {
          activity_level?: string | null
          avatar_url?: string | null
          created_at?: string
          date_of_birth?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          first_name?: string | null
          gender?: string | null
          health_goals?: string[] | null
          height_cm?: number | null
          id?: string
          last_name?: string | null
          updated_at?: string
          user_id?: string
          weight_kg?: number | null
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_id: string
          earned_at: string
          id: string
          user_id: string
        }
        Insert: {
          achievement_id: string
          earned_at?: string
          id?: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          earned_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      user_points: {
        Row: {
          id: string
          level_number: number
          points: number
          total_points: number
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          level_number?: number
          points?: number
          total_points?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          id?: string
          level_number?: number
          points?: number
          total_points?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
    Enums: {},
  },
} as const
