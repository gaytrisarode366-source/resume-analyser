import React, { useState } from 'react';
import { usePlacement } from '../context/PlacementContext';
import {
  User,
  GraduationCap,
  Code2,
  FolderGit2,
  Briefcase,
  Award,
  AlertCircle,
  Plus,
  Trash2,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Compass,
  Mic,
  Copy,
  Check
} from 'lucide-react';

export const CandidateProfileView: React.FC = () => {
  const {
    candidateProfile,
    updateCandidateProfile,
    fetchRoleSuggestions,
    setActiveTab,
    setSelectedRole,
    selectedRole,
  } = usePlacement();

  const [newSkill, setNewSkill] = useState('');
  const [skillCategory, setSkillCategory] = useState<'programming_languages' | 'technical_skills' | 'ai_ml_skills' | 'web_dev_skills' | 'databases' | 'cloud_technologies' | 'tools' | 'interests'>('programming_languages');
  const [copiedJson, setCopiedJson] = useState(false);

  if (!candidateProfile) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">No Candidate Profile Created Yet</h2>
        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
          Upload and analyze your resume to generate the shared structured profile, or pick a sample student resume from the dashboard.
        </p>
        <button
          onClick={() => setActiveTab('resume-analyzer')}
          className="mt-5 inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs"
        >
          <span>Go to Resume Analyzer</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim()) return;

    const list = candidateProfile[skillCategory] || [];
    if (!list.includes(newSkill.trim())) {
      const updated = {
        ...candidateProfile,
        [skillCategory]: [...list, newSkill.trim()],
      };
      updateCandidateProfile(updated);
      fetchRoleSuggestions(updated);
    }
    setNewSkill('');
  };

  const handleRemoveSkill = (category: keyof typeof candidateProfile, item: string) => {
    const list = (candidateProfile[category] as string[]) || [];
    const updated = {
      ...candidateProfile,
      [category]: list.filter(s => s !== item),
    };
    updateCandidateProfile(updated);
    fetchRoleSuggestions(updated);
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(candidateProfile, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  return (
    <div className="space-y-8 pb-16 max-w-6xl mx-auto">
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-sky-500 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-indigo-100">
            {candidateProfile.name?.charAt(0) || 'C'}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{candidateProfile.name}</h1>
              <span className="px-2.5 py-0.5 text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
                Active Shared Profile
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {candidateProfile.email} • {candidateProfile.phone}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopyJson}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
            <span>{copiedJson ? 'Copied JSON' : 'Export JSON'}</span>
          </button>
          <button
            onClick={() => setActiveTab('role-suggestion')}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <span>View Role Matches</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Profile Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Detailed Profile Data */}
        <div className="lg:col-span-2 space-y-6">
          {/* Education */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
              <GraduationCap className="w-5 h-5 text-indigo-600" />
              <h2 className="text-sm font-bold text-slate-900">Education Background</h2>
            </div>
            <div className="mt-4 space-y-3">
              {candidateProfile.education?.length > 0 ? (
                candidateProfile.education.map((edu, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{edu.degree}</h4>
                      <p className="text-xs text-slate-600 mt-0.5">{edu.college}</p>
                      <div className="flex items-center space-x-3 text-[11px] text-slate-400 mt-1">
                        <span>Class of {edu.graduation_year}</span>
                        {edu.score && <span>Score: {edu.score}</span>}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic">Not mentioned in resume.</p>
              )}
            </div>
          </div>

          {/* Projects */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
              <FolderGit2 className="w-5 h-5 text-sky-600" />
              <h2 className="text-sm font-bold text-slate-900">Extracted Projects ({candidateProfile.projects?.length || 0})</h2>
            </div>
            <div className="mt-4 space-y-3">
              {candidateProfile.projects?.length > 0 ? (
                candidateProfile.projects.map((proj, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900">{proj.title}</h4>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{proj.description}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {proj.technologies?.map((tech, tIdx) => (
                        <span key={tIdx} className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-white text-slate-700 border border-slate-200">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic">Not mentioned in resume.</p>
              )}
            </div>
          </div>

          {/* Work & Internship Experience */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
              <Briefcase className="w-5 h-5 text-emerald-600" />
              <h2 className="text-sm font-bold text-slate-900">Experience & Internships</h2>
            </div>
            <div className="mt-4 space-y-3">
              {candidateProfile.experience?.length > 0 ? (
                candidateProfile.experience.map((exp, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900">{exp.role}</h4>
                      <span className="text-[11px] text-slate-400">{exp.duration}</span>
                    </div>
                    <p className="text-xs text-indigo-700 font-medium">{exp.company}</p>
                    <p className="text-xs text-slate-600 leading-relaxed">{exp.description}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic">Not mentioned in resume.</p>
              )}
            </div>
          </div>

          {/* Achievements & Certifications */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
              <Award className="w-5 h-5 text-amber-600" />
              <h2 className="text-sm font-bold text-slate-900">Certifications & Achievements</h2>
            </div>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                  Certifications
                </span>
                <ul className="space-y-1.5">
                  {candidateProfile.certifications?.length > 0 ? (
                    candidateProfile.certifications.map((c, i) => (
                      <li key={i} className="text-xs text-slate-600 flex items-start space-x-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{c}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-xs text-slate-400 italic">Not mentioned in resume</li>
                  )}
                </ul>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                  Achievements & Hackathons
                </span>
                <ul className="space-y-1.5">
                  {candidateProfile.achievements?.length > 0 ? (
                    candidateProfile.achievements.map((a, i) => (
                      <li key={i} className="text-xs text-slate-600 flex items-start space-x-2">
                        <Award className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <span>{a}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-xs text-slate-400 italic">Not mentioned in resume</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Dynamic Skill Tags & Add Skill Tool */}
        <div className="space-y-6">
          {/* Add Skill to Shared Profile */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-1">Refine Profile Skills</h3>
            <p className="text-xs text-slate-500 mb-4">
              Add any missing tools or frameworks to immediately recalculate role matches.
            </p>

            <form onSubmit={handleAddSkill} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Category</label>
                <select
                  value={skillCategory}
                  onChange={e => setSkillCategory(e.target.value as any)}
                  className="w-full text-xs rounded-xl border border-slate-300 p-2 bg-slate-50 focus:border-indigo-500 outline-hidden"
                >
                  <option value="programming_languages">Programming Languages</option>
                  <option value="web_dev_skills">Web Development</option>
                  <option value="databases">Databases</option>
                  <option value="cloud_technologies">Cloud & DevOps</option>
                  <option value="ai_ml_skills">AI / ML</option>
                  <option value="tools">Tools & Software</option>
                  <option value="interests">Interests</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Skill Name</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={e => setNewSkill(e.target.value)}
                    placeholder="e.g. Docker, GraphQL, PyTorch"
                    className="flex-1 text-xs rounded-xl border border-slate-300 p-2 focus:border-indigo-500 outline-hidden"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Identified Skill Gaps */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <h3 className="text-sm font-bold text-slate-900">Identified Skill Gaps</h3>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Concepts and tools to bridge before major campus placement rounds:
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {candidateProfile.skill_gaps?.length > 0 ? (
                candidateProfile.skill_gaps.map((gap, i) => (
                  <span key={i} className="px-2.5 py-1 text-xs font-medium rounded-lg bg-amber-50 text-amber-800 border border-amber-200">
                    {gap}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400 italic">No significant gaps detected</span>
              )}
            </div>
          </div>

          {/* Quick Action Navigator */}
          <div className="p-5 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-3">
            <h4 className="text-xs font-bold text-indigo-950 uppercase tracking-wider">Next Recommended Step</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Explore algorithmic compatibility percentages across developer roles based on this profile.
            </p>
            <button
              onClick={() => setActiveTab('role-suggestion')}
              className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs"
            >
              <Compass className="w-4 h-4" />
              <span>Explore Suggested Roles</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
