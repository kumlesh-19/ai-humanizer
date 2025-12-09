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
      checkpoints: {
        Row: {
          checkpoint_name: string
          checkpoint_path: string
          created_at: string | null
          epoch: number | null
          file_size: number | null
          id: string
          is_best: boolean | null
          loss_value: number | null
          step: number | null
          training_job_id: string | null
        }
        Insert: {
          checkpoint_name: string
          checkpoint_path: string
          created_at?: string | null
          epoch?: number | null
          file_size?: number | null
          id?: string
          is_best?: boolean | null
          loss_value?: number | null
          step?: number | null
          training_job_id?: string | null
        }
        Update: {
          checkpoint_name?: string
          checkpoint_path?: string
          created_at?: string | null
          epoch?: number | null
          file_size?: number | null
          id?: string
          is_best?: boolean | null
          loss_value?: number | null
          step?: number | null
          training_job_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "checkpoints_training_job_id_fkey"
            columns: ["training_job_id"]
            isOneToOne: false
            referencedRelation: "training_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      datasets: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          status: string | null
          total_paragraphs: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          status?: string | null
          total_paragraphs?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          status?: string | null
          total_paragraphs?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      humanization_patterns: {
        Row: {
          applicable_categories: string[] | null
          confidence_weight: number | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          pattern_type: string
          transformation_rule: Json
          updated_at: string | null
        }
        Insert: {
          applicable_categories?: string[] | null
          confidence_weight?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          pattern_type: string
          transformation_rule: Json
          updated_at?: string | null
        }
        Update: {
          applicable_categories?: string[] | null
          confidence_weight?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          pattern_type?: string
          transformation_rule?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
      model_evaluations: {
        Row: {
          created_at: string | null
          evaluation_details: Json | null
          evaluation_type: string
          id: string
          metrics: Json
          model_version_id: string | null
          passed_threshold: boolean | null
          score: number | null
          test_dataset_id: string | null
        }
        Insert: {
          created_at?: string | null
          evaluation_details?: Json | null
          evaluation_type: string
          id?: string
          metrics: Json
          model_version_id?: string | null
          passed_threshold?: boolean | null
          score?: number | null
          test_dataset_id?: string | null
        }
        Update: {
          created_at?: string | null
          evaluation_details?: Json | null
          evaluation_type?: string
          id?: string
          metrics?: Json
          model_version_id?: string | null
          passed_threshold?: boolean | null
          score?: number | null
          test_dataset_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "model_evaluations_model_version_id_fkey"
            columns: ["model_version_id"]
            isOneToOne: false
            referencedRelation: "model_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "model_evaluations_test_dataset_id_fkey"
            columns: ["test_dataset_id"]
            isOneToOne: false
            referencedRelation: "datasets"
            referencedColumns: ["id"]
          },
        ]
      }
      model_versions: {
        Row: {
          base_model: string
          config: Json
          created_at: string | null
          file_size: number | null
          id: string
          model_path: string
          model_type: string
          name: string
          performance_metrics: Json | null
          status: string | null
          training_dataset_id: string | null
          updated_at: string | null
          version: string
        }
        Insert: {
          base_model?: string
          config: Json
          created_at?: string | null
          file_size?: number | null
          id?: string
          model_path: string
          model_type: string
          name: string
          performance_metrics?: Json | null
          status?: string | null
          training_dataset_id?: string | null
          updated_at?: string | null
          version: string
        }
        Update: {
          base_model?: string
          config?: Json
          created_at?: string | null
          file_size?: number | null
          id?: string
          model_path?: string
          model_type?: string
          name?: string
          performance_metrics?: Json | null
          status?: string | null
          training_dataset_id?: string | null
          updated_at?: string | null
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "model_versions_training_dataset_id_fkey"
            columns: ["training_dataset_id"]
            isOneToOne: false
            referencedRelation: "datasets"
            referencedColumns: ["id"]
          },
        ]
      }
      paragraphs: {
        Row: {
          avg_sentence_length: number | null
          category: string
          complexity_score: number | null
          created_at: string | null
          dataset_id: string | null
          humanization_patterns: Json | null
          id: string
          original_text: string
          quality_score: number | null
          sentence_count: number | null
          source_reference: string | null
          style_tags: string[] | null
          updated_at: string | null
          word_count: number | null
        }
        Insert: {
          avg_sentence_length?: number | null
          category: string
          complexity_score?: number | null
          created_at?: string | null
          dataset_id?: string | null
          humanization_patterns?: Json | null
          id?: string
          original_text: string
          quality_score?: number | null
          sentence_count?: number | null
          source_reference?: string | null
          style_tags?: string[] | null
          updated_at?: string | null
          word_count?: number | null
        }
        Update: {
          avg_sentence_length?: number | null
          category?: string
          complexity_score?: number | null
          created_at?: string | null
          dataset_id?: string | null
          humanization_patterns?: Json | null
          id?: string
          original_text?: string
          quality_score?: number | null
          sentence_count?: number | null
          source_reference?: string | null
          style_tags?: string[] | null
          updated_at?: string | null
          word_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "paragraphs_dataset_id_fkey"
            columns: ["dataset_id"]
            isOneToOne: false
            referencedRelation: "datasets"
            referencedColumns: ["id"]
          },
        ]
      }
      preprocessing_jobs: {
        Row: {
          completed_at: string | null
          created_at: string | null
          dataset_id: string | null
          error_message: string | null
          id: string
          job_type: string
          progress: number | null
          started_at: string | null
          status: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          dataset_id?: string | null
          error_message?: string | null
          id?: string
          job_type: string
          progress?: number | null
          started_at?: string | null
          status?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          dataset_id?: string | null
          error_message?: string | null
          id?: string
          job_type?: string
          progress?: number | null
          started_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "preprocessing_jobs_dataset_id_fkey"
            columns: ["dataset_id"]
            isOneToOne: false
            referencedRelation: "datasets"
            referencedColumns: ["id"]
          },
        ]
      }
      training_configs: {
        Row: {
          config: Json
          config_type: string
          created_at: string | null
          description: string | null
          id: string
          is_default: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          config: Json
          config_type: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_default?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          config?: Json
          config_type?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_default?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      training_jobs: {
        Row: {
          completed_at: string | null
          config: Json
          created_at: string | null
          current_epoch: number | null
          current_step: number | null
          error_message: string | null
          gpu_utilization: number | null
          id: string
          job_type: string
          learning_rate: number | null
          logs: string[] | null
          loss_value: number | null
          memory_usage: number | null
          model_version_id: string | null
          progress: number | null
          started_at: string | null
          status: string | null
          total_epochs: number | null
          total_steps: number | null
          training_time_seconds: number | null
        }
        Insert: {
          completed_at?: string | null
          config: Json
          created_at?: string | null
          current_epoch?: number | null
          current_step?: number | null
          error_message?: string | null
          gpu_utilization?: number | null
          id?: string
          job_type: string
          learning_rate?: number | null
          logs?: string[] | null
          loss_value?: number | null
          memory_usage?: number | null
          model_version_id?: string | null
          progress?: number | null
          started_at?: string | null
          status?: string | null
          total_epochs?: number | null
          total_steps?: number | null
          training_time_seconds?: number | null
        }
        Update: {
          completed_at?: string | null
          config?: Json
          created_at?: string | null
          current_epoch?: number | null
          current_step?: number | null
          error_message?: string | null
          gpu_utilization?: number | null
          id?: string
          job_type?: string
          learning_rate?: number | null
          logs?: string[] | null
          loss_value?: number | null
          memory_usage?: number | null
          model_version_id?: string | null
          progress?: number | null
          started_at?: string | null
          status?: string | null
          total_epochs?: number | null
          total_steps?: number | null
          training_time_seconds?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "training_jobs_model_version_id_fkey"
            columns: ["model_version_id"]
            isOneToOne: false
            referencedRelation: "model_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      training_metrics: {
        Row: {
          epoch: number
          gpu_memory_usage: number | null
          id: string
          learning_rate: number | null
          perplexity: number | null
          step: number
          timestamp: string | null
          train_loss: number | null
          training_job_id: string | null
          val_loss: number | null
        }
        Insert: {
          epoch: number
          gpu_memory_usage?: number | null
          id?: string
          learning_rate?: number | null
          perplexity?: number | null
          step: number
          timestamp?: string | null
          train_loss?: number | null
          training_job_id?: string | null
          val_loss?: number | null
        }
        Update: {
          epoch?: number
          gpu_memory_usage?: number | null
          id?: string
          learning_rate?: number | null
          perplexity?: number | null
          step?: number
          timestamp?: string | null
          train_loss?: number | null
          training_job_id?: string | null
          val_loss?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "training_metrics_training_job_id_fkey"
            columns: ["training_job_id"]
            isOneToOne: false
            referencedRelation: "training_jobs"
            referencedColumns: ["id"]
          },
        ]
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
