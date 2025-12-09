export interface Dataset {
  id: string;
  name: string;
  description?: string;
  total_paragraphs: number;
  status: 'active' | 'processing' | 'completed' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface Paragraph {
  id: string;
  dataset_id?: string;
  original_text: string;
  category: string;
  style_tags: string[];
  complexity_score: number; // 1-10
  word_count?: number;
  sentence_count?: number;
  avg_sentence_length?: number;
  humanization_patterns?: Record<string, any>;
  quality_score: number; // 0-1
  source_reference?: string;
  created_at: string;
  updated_at: string;
}

export interface HumanizationPattern {
  id: string;
  name: string;
  description?: string;
  pattern_type: 'lexical' | 'syntactic' | 'semantic' | 'stylistic';
  transformation_rule: Record<string, any>;
  confidence_weight: number; // 0-1
  applicable_categories: string[];
  created_at: string;
  updated_at: string;
}

export interface PreprocessingJob {
  id: string;
  dataset_id?: string;
  job_type: 'validation' | 'analysis' | 'pattern_extraction' | 'quality_scoring';
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number; // 0-100
  error_message?: string;
  started_at?: string;
  completed_at?: string;
  created_at: string;
}

export interface DatasetUploadConfig {
  name: string;
  description?: string;
  categories: string[];
  quality_threshold: number; // 0-1
  complexity_range: [number, number]; // [min, max]
  style_tags: string[];
}

export interface TextAnalysisResult {
  word_count: number;
  sentence_count: number;
  avg_sentence_length: number;
  complexity_score: number;
  detected_patterns: string[];
  quality_score: number;
  suggested_category: string;
  suggested_style_tags: string[];
}

export interface HumanizationTarget {
  input_text: string;
  target_style: string;
  target_complexity: number;
  target_patterns: string[];
  expected_ai_score: number; // Target AI detection score (< 0.05)
}
