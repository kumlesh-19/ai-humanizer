export interface ModelVersion {
  id: string;
  name: string;
  version: string;
  base_model: string;
  model_type: 'base' | 'fine_tuned' | 'lora' | 'qlora';
  model_path: string;
  config: TrainingConfig;
  training_dataset_id?: string;
  status: 'training' | 'completed' | 'failed' | 'deployed';
  performance_metrics?: PerformanceMetrics;
  file_size?: number;
  created_at: string;
  updated_at: string;
}

export interface TrainingJob {
  id: string;
  model_version_id?: string;
  job_type: 'full_fine_tune' | 'lora_training' | 'qlora_training' | 'evaluation';
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  progress: number; // 0-100
  current_epoch: number;
  total_epochs: number;
  current_step: number;
  total_steps: number;
  loss_value?: number;
  learning_rate?: number;
  gpu_utilization?: number;
  memory_usage?: number;
  training_time_seconds?: number;
  error_message?: string;
  config: TrainingConfig;
  logs?: string[];
  started_at?: string;
  completed_at?: string;
  created_at: string;
}

export interface TrainingMetrics {
  id: string;
  training_job_id?: string;
  epoch: number;
  step: number;
  train_loss?: number;
  val_loss?: number;
  perplexity?: number;
  learning_rate?: number;
  gpu_memory_usage?: number;
  timestamp: string;
}

export interface ModelEvaluation {
  id: string;
  model_version_id?: string;
  evaluation_type: 'ai_detection' | 'humanization_quality' | 'speed' | 'accuracy';
  test_dataset_id?: string;
  metrics: Record<string, any>;
  score?: number;
  passed_threshold?: boolean;
  evaluation_details?: Record<string, any>;
  created_at: string;
}

export interface Checkpoint {
  id: string;
  training_job_id?: string;
  checkpoint_name: string;
  checkpoint_path: string;
  epoch?: number;
  step?: number;
  loss_value?: number;
  file_size?: number;
  is_best?: boolean;
  created_at: string;
}

export interface TrainingConfig {
  // Model configuration
  model_name: string;
  base_model: string;
  model_type: 'lora' | 'qlora' | 'full_fine_tune';
  
  // Training parameters
  learning_rate: number;
  batch_size: number;
  num_epochs: number;
  warmup_steps: number;
  weight_decay: number;
  gradient_clip_val: number;
  
  // LoRA/QLoRA specific
  lora_r?: number;
  lora_alpha?: number;
  lora_dropout?: number;
  target_modules?: string[];
  quantization_bits?: number;
  
  // Data configuration
  dataset_id: string;
  max_seq_length: number;
  train_test_split: number;
  
  // Hardware configuration
  device: 'cpu' | 'cuda' | 'mps';
  mixed_precision: boolean;
  gradient_accumulation_steps: number;
  
  // Evaluation configuration
  eval_steps: number;
  save_steps: number;
  logging_steps: number;
  
  // Early stopping
  early_stopping: boolean;
  patience: number;
  min_delta: number;
}

export interface PerformanceMetrics {
  ai_detection_score: number;
  humanization_quality: number;
  inference_speed_ms: number;
  model_accuracy: number;
  perplexity: number;
  memory_usage_mb: number;
  gpu_utilization_percent: number;
}

export interface HardwareRequirements {
  gpu_memory_gb: number;
  system_memory_gb: number;
  cpu_cores: number;
  storage_gb: number;
  recommended_gpu: string[];
}

export interface TrainingProgress {
  current_epoch: number;
  total_epochs: number;
  current_step: number;
  total_steps: number;
  train_loss: number;
  val_loss: number;
  learning_rate: number;
  gpu_utilization: number;
  memory_usage: number;
  eta_seconds: number;
}

export interface TrainingEnvironment {
  python_version: string;
  torch_version: string;
  transformers_version: string;
  cuda_version?: string;
  gpu_name?: string;
  gpu_memory_total: number;
  system_memory_total: number;
  available_disk_space: number;
}
