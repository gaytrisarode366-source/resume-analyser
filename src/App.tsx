/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PlacementProvider, usePlacement } from './context/PlacementContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Navbar } from './components/Navbar';
import { PipelineBanner } from './components/PipelineBanner';
import { DashboardView } from './components/DashboardView';
import { ResumeAnalyzerView } from './components/ResumeAnalyzerView';
import { RoleSuggestionView } from './components/RoleSuggestionView';
import { InterviewCoachView } from './components/InterviewCoachView';
import { CareerRoadmapView } from './components/CareerRoadmapView';
import { CandidateProfileView } from './components/CandidateProfileView';
import { ApplicationsView } from './components/ApplicationsView';
import { Sparkles, ShieldCheck, Heart } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab } = usePlacement();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      {activeTab === 'dashboard' && <DashboardView />}
      {activeTab === 'resume-analyzer' && <ResumeAnalyzerView />}
      {activeTab === 'role-suggestion' && <RoleSuggestionView />}
      {activeTab === 'interview-coach' && <InterviewCoachView />}
      {activeTab === 'career-roadmap' && <CareerRoadmapView />}
      {activeTab === 'profile' && <CandidateProfileView />}
      {activeTab === 'applications' && <ApplicationsView />}
    </main>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <PlacementProvider>
        <div className="min-h-screen bg-slate-50/70 text-slate-800 font-sans flex flex-col selection:bg-indigo-500 selection:text-white">
          {/* Navigation Bar */}
          <Navbar />

          {/* Global 5-Step Pipeline Flow Banner */}
          <PipelineBanner />

          {/* Main Content Area */}
          <div className="flex-1">
            <MainContent />
          </div>

          {/* Footer */}
          <footer className="mt-auto border-t border-slate-200 bg-white py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 rounded-md bg-indigo-600 flex items-center justify-center text-white text-[10px] font-bold">
                  <Sparkles className="w-3 h-3" />
                </div>
                <span className="font-semibold text-slate-700">AI Placement Agent</span>
                <span>— From Resume to Role to Interview</span>
              </div>

              <div className="flex items-center space-x-4 text-[11px]">
                <span className="flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Zero-Hallucination Resume Extraction</span>
                </span>
                <span>•</span>
                <span>Built for Engineering Students & Campus Drives</span>
              </div>
            </div>
          </footer>
        </div>
      </PlacementProvider>
    </ErrorBoundary>
  );
}
