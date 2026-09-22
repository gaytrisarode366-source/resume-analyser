import React, { useState, useRef } from 'react';
import { usePlacement } from '../context/PlacementContext';
import { SAMPLE_RESUMES } from '../data/sampleResumes';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Award,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Code2,
  Database,
  Cloud,
  Wrench,
  Cpu,
  Layers,
  FileCheck,
  Zap,
  HelpCircle,
  FolderGit2
} from 'lucide-react';

export const ResumeAnalyzerView: React.FC = () => {
  const {
    resumeRawText,
    setResumeRawText,
    resumeFileName,
    isAnalyzingResume,
    resumeAnalysis,
    analyzeResume,
    setActiveTab,
    setSelectedRole,
  } = usePlacement();

  const [inputMode, setInputMode] = useState<'upload' | 'paste'>('upload');
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [parsingFile, setParsingFile] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = async (file: File) => {
    setErrorMsg(null);
    if (!file) return;

    const allowed = ['.pdf', '.docx', '.txt'];
    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    if (!allowed.includes(ext)) {
      setErrorMsg('Please upload a PDF (.pdf), Word (.docx), or Text (.txt) document.');
      return;
    }

    setParsingFile(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const result = reader.result as string;
          const base64 = result.split(',')[1];

          // Send to backend document parser
          const res = await fetch('/api/resume/parse-file', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              base64Data: base64,
              fileName: file.name,
              mimeType: file.type,
            }),
          });

          if (!res.ok) {
            const errData = await res.json();
            throw new Error(errData.error || 'Failed to extract text from document');
          }

          const parsed = await res.json();
          setResumeRawText(parsed.text);
          // Automatically trigger AI analysis!
          await analyzeResume(parsed.text, file.name);
        } catch (err: any) {
          setErrorMsg(err.message || 'Failed to parse resume document.');
        } finally {
          setParsingFile(false);
        }
      };

      reader.readAsDataURL(file);
    } catch (e: any) {
      setParsingFile(false);
      setErrorMsg(e.message || 'File read failed.');
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleSampleSelect = (sampleId: string) => {
    const sample = SAMPLE_RESUMES.find(s => s.id === sampleId);
    if (sample) {
      setResumeRawText(sample.text);
      analyzeResume(sample.text, `${sample.name.replace(/\s+/g, '_')}_Resume.pdf`);
    }
  };

  const atsScore = resumeAnalysis?.ats_compatibility?.total || 0;

  return (
    <div className="space-y-8 pb-16 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              AI Resume Analyzer
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Extract structured candidate data, calculate verified ATS score, and audit skills without invention.
          </p>
        </div>

        {/* Input mode switcher */}
        <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200/80 self-start">
          <button
            onClick={() => setInputMode('upload')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              inputMode === 'upload' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            PDF / DOCX Upload
          </button>
          <button
            onClick={() => setInputMode('paste')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              inputMode === 'paste' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Direct Text Input
          </button>
        </div>
      </div>

      {/* Input Section */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        {inputMode === 'upload' ? (
          <div>
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all cursor-pointer ${
                dragActive
                  ? 'border-indigo-500 bg-indigo-50/50'
                  : 'border-slate-300 hover:border-indigo-400 bg-slate-50/50 hover:bg-slate-50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.txt"
                className="hidden"
                onChange={e => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
              />

              <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-100/80 text-indigo-600 flex items-center justify-center mb-4">
                <UploadCloud className="w-7 h-7" />
              </div>

              <h3 className="text-base font-bold text-slate-800">
                {parsingFile ? 'Extracting text from resume...' : 'Drop your resume here, or click to browse'}
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Supports PDF, Microsoft Word (.docx), or plain text (.txt). Maximum 15MB.
              </p>

              {resumeFileName && (
                <div className="inline-flex items-center space-x-2 mt-4 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium">
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>{resumeFileName}</span>
                </div>
              )}
            </div>

            {errorMsg && (
              <div className="mt-3 p-3 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-xs flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
              Paste Complete Resume Text Below:
            </label>
            <textarea
              rows={8}
              value={resumeRawText}
              onChange={e => setResumeRawText(e.target.value)}
              placeholder="Paste your education, skills, projects, and work experience here..."
              className="w-full rounded-xl border border-slate-300 p-4 text-xs font-mono text-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-hidden bg-slate-50/50"
            />
            <div className="flex justify-end">
              <button
                disabled={isAnalyzingResume || !resumeRawText.trim()}
                onClick={() => analyzeResume(resumeRawText, 'Pasted_Resume.txt')}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs disabled:opacity-50 cursor-pointer"
              >
                {isAnalyzingResume ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Analyzing Resume with AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Analyze Pasted Resume</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* 1-Click Sample Resumes Quick Selector */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-xs font-semibold text-slate-500">
              ⚡ Quick test with pre-built campus student resumes:
            </span>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_RESUMES.map(sample => (
                <button
                  key={sample.id}
                  onClick={() => handleSampleSelect(sample.id)}
                  disabled={isAnalyzingResume}
                  className="px-3 py-1 rounded-lg text-xs font-medium bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
                >
                  {sample.name} ({sample.badge})
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Loading State */}
      {isAnalyzingResume && (
        <div className="bg-white rounded-2xl p-10 border border-indigo-100 shadow-sm text-center">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Sparkles className="w-6 h-6 animate-spin" />
          </div>
          <h3 className="text-base font-bold text-slate-900">AI Coordinator Analyzing Resume</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Extracting candidate profile, computing keyword match density, evaluating project impact, and auditing ATS compliance...
          </p>
        </div>
      )}

      {/* Analysis Results Display */}
      {resumeAnalysis && !isAnalyzingResume && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Top Banner: ATS Score + Candidate Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* ATS Score Radial Card (F. ATS Compatibility Analysis) */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    ATS Compatibility Score
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                    Industry Calibrated
                  </span>
                </div>

                <div className="flex items-baseline space-x-2">
                  <span className="text-5xl font-black text-slate-900 tracking-tight">{atsScore}</span>
                  <span className="text-lg font-bold text-slate-400">/100</span>
                </div>

                {/* ATS Category Breakdown */}
                <div className="mt-5 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Skills Keyword Density</span>
                    <span className="font-semibold text-slate-900">
                      {resumeAnalysis.ats_compatibility?.skills_score || 24}/30
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full"
                      style={{
                        width: `${((resumeAnalysis.ats_compatibility?.skills_score || 24) / 30) * 100}%`,
                      }}
                    ></div>
                  </div>

                  <div className="flex justify-between text-slate-600 pt-1">
                    <span>Work & Internship Experience</span>
                    <span className="font-semibold text-slate-900">
                      {resumeAnalysis.ats_compatibility?.experience_score || 18}/25
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-sky-600 h-full rounded-full"
                      style={{
                        width: `${((resumeAnalysis.ats_compatibility?.experience_score || 18) / 25) * 100}%`,
                      }}
                    ></div>
                  </div>

                  <div className="flex justify-between text-slate-600 pt-1">
                    <span>Education & Coursework</span>
                    <span className="font-semibold text-slate-900">
                      {resumeAnalysis.ats_compatibility?.education_score || 14}/15
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full"
                      style={{
                        width: `${((resumeAnalysis.ats_compatibility?.education_score || 14) / 15) * 100}%`,
                      }}
                    ></div>
                  </div>

                  <div className="flex justify-between text-slate-600 pt-1">
                    <span>Formatting & Scannability</span>
                    <span className="font-semibold text-slate-900">
                      {resumeAnalysis.ats_compatibility?.formatting_keywords || 12}/15
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-purple-600 h-full rounded-full"
                      style={{
                        width: `${((resumeAnalysis.ats_compatibility?.formatting_keywords || 12) / 15) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100">
                <p className="text-[11px] text-slate-500 italic leading-relaxed">
                  {resumeAnalysis.ats_compatibility?.explanation}
                </p>
              </div>
            </div>

            {/* Candidate Summary (A. Candidate Summary) */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <h2 className="text-base font-bold text-slate-900">A. Candidate Summary</h2>
                  </div>
                  <span className="text-xs font-medium text-slate-400">
                    Candidate: <strong className="text-slate-700">{resumeAnalysis.candidate_profile?.name || 'Verified'}</strong>
                  </span>
                </div>

                <p className="mt-4 text-sm text-slate-700 leading-relaxed font-normal">
                  {resumeAnalysis.candidate_summary}
                </p>

                {/* Candidate Verified Attributes */}
                <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Degree & College</span>
                    <span className="text-xs font-semibold text-slate-900 block mt-0.5 truncate">
                      {resumeAnalysis.candidate_profile?.education?.[0]?.degree || 'Not mentioned in resume'}
                    </span>
                    <span className="text-[11px] text-slate-500 block truncate">
                      {resumeAnalysis.candidate_profile?.education?.[0]?.college || 'Not mentioned'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Graduation Year</span>
                    <span className="text-xs font-semibold text-slate-900 block mt-0.5">
                      Class of {resumeAnalysis.candidate_profile?.education?.[0]?.graduation_year || 'Not mentioned in resume'}
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      Score: {resumeAnalysis.candidate_profile?.education?.[0]?.score || 'Not mentioned in resume'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 col-span-2 sm:col-span-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Experience / Internships</span>
                    <span className="text-xs font-semibold text-slate-900 block mt-0.5">
                      {resumeAnalysis.candidate_profile?.experience?.length || 0} recorded roles
                    </span>
                    <span className="text-[11px] text-slate-500 block truncate">
                      {resumeAnalysis.candidate_profile?.experience?.[0]?.company || 'Academic projects focus'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action routing button */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-slate-500">
                  Candidate profile ready for shared career modules.
                </span>
                <button
                  onClick={() => setActiveTab('role-suggestion')}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  <span>Find Suitable Roles</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Section B: Technical Skills Categorization */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs">
            <div className="flex items-center space-x-2 pb-4 border-b border-slate-100">
              <Code2 className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-slate-900">B. Technical Skills Breakdown</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              {/* Programming Languages */}
              <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-100">
                <div className="flex items-center space-x-2 mb-2 text-xs font-bold text-slate-700">
                  <Code2 className="w-4 h-4 text-indigo-600" />
                  <span>Programming Languages</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {resumeAnalysis.technical_skills?.programming_languages?.length > 0 ? (
                    resumeAnalysis.technical_skills.programming_languages.map((item, i) => (
                      <span key={i} className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white border border-slate-200 text-slate-800 shadow-2xs">
                        {item}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400 italic">Not mentioned in resume</span>
                  )}
                </div>
              </div>

              {/* Web Development */}
              <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-100">
                <div className="flex items-center space-x-2 mb-2 text-xs font-bold text-slate-700">
                  <Layers className="w-4 h-4 text-sky-600" />
                  <span>Web Development & Frameworks</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {resumeAnalysis.technical_skills?.web_dev?.length > 0 ? (
                    resumeAnalysis.technical_skills.web_dev.map((item, i) => (
                      <span key={i} className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white border border-slate-200 text-slate-800 shadow-2xs">
                        {item}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400 italic">Not mentioned in resume</span>
                  )}
                </div>
              </div>

              {/* Databases */}
              <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-100">
                <div className="flex items-center space-x-2 mb-2 text-xs font-bold text-slate-700">
                  <Database className="w-4 h-4 text-emerald-600" />
                  <span>Databases & Storage</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {resumeAnalysis.technical_skills?.databases?.length > 0 ? (
                    resumeAnalysis.technical_skills.databases.map((item, i) => (
                      <span key={i} className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white border border-slate-200 text-slate-800 shadow-2xs">
                        {item}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400 italic">Not mentioned in resume</span>
                  )}
                </div>
              </div>

              {/* AI & Machine Learning */}
              <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-100">
                <div className="flex items-center space-x-2 mb-2 text-xs font-bold text-slate-700">
                  <Cpu className="w-4 h-4 text-purple-600" />
                  <span>AI & Machine Learning</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {resumeAnalysis.technical_skills?.ai_ml?.length > 0 ? (
                    resumeAnalysis.technical_skills.ai_ml.map((item, i) => (
                      <span key={i} className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white border border-slate-200 text-slate-800 shadow-2xs">
                        {item}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400 italic">Not mentioned in resume</span>
                  )}
                </div>
              </div>

              {/* Cloud & DevOps */}
              <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-100">
                <div className="flex items-center space-x-2 mb-2 text-xs font-bold text-slate-700">
                  <Cloud className="w-4 h-4 text-amber-600" />
                  <span>Cloud & DevOps</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {resumeAnalysis.technical_skills?.cloud_devops?.length > 0 ? (
                    resumeAnalysis.technical_skills.cloud_devops.map((item, i) => (
                      <span key={i} className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white border border-slate-200 text-slate-800 shadow-2xs">
                        {item}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400 italic">Not mentioned in resume</span>
                  )}
                </div>
              </div>

              {/* Tools & Utilities */}
              <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-100">
                <div className="flex items-center space-x-2 mb-2 text-xs font-bold text-slate-700">
                  <Wrench className="w-4 h-4 text-slate-600" />
                  <span>Developer Tools & Version Control</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {resumeAnalysis.technical_skills?.tools?.length > 0 ? (
                    resumeAnalysis.technical_skills.tools.map((item, i) => (
                      <span key={i} className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white border border-slate-200 text-slate-800 shadow-2xs">
                        {item}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400 italic">Not mentioned in resume</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section C: Project Analysis */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs">
            <div className="flex items-center space-x-2 pb-4 border-b border-slate-100">
              <FolderGit2 className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-slate-900">C. Project Analysis & Impact Review</h2>
            </div>

            <div className="mt-6 space-y-4">
              {resumeAnalysis.project_analysis?.length > 0 ? (
                resumeAnalysis.project_analysis.map((proj, idx) => (
                  <div key={idx} className="p-5 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <h3 className="text-sm font-bold text-slate-900">{proj.title}</h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-slate-500">Impact Score:</span>
                        <span className="px-2 py-0.5 text-xs font-bold rounded-md bg-indigo-100 text-indigo-800">
                          {proj.impact_score}/100
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="text-xs font-semibold text-emerald-800 block mb-1">
                        Observed Technical Strengths:
                      </span>
                      <ul className="space-y-1">
                        {proj.strengths.map((str, sIdx) => (
                          <li key={sIdx} className="text-xs text-slate-600 flex items-start space-x-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{str}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-2 border-t border-slate-200/60">
                      <span className="text-xs font-semibold text-indigo-900 block mb-0.5">
                        Recommended Enhancement for Campus Interviews:
                      </span>
                      <p className="text-xs text-slate-600 leading-relaxed">{proj.recommended_enhancement}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic">No detailed projects extracted from resume text.</p>
              )}
            </div>
          </div>

          {/* Section D & E: Resume Strengths & Missing/Weak Areas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* D. Resume Strengths */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
              <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h2 className="text-base font-bold text-slate-900">D. Resume Strengths</h2>
              </div>
              <ul className="mt-4 space-y-3">
                {resumeAnalysis.resume_strengths?.map((str, idx) => (
                  <li key={idx} className="flex items-start space-x-2.5 text-xs text-slate-700 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* E. Missing / Weak Areas */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
              <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <h2 className="text-base font-bold text-slate-900">E. Missing / Weak Areas</h2>
              </div>
              <ul className="mt-4 space-y-3">
                {resumeAnalysis.missing_weak_areas?.map((area, idx) => (
                  <li key={idx} className="flex items-start space-x-2.5 text-xs text-slate-700 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0"></span>
                    <span>{area}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Section G: Suggested Resume Improvements */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs">
            <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
              <Zap className="w-5 h-5 text-indigo-600" />
              <h2 className="text-base font-bold text-slate-900">G. Suggested Resume Improvements</h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Apply these changes before submitting to campus placement portals or ATS scanning engines:
            </p>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {resumeAnalysis.suggested_improvements?.map((imp, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-indigo-50/40 border border-indigo-100/80">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">
                    Action #{idx + 1}
                  </span>
                  <p className="text-xs text-slate-700 mt-1 leading-relaxed">{imp}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Next Step Pipeline Controls */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-900 to-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
            <div>
              <h3 className="text-base font-bold">Candidate Profile Successfully Synchronized</h3>
              <p className="text-xs text-slate-300 mt-0.5">
                The shared profile is now active. Explore role matches or jump straight into the personalized interview simulator.
              </p>
            </div>
            <div className="flex items-center space-x-3 shrink-0">
              <button
                onClick={() => setActiveTab('profile')}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-white border border-white/20 transition-all cursor-pointer"
              >
                Inspect Profile
              </button>
              <button
                onClick={() => setActiveTab('role-suggestion')}
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-500 hover:bg-indigo-400 text-white shadow-md transition-all cursor-pointer"
              >
                <span>Discover Suitable Roles</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
