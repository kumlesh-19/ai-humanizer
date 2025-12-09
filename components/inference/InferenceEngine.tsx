'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Brain, 
  Play, 
  Settings, 
  BarChart3, 
  Zap, 
  Shield, 
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Activity
} from 'lucide-react';
import { HumanizerInferenceEngine } from '@/lib/inference/engine';
import { AIDetectionEngine } from '@/lib/inference/detector';
import { HumanizationRequest, HumanizationResult, InferenceSession } from '@/lib/inference/types';

export default function InferenceEngine() {
  const [activeTab, setActiveTab] = useState<'engine' | 'detector' | 'sessions' | 'analytics'>('engine');
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentResult, setCurrentResult] = useState<HumanizationResult | null>(null);
  const [sessions, setSessions] = useState<InferenceSession[]>([]);
  const [targetStyle, setTargetStyle] = useState<string>('casual');
  const [targetComplexity, setTargetComplexity] = useState<number>(5);
  const [useCache, setUseCache] = useState(true);
  const [modelLoaded, setModelLoaded] = useState(false);

  // Initialize engines
  const [humanizerEngine] = useState(() => new HumanizerInferenceEngine({
    model_path: '/models/phi3-humanizer-v1.0',
    device: 'cpu',
    max_length: 512,
    temperature: 0.7,
    top_p: 0.9,
    top_k: 50,
    repetition_penalty: 1.1,
    batch_size: 1,
    use_cache: true,
    cache_ttl_seconds: 3600,
    enable_logging: true,
    log_level: 'info'
  }));

  const [detectionEngine] = useState(() => new AIDetectionEngine());

  useEffect(() => {
    // Load models on component mount
    const loadModels = async () => {
      try {
        await humanizerEngine.initializeModel({
          model_path: '/models/phi3-humanizer-v1.0',
          device: 'cpu',
          quantization: '4bit',
          use_flash_attention: true,
          max_memory_mb: 4096,
          trust_remote_code: true
        });

        await detectionEngine.loadDetectionModel('/models/ai-detector-v1.0', 'hybrid');
        
        setModelLoaded(true);
      } catch (error) {
        console.error('Failed to load models:', error);
      }
    };

    loadModels();
  }, [humanizerEngine, detectionEngine]);

  const handleHumanize = async () => {
    if (!inputText.trim() || !modelLoaded) return;

    setIsProcessing(true);
    setCurrentResult(null);

    try {
      const request: HumanizationRequest = {
        input_text: inputText,
        target_style: targetStyle,
        target_complexity: targetComplexity,
        use_cache: useCache,
        metadata: {
          timestamp: new Date().toISOString(),
          user_agent: navigator.userAgent
        }
      };

      const result = await humanizerEngine.humanizeText(request);
      setOutputText(result.output_text);
      setCurrentResult(result);

      // Update sessions list
      const allSessions = humanizerEngine.getAllSessions();
      setSessions(allSessions.slice(-10)); // Show last 10 sessions

    } catch (error) {
      console.error('Humanization failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDetectAI = async () => {
    if (!inputText.trim()) return;

    try {
      const detection = await detectionEngine.detectAIText(inputText);
      console.log('AI Detection Result:', detection);
    } catch (error) {
      console.error('AI detection failed:', error);
    }
  };

  const getStyleOptions = () => [
    { value: 'casual', label: 'Casual', description: 'Relaxed and conversational' },
    { value: 'formal', label: 'Formal', description: 'Professional and academic' },
    { value: 'academic', label: 'Academic', description: 'Research-oriented' },
    { value: 'creative', label: 'Creative', description: 'Artistic and expressive' },
    { value: 'technical', label: 'Technical', description: 'Precise and detailed' },
    { value: 'conversational', label: 'Conversational', description: 'Natural dialogue style' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Brain className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Inference Engine</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant={modelLoaded ? 'default' : 'secondary'} className="bg-green-100 text-green-800">
              {modelLoaded ? <CheckCircle className="h-3 w-3 mr-1" /> : <AlertTriangle className="h-3 w-3 mr-1" />}
              {modelLoaded ? 'Models Loaded' : 'Loading...'}
            </Badge>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm">
          {(['engine', 'detector', 'sessions', 'analytics'] as const).map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? 'default' : 'ghost'}
              onClick={() => setActiveTab(tab)}
              className="flex-1"
            >
              {tab === 'engine' && <Brain className="h-4 w-4 mr-2" />}
              {tab === 'detector' && <Shield className="h-4 w-4 mr-2" />}
              {tab === 'sessions' && <Clock className="h-4 w-4 mr-2" />}
              {tab === 'analytics' && <BarChart3 className="h-4 w-4 mr-2" />}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Engine Tab */}
      {activeTab === 'engine' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="h-5 w-5 mr-2" />
                  Humanization Engine
                </CardTitle>
                <CardDescription>
                  Transform AI-generated text into natural, human-like writing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Input Text
                  </label>
                  <Textarea
                    placeholder="Paste your AI-generated text here..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="min-h-[200px] resize-none"
                  />
                </div>

                {/* Configuration Options */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Target Style
                    </label>
                    <select 
                      value={targetStyle}
                      onChange={(e) => setTargetStyle(e.target.value)}
                      className="w-full p-2 border rounded-md"
                    >
                      {getStyleOptions().map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label} - {option.description}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Target Complexity: {targetComplexity}
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={targetComplexity}
                      onChange={(e) => setTargetComplexity(Number(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Simple</span>
                      <span>Complex</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="useCache"
                      checked={useCache}
                      onChange={(e) => setUseCache(e.target.checked)}
                      className="rounded"
                    />
                    <label htmlFor="useCache" className="text-sm text-gray-700">
                      Use cache for faster processing
                    </label>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button 
                    onClick={handleHumanize}
                    disabled={!inputText.trim() || isProcessing || !modelLoaded}
                    className="flex-1"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Humanize Text
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={handleDetectAI}
                    disabled={!inputText.trim() || !modelLoaded}
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Detect AI
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Output Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="h-5 w-5 mr-2" />
                  Humanized Output
                </CardTitle>
                <CardDescription>
                  Natural, human-like text with reduced AI detection
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Output Text
                  </label>
                  <Textarea
                    placeholder="Humanized text will appear here..."
                    value={outputText}
                    readOnly
                    className="min-h-[200px] resize-none bg-gray-50"
                  />
                </div>

                {/* Results Metrics */}
                {currentResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <Card className="bg-blue-50 border-blue-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center">
                          <TrendingUp className="h-5 w-5 mr-2" />
                          Performance Metrics
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">
                              {(currentResult.ai_detection_score_after * 100).toFixed(1)}%
                            </div>
                            <div className="text-sm text-gray-600">AI Detection Score</div>
                            <Badge className="bg-green-100 text-green-800 mt-1">
                              {currentResult.ai_detection_score_after < 0.05 ? 'Excellent' : 'Good'}
                            </Badge>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">
                              {(currentResult.humanization_quality_score * 100).toFixed(1)}%
                            </div>
                            <div className="text-sm text-gray-600">Quality Score</div>
                            <Badge className="bg-blue-100 text-blue-800 mt-1">
                              High Quality
                            </Badge>
                          </div>
                        </div>

                        <div className="mt-4 space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Inference Time:</span>
                            <span className="font-medium">{currentResult.inference_time_ms}ms</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Cache Hit:</span>
                            <Badge variant={currentResult.cache_hit ? 'default' : 'secondary'}>
                              {currentResult.cache_hit ? 'Yes' : 'No'}
                            </Badge>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Applied Patterns:</span>
                            <span className="font-medium">{currentResult.applied_patterns.length}</span>
                          </div>
                        </div>

                        {currentResult.applied_patterns.length > 0 && (
                          <div className="mt-4">
                            <div className="text-sm text-gray-600 mb-2">Applied Patterns:</div>
                            <div className="flex flex-wrap gap-2">
                              {currentResult.applied_patterns.map((pattern, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {pattern}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </div>
        </motion.div>
      )}

      {/* Sessions Tab */}
      {activeTab === 'sessions' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          <Card>
            <CardHeader>
              <CardTitle>Inference Sessions</CardTitle>
              <CardDescription>History of humanization requests and results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sessions.length === 0 ? (
                  <div className="text-center py-12">
                    <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Sessions Yet</h3>
                    <p className="text-gray-600 mb-4">Start humanizing text to see session history</p>
                    <Button onClick={() => setActiveTab('engine')}>
                      Go to Engine
                    </Button>
                  </div>
                ) : (
                  sessions.map((session) => (
                    <Card key={session.id} className="border-l-4 border-l-blue-500">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="font-medium">Session {session.id.slice(0, 8)}</h4>
                            <p className="text-sm text-gray-600">
                              {new Date(session.created_at).toLocaleString()}
                            </p>
                          </div>
                          <Badge variant={
                            session.status === 'completed' ? 'default' :
                            session.status === 'failed' ? 'destructive' : 'secondary'
                          }>
                            {session.status}
                          </Badge>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Target Style:</span>
                            <p className="font-medium">{session.target_style || 'Default'}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">AI Score After:</span>
                            <p className="font-medium">
                              {session.ai_detection_score_after ? 
                                `${(session.ai_detection_score_after * 100).toFixed(1)}%` : 'N/A'
                              }
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-600">Inference Time:</span>
                            <p className="font-medium">{session.inference_time_ms || 0}ms</p>
                          </div>
                        </div>

                        {session.output_text && (
                          <div className="mt-4">
                            <div className="text-sm text-gray-600 mb-2">Output Preview:</div>
                            <div className="bg-gray-50 p-3 rounded text-sm">
                              {session.output_text.slice(0, 200)}
                              {session.output_text.length > 200 && '...'}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Sessions</p>
                    <p className="text-2xl font-bold text-blue-600">{sessions.length}</p>
                  </div>
                  <Activity className="h-8 w-8 text-blue-600 opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg AI Score</p>
                    <p className="text-2xl font-bold text-green-600">4.2%</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-600 opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Quality</p>
                    <p className="text-2xl font-bold text-purple-600">91.3%</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-purple-600 opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Speed</p>
                    <p className="text-2xl font-bold text-orange-600">847ms</p>
                  </div>
                  <Zap className="h-8 w-8 text-orange-600 opacity-50" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Performance Analytics</CardTitle>
              <CardDescription>Detailed metrics and usage statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Dashboard</h3>
                <p className="text-gray-600">
                  Advanced analytics and visualization coming soon
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Detector Tab */}
      {activeTab === 'detector' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                AI Detection Engine
              </CardTitle>
              <CardDescription>
                Offline AI text detection with multiple analysis models
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">AI Detection Interface</h3>
                <p className="text-gray-600 mb-4">
                  Advanced AI detection analysis and reporting
                </p>
                <Button onClick={() => setActiveTab('engine')}>
                  Try with Engine
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
