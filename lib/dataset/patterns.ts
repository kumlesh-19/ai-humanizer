import { HumanizationPattern } from './types';

export class HumanizationPatternEngine {
  private static readonly DEFAULT_PATTERNS: Omit<HumanizationPattern, 'id' | 'created_at' | 'updated_at'>[] = [
    {
      name: 'Synonym Variation',
      description: 'Replace common words with appropriate synonyms to reduce repetition',
      pattern_type: 'lexical',
      transformation_rule: {
        type: 'synonym_replacement',
        target_words: ['good', 'bad', 'big', 'small', 'important', 'very'],
        replacements: {
          good: ['excellent', 'outstanding', 'superb', 'remarkable', 'exceptional'],
          bad: ['poor', 'inadequate', 'substandard', 'deficient', 'unsatisfactory'],
          big: ['large', 'substantial', 'significant', 'considerable', 'extensive'],
          small: ['tiny', 'minor', 'modest', 'limited', 'compact'],
          important: ['crucial', 'vital', 'essential', 'significant', 'critical'],
          very: ['extremely', 'highly', 'particularly', 'especially', 'remarkably']
        },
        probability: 0.7
      },
      confidence_weight: 0.8,
      applicable_categories: ['formal', 'academic', 'technical', 'general']
    },
    {
      name: 'Sentence Structure Variation',
      description: 'Vary sentence structures to create more natural flow',
      pattern_type: 'syntactic',
      transformation_rule: {
        type: 'sentence_restructuring',
        operations: [
          'invert_subject_verb',
          'add_transitional_phrases',
          'vary_sentence_length',
          'use_participial_phrases'
        ],
        probability: 0.6
      },
      confidence_weight: 0.9,
      applicable_categories: ['formal', 'academic', 'technical']
    },
    {
      name: 'Conversational Insertions',
      description: 'Add natural conversational elements and filler words',
      pattern_type: 'stylistic',
      transformation_rule: {
        type: 'conversational_enhancement',
        insertions: [
          'you know',
          'I mean',
          'to be honest',
          'frankly',
          'actually',
          'basically'
        ],
        max_frequency: 0.1, // Max 10% of sentences
        probability: 0.4
      },
      confidence_weight: 0.7,
      applicable_categories: ['casual', 'conversational']
    },
    {
      name: 'Contractions Usage',
      description: 'Introduce appropriate contractions for natural writing',
      pattern_type: 'lexical',
      transformation_rule: {
        type: 'contraction_expansion',
        contractions: {
          'do not': "don't",
          'will not': "won't",
          'cannot': "can't",
          'it is': "it's",
          'that is': "that's",
          'I am': "I'm",
          'you are': "you're",
          'we are': "we're"
        },
        probability: 0.8
      },
      confidence_weight: 0.6,
      applicable_categories: ['casual', 'conversational', 'general']
    },
    {
      name: 'Semantic Variation',
      description: 'Rephrase concepts using different semantic approaches',
      pattern_type: 'semantic',
      transformation_rule: {
        type: 'semantic_rephrasing',
        strategies: [
          'change_voice', // active to passive and vice versa
          'reorder_clauses',
          'substitute_concepts',
          'modify_perspective'
        ],
        probability: 0.5
      },
      confidence_weight: 0.9,
      applicable_categories: ['academic', 'formal', 'technical']
    },
    {
      name: 'Punctuation Variation',
      description: 'Vary punctuation usage for more natural rhythm',
      pattern_type: 'syntactic',
      transformation_rule: {
        type: 'punctuation_modification',
        operations: [
          'replace_periods_with_semicolons',
          'add_em_dashes',
          'use_parenthetical_asides',
          'vary_comma_usage'
        ],
        probability: 0.3
      },
      confidence_weight: 0.5,
      applicable_categories: ['formal', 'academic', 'creative']
    }
  ];

  static getDefaultPatterns(): Omit<HumanizationPattern, 'id' | 'created_at' | 'updated_at'>[] {
    return this.DEFAULT_PATTERNS;
  }

  static generateTransformationPlan(
    inputText: string,
    targetCategory: string,
    targetComplexity: number,
    availablePatterns: HumanizationPattern[]
  ): {
    selectedPatterns: HumanizationPattern[];
    confidence: number;
    expectedAiScore: number;
  } {
    // Filter patterns applicable to target category
    const applicablePatterns = availablePatterns.filter(pattern => 
      pattern.applicable_categories.includes(targetCategory)
    );

    // Select patterns based on complexity and confidence weights
    const selectedPatterns = this.selectPatternsByComplexity(
      applicablePatterns,
      targetComplexity
    );

    // Calculate overall confidence
    const confidence = this.calculateOverallConfidence(selectedPatterns);

    // Estimate AI detection score improvement
    const expectedAiScore = this.estimateAiScoreImprovement(
      inputText,
      selectedPatterns,
      confidence
    );

    return {
      selectedPatterns,
      confidence,
      expectedAiScore
    };
  }

  private static selectPatternsByComplexity(
    patterns: HumanizationPattern[],
    targetComplexity: number
  ): HumanizationPattern[] {
    // Sort by confidence weight
    const sortedPatterns = patterns.sort((a, b) => b.confidence_weight - a.confidence_weight);
    
    // Select patterns based on complexity requirements
    const selectedPatterns: HumanizationPattern[] = [];
    let totalComplexityImpact = 0;

    for (const pattern of sortedPatterns) {
      if (totalComplexityImpact >= targetComplexity * 0.8) break;
      
      selectedPatterns.push(pattern);
      totalComplexityImpact += this.getPatternComplexityImpact(pattern);
    }

    return selectedPatterns;
  }

  private static getPatternComplexityImpact(pattern: HumanizationPattern): number {
    const impactMap = {
      lexical: 1,
      syntactic: 2,
      semantic: 3,
      stylistic: 1.5
    };
    
    return impactMap[pattern.pattern_type] * pattern.confidence_weight;
  }

  private static calculateOverallConfidence(patterns: HumanizationPattern[]): number {
    if (patterns.length === 0) return 0;
    
    const totalWeight = patterns.reduce((sum, pattern) => sum + pattern.confidence_weight, 0);
    return totalWeight / patterns.length;
  }

  private static estimateAiScoreImprovement(
    inputText: string,
    patterns: HumanizationPattern[],
    confidence: number
  ): number {
    // Base AI score estimation (simplified)
    const baseAiScore = this.estimateBaseAiScore(inputText);
    
    // Calculate improvement based on patterns and confidence
    const patternImpact = patterns.reduce((impact, pattern) => {
      const patternEffectiveness = this.getPatternEffectiveness(pattern);
      return impact + patternEffectiveness;
    }, 0);

    const improvement = (patternImpact * confidence) / patterns.length;
    const finalScore = Math.max(0, baseAiScore - improvement);

    return Math.round(finalScore * 100) / 100;
  }

  private static estimateBaseAiScore(text: string): number {
    // Simplified AI detection estimation
    let aiScore = 0.5; // Base score
    
    // Factors that increase AI detection
    if (text.includes('furthermore') || text.includes('moreover')) aiScore += 0.1;
    if (text.includes('consequently') || text.includes('therefore')) aiScore += 0.1;
    if (text.match(/\bvery \w+\b/g)) aiScore += 0.05; // Very + adjective pattern
    if (text.split('.').length > 5 && text.split('.').every(s => s.trim().length > 20)) aiScore += 0.1; // Uniform long sentences
    
    // Factors that decrease AI detection
    if (text.match(/\bdon't\b|\bcan't\b|\bwon't\b/)) aiScore -= 0.1; // Contractions
    if (text.match(/\byou know\b|\bI mean\b/)) aiScore -= 0.05; // Conversational elements
    if (text.split('.').some(s => s.trim().length < 10)) aiScore -= 0.05; // Short sentences
    
    return Math.max(0, Math.min(1, aiScore));
  }

  private static getPatternEffectiveness(pattern: HumanizationPattern): number {
    const effectivenessMap = {
      lexical: 0.15,
      syntactic: 0.25,
      semantic: 0.30,
      stylistic: 0.20
    };
    
    return effectivenessMap[pattern.pattern_type] * pattern.confidence_weight;
  }
}
