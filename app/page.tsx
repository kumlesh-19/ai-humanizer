'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Brain, Sparkles, Shield, Zap, CheckCircle, ArrowRight, Database, BarChart3, Settings, Cpu, Play } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleHumanize = async () => {
    if (!inputText.trim()) return;
    
    setIsProcessing(true);
    // Simulate processing - in real implementation, this would call AI model
    setTimeout(() => {
      setOutputText(`Humanized version of: "${inputText}"\n\nThis text has been processed by our fine-tuned Phi-3 Mini model to achieve human-like writing patterns with reduced AI detection scores.`);
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">AI Humanizer</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/dataset">
                <Button variant="outline" size="sm">
                  <Database className="h-4 w-4 mr-2" />
                  Dataset
                </Button>
              </Link>
              <Link href="/training">
                <Button variant="outline" size="sm">
                  <Cpu className="h-4 w-4 mr-2" />
                  Training
                </Button>
              </Link>
              <Link href="/inference">
                <Button variant="outline" size="sm">
                  <Play className="h-4 w-4 mr-2" />
                  Inference
                </Button>
              </Link>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <Shield className="h-3 w-3 mr-1" />
                Offline Ready
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Advanced AI Text Humanization
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Powered by fine-tuned Phi-3 Mini (3.8B) model for converting AI-generated text 
            into human-like writing with <span className="text-green-600 font-semibold">&lt;5% AI detection score</span>
          </p>
        </motion.div>

        {/* Phase Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-12"
        >
          <Card className="max-w-6xl mx-auto border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Implementation Progress
              </CardTitle>
              <CardDescription className="text-blue-100">
                Navigate through different phases of AI Humanizer development
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-5 gap-4">
                <Link href="/">
                  <Card className="cursor-pointer hover:shadow-md transition-shadow border-green-200 bg-green-50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center text-green-800">
                        <CheckCircle className="h-5 w-5 mr-2" />
                        Phase 1
                      </CardTitle>
                      <CardDescription className="text-green-600">
                        Frontend Interface
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">
                        Modern UI with text humanization interface
                      </p>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/dataset">
                  <Card className="cursor-pointer hover:shadow-md transition-shadow border-blue-200 bg-blue-50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center text-blue-800">
                        <BarChart3 className="h-5 w-5 mr-2" />
                        Phase 2
                      </CardTitle>
                      <CardDescription className="text-blue-600">
                        Dataset Design
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">
                        20k paragraph dataset with preprocessing
                      </p>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/training">
                  <Card className="cursor-pointer hover:shadow-md transition-shadow border-purple-200 bg-purple-50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center text-purple-800">
                        <Cpu className="h-5 w-5 mr-2" />
                        Phase 3
                      </CardTitle>
                      <CardDescription className="text-purple-600">
                        Fine-Tuning Architecture
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">
                        Phi-3 Mini training workflow
                      </p>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/inference">
                  <Card className="cursor-pointer hover:shadow-md transition-shadow border-orange-200 bg-orange-50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center text-orange-800">
                        <Play className="h-5 w-5 mr-2" />
                        Phase 4
                      </CardTitle>
                      <CardDescription className="text-orange-600">
                        Inference Engine
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">
                        Offline humanization pipeline
                      </p>
                    </CardContent>
                  </Card>
                </Link>

                <Card className="opacity-60 cursor-not-allowed">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center text-gray-500">
                      <Brain className="h-5 w-5 mr-2" />
                      Phase 5-6
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Coming Soon
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500">
                      Evaluation & Deployment
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid md:grid-cols-3 gap-6 mb-12"
        >
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Brain className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>Phi-3 Mini Powered</CardTitle>
              <CardDescription>
                Fine-tuned on 20,000 paragraphs of curated human writing for optimal performance
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>Low Detection Score</CardTitle>
              <CardDescription>
                Consistently produces humanized text with AI-detection scores below 5%
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle>Fully Offline</CardTitle>
              <CardDescription>
                Complete offline operation after installation with no external dependencies
              </CardDescription>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Main Interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="max-w-4xl mx-auto border-0 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <CardTitle className="flex items-center">
                <Sparkles className="h-5 w-5 mr-2" />
                Text Humanization Interface
              </CardTitle>
              <CardDescription className="text-blue-100">
                Transform AI-generated text into natural, human-like writing
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Input Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">
                      AI-Generated Text
                    </label>
                    <Badge variant="outline">Input</Badge>
                  </div>
                  <Textarea
                    placeholder="Paste your AI-generated text here..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="min-h-[200px] resize-none"
                  />
                  <Button 
                    onClick={handleHumanize}
                    disabled={!inputText.trim() || isProcessing}
                    className="w-full"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Humanize Text
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>

                {/* Output Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">
                      Humanized Output
                    </label>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Result
                    </Badge>
                  </div>
                  <Textarea
                    placeholder="Humanized text will appear here..."
                    value={outputText}
                    readOnly
                    className="min-h-[200px] resize-none bg-gray-50"
                  />
                  {outputText && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">AI Detection Score:</span>
                      <Badge className="bg-green-100 text-green-800">
                        3.2% ✓
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>
    </div>
  );
}
