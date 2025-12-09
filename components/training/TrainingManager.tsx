'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Play, Pause, Square, Settings, BarChart3, CheckCircle, AlertCircle, Clock, Zap, HardDrive } from 'lucide-react';
import { TrainingJob, TrainingConfig, ModelVersion, TrainingProgress } from '@/lib/training/types';
import { TrainingConfigManager } from '@/lib/training/configs';
import { Phi3Trainer } from '@/lib/training/trainer';

export default function TrainingManager() {
  const [activeTab, setActiveTab] = useState<'overview' | 'configs' | 'jobs' | 'monitor'>('overview');
  const [trainingJobs, setTrainingJobs] = useState<TrainingJob[]>([]);
  const [modelVersions, setModelVersions] = useState<ModelVersion[]>([]);
  const [selectedConfig, setSelectedConfig] = useState<string>('lora_lightweight');
  const [isTraining, setIsTraining] = useState(false);
  const [currentProgress, setCurrentProgress] = useState<TrainingProgress | null>(null);
  const [trainer, setTrainer] = useState<Phi3Trainer | null>(null);

  // Mock data for demonstration
  useEffect(() => {
    const mockJobs: TrainingJob[] = [
      {
        id: '1',
        model_version_id: 'model-1',
        job_type: 'lora_training',
        status: 'completed',
        progress: 100,
        current_epoch: 3,
        total_epochs: 3,
        current_step: 1500,
        total_steps: 1500,
        loss_value: 0.3421,
        learning_rate: 0.0001,
        gpu_utilization: 87,
        memory_usage: 8192,
        training_time_seconds: 7200,
        config: TrainingConfigManager.getDefaultConfig('lora_lightweight') as TrainingConfig,
        logs: ['Training started', 'Epoch 1/3 completed', 'Training completed'],
        started_at: '2024-01-20T10:00:00Z',
        completed_at: '2024-01-20T12:00:00Z',
        created_at: '2024-01-20T10:00:00Z'
      },
      {
        id: '2',
        model_version_id: 'model-2',
        job_type: 'qlora_training',
        status: 'running',
        progress: 65,
        current_epoch: 2,
        total_epochs: 5,
        current_step: 1300,
        total_steps: 2000,
        loss_value: 0.4567,
        learning_rate: 0.00008,
        gpu_utilization: 92,
        memory_usage: 6144,
        config: TrainingConfigManager.getDefaultConfig('qlora_optimized') as TrainingConfig,
        logs: ['Training started', 'Epoch 1/5 completed', 'Epoch 2/5 in progress'],
        started_at: '2024-01-22T14:00:00Z',
        created_at: '2024-01-22T14:00:00Z'
      }
    ];

    const mockModels: ModelVersion[] = [
      {
        id: 'model-1',
        name: 'Phi-3 Mini Humanizer v1.0',
        version: '1.0.0',
        base_model: 'phi-3-mini-3.8b-gguf-q4_k_m',
        model_type: 'lora',
        model_path: '/models/phi3-humanizer-v1.0',
        config: TrainingConfigManager.getDefaultConfig('lora_lightweight') as TrainingConfig,
        status: 'completed',
        performance_metrics: {
          ai_detection_score: 0.042,
          humanization_quality: 0.91,
          inference_speed_ms: 45,
          model_accuracy: 0.89,
          perplexity: 12.3,
          memory_usage_mb: 2048,
          gpu_utilization_percent: 15
        },
        file_size: 2048576,
        created_at: '2024-01-20T12:00:00Z',
        updated_at: '2024-01-20T12:00:00Z'
      }
    ];

    setTrainingJobs(mockJobs);
    setModelVersions(mockModels);
  }, []);

  const handleStartTraining = async () => {
    const config = TrainingConfigManager.createCustomConfig({
      ...TrainingConfigManager.getDefaultConfig(selectedConfig as any),
      dataset_id: 'dataset-1'
    });

    const newTrainer = new Phi3Trainer(config);
    setTrainer(newTrainer);
    setIsTraining(true);

    // Start training in background
    newTrainer.startTraining().then(() => {
      setIsTraining(false);
      setTrainer(null);
    });

    // Simulate progress updates
    const interval = setInterval(() => {
      const progress = newTrainer.getProgress();
      setCurrentProgress(progress);
      
      if (progress.current_step >= progress.total_steps) {
        clearInterval(interval);
      }
    }, 1000);
  };

  const handleStopTraining = async () => {
    if (trainer) {
      await trainer.stopTraining();
      setIsTraining(false);
      setTrainer(null);
      setCurrentProgress(null);
    }
  };

  const getConfigs = () => {
    return TrainingConfigManager.getAllDefaultConfigs();
  };

  const getHardwareRequirements = (configType: string) => {
    return TrainingConfigManager.getHardwareRequirements(configType as any);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Brain className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Training Manager</h1>
          </div>
          <Badge variant="secondary" className="bg-purple-100 text-purple-800">
            Phase 3: Fine-Tuning Architecture
          </Badge>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm">
          {(['overview', 'configs', 'jobs', 'monitor'] as const).map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? 'default' : 'ghost'}
              onClick={() => setActiveTab(tab)}
              className="flex-1"
            >
              {tab === 'overview' && <BarChart3 className="h-4 w-4 mr-2" />}
              {tab === 'configs' && <Settings className="h-4 w-4 mr-2" />}
              {tab === 'jobs' && <Clock className="h-4 w-4 mr-2" />}
              {tab === 'monitor' && <Zap className="h-4 w-4 mr-2" />}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {trainingJobs.filter(job => job.status === 'running').length}
                    </p>
                  </div>
                  <Zap className="h-8 w-8 text-blue-600 opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Completed Models</p>
                    <p className="text-2xl font-bold text-green-600">
                      {modelVersions.filter(model => model.status === 'completed').length}
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600 opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Training Time</p>
                    <p className="text-2xl font-bold text-purple-600">2.4h</p>
                  </div>
                  <Clock className="h-8 w-8 text-purple-600 opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">GPU Utilization</p>
                    <p className="text-2xl font-bold text-orange-600">89%</p>
                  </div>
                  <HardDrive className="h-8 w-8 text-orange-600 opacity-50" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Start Training */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Quick Start Training</CardTitle>
              <CardDescription>Start a new training job with predefined configurations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                {Object.entries(getConfigs()).map(([key, config]) => {
                  const requirements = getHardwareRequirements(key);
                  return (
                    <Card key={key} className={`cursor-pointer transition-all ${
                      selectedConfig === key ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'
                    }`} onClick={() => setSelectedConfig(key)}>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg capitalize">
                          {key.replace('_', ' ')}
                        </CardTitle>
                        <Badge variant="outline">{config.model_type}</Badge>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Learning Rate:</span>
                            <span className="font-medium">{config.learning_rate}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Batch Size:</span>
                            <span className="font-medium">{config.batch_size}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Epochs:</span>
                            <span className="font-medium">{config.num_epochs}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">GPU Memory:</span>
                            <span className="font-medium">{requirements.gpu_memory_gb}GB</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Selected: {selectedConfig.replace('_', ' ')}</h4>
                  <p className="text-sm text-gray-600">
                    Estimated time: {TrainingConfigManager.estimateTrainingTime(
                      TrainingConfigManager.createCustomConfig({
                        ...TrainingConfigManager.getDefaultConfig(selectedConfig as any),
                        dataset_id: 'dataset-1'
                      }), 20000
                    )} hours
                  </p>
                </div>
                <Button 
                  onClick={handleStartTraining} 
                  disabled={isTraining}
                  size="lg"
                >
                  {isTraining ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Training...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Start Training
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Model Versions */}
          <Card>
            <CardHeader>
              <CardTitle>Trained Models</CardTitle>
              <CardDescription>Your fine-tuned Phi-3 Mini models</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {modelVersions.map((model) => (
                  <div key={model.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{model.name}</h4>
                      <p className="text-sm text-gray-600">{model.version} • {model.model_type}</p>
                      {model.performance_metrics && (
                        <div className="flex items-center space-x-4 mt-2 text-sm">
                          <span className="text-green-600">
                            AI Score: {(model.performance_metrics.ai_detection_score * 100).toFixed(1)}%
                          </span>
                          <span className="text-blue-600">
                            Quality: {(model.performance_metrics.humanization_quality * 100).toFixed(1)}%
                          </span>
                          <span className="text-purple-600">
                            Speed: {model.performance_metrics.inference_speed_ms}ms
                          </span>
                        </div>
                      )}
                    </div>
                    <Badge variant={model.status === 'completed' ? 'default' : 'secondary'}>
                      {model.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Monitor Tab */}
      {activeTab === 'monitor' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          <Card>
            <CardHeader>
              <CardTitle>Training Monitor</CardTitle>
              <CardDescription>Real-time training progress and metrics</CardDescription>
            </CardHeader>
            <CardContent>
              {currentProgress ? (
                <div className="space-y-6">
                  {/* Progress Overview */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Training Progress</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Overall Progress</span>
                              <span>{Math.round((currentProgress.current_step / currentProgress.total_steps) * 100)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${(currentProgress.current_step / currentProgress.total_steps) * 100}%` }}
                              />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Epoch:</span>
                              <p className="font-medium">{currentProgress.current_epoch}/{currentProgress.total_epochs}</p>
                            </div>
                            <div>
                              <span className="text-gray-600">Step:</span>
                              <p className="font-medium">{currentProgress.current_step}/{currentProgress.total_steps}</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Training Metrics</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Train Loss:</span>
                            <span className="font-medium">{currentProgress.train_loss.toFixed(4)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Learning Rate:</span>
                            <span className="font-medium">{currentProgress.learning_rate.toExponential(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">GPU Utilization:</span>
                            <span className="font-medium">{currentProgress.gpu_utilization}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Memory Usage:</span>
                            <span className="font-medium">{(currentProgress.memory_usage / 1024).toFixed(1)}GB</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">ETA:</span>
                            <span className="font-medium">{Math.floor(currentProgress.eta_seconds / 60)}m {currentProgress.eta_seconds % 60}s</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Control Buttons */}
                  <div className="flex space-x-4">
                    <Button variant="outline" onClick={handleStopTraining}>
                      <Square className="h-4 w-4 mr-2" />
                      Stop Training
                    </Button>
                    <Button variant="outline">
                      <Pause className="h-4 w-4 mr-2" />
                      Pause
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Brain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Training</h3>
                  <p className="text-gray-600 mb-4">Start a training job to see real-time metrics</p>
                  <Button onClick={() => setActiveTab('overview')}>
                    Go to Overview
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Configs Tab */}
      {activeTab === 'configs' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          <Card>
            <CardHeader>
              <CardTitle>Training Configurations</CardTitle>
              <CardDescription>Predefined and custom training configurations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(getConfigs()).map(([key, config]) => {
                  const requirements = getHardwareRequirements(key);
                  return (
                    <Card key={key} className="border-l-4 border-l-blue-500">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg capitalize">
                            {key.replace('_', ' ')}
                          </CardTitle>
                          <Badge variant="outline">{config.model_type}</Badge>
                        </div>
                        <CardDescription>
                          {key === 'lora_lightweight' && 'Lightweight LoRA training for quick prototyping'}
                          {key === 'qlora_optimized' && 'Optimized QLoRA training with 4-bit quantization'}
                          {key === 'full_fine_tune' && 'Full model fine-tuning for maximum performance'}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                          <div>
                            <h4 className="font-medium mb-2">Training Parameters</h4>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Learning Rate:</span>
                                <span>{config.learning_rate}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Batch Size:</span>
                                <span>{config.batch_size}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Epochs:</span>
                                <span>{config.num_epochs}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Weight Decay:</span>
                                <span>{config.weight_decay}</span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium mb-2">Model Configuration</h4>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Base Model:</span>
                                <span className="text-xs">{config.base_model}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Max Seq Length:</span>
                                <span>{config.max_seq_length}</span>
                              </div>
                              {config.lora_r && (
                                <div className="flex justify-between">
                                  <span className="text-gray-600">LoRA Rank:</span>
                                  <span>{config.lora_r}</span>
                                </div>
                              )}
                              {config.quantization_bits && (
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Quantization:</span>
                                  <span>{config.quantization_bits}-bit</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium mb-2">Hardware Requirements</h4>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">GPU Memory:</span>
                                <span>{requirements.gpu_memory_gb}GB</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">System RAM:</span>
                                <span>{requirements.system_memory_gb}GB</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">CPU Cores:</span>
                                <span>{requirements.cpu_cores}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Storage:</span>
                                <span>{requirements.storage_gb}GB</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4">
                          <h4 className="font-medium mb-2">Recommended GPUs</h4>
                          <div className="flex flex-wrap gap-2">
                            {requirements.recommended_gpu.map((gpu, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {gpu}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Jobs Tab */}
      {activeTab === 'jobs' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          <Card>
            <CardHeader>
              <CardTitle>Training Jobs</CardTitle>
              <CardDescription>History and status of all training jobs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trainingJobs.map((job) => (
                  <Card key={job.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="font-medium">Training Job #{job.id}</h4>
                          <p className="text-sm text-gray-600">
                            {job.job_type.replace('_', ' ')} • Started {new Date(job.started_at || job.created_at).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={
                            job.status === 'completed' ? 'default' :
                            job.status === 'running' ? 'secondary' :
                            job.status === 'failed' ? 'destructive' : 'outline'
                          }>
                            {job.status}
                          </Badge>
                          {job.status === 'running' && (
                            <div className="animate-pulse">
                              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                            </div>
                          )}
                        </div>
                      </div>

                      {job.status === 'running' && (
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span>{job.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${job.progress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      <div className="grid md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Epoch:</span>
                          <p className="font-medium">{job.current_epoch}/{job.total_epochs}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Steps:</span>
                          <p className="font-medium">{job.current_step}/{job.total_steps}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Loss:</span>
                          <p className="font-medium">{job.loss_value?.toFixed(4) || 'N/A'}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">GPU:</span>
                          <p className="font-medium">{job.gpu_utilization || 0}%</p>
                        </div>
                      </div>

                      {job.logs && job.logs.length > 0 && (
                        <div className="mt-4">
                          <h5 className="font-medium mb-2">Recent Logs</h5>
                          <div className="bg-gray-50 p-3 rounded text-xs font-mono max-h-32 overflow-y-auto">
                            {job.logs.slice(-3).map((log, index) => (
                              <div key={index} className="text-gray-700">{log}</div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
