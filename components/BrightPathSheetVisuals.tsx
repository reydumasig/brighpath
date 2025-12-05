'use client';

import React, { useState } from 'react';

type TabKey = 'newHires' | 'dspOrientation' | 'masterTraining' | 'staffingPattern' | 'overview';

type OwnerKey = 'emma' | 'isaac' | 'recruiter' | 'scheduler' | 'system' | 'supervisor';

const ownerStyles: Record<OwnerKey, string> = {
  emma: 'bg-rose-500/90 text-white',
  isaac: 'bg-amber-400/90 text-slate-900',
  recruiter: 'bg-sky-500/90 text-white',
  scheduler: 'bg-emerald-400/90 text-slate-900',
  system: 'bg-slate-700/90 text-slate-100',
  supervisor: 'bg-purple-500/90 text-white',
};

const ownerLabel: Record<OwnerKey, string> = {
  emma: 'Emma (HR)',
  isaac: 'Isaac (Training)',
  recruiter: 'Recruiters (JazzHR)',
  scheduler: 'Secellia (Scheduler)',
  system: 'System-Generated / Read-Only',
  supervisor: 'Supervisor / Program Leadership',
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
          High level overview showing columns, their owners, data sources, and data types for the New Hire Onboarding Tracker
        </p>
      </header>

      {/* Legend */}
      <section className="bg-slate-900/70 border border-slate-800 rounded-2xl px-5 py-4 flex flex-wrap gap-5 items-center">
        <div className="text-sm font-semibold text-slate-400 uppercase tracking-wide">
          Legend – Column Owner
        </div>
        <LegendChip owner="recruiter" />
        <LegendChip owner="emma" />
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
              owner: 'emma',
              bullets: [
                'Historical application data',
                'Notes & communication log',
                'Stage history (Offer Sent / Accepted)',
              ],
            },
          ]}
        />

        <Lane
          systemLabel="Email / DocuSign"
          systemSub="Source of handbook acknowledgement"
          bubbles={[
            {
              title: 'Handbook Acknowledgement',
              owner: 'emma',
              bullets: [
                'Sent via email / DocuSign',
                'Stored in Google Drive',
                'Eventually moves to CHR',
              ],
            },
          ]}
        />

        <Lane
          systemLabel="DHS / NetStudy"
          systemSub="Source of background check status"
          bubbles={[
            {
              title: 'Background Check Results',
              owner: 'emma',
              bullets: [
                'Pass / Pending / More Info Required status',
                'Fingerprint scheduling notifications',
                'Temporary vs. full clearance status',
                'Email notifications to HR Inbox',
              ],
            },
          ]}
        />

        <Lane
          systemLabel="Staffing Pattern"
          systemSub="Source of location and staffing assignment"
          bubbles={[
            {
              title: 'Staffing Pattern Data',
              owner: 'emma',
              bullets: [
                'Location / Supervisor assignment',
                'Added to Staffing Pattern status',
                'Primary owners: Tyler Baker & Jeremy Garrigan',
                'Residential goes by site, UBS/IHS goes by supervisor',
              ],
            },
          ]}
        />

        <Lane
          systemLabel="When I Work"
          systemSub="Source of WIW ID and CHR password"
          bubbles={[
            {
              title: 'When I Work Integration',
              owner: 'emma',
              bullets: [
                'WIW ID entry',
                'CHR password change',
                'Integration with CHR system',
              ],
            },
          ]}
        />

        <Lane
          systemLabel="Checker"
          systemSub="External system for MVR requests"
          bubbles={[
            {
              title: 'Motor Vehicle Record',
              owner: 'emma',
              bullets: [
                'MVR request processing',
                'External system integration',
                'Run MVR status tracking',
              ],
            },
          ]}
        />

        <Lane
          systemLabel="CHR (HRIS System)"
          systemSub="Final system of record"
          bubbles={[
            {
              title: 'CHR System Data',
              owner: 'emma',
              bullets: [
                'Employee profile setup',
                'Clearance file uploads',
                'I-9 storage (moving to E-Verify)',
                'G-Suite account creation',
                'Personnel folder storage',
              ],
            },
          ]}
        />

        <Lane
          systemLabel="New Hire Onboarding Tracker"
          systemSub="Copy of New Hire Onboarding Employee Tracker - Updated New Hires"
          bubbles={[
            {
              title: 'Basic Information (JazzHR)',
              owner: 'emma',
              bullets: [
                'Date of Hire - Source: JazzHR and can be find in Column (B1) of the New Hire Onboarding Tracker',
                'Name - Source: JazzHR and can be find in Column (C1) of the New Hire Onboarding Tracker',
                'Phone - Source: JazzHR and can be find in Column (D1) of the New Hire Onboarding Tracker',
                'Position - Source: JazzHR and can be find in Column (E1) of the New Hire Onboarding Tracker',
              ],
            },
            {
              title: 'Staffing Pattern Columns',
              owner: 'emma',
              bullets: [
                'Location / Supervisor - Source: Staffing Pattern and can be find in Column (F1) of the New Hire Onboarding Tracker',
                'Added to Staffing Pattern? - Source: Staffing Pattern and can be find in Column (G1) of the New Hire Onboarding Tracker',
              ],
            },
            {
              title: 'JazzHR Documents',
              owner: 'emma',
              bullets: [
                'Signed Job Offer - Source: JazzHR and can be find in Column (H1) of the New Hire Onboarding Tracker',
                'Signed Job Description - Source: JazzHR and can be find in Column (I1) of the New Hire Onboarding Tracker',
                'Resume - Source: JazzHR and can be find in Column (J1) of the New Hire Onboarding Tracker',
                'Degree/Diploma - Source: JazzHR and can be find in Column (K1) of the New Hire Onboarding Tracker',
                'Transcripts - Source: JazzHR and can be find in Column (L1) of the New Hire Onboarding Tracker',
              ],
            },
            {
              title: 'Email/DocuSign Documents',
              owner: 'emma',
              bullets: [
                'Handbook Acknowledgement Form - Source: Email/DocuSign → Drive → CHR and can be find in Column (M1) of the New Hire Onboarding Tracker',
              ],
            },
            {
              title: 'Background Check (NetStudy/DHS)',
              owner: 'emma',
              bullets: [
                'BGS Submitted - Source: NetStudy / DHS and can be find in Column (N1) of the New Hire Onboarding Tracker',
                'Date Submitted - Source: NetStudy / DHS and can be find in Column (O1) of the New Hire Onboarding Tracker',
                'BGS Status - Source: NetStudy / DHS and can be find in Column (O1) of the New Hire Onboarding Tracker',
                'Prints needed? - Source: NetStudy / DHS and can be find in Column (P1) of the New Hire Onboarding Tracker',
              ],
            },
            {
              title: 'JazzHR Onboarding Bundle',
              owner: 'emma',
              bullets: [
                'Consent and Disclosure - Source: JazzHR (onboarding bundle) and can be find in Column (Q1) of the New Hire Onboarding Tracker',
                'EE Info - Source: JazzHR (onboarding bundle) and can be find in Column (T1) of the New Hire Onboarding Tracker',
                'Emergency Contacts - Source: JazzHR (onboarding bundle) and can be find in Column (U1) of the New Hire Onboarding Tracker',
                'EEO-1 - Source: JazzHR (onboarding bundle) and can be find in Column (V1) of the New Hire Onboarding Tracker',
                'MN W-4 - Source: JazzHR (onboarding bundle) and can be find in Column (W1) of the New Hire Onboarding Tracker',
                'Fed W-4 - Source: JazzHR (onboarding bundle) and can be find in Column (X1) of the New Hire Onboarding Tracker',
                'MVR Release - Source: JazzHR (onboarding bundle) and can be find in Column (Y1) of the New Hire Onboarding Tracker',
              ],
            },
            {
              title: 'Clearance & I-9',
              owner: 'emma',
              bullets: [
                'Clearance in Employee File - Source: NetStudy → CHR (uploads) and can be find in Column (R1) of the New Hire Onboarding Tracker',
                'Completed I9 - Source: Paper → CHR (E-Verify coming) and can be find in Column (S1) of the New Hire Onboarding Tracker',
              ],
            },
            {
              title: 'Additional JazzHR Columns',
              owner: 'emma',
              bullets: [
                'False Doc - Source: JazzHR and can be find in Column (Z1) of the New Hire Onboarding Tracker',
                'Auto Policy Acknowledgement - Source: JazzHR or email and can be find in Column (AA1) of the New Hire Onboarding Tracker',
                'Wage Disclosure - Source: JazzHR and can be find in Column (AB1) of the New Hire Onboarding Tracker',
                'Copy of Auto Ins - Source: JazzHR and can be find in Column (AC1) of the New Hire Onboarding Tracker',
                'Ins Exp Date - Source: JazzHR and can be find in Column (AD1) of the New Hire Onboarding Tracker',
                'Policy Received? - Source: JazzHR and can be find in Column (AE1) of the New Hire Onboarding Tracker',
              ],
            },
            {
              title: 'Internal Process Columns',
              owner: 'emma',
              bullets: [
                'G-Suite Created? - Source: CHR / internal process and can be find in Column (AF1) of the New Hire Onboarding Tracker',
                'Run MVR - Source: Checker (external system) and can be find in Column (AG1) of the New Hire Onboarding Tracker',
                'Phone $ (Admin Only) - Source: JazzHR and can be find in Column (AH1) of the New Hire Onboarding Tracker',
                'Personnel Folder - Source: Google Drive → moving to CHR and can be find in Column (AI1) of the New Hire Onboarding Tracker',
                'CHR - Source: CHR (HRIS system) and can be find in Column (AJ1) of the New Hire Onboarding Tracker',
                'WIW ID + CHR pass - Source: When I Work + CHR and can be find in Column (AK1) of the New Hire Onboarding Tracker',
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

const MasterTrainingSwimlane: React.FC = () => {
  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <p className="text-sm tracking-[0.22em] uppercase text-slate-500">BrightPath • Training Data Map</p>
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
          Master Training Tracker Summary View
        </h2>
        <p className="text-base text-slate-300 max-w-4xl">
          High level overview that captures source data and owner for the{' '}
          <span className="font-semibold">Master Training Tracker - DSP Orientation record</span> sheet.
        </p>
      </header>

      {/* Legend */}
      <section className="bg-slate-900/70 border border-slate-800 rounded-2xl px-5 py-4 flex flex-wrap gap-5 items-center">
        <div className="text-sm font-semibold text-slate-400 uppercase tracking-wide">
          Legend – Column Owner
        </div>
        <LegendChip owner="isaac" />
        <LegendChip owner="emma" />
      </section>

      {/* Swimlanes */}
      <section className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950/60 shadow-[0_0_40px_rgba(15,23,42,0.8)]">
        <Lane
          systemLabel="New Hire Onboarding Tracker"
          systemSub="Source of basic employee information"
          bubbles={[
            {
              title: 'Basic Information',
              owner: 'isaac',
              bullets: [
                'Name (Text) - Source: New Hire Onboarding Tracker and can be find in Column (A1) of the Master Training Tracker',
                'Primary Site (Text) - Source: New Hire Onboarding Tracker and can be find in Column (B1) of the Master Training Tracker',
                'Date of hire (Date) - Source: New Hire Onboarding Tracker and can be find in Column (C1) of the Master Training Tracker',
              ],
            },
          ]}
        />

        <Lane
          systemLabel="Staffing Tracker / Word of Mouth"
          systemSub="Source of staffing assignment information"
          bubbles={[
            {
              title: 'Staffing Information',
              owner: 'isaac',
              bullets: [
                'Primary Site details from Staffing tracker or word of mouth',
              ],
            },
          ]}
        />

        <Lane
          systemLabel="Isaac (Training Team)"
          systemSub="Isaac tracks orientation dates during Date of Show"
          bubbles={[
            {
              title: 'Orientation Tracking',
              owner: 'isaac',
              bullets: [
                'Date of orientation to individual needs (Date) - Isaac tracks during Date of Show and can be find in Column (D1) of the Master Training Tracker',
                'Date of first supervised direct contact (Date) - Isaac tracks and can be find in Column (E1) of the Master Training Tracker',
                'Date of first unsupervised direct contact (Date) - Isaac tracks and can be find in Column (F1) of the Master Training Tracker',
                'I flip it to green in the new hire tracker',
              ],
            },
          ]}
        />

        <Lane
          systemLabel="When I Work"
          systemSub="Source of scheduling and shift information"
          bubbles={[
            {
              title: 'Scheduling Data',
              owner: 'isaac',
              bullets: [
                'Live Sessions tracking - Source: When I Work',
                'Scheduling information - Source: When I Work',
              ],
            },
          ]}
        />

        <Lane
          systemLabel="NetStudy / DHS"
          systemSub="Source of background check status"
          bubbles={[
            {
              title: 'Background Check Data',
              owner: 'emma',
              bullets: [
                'Date BGS submitted (Date) - Source: NetStudy and can be find in Column (G1) of the Master Training Tracker',
                'Date cleared BGS received from DHS (Date) - Source: NetStudy and can be find in Column (H1) of the Master Training Tracker',
                'BGS Clearance Receive on file (Boolean) - Source: NetStudy and can be find in Column (I1) of the Master Training Tracker',
                'BGS variance or set aside? (Text) - Source: NetStudy and can be find in Column (J1) of the Master Training Tracker',
                'Background study submitted through NetStudy',
              ],
            },
          ]}
        />

        <Lane
          systemLabel="DocuSign"
          systemSub="Source of signed orientation records"
          bubbles={[
            {
              title: 'Orientation Records',
              owner: 'isaac',
              bullets: [
                '245D staff Orientation Record signed on file (Boolean) - Source: DocuSign and can be find in Column (P1) of the Master Training Tracker',
                '245D Staff Orientation records (Text) - Source: DocuSign and can be find in Column (Q1) of the Master Training Tracker',
                'Part of onsite training, detail coming from docusign',
              ],
            },
          ]}
        />

        <Lane
          systemLabel="Calculated / Internal Process"
          systemSub="Derived from other columns or internal calculations"
          bubbles={[
            {
              title: 'Calculated Fields',
              owner: 'isaac',
              bullets: [
                '60 day deadline (Date) - Calculated: From Date of hire + 60 days',
                'Med Certificate on file and completed within 60 days of hire (Boolean) - Internal process',
              ],
            },
          ]}
        />

        <Lane
          systemLabel="Admin / Email"
          systemSub="Source of administrative documents and communications"
          bubbles={[
            {
              title: 'Administrative Data',
              owner: 'isaac',
              bullets: [
                'PDF paperworks - Admin send email to Isaac with their PDFs in it',
                'Email/Contact from Ker (QA Email)',
              ],
            },
          ]}
        />

        <Lane
          systemLabel="LMS (Learning Management System)"
          systemSub="Source of online training module completions"
          bubbles={[
            {
              title: 'Online Training Modules',
              owner: 'isaac',
              bullets: [
                'Orientation Presentation Acknowledgement (UBS) - Source: LMS',
                'Children\'s Mental Health (Brunswick) - Source: LMS',
                'Fetal Alcohol Spectrum Disorder (Brunswick) - Source: LMS',
                'MN Data Privacy/HIPAA - Source: LMS',
                'Service Recipient Rights - Source: LMS',
                'Maltreatment of Minors and Vulnerable Adults - Source: LMS',
                'Person-Centered Practices - Source: LMS',
                'First Aid - Source: LMS',
                'Anti-Fraud/Fraud Prevention - Source: LMS',
                'EUMR and Prohibited Procedures - Source: LMS',
                'Positive Supports Rule Core - Source: LMS',
                'OSHA Universal Precautions/Bloodborne Pathogens - Source: LMS',
                'Minimizing the Risk of Sexual Violence - Source: LMS',
                'Specialized Medical Equipment - Source: LMS',
                'Suicide Prevention - Source: LMS',
                'Crisis Response - Source: LMS',
                'Activities of Daily Living (ADL) - Source: LMS',
                'Instrumental Activities of Daily Living (IADL) - Source: LMS',
                'Healthy Diet - Source: LMS',
                'Online Modules staff are completing',
              ],
            },
          ]}
        />

        <Lane
          systemLabel="Star Services"
          systemSub="Source of parent license and affiliation information"
          bubbles={[
            {
              title: 'License & Affiliation Data',
              owner: 'isaac',
              bullets: [
                'Parent license (UBS and Crisis) 91097629 - Source: Star services and can be find in Column (J1) of the Master Training Tracker',
                'Oliver Affiliation? 1116211 - Source: Star services and can be find in Column (K1) of the Master Training Tracker',
                '157th Affiliation? 1118740 - Source: Star services and can be find in Column (L1) of the Master Training Tracker',
                'Brunswick Affiliation? 1120227 - Source: Star services and can be find in Column (M1) of the Master Training Tracker',
                '92nd Affiliation? 1127654 - Source: Star services and can be find in Column (N1) of the Master Training Tracker',
              ],
            },
          ]}
        />

        <Lane
          systemLabel="Master Training Tracker"
          systemSub="Copy of Master Training Tracker - DSP Orientation record"
          bubbles={[
            {
              title: 'Onsite Orientation',
              owner: 'isaac',
              bullets: [
                'Onsite orientation Oliver (Boolean) - Source: Internal tracking',
                'Onsite orientation 157th (Boolean) - Source: Internal tracking',
                'Onsite Orientation Crisis (Boolean) - Source: Internal tracking',
                'Onsite orientation Brunswick (Boolean) - Source: Internal tracking',
                'Onsite orienation 92nd (Boolean) - Source: Internal tracking',
              ],
            },
            {
              title: 'OINs (Orientation to Individual Needs)',
              owner: 'isaac',
              bullets: [
                'OINs signed and completed for all clients worked - Brunswick (Boolean)',
                'OINs signed and completed for all clients worked - 157th (Boolean)',
                'OINs signed and completed for all clients worked - Oliver (Boolean)',
                'OINs signed and completed for all clients worked - Crisis (Boolean)',
                'UBS OINs completed (new hire) (Boolean)',
              ],
            },
            {
              title: 'Other Fields',
              owner: 'isaac',
              bullets: [
                'Notes (Text) - Source: Internal notes',
                'Training Verification Record completed by Compliance (Boolean) - Source: Internal process',
              ],
            },
          ]}
        />
      </section>

      <p className="text-sm text-slate-500">
        Tip: This view shows all sources that feed into the Master Training Tracker and who owns each data element.
      </p>
    </div>
  );
};

const StaffingPatternSwimlane: React.FC = () => {
  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <p className="text-sm tracking-[0.22em] uppercase text-slate-500">BrightPath • Staffing Data Map</p>
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
          Staffing Pattern Summary View
        </h2>
        <p className="text-base text-slate-300 max-w-4xl">
          High level overview that captures source data and owner for the{' '}
          <span className="font-semibold">UBS Staffing Pattern (IHS Staffing)</span> and{' '}
          <span className="font-semibold">Residential Staffing Pattern (BT Staffing Hours)</span> sheets.
        </p>
      </header>

      {/* Legend */}
      <section className="bg-slate-900/70 border border-slate-800 rounded-2xl px-5 py-4 flex flex-wrap gap-5 items-center">
        <div className="text-sm font-semibold text-slate-400 uppercase tracking-wide">
          Legend – Column Owner
        </div>
        <LegendChip owner="emma" />
        <LegendChip owner="scheduler" />
        <LegendChip owner="recruiter" />
        <LegendChip owner="supervisor" />
      </section>

      {/* Swimlanes */}
      <section className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950/60 shadow-[0_0_40px_rgba(15,23,42,0.8)]">
        <Lane
          systemLabel="New Hire Tracker / HR Onboarding"
          systemSub="Source of basic employee information"
          bubbles={[
            {
              title: 'Basic Information (UBS IHS)',
              owner: 'emma',
              bullets: [
                'Staff Name (Text) - Source: HR onboarding, New Hire Tracker and can be find in Column (A1) of the UBS Staffing Pattern',
                'Hire Date (Date) - Source: HR / Training and can be find in Column (B1) of the UBS Staffing Pattern',
                'Secellia: "I only add staff after HR puts them in New Hire Tracker."',
              ],
            },
            {
              title: 'Basic Information (Residential BT)',
              owner: 'scheduler',
              bullets: [
                'Staff name (Text) - Source: New Hire Tracker (from HR/Training) and can be find in Column (A1) of the Residential Staffing Pattern',
                'Phone number (Text) - Source: New Hire Tracker (entered by HR/Training) and can be find in Column (B1) of the Residential Staffing Pattern',
                'Updated weekly after Tuesday orientation',
              ],
            },
          ]}
        />

        <Lane
          systemLabel="JazzHR"
          systemSub="Source of job offer and position details"
          bubbles={[
            {
              title: 'Job Offer Data (UBS IHS)',
              owner: 'scheduler',
              bullets: [
                'Position (Text) - Source: JazzHR job offer and can be find in Column (C1) of the UBS Staffing Pattern',
                'Hours Available to Work (Number) - Source: JazzHR (validated by Secellia) and can be find in Column (D1) of the UBS Staffing Pattern',
                'Scheduled/Hired Hours (Number) - Source: JazzHR job offer and can be find in Column (E1) of the UBS Staffing Pattern',
                'Secellia: "Their hired hours come from JazzHR — I just make sure it matches."',
              ],
            },
            {
              title: 'Job Offer Data (Residential BT)',
              owner: 'scheduler',
              bullets: [
                'Primary Location (Text) - Source: JazzHR job offer (primary location listed in the offer) and can be find in Column (D1) of the Residential Staffing Pattern',
                'Hours (Number) - Source: JazzHR job offer and can be find in Column (E1) of the Residential Staffing Pattern',
                'She does not rely on Recruiting\'s verbal numbers; she checks the actual signed offer',
              ],
            },
          ]}
        />

        <Lane
          systemLabel="HR / Training"
          systemSub="Source of hire date and orientation information"
          bubbles={[
            {
              title: 'Hire & Orientation Data',
              owner: 'emma',
              bullets: [
                'Hire Date (Date) - Source: HR / Training',
                'Secellia: "HR gives me the hire date and I only schedule after Orientation."',
                '"Orientation date and hire date come from HR." → HR decides the hire date; Secellia does not set it.',
              ],
            },
          ]}
        />

        <Lane
          systemLabel="Supervisor / Program Leadership"
          systemSub="Source of supervisor assignment and staff evaluation"
          bubbles={[
            {
              title: 'Supervisor Data (UBS IHS)',
              owner: 'supervisor',
              bullets: [
                'Direct Supervisor (Text) - Source: Supervisor assignment and can be find in Column (F1) of the UBS Staffing Pattern',
                'Owner: IHS Program Leadership',
                'Transcript: "Supervisors let me know when staff move programs."',
              ],
            },
            {
              title: 'Supervisor Evaluation (UBS IHS)',
              owner: 'supervisor',
              bullets: [
                'Other Notes (Text) - Source: Supervisor notes + scheduling notes and can be find in Column (L1) of the UBS Staffing Pattern',
                'Skills/preferences used for matching clients come from direct supervisors',
                'Transcript: "Those notes are usually from the supervisor or I add something for scheduling."',
              ],
            },
          ]}
        />

        <Lane
          systemLabel="HR Demographic Forms"
          systemSub="Source of demographic and residence information"
          bubbles={[
            {
              title: 'Demographic Data (UBS IHS)',
              owner: 'emma',
              bullets: [
                'County of Residence (Text) - Source: HR demographic forms and can be find in Column (G1) of the UBS Staffing Pattern',
                'City of Residence (Text) - Source: HR demographic forms and can be find in Column (H1) of the UBS Staffing Pattern',
                'Staff Gender (Text) - Source: HR demographic forms and can be find in Column (I1) of the UBS Staffing Pattern',
                'This comes from HR documents — I don\'t collect address info." — Secellia',
                'HR onboarding collects residence details',
                'HR collects gender from onboarding; not editable by Scheduling',
              ],
            },
          ]}
        />

        <Lane
          systemLabel="Onboarding Forms"
          systemSub="Source of allergies and background information"
          bubbles={[
            {
              title: 'Additional Information (UBS IHS)',
              owner: 'emma',
              bullets: [
                'Allergies (Text) - Source: Onboarding forms + Supervisor updates',
                'Background information - Source: Onboarding forms + Supervisor updates',
                'Allergies come from HR paperwork, but sometimes supervisors update it',
                'Transcript: "Supervisors know their background… I don\'t fill that out." — Secellia',
              ],
            },
          ]}
        />

        <Lane
          systemLabel="Master Residential Staffing Pattern"
          systemSub="Reference for staffing pattern inclusion"
          bubbles={[
            {
              title: 'Pattern Inclusion (Residential BT)',
              owner: 'scheduler',
              bullets: [
                'Added to Staffing Pattern? (Boolean) - Source: Master Residential Staffing Pattern tab and can be find in Column (F1) of the Residential Staffing Pattern',
                'Indicates whether this staff member\'s hours are already included in the Master Residential Staffing Pattern (Yes/No)',
              ],
            },
          ]}
        />

        <Lane
          systemLabel="Secellia (Scheduler)"
          systemSub="Scheduler verification and finalization"
          bubbles={[
            {
              title: 'Scheduler Verification (Residential BT)',
              owner: 'scheduler',
              bullets: [
                'Availability Complete? (Boolean) - Source: Secellia finalizes this after HR confirms Day 1 attendance and can be find in Column (G1) of the Residential Staffing Pattern',
                'Indicator of whether Secellia has verified:',
                '  • Correct availability',
                '  • Correct hours',
                '  • Correct primary location',
                '  • Confirmed orientation attendance',
                '  • Cleared to schedule',
              ],
            },
            {
              title: 'Availability Tracking (Residential BT)',
              owner: 'scheduler',
              bullets: [
                'Availability (Text) - Source: New Hire Tracker (availability noted during intake) Confirmed against JazzHR job offer and can be find in Column (C1) of the Residential Staffing Pattern',
                'Secellia mentioned that availability sometimes changes and must be manually verified',
              ],
            },
          ]}
        />

        <Lane
          systemLabel="QA Team"
          systemSub="Source of QA metrics and numbers"
          bubbles={[
            {
              title: 'QA Data (Residential BT)',
              owner: 'scheduler',
              bullets: [
                'QA metrics - Source: QA team (Claudia, Rebecca)',
                'Secellia stated that QA always sends her these numbers and she does not calculate them herself',
              ],
            },
          ]}
        />

        <Lane
          systemLabel="UBS Staffing Pattern (IHS)"
          systemSub="Copy of UBS Staffing Pattern - Current IHS Staffing"
          bubbles={[
            {
              title: 'IHS Staffing Columns',
              owner: 'scheduler',
              bullets: [
                'Staff Name (Text) - Owner: Emma and can be find in Column (A1) of the UBS Staffing Pattern',
                'Hire Date (Date) - Owner: Emma and can be find in Column (B1) of the UBS Staffing Pattern',
                'Position (Text) - Owner: Emma/Recruiting and can be find in Column (C1) of the UBS Staffing Pattern',
                'Hours Available to Work (Number) - Owner: Secellia and can be find in Column (D1) of the UBS Staffing Pattern',
                'Scheduled/Hired Hours (Number) - Owner: Emma/Recruiting and can be find in Column (E1) of the UBS Staffing Pattern',
                'Direct Supervisor (Text) - Owner: IHS Program Leadership and can be find in Column (F1) of the UBS Staffing Pattern',
                'County of Residence (Text) - Owner: Emma and can be find in Column (G1) of the UBS Staffing Pattern',
                'City of Residence (Text) - Owner: Emma and can be find in Column (H1) of the UBS Staffing Pattern',
                'Staff Gender (Text) - Owner: Emma and can be find in Column (I1) of the UBS Staffing Pattern',
                'Other Notes (Text) - Owner: Supervisor and can be find in Column (L1) of the UBS Staffing Pattern',
                'Contact Information (Text) - Owner: Supervisor and can be find in Column (M1) of the UBS Staffing Pattern',
              ],
            },
          ]}
        />

        <Lane
          systemLabel="Residential Staffing Pattern (BT)"
          systemSub="Copy of Residential Staffing Pattern - Current BT Staffing Hours"
          bubbles={[
            {
              title: 'BT Staffing Columns',
              owner: 'scheduler',
              bullets: [
                'Staff name (Text) - Owner: Secellia and can be find in Column (A1) of the Residential Staffing Pattern',
                'Phone number (Text) - Owner: Secellia and can be find in Column (B1) of the Residential Staffing Pattern',
                'Availability (Text) - Owner: Secellia and can be find in Column (C1) of the Residential Staffing Pattern',
                'Primary Location (Text) - Owner: Secellia and can be find in Column (D1) of the Residential Staffing Pattern',
                'Hours (Number) - Owner: Secellia and can be find in Column (E1) of the Residential Staffing Pattern',
                'Added to Staffing Pattern? (Boolean) - Owner: Secellia and can be find in Column (F1) of the Residential Staffing Pattern',
                'Availability Complete? (Boolean) - Owner: Secellia and can be find in Column (G1) of the Residential Staffing Pattern',
                'Names remain here even if staff are transferred, but removed if they quit',
                'Used to contact staff for shift discussions, scheduling issues, or if availability changes',
              ],
            },
          ]}
        />
      </section>

      <p className="text-sm text-slate-500">
        Tip: This view shows all sources that feed into both Staffing Pattern sheets (UBS IHS and Residential BT) and who owns each data element.
      </p>
    </div>
  );
};

const OverviewSwimlane: React.FC = () => {
  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <p className="text-sm tracking-[0.22em] uppercase text-slate-500">BrightPath • Complete Data Flow Overview</p>
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
          Overview - Combined Tracker View
        </h2>
        <p className="text-base text-slate-300 max-w-4xl">
          High level overview showing how{' '}
          <span className="font-semibold">New Hire Onboarding Tracker</span>,{' '}
          <span className="font-semibold">Master Training Tracker</span>, and{' '}
          <span className="font-semibold">Staffing Pattern</span> sheets interconnect and share data sources.
        </p>
      </header>

      {/* Legend */}
      <section className="bg-slate-900/70 border border-slate-800 rounded-2xl px-5 py-4 flex flex-wrap gap-5 items-center">
        <div className="text-sm font-semibold text-slate-400 uppercase tracking-wide">
          Legend – Column Owner
        </div>
        <LegendChip owner="emma" />
        <LegendChip owner="isaac" />
        <LegendChip owner="scheduler" />
        <LegendChip owner="recruiter" />
        <LegendChip owner="supervisor" />
      </section>

      {/* Swimlanes */}
      <section className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950/60 shadow-[0_0_40px_rgba(15,23,42,0.8)]">
        <Lane
          systemLabel="JazzHR"
          systemSub="Primary source of hire and offer information"
          bubbles={[
            {
              title: 'Hire & Offer Data',
              owner: 'recruiter',
              bullets: [
                'Candidate name & contact',
                'Offer details & program (Resi / UBS)',
                'Position / role',
                'Proposed start date',
                'Hired hours',
                'Used by: New Hire Onboarding, Staffing Pattern',
              ],
            },
          ]}
        />

        <Lane
          systemLabel="New Hire Onboarding Tracker"
          systemSub="Central hub for new hire information"
          bubbles={[
            {
              title: 'Core Hire Data',
              owner: 'emma',
              bullets: [
                'Name, email, phone - Source: JazzHR and can be find in Column (C1, D1) of the New Hire Onboarding Tracker',
                'Date of Hire - Source: JazzHR and can be find in Column (B1) of the New Hire Onboarding Tracker',
                'Position - Source: JazzHR and can be find in Column (E1) of the New Hire Onboarding Tracker',
                'Location / Supervisor - Source: Staffing Pattern and can be find in Column (F1) of the New Hire Onboarding Tracker',
                'Background check status - Source: DHS / NetStudy and can be find in Column (O1) of the New Hire Onboarding Tracker',
                'Paperwork completion - Source: Email / DocuSign and can be find in Column (L1) of the New Hire Onboarding Tracker',
                'Feeds into: Master Training Tracker, Staffing Pattern',
              ],
            },
          ]}
        />

        <Lane
          systemLabel="Master Training Tracker"
          systemSub="Tracks training and orientation completion"
          bubbles={[
            {
              title: 'Training & Orientation Data',
              owner: 'isaac',
              bullets: [
                'Name, Primary Site, Date of hire - Source: New Hire Onboarding Tracker and can be find in Column (A1, B1, C1) of the Master Training Tracker',
                'Date of orientation - Isaac tracks during Date of Show and can be find in Column (D1) of the Master Training Tracker',
                'Date of first supervised direct contact - Source: Master Training Tracker and can be find in Column (E1)',
                'Date of first unsupervised direct contact - Source: Master Training Tracker and can be find in Column (F1)',
                'Background check dates - Source: NetStudy / DHS and can be find in Column (G1, H1) of the Master Training Tracker',
                'Training module completions - Source: LMS and can be find in Column (U1-AJ1) of the Master Training Tracker',
                'Orientation records - Source: DocuSign and can be find in Column (P1, Q1) of the Master Training Tracker',
                'Isaac marks employees "green" when ready',
                'Feeds into: Staffing Pattern (readiness signal)',
              ],
            },
          ]}
        />

        <Lane
          systemLabel="Staffing Pattern (UBS IHS & Residential BT)"
          systemSub="Scheduling and staffing assignment"
          bubbles={[
            {
              title: 'Staffing Data',
              owner: 'scheduler',
              bullets: [
                'Staff Name - Source: New Hire Tracker / HR Onboarding and can be find in Column (A1) of the UBS Staffing Pattern / Residential Staffing Pattern (A1)',
                'Hire Date - Source: HR / Training and can be find in Column (B1) of the UBS Staffing Pattern',
                'Position - Source: JazzHR job offer and can be find in Column (C1) of the UBS Staffing Pattern',
                'Hours - Source: JazzHR (validated by Secellia) and can be find in Column (D1, E1) of the UBS Staffing Pattern / Residential Staffing Pattern (E1)',
                'Direct Supervisor - Source: Supervisor assignment and can be find in Column (F1) of the UBS Staffing Pattern',
                'Primary Location - Source: JazzHR job offer and can be find in Column (D1) of the Residential Staffing Pattern',
                'Availability - Source: New Hire Tracker and can be find in Column (C1) of the Residential Staffing Pattern',
                'Phone number - Source: Residential Staffing Pattern and can be find in Column (B1)',
                'Secellia only adds staff after HR puts them in New Hire Tracker',
                'Secellia only schedules after Orientation (from Training Tracker)',
              ],
            },
          ]}
        />

        <Lane
          systemLabel="DHS / NetStudy"
          systemSub="Background check processing"
          bubbles={[
            {
              title: 'Background Check Data',
              owner: 'emma',
              bullets: [
                'BGS Submitted date - Source: NetStudy and can be find in Column (M1) of the New Hire Onboarding Tracker / Master Training Tracker (G1)',
                'BGS Clearance status - Source: NetStudy / DHS and can be find in Column (O1) of the New Hire Onboarding Tracker / Master Training Tracker (H1)',
                'Fingerprint scheduling - Source: DHS and can be find in Column (P1) of the New Hire Onboarding Tracker',
                'Used by: New Hire Onboarding, Master Training Tracker',
              ],
            },
          ]}
        />

        <Lane
          systemLabel="Email / DocuSign"
          systemSub="Paperwork and document completion"
          bubbles={[
            {
              title: 'Document Data',
              owner: 'emma',
              bullets: [
                'Handbook Acknowledgement - Source: Email / DocuSign and can be find in Column (L1) of the New Hire Onboarding Tracker',
                'Orientation Records - Source: DocuSign and can be find in Column (P1, Q1) of the Master Training Tracker',
                'Paperwork completion status - Source: New Hire Onboarding Tracker and can be find in Column (H1, I1, J1, K1)',
                'Used by: New Hire Onboarding, Master Training Tracker',
              ],
            },
          ]}
        />

        <Lane
          systemLabel="LMS (Learning Management System)"
          systemSub="Online training module completions"
          bubbles={[
            {
              title: 'Training Modules',
              owner: 'isaac',
              bullets: [
                'All online training module completions',
                'Orientation Presentation, HIPAA, Service Recipient Rights, etc.',
                'Used by: Master Training Tracker',
              ],
            },
          ]}
        />

        <Lane
          systemLabel="When I Work"
          systemSub="Scheduling and shift information"
          bubbles={[
            {
              title: 'Scheduling Data',
              owner: 'scheduler',
              bullets: [
                'Live Sessions tracking',
                'WIW ID and CHR password',
                'Schedule placement after "green" status',
                'Used by: Master Training Tracker, Staffing Pattern',
              ],
            },
          ]}
        />

        <Lane
          systemLabel="Supervisor / Program Leadership"
          systemSub="Supervisor assignments and evaluations"
          bubbles={[
            {
              title: 'Supervisor Data',
              owner: 'supervisor',
              bullets: [
                'Direct Supervisor assignment - Source: UBS Staffing Pattern and can be find in Column (F1)',
                'Skills/preferences for client matching - Source: UBS Staffing Pattern and can be find in Column (L1)',
                'Supervisor notes and evaluations - Source: UBS Staffing Pattern and can be find in Column (L1)',
                'Program movement notifications - Source: UBS Staffing Pattern',
                'Contact Information - Source: UBS Staffing Pattern and can be find in Column (M1)',
                'Used by: Staffing Pattern (UBS IHS)',
              ],
            },
          ]}
        />

        <Lane
          systemLabel="HR Demographic Forms"
          systemSub="Demographic and residence information"
          bubbles={[
            {
              title: 'Demographic Data',
              owner: 'emma',
              bullets: [
                'County and City of Residence - Source: UBS Staffing Pattern and can be find in Column (G1, H1)',
                'Staff Gender - Source: UBS Staffing Pattern and can be find in Column (I1)',
                'Allergies and background information - Source: UBS Staffing Pattern and can be find in Column (J1)',
                'Used by: Staffing Pattern (UBS IHS)',
              ],
            },
          ]}
        />

        <Lane
          systemLabel="QA Team"
          systemSub="Quality assurance metrics"
          bubbles={[
            {
              title: 'QA Metrics',
              owner: 'scheduler',
              bullets: [
                'QA numbers and metrics',
                'Sent by QA team (Claudia, Rebecca)',
                'Secellia does not calculate these herself',
                'Used by: Staffing Pattern (Residential BT)',
              ],
            },
          ]}
        />

        <Lane
          systemLabel="Star Services"
          systemSub="License and affiliation information"
          bubbles={[
            {
              title: 'License Data',
              owner: 'isaac',
              bullets: [
                'Parent license numbers - Source: Master Training Tracker and can be find in Column (J1)',
                'Site affiliations (Oliver, 157th, Brunswick, 92nd, Crisis) - Source: Master Training Tracker and can be find in Column (K1, L1, M1, N1)',
                'Used by: Master Training Tracker',
              ],
            },
          ]}
        />
      </section>

      {/* Data Flow Summary */}
      <section className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-semibold text-slate-100">Data Flow Summary</h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-200">Entry Point</h4>
            <p className="text-slate-300">
              New hires enter through <span className="font-semibold">JazzHR</span> and{' '}
              <span className="font-semibold">New Hire Onboarding Tracker</span> (HR creates the row).
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-200">Training Phase</h4>
            <p className="text-slate-300">
              <span className="font-semibold">Master Training Tracker</span> pulls from New Hire Tracker and tracks
              orientation, background checks, and training modules until Isaac marks them "green".
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-200">Scheduling Phase</h4>
            <p className="text-slate-300">
              <span className="font-semibold">Staffing Pattern</span> uses data from New Hire Tracker and Training
              Tracker to assign staff to sites and create schedules. Secellia only adds staff after HR confirmation.
            </p>
          </div>
        </div>
      </section>

      <p className="text-sm text-slate-500">
        Tip: This overview shows how all three trackers interconnect. Data flows from JazzHR → New Hire Onboarding →
        Master Training → Staffing Pattern, with each tracker serving as both a data consumer and provider.
      </p>
    </div>
  );
};

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
            <div className="text-[10px] text-slate-200/80">"Updated New Hires" sheet</div>
          </button>

          <button
            onClick={() => setActiveTab('masterTraining')}
            className={`flex-1 text-left px-3 py-2 rounded-lg text-xs md:text-sm transition ${
              activeTab === 'masterTraining'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-700/40'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/60'
            }`}
          >
            Master Training Tracker
            <div className="text-[10px] text-slate-200/80">DSP Orientation record sheet</div>
          </button>

          <button
            onClick={() => setActiveTab('staffingPattern')}
            className={`flex-1 text-left px-3 py-2 rounded-lg text-xs md:text-sm transition ${
              activeTab === 'staffingPattern'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-700/40'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/60'
            }`}
          >
            Staffing Pattern
            <div className="text-[10px] text-slate-200/80">UBS IHS & Residential BT</div>
          </button>

          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 text-left px-3 py-2 rounded-lg text-xs md:text-sm transition ${
              activeTab === 'overview'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-700/40'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/60'
            }`}
          >
            Overview
            <div className="text-[10px] text-slate-200/80">Combined view of all trackers</div>
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
        {activeTab === 'newHires' ? (
          <OnboardingSwimlane />
        ) : activeTab === 'masterTraining' ? (
          <MasterTrainingSwimlane />
        ) : activeTab === 'staffingPattern' ? (
          <StaffingPatternSwimlane />
        ) : activeTab === 'overview' ? (
          <OverviewSwimlane />
        ) : (
          <OnboardingRecommendation />
        )}
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
    <div className="space-y-10">
      {/* Header */}
      <header className="space-y-3">
        <p className="text-sm tracking-[0.22em] uppercase text-slate-500">
          BrightPath • Automation Roadmap
        </p>
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
          Crawl → Walk → Run: Phased Automation Plan
        </h2>
        <p className="text-base text-slate-300 max-w-4xl leading-relaxed">
          A comprehensive roadmap to eliminate double entry and automate data flow across all trackers. Implemented in phases to avoid disruption.
        </p>
      </header>

      {/* Foundation Section */}
      <section className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border-2 border-indigo-500/50 rounded-3xl p-8 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-2xl font-bold text-white">
            1
          </div>
          <h2 className="text-2xl font-semibold text-slate-100">Foundation: One Master ID + One Master Registry</h2>
        </div>
        <p className="text-base text-slate-200 mb-6 leading-relaxed">
          Before any "heavy" automation, we lock in the data model. This foundation removes a huge amount of double entry before connecting external systems.
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-slate-900/80 border border-slate-700 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-slate-100 mb-4">BP_ID Implementation</h3>
            <ul className="space-y-3 text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 mt-1">✓</span>
                <span>Create BP_ID for every hire (BrightPath Employee ID)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 mt-1">✓</span>
                <span>Add BP_ID column to all four sheets: Updated New Hires, UBS Staffing Pattern, Residential Staffing Pattern, DSP Orientation</span>
              </li>
            </ul>
          </div>
          <div className="bg-slate-900/80 border border-slate-700 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-slate-100 mb-4">Master Person Registry</h3>
            <ul className="space-y-3 text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 mt-1">✓</span>
                <span>Primary key: BP_ID</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 mt-1">✓</span>
                <span>Fields: Name, email, phone, program, primary site, supervisor, hire/start dates</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 mt-1">✓</span>
                <span>Use formulas (XLOOKUP) instead of manual typing in other sheets</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-6 p-4 bg-indigo-500/20 border border-indigo-400/30 rounded-xl">
          <p className="text-sm text-slate-200">
            <span className="font-semibold">Goal:</span> Data is entered once (in Master or via automation), everything else references it.
          </p>
        </div>
      </section>

      {/* Tier 1 */}
      <section className="bg-slate-900/70 border border-slate-800 rounded-3xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center text-2xl font-bold text-slate-900">
            2
          </div>
          <h2 className="text-2xl font-semibold text-slate-100">Tier 1 – Sheet-to-Sheet Automations</h2>
        </div>
        <p className="text-base text-slate-300 mb-6 leading-relaxed">
          "Safe" automations fully inside Google Sheets using Google Apps Script + Formulas.
        </p>
        <div className="space-y-6">
          <div className="bg-slate-950/60 border border-slate-700 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
              <span className="text-amber-400">2.1</span> Auto-create rows in downstream sheets
            </h3>
            <div className="space-y-3 text-slate-300">
              <p className="font-semibold text-slate-200">Trigger:</p>
              <p>Status change in Updated New Hires (e.g., Status = "Cleared for Orientation")</p>
              <p className="font-semibold text-slate-200 mt-4">Automations:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Create / ensure a row exists in UBS or Residential Staffing Pattern (based on Program)</li>
                <li>Create / ensure a row exists in DSP Orientation sheet (Master Training)</li>
              </ul>
              <p className="font-semibold text-slate-200 mt-4">Result:</p>
              <p className="bg-emerald-500/20 border border-emerald-400/30 rounded-lg p-3 text-sm">
                HR flips one status, and all the right trackers get populated automatically with consistent data.
              </p>
            </div>
          </div>
          <div className="bg-slate-950/60 border border-slate-700 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
              <span className="text-amber-400">2.2</span> Cross-check & mismatch flags
            </h3>
            <div className="space-y-3 text-slate-300">
              <p>Build a small "QA Exceptions" sheet powered by Apps Script:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Compare Updated New Hires vs Staffing Patterns: Same BP_ID, different site/supervisor → log mismatch</li>
                <li>Compare Updated New Hires vs DSP Orientation: Cleared for Orientation but no orientation row → log missing record</li>
                <li>Compare Master Training vs CHR: GREEN in DSP but no CHR row staged → log missing</li>
              </ul>
              <p className="bg-amber-500/20 border border-amber-400/30 rounded-lg p-3 text-sm mt-4">
                Send a daily email/Slack summary of mismatches to Emma + Isaac + Scheduler
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tier 2 */}
      <section className="bg-slate-900/70 border border-slate-800 rounded-3xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-2xl font-bold text-white">
            3
          </div>
          <h2 className="text-2xl font-semibold text-slate-100">Tier 2 – System Integrations (External → Sheets)</h2>
        </div>
        <p className="text-base text-slate-300 mb-6 leading-relaxed">
          Once the sheet layer is stable, we pull in external systems.
        </p>
        <div className="space-y-6">
          <div className="bg-slate-950/60 border border-slate-700 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
              <span className="text-blue-400">3.1</span> JazzHR → Master Person Registry & Updated New Hires
            </h3>
            <p className="text-slate-300 mb-3">Goal: Stop retyping candidate details from JazzHR.</p>
            <ul className="list-disc list-inside space-y-2 text-slate-300 ml-4">
              <li>Use JazzHR API or scheduled CSV export</li>
              <li>Integration runs on schedule, finds candidates in "Offer Accepted" stage</li>
              <li>Creates/updates row in Master Person Registry with new BP_ID</li>
              <li>Ensures a row exists in Updated New Hires (linked by BP_ID)</li>
            </ul>
            <p className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-3 text-sm mt-4">
              Result: As soon as an offer is accepted in JazzHR, HR sees a pre-filled row ready to finish paperwork/background fields.
            </p>
          </div>
          <div className="bg-slate-950/60 border border-slate-700 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
              <span className="text-blue-400">3.2</span> DHS / NetStudy → Updated New Hires
            </h3>
            <p className="text-slate-300 mb-3">Goal: Eliminate manual copying of background check statuses.</p>
            <ul className="list-disc list-inside space-y-2 text-slate-300 ml-4">
              <li>If CSV export / API exists: Scheduled job pulls latest results, matches on name + DOB, updates Background Check Status</li>
              <li>If email-only: Use email parser (Gmail + Apps Script) to read background check results and update the sheet</li>
            </ul>
          </div>
          <div className="bg-slate-950/60 border border-slate-700 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
              <span className="text-blue-400">3.3</span> When I Work → Training / Orientation dates
            </h3>
            <p className="text-slate-300 mb-3">Goal: Keep orientation / first-contact dates in sync.</p>
            <ul className="list-disc list-inside space-y-2 text-slate-300 ml-4">
              <li>Pull schedule events from When I Work for staff with Role = Orientation / Training</li>
              <li>Match shifts to BP_ID via email</li>
              <li>Write Orientation Date, First Supervised Contact, First Unsupervised Contact into DSP Orientation sheet</li>
            </ul>
            <p className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-3 text-sm mt-4">
              Result: Isaac doesn't need to manually copy dates out of WIW.
            </p>
          </div>
          <div className="bg-slate-950/60 border border-slate-700 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
              <span className="text-blue-400">3.4</span> CHR / HRIS ← Sheets (Outbound)
            </h3>
            <p className="text-slate-300 mb-3">Goal: Feed CHR clean data instead of replacing it.</p>
            <ul className="list-disc list-inside space-y-2 text-slate-300 ml-4">
              <li>Create a CHR Staging Sheet: One row per BP_ID that's "Ready for CHR"</li>
              <li>Populated automatically from Master Registry + Updated New Hires + Master Training</li>
              <li>If CHR supports import: Export staging sheet as CSV and import regularly</li>
              <li>If CHR is manual: At least Emma types from a single, cleaned row instead of stitching from 3–4 trackers</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Tier 3 */}
      <section className="bg-slate-900/70 border border-slate-800 rounded-3xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center text-2xl font-bold text-white">
            4
          </div>
          <h2 className="text-2xl font-semibold text-slate-100">Tier 3 – Event & Alert Automations</h2>
        </div>
        <p className="text-base text-slate-300 mb-6 leading-relaxed">
          These don't change data; they watch it and notify people.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-slate-950/60 border border-slate-700 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-slate-100 mb-4">Orientation Readiness Alerts</h3>
            <p className="text-slate-300 text-sm mb-3">Trigger: Status = Cleared AND missing orientation date</p>
            <p className="text-slate-300 text-sm">Notify: Isaac / training inbox</p>
          </div>
          <div className="bg-slate-950/60 border border-slate-700 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-slate-100 mb-4">No-show / Reschedule Loop</h3>
            <p className="text-slate-300 text-sm mb-3">Isaac marks Orientation Result = No Show</p>
            <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
              <li>Writes flag back to Updated New Hires</li>
              <li>Alerts HR + Recruiting</li>
              <li>Optionally updates JazzHR stage</li>
            </ul>
          </div>
          <div className="bg-slate-950/60 border border-slate-700 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-slate-100 mb-4">Compliance Reminders</h3>
            <p className="text-slate-300 text-sm mb-3">Time-based script finds rows where key trainings expire within X days</p>
            <p className="text-slate-300 text-sm">Sends summary to HR + supervisors</p>
          </div>
        </div>
      </section>

      {/* Implementation Phases */}
      <section className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-2 border-slate-700 rounded-3xl p-8">
        <h2 className="text-2xl font-semibold text-slate-100 mb-6">Recommended Implementation Sequence</h2>
        <p className="text-base text-slate-300 mb-8 leading-relaxed">
          Crawl → Walk → Run: No big bang. Implement in phases to avoid disruption.
        </p>
        <div className="space-y-6">
          <div className="bg-emerald-900/30 border-2 border-emerald-500/50 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-white">
                A
              </div>
              <h3 className="text-xl font-semibold text-slate-100">Phase A – Data model + sheet automations (Weeks 1–4)</h3>
            </div>
            <ul className="space-y-2 text-slate-300 ml-14">
              <li>• Add BP_ID column everywhere</li>
              <li>• Build Master Person Registry</li>
              <li>• Implement: New Hires → Staffing & DSP auto-row creation</li>
              <li>• Mismatch / QA exception reports</li>
            </ul>
          </div>
          <div className="bg-blue-900/30 border-2 border-blue-500/50 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center font-bold text-white">
                B
              </div>
              <h3 className="text-xl font-semibold text-slate-100">Phase B – External read-only syncs (Weeks 5–8)</h3>
            </div>
            <ul className="space-y-2 text-slate-300 ml-14">
              <li>• JazzHR → Master + Updated New Hires (no writes back to JazzHR yet)</li>
              <li>• NetStudy → background status</li>
              <li>• When I Work → milestone dates</li>
            </ul>
          </div>
          <div className="bg-purple-900/30 border-2 border-purple-500/50 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center font-bold text-white">
                C
              </div>
              <h3 className="text-xl font-semibold text-slate-100">Phase C – CHR staging + alerts (Weeks 9–12)</h3>
            </div>
            <ul className="space-y-2 text-slate-300 ml-14">
              <li>• Build CHR staging sheet</li>
              <li>• Add job that populates it from existing sheets</li>
              <li>• Add orientation + compliance alerts</li>
            </ul>
          </div>
          <div className="bg-amber-900/30 border-2 border-amber-500/50 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center font-bold text-slate-900">
                D
              </div>
              <h3 className="text-xl font-semibold text-slate-100">Phase D – Optional API write-backs (Future)</h3>
            </div>
            <ul className="space-y-2 text-slate-300 ml-14">
              <li>• If/when CHR & JazzHR stakeholders are comfortable</li>
              <li>• Automate CHR profile creation</li>
              <li>• Update JazzHR stages based on actual progress</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BrightPathSheetVisuals;

