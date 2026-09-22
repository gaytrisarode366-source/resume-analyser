export interface CandidateEducation {
  degree: string;
  college: string;
  graduation_year: string;
  score?: string;
}

export interface CandidateProject {
  title: string;
  description: string;
  technologies: string[];
  role_contribution?: string;
  highlights?: string[];
}

export interface CandidateExperience {
  role: string;
  company: string;
  duration: string;
  description: string;
  technologies?: string[];
}

export interface CandidateProfile {
  name: string;
  email?: string;
  phone?: string;
  education: CandidateEducation[];
  programming_languages: string[];
  technical_skills: string[];
  ai_ml_skills: string[];
  web_dev_skills: string[];
  databases: string[];
  cloud_technologies: string[];
  tools: string[];
  projects: CandidateProject[];
  experience: CandidateExperience[];
  internships: CandidateExperience[];
  certifications: string[];
  hackathons: string[];
  achievements: string[];
  other_experience: string[];
  interests: string[];
  skill_gaps: string[];
  target_roles: string[];
}

export interface AtsScoreBreakdown {
  skills_score: number; // out of 30
  experience_score: number; // out of 25
  education_score: number; // out of 15
  formatting_keywords: number; // out of 15
  projects_score: number; // out of 15
  total: number; // out of 100
  explanation: string;
}

export interface ProjectAnalysisItem {
  title: string;
  strengths: string[];
  impact_score: number;
  recommended_enhancement: string;
}

export interface ResumeAnalysisResult {
  candidate_summary: string;
  technical_skills: {
    programming_languages: string[];
    frameworks_libraries: string[];
    ai_ml: string[];
    web_dev: string[];
    databases: string[];
    cloud_devops: string[];
    tools: string[];
  };
  project_analysis: ProjectAnalysisItem[];
  resume_strengths: string[];
  missing_weak_areas: string[];
  ats_compatibility: AtsScoreBreakdown;
  suggested_improvements: string[];
  candidate_profile: CandidateProfile;
}

export interface SuggestedRole {
  role_name: string;
  compatibility_percentage: number;
  compatibility_reasoning: string;
  skill_match: {
    matching_skills: string[];
    relevant_projects: string[];
    relevant_education: string[];
  };
  skill_gaps: {
    missing_technical_skills: string[];
    missing_tools: string[];
    missing_concepts: string[];
  };
  preparation: {
    topics_to_learn: string[];
    technologies_to_practice: string[];
    project_recommendations: string[];
    interview_topics: string[];
  };
}

export type InterviewDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';
export type InterviewType = 'Technical' | 'HR' | 'Mixed';

export interface InterviewFeedback {
  score: number; // 0-10 or 0-100
  strengths: string[];
  weaknesses: string[];
  concise_feedback: string;
  ideal_answer?: string;
  model_answer_tip?: string;
  follow_up_question?: string;
}

export interface InterviewExchange {
  id: string;
  stage: 1 | 2 | 3 | 4 | 5;
  stage_name: string;
  question: string;
  question_context?: string;
  candidate_answer?: string;
  feedback?: InterviewFeedback;
}

export interface InterviewReport {
  technical_knowledge: number; // /100
  communication: number; // /100
  problem_solving: number; // /100
  project_understanding: number; // /100
  behavioral_skills: number; // /100
  overall_performance: number; // /100
  readiness_score?: number; // /100
  strong_areas: string[];
  weak_areas: string[];
  struggled_questions: {
    question: string;
    issue: string;
    recommended_fix: string;
  }[];
  topics_to_revise: string[];
  personalized_prep_plan: string[];
}

export interface RoadmapTask {
  id: string;
  title: string;
  task?: string;
  category: string;
  completed: boolean;
  priority?: 'High' | 'Medium' | 'Essential';
}

export interface RoadmapMilestone {
  period_id: '30_DAYS' | '60_DAYS' | '90_DAYS';
  period_label: string;
  title: string;
  focus_area: string;
  goals: string[];
  milestones: string[];
  actionable_tasks: RoadmapTask[];
  key_deliverables: string[];
}

export interface JobApplicationTracker {
  id: string;
  company: string;
  role: string;
  location: string;
  status: 'Draft' | 'Applied' | 'Screening' | 'Interview' | 'Offer' | 'Rejected' | 'Archived';
  appliedDate: string;
  matchScore: number;
  notes: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning';
  timestamp: string;
  read: boolean;
}

export type NavigationTab = 
  | 'dashboard'
  | 'resume-analyzer'
  | 'role-suggestion'
  | 'interview-coach'
  | 'career-roadmap'
  | 'profile'
  | 'applications';
