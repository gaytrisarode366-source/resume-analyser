import React, { useState } from 'react';
import { usePlacement } from '../context/PlacementContext';
import {
  Briefcase,
  Plus,
  Trash2,
  Calendar,
  Building2,
  MapPin,
  CheckCircle2,
  Clock,
  Award,
  Filter,
  ArrowRight
} from 'lucide-react';
import { JobApplicationTracker } from '../types';

export const ApplicationsView: React.FC = () => {
  const {
    applications,
    addApplication,
    updateApplicationStatus,
    deleteApplication,
    selectedRole,
    candidateProfile,
    setActiveTab,
  } = usePlacement();

  const [showAddModal, setShowAddModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('All');

  const [company, setCompany] = useState('');
  const [role, setRole] = useState(selectedRole || 'Software Developer');
  const [location, setLocation] = useState('Bangalore / Hybrid');
  const [status, setStatus] = useState<JobApplicationTracker['status']>('Applied');
  const [matchScore, setMatchScore] = useState<number>(85);
  const [notes, setNotes] = useState('');

  const handleCreateApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !role.trim()) return;

    addApplication({
      company: company.trim(),
      role: role.trim(),
      location: location.trim(),
      status,
      matchScore: Number(matchScore) || 80,
      notes: notes.trim(),
    });

    setCompany('');
    setNotes('');
    setShowAddModal(false);
  };

  const filtered = filterStatus === 'All'
    ? applications
    : applications.filter(a => a.status === filterStatus);

  const statuses: JobApplicationTracker['status'][] = ['Applied', 'Screening', 'Interview', 'Offer', 'Rejected'];

  return (
    <div className="space-y-8 pb-16 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
              <Briefcase className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Placement Application Tracker
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Track campus drives, off-campus referrals, and interview milestones in sync with your candidate profile.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors self-start cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Track New Company</span>
        </button>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {['All', 'Applied', 'Screening', 'Interview', 'Offer'].map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filterStatus === st
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {st} ({st === 'All' ? applications.length : applications.filter(a => a.status === st).length})
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-400">
          Total active drives: <strong>{applications.length}</strong>
        </span>
      </div>

      {/* Applications Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(app => (
          <div
            key={app.id}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{app.company}</h3>
                  <p className="text-xs text-indigo-700 font-medium mt-0.5">{app.role}</p>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    app.status === 'Interview'
                      ? 'bg-amber-100 text-amber-800'
                      : app.status === 'Offer'
                      ? 'bg-emerald-100 text-emerald-800'
                      : app.status === 'Screening'
                      ? 'bg-sky-100 text-sky-800'
                      : app.status === 'Rejected'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {app.status}
                </span>
              </div>

              <div className="flex items-center space-x-2 text-[11px] text-slate-500 mt-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{app.location}</span>
                <span>•</span>
                <span>Applied {app.appliedDate}</span>
              </div>

              {app.notes && (
                <p className="text-xs text-slate-600 mt-3 p-2.5 rounded-lg bg-slate-50 border border-slate-100 leading-relaxed">
                  {app.notes}
                </p>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <select
                value={app.status}
                onChange={e => updateApplicationStatus(app.id, e.target.value as any)}
                className="text-[11px] font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg py-1 px-2 cursor-pointer outline-hidden"
              >
                {statuses.map(s => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              <button
                onClick={() => deleteApplication(app.id)}
                className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                title="Delete entry"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-12 text-center bg-white rounded-2xl border border-slate-200">
          <Briefcase className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-xs text-slate-500">No applications found under this status filter.</p>
        </div>
      )}

      {/* Add Application Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-slate-900 mb-1">Track Placement Application</h3>
            <p className="text-xs text-slate-500 mb-4">
              Log a new company drive or referral to keep your schedule organized.
            </p>

            <form onSubmit={handleCreateApplication} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  value={company}
                  onChange={e => setCompany(e.target.value)}
                  placeholder="e.g. Microsoft, Google, Infosys, Zomato"
                  className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:border-indigo-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Role Title</label>
                <input
                  type="text"
                  required
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  placeholder="e.g. Graduate Software Engineer"
                  className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:border-indigo-500 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    placeholder="e.g. Bangalore / Remote"
                    className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:border-indigo-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value as any)}
                    className="w-full text-xs rounded-xl border border-slate-300 p-2.5 bg-white focus:border-indigo-500 outline-hidden"
                  >
                    {statuses.map(s => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Notes / Rounds Info</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="e.g. Online assessment completed on HackerRank; awaiting technical interview..."
                  className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:border-indigo-500 outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
                >
                  Save Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
