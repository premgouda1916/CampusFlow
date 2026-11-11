import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { analyticsService, applicationService, interviewService, jobService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  Award,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Activity,
  Layers,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Building2,
  Zap,
  Briefcase
} from 'lucide-react';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentApplications, setRecentApplications] = useState([]);
  const [upcomingInterviews, setUpcomingInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePartnerIndex, setActivePartnerIndex] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashRes, appsRes, intRes] = await Promise.all([
          analyticsService.getStudentDashboard(),
          applicationService.getMyApplications({ size: 4 }),
          interviewService.getMyInterviews({ size: 3 }),
        ]);
        setStats(dashRes.data);
        setRecentApplications(appsRes.data.content || []);
        setUpcomingInterviews(intRes.data.content || []);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const partners = [
    {
      id: 1,
      name: 'Google LLC',
      role: 'SDE - I Cloud',
      package: '18.5 LPA',
      location: 'Bengaluru',
      icon: 'G',
      gradient: 'from-amber-500/30 to-red-500/20',
      tag: 'Eligible',
    },
    {
      id: 2,
      name: 'Microsoft',
      role: 'Software Engineer',
      package: '24.0 LPA',
      location: 'Hyderabad',
      icon: 'M',
      gradient: 'from-blue-600/40 to-cyan-500/30',
      tag: 'Shortlisted',
      active: true,
    },
    {
      id: 3,
      name: 'Amazon AWS',
      role: 'Cloud Architect',
      package: '20.5 LPA',
      location: 'Bengaluru',
      icon: 'A',
      gradient: 'from-amber-600/30 to-orange-500/20',
      tag: 'Eligible',
    },
    {
      id: 4,
      name: 'Atlassian',
      role: 'Full Stack Engineer',
      package: '26.0 LPA',
      location: 'Bengaluru',
      icon: 'AT',
      gradient: 'from-blue-500/30 to-indigo-600/20',
      tag: 'Dream Company',
    },
  ];

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center p-12">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
          <span className="text-xs text-slate-400 font-medium tracking-wider uppercase">Loading Spatial Interface...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top 3-Column Spatial Grid (Directly Matching Reference Image Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* ================= COLUMN 1: 3D Holographic Core & Conditions (4 Cols) ================= */}
        <div className="lg:col-span-5 flex flex-col justify-between rounded-3xl spatial-panel p-5 sm:p-6 relative overflow-hidden min-h-[460px]">
          {/* Ambient Inner Glow */}
          <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-blue-600/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-rose-600/10 blur-3xl pointer-events-none" />

          {/* Large Bold Headline (Matching "Overview Conditions" in image) */}
          <div className="relative z-10 space-y-1">
            <h1 className="text-3xl sm:text-4xl font-extralight text-white tracking-tight leading-none">
              Overview
            </h1>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-none">
              Conditions
            </h2>
            <p className="text-xs text-slate-400 pt-1 font-medium">
              Campus Placement Season 2026-27 • <span className="text-blue-400 font-semibold">Active</span>
            </p>
          </div>

          {/* Central 3D Holographic Centerpiece (Echoing the anatomical 3D heart with concentric radar circles & sensor hotspots) */}
          <div className="relative my-6 flex items-center justify-center min-h-[220px]">
            {/* Concentric Animated Radar Rings */}
            <div className="absolute w-60 h-60 rounded-full border border-blue-500/20 animate-ping opacity-25" style={{ animationDuration: '4s' }} />
            <div className="absolute w-52 h-52 rounded-full border border-blue-400/25" />
            <div className="absolute w-40 h-40 rounded-full border border-dashed border-indigo-400/30 animate-spin" style={{ animationDuration: '30s' }} />
            <div className="absolute w-28 h-28 rounded-full bg-gradient-to-tr from-blue-600/20 to-rose-600/20 backdrop-blur-md" />

            {/* 3D Stylized Hologram Core Graphic */}
            <div className="relative z-10 w-36 h-36 rounded-3xl bg-gradient-to-br from-rose-500 via-red-600 to-indigo-700 p-0.5 shadow-2xl shadow-rose-900/50 flex items-center justify-center animate-float-slow transform rotate-3">
              <div className="w-full h-full rounded-[22px] bg-gradient-to-br from-rose-600 via-rose-700 to-indigo-950 flex flex-col items-center justify-center p-3 text-center text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.4),transparent_60%)]" />
                <Award className="w-10 h-10 text-white drop-shadow-md mb-1 relative z-10" />
                <span className="text-[11px] font-black uppercase tracking-wider text-rose-100 relative z-10">
                  Readiness
                </span>
                <span className="text-lg font-black tracking-tight text-white relative z-10">
                  {stats?.profileCompletionPercentage || 95}%
                </span>
              </div>

              {/* Pulsating Sensor Pins (Matching Hotspot Dots on the Heart in the Reference Image) */}
              <div className="absolute -top-1.5 left-4 w-3.5 h-3.5 rounded-full bg-white shadow-0 0 10px white flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
              </div>
              <div className="absolute top-10 -right-2 w-3.5 h-3.5 rounded-full bg-white shadow-0 0 10px white flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              </div>
              <div className="absolute -bottom-1 left-8 w-3.5 h-3.5 rounded-full bg-white shadow-0 0 10px white flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
              </div>
            </div>

            {/* Floating Glass Pulse Widget (Matching the Floating ECG card in bottom left of reference image) */}
            <div className="absolute left-1 bottom-0 z-20 px-3.5 py-2.5 rounded-2xl bg-black/60 backdrop-blur-2xl border border-white/20 shadow-spatial-card flex flex-col gap-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                <span className="text-[10px] uppercase font-bold text-slate-300 tracking-wider">Placement Pulse</span>
              </div>
              <div className="text-base font-bold text-white tracking-tight flex items-baseline gap-1">
                CGPA {stats?.cgpa || '8.85'}
                <span className="text-[10px] font-normal text-emerald-400">Verified ✓</span>
              </div>
              {/* Mini SVG Pulse Line */}
              <svg className="w-24 h-5 stroke-blue-400 fill-none" viewBox="0 0 100 20">
                <path d="M0,10 L25,10 L30,3 L35,17 L40,10 L55,10 L60,5 L65,15 L70,10 L100,10" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          {/* Quick Action Footer */}
          <div className="relative z-10 pt-2 flex items-center justify-between text-xs">
            <span className="text-slate-400">Target Dept: <strong className="text-white">CSE / ISE / AIML</strong></span>
            <Link
              to="/student/profile"
              className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 transition"
            >
              Edit Profile <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>


        {/* ================= COLUMN 2: My Placement Conditions (4 Cols) ================= */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          {/* Section Title with blue dot (Matching • My Heart Condition in image) */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 uppercase tracking-wider pl-1">
            <span className="w-2 h-2 rounded-full bg-blue-500 shadow-spatial-glow" />
            <span>My Placement Condition</span>
          </div>

          {/* 2x2 Spatial Grid (Matching 4 cards in reference image) */}
          <div className="grid grid-cols-2 gap-3">
            
            {/* Card 1: Academic Standing (With Bar Spectrum Visualizer) */}
            <div className="rounded-2xl spatial-panel p-4 flex flex-col justify-between min-h-[140px] spatial-panel-hover">
              <div>
                <span className="text-[11px] font-medium text-slate-400">Academic Standing</span>
                <div className="text-lg font-bold text-white mt-0.5 tracking-tight">
                  {stats?.cgpa ? `${stats.cgpa} / 10` : '8.85 / 10'}
                </div>
              </div>
              {/* Spectrum Equalizer Bars */}
              <div className="flex items-end gap-1 h-8 pt-2">
                {[40, 65, 85, 100, 90, 75, 95, 60].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-white/20 rounded-full"
                    style={{ height: `${h}%` }}
                  />
                ))}
                <span className="text-[10px] font-mono text-slate-400 ml-1">0 BL</span>
              </div>
            </div>

            {/* Card 2: THE VIBRANT ELECTRIC BLUE HIGHLIGHT CARD (Matching 120 bpm card in reference) */}
            <div className="rounded-2xl bg-blue-600 p-4 flex flex-col justify-between min-h-[140px] text-white shadow-spatial-glow border border-blue-400/40 relative overflow-hidden group">
              <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-white/20 blur-xl pointer-events-none" />
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-blue-100">Eligible Drives</span>
                  <Zap className="w-3.5 h-3.5 text-cyan-200 animate-pulse" />
                </div>
                <div className="text-2xl font-black mt-0.5 tracking-tight">
                  {stats?.eligibleJobsCount || 3}
                  <span className="text-xs font-normal text-blue-200 ml-1">Jobs</span>
                </div>
              </div>
              {/* Glowing SVG Pulse Wave */}
              <div className="pt-2">
                <svg className="w-full h-8 stroke-white fill-none opacity-90" viewBox="0 0 120 30">
                  <path d="M0,15 Q15,0 30,15 T60,15 T90,15 T120,15" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>

            {/* Card 3: Application Velocity (With Smooth Wave Visualizer) */}
            <div className="rounded-2xl spatial-panel p-4 flex flex-col justify-between min-h-[140px] spatial-panel-hover">
              <div>
                <span className="text-[11px] font-medium text-slate-400">Applications</span>
                <div className="text-lg font-bold text-white mt-0.5 tracking-tight">
                  {stats?.applicationsSubmitted || 4}
                  <span className="text-xs font-normal text-slate-400 ml-1">Active</span>
                </div>
              </div>
              {/* Smooth Sine Wave */}
              <div className="pt-2">
                <svg className="w-full h-7 stroke-slate-400 fill-none" viewBox="0 0 100 25">
                  <path d="M0,12 C20,2 40,22 60,12 C80,2 90,20 100,12" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
            </div>

            {/* Card 4: Offers Received */}
            <div className="rounded-2xl spatial-panel p-4 flex flex-col justify-between min-h-[140px] spatial-panel-hover">
              <div>
                <span className="text-[11px] font-medium text-slate-400">Offers Extended</span>
                <div className="text-lg font-bold text-emerald-400 mt-0.5 tracking-tight flex items-baseline gap-1">
                  {stats?.offersReceived || 1}
                  <span className="text-xs font-medium text-slate-300">(18.5 LPA)</span>
                </div>
              </div>
              {/* Ascending Trend Line */}
              <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400">
                <svg className="w-20 h-7 stroke-emerald-400 fill-none" viewBox="0 0 80 25">
                  <path d="M0,20 L25,18 L50,10 L75,3" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
                <span className="font-mono text-emerald-400">TOP 5%</span>
              </div>
            </div>

          </div>
        </div>


        {/* ================= COLUMN 3: My Schedule (3 Cols) ================= */}
        <div className="lg:col-span-3 flex flex-col gap-3">
          {/* Section Title with blue dot (Matching • My Schedule in image) */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 uppercase tracking-wider pl-1">
            <span className="w-2 h-2 rounded-full bg-blue-500 shadow-spatial-glow" />
            <span>My Schedule</span>
          </div>

          {/* Schedule Card Container */}
          <div className="rounded-3xl spatial-panel p-4 sm:p-5 flex flex-col justify-between min-h-[360px]">
            <div className="space-y-4">
              {/* Next Checkup / Interview Date Header */}
              <div className="flex items-start justify-between border-b border-white/[0.08] pb-3">
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-blue-400" /> Next Round
                  </span>
                  <div className="text-sm font-bold text-white">
                    {upcomingInterviews.length > 0
                      ? new Date(upcomingInterviews[0].scheduledTime).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
                      : 'Fri, 24 Nov'}
                  </div>
                </div>
              </div>

              {/* Date Nav Pill: < 20-Nov-26 > */}
              <div className="flex items-center justify-between px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs text-slate-300 font-medium">
                <button className="hover:text-white transition">
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] font-mono tracking-wider">20-Nov-26</span>
                <button className="hover:text-white transition">
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* List of Interviewers & Rounds (Matching the 3 doctors in the reference image) */}
              <div className="space-y-2.5">
                {[
                  { name: 'Dr. Vikram Aditya', role: 'Google Tech Lead', avatar: 'VA', time: '14:30 PM' },
                  { name: 'Ananya Deshmukh', role: 'Microsoft Principal Architect', avatar: 'AD', time: '16:00 PM' },
                  { name: 'Dr. Johan Fraz', role: 'System Design Evaluator', avatar: 'JF', time: '18:00 PM' },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-white/[0.05] transition cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-700 to-slate-600 border border-white/20 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                      {item.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-white truncate">{item.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">{item.role}</div>
                    </div>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/[0.06] text-blue-300 border border-white/10">
                      {item.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Vibrant Blue Pill Action Button (Matching "Consult Now ->" in reference image) */}
            <div className="pt-4">
              <Link
                to="/student/interviews"
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold tracking-wide flex items-center justify-center gap-2 shadow-spatial-glow transition"
              >
                <span>View My Interviews</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

      </div>


      {/* ================= BOTTOM ROW: Top Recruiting Drives & Partners ================= */}
      {/* (Directly matching "• My Body Condition" with organ carousel cards at bottom of reference image) */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 uppercase tracking-wider pl-1">
            <span className="w-2 h-2 rounded-full bg-blue-500 shadow-spatial-glow" />
            <span>Target Recruiting Partners & Placement Drives</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <button className="p-1 rounded-lg hover:bg-white/10 hover:text-white transition">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-1 rounded-lg hover:bg-white/10 hover:text-white transition">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Horizontal Row of Spatial Frosted Glass Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          {partners.map((partner, index) => {
            const isSelected = activePartnerIndex === index;
            return (
              <div
                key={partner.id}
                onClick={() => {
                  setActivePartnerIndex(index);
                  navigate('/student/jobs');
                }}
                className={`rounded-2xl p-4 flex flex-col justify-between min-h-[145px] cursor-pointer transition-all relative overflow-hidden group ${
                  isSelected
                    ? 'spatial-panel border-blue-500/50 shadow-spatial-glow bg-white/[0.07]'
                    : 'spatial-panel spatial-panel-hover'
                }`}
              >
                {/* Subtle Gradient Backlight */}
                <div className={`absolute inset-0 bg-gradient-to-br ${partner.gradient} opacity-40 group-hover:opacity-70 transition`} />

                {/* Top Company Info */}
                <div className="relative z-10 flex items-start justify-between">
                  <div className="w-9 h-9 rounded-xl bg-black/40 border border-white/20 flex items-center justify-center font-black text-sm text-white shadow-inner">
                    {partner.icon}
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/10 text-slate-200 border border-white/10 backdrop-blur-md">
                    {partner.tag}
                  </span>
                </div>

                {/* Bottom Company & Package Details + Arrow Pill */}
                <div className="relative z-10 flex items-end justify-between pt-3">
                  <div>
                    <h3 className="text-xs font-bold text-white group-hover:text-blue-300 transition truncate max-w-[110px]">
                      {partner.name}
                    </h3>
                    <div className="text-[11px] text-emerald-400 font-bold">
                      {partner.package}
                    </div>
                  </div>

                  {/* 1-Click Spatial Arrow Indicator */}
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs transition ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-spatial-glow'
                      : 'bg-white/10 text-slate-300 group-hover:bg-blue-600 group-hover:text-white'
                  }`}>
                    ↗
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
