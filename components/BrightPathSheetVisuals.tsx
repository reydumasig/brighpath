'use client';

import React, { useState } from 'react';

type TabKey = 'newHires' | 'dspOrientation';

type OwnerKey = 'emma' | 'isaac' | 'recruiter' | 'scheduler' | 'system';

const ownerStyles: Record<OwnerKey, string> = {
  emma: 'bg-rose-500/90 text-white',
  isaac: 'bg-amber-400/90 text-slate-900',
  recruiter: 'bg-sky-500/90 text-white',
  scheduler: 'bg-emerald-400/90 text-slate-900',
  system: 'bg-slate-700/90 text-slate-100',
};

const ownerLabel: Record<OwnerKey, string> = {
  emma: 'Emma (HR)',
  isaac: 'Isaac (Training)',
  recruiter: 'Recruiters (JazzHR)',
  scheduler: 'Secellia (Scheduler)',
  system: 'System-Generated / Read-Only',
};

type BubbleProps = {
  title: string;
  bullets: string[];
  owner: OwnerKey;
};

const DataBubble: React.FC<BubbleProps> = ({ title, bullets, owner }) => {
  return (
    <div className="group relative max-w-sm">
      <div className="rounded-2xl bg-slate-900/80 border border-slate-700/70 px-5 py-4 shadow-lg shadow-slate-900/60 backdrop-blur-sm transition-transform duration-150 group-hover:-translate-y-0.5">
        <div className="flex items-center justify-between gap-2 mb-2">
          <h4 className="text-sm font-semibold text-slate-100">{title}</h4>
          <span
            className={`text-xs px-2.5 py-1 rounded-full font-semibold uppercase tracking-wide ${ownerStyles[owner]}`}
          >
            {ownerLabel[owner]}
          </span>
        </div>
        <ul className="text-sm text-slate-300 space-y-1 mt-2">
          {bullets.map((b) => (
            <li key={b} className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-slate-400 flex-shrink-0" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="absolute inset-0 rounded-2xl bg-indigo-500/0 group-hover:bg-indigo-500/10 blur opacity-0 group-hover:opacity-100 pointer-events-none transition" />
    </div>
  );
};

type LaneProps = {
  systemLabel: string;
  systemSub?: string;
  bubbles: BubbleProps[];
};

const Lane: React.FC<LaneProps> = ({ systemLabel, systemSub, bubbles }) => (
  <div className="grid grid-cols-[160px,1fr] border-t border-slate-800 last:border-b">
    {/* Left rail = system name */}
    <div className="bg-slate-900/90 px-5 py-7 flex flex-col justify-center gap-2 border-r border-slate-800">
      <div className="text-sm font-semibold tracking-wide text-slate-100 uppercase">{systemLabel}</div>
      {systemSub && <div className="text-xs text-slate-400 leading-snug">{systemSub}</div>}
    </div>
    {/* Right rail = bubbles */}
    <div className="px-5 py-6">
      {bubbles.length === 0 ? (
        <div className="text-sm text-slate-500 italic">
          No direct data written here for this tracker (read-only or future integration).
        </div>
      ) : (
        <div className="flex flex-wrap gap-5">
          {bubbles.map((b) => (
            <DataBubble key={b.title} {...b} />
          ))}
        </div>
      )}
    </div>
  </div>
);

const LegendChip: React.FC<{ owner: OwnerKey }> = ({ owner }) => (
  <div className="flex items-center gap-2 text-sm">
    <span className={`h-4 w-4 rounded-full border border-slate-900 ${ownerStyles[owner]}`} />
    <span className="text-slate-300">{ownerLabel[owner]}</span>
  </div>
);

const OnboardingSwimlane: React.FC = () => {
  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <p className="text-sm tracking-[0.22em] uppercase text-slate-500">BrightPath • New Hire Data Map</p>
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
          New Onboarding Tracker Summary View
        </h2>
        <p className="text-base text-slate-300 max-w-3xl leading-relaxed">
          High level overview that captures source data and owner
        </p>
      </header>

      {/* Legend */}
      <section className="bg-slate-900/70 border border-slate-800 rounded-2xl px-5 py-4 flex flex-wrap gap-5 items-center">
        <div className="text-sm font-semibold text-slate-400 uppercase tracking-wide">
          Legend – Bubble Owner
        </div>
        <LegendChip owner="recruiter" />
        <LegendChip owner="emma" />
        <LegendChip owner="isaac" />
        <LegendChip owner="scheduler" />
        <LegendChip owner="system" />
      </section>

      {/* Swimlanes */}
      <section className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950/60 shadow-[0_0_40px_rgba(15,23,42,0.8)]">
        <Lane
          systemLabel="JazzHR"
          systemSub="Source of hire details & offer"
          bubbles={[
            {
              title: 'Offer & Hire Details',
              owner: 'recruiter',
              bullets: [
                'Candidate name & contact',
                'Offer details & program (Resi / UBS)',
                'Proposed start date',
                'Position / role',
              ],
            },
            {
              title: 'System Record',
              owner: 'system',
              bullets: [
                'Historical application data',
                'Notes & communication log',
                'Stage history (Offer Sent / Accepted)',
              ],
            },
          ]}
        />

        <Lane
          systemLabel="New Hire Onboarding Tracker"
          systemSub="“Updated New Hires” sheet"
          bubbles={[
            {
              title: 'Core Hire Row',
              owner: 'emma',
              bullets: [
                'Name, email, phone',
                'Program, primary site',
                'Supervisor / manager',
                'Start date & status (Offer, Docs, Cleared)',
              ],
            },
            {
              title: 'Readiness Signal (GREEN)',
              owner: 'isaac',
              bullets: [
                'Marks who actually showed up to Day-1 orientation',
                'Triggers downstream training & staffing updates',
              ],
            },
          ]}
        />

        <Lane
          systemLabel="Staffing Tracker"
          systemSub="Residential & UBS staffing patterns"
          bubbles={[
            {
              title: 'Staffing Pattern Fields',
              owner: 'scheduler',
              bullets: [
                'Location & home assignment',
                'Hired weekly hours',
                'Shift type (day/eve/overnight)',
                'Float / open shift indicators',
              ],
            },
            {
              title: 'Lookup for Other Teams',
              owner: 'system',
              bullets: [
                'Used by Training to confirm primary site',
                'Used by HR when assigning supervisor',
              ],
            },
          ]}
        />

        <Lane
          systemLabel="When I Work"
          systemSub="Scheduling & live-session dates"
          bubbles={[
            {
              title: 'Orientation & Contact Dates',
              owner: 'isaac',
              bullets: [
                'Orientation to individual needs',
                'First supervised direct contact',
                'First unsupervised direct contact',
              ],
            },
            {
              title: 'Schedule Placement',
              owner: 'scheduler',
              bullets: [
                'Monthly schedule & coverage',
                'Shift assignments once GREEN',
                'PTO / float adjustments',
              ],
            },
          ]}
        />

        <Lane
          systemLabel="CHR / HRIS (TBD lane)"
          systemSub="Final system of record"
          bubbles={[
            {
              title: 'Employment Record',
              owner: 'emma',
              bullets: [
                'Demographics & pay rate',
                'Site & supervisor stored long-term',
                'Background clearance record attached',
              ],
            },
            {
              title: 'Training Alignment',
              owner: 'system',
              bullets: [
                'Should mirror Master Training Tracker',
                'Used for audits & compliance reporting',
              ],
            },
          ]}
        />
      </section>
    </div>
  );
};

type NodeProps = {
  title: string;
  subtitle?: string;
  variant?: 'source' | 'sheet' | 'downstream';
};

const Node: React.FC<NodeProps> = ({ title, subtitle, variant = 'sheet' }) => {
  const base = 'rounded-2xl px-4 py-3 shadow-md text-sm min-w-[180px] max-w-xs border';
  const variants: Record<typeof variant, string> = {
    source: 'bg-sky-900/60 border-sky-500/60 text-sky-50 shadow-sky-900/40',
    sheet: 'bg-slate-900/70 border-slate-600 text-slate-50 shadow-slate-900/40',
    downstream: 'bg-emerald-900/60 border-emerald-500/60 text-emerald-50 shadow-emerald-900/40',
  };

  return (
    <div className={base + ' ' + variants[variant]}>
      <div className="text-xs font-semibold uppercase tracking-wide opacity-70 mb-1">
        {variant === 'source'
          ? 'Upstream Source'
          : variant === 'sheet'
          ? 'Tracker Section'
          : 'Downstream Consumer'}
      </div>
      <div className="text-sm font-semibold leading-snug">{title}</div>
      {subtitle && <div className="text-xs mt-1 opacity-80 whitespace-pre-line">{subtitle}</div>}
    </div>
  );
};

const Arrow: React.FC<{ label?: string }> = ({ label }) => (
  <div className="flex flex-col items-center justify-center mx-2">
    <div className="h-px w-10 bg-slate-600" />
    <div className="text-lg leading-none -mt-3">➜</div>
    {label && (
      <div className="text-[10px] uppercase tracking-wide text-slate-400 mt-1 text-center max-w-[80px]">
        {label}
      </div>
    )}
  </div>
);

const SectionTitle: React.FC<{ title: string; description?: string }> = ({ title, description }) => (
  <div className="mb-3">
    <h3 className="text-sm font-semibold text-slate-100">{title}</h3>
    {description && <p className="text-xs text-slate-400 max-w-xl mt-1">{description}</p>}
  </div>
);

const BrightPathSheetVisuals: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('newHires');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-72 border-b md:border-b-0 md:border-r border-slate-800 bg-slate-900/80 backdrop-blur-md p-4 flex flex-col gap-4">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">BrightPath Sheet Visuals</h1>
          <p className="text-xs text-slate-400 mt-1">
            Simplistic visuals for Lynn based on <span className="font-semibold">Updated New Hires</span> &{' '}
            <span className="font-semibold">DSP Orientation record sheet</span>.
          </p>
        </div>

        <nav className="flex flex-row md:flex-col gap-2 mt-2">
          <button
            onClick={() => setActiveTab('newHires')}
            className={`flex-1 text-left px-3 py-2 rounded-lg text-xs md:text-sm transition ${
              activeTab === 'newHires'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-700/40'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/60'
            }`}
          >
            New Hire Onboarding
            <div className="text-[10px] text-slate-200/80">“Updated New Hires” sheet</div>
          </button>

          <button
            onClick={() => setActiveTab('dspOrientation')}
            className={`flex-1 text-left px-3 py-2 rounded-lg text-xs md:text-sm transition ${
              activeTab === 'dspOrientation'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-700/40'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/60'
            }`}
          >
            Recommendations
            <div className="text-[10px] text-slate-200/80">Data normalization & BP_ID</div>
          </button>
        </nav>

        <div className="mt-auto pt-3 border-t border-slate-800 text-[11px] text-slate-500">
          <p>S360 • Pathfinder Ops</p>
          <p>Visuals aligned with Lane’s “simplistic” request.</p>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-5 md:p-8 overflow-y-auto">
        {activeTab === 'newHires' ? <OnboardingSwimlane /> : <OnboardingRecommendation />}
      </main>
    </div>
  );
};

type RoleKey = 'hr' | 'pathfinder' | 'consumer';

const roleStyles: Record<RoleKey, string> = {
  hr: 'bg-rose-500/90 text-white',
  pathfinder: 'bg-indigo-500/90 text-white',
  consumer: 'bg-slate-700/90 text-slate-100',
};

const roleLabel: Record<RoleKey, string> = {
  hr: 'HR Owner',
  pathfinder: 'Pathfinder Ops',
  consumer: 'Consumer System / Team',
};

const RolePill: React.FC<{ role: RoleKey }> = ({ role }) => (
  <span
    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${roleStyles[role]}`}
  >
    {roleLabel[role]}
  </span>
);

type SystemNodeProps = {
  name: string;
  role: RoleKey;
  bullets: string[];
  align?: 'left' | 'right' | 'top' | 'bottom';
};

const SystemNode: React.FC<SystemNodeProps> = ({ name, role, bullets, align = 'left' }) => {
  const base =
    'w-64 rounded-2xl bg-slate-900/90 border border-slate-700/70 shadow-lg shadow-slate-900/60 px-5 py-4';

  return (
    <div className={base}>
      <div className="flex justify-between items-center gap-2 mb-2">
        <div className="font-semibold text-slate-100 text-sm">{name}</div>
        <RolePill role={role} />
      </div>
      <ul className="text-sm text-slate-300 space-y-1 mt-2">
        {bullets.map((b) => (
          <li key={b} className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-slate-400 flex-shrink-0" />
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const OnboardingRecommendation: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="space-y-3">
        <p className="text-sm tracking-[0.22em] uppercase text-slate-500">
          BrightPath • Data Normalization Recommendation
        </p>
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
          Single Source of Truth with a Master Employee ID
        </h2>
        <p className="text-base text-slate-300 max-w-3xl leading-relaxed">
          To reduce double entry and conflicting data across JazzHR, New Hire Tracker, Staffing Patterns, Training,
          When I Work, and CHR, we recommend introducing a single unique identifier (
          <span className="font-semibold">BP_ID</span>) and a <span className="font-semibold">Master Person Registry</span>. All
          other sheets reference this ID instead of retyping the same fields in many places.
        </p>
      </header>

      {/* Goals card */}
      <section className="grid md:grid-cols-3 gap-5">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl px-5 py-4">
          <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wide mb-2">Normalization Goals</h2>
          <ul className="list-disc list-inside text-slate-300 text-base space-y-2 leading-relaxed">
            <li>Stop retyping the same hire data in 3–5 trackers.</li>
            <li>Ensure every system refers to the same person consistently.</li>
            <li>Make reporting, automation, and audits much easier.</li>
          </ul>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl px-5 py-4">
          <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wide mb-2">BP_ID – Master Identifier</h2>
          <ul className="list-disc list-inside text-slate-300 text-base space-y-2 leading-relaxed">
            <li>Created once by HR / Pathfinder when hire is confirmed.</li>
            <li>Lives in a single master table: "Master Person Registry".</li>
            <li>Never edited once assigned; all systems reference it.</li>
          </ul>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl px-5 py-4">
          <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wide mb-2">Ownership & Process</h2>
          <ul className="list-disc list-inside text-slate-300 text-base space-y-2 leading-relaxed">
            <li>HR (Emma) or Pathfinder owns creation of BP_ID.</li>
            <li>Other trackers may only select an existing BP_ID; they cannot create new ones.</li>
            <li>Lookups (e.g., XLOOKUP) pull name/site/supervisor from the master registry, not manual typing.</li>
          </ul>
        </div>
      </section>

      {/* Visual Diagram */}
      <section className="bg-slate-950/70 border border-slate-800 rounded-3xl px-4 md:px-8 py-8 shadow-[0_0_45px_rgba(15,23,42,0.9)]">
        <h2 className="text-base font-semibold text-slate-100 mb-6">Visual – Master Person Registry with BP_ID</h2>
        <div className="relative min-h-[900px] grid grid-cols-1 md:grid-cols-3 md:grid-rows-3 gap-8 items-center justify-items-center py-8">
          {/* Top center - Staffing Pattern */}
          <div className="md:col-start-2 md:row-start-1">
            <SystemNode
              align="top"
              name="Staffing Pattern + When I Work"
              role="consumer"
              bullets={[
                'Each row uses BP_ID as key for the staff member.',
                'Site, hours, and scheduled shifts map back to Master.',
                'Prevents "same person twice" in different staffing sheets.',
              ]}
            />
          </div>

          {/* Left center - JazzHR */}
          <div className="md:col-start-1 md:row-start-2">
            <SystemNode
              align="left"
              name="JazzHR (ATS)"
              role="consumer"
              bullets={[
                'Keeps its own internal Candidate ID.',
                'When offer is accepted, HR/Pathfinder creates BP_ID and links it.',
                'Later reports can join JazzHR data ↔ Master via BP_ID.',
              ]}
            />
          </div>

          {/* Center - Master Person Registry */}
          <div className="md:col-start-2 md:row-start-2 z-10">
            <div className="w-80 rounded-3xl bg-indigo-600 text-white px-6 py-5 shadow-2xl shadow-indigo-900/70 border border-indigo-300/50">
              <div className="text-xs uppercase tracking-wide opacity-80 mb-2">Single Source of Truth</div>
              <div className="text-lg font-semibold mb-2">Master Person Registry</div>
              <p className="text-sm mt-2 text-indigo-50/90 leading-relaxed">
                One row per employee with <span className="font-semibold">BP_ID</span> as the primary key.
              </p>
              <ul className="text-sm mt-3 space-y-1.5">
                <li>• BP_ID (e.g., BP-2025-00123)</li>
                <li>• Legal name</li>
                <li>• Email & phone</li>
                <li>• Program, primary site</li>
                <li>• Primary supervisor</li>
                <li>• Hire/Start dates</li>
              </ul>
              <div className="mt-4 flex flex-wrap gap-2">
                <RolePill role="hr" />
                <RolePill role="pathfinder" />
              </div>
            </div>
          </div>

          {/* Right center - New Hire Tracker */}
          <div className="md:col-start-3 md:row-start-2">
            <SystemNode
              align="right"
              name="New Hire Onboarding Tracker"
              role="consumer"
              bullets={[
                'Contains BP_ID instead of retyping full name + contact.',
                'Other columns (paperwork, background status) reference BP_ID.',
                'Training / Scheduling pull from this tracker by BP_ID.',
              ]}
            />
          </div>

          {/* Bottom center - Master Training */}
          <div className="md:col-start-2 md:row-start-3">
            <SystemNode
              align="bottom"
              name="Master Training / DSP Orientation / CHR"
              role="consumer"
              bullets={[
                'Training events stored by BP_ID + date + type.',
                'CHR profile created using BP_ID so audits can join tables.',
                'Compliance reports rely on BP_ID to combine data accurately.',
              ]}
            />
          </div>
        </div>
      </section>

      {/* Next steps */}
      <section className="text-base text-slate-300 space-y-2">
        <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wide mb-3">Suggested next steps</h2>
        <ol className="list-decimal list-inside space-y-3 leading-relaxed">
          <li>
            Create a simple "Master Person Registry" sheet with BP_ID and core identity fields; make HR/Pathfinder the
            only editors.
          </li>
          <li>
            Add a <code className="bg-slate-900 px-2 py-0.5 rounded text-sm">BP_ID</code> column to Updated New Hires, Staffing Pattern,
            Master Training, and any other major trackers.
          </li>
          <li>
            Replace manual typing of names/site/supervisor with lookups based on BP_ID (e.g., XLOOKUP or data
            validation dropdown).
          </li>
          <li>
            In future automation, use BP_ID as the key when moving data between systems (e.g., into CHR or reporting
            dashboards).
          </li>
        </ol>
      </section>
    </div>
  );
};

export default BrightPathSheetVisuals;

