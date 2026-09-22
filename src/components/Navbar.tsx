import React, { useState } from 'react';
import { usePlacement } from '../context/PlacementContext';
import { NavigationTab } from '../types';
import {
  Sparkles,
  FileText,
  Compass,
  Mic,
  MapPin,
  User,
  Briefcase,
  Bell,
  CheckCircle2,
  AlertCircle,
  Info,
  Download,
  RotateCcw,
  Menu,
  X,
  Target,
  FileCheck
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    selectedRole,
    candidateProfile,
    resumeAnalysis,
    notifications,
    markNotificationAsRead,
    clearNotifications,
    resetAllData,
  } = usePlacement();

  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const navItems: { id: NavigationTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: Sparkles },
    { id: 'resume-analyzer', label: 'Resume Analyzer', icon: FileText },
    { id: 'role-suggestion', label: 'Role Suggestion', icon: Compass },
    { id: 'interview-coach', label: 'Interview Coach', icon: Mic },
    { id: 'career-roadmap', label: 'Career Roadmap', icon: MapPin },
    { id: 'profile', label: 'Candidate Profile', icon: User },
    { id: 'applications', label: 'Applications', icon: Briefcase },
  ];

  const handlePrintExport = () => {
    window.print();
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-sky-500 flex items-center justify-center text-white shadow-md shadow-indigo-100">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight text-slate-900">AI Placement Agent</span>
                <span className="hidden sm:inline-flex px-2 py-0.5 text-[11px] font-semibold tracking-wide uppercase rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                  Campus AI Suite
                </span>
              </div>
              <p className="hidden md:block text-xs text-slate-500">
                From Resume to Role to Interview — One AI Career Assistant
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.id === 'resume-analyzer' && resumeAnalysis && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white"></span>
                  )}
                  {item.id === 'role-suggestion' && selectedRole && (
                    <span className="w-2 h-2 rounded-full bg-sky-500 ring-2 ring-white"></span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Header Status Badges & Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* ATS Score quick pill */}
            {resumeAnalysis?.ats_compatibility?.total !== undefined && (
              <div
                onClick={() => setActiveTab('resume-analyzer')}
                className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-full text-xs font-semibold cursor-pointer hover:bg-emerald-100 transition-colors"
                title="ATS Resume Compatibility Score"
              >
                <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>ATS {resumeAnalysis.ats_compatibility.total}%</span>
              </div>
            )}

            {/* Target Role quick pill */}
            {selectedRole && (
              <div
                onClick={() => setActiveTab('role-suggestion')}
                className="hidden md:flex items-center space-x-1.5 px-2.5 py-1 bg-sky-50 border border-sky-200 text-sky-800 rounded-full text-xs font-medium cursor-pointer hover:bg-sky-100 transition-colors max-w-[150px] truncate"
                title={`Target Role: ${selectedRole}`}
              >
                <Target className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                <span className="truncate">{selectedRole}</span>
              </div>
            )}

            {/* Export / Print Report */}
            {candidateProfile && (
              <button
                id="btn-export-report"
                onClick={handlePrintExport}
                className="hidden sm:flex items-center space-x-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors"
                title="Print or Save Career Report as PDF"
              >
                <Download className="w-3.5 h-3.5 text-slate-600" />
                <span>Export Report</span>
              </button>
            )}

            {/* Notification Bell */}
            <div className="relative">
              <button
                id="btn-notifications"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                aria-label="View notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white"></span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 py-3 px-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-sm text-slate-900">Placement Updates</span>
                      {unreadCount > 0 && (
                        <span className="px-1.5 py-0.5 text-[10px] font-bold bg-indigo-100 text-indigo-700 rounded-full">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    {notifications.length > 0 && (
                      <button
                        onClick={clearNotifications}
                        className="text-xs text-slate-400 hover:text-slate-600"
                      >
                        Clear all
                      </button>
                    )}
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-50 mt-1">
                    {notifications.length === 0 ? (
                      <div className="py-6 text-center text-xs text-slate-400">
                        No notifications yet.
                      </div>
                    ) : (
                      notifications.map(notif => {
                        let Icon = Info;
                        let iconColor = 'text-sky-500';
                        if (notif.type === 'success') {
                          Icon = CheckCircle2;
                          iconColor = 'text-emerald-500';
                        } else if (notif.type === 'warning') {
                          Icon = AlertCircle;
                          iconColor = 'text-amber-500';
                        }
                        return (
                          <div
                            key={notif.id}
                            onClick={() => markNotificationAsRead(notif.id)}
                            className={`py-2.5 px-2 rounded-lg cursor-pointer transition-colors ${
                              notif.read ? 'opacity-70 hover:bg-slate-50' : 'bg-indigo-50/40 hover:bg-indigo-50/70'
                            }`}
                          >
                            <div className="flex items-start space-x-2.5">
                              <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${iconColor}`} />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-slate-900">{notif.title}</p>
                                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{notif.message}</p>
                                <span className="text-[10px] text-slate-400 mt-1 block">{notif.timestamp}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Clear / Reset State Button */}
            {candidateProfile && (
              <button
                onClick={() => {
                  if (window.confirm('Reset all candidate profile and interview data to start fresh?')) {
                    resetAllData();
                    setActiveTab('dashboard');
                  }
                }}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                title="Reset session and start new resume analysis"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
