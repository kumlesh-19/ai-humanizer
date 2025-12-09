import { TrainingConfig, HardwareRequirements } from './types';

export class TrainingConfigManager {
  private static readonly DEFAULT_CONFIGS: Record<string, Omit<TrainingConfig, 'dataset_id'>> = {
    lora_lightweight: {
      model_name: 'phi-3-mini-humanizer-lora-light',
      base_model: 'phi-3-mini-3.8b-gguf-q4_k_m',
      model_type: 'lora',
      learning_rate: 2e-4,
      batch_size: 4,
      num_epochs: 3,
      warmup_steps: 100,
      weight_decay: 0.01,
      gradient_clip_val: 1.0,
      lora_r: 16,
      lora_alpha: 32,
      lora_dropout: 0.1,
      target_modules: ['q_proj', 'k_proj', 'v_proj', 'o_proj', 'gate_proj', 'up_proj', 'down_proj'],
      max_seq_length: 512,
      train_test_split: 0.9,
      device: 'cuda',
      mixed_precision: true,
      gradient_accumulation_steps: 4,
      eval_steps: 500,
      save_steps: 1000,
      logging_steps: 100,
      early_stopping: true,
      patience: 3,
      min_delta: 0.001
    },
    qlora_optimized: {
      model_name: 'phi-3-mini-humanizer-qlora-optimized',
      base_model: 'phi-3-mini-3.8b-gguf-q4_k_m',
      model_type: 'qlora',
      learning_rate: 1e-4,
      batch_size: 8,
      num_epochs: 5,
      warmup_steps: 200,
      weight_decay: 0.05,
      gradient_clip_val: 0.5,
      lora_r: 64,
      lora_alpha: 16,
      lora_dropout: 0.05,
      target_modules: ['q_proj', 'k_proj', 'v_proj', 'o_proj', 'gate_proj', 'up_proj', 'down_proj'],
      quantization_bits: 4,
      max_seq_length: 512,
      train_test_split: 0.9,
      device: 'cuda',
      mixed_precision: true,
      gradient_accumulation_steps: 2,
      eval_steps: 250,
      save_steps: 500,
      logging_steps: 50,
      early_stopping: true,
      patience: 5,
      min_delta: 0.0005
    },
    full_fine_tune: {
      model_name: 'phi-3-mini-humanizer-full',
      base_model: 'phi-3-mini-3.8b-gguf-q4_k_m',
      model_type: 'full_fine_tune',
      learning_rate: 5e-5,
      batch_size: 2,
      num_epochs: 10,
      warmup_steps: 500,
      weight_decay: 0.1,
      gradient_clip_val: 1.0,
      max_seq_length: 512,
      train_test_split: 0.9,
      device: 'cuda',
      mixed_precision: true,
      gradient_accumulation_steps: 8,
      eval_steps: 1000,
      save_steps: 2000,
      logging_steps: 100,
      early_stopping: true,
      patience: 7,
      min_delta: 0.001
    }
  };

  private static readonly HARDWARE_REQUIREMENTS: Record<string, HardwareRequirements> = {
    lora_lightweight: {
      gpu_memory_gb: 8,
      system_memory_gb: 16,
      cpu_cores: 4,
      storage_gb: 50,
      recommended_gpu: ['RTX 3060', 'RTX 4060', 'GTX 1660 Super']
    },
    qlora_optimized: {
      gpu_memory_gb: 12,
      system_memory_gb: 32,
      cpu_cores: 6,
      storage_gb: 75,
      recommended_gpu: ['RTX 3060 Ti', 'RTX 4070', 'RTX 3080']
    },
    full_fine_tune: {
      gpu_memory_gb: 24,
      system_memory_gb: 64,
      cpu_cores: 8,
      storage_gb: 150,
      recommended_gpu: ['RTX 3090', 'RTX 4090', 'A100', 'H100']
    }
  };

  static getDefaultConfig(configType: keyof typeof this.DEFAULT_CONFIGS): Omit<TrainingConfig, 'dataset_id'> {
    return this.DEFAULT_CONFIGS[configType];
  }

  static getAllDefaultConfigs(): Record<string, Omit<TrainingConfig, 'dataset_id'>> {
    return this.DEFAULT_CONFIGS;
  }

  static getHardwareRequirements(configType: keyof typeof this.HARDWARE_REQUIREMENTS): HardwareRequirements {
    return this.HARDWARE_REQUIREMENTS[configType];
  }

  static createCustomConfig(overrides: Partial<TrainingConfig>): TrainingConfig {
    const baseConfig = this.DEFAULT_CONFIGS.lora_lightweight;
    return {
      ...baseConfig,
      ...overrides,
      // Ensure required fields are present
      model_name: overrides.model_name || baseConfig.model_name,
      base_model: overrides.base_model || baseConfig.base_model,
      model_type: overrides.model_type || baseConfig.model_type,
      dataset_id: overrides.dataset_id || ''
    };
  }

  static validateConfig(config: TrainingConfig): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Basic validation
    if (!config.model_name) errors.push('Model name is required');
    if (!config.base_model) errors.push('Base model is required');
    if (!config.dataset_id) errors.push('Dataset ID is required');

    // Learning rate validation
    if (config.learning_rate <= 0 || config.learning_rate > 1) {
      errors.push('Learning rate must be between 0 and 1');
    }

    // Batch size validation
    if (config.batch_size <= 0) errors.push('Batch size must be positive');

    // Epochs validation
    if (config.num_epochs <= 0 || config.num_epochs > 100) {
      errors.push('Number of epochs must be between 1 and 100');
    }

    // LoRA specific validation
    if (config.model_type === 'lora' || config.model_type === 'qlora') {
      if (!config.lora_r || config.lora_r <= 0) errors.push('LoRA rank must be positive');
      if (!config.lora_alpha || config.lora_alpha <= 0) errors.push('LoRA alpha must be positive');
      if (!config.target_modules || config.target_modules.length === 0) {
        errors.push('Target modules must be specified for LoRA training');
      }
    }

    // QLoRA specific validation
    if (config.model_type === 'qlora') {
      if (!config.quantization_bits || ![4, 8].includes(config.quantization_bits)) {
        errors.push('QLoRA quantization must be 4 or 8 bits');
      }
    }

    // Sequence length validation
    if (config.max_seq_length <= 0 || config.max_seq_length > 4096) {
      errors.push('Max sequence length must be between 1 and 4096');
    }

    // Train/test split validation
    if (config.train_test_split <= 0 || config.train_test_split >= 1) {
      errors.push('Train/test split must be between 0 and 1');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static estimateTrainingTime(config: TrainingConfig, datasetSize: number): number {
    // Rough estimation in hours
    const baseTimePerEpoch = (datasetSize / config.batch_size) * 0.001; // Rough estimate
    const complexityMultiplier = config.model_type === 'full_fine_tune' ? 3 : 
                               config.model_type === 'qlora' ? 1.5 : 1;
    const hardwareMultiplier = config.device === 'cuda' ? 0.3 : 1;
    
    return Math.round(
      baseTimePerEpoch * config.num_epochs * complexityMultiplier * hardwareMultiplier
    );
  }

  static estimateMemoryUsage(config: TrainingConfig): number {
    // Rough estimation in GB
    let baseMemory = 8; // Base model memory
    
    if (config.model_type === 'full_fine_tune') {
      baseMemory *= 4; // Full fine-tuning requires more memory
    } else if (config.model_type === 'qlora') {
      baseMemory *= 0.5; // QLoRA reduces memory significantly
    }
    
    // Add batch size memory
    baseMemory += (config.batch_size * config.max_seq_length * 4) / (1024 * 1024 * 1024);
    
    return Math.round(baseMemory * 100) / 100;
  }
}
