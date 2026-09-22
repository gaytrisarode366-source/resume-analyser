import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  CandidateProfile,
  ResumeAnalysisResult,
  SuggestedRole,
  InterviewExchange,
  InterviewReport,
  RoadmapMilestone,
  JobApplicationTracker,
  AppNotification,
  NavigationTab,
  InterviewDifficulty,
  InterviewType,
} from '../types';

interface PlacementContextType {
  // Navigation & Workflow
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  
  // Resume & Profile
  resumeRawText: string;
  setResumeRawText: (text: string) => void;
  resumeFileName: string;
  setResumeFileName: (name: string) => void;
  isAnalyzingResume: boolean;
  resumeAnalysis: ResumeAnalysisResult | null;
  candidateProfile: CandidateProfile | null;
  analyzeResume: (text: string, fileName?: string) => Promise<boolean>;
  updateCandidateProfile: (profile: CandidateProfile) => void;

  // Role Suggestion
  suggestedRoles: SuggestedRole[];
  isLoadingRoles: boolean;
  fetchRoleSuggestions: (profile?: CandidateProfile) => Promise<void>;
  selectedRole: string | null;
  setSelectedRole: (role: string) => void;
  getSelectedRoleDetails: () => SuggestedRole | undefined;

  // Interview Coach
  interviewDifficulty: InterviewDifficulty;
  setInterviewDifficulty: (d: InterviewDifficulty) => void;
  interviewType: InterviewType;
  setInterviewType: (t: InterviewType) => void;
  interviewStage: 1 | 2 | 3 | 4 | 5;
  setInterviewStage: (s: 1 | 2 | 3 | 4 | 5) => void;
  interviewHistory: InterviewExchange[];
  currentQuestion: string;
  currentQuestionContext: string;
  isGeneratingQuestion: boolean;
  isEvaluatingAnswer: boolean;
  interviewReport: InterviewReport | null;
  startInterviewSession: (targetRole?: string) => Promise<void>;
  submitCandidateAnswer: (answer: string) => Promise<void>;
  finishInterviewAndGenerateReport: () => Promise<void>;
  resetInterviewSession: () => void;

  // Career Roadmap
  careerRoadmap: RoadmapMilestone[] | null;
  isLoadingRoadmap: boolean;
  generateCareerRoadmap: () => Promise<void>;
  toggleRoadmapTask: (periodId: string, taskId: string) => void;

  // Job Applications
  applications: JobApplicationTracker[];
  addApplication: (app: Omit<JobApplicationTracker, 'id' | 'appliedDate'>) => void;
  updateApplicationStatus: (id: string, status: JobApplicationTracker['status']) => void;
  deleteApplication: (id: string) => void;

  // Notifications
  notifications: AppNotification[];
  markNotificationAsRead: (id: string) => void;
  addNotification: (title: string, message: string, type?: AppNotification['type']) => void;
  clearNotifications: () => void;

  // Reset entire state
  resetAllData: () => void;
}

const PlacementContext = createContext<PlacementContextType | undefined>(undefined);

const STORAGE_KEY = 'ai_placement_agent_state_v1';

export const PlacementProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [resumeRawText, setResumeRawText] = useState<string>('');
  const [resumeFileName, setResumeFileName] = useState<string>('');
  const [isAnalyzingResume, setIsAnalyzingResume] = useState<boolean>(false);
  const [resumeAnalysis, setResumeAnalysis] = useState<ResumeAnalysisResult | null>(null);
  const [candidateProfile, setCandidateProfile] = useState<CandidateProfile | null>(null);

  const [suggestedRoles, setSuggestedRoles] = useState<SuggestedRole[]>([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState<boolean>(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const [interviewDifficulty, setInterviewDifficulty] = useState<InterviewDifficulty>('Intermediate');
  const [interviewType, setInterviewType] = useState<InterviewType>('Mixed');
  const [interviewStage, setInterviewStage] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [interviewHistory, setInterviewHistory] = useState<InterviewExchange[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<string>('');
  const [currentQuestionContext, setCurrentQuestionContext] = useState<string>('');
  const [isGeneratingQuestion, setIsGeneratingQuestion] = useState<boolean>(false);
  const [isEvaluatingAnswer, setIsEvaluatingAnswer] = useState<boolean>(false);
  const [interviewReport, setInterviewReport] = useState<InterviewReport | null>(null);

  const [careerRoadmap, setCareerRoadmap] = useState<RoadmapMilestone[] | null>(null);
  const [isLoadingRoadmap, setIsLoadingRoadmap] = useState<boolean>(false);

  const [applications, setApplications] = useState<JobApplicationTracker[]>([
    {
      id: 'app-1',
      company: 'TechCorp Cloud Systems',
      role: 'Associate Software Engineer',
      location: 'Bangalore / Hybrid',
      status: 'Interview',
      appliedDate: '2025-02-14',
      matchScore: 88,
      notes: 'Passed initial coding assessment. Technical round scheduled for Thursday.',
    },
    {
      id: 'app-2',
      company: 'Nexus AI Labs',
      role: 'Full Stack Developer',
      location: 'Hyderabad / Remote',
      status: 'Screening',
      appliedDate: '2025-02-18',
      matchScore: 92,
      notes: 'Resume shortlisted by campus placement committee.',
    },
    {
      id: 'app-3',
      company: 'DataScale Fintech',
      role: 'Backend Engineer Intern',
      location: 'Pune / On-site',
      status: 'Applied',
      appliedDate: '2025-02-21',
      matchScore: 84,
      notes: 'Referred by university alumni.',
    },
  ]);

  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-1',
      title: 'Welcome to AI Placement Agent',
      message: 'Upload your resume or pick a demo profile to start your personalized placement prep!',
      type: 'info',
      timestamp: 'Just now',
      read: false,
    },
  ]);

  // Load initial cached data from localStorage if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.resumeRawText) setResumeRawText(parsed.resumeRawText);
        if (parsed.resumeFileName) setResumeFileName(parsed.resumeFileName);
        if (parsed.resumeAnalysis) setResumeAnalysis(parsed.resumeAnalysis);
        if (parsed.candidateProfile) setCandidateProfile(parsed.candidateProfile);
        if (parsed.suggestedRoles) setSuggestedRoles(parsed.suggestedRoles);
        if (parsed.selectedRole) setSelectedRole(parsed.selectedRole);
        if (parsed.interviewHistory) setInterviewHistory(parsed.interviewHistory);
        if (parsed.interviewReport) setInterviewReport(parsed.interviewReport);
        if (parsed.careerRoadmap) setCareerRoadmap(parsed.careerRoadmap);
        if (parsed.applications) setApplications(parsed.applications);
      }
    } catch (e) {
      console.error('Failed to restore from storage:', e);
    }
  }, []);

  // Persist important data changes
  useEffect(() => {
    try {
      const payload = {
        resumeRawText,
        resumeFileName,
        resumeAnalysis,
        candidateProfile,
        suggestedRoles,
        selectedRole,
        interviewHistory,
        interviewReport,
        careerRoadmap,
        applications,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.error('Storage sync error:', e);
    }
  }, [
    resumeRawText,
    resumeFileName,
    resumeAnalysis,
    candidateProfile,
    suggestedRoles,
    selectedRole,
    interviewHistory,
    interviewReport,
    careerRoadmap,
    applications,
  ]);

  const addNotification = (title: string, message: string, type: AppNotification['type'] = 'info') => {
    const newNotif: AppNotification = {
      id: 'notif-' + Date.now(),
      title,
      message,
      type,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
    };
    setNotifications(prev => [newNotif, ...prev.slice(0, 19)]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  // 1. Analyze Resume
  const analyzeResume = async (text: string, fileName?: string): Promise<boolean> => {
    if (!text || text.trim().length < 20) {
      addNotification('Resume Text Too Short', 'Please provide a valid resume with adequate details.', 'warning');
      return false;
    }

    setIsAnalyzingResume(true);
    setResumeRawText(text);
    if (fileName) setResumeFileName(fileName);

    try {
      const res = await fetch('/api/resume/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText: text }),
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const data: ResumeAnalysisResult = await res.json();
      setResumeAnalysis(data);
      setCandidateProfile(data.candidate_profile);

      addNotification(
        'Resume Analyzed Successfully!',
        `ATS Compatibility Score: ${data.ats_compatibility?.total || 80}/100. Structured candidate profile created.`,
        'success'
      );

      // Auto-trigger Role Suggestion using the shared candidate profile
      fetchRoleSuggestions(data.candidate_profile);
      return true;
    } catch (err: any) {
      console.error('Error analyzing resume:', err);
      addNotification('Analysis Error', 'Failed to analyze resume. Please try again.', 'warning');
      return false;
    } finally {
      setIsAnalyzingResume(false);
    }
  };

  const updateCandidateProfile = (updated: CandidateProfile) => {
    setCandidateProfile(updated);
    addNotification('Profile Updated', 'Your structured profile skills and fields have been refreshed.', 'info');
  };

  // 2. Fetch Role Suggestions
  const fetchRoleSuggestions = async (profileToUse?: CandidateProfile) => {
    const targetProfile = profileToUse || candidateProfile;
    if (!targetProfile) return;

    setIsLoadingRoles(true);
    try {
      const res = await fetch('/api/roles/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidateProfile: targetProfile }),
      });

      if (!res.ok) throw new Error('Role suggestion failed');
      const roles: SuggestedRole[] = await res.json();
      setSuggestedRoles(roles);

      if (roles.length > 0 && !selectedRole) {
        setSelectedRole(roles[0].role_name);
      }
      addNotification(
        'Career Roles Identified',
        `Generated ${roles.length} matching career roles aligned with your technical profile.`,
        'success'
      );
    } catch (err: any) {
      console.error('Role suggestions error:', err);
      addNotification('Role Suggestions Warning', 'Could not load updated roles, using baseline suggestions.', 'warning');
    } finally {
      setIsLoadingRoles(false);
    }
  };

  const getSelectedRoleDetails = (): SuggestedRole | undefined => {
    if (!selectedRole || suggestedRoles.length === 0) return undefined;
    return suggestedRoles.find(r => r.role_name.toLowerCase() === selectedRole.toLowerCase()) || suggestedRoles[0];
  };

  // 3. Interview Coach
  const getStageName = (s: number): string => {
    switch (s) {
      case 1:
        return 'Introduction';
      case 2:
        return 'Resume Questions';
      case 3:
        return 'Technical Questions';
      case 4:
        return 'Project Deep Dive';
      case 5:
        return 'Behavioral Questions';
      default:
        return 'Technical Assessment';
    }
  };

  const startInterviewSession = async (roleOverride?: string) => {
    const role = roleOverride || selectedRole || 'Software Developer';
    setSelectedRole(role);
    setInterviewStage(1);
    setInterviewHistory([]);
    setInterviewReport(null);

    setIsGeneratingQuestion(true);
    try {
      const res = await fetch('/api/interview/generate-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateProfile,
          targetRole: role,
          stage: 1,
          stageName: getStageName(1),
          difficulty: interviewDifficulty,
          interviewType,
          history: [],
        }),
      });

      const data = await res.json();
      setCurrentQuestion(data.question);
      setCurrentQuestionContext(data.question_context || 'Evaluating technical introduction.');
      addNotification(
        'Mock Interview Started',
        `Round 1: Stage 1 (Introduction) for ${role} [${interviewDifficulty}].`,
        'info'
      );
    } catch (err) {
      console.error('Error starting interview:', err);
      setCurrentQuestion(`Welcome to your placement interview for ${role}. Please introduce yourself and your technical background.`);
    } finally {
      setIsGeneratingQuestion(false);
    }
  };

  const submitCandidateAnswer = async (answer: string) => {
    if (!answer.trim() || !currentQuestion) return;

    setIsEvaluatingAnswer(true);
    try {
      // 1. Evaluate current answer
      const evalRes = await fetch('/api/interview/evaluate-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateProfile,
          targetRole: selectedRole || 'Software Developer',
          stage: interviewStage,
          stageName: getStageName(interviewStage),
          question: currentQuestion,
          candidateAnswer: answer,
          difficulty: interviewDifficulty,
        }),
      });

      const evalData = await evalRes.json();

      const exchange: InterviewExchange = {
        id: 'exchange-' + Date.now(),
        stage: interviewStage,
        stage_name: getStageName(interviewStage),
        question: currentQuestion,
        question_context: currentQuestionContext,
        candidate_answer: answer,
        feedback: evalData,
      };

      const updatedHistory = [...interviewHistory, exchange];
      setInterviewHistory(updatedHistory);

      // 2. Determine next stage or next question
      if (interviewStage < 5) {
        const nextStage = (interviewStage + 1) as 1 | 2 | 3 | 4 | 5;
        setInterviewStage(nextStage);

        // Fetch question for the next stage
        setIsGeneratingQuestion(true);
        const nextQRes = await fetch('/api/interview/generate-question', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            candidateProfile,
            targetRole: selectedRole || 'Software Developer',
            stage: nextStage,
            stageName: getStageName(nextStage),
            difficulty: interviewDifficulty,
            interviewType,
            history: updatedHistory,
          }),
        });

        const nextQData = await nextQRes.json();
        setCurrentQuestion(nextQData.question);
        setCurrentQuestionContext(nextQData.question_context || '');
      } else {
        // Completed all 5 stages! Auto generate final report
        setCurrentQuestion('');
        setCurrentQuestionContext('');
        await finishInterviewAndGenerateReport(updatedHistory);
      }
    } catch (err) {
      console.error('Error submitting answer:', err);
      addNotification('Evaluation Error', 'Failed to score answer. Please try again.', 'warning');
    } finally {
      setIsEvaluatingAnswer(false);
      setIsGeneratingQuestion(false);
    }
  };

  const finishInterviewAndGenerateReport = async (historyOverride?: InterviewExchange[]) => {
    const history = historyOverride || interviewHistory;
    if (history.length === 0) return;

    try {
      const res = await fetch('/api/interview/final-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateProfile,
          targetRole: selectedRole || 'Software Developer',
          history,
        }),
      });

      const report: InterviewReport = await res.json();
      setInterviewReport(report);

      // Update Candidate Profile with identified skill gaps!
      if (candidateProfile && report.topics_to_revise && report.topics_to_revise.length > 0) {
        const existingGaps = new Set(candidateProfile.skill_gaps || []);
        report.topics_to_revise.forEach(gap => existingGaps.add(gap));
        const updatedProfile = {
          ...candidateProfile,
          skill_gaps: Array.from(existingGaps),
        };
        setCandidateProfile(updatedProfile);
      }

      addNotification(
        'Interview Report Ready!',
        `Overall Score: ${report.overall_performance}/100. Discovered skill gaps merged into candidate profile.`,
        'success'
      );

      // Auto-generate Career Roadmap based on combined profile + interview feedback
      generateCareerRoadmap();
    } catch (err) {
      console.error('Report error:', err);
    }
  };

  const resetInterviewSession = () => {
    setInterviewStage(1);
    setInterviewHistory([]);
    setCurrentQuestion('');
    setCurrentQuestionContext('');
    setInterviewReport(null);
  };

  // 4. Career Roadmap
  const generateCareerRoadmap = async () => {
    setIsLoadingRoadmap(true);
    try {
      const res = await fetch('/api/career/roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateProfile,
          targetRole: selectedRole || 'Software Developer',
          interviewReport,
        }),
      });

      const data: RoadmapMilestone[] = await res.json();
      setCareerRoadmap(data);
      addNotification('Roadmap Generated', 'Personalized 30/60/90-Day Placement Roadmap is ready.', 'success');
    } catch (err) {
      console.error('Roadmap error:', err);
    } finally {
      setIsLoadingRoadmap(false);
    }
  };

  const toggleRoadmapTask = (periodId: string, taskId: string) => {
    if (!careerRoadmap) return;
    const updated = careerRoadmap.map(milestone => {
      if (milestone.period_id === periodId) {
        return {
          ...milestone,
          actionable_tasks: milestone.actionable_tasks.map(t =>
            t.id === taskId ? { ...t, completed: !t.completed } : t
          ),
        };
      }
      return milestone;
    });
    setCareerRoadmap(updated);
  };

  // 5. Job Applications Tracker
  const addApplication = (item: Omit<JobApplicationTracker, 'id' | 'appliedDate'>) => {
    const newApp: JobApplicationTracker = {
      ...item,
      id: 'app-' + Date.now(),
      appliedDate: new Date().toISOString().split('T')[0],
    };
    setApplications(prev => [newApp, ...prev]);
    addNotification('Application Tracked', `Added ${newApp.company} (${newApp.role}) to your placement tracker.`, 'info');
  };

  const updateApplicationStatus = (id: string, status: JobApplicationTracker['status']) => {
    setApplications(prev => prev.map(a => (a.id === id ? { ...a, status } : a)));
    addNotification('Status Updated', `Application status changed to ${status}.`, 'info');
  };

  const deleteApplication = (id: string) => {
    setApplications(prev => prev.filter(a => a.id !== id));
  };

  // Reset entire state
  const resetAllData = () => {
    setResumeRawText('');
    setResumeFileName('');
    setResumeAnalysis(null);
    setCandidateProfile(null);
    setSuggestedRoles([]);
    setSelectedRole(null);
    setInterviewHistory([]);
    setInterviewReport(null);
    setCareerRoadmap(null);
    localStorage.removeItem(STORAGE_KEY);
    addNotification('Data Reset', 'All cached candidate profile and analysis data have been cleared.', 'info');
  };

  return (
    <PlacementContext.Provider
      value={{
        activeTab,
        setActiveTab,
        resumeRawText,
        setResumeRawText,
        resumeFileName,
        setResumeFileName,
        isAnalyzingResume,
        resumeAnalysis,
        candidateProfile,
        analyzeResume,
        updateCandidateProfile,
        suggestedRoles,
        isLoadingRoles,
        fetchRoleSuggestions,
        selectedRole,
        setSelectedRole,
        getSelectedRoleDetails,
        interviewDifficulty,
        setInterviewDifficulty,
        interviewType,
        setInterviewType,
        interviewStage,
        setInterviewStage,
        interviewHistory,
        currentQuestion,
        currentQuestionContext,
        isGeneratingQuestion,
        isEvaluatingAnswer,
        interviewReport,
        startInterviewSession,
        submitCandidateAnswer,
        finishInterviewAndGenerateReport,
        resetInterviewSession,
        careerRoadmap,
        isLoadingRoadmap,
        generateCareerRoadmap,
        toggleRoadmapTask,
        applications,
        addApplication,
        updateApplicationStatus,
        deleteApplication,
        notifications,
        markNotificationAsRead,
        addNotification,
        clearNotifications,
        resetAllData,
      }}
    >
      {children}
    </PlacementContext.Provider>
  );
};

export const usePlacement = (): PlacementContextType => {
  const context = useContext(PlacementContext);
  if (!context) {
    throw new Error('usePlacement must be used within a PlacementProvider');
  }
  return context;
};
