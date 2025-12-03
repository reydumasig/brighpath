"use client";

import React, { useState } from "react";
import * as XLSX from "xlsx";

type SectionKey =
  | "architecture"
  | "workflow"
  | "raci"
  | "centralization";

type AccordionItem = {
  id: string;
  title: string;
  body: string;
  tableHeaders?: string[];
  tableRows?: string[][];
};

type Artifact = {
  key: SectionKey;
  label: string;
  description: string;
  sections: AccordionItem[];
};

const artifacts: Artifact[] = [
  {
    key: "architecture",
    label: "System Architecture Diagram",
    description:
      "High-level view of all systems (JazzHR, HR Inbox, DocuSign, NetStudy, Trackers, CHR, WIW) and how data flows between them.",
    sections: [
      {
        id: "arch_overview",
        title: "Overview",
        body: `This diagram maps all core systems used in BrightPath's onboarding and operations stack:

- JazzHR (ATS)
- HR Inbox (notification hub)
- DocuSign (paperwork)
- DHS / NetStudy (background checks)
- New Hire Onboarding Tracker
- Staffing Pattern (Residential + UBS)
- Master Training Tracker
- Google Drive
- CHR (HRIS)
- When I Work (scheduling)

It shows the lack of a single source of truth and highlights how manual handoffs and disconnected systems create risk and rework.`,
      },
      {
        id: "arch_flow",
        title: "System-to-System Flow",
        body: `Example current-state data flow:

JazzHR → HR Inbox → New Hire Tracker → Staffing Pattern → Training Tracker → CHR → When I Work

Each arrow represents a largely manual handoff today (copy/paste, email, verbal updates). This is the backbone for identifying centralization and automation opportunities.`,
      },
      {
        id: "arch_pain",
        title: "Key Pain Points",
        body: `Key architecture-level issues:
- No central source of truth
- HR Inbox is the accidental hub for critical events
- Three core trackers (New Hire, Staffing Pattern, Training) operate independently
- CHR is not integrated with any upstream system
- Scheduling in When I Work depends on incomplete or delayed data

These are the structural reasons BrightPath struggles with accuracy and scalability.`,
      },
    ],
  },
  {
    key: "workflow",
    label: "End-to-End Workflow Diagram",
    description:
      "Step-by-step flow from candidate recruitment through Day 1, training, CHR creation, scheduling, and compliance.",
    sections: [
      {
        id: "wf_overview",
        title: "End-to-End Flow (High Level)",
        body: `The workflow runs from:

Candidate → Offer → Paperwork → Background Check → New Hire Tracker →
Staffing Pattern → Training Tracker → CHR → When I Work → Day 1 → Ongoing Compliance.

Each step includes a system and one or more human owners, with multiple decision points and dependencies.`,
      },
      {
        id: "wf_detailed",
        title: "Key Stages & Hand-offs",
        body: `Critical stages:

1. Recruiters update JazzHR (often inconsistently).
2. DocuSign sends paperwork; completion shows up in HR Inbox.
3. Emma updates New Hire Tracker and manages NetStudy background checks.
4. Scheduler (Secellia) uses the Staffing Pattern to assign site and role.
5. Training (Isaac/Laura) uses New Hire + Staffing Pattern to manage "green" status.
6. HR manually creates CHR profiles.
7. Scheduler adds new hires to When I Work and finalizes schedules.
8. Training + HR manually track renewals and compliance.

Every missed update or mismatch at one stage cascades into the others.`,
      },
      {
        id: "wf_bottlenecks",
        title: "Bottlenecks & Failure Points",
        body: `Main bottlenecks:
- JazzHR stages not maintained correctly
- HR Inbox as the only reliable signal of progress
- New Hire Tracker with missing or incorrect site/supervisor info
- Training cannot mark people "green" without chasing data
- Scheduling often receives late or wrong information
- Compliance tracking is manual and fragmented

These workflow issues directly inform what S360 should centralize first.`,
      },
    ],
  },
  {
    key: "raci",
    label: "RACI Matrix",
    description:
      "Responsibility map showing who is Responsible, Accountable, Consulted, and Informed across systems and tasks.",
    sections: [
      {
        id: "raci_matrix_current",
        title: "BrightPath – People-to-System RACI Matrix (Current State)",
        body: `Legend

R = Responsible (does the task)
A = Accountable (owns the outcome)
C = Consulted (provides information)
I = Informed (needs awareness)

This RACI matrix maps how key people (Recruiters, HR, Training, Scheduler, Supervisors) interact with core systems (JazzHR, HR Inbox, DocuSign, CHR, Pathfinder).

Use the tables in the following sections to see per-system responsibilities and handoffs.`,
      },
      {
        id: "raci_jazzhr_table",
        title: "1. JazzHR (ATS) – RACI Table",
        body: `High-level RACI view for how JazzHR is used today.

Notes:
- Stages are inconsistently updated → downstream confusion.
- HR often learns about hires through emails, not JazzHR.`,
        tableHeaders: [
          "Task",
          "Recruiters",
          "HR Emma",
          "Training",
          "Scheduler",
          "Supervisor",
          "CHR System",
          "Pathfinder",
        ],
        tableRows: [
          [
            "Enter candidate details",
            "R/A",
            "I",
            "I",
            "I",
            "I",
            "I",
            "I",
          ],
          [
            "Update stages (Offer Sent/Accepted)",
            "R/A",
            "I",
            "I",
            "C",
            "I",
            "I",
            "I",
          ],
          [
            "Send offer paperwork",
            "R/A",
            "I",
            "I",
            "I",
            "I",
            "I",
            "I",
          ],
          [
            "Notify teams (manually)",
            "R",
            "C",
            "C",
            "C",
            "I",
            "I",
            "I",
          ],
        ],
      },
      {
        id: "raci_hr_inbox_table",
        title: "2. HR Inbox (Notification Hub) – RACI Table",
        body: `RACI for how HR Inbox acts as the accidental hub for onboarding signals.

Notes:
- Currently the accidental source of truth for all onboarding events.
- Many RACI mismatches originate here.`,
        tableHeaders: [
          "Task",
          "Recruiters",
          "HR Emma",
          "Training",
          "Scheduler",
          "Supervisor",
          "CHR System",
          "Pathfinder",
        ],
        tableRows: [
          [
            "Offer/Paperwork notifications",
            "R",
            "A",
            "I",
            "I",
            "I",
            "I",
            "I",
          ],
          [
            "Background check notifications",
            "C",
            "R/A",
            "I",
            "I",
            "I",
            "I",
            "I",
          ],
          [
            "Paperwork completion emails",
            "C",
            "R/A",
            "I",
            "I",
            "I",
            "I",
            "I",
          ],
          [
            "Forwarding info to others",
            "C",
            "R",
            "I",
            "C",
            "I",
            "I",
            "R (future)",
          ],
        ],
      },
      {
        id: "raci_docusign_table",
        title: "3. DocuSign (Paperwork System) – RACI Table",
        body: `RACI for how DocuSign paperwork is initiated and consumed.

Notes:
- No integration → Emma’s manual checks are mandatory.`,
        tableHeaders: [
          "Task",
          "Recruiters",
          "HR Emma",
          "Training",
          "Scheduler",
          "Supervisor",
          "CHR System",
          "Pathfinder",
        ],
        tableRows: [
          [
            "Send onboarding packet",
            "R/A",
            "C",
            "I",
            "I",
            "I",
            "I",
            "I",
          ],
          [
            "Verify completion",
            "I",
            "R/A",
            "I",
            "I",
            "I",
            "I",
            "R (future)",
          ],
          [
            "Update New Hire Tracker",
            "I",
            "R/A",
            "I",
            "C",
            "I",
            "I",
            "R (future)",
          ],
        ],
      },
      {
        id: "raci_dhs_netstudy_table",
        title: "4. DHS / NetStudy (Background Checks) – RACI Table",
        body: `Focused RACI slice showing how background checks currently flow across people and systems.`,
        tableHeaders: [
          "Task",
          "Recruiters",
          "HR Emma",
          "Training",
          "Scheduler",
          "Supervisor",
          "CHR System",
          "Pathfinder",
        ],
        tableRows: [
          [
            "Background check submission",
            "R/A",
            "C",
            "I",
            "I",
            "I",
            "I",
            "I",
          ],
          [
            "Check status (Pass/Pending)",
            "I",
            "R/A",
            "I",
            "I",
            "I",
            "I",
            "R (future)",
          ],
          [
            "Enter into onboarding tracker",
            "I",
            "R/A",
            "I",
            "I",
            "I",
            "I",
            "R (future)",
          ],
          [
            "Notify training",
            "I",
            "R",
            "C",
            "I",
            "I",
            "I",
            "R (future)",
          ],
        ],
      },
      {
        id: "raci_new_hire_tracker_table",
        title: "5. New Hire Onboarding Tracker (Google Sheet) – RACI Table",
        body: `RACI for the shared New Hire Onboarding Tracker, where many downstream issues originate.

Notes:
- Supervisor & site are often incorrect (root cause of training + scheduling issues).
- Ideal candidate for Pathfinder centralization.`,
        tableHeaders: [
          "Task",
          "Recruiters",
          "HR Emma",
          "Training",
          "Scheduler",
          "Supervisor",
          "CHR System",
          "Pathfinder",
        ],
        tableRows: [
          [
            "Create entry",
            "I",
            "R/A",
            "C",
            "C",
            "C",
            "I",
            "R (future)",
          ],
          [
            "Update background check",
            "I",
            "R",
            "I",
            "I",
            "I",
            "I",
            "R (future)",
          ],
          [
            "Add site/supervisor info",
            "C",
            "R",
            "C",
            "R/A",
            "C",
            "I",
            "R (future)",
          ],
          [
            "Update hire date",
            "C",
            "R/A",
            "C",
            "R",
            "C",
            "I",
            "R (future)",
          ],
          [
            "Validate paperwork completeness",
            "C",
            "R/A",
            "I",
            "I",
            "I",
            "I",
            "R (future)",
          ],
        ],
      },
      {
        id: "raci_staffing_pattern_table",
        title: "6. Staffing Pattern (Residential + UBS) – RACI Table",
        body: `How Staffing Pattern entries are maintained today, and where the scheduler becomes a bottleneck.

Notes:
- Scheduler (Secellia) is the bottleneck here.
- Heavy downstream impact if Staffing Pattern is inaccurate.`,
        tableHeaders: [
          "Task",
          "Recruiters",
          "HR Emma",
          "Training",
          "Scheduler",
          "Supervisor",
          "CHR System",
          "Pathfinder",
        ],
        tableRows: [
          [
            "Add new hire to staffing",
            "C",
            "C",
            "C",
            "R/A",
            "C",
            "I",
            "R (future)",
          ],
          [
            "Verify job offer details",
            "C",
            "C",
            "I",
            "R/A",
            "C",
            "I",
            "R (future)",
          ],
          [
            "Adjust site assignment",
            "C",
            "C",
            "I",
            "R/A",
            "C",
            "I",
            "C",
          ],
          [
            "Communicate changes",
            "C",
            "I",
            "C",
            "R/A",
            "C",
            "I",
            "I",
          ],
        ],
      },
      {
        id: "raci_training_tracker_table",
        title: "7. Training Tracker (Master Training) – RACI Table",
        body: `RACI for the Master Training Tracker, where \"green\" status is the true readiness signal.

Notes:
- \"Green\" status is the REAL readiness signal.
- Downstream systems depend heavily on timely updates here.`,
        tableHeaders: [
          "Task",
          "Recruiters",
          "HR Emma",
          "Training",
          "Scheduler",
          "Supervisor",
          "CHR System",
          "Pathfinder",
        ],
        tableRows: [
          [
            "Create training entry",
            "I",
            "I",
            "R/A",
            "C",
            "C",
            "I",
            "C (future)",
          ],
          [
            "Assign supervisor",
            "C",
            "C",
            "R/A",
            "C",
            "C",
            "I",
            "C",
          ],
          [
            "Assign primary site",
            "C",
            "C",
            "R/A",
            "C",
            "C",
            "I",
            "C",
          ],
          [
            "Mark training completed",
            "I",
            "I",
            "R/A",
            "I",
            "R",
            "I",
            "C",
          ],
          [
            "Mark employee \"GREEN\"",
            "I",
            "I",
            "R/A",
            "I",
            "C",
            "I",
            "I",
          ],
        ],
      },
      {
        id: "raci_google_drive_table",
        title: "8. Google Drive – Employee Folders – RACI Table",
        body: `RACI for creation and maintenance of employee folders in Google Drive.`,
        tableHeaders: [
          "Task",
          "Recruiters",
          "HR Emma",
          "Training",
          "Scheduler",
          "Supervisor",
          "CHR System",
          "Pathfinder",
        ],
        tableRows: [
          [
            "Create employee folder",
            "I",
            "R/A",
            "I",
            "I",
            "I",
            "I",
            "R (future)",
          ],
          [
            "Upload documents",
            "I",
            "R",
            "R",
            "I",
            "C",
            "I",
            "R (future)",
          ],
          [
            "Maintain naming conventions",
            "I",
            "R/A",
            "I",
            "C",
            "I",
            "I",
            "C",
          ],
        ],
      },
      {
        id: "raci_chr_table",
        title: "9. CHR (HRIS System) – RACI Table",
        body: `RACI for CHR as the system of record for employee data and compliance.

Notes:
- CHR MUST match the Training Tracker, but both are currently manual → mismatches common.`,
        tableHeaders: [
          "Task",
          "Recruiters",
          "HR Emma",
          "Training",
          "Scheduler",
          "Supervisor",
          "CHR System",
          "Pathfinder",
        ],
        tableRows: [
          [
            "Create CHR profile",
            "I",
            "R/A",
            "C",
            "I",
            "I",
            "I",
            "R (future)",
          ],
          [
            "Update credentials",
            "I",
            "R",
            "C",
            "I",
            "C",
            "I",
            "R (future)",
          ],
          [
            "Match with training data",
            "I",
            "R",
            "C",
            "I",
            "C",
            "I",
            "C",
          ],
          [
            "Compliance cross-check",
            "I",
            "R/A",
            "R/A",
            "I",
            "C",
            "I",
            "R (future)",
          ],
        ],
      },
      {
        id: "raci_wiw_table",
        title: "10. When I Work (Scheduling System) – RACI Table",
        body: `RACI for how employees are added and managed in When I Work.`,
        tableHeaders: [
          "Task",
          "Recruiters",
          "HR Emma",
          "Training",
          "Scheduler",
          "Supervisor",
          "CHR System",
          "Pathfinder",
        ],
        tableRows: [
          [
            "Add employee to WIW",
            "I",
            "C",
            "C",
            "R/A",
            "C",
            "I",
            "C (future)",
          ],
          [
            "Assign shifts",
            "I",
            "I",
            "I",
            "R/A",
            "C",
            "I",
            "I",
          ],
          [
            "Adjust schedules",
            "I",
            "I",
            "I",
            "R/A",
            "C",
            "I",
            "I",
          ],
        ],
      },
      {
        id: "raci_supervisors_table",
        title: "11. Supervisors (Site-Level Ops) – RACI Table",
        body: `RACI for supervisors in their site-level, readiness, and orientation responsibilities.`,
        tableHeaders: [
          "Task",
          "Recruiters",
          "HR Emma",
          "Training",
          "Scheduler",
          "Supervisor",
          "CHR System",
          "Pathfinder",
        ],
        tableRows: [
          [
            "Provide site assignment",
            "C",
            "C",
            "C",
            "C",
            "R/A",
            "I",
            "I",
          ],
          [
            "Verify orientation/shadowing",
            "I",
            "I",
            "C",
            "I",
            "R/A",
            "I",
            "I",
          ],
          [
            "Report readiness to training",
            "I",
            "I",
            "R/A",
            "I",
            "R",
            "I",
            "I",
          ],
        ],
      },
      {
        id: "raci_pathfinder_future_table",
        title: "Pathfinder Role (Future) – RACI Summary",
        body: `Future-state view of Pathfinder as the centralized data operations engine that removes manual burden from Emma, Training, and Scheduling.`,
        tableHeaders: [
          "Task",
          "Pathfinder (Future Role)",
        ],
        tableRows: [
          ["Update all trackers nightly", "R/A"],
          ["Validate background checks", "R"],
          ["Verify paperwork completeness", "R"],
          ["Ensure consistency across Staffing/Training/HR", "R/A"],
          ["Maintain naming conventions", "R"],
          ["Create CHR profiles after validation", "R"],
          ["Input new hires into WIW", "C"],
          ["Manage system-to-system consistency", "R/A"],
          ["Provide weekly cross-system audit", "R/A"],
        ],
      },
      {
        id: "raci_roles",
        title: "Core Roles & Systems",
        body: `Roles:
- Recruiters (Jeremy, Tyler)
- HR (Emma)
- Training (Isaac, Laura)
- Scheduler (Secellia)
- Supervisors
- CHR / HRIS
- Pathfinder (S360 future-state team)

Systems:
- JazzHR, HR Inbox, DocuSign, NetStudy, New Hire Tracker,
  Staffing Pattern, Training Tracker, Google Drive, CHR, When I Work.`,
      },
      {
        id: "raci_conflicts",
        title: "RACI Conflicts & Gaps",
        body: `Conflicts:
- New Hire Tracker is touched by HR, Training, and Scheduling with no single clear owner.
- CHR matching Training data is shared between HR and Training but owned by neither.
- Supervisors and Recruiters both influence site/supervisor assignments, often inconsistently.
- No one is accountable for system-to-system consistency.

Gaps:
- No dedicated owner for nightly reconciliation across trackers.
- No owner for maintaining naming standards and unique identifiers.
- No clear process owner for "green" readiness beyond Training's informal role.`,
      },
      {
        id: "raci_pathfinder",
        title: "Pathfinder Role (Future-State)",
        body: `Future Pathfinder (S360) responsibilities:
- R/A: Maintain all trackers nightly (New Hire, Training, Staffing pattern pre-fill).
- R: Validate background checks & paperwork status, input standardized data.
- R/A: Enforce data consistency rules and naming conventions.
- R: Prepare CHR-ready data and WIW-ready entries.
- R/A: Provide exception reports to BrightPath teams.

This makes Pathfinder the central data operations engine, reducing manual workload on HR, Training, and Scheduling.`,
      },
    ],
  },
  {
    key: "centralization",
    label: "Centralization Opportunity Map",
    description:
      "Phased plan for what S360 can centralize now, what BrightPath keeps, what gets automated, and in what order.",
    sections: [
      {
        id: "cent_phase1",
        title: "Phase 1 – Immediate Centralization (High Value / Low Risk)",
        body: `Tasks S360 can take over now:
- Enter new hires into the New Hire Tracker (with validation).
- Update background check and paperwork status using HR Inbox + NetStudy.
- Pre-fill Staffing Pattern with clean, validated data.
- Support Training Tracker updates (new hire rows, basic fields).
- Standardize naming and formatting across trackers.
- Run nightly reconciliation so BrightPath starts each day with clean data.`,
      },
      {
        id: "cent_phase2_3",
        title: "Phase 2 & 3 – Retained Tasks & Automation",
        body: `BrightPath retains:
- Onsite orientation and supervision.
- CPR/Med/clinical evaluations.
- High-acuity staffing decisions and last-mile schedule choices.

Automation candidates (after cleanup):
- Automated readiness signals through the workflow.
- Background check alerts.
- Supervisor/site assignment logic based on rules.
- Email account creation and basic provisioning.
- Compliance alerts (CPR, Med Admin, background renewals).`,
      },
      {
        id: "cent_structure",
        title: "Structural Fixes & 12-Week Plan",
        body: `Required structural fixes:
- Remove merged cells and complex formatting that break formulas.
- Standardize date formats and dropdown values.
- Introduce a unique identifier across systems (email or employee ID).
- Separate "data tables" from human-friendly summary views.

12-week plan (high level):
- Weeks 1–2: Finalize maps, RACIs, and rules (DONE in our docs).
- Weeks 3–6: Shadow mode – Pathfinder mirrors work in parallel and proves accuracy.
- Weeks 7–10: Official cutover – Pathfinder owns tracker maintenance.
- Weeks 11–12: Introduce automation to replace manual data movement.`,
      },
    ],
  },
];

const BrightPathDashboard: React.FC = () => {
  const [activeKey, setActiveKey] = useState<SectionKey>("architecture");
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>(
    {}
  );
  const [search, setSearch] = useState("");

  const activeArtifact = artifacts.find((a) => a.key === activeKey)!;

  const toggleAccordion = (id: string) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredSections = activeArtifact.sections.filter((section) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      section.title.toLowerCase().includes(q) ||
      section.body.toLowerCase().includes(q)
    );
  });

  const downloadTableAsExcel = (
    title: string,
    headers: string[],
    rows: string[][]
  ) => {
    // Create worksheet data
    const worksheetData = [headers, ...rows];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Set column widths
    const columnWidths = headers.map((_, idx) => {
      const maxLength = Math.max(
        headers[idx].length,
        ...rows.map((row) => (row[idx] || "").length)
      );
      return { wch: Math.min(maxLength + 2, 50) };
    });
    worksheet["!cols"] = columnWidths;

    // Create workbook and add worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "RACI Matrix");

    // Generate filename from title
    const filename = title
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .replace(/\s+/g, "_")
      .substring(0, 31) || "RACI_Table";

    // Download file
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  };


  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#0D1117', color: '#FFFFFF' }}>
      {/* Sidebar */}
      <aside 
        className="w-72 backdrop-blur-md p-4 flex flex-col gap-4"
        style={{ 
          backgroundColor: '#1A2A44',
          borderRight: '1px solid rgba(54, 196, 196, 0.2)'
        }}
      >
        <div className="mb-4">
          <h1 className="text-xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-montserrat)' }}>
            BrightPath Ops
          </h1>
          <p className="text-xs" style={{ color: '#DCE1E7' }}>
            Current-State Analysis & Centralization Plan
          </p>
        </div>

        <nav className="flex flex-col gap-1">
          {artifacts.map((artifact) => (
            <button
              key={artifact.key}
              onClick={() => setActiveKey(artifact.key)}
              className="text-left px-3 py-2 rounded-lg text-sm transition shadow-md"
              style={{
                backgroundColor: activeKey === artifact.key ? '#36C4C4' : 'transparent',
                color: activeKey === artifact.key ? '#FFFFFF' : '#DCE1E7'
              }}
              onMouseEnter={(e) => {
                if (activeKey !== artifact.key) {
                  e.currentTarget.style.backgroundColor = 'rgba(26, 42, 68, 0.8)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeKey !== artifact.key) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              {artifact.label}
            </button>
          ))}
        </nav>

        <div className="mt-4">
          <label className="block text-xs mb-1" style={{ color: '#DCE1E7' }}>
            Search within section
          </label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Type to filter..."
            className="w-full text-sm rounded-md px-3 py-2 focus:outline-none focus:ring-2"
            style={{ 
              color: '#FFFFFF',
              backgroundColor: 'rgba(13, 17, 23, 0.8)',
              border: '1px solid rgba(54, 196, 196, 0.3)'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#36C4C4';
              e.currentTarget.style.boxShadow = '0 0 0 2px rgba(54, 196, 196, 0.3)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'rgba(54, 196, 196, 0.3)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
        </div>

        <div className="mt-auto pt-4 border-t text-[11px]" style={{ borderColor: 'rgba(54, 196, 196, 0.2)', color: '#DCE1E7' }}>
          <p>SUMMIT360 • Pathfinder Ops</p>
          <p>Designed for Lynn's Dec 8 review.</p>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <header className="mb-6">
          <h2 className="text-2xl font-bold mb-1" style={{ fontFamily: 'var(--font-montserrat)' }}>
            {activeArtifact.label}
          </h2>
          <p className="text-sm max-w-2xl" style={{ color: '#DCE1E7' }}>
            {activeArtifact.description}
          </p>
        </header>

        {/* Sections as accordions */}
        <section className="space-y-4">
          {filteredSections.length === 0 && (
            <p className="text-sm" style={{ color: '#DCE1E7' }}>
              No matches found for your search in this section.
            </p>
          )}

          {filteredSections.map((section) => {
            const isOpen = openAccordions[section.id] ?? true;
            return (
              <div
                key={section.id}
                className="border rounded-xl overflow-hidden transition"
                style={{
                  backgroundColor: 'rgba(26, 42, 68, 0.5)',
                  borderColor: 'rgba(54, 196, 196, 0.2)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(26, 42, 68, 0.7)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(26, 42, 68, 0.5)';
                }}
              >
                <button
                  onClick={() => toggleAccordion(section.id)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left transition"
                  style={{ color: '#FFFFFF' }}
                >
                  <div>
                    <h3 className="text-sm font-semibold" style={{ fontFamily: 'var(--font-montserrat)' }}>
                      {section.title}
                    </h3>
                  </div>
                  <span className="text-xs" style={{ color: '#DCE1E7' }}>
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-sm whitespace-pre-line" style={{ color: '#DCE1E7', lineHeight: '1.5' }}>
                    {section.body}
                    {section.tableHeaders && section.tableRows && (
                      <div className="mt-4">
                        <div className="mb-3 flex justify-end">
                          <button
                            onClick={() =>
                              downloadTableAsExcel(
                                section.title,
                                section.tableHeaders!,
                                section.tableRows!
                              )
                            }
                            className="px-4 py-2 rounded-lg text-xs font-semibold transition shadow-md"
                            style={{
                              backgroundColor: '#36C4C4',
                              color: '#FFFFFF',
                              fontFamily: 'var(--font-montserrat)',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#2BA8A8';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = '#36C4C4';
                            }}
                          >
                            📥 Download Excel
                          </button>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="min-w-full text-xs" style={{ borderCollapse: "collapse" }}>
                            <thead>
                              <tr>
                                {section.tableHeaders.map((header) => (
                                  <th
                                    key={header}
                                    style={{
                                      border: "1px solid rgba(54, 196, 196, 0.3)",
                                      padding: "0.5rem 0.75rem",
                                      backgroundColor: "#1A2A44",
                                      color: "#FFFFFF",
                                      textAlign: "left",
                                      fontFamily: "var(--font-montserrat)",
                                      fontWeight: 600,
                                    }}
                                  >
                                    {header}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {section.tableRows.map((row, idx) => (
                                <tr key={idx}>
                                  {row.map((cell, cIdx) => (
                                    <td
                                      key={cIdx}
                                      style={{
                                        border: "1px solid rgba(54, 196, 196, 0.2)",
                                        padding: "0.4rem 0.75rem",
                                        backgroundColor: idx % 2 === 0 ? "rgba(13, 17, 23, 0.9)" : "rgba(26, 42, 68, 0.8)",
                                        whiteSpace: cIdx === 0 ? "normal" : "nowrap",
                                      }}
                                    >
                                      {cell}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </section>
      </main>
    </div>
  );
};

export default BrightPathDashboard;



