'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Database, Upload, BarChart3, Settings, Play, CheckCircle, AlertCircle } from 'lucide-react';
import { Dataset, Paragraph, TextAnalysisResult } from '@/lib/dataset/types';
import { TextPreprocessor } from '@/lib/dataset/preprocessing';
import { HumanizationPatternEngine } from '@/lib/dataset/patterns';

export default function DatasetManager() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);
  const [uploadText, setUploadText] = useState('');
  const [analysisResult, setAnalysisResult] = useState<TextAnalysisResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'upload' | 'patterns'>('overview');

  // Mock data for demonstration
  useEffect(() => {
    const mockDatasets: Dataset[] = [
      {
        id: '1',
        name: 'Academic Writing Corpus',
        description: '20,000 paragraphs from research papers and academic journals',
        total_paragraphs: 20000,
        status: 'completed',
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-20T15:30:00Z'
      },
      {
        id: '2',
        name: 'Business Communication Dataset',
        description: 'Professional emails, reports, and business documents',
        total_paragraphs: 15000,
        status: 'processing',
        created_at: '2024-01-18T09:00:00Z',
        updated_at: '2024-01-22T14:20:00Z'
      }
    ];
    setDatasets(mockDatasets);
  }, []);

  const handleTextAnalysis = () => {
    if (!uploadText.trim()) return;
    
    setIsProcessing(true);
    setTimeout(() => {
      const result = TextPreprocessor.analyzeText(uploadText);
      setAnalysisResult(result);
      setIsProcessing(false);
    }, 1500);
  };

  const handleDatasetUpload = () => {
    if (!uploadText.trim() || !analysisResult) return;
    
    // Mock upload process
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setUploadText('');
      setAnalysisResult(null);
      alert('Text successfully added to dataset!');
    }, 2000);
  };

  const getDefaultPatterns = () => {
    return HumanizationPatternEngine.getDefaultPatterns();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Database className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Dataset Management</h1>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Phase 2: Dataset Design
          </Badge>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm">
          {(['overview', 'upload', 'patterns'] as const).map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? 'default' : 'ghost'}
              onClick={() => setActiveTab(tab)}
              className="flex-1"
            >
              {tab === 'overview' && <BarChart3 className="h-4 w-4 mr-2" />}
              {tab === 'upload' && <Upload className="h-4 w-4 mr-2" />}
              {tab === 'patterns' && <Settings className="h-4 w-4 mr-2" />}
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {datasets.map((dataset) => (
              <Card key={dataset.id} className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setSelectedDataset(dataset)}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{dataset.name}</CardTitle>
                    <Badge variant={dataset.status === 'completed' ? 'default' : 'secondary'}>
                      {dataset.status}
                    </Badge>
                  </div>
                  <CardDescription>{dataset.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Paragraphs:</span>
                      <span className="font-medium">{dataset.total_paragraphs.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Created:</span>
                      <span className="font-medium">
                        {new Date(dataset.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Dataset Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Dataset Statistics</CardTitle>
              <CardDescription>Overview of your humanization training data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">35,000</div>
                  <div className="text-sm text-gray-600">Total Paragraphs</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">8</div>
                  <div className="text-sm text-gray-600">Categories</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">6</div>
                  <div className="text-sm text-gray-600">Pattern Types</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">94.2%</div>
                  <div className="text-sm text-gray-600">Avg Quality Score</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Upload Tab */}
      {activeTab === 'upload' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <Card>
            <CardHeader>
              <CardTitle>Text Analysis & Upload</CardTitle>
              <CardDescription>
                Analyze and add human writing samples to your dataset
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Enter Human Writing Sample
                </label>
                <Textarea
                  placeholder="Paste a paragraph of human-written text for analysis..."
                  value={uploadText}
                  onChange={(e) => setUploadText(e.target.value)}
                  className="min-h-[150px]"
                />
              </div>

              <div className="flex space-x-4">
                <Button onClick={handleTextAnalysis} disabled={!uploadText.trim() || isProcessing}>
                  <Play className="h-4 w-4 mr-2" />
                  {isProcessing ? 'Analyzing...' : 'Analyze Text'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleDatasetUpload}
                  disabled={!analysisResult || isProcessing}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Add to Dataset
                </Button>
              </div>

              {/* Analysis Results */}
              {analysisResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <Card className="bg-blue-50 border-blue-200">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                        Analysis Results
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Word Count:</span>
                            <span className="font-medium">{analysisResult.word_count}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Sentence Count:</span>
                            <span className="font-medium">{analysisResult.sentence_count}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Avg Sentence Length:</span>
                            <span className="font-medium">{analysisResult.avg_sentence_length}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Complexity Score:</span>
                            <Badge variant="outline">{analysisResult.complexity_score}/10</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Quality Score:</span>
                            <Badge className="bg-green-100 text-green-800">
                              {(analysisResult.quality_score * 100).toFixed(1)}%
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Suggested Category:</span>
                            <Badge variant="secondary">{analysisResult.suggested_category}</Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <div className="text-sm text-gray-600 mb-2">Detected Patterns:</div>
                        <div className="flex flex-wrap gap-2">
                          {analysisResult.detected_patterns.map((pattern, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {pattern}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="text-sm text-gray-600 mb-2">Style Tags:</div>
                        <div className="flex flex-wrap gap-2">
                          {analysisResult.suggested_style_tags.map((tag, index) => (
                            <Badge key={index} className="bg-purple-100 text-purple-800 text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Patterns Tab */}
      {activeTab === 'patterns' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          <Card>
            <CardHeader>
              <CardTitle>Humanization Patterns</CardTitle>
              <CardDescription>
                Predefined transformation patterns for text humanization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {getDefaultPatterns().map((pattern, index) => (
                  <Card key={index} className="border-l-4 border-l-blue-500">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{pattern.name}</CardTitle>
                        <Badge variant="outline">{pattern.pattern_type}</Badge>
                      </div>
                      <CardDescription>{pattern.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Confidence Weight:</span>
                          <span className="font-medium">{(pattern.confidence_weight * 100).toFixed(0)}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Applicable Categories:</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {pattern.applicable_categories.map((category, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {category}
                            </Badge>
                          ))}
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-600">Transformation Type:</span>
                          <code className="ml-2 bg-gray-100 px-2 py-1 rounded text-xs">
                            {pattern.transformation_rule.type}
                          </code>
                        </div>
                      </div>
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
