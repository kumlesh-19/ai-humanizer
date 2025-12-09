export interface InferenceSession {
  id: string;
  model_version_id?: string;
  input_text: string;
  output_text?: string;
  input_category?: string;
  target_style?: string;
  target_complexity?: number;
  selected_patterns?: string[];
  ai_detection_score_before?: number;
  ai_detection_score_after?: number;
  humanization_quality_score?: number;
  inference_time_ms?: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error_message?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface InferenceLog {
  id: string;
  session_id?: string;
  log_level: 'debug' | 'info' | 'warning' | 'error';
  message: string;
  details?: Record<string, any>;
  timestamp: string;
}

export interface StyleProfile {
  id: string;
  name: string;
  description?: string;
  role_type: 'academic' | 'professional' | 'casual' | 'creative' | 'technical' | 'conversational';
  style_guidelines: Record<string, any>;
  vocabulary_preferences?: Record<string, any>;
  sentence_structure_rules?: Record<string, any>;
  tone_markers?: string[];
  complexity_preference?: number;
  is_default?: boolean;
  created_at: string;
  updated_at: string;
}

export interface AIDetectionModel {
  id: string;
  name: string;
  version: string;
  model_type: 'statistical' | 'neural' | 'hybrid';
  model_path: string;
  detection_threshold: number;
  config: Record<string, any>;
  is_active?: boolean;
  created_at: string;
  updated_at: string;
}

export interface InferenceCache {
  id: string;
  cache_key: string;
  input_hash: string;
  model_version_id?: string;
  output_text: string;
  ai_detection_score?: number;
  humanization_quality_score?: number;
  inference_time_ms?: number;
  hit_count: number;
  last_accessed: string;
  expires_at?: string;
  created_at: string;
}

export interface PerformanceMetric {
  id: string;
  session_id?: string;
  model_version_id?: string;
  metric_type: 'inference_time' | 'memory_usage' | 'gpu_utilization' | 'throughput';
  value: number;
  unit?: string;
  additional_data?: Record<string, any>;
  timestamp: string;
}

export interface HumanizationRequest {
  input_text: string;
  target_style?: string;
  target_complexity?: number;
  selected_patterns?: string[];
  model_version_id?: string;
  use_cache?: boolean;
  metadata?: Record<string, any>;
}

export interface HumanizationResult {
  session_id: string;
  output_text: string;
  ai_detection_score_before: number;
  ai_detection_score_after: number;
  humanization_quality_score: number;
  inference_time_ms: number;
  applied_patterns: string[];
  style_profile_used?: string;
  cache_hit?: boolean;
  metadata?: Record<string, any>;
}

export interface InferenceConfig {
  model_path: string;
  device: 'cpu' | 'cuda' | 'mps';
  max_length: number;
  temperature: number;
  top_p: number;
  top_k: number;
  repetition_penalty: number;
  batch_size: number;
  use_cache: boolean;
  cache_ttl_seconds: number;
  enable_logging: boolean;
  log_level: 'debug' | 'info' | 'warning' | 'error';
}

export interface ModelLoadConfig {
  model_path: string;
  device: 'cpu' | 'cuda' | 'mps';
  quantization?: '4bit' | '8bit' | '16bit';
  use_flash_attention?: boolean;
  max_memory_mb?: number;
  trust_remote_code?: boolean;
}

export interface TextAnalysis {
  word_count: number;
  sentence_count: number;
  avg_sentence_length: number;
  complexity_score: number;
  formality_score: number;
  sentiment_score: number;
  detected_patterns: string[];
  suggested_category: string;
  suggested_style: string;
}

export interface PatternApplication {
  pattern_name: string;
  pattern_type: 'lexical' | 'syntactic' | 'semantic' | 'stylistic';
  confidence: number;
  applied_at: string;
  changes_made: number;
}

export interface InferenceStats {
  total_sessions: number;
  successful_sessions: number;
  failed_sessions: number;
  avg_inference_time_ms: number;
  avg_ai_detection_score: number;
  avg_humanization_quality: number;
  cache_hit_rate: number;
  most_used_styles: Array<{ style: string; count: number }>;
  most_used_patterns: Array<{ pattern: string; count: number }>;
}
