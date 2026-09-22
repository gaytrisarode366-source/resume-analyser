import React, { useState, useEffect, useRef } from 'react';
import { usePlacement } from '../context/PlacementContext';
import {
  Mic,
  MicOff,
  Send,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Award,
  RefreshCw,
  ArrowRight,
  Target,
  User,
  Sliders,
  Play,
  RotateCcw,
  BookOpen,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { InterviewDifficulty, InterviewType } from '../types';

export const InterviewCoachView: React.FC = () => {
  const {
    candidateProfile,
    selectedRole,
    setSelectedRole,
    suggestedRoles,
    interviewDifficulty,
    setInterviewDifficulty,
    interviewType,
    setInterviewType,
    interviewStage,
    interviewHistory,
    currentQuestion,
    currentQuestionContext,
    isGeneratingQuestion,
    isEvaluatingAnswer,
    interviewReport,
    startInterviewSession,
    submitCandidateAnswer,
    resetInterviewSession,
    setActiveTab,
    generateCareerRoadmap,
  } = usePlacement();

  const [candidateAnswer, setCandidateAnswer] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Setup Web Speech API if supported
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          if (transcript) {
            setCandidateAnswer(prev => prev + (prev.length > 0 ? ' ' : '') + transcript);
          }
        };

        recognition.onerror = (e: any) => {
          console.warn('Speech recognition warning:', e);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const toggleSpeechRecognition = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser window. Please type your response.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error('Speech recognition failed to start', err);
      }
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [interviewHistory, currentQuestion, isGeneratingQuestion, isEvaluatingAnswer]);

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateAnswer.trim() || isEvaluatingAnswer) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    const answer = candidateAnswer.trim();
    setCandidateAnswer('');
    await submitCandidateAnswer(answer);
  };

  const stageLabels = [
    { num: 1, label: 'Introduction' },
    { num: 2, label: 'Resume Questions' },
    { num: 3, label: 'Technical Questions' },
    { num: 4, label: 'Project Deep Dive' },
    { num: 5, label: 'Behavioral Questions' },
  ];

  if (!candidateProfile) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
          <Mic className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Candidate Profile Required</h2>
        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
          The AI Interview Coach personalizes every question to your actual candidate projects and technical skills.
        </p>
        <button
          onClick={() => setActiveTab('resume-analyzer')}
          className="mt-5 inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs"
        >
          <span>Upload Resume First</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  const currentRole = selectedRole || (suggestedRoles.length > 0 ? suggestedRoles[0].role_name : 'Software Developer');

  return (
    <div className="space-y-8 pb-16 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <Mic className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              AI Interview Coach
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Personalized 5-stage placement simulation grounded in your verified projects and target role.
          </p>
        </div>

        {interviewHistory.length > 0 && (
          <button
            onClick={() => {
              if (window.confirm('Restart current interview session?')) {
                resetInterviewSession();
                startInterviewSession(currentRole);
              }
            }}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 self-start"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restart Session</span>
          </button>
        )}
      </div>

      {/* Configuration Bar: Role, Difficulty & Type */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Target Role Selector */}
        <div className="flex items-center space-x-2">
          <Target className="w-4 h-4 text-indigo-600 shrink-0" />
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Target Role</label>
            <select
              value={currentRole}
              disabled={interviewHistory.length > 0}
              onChange={e => setSelectedRole(e.target.value)}
              className="text-xs font-semibold text-slate-800 bg-transparent border-0 focus:ring-0 p-0 cursor-pointer disabled:cursor-not-allowed"
            >
              {suggestedRoles.length > 0 ? (
                suggestedRoles.map((r, i) => (
                  <option key={i} value={r.role_name}>
                    {r.role_name} ({r.compatibility_percentage}% match)
                  </option>
                ))
              ) : (
                <option value="Software Developer">Software Developer</option>
              )}
            </select>
          </div>
        </div>

        {/* Difficulty Selector */}
        <div className="flex items-center space-x-2">
          <Sliders className="w-4 h-4 text-slate-400 shrink-0" />
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Difficulty</label>
            <div className="flex space-x-1 mt-0.5">
              {(['Beginner', 'Intermediate', 'Advanced'] as InterviewDifficulty[]).map(d => (
                <button
                  key={d}
                  disabled={interviewHistory.length > 0}
                  onClick={() => setInterviewDifficulty(d)}
                  className={`px-2.5 py-0.5 rounded-md text-xs font-semibold transition-colors ${
                    interviewDifficulty === d
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-50'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Interview Type Selector */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Track Type</label>
          <div className="flex space-x-1 mt-0.5">
            {(['Mixed', 'Technical', 'Resume-based', 'HR / Behavioral'] as InterviewType[]).map(t => (
              <button
                key={t}
                disabled={interviewHistory.length > 0}
                onClick={() => setInterviewType(t)}
                className={`px-2.5 py-0.5 rounded-md text-xs font-semibold transition-colors ${
                  interviewType === t
                    ? 'bg-indigo-100 text-indigo-800'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-50'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 5-Stage Interactive Progress Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs">
        <div className="grid grid-cols-5 gap-2">
          {stageLabels.map(s => {
            const isDone = interviewHistory.some(h => h.stage === s.num);
            const isCurrent = interviewStage === s.num && !interviewReport;

            return (
              <div
                key={s.num}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  isDone
                    ? 'bg-emerald-50/80 border-emerald-300 text-emerald-900'
                    : isCurrent
                    ? 'bg-indigo-50 border-indigo-300 ring-2 ring-indigo-200 font-bold text-indigo-900'
                    : 'bg-slate-50 border-slate-200/60 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-center space-x-1 mb-1">
                  {isDone ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <span className="text-[10px] font-mono font-bold">Stage {s.num}</span>
                  )}
                </div>
                <p className="text-[11px] truncate font-medium">{s.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* If No Active Session Yet */}
      {interviewHistory.length === 0 && !currentQuestion && !isGeneratingQuestion && (
        <div className="bg-white rounded-2xl p-10 border border-slate-200 text-center shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
            <Mic className="w-7 h-7" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            Ready to Practice for {currentRole}?
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
            The AI interviewer will ask questions referencing your projects ({candidateProfile.projects?.[0]?.title || 'Resume projects'}),
            skills ({candidateProfile.programming_languages?.join(', ')}), and assess your response in real-time.
          </p>
          <button
            onClick={() => startInterviewSession(currentRole)}
            className="mt-6 inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
          >
            <Play className="w-4 h-4" />
            <span>Begin Mock Placement Interview</span>
          </button>
        </div>
      )}

      {/* Active Conversation & Question/Answer Container */}
      {(interviewHistory.length > 0 || currentQuestion || isGeneratingQuestion) && !interviewReport && (
        <div className="space-y-6">
          {/* History of Past Exchanges with Feedback */}
          {interviewHistory.map((exchange, idx) => (
            <div key={exchange.id} className="space-y-4">
              {/* Interviewer Question Box */}
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 text-xs font-bold shadow-xs">
                  AI
                </div>
                <div className="flex-1 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between text-[11px] text-indigo-700 font-semibold mb-1">
                    <span>Stage {exchange.stage}: {exchange.stage_name}</span>
                    <span className="text-slate-400 font-normal">Round #{idx + 1}</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-900 leading-relaxed">
                    {exchange.question}
                  </p>
                </div>
              </div>

              {/* Candidate Answer Box */}
              <div className="flex items-start justify-end space-x-3">
                <div className="flex-1 max-w-2xl bg-indigo-50/70 rounded-2xl p-4 sm:p-5 border border-indigo-100/80">
                  <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block mb-1">
                    Your Response:
                  </span>
                  <p className="text-xs text-slate-800 leading-relaxed font-normal">
                    {exchange.candidate_answer}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0 text-xs font-bold">
                  You
                </div>
              </div>

              {/* Structured Feedback Card */}
              {exchange.feedback && (
                <div className="ml-11 bg-slate-50 rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-indigo-600" />
                      <span className="text-xs font-bold text-slate-900">Real-time Answer Feedback</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800">
                      Score: {exchange.feedback.score}/10
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    {/* Correct aspects */}
                    <div className="p-3 bg-white rounded-xl border border-emerald-100">
                      <span className="text-emerald-800 font-bold block mb-1">✓ Correct Aspects:</span>
                      <ul className="space-y-1">
                        {(exchange.feedback.strengths || []).map((c: string, i: number) => (
                          <li key={i} className="text-slate-600 flex items-start space-x-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Missing points */}
                    <div className="p-3 bg-white rounded-xl border border-amber-100">
                      <span className="text-amber-800 font-bold block mb-1">⚠ Missing Points:</span>
                      <ul className="space-y-1">
                        {(exchange.feedback.weaknesses || []).map((m: string, i: number) => (
                          <li key={i} className="text-slate-600 flex items-start space-x-1.5">
                            <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                            <span>{m}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Ideal Answer & Follow-up */}
                  <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100/70 text-xs">
                    <span className="text-indigo-950 font-bold block mb-1">Ideal Placement Answer:</span>
                    <p className="text-slate-700 italic leading-relaxed">
                      {exchange.feedback.ideal_answer || exchange.feedback.model_answer_tip || exchange.feedback.concise_feedback}
                    </p>
                    {exchange.feedback.follow_up_question && (
                      <div className="mt-2 pt-2 border-t border-indigo-100">
                        <span className="font-semibold text-slate-900">Recommended Follow-up to Prep: </span>
                        <span className="text-slate-600">{exchange.feedback.follow_up_question}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Current Live Question */}
          {currentQuestion && (
            <div className="flex items-start space-x-3 animate-in fade-in duration-200">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 text-xs font-bold shadow-xs">
                AI
              </div>
              <div className="flex-1 bg-white rounded-2xl p-5 border border-indigo-200 ring-1 ring-indigo-300/40 shadow-xs">
                <div className="flex items-center justify-between text-[11px] text-indigo-700 font-semibold mb-1">
                  <span>Stage {interviewStage}: {stageLabels.find(s => s.num === interviewStage)?.label}</span>
                  <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold">
                    Awaiting Your Answer
                  </span>
                </div>
                <p className="text-sm font-bold text-slate-900 leading-relaxed">
                  {currentQuestion}
                </p>
                {currentQuestionContext && (
                  <p className="text-[11px] text-slate-400 mt-2 italic">
                    Focus: {currentQuestionContext}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Question Generation Skeleton Loading */}
          {isGeneratingQuestion && (
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 text-xs font-bold animate-pulse">
                AI
              </div>
              <div className="flex-1 bg-white rounded-2xl p-5 border border-slate-200 text-xs text-slate-500 flex items-center space-x-2">
                <RefreshCw className="w-4 h-4 animate-spin text-indigo-600" />
                <span>Interviewer is analyzing your response and formulating the next question...</span>
              </div>
            </div>
          )}

          {/* Answer Input Box */}
          {currentQuestion && !isEvaluatingAnswer && (
            <form onSubmit={handleSubmitAnswer} className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">Type or Speak Your Answer:</span>
                <span className="text-slate-400 text-[11px]">
                  {candidateAnswer.length} characters
                </span>
              </div>

              <textarea
                rows={4}
                value={candidateAnswer}
                onChange={e => setCandidateAnswer(e.target.value)}
                placeholder="Structure your answer clearly (STAR method recommended for projects & behavioral rounds)..."
                className="w-full text-xs rounded-xl border border-slate-200 p-3.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-hidden bg-slate-50/50"
              />

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={toggleSpeechRecognition}
                  className={`inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                    isListening
                      ? 'bg-rose-50 border-rose-300 text-rose-700 animate-pulse'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                  title="Speech to Text"
                >
                  {isListening ? <MicOff className="w-3.5 h-3.5 text-rose-600" /> : <Mic className="w-3.5 h-3.5 text-slate-600" />}
                  <span>{isListening ? 'Listening...' : 'Voice Answer'}</span>
                </button>

                <button
                  type="submit"
                  disabled={!candidateAnswer.trim() || isEvaluatingAnswer}
                  className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs disabled:opacity-50 transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Answer</span>
                </button>
              </div>
            </form>
          )}

          {isEvaluatingAnswer && (
            <div className="p-5 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex items-center justify-center space-x-3 text-xs text-indigo-900 font-medium">
              <RefreshCw className="w-4 h-4 animate-spin text-indigo-600" />
              <span>Scoring technical accuracy, communication, and project alignment...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      )}

      {/* FINAL INTERVIEW REPORT (Displayed upon finishing 5 rounds) */}
      {interviewReport && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-8 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="flex items-center space-x-2">
                <Award className="w-6 h-6 text-indigo-600" />
                <h2 className="text-2xl font-bold text-slate-900">Placement Interview Final Report</h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Evaluated for <strong className="text-slate-700">{currentRole}</strong> across all 5 structured rounds.
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <div className="text-right">
                <span className="text-3xl font-black text-slate-900">
                  {interviewReport.overall_performance}
                </span>
                <span className="text-xs font-bold text-slate-400">/100</span>
                <span className="block text-[10px] text-slate-400 uppercase font-bold">Overall Score</span>
              </div>
            </div>
          </div>

          {/* 4 Dimension Scorecards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400">Technical Knowledge</span>
              <div className="text-2xl font-black text-indigo-600 mt-1">
                {interviewReport.technical_knowledge}/100
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400">Communication Clarity</span>
              <div className="text-2xl font-black text-sky-600 mt-1">
                {interviewReport.communication}/100
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400">Project Understanding</span>
              <div className="text-2xl font-black text-emerald-600 mt-1">
                {interviewReport.project_understanding}/100
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400">Role Readiness Score</span>
              <div className="text-2xl font-black text-purple-600 mt-1">
                {interviewReport.readiness_score || interviewReport.overall_performance}/100
              </div>
            </div>
          </div>

          {/* Strengths & Weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl bg-emerald-50/40 border border-emerald-100">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-2">
                Demonstrated Strengths
              </span>
              <ul className="space-y-1.5">
                {(interviewReport.strong_areas || []).map((str: string, i: number) => (
                  <li key={i} className="text-xs text-slate-700 flex items-start space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-xl bg-amber-50/40 border border-amber-100">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block mb-2">
                Critical Topics to Revise
              </span>
              <ul className="space-y-1.5">
                {interviewReport.topics_to_revise.map((topic, i) => (
                  <li key={i} className="text-xs text-slate-700 flex items-start space-x-2">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Interconnection Notice & Roadmap CTA */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-900 to-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <h3 className="text-base font-bold">Feedback Fed Back into Candidate Profile</h3>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Weak areas identified during this interview have been added to your profile's skill gaps.
                Review your personalized 30/60/90-Day Placement Roadmap!
              </p>
            </div>

            <div className="flex items-center space-x-3 shrink-0">
              <button
                onClick={() => {
                  resetInterviewSession();
                  startInterviewSession(currentRole);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-white border border-white/20 transition-all cursor-pointer"
              >
                Retake Interview
              </button>
              <button
                onClick={() => {
                  generateCareerRoadmap();
                  setActiveTab('career-roadmap');
                }}
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-500 hover:bg-indigo-400 text-white shadow-md transition-all cursor-pointer"
              >
                <span>View Career Roadmap</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
