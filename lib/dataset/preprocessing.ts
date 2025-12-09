import { TextAnalysisResult, Paragraph } from './types';

export class TextPreprocessor {
  private static readonly COMPLEXITY_INDICATORS = {
    simple: ['the', 'and', 'is', 'are', 'was', 'were', 'a', 'an'],
    moderate: ['however', 'therefore', 'although', 'because', 'since'],
    complex: ['consequently', 'nevertheless', 'furthermore', 'subsequently', 'notwithstanding']
  };

  private static readonly STYLE_PATTERNS = {
    formal: ['furthermore', 'consequently', 'nevertheless', 'moreover'],
    casual: ['yeah', 'gonna', 'wanna', 'kinda', 'sorta'],
    academic: ['hypothesis', 'methodology', 'subsequently', 'empirical'],
    conversational: ['you know', 'I mean', 'like', 'basically'],
    technical: ['algorithm', 'implementation', 'optimization', 'architecture']
  };

  static analyzeText(text: string): TextAnalysisResult {
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    const wordCount = words.length;
    const sentenceCount = sentences.length;
    const avgSentenceLength = sentenceCount > 0 ? wordCount / sentenceCount : 0;
    
    const complexityScore = this.calculateComplexity(text, words, avgSentenceLength);
    const detectedPatterns = this.extractPatterns(text);
    const qualityScore = this.calculateQualityScore(text, complexityScore);
    const suggestedCategory = this.suggestCategory(text, detectedPatterns);
    const suggestedStyleTags = this.suggestStyleTags(detectedPatterns);

    return {
      word_count: wordCount,
      sentence_count: sentenceCount,
      avg_sentence_length: Math.round(avgSentenceLength * 100) / 100,
      complexity_score: complexityScore,
      detected_patterns: detectedPatterns,
      quality_score: qualityScore,
      suggested_category: suggestedCategory,
      suggested_style_tags: suggestedStyleTags
    };
  }

  private static calculateComplexity(text: string, words: string[], avgSentenceLength: number): number {
    let complexityScore = 1;
    
    // Word complexity
    const complexWords = words.filter(word => word.length > 6).length;
    const wordComplexity = complexWords / words.length;
    complexityScore += wordComplexity * 3;
    
    // Sentence length complexity
    if (avgSentenceLength > 20) complexityScore += 2;
    else if (avgSentenceLength > 15) complexityScore += 1;
    
    // Vocabulary complexity
    const textLower = text.toLowerCase();
    let complexIndicatorCount = 0;
    Object.values(this.COMPLEXITY_INDICATORS.complex).forEach(indicator => {
      if (textLower.includes(indicator)) complexIndicatorCount++;
    });
    complexityScore += complexIndicatorCount;
    
    return Math.min(10, Math.round(complexityScore));
  }

  private static extractPatterns(text: string): string[] {
    const patterns: string[] = [];
    const textLower = text.toLowerCase();
    
    // Extract style patterns
    Object.entries(this.STYLE_PATTERNS).forEach(([style, indicators]) => {
      const matches = indicators.filter(indicator => textLower.includes(indicator));
      if (matches.length > 0) {
        patterns.push(`${style}_style_${matches.length}`);
      }
    });
    
    // Extract structural patterns
    if (text.includes(',')) patterns.push('comma_usage');
    if (text.includes(';')) patterns.push('semicolon_usage');
    if (text.includes(':')) patterns.push('colon_usage');
    if (text.match(/\([^)]+\)/)) patterns.push('parenthetical_usage');
    
    // Extract rhetorical patterns
    if (text.match(/\bhowever\b|\bbut\b|\balthough\b/i)) patterns.push('contrast_structure');
    if (text.match(/\bbecause\b|\bsince\b|\btherefore\b/i)) patterns.push('causal_structure');
    if (text.match(/\bfor example\b|\bsuch as\b|\blike\b/i)) patterns.push('exemplification');
    
    return patterns;
  }

  private static calculateQualityScore(text: string, complexityScore: number): number {
    let qualityScore = 0.5; // Base score
    
    // Length appropriateness
    const wordCount = text.trim().split(/\s+/).length;
    if (wordCount >= 50 && wordCount <= 300) qualityScore += 0.2;
    
    // Sentence variety
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const sentenceLengths = sentences.map(s => s.trim().split(/\s+/).length);
    const avgLength = sentenceLengths.reduce((a, b) => a + b, 0) / sentenceLengths.length;
    const variance = sentenceLengths.reduce((acc, len) => acc + Math.pow(len - avgLength, 2), 0) / sentenceLengths.length;
    if (variance > 4) qualityScore += 0.1; // Good sentence variety
    
    // Complexity balance
    if (complexityScore >= 3 && complexityScore <= 7) qualityScore += 0.2;
    
    // Grammar and structure indicators
    if (text.match(/^[A-Z]/)) qualityScore += 0.05; // Starts with capital
    if (text.match(/[.!?]$/)) qualityScore += 0.05; // Ends with punctuation
    
    return Math.min(1, Math.round(qualityScore * 100) / 100);
  }

  private static suggestCategory(text: string, patterns: string[]): string {
    const textLower = text.toLowerCase();
    
    if (patterns.some(p => p.includes('academic'))) return 'academic';
    if (patterns.some(p => p.includes('technical'))) return 'technical';
    if (patterns.some(p => p.includes('formal'))) return 'formal';
    if (patterns.some(p => p.includes('casual'))) return 'casual';
    if (patterns.some(p => p.includes('conversational'))) return 'conversational';
    
    // Default categorization based on content
    if (textLower.includes('research') || textLower.includes('study') || textLower.includes('analysis')) return 'academic';
    if (textLower.includes('system') || textLower.includes('code') || textLower.includes('algorithm')) return 'technical';
    if (textLower.includes('business') || textLower.includes('professional') || textLower.includes('corporate')) return 'formal';
    
    return 'general';
  }

  private static suggestStyleTags(patterns: string[]): string[] {
    const tags: string[] = [];
    
    patterns.forEach(pattern => {
      if (pattern.includes('formal')) tags.push('formal');
      if (pattern.includes('casual')) tags.push('casual');
      if (pattern.includes('academic')) tags.push('academic');
      if (pattern.includes('conversational')) tags.push('conversational');
      if (pattern.includes('technical')) tags.push('technical');
      if (pattern.includes('contrast_structure')) tags.push('argumentative');
      if (pattern.includes('causal_structure')) tags.push('analytical');
      if (pattern.includes('exemplification')) tags.push('explanatory');
    });
    
    // Add default tags if none detected
    if (tags.length === 0) {
      tags.push('neutral');
    }
    
    return [...new Set(tags)]; // Remove duplicates
  }

  static validateParagraph(paragraph: Partial<Paragraph>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!paragraph.original_text || paragraph.original_text.trim().length === 0) {
      errors.push('Original text is required');
    }
    
    if (paragraph.original_text && paragraph.original_text.length < 20) {
      errors.push('Text must be at least 20 characters long');
    }
    
    if (paragraph.original_text && paragraph.original_text.length > 2000) {
      errors.push('Text must not exceed 2000 characters');
    }
    
    if (!paragraph.category) {
      errors.push('Category is required');
    }
    
    if (paragraph.complexity_score && (paragraph.complexity_score < 1 || paragraph.complexity_score > 10)) {
      errors.push('Complexity score must be between 1 and 10');
    }
    
    if (paragraph.quality_score && (paragraph.quality_score < 0 || paragraph.quality_score > 1)) {
      errors.push('Quality score must be between 0 and 1');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
