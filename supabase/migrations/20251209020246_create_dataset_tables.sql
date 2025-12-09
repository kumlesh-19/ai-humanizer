BEGIN;

-- Create datasets table to store dataset information
CREATE TABLE datasets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  total_paragraphs INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'processing', 'completed', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create paragraphs table to store individual human writing samples
CREATE TABLE paragraphs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  dataset_id UUID REFERENCES datasets(id) ON DELETE CASCADE,
  original_text TEXT NOT NULL,
  category TEXT NOT NULL,
  style_tags TEXT[], -- Array of style tags like 'formal', 'casual', 'academic', etc.
  complexity_score INTEGER DEFAULT 5 CHECK (complexity_score BETWEEN 1 AND 10),
  word_count INTEGER,
  sentence_count INTEGER,
  avg_sentence_length DECIMAL(5,2),
  humanization_patterns JSONB, -- Store detected humanization patterns
  quality_score DECIMAL(3,2) DEFAULT 0.95 CHECK (quality_score BETWEEN 0 AND 1),
  source_reference TEXT, -- Reference to original source if applicable
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create humanization_patterns table to define transformation rules
CREATE TABLE humanization_patterns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  pattern_type TEXT NOT NULL CHECK (pattern_type IN ('lexical', 'syntactic', 'semantic', 'stylistic')),
  transformation_rule JSONB NOT NULL,
  confidence_weight DECIMAL(3,2) DEFAULT 0.8 CHECK (confidence_weight BETWEEN 0 AND 1),
  applicable_categories TEXT[], -- Which text categories this pattern applies to
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create preprocessing_jobs table to track dataset processing
CREATE TABLE preprocessing_jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  dataset_id UUID REFERENCES datasets(id) ON DELETE CASCADE,
  job_type TEXT NOT NULL CHECK (job_type IN ('validation', 'analysis', 'pattern_extraction', 'quality_scoring')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
  progress INTEGER DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  error_message TEXT,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_paragraphs_dataset_id ON paragraphs(dataset_id);
CREATE INDEX idx_paragraphs_category ON paragraphs(category);
CREATE INDEX idx_paragraphs_complexity ON paragraphs(complexity_score);
CREATE INDEX idx_paragraphs_quality ON paragraphs(quality_score);
CREATE INDEX idx_humanization_patterns_type ON humanization_patterns(pattern_type);
CREATE INDEX idx_preprocessing_jobs_dataset ON preprocessing_jobs(dataset_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_datasets_updated_at BEFORE UPDATE ON datasets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_paragraphs_updated_at BEFORE UPDATE ON paragraphs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_humanization_patterns_updated_at BEFORE UPDATE ON humanization_patterns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMIT;