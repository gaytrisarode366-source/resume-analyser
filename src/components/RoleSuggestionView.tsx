import React, { useState } from 'react';
import { usePlacement } from '../context/PlacementContext';
import {
  Compass,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  FolderGit2,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Mic,
  Target,
  Search,
  Filter,
  RefreshCw,
  Info,
  ShieldAlert
} from 'lucide-react';
import { SuggestedRole } from '../types';

export const RoleSuggestionView: React.FC = () => {
  const {
    candidateProfile,
    suggestedRoles,
    isLoadingRoles,
    fetchRoleSuggestions,
    selectedRole,
    setSelectedRole,
    setActiveTab,
    startInterviewSession,
  } = usePlacement();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleDetail, setSelectedRoleDetail] = useState<SuggestedRole | null>(null);

  if (!candidateProfile) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto mb-4">
          <Compass className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Resume Analysis Required</h2>
        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
          Role Suggestion relies on your shared Candidate Profile to calculate honest, evidence-based skill matches.
        </p>
        <button
          onClick={() => setActiveTab('resume-analyzer')}
          className="mt-5 inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs cursor-pointer"
        >
          <span>Upload or Select Resume First</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  const filteredRoles = suggestedRoles.filter(role =>
    role.role_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeRole = selectedRoleDetail || (suggestedRoles.length > 0 ? suggestedRoles[0] : null);

  const handleSelectTargetRole = (role: SuggestedRole) => {
    setSelectedRole(role.role_name);
    setSelectedRoleDetail(role);
  };

  const handleLaunchInterviewForRole = (roleName: string) => {
    setSelectedRole(roleName);
    startInterviewSession(roleName);
    setActiveTab('interview-coach');
  };

  return (
    <div className="space-y-8 pb-16 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center font-bold">
              <Compass className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Role Suggestion Engine
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Auditing candidate profile for real-world technical suitability without ungrounded employment guarantees.
          </p>
        </div>

        <button
          disabled={isLoadingRoles}
          onClick={() => fetchRoleSuggestions()}
          className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-xs transition-colors self-start cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoadingRoles ? 'animate-spin' : ''}`} />
          <span>Refresh Suggestions</span>
        </button>
      </div>

      {/* Safety & Integrity Notice */}
      <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-start space-x-3">
        <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 leading-relaxed">
          <strong>Fair Placement Advisory:</strong> Compatibility percentages reflect structural alignment with your
          current profile evidence. They indicate preparation focus areas and do not constitute a guarantee of selection
          at any company.
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex items-center space-x-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search suggested roles (e.g. Backend, Full Stack, AI/ML, Cloud)..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-hidden"
          />
        </div>
        <div className="hidden sm:flex items-center space-x-1.5 text-xs text-slate-500">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span>Showing {filteredRoles.length} evaluated roles</span>
        </div>
      </div>

      {/* Main Roles Display: List on Left, Deep-Dive Details on Right */}
      {filteredRoles.length > 0 && activeRole ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Roles Selector List (5 Cols) */}
          <div className="lg:col-span-5 space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Select Role to Review Fit:
            </span>

            {filteredRoles.map((role, idx) => {
              const isCurrentActive = activeRole.role_name === role.role_name;
              const isSelectedTarget = selectedRole === role.role_name;

              return (
                <div
                  key={idx}
                  onClick={() => handleSelectTargetRole(role)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isCurrentActive
                      ? 'bg-sky-50/70 border-sky-300 ring-2 ring-sky-200 shadow-xs'
                      : 'bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/60'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-sm font-bold text-slate-900">{role.role_name}</h3>
                        {isSelectedTarget && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700">
                            Target Role
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {role.compatibility_reasoning}
                      </p>
                    </div>

                    <div className="text-right shrink-0 ml-3">
                      <span className="text-lg font-black text-sky-700">{role.compatibility_percentage}%</span>
                      <span className="block text-[10px] text-slate-400 font-medium">Match</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">
                      {role.skill_match.matching_skills.length} matching skills
                    </span>
                    <span className="text-amber-700 font-medium">
                      {role.skill_gaps.missing_technical_skills.length} gaps to bridge
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Role Deep-Dive Review Card (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-6">
            {/* Header of Active Role */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-xl font-bold text-slate-900">{activeRole.role_name}</h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-100 text-sky-800">
                    {activeRole.compatibility_percentage}% Alignment
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {activeRole.compatibility_reasoning}
                </p>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <button
                  onClick={() => setSelectedRole(activeRole.role_name)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                    selectedRole === activeRole.role_name
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {selectedRole === activeRole.role_name ? '✓ Selected as Target' : 'Set as Target Role'}
                </button>
                <button
                  onClick={() => handleLaunchInterviewForRole(activeRole.role_name)}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs cursor-pointer"
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>Mock Interview</span>
                </button>
              </div>
            </div>

            {/* 1. Skill Match */}
            <div>
              <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Skill Match (Current Candidate Evidence)</span>
              </div>
              <div className="space-y-3 bg-emerald-50/40 p-4 rounded-xl border border-emerald-100">
                <div>
                  <span className="text-[11px] font-bold text-slate-700 block mb-1">Matching Skills:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeRole.skill_match.matching_skills.map((skill, i) => (
                      <span key={i} className="px-2.5 py-0.5 text-xs font-medium rounded-md bg-white border border-emerald-200 text-emerald-900">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {activeRole.skill_match.relevant_projects.length > 0 && (
                  <div>
                    <span className="text-[11px] font-bold text-slate-700 block mb-1">Relevant Projects:</span>
                    <ul className="space-y-1">
                      {activeRole.skill_match.relevant_projects.map((p, i) => (
                        <li key={i} className="text-xs text-slate-700 flex items-center space-x-1.5">
                          <FolderGit2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* 2. Skill Gaps */}
            <div>
              <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-amber-800 mb-2.5">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>Skill Gaps (Missing for Production Role)</span>
              </div>
              <div className="space-y-3 bg-amber-50/40 p-4 rounded-xl border border-amber-100">
                <div>
                  <span className="text-[11px] font-bold text-slate-700 block mb-1">Missing Technical Skills:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeRole.skill_gaps.missing_technical_skills.map((gap, i) => (
                      <span key={i} className="px-2.5 py-0.5 text-xs font-medium rounded-md bg-white border border-amber-200 text-amber-900">
                        {gap}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-slate-700 block mb-1">Missing Tools & Concepts:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {[...activeRole.skill_gaps.missing_tools, ...activeRole.skill_gaps.missing_concepts].map((gap, i) => (
                      <span key={i} className="px-2.5 py-0.5 text-xs font-medium rounded-md bg-white border border-slate-200 text-slate-700">
                        {gap}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Preparation */}
            <div>
              <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-indigo-900 mb-2.5">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                <span>Preparation Strategy & Recommended Projects</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div>
                  <span className="text-[11px] font-bold text-slate-700 block mb-1">Key Interview Topics to Master:</span>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {activeRole.preparation.interview_topics.map((topic, i) => (
                      <li key={i} className="text-xs text-slate-700 flex items-start space-x-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0"></span>
                        <span>{topic}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 border-t border-slate-200/60">
                  <span className="text-[11px] font-bold text-slate-700 block mb-1">Recommended Portfolio Project:</span>
                  {activeRole.preparation.project_recommendations.map((rec, i) => (
                    <p key={i} className="text-xs text-slate-600 italic">
                      "{rec}"
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-12 text-center bg-white rounded-2xl border border-slate-200">
          <p className="text-xs text-slate-500">No matching roles found for your search.</p>
        </div>
      )}
    </div>
  );
};
