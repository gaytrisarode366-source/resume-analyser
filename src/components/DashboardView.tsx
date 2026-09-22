import React, { useState } from 'react';
import { usePlacement } from '../context/PlacementContext';
import { SAMPLE_RESUMES } from '../data/sampleResumes';
import { generatePlacementReportPDF } from '../utils/pdfGenerator';
import {
  Sparkles,
  FileText,
  Compass,
  Mic,
  MapPin,
  ArrowRight,
  TrendingUp,
  Award,
  CheckCircle2,
  AlertTriangle,
  Layers,
  BarChart3,
  Briefcase,
  Play,
  UploadCloud,
  ChevronRight,
  UserCheck,
  Download,
  FileDown
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    setActiveTab,
    candidateProfile,
    resumeAnalysis,
    suggestedRoles,
    selectedRole,
    setSelectedRole,
    interviewReport,
    interviewHistory,
    careerRoadmap,
    applications,
    analyzeResume,
    isAnalyzingResume,
  } = usePlacement();

  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handleDownloadReport = async () => {
    setIsGeneratingPdf(true);
    try {
      let activeProf = candidateProfile;
      let activeAnalysis = resumeAnalysis;

      if (!activeProf) {
        // If candidate hasn't loaded a resume yet, initialize with the premier sample profile
        const sample = SAMPLE_RESUMES[0];
        await analyzeResume(sample.text, `${sample.name.replace(/\s+/g, '_')}_Resume.pdf`);
      }

      generatePlacementReportPDF({
        candidateProfile: activeProf || candidateProfile,
        resumeAnalysis: activeAnalysis || resumeAnalysis,
        suggestedRoles,
        selectedRole,
        interviewReport,
        careerRoadmap,
      });
    } catch (err) {
      console.error('Error generating placement PDF report:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleLoadSample = (sampleId: string) => {
    const sample = SAMPLE_RESUMES.find(s => s.id === sampleId);
    if (sample) {
      analyzeResume(sample.text, `${sample.name.replace(/\s+/g, '_')}_Resume.pdf`);
    }
  };

  const atsScore = resumeAnalysis?.ats_compatibility?.total ?? 0;
  const interviewOverall = interviewReport?.overall_performance ?? 0;
  const completedTasksCount = careerRoadmap
    ? careerRoadmap.reduce((acc, m) => acc + (m.actionable_tasks || []).filter(t => t.completed).length, 0)
    : 0;
  const totalTasksCount = careerRoadmap
    ? careerRoadmap.reduce((acc, m) => acc + (m.actionable_tasks || []).length, 0)
    : 0;

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Welcome Banner */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-900 text-white p-6 sm:p-10 shadow-xl border border-indigo-950">
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none"></div>
        <div className="absolute right-1/4 -bottom-20 w-64 h-64 rounded-full bg-sky-500/10 blur-2xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-semibold tracking-wide uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            <span>Unified Placement Intelligence</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Your AI-Powered Placement Assistant
          </h1>

          <p className="mt-3 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal">
            Analyze your resume, discover suitable career roles, and practice personalized interviews in one place.
          </p>

          {/* Prompt-mandated primary buttons */}
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              id="btn-hero-upload-resume"
              onClick={() => setActiveTab('resume-analyzer')}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-md shadow-indigo-900/40 transition-all cursor-pointer"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Resume</span>
            </button>

            <button
              id="btn-hero-analyze-resume"
              onClick={() => setActiveTab('resume-analyzer')}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm backdrop-blur-xs border border-white/20 transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Analyze Resume</span>
            </button>

            <button
              id="btn-hero-find-roles"
              onClick={() => setActiveTab('role-suggestion')}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm backdrop-blur-xs border border-white/20 transition-all cursor-pointer"
            >
              <Compass className="w-4 h-4" />
              <span>Find Suitable Roles</span>
            </button>

            <button
              id="btn-hero-start-interview"
              onClick={() => setActiveTab('interview-coach')}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-white font-semibold text-sm shadow-md transition-all cursor-pointer"
            >
              <Mic className="w-4 h-4" />
              <span>Start Mock Interview</span>
            </button>

            <button
              id="btn-download-report"
              onClick={handleDownloadReport}
              disabled={isGeneratingPdf}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-md shadow-emerald-900/40 transition-all cursor-pointer disabled:opacity-60"
            >
              <Download className="w-4 h-4" />
              <span>{isGeneratingPdf ? 'Generating PDF...' : 'Download Report'}</span>
            </button>
          </div>

          {/* Quick Demo Resume Loader */}
          {!candidateProfile && (
            <div className="mt-8 pt-6 border-t border-slate-700/80">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2.5">
                ⚡ Or test immediately with 1-click verified campus resumes:
              </span>
              <div className="flex flex-wrap gap-2">
                {SAMPLE_RESUMES.map(sample => (
                  <button
                    key={sample.id}
                    disabled={isAnalyzingResume}
                    onClick={() => handleLoadSample(sample.id)}
                    className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-600/70 text-xs font-medium text-slate-200 transition-colors disabled:opacity-50"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{sample.name}</span>
                    <span className="text-[10px] text-indigo-300 font-normal">({sample.role})</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Interconnected Modules Overview Bento Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Module 1: Resume Analyzer Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              {resumeAnalysis ? (
                <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  ATS {atsScore}/100
                </span>
              ) : (
                <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-600">
                  Pending Upload
                </span>
              )}
            </div>

            <h3 className="text-lg font-bold text-slate-900">1. Resume Analyzer</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Extracts education, programming languages, tech stack, projects, and calculates verified ATS compatibility.
            </p>

            {resumeAnalysis ? (
              <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Candidate:</span>
                  <span className="font-semibold text-slate-800">{candidateProfile?.name || 'Analyzed Candidate'}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Skills Detected:</span>
                  <span className="font-semibold text-slate-800">
                    {(candidateProfile?.programming_languages?.length || 0) +
                      (candidateProfile?.web_dev_skills?.length || 0) +
                      (candidateProfile?.databases?.length || 0)}{' '}
                    technologies
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Projects Evaluated:</span>
                  <span className="font-semibold text-slate-800">{candidateProfile?.projects?.length || 0} projects</span>
                </div>
              </div>
            ) : (
              <div className="mt-4 py-4 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                <p className="text-xs text-slate-500">Upload PDF or DOCX to view full ATS score & project breakdown</p>
              </div>
            )}
          </div>

          <button
            onClick={() => setActiveTab('resume-analyzer')}
            className="mt-5 w-full flex items-center justify-center space-x-1.5 py-2 px-3 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            <span>{resumeAnalysis ? 'View Full Analysis' : 'Upload & Analyze'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Module 2: Role Suggestion Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center font-bold">
                <Compass className="w-5 h-5" />
              </div>
              {selectedRole ? (
                <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-sky-50 text-sky-700 border border-sky-200 truncate max-w-[130px]">
                  {selectedRole}
                </span>
              ) : (
                <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-600">
                  {suggestedRoles.length > 0 ? `${suggestedRoles.length} Roles Found` : 'Requires Profile'}
                </span>
              )}
            </div>

            <h3 className="text-lg font-bold text-slate-900">2. Role Suggestion</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Maps candidate skills directly against target roles, identifying verified skill matches and bridgeable gaps.
            </p>

            {suggestedRoles.length > 0 ? (
              <div className="mt-4 space-y-2">
                {suggestedRoles.slice(0, 3).map((role, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      setSelectedRole(role.role_name);
                      setActiveTab('role-suggestion');
                    }}
                    className={`p-2.5 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition-colors ${
                      selectedRole === role.role_name
                        ? 'bg-sky-50/80 border-sky-200 font-semibold text-sky-900'
                        : 'bg-slate-50 border-slate-100 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <span className="truncate pr-2">{role.role_name}</span>
                    <span className="font-bold text-sky-700 shrink-0">{role.compatibility_percentage}%</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-4 py-4 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                <p className="text-xs text-slate-500">Identifies suitable roles automatically from candidate profile</p>
              </div>
            )}
          </div>

          <button
            onClick={() => setActiveTab('role-suggestion')}
            className="mt-5 w-full flex items-center justify-center space-x-1.5 py-2 px-3 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            <span>Explore Suggested Roles</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Module 3: Interview Coach Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <Mic className="w-5 h-5" />
              </div>
              {interviewReport ? (
                <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Overall {interviewOverall}/100
                </span>
              ) : (
                <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-600">
                  {interviewHistory.length > 0 ? `Stage ${interviewHistory.length + 1}/5` : '5-Stage Flow'}
                </span>
              )}
            </div>

            <h3 className="text-lg font-bold text-slate-900">3. AI Interview Coach</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Interactive 5-stage placement simulation (Intro, Resume, Tech, Project Deep Dive, Behavioral) with real-time scoring.
            </p>

            {interviewReport ? (
              <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Technical Knowledge:</span>
                  <span className="font-semibold text-slate-800">{interviewReport.technical_knowledge}/100</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Communication:</span>
                  <span className="font-semibold text-slate-800">{interviewReport.communication}/100</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Project Understanding:</span>
                  <span className="font-semibold text-slate-800">{interviewReport.project_understanding}/100</span>
                </div>
              </div>
            ) : (
              <div className="mt-4 py-4 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                <p className="text-xs text-slate-500">Simulate questions targeted to your specific projects and target role</p>
              </div>
            )}
          </div>

          <button
            onClick={() => setActiveTab('interview-coach')}
            className="mt-5 w-full flex items-center justify-center space-x-1.5 py-2 px-3 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            <span>{interviewReport ? 'View Interview Report' : 'Launch Mock Interview'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* Comprehensive Career Status & Roadmap Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: 30/60/90 Days Roadmap Preview */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-bold text-slate-900">Personalized Placement Roadmap</h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Structured 30 / 60 / 90-day action plan generated from your resume and interview performance
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                id="btn-roadmap-download-pdf"
                onClick={handleDownloadReport}
                disabled={isGeneratingPdf}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-60"
                title="Download comprehensive PDF report"
              >
                <Download className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">Download Report (PDF)</span>
                <span className="sm:hidden">Report</span>
              </button>
              <button
                onClick={() => setActiveTab('career-roadmap')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1 py-1.5 px-2"
              >
                <span>View full</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {careerRoadmap ? (
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
                <span>Total Action Items Progress:</span>
                <span className="font-semibold text-indigo-700">
                  {completedTasksCount} of {totalTasksCount} tasks completed (
                  {totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                  style={{
                    width: `${totalTasksCount > 0 ? (completedTasksCount / totalTasksCount) * 100 : 0}%`,
                  }}
                ></div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                {careerRoadmap.map((milestone, idx) => (
                  <div
                    key={milestone.period_id}
                    onClick={() => setActiveTab('career-roadmap')}
                    className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/60 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider">
                        {milestone.period_label}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">Phase 0{idx + 1}</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 mt-1">{milestone.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {milestone.focus_area}
                    </p>
                    <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">{milestone.actionable_tasks.length} tasks</span>
                      <span className="font-semibold text-emerald-600">
                        {milestone.actionable_tasks.filter(t => t.completed).length} done
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-6 py-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <MapPin className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-600 font-medium">No active roadmap generated yet.</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Upload your resume or pick a target role to build your custom 30/60/90 days plan.
              </p>
              <button
                onClick={() => setActiveTab('resume-analyzer')}
                className="mt-3 px-3 py-1.5 text-xs font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 cursor-pointer"
              >
                Start with Resume Analyzer
              </button>
            </div>
          )}
        </div>

        {/* Right 1 Col: Placement Application Tracker Preview */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Briefcase className="w-4 h-4 text-sky-600" />
                <h3 className="text-sm font-bold text-slate-900">Placement Applications</h3>
              </div>
              <button
                onClick={() => setActiveTab('applications')}
                className="text-xs font-semibold text-sky-600 hover:text-sky-800"
              >
                View all ({applications.length})
              </button>
            </div>

            <div className="mt-4 space-y-2.5">
              {applications.slice(0, 3).map(app => (
                <div
                  key={app.id}
                  onClick={() => setActiveTab('applications')}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100/80 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{app.company}</h4>
                      <p className="text-[11px] text-slate-500">{app.role}</p>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        app.status === 'Interview'
                          ? 'bg-amber-100 text-amber-800'
                          : app.status === 'Offer'
                          ? 'bg-emerald-100 text-emerald-800'
                          : app.status === 'Screening'
                          ? 'bg-sky-100 text-sky-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Placement Readiness:</span>
              <span className="font-bold text-indigo-600">
                {candidateProfile ? (interviewReport ? 'Placement Ready' : 'Interview Prep Stage') : 'Needs Resume'}
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
