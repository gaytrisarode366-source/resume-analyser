import React from 'react';
import { usePlacement } from '../context/PlacementContext';
import {
  MapPin,
  CheckSquare,
  Square,
  Calendar,
  Sparkles,
  ArrowRight,
  Printer,
  RefreshCw,
  Award,
  AlertCircle,
  CheckCircle2,
  Briefcase,
  Target,
  Clock,
  BookOpen,
  Download
} from 'lucide-react';
import { generatePlacementReportPDF } from '../utils/pdfGenerator';

export const CareerRoadmapView: React.FC = () => {
  const {
    candidateProfile,
    selectedRole,
    interviewReport,
    careerRoadmap,
    isLoadingRoadmap,
    generateCareerRoadmap,
    toggleRoadmapTask,
    setActiveTab,
    resumeAnalysis,
    suggestedRoles,
  } = usePlacement();

  const [isGeneratingPdf, setIsGeneratingPdf] = React.useState(false);

  const handleDownloadPDF = () => {
    setIsGeneratingPdf(true);
    try {
      generatePlacementReportPDF({
        candidateProfile,
        resumeAnalysis,
        suggestedRoles,
        selectedRole,
        interviewReport,
        careerRoadmap,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  if (!candidateProfile) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
          <MapPin className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Roadmap Requires Candidate Profile</h2>
        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
          The 30/60/90-Day Placement Roadmap synthesizes your resume analysis, selected role, and mock interview weak points.
        </p>
        <button
          onClick={() => setActiveTab('resume-analyzer')}
          className="mt-5 inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs"
        >
          <span>Upload or Analyze Resume First</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  const readinessScore = interviewReport
    ? (interviewReport.readiness_score || interviewReport.overall_performance)
    : resumeAnalysis?.ats_compatibility?.total
    ? Math.min(Math.round(resumeAnalysis.ats_compatibility.total * 0.9), 92)
    : 75;

  const currentRole = selectedRole || 'Software Developer';

  return (
    <div className="space-y-8 pb-16 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
              <MapPin className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Personalized Career Roadmap
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Grounded 30 / 60 / 90-Day Placement Strategy synthesized from your resume and interview performance.
          </p>
        </div>

        <div className="flex items-center space-x-2 self-start">
          <button
            onClick={handleDownloadPDF}
            disabled={isGeneratingPdf}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isGeneratingPdf ? 'Generating PDF...' : 'Download PDF Report'}</span>
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>
          <button
            disabled={isLoadingRoadmap}
            onClick={() => generateCareerRoadmap()}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingRoadmap ? 'animate-spin' : ''}`} />
            <span>Regenerate</span>
          </button>
        </div>
      </div>

      {/* Placement Readiness & Profile Synthesis Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Candidate Readiness Score */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400">1. Placement Readiness</span>
          <div className="flex items-baseline space-x-1 mt-1">
            <span className="text-3xl font-black text-indigo-600">{readinessScore}</span>
            <span className="text-xs font-bold text-slate-400">/100</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {interviewReport ? 'Calibrated via live interview' : 'Estimated from resume ATS score'}
          </p>
        </div>

        {/* Recommended Role */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400">2. Target Role</span>
          <div className="text-sm font-bold text-slate-900 mt-1 truncate">
            {currentRole}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Configured in Role Suggestion
          </p>
        </div>

        {/* Key Strengths */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400">3. Verified Strengths</span>
          <div className="text-xs font-semibold text-emerald-800 mt-1 truncate">
            {candidateProfile.programming_languages.slice(0, 3).join(', ') || 'Technical foundations'}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {candidateProfile.projects.length} evaluated projects
          </p>
        </div>

        {/* Major Skill Gaps */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400">4. Priority Revision</span>
          <div className="text-xs font-semibold text-amber-800 mt-1 truncate">
            {candidateProfile.skill_gaps?.[0] || 'System Design & DSA'}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {candidateProfile.skill_gaps?.length || 0} topics in action plan
          </p>
        </div>
      </div>

      {/* 30 / 60 / 90 Days Roadmap Detailed Timeline */}
      {isLoadingRoadmap ? (
        <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center shadow-xs">
          <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">Synthesizing Personalized Roadmap</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Structuring foundational gaps, project milestones, and placement application strategy...
          </p>
        </div>
      ) : careerRoadmap && careerRoadmap.length > 0 ? (
        <div className="space-y-6">
          {careerRoadmap.map((milestone, idx) => {
            const completedTasks = milestone.actionable_tasks.filter(t => t.completed).length;
            const totalTasks = milestone.actionable_tasks.length;
            const percent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

            let badgeBg = 'bg-indigo-50 text-indigo-700 border-indigo-200';
            if (idx === 1) badgeBg = 'bg-sky-50 text-sky-700 border-sky-200';
            if (idx === 2) badgeBg = 'bg-emerald-50 text-emerald-700 border-emerald-200';

            return (
              <div
                key={milestone.period_id}
                className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-5"
              >
                {/* Milestone Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${badgeBg}`}>
                      {milestone.period_label}
                    </span>
                    <h2 className="text-lg font-bold text-slate-900">{milestone.title}</h2>
                  </div>

                  <div className="flex items-center space-x-3 text-xs">
                    <span className="text-slate-500">
                      {completedTasks} of {totalTasks} Completed ({percent}%)
                    </span>
                    <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Focus Area Description */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 leading-relaxed">
                  <strong className="text-slate-900 block mb-0.5">Phase Objective:</strong>
                  {milestone.focus_area}
                </div>

                {/* Key Milestones Bullets */}
                <div>
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                    Key Outcomes to Demonstrate:
                  </span>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {(milestone.milestones || milestone.goals || []).map((ms: string, mIdx: number) => (
                      <li key={mIdx} className="text-xs text-slate-600 flex items-start space-x-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                        <span>{ms}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Actionable Tasks Checklist */}
                <div>
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2.5">
                    Actionable Task Checklist (Click to Track Progress):
                  </span>
                  <div className="space-y-2">
                    {milestone.actionable_tasks.map(task => (
                      <div
                        key={task.id}
                        onClick={() => toggleRoadmapTask(milestone.period_id, task.id)}
                        className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          task.completed
                            ? 'bg-emerald-50/50 border-emerald-200 text-slate-400 line-through'
                            : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          {task.completed ? (
                            <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-400 shrink-0" />
                          )}
                          <span className="text-xs font-medium">{task.title || task.task}</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 uppercase">
                          {task.category}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-10 border border-slate-200 text-center shadow-xs">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">Generate Your Personalized Roadmap</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Click below to produce an actionable 30/60/90-Day Placement strategy tailored to {currentRole}.
          </p>
          <button
            onClick={() => generateCareerRoadmap()}
            className="mt-4 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs"
          >
            Generate 30 / 60 / 90 Days Roadmap
          </button>
        </div>
      )}
    </div>
  );
};
