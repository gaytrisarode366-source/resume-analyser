import React from 'react';
import { usePlacement } from '../context/PlacementContext';
import { FileText, UserCheck, Compass, Mic, MapPin, ArrowRight, CheckCircle2 } from 'lucide-react';
import { NavigationTab } from '../types';

export const PipelineBanner: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    candidateProfile,
    resumeAnalysis,
    suggestedRoles,
    selectedRole,
    interviewHistory,
    interviewReport,
    careerRoadmap,
  } = usePlacement();

  const steps: {
    id: NavigationTab;
    title: string;
    subtitle: string;
    icon: React.ComponentType<{ className?: string }>;
    isCompleted: boolean;
    isActive: boolean;
  }[] = [
    {
      id: 'resume-analyzer',
      title: '1. Resume Analyzer',
      subtitle: resumeAnalysis ? `ATS Score: ${resumeAnalysis.ats_compatibility?.total || 80}%` : 'Upload PDF/DOCX',
      icon: FileText,
      isCompleted: Boolean(resumeAnalysis),
      isActive: activeTab === 'resume-analyzer',
    },
    {
      id: 'profile',
      title: '2. Candidate Profile',
      subtitle: candidateProfile ? `${candidateProfile.programming_languages.length} Languages, ${candidateProfile.projects.length} Projects` : 'Structured Data',
      icon: UserCheck,
      isCompleted: Boolean(candidateProfile),
      isActive: activeTab === 'profile',
    },
    {
      id: 'role-suggestion',
      title: '3. Role Suggestion',
      subtitle: selectedRole ? `Target: ${selectedRole}` : `${suggestedRoles.length} Matching Roles`,
      icon: Compass,
      isCompleted: Boolean(selectedRole || suggestedRoles.length > 0),
      isActive: activeTab === 'role-suggestion',
    },
    {
      id: 'interview-coach',
      title: '4. Interview Coach',
      subtitle: interviewReport
        ? `Score: ${interviewReport.overall_performance}/100`
        : interviewHistory.length > 0
        ? `${interviewHistory.length}/5 Rounds Done`
        : '5-Stage Simulator',
      icon: Mic,
      isCompleted: Boolean(interviewReport || interviewHistory.length >= 3),
      isActive: activeTab === 'interview-coach',
    },
    {
      id: 'career-roadmap',
      title: '5. Career Roadmap',
      subtitle: careerRoadmap ? '30/60/90-Day Plan' : 'Actionable Strategy',
      icon: MapPin,
      isCompleted: Boolean(careerRoadmap),
      isActive: activeTab === 'career-roadmap',
    },
  ];

  return (
    <div className="bg-white border-b border-slate-200/80 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between overflow-x-auto no-scrollbar py-1">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <React.Fragment key={step.id}>
                <button
                  id={`pipeline-step-${step.id}`}
                  onClick={() => setActiveTab(step.id)}
                  className={`flex items-center space-x-2.5 px-3 py-1.5 rounded-lg text-left transition-all shrink-0 ${
                    step.isActive
                      ? 'bg-indigo-50 border border-indigo-200 ring-1 ring-indigo-300/50'
                      : step.isCompleted
                      ? 'hover:bg-slate-50 border border-transparent'
                      : 'opacity-60 hover:opacity-100 hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-md flex items-center justify-center text-xs font-semibold ${
                      step.isCompleted
                        ? 'bg-emerald-100 text-emerald-700'
                        : step.isActive
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {step.isCompleted ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Icon className="w-3.5 h-3.5" />}
                  </div>
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className={`text-xs font-bold leading-tight ${step.isActive ? 'text-indigo-900' : 'text-slate-800'}`}>
                        {step.title}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate max-w-[130px] sm:max-w-[160px]">
                      {step.subtitle}
                    </p>
                  </div>
                </button>

                {idx < steps.length - 1 && (
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 mx-1 shrink-0 hidden sm:block" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};
