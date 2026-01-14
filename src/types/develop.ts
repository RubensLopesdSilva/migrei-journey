export interface UserResume {
  id: string;
  user_id: string;
  version_name: string;
  target_area: string | null;
  personal_info: Record<string, any>;
  professional_summary: string | null;
  experiences: Array<{
    company: string;
    role: string;
    period: string;
    description: string;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    year: string;
  }>;
  skills: string[];
  languages: Array<{
    language: string;
    level: string;
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
    year: string;
  }>;
  is_current: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProfessionalPitch {
  id: string;
  user_id: string;
  who_am_i: string | null;
  what_i_do: string | null;
  problem_i_solve: string | null;
  full_pitch: string | null;
  duration_seconds: number | null;
  practice_count: number;
  last_practiced_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface LinkedInChecklist {
  id: string;
  user_id: string;
  profile_photo: boolean;
  banner_image: boolean;
  headline_optimized: boolean;
  headline_text: string | null;
  about_section: boolean;
  about_text: string | null;
  experience_updated: boolean;
  skills_added: boolean;
  keywords: string[];
  recommendations_count: number;
  connections_count: number;
  overall_score: number;
  created_at: string;
  updated_at: string;
}

export interface PortfolioProject {
  id: string;
  user_id: string;
  project_title: string;
  project_type: 'real' | 'simulated';
  description: string | null;
  skills_used: string[];
  results: string | null;
  image_url: string | null;
  project_url: string | null;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface DevelopmentTrackItem {
  id: string;
  user_id: string;
  item_type: 'course' | 'project' | 'microchallenge';
  title: string;
  description: string | null;
  provider: string | null;
  url: string | null;
  estimated_hours: number | null;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed';
  started_at: string | null;
  completed_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface DevelopCoachFeedback {
  id: string;
  user_id: string;
  feedback_type: 'resume' | 'pitch' | 'linkedin' | 'portfolio' | 'general';
  strengths: string[];
  improvements: string[];
  action_items: string[];
  overall_readiness: number;
  generated_at: string;
  created_at: string;
}
