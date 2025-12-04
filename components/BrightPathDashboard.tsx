"use client";

import React, { useState } from "react";
import Link from "next/link";
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
        id: "wf_candidate_entry",
        title: "0. Candidate Enters System",
        body: `→ Recruiters (Jeremy & Tyler) manage candidate in JazzHR

     - Stages frequently not updated → data unreliable
     - Offer Sent should be entered (often is not)
     - Offer Accepted should be marked (often is not)

Impact:

Training, HR, and Scheduling have no reliable signal of when someone is officially hired.`,
      },
      {
        id: "wf_offer_paperwork",
        title: "1. Offer & Paperwork Stage",
        body: `IDEAL FLOW (What Should Happen):

[JazzHR] → [Offer Sent] → [DocuSign packet]
         (automated trigger)

ACTUAL FLOW (What Really Happens):

[JazzHR] → (often fails) ↘
                          [HR Inbox] receives manual notifications

What Actually Happens:
• Recruiters manually email HR and supervisors.
• Emma checks the HR inbox constantly for paperwork updates.
• DocuSign completion triggers an email, not a system update.

Pain Points:
• No automated bridge JazzHR → HR.
• Supervisors often don't know a hire is coming.
• Emma must reconcile recruiter messages against JazzHR manually.`,
      },
      {
        id: "wf_paperwork_completion",
        title: "2. Paperwork Completion → Initiation of HR Workflow",
        body: `Once DocuSign is completed:

[HR Inbox] → Emma manually checks:

    - W4
    - I9
    - Direct Deposit
    - Policies
    - Acknowledgments
    - Required DHS forms

Emma then:

→ Manually adds new hire to the New Hire Onboarding Tracker

→ Manually checks NetStudy background check status

→ Manually begins email creation, folder creation, CHR prep

Pain Points:
• Zero automation.
• If recruiters forget to notify her, hires are invisible.
• Background checks come through a separate DHS system not connected to anything.`,
      },
      {
        id: "wf_background_check",
        title: "3. Background Check & DHS / NetStudy Processing",
        body: `[DHS/NetStudy] → Email notification → HR Inbox → Emma

Emma manually checks:

- "Pass," "Pending," or "More Info Required"

- Fingerprint scheduling

- Temporary clearance vs. full clearance

She updates the New Hire Tracker manually.

Downstream impact:
• Training cannot "green" the employee without the completion.
• Scheduling cannot slot them until Isaac marks them ready.`,
      },
      {
        id: "wf_tracker_entry",
        title: "4. New Hire Onboarding Tracker Entry (HR → System)",
        body: `Emma updates fields such as:

- First & Last Name
- Email
- Phone
- Primary Site (often unclear)
- Supervisor (frequently wrong)
- Position Type (Resi/UBS)
- Background check status
- Paperwork completion
- Start date (often missing)

Pain Points Identified in Transcripts:
• Supervisors change frequently → wrong in tracker.
• Recruiters frequently provide outdated site assignment.
• Missing start dates → scheduling chaos.
• Inconsistent naming conventions → folder mismatch.
• No unique identifier → confusion across systems.`,
      },
      {
        id: "wf_staffing_pattern",
        title: "5. Site Assignment & Staffing Pattern (Secellia)",
        body: `Once a hire is known (often via HR inbox alert, not JazzHR):

Emma notifies Secellia → "This person was hired"

Secellia:

→ Checks offer type (Resi vs UBS)

→ Finds the correct Staffing Pattern sheet

→ Manually validates job offer info

→ Manually adds the employee to the appropriate site roster

→ Manually estimates shift placement

→ May contact supervisors for verification

Pain Points:
• Staffing Patterns split (UBS vs Residential).
• Recruiter → HR → Scheduler communication flow is inconsistent.
• No single system indicates where the employee actually belongs.
• Start dates often "float" because data is missing.`,
      },
      {
        id: "wf_training_tracker",
        title: "6. Training Tracker Entry (Isaac & Laura)",
        body: `Training team pulls from:

→ New Hire Onboarding Tracker
→ Staffing Pattern (Primary Site)
→ Email from HR (informal pings)
→ Word-of-mouth or Slack messages

Isaac/Laura manually add:

- Hire name
- Supervisor
- Primary site
- Whether they are "green"
- Required trainings (CPR, Med Admin, Orientation)
- Completion dates

Critical role:

Isaac marks an employee "green."

This is the true readiness signal for the entire organization.

If Isaac cannot find hire data (common), the process stalls.

Training Pain Points:
• Wrong supervisor assignment → wrong training plan.
• Missing start dates → training mismatches.
• No system integrates training completion → must manually check CHR.`,
      },
      {
        id: "wf_supervisor_orientation",
        title: "7. Supervisor & Orientation Logic",
        body: `Training must coordinate:

→ Orientation groups
→ Site-specific training
→ CPR / Med Pass
→ Initial shadow shifts

Supervisors often do not reply or reply late.

Impact:

Training cannot accurately green-light the employee.`,
      },
      {
        id: "wf_google_drive",
        title: "8. Google Drive Folder Creation (HR)",
        body: `Once HR sees training & background check progress:

Emma manually creates:

    - Employee folder
    - Subfolders for paperwork & training
    - File naming based on site/supervisor (often inaccurate)

Pain Points:
• Incorrect folder naming due to bad upstream data.
• Google Drive is temporary — CHR will eventually replace most storage.
• Manual drag-and-drop of all documents.`,
      },
      {
        id: "wf_chr_creation",
        title: "9. CHR Profile Creation (HR)",
        body: `- Name
- Email
- DOB
- Address
- Supervisor
- Site
- Pay rate
- Position type
- Paperwork status
- Orientation status
- Background check status

Emma manually enters everything.

Critical Issue:

CHR must match Training Tracker, but since both are manual, mismatches are constant.`,
      },
      {
        id: "wf_scheduling",
        title: "10. Scheduling (WIW)",
        body: `Once green + staffed:

Training says "Ready"

HR confirms documents

Secellia adds to When I Work

WIW requires:

- Email
- Position
- Primary site
- Schedule blocks

Secellia manually builds:

→ December master schedule
→ Weekly backfills
→ Daily gap coverage

Pain Points:
• Wrong supervisor or site cascades into bad schedules.
• If HR or Training delays data entry, scheduling is pushed last-minute.
• If a hire is green late, schedule must be rebalanced manually.`,
      },
      {
        id: "wf_day1_onboarding",
        title: "11. Day 1 Onboarding + Supervisor Oversight",
        body: `Supervisor validates:

- Arrival
- Orientation
- Shadow shifts
- Site-specific requirements

They report back:

→ Training
→ HR
→ Scheduler

But reporting is inconsistent, causing:

- Delayed CHR updates
- Delayed training completion entries
- Missed compliance deadlines`,
      },
      {
        id: "wf_ongoing_compliance",
        title: "12. Ongoing Compliance & Monthly Training Updates",
        body: `Training Team + HR must:

- Update CPR expirations
- Update background check renewals
- Update Med Admin renewals
- Assign new trainings
- Perform manual cross-checks with CHR

Pain Points:
• Monthly tracking is 100% manual
• Supervisor signatures are inconsistent
• Wrong start dates break renewal windows`,
      },
      {
        id: "wf_cross_system_pain",
        title: "🚨 Cross-System Pain Points (Summary)",
        body: `1. No automated trigger from JazzHR → HR
2. HR Inbox is the accidental source of truth
3. New Hire Tracker is manual, inconsistent, and incomplete
4. Staffing Pattern has two versions (UBS & Resi)
5. Training depends on multiple systems + human memory
6. "Green" status has no formal trigger
7. Supervisor info is wrong 30–40% of the time
8. CHR requires full re-entry of data
9. WIW scheduling depends on all upstream systems
10. Merge cells & formatting break automations
11. No unique identifier (email created too late)
12. High turnover → high volume → no system can keep up manually`,
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
          <Link
            href="/brightpath-visuals"
            className="text-left px-3 py-2 rounded-lg text-sm transition shadow-md"
            style={{
              backgroundColor: "transparent",
              color: "#DCE1E7",
              border: "1px solid rgba(54, 196, 196, 0.2)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(26, 42, 68, 0.8)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            Top Level View
          </Link>
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
            const isCriticalIssue = section.id === 'wf_candidate_entry';
            const isSummarySection = section.id === 'wf_cross_system_pain';
            const isFlowDiagram = section.id === 'wf_offer_paperwork' || section.id === 'wf_paperwork_completion' || section.id === 'wf_background_check' || section.id === 'wf_tracker_entry' || section.id === 'wf_staffing_pattern' || section.id === 'wf_training_tracker' || section.id === 'wf_supervisor_orientation' || section.id === 'wf_google_drive' || section.id === 'wf_chr_creation' || section.id === 'wf_scheduling' || section.id === 'wf_day1_onboarding' || section.id === 'wf_ongoing_compliance' || section.id === 'wf_cross_system_pain' || section.id === 'wf_overview' || section.id === 'wf_detailed' || section.id === 'wf_bottlenecks';
            return (
              <div
                key={section.id}
                className="border rounded-xl overflow-hidden transition"
                style={{
                  backgroundColor: isCriticalIssue 
                    ? 'rgba(220, 38, 38, 0.1)' 
                    : isSummarySection
                    ? 'rgba(220, 38, 38, 0.15)'
                    : isFlowDiagram 
                    ? 'rgba(251, 191, 36, 0.1)' 
                    : 'rgba(26, 42, 68, 0.5)',
                  borderColor: isCriticalIssue 
                    ? 'rgba(239, 68, 68, 0.5)' 
                    : isSummarySection
                    ? 'rgba(239, 68, 68, 0.7)'
                    : isFlowDiagram 
                    ? 'rgba(251, 191, 36, 0.5)' 
                    : 'rgba(54, 196, 196, 0.2)',
                  borderWidth: (isCriticalIssue || isFlowDiagram || isSummarySection) ? '2px' : '1px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = isCriticalIssue 
                    ? 'rgba(220, 38, 38, 0.15)' 
                    : isSummarySection
                    ? 'rgba(220, 38, 38, 0.2)'
                    : isFlowDiagram 
                    ? 'rgba(251, 191, 36, 0.15)' 
                    : 'rgba(26, 42, 68, 0.7)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = isCriticalIssue 
                    ? 'rgba(220, 38, 38, 0.1)' 
                    : isSummarySection
                    ? 'rgba(220, 38, 38, 0.15)'
                    : isFlowDiagram 
                    ? 'rgba(251, 191, 36, 0.1)' 
                    : 'rgba(26, 42, 68, 0.5)';
                }}
              >
                <button
                  onClick={() => toggleAccordion(section.id)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left transition"
                  style={{ color: '#FFFFFF' }}
                >
                  <div className="flex items-center gap-2">
                    {isCriticalIssue && (
                      <span className="text-red-400" style={{ fontSize: '0.875rem' }}>⚠️</span>
                    )}
                    {isSummarySection && (
                      <span className="text-red-400" style={{ fontSize: '0.875rem' }}>🚨</span>
                    )}
                    {isFlowDiagram && (
                      <span className="text-amber-400" style={{ fontSize: '0.875rem' }}>🔄</span>
                    )}
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
                    {isCriticalIssue ? (
                      <div>
                        <div className="mb-3">
                          <div className="text-base font-semibold mb-2" style={{ color: '#FCA5A5' }}>
                            → Recruiters (Jeremy & Tyler) manage candidate in JazzHR
                          </div>
                          <ul className="list-disc list-inside space-y-1 ml-2" style={{ color: '#FEE2E2' }}>
                            <li>Stages frequently not updated → data unreliable</li>
                            <li>Offer Sent should be entered (often is not)</li>
                            <li>Offer Accepted should be marked (often is not)</li>
                          </ul>
                        </div>
                        <div className="mt-4 pt-3 border-t" style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}>
                          <div className="font-semibold mb-2" style={{ color: '#FCA5A5' }}>Impact:</div>
                          <div style={{ color: '#FEE2E2' }}>
                            Training, HR, and Scheduling have no reliable signal of when someone is officially hired.
                          </div>
                        </div>
                      </div>
                    ) : isFlowDiagram ? (
                      section.id === 'wf_background_check' ? (
                        <div className="space-y-6">
                          {/* Process Flow */}
                          <div>
                            <div className="font-semibold mb-3 text-base" style={{ color: '#FCA5A5' }}>
                              Background Check Process:
                            </div>
                            <div className="flex items-center gap-3 flex-wrap mb-4" style={{ fontFamily: 'monospace' }}>
                              <div className="px-4 py-2 rounded-lg border" style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', borderColor: 'rgba(239, 68, 68, 0.5)' }}>
                                [DHS/NetStudy]
                              </div>
                              <span className="text-lg">→</span>
                              <div className="px-4 py-2 rounded-lg border" style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', borderColor: 'rgba(239, 68, 68, 0.5)' }}>
                                Email notification
                              </div>
                              <span className="text-lg">→</span>
                              <div className="px-4 py-2 rounded-lg border" style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', borderColor: 'rgba(239, 68, 68, 0.5)' }}>
                                [HR Inbox]
                              </div>
                              <span className="text-lg">→</span>
                              <div className="px-4 py-2 rounded-lg border" style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', borderColor: 'rgba(239, 68, 68, 0.5)' }}>
                                Emma
                              </div>
                            </div>
                          </div>

                          {/* Emma's Manual Checks */}
                          <div className="mt-4 pt-4 border-t" style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}>
                            <div className="font-semibold mb-3 text-base" style={{ color: '#FCA5A5' }}>
                              Emma manually checks:
                            </div>
                            <div className="space-y-2 ml-2">
                              <div className="flex items-start gap-2" style={{ color: '#FEE2E2' }}>
                                <span className="text-xs">•</span>
                                <span>"Pass," "Pending," or "More Info Required"</span>
                              </div>
                              <div className="flex items-start gap-2" style={{ color: '#FEE2E2' }}>
                                <span className="text-xs">•</span>
                                <span>Fingerprint scheduling</span>
                              </div>
                              <div className="flex items-start gap-2" style={{ color: '#FEE2E2' }}>
                                <span className="text-xs">•</span>
                                <span>Temporary clearance vs. full clearance</span>
                              </div>
                            </div>
                          </div>

                          {/* Manual Update */}
                          <div className="mt-4 pt-4 border-t" style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}>
                            <div className="flex items-start gap-2" style={{ color: '#FEE2E2' }}>
                              <span className="text-lg">→</span>
                              <span>She updates the New Hire Tracker manually.</span>
                            </div>
                          </div>

                          {/* Downstream Impact */}
                          <div className="mt-4 pt-4 border-t" style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}>
                            <div className="font-semibold mb-2 text-base" style={{ color: '#FCA5A5' }}>
                              Downstream impact:
                            </div>
                            <ul className="list-disc list-inside space-y-1.5 ml-2" style={{ color: '#FEE2E2' }}>
                              <li>Training cannot "green" the employee without the completion.</li>
                              <li>Scheduling cannot slot them until Isaac marks them ready.</li>
                            </ul>
                          </div>
                        </div>
                      ) : section.id === 'wf_tracker_entry' ? (
                        <div className="space-y-6">
                          {/* Process Flow */}
                          <div>
                            <div className="font-semibold mb-3 text-base" style={{ color: '#FCA5A5' }}>
                              Emma updates fields in New Hire Onboarding Tracker:
                            </div>
                            <div className="flex items-center gap-3 flex-wrap mb-4" style={{ fontFamily: 'monospace' }}>
                              <div className="px-4 py-2 rounded-lg border" style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', borderColor: 'rgba(239, 68, 68, 0.5)' }}>
                                Emma
                              </div>
                              <span className="text-lg">→</span>
                              <div className="px-4 py-2 rounded-lg border" style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', borderColor: 'rgba(239, 68, 68, 0.5)' }}>
                                [New Hire Onboarding Tracker]
                              </div>
                            </div>
                          </div>

                          {/* Fields Emma Updates */}
                          <div className="mt-4 pt-4 border-t" style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}>
                            <div className="font-semibold mb-3 text-base" style={{ color: '#FCA5A5' }}>
                              Fields updated:
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ml-2">
                              <div className="flex items-start gap-2" style={{ color: '#FEE2E2' }}>
                                <span className="text-xs">•</span>
                                <span>First & Last Name</span>
                              </div>
                              <div className="flex items-start gap-2" style={{ color: '#FEE2E2' }}>
                                <span className="text-xs">•</span>
                                <span>Email</span>
                              </div>
                              <div className="flex items-start gap-2" style={{ color: '#FEE2E2' }}>
                                <span className="text-xs">•</span>
                                <span>Phone</span>
                              </div>
                              <div className="flex items-start gap-2" style={{ color: '#FCA5A5' }}>
                                <span className="text-xs">•</span>
                                <span>Primary Site <span className="text-xs italic">(often unclear)</span></span>
                              </div>
                              <div className="flex items-start gap-2" style={{ color: '#FCA5A5' }}>
                                <span className="text-xs">•</span>
                                <span>Supervisor <span className="text-xs italic">(frequently wrong)</span></span>
                              </div>
                              <div className="flex items-start gap-2" style={{ color: '#FEE2E2' }}>
                                <span className="text-xs">•</span>
                                <span>Position Type (Resi/UBS)</span>
                              </div>
                              <div className="flex items-start gap-2" style={{ color: '#FEE2E2' }}>
                                <span className="text-xs">•</span>
                                <span>Background check status</span>
                              </div>
                              <div className="flex items-start gap-2" style={{ color: '#FEE2E2' }}>
                                <span className="text-xs">•</span>
                                <span>Paperwork completion</span>
                              </div>
                              <div className="flex items-start gap-2" style={{ color: '#FCA5A5' }}>
                                <span className="text-xs">•</span>
                                <span>Start date <span className="text-xs italic">(often missing)</span></span>
                              </div>
                            </div>
                          </div>

                          {/* Pain Points */}
                          <div className="mt-4 pt-4 border-t" style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}>
                            <div className="font-semibold mb-2 text-base" style={{ color: '#FCA5A5' }}>
                              Pain Points Identified in Transcripts:
                            </div>
                            <ul className="list-disc list-inside space-y-1.5 ml-2" style={{ color: '#FEE2E2' }}>
                              <li>Supervisors change frequently → wrong in tracker.</li>
                              <li>Recruiters frequently provide outdated site assignment.</li>
                              <li>Missing start dates → scheduling chaos.</li>
                              <li>Inconsistent naming conventions → folder mismatch.</li>
                              <li>No unique identifier → confusion across systems.</li>
                            </ul>
                          </div>
                        </div>
                      ) : section.id === 'wf_staffing_pattern' ? (
                        <div className="space-y-6">
                          {/* Process Flow */}
                          <div>
                            <div className="font-semibold mb-3 text-base" style={{ color: '#FCA5A5' }}>
                              Once a hire is known (often via HR inbox alert, not JazzHR):
                            </div>
                            <div className="flex items-center gap-3 flex-wrap mb-4" style={{ fontFamily: 'monospace' }}>
                              <div className="px-4 py-2 rounded-lg border" style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', borderColor: 'rgba(239, 68, 68, 0.5)' }}>
                                Emma
                              </div>
                              <span className="text-lg">→</span>
                              <div className="px-4 py-2 rounded-lg border" style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', borderColor: 'rgba(239, 68, 68, 0.5)' }}>
                                notifies Secellia
                              </div>
                              <div className="text-xs self-center italic" style={{ color: '#FCA5A5' }}>
                                "This person was hired"
                              </div>
                            </div>
                          </div>

                          {/* Secellia's Manual Tasks */}
                          <div className="mt-4 pt-4 border-t" style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}>
                            <div className="font-semibold mb-3 text-base" style={{ color: '#FCA5A5' }}>
                              Secellia:
                            </div>
                            <div className="space-y-2 ml-2">
                              <div className="flex items-start gap-2" style={{ color: '#FEE2E2' }}>
                                <span className="text-lg">→</span>
                                <span>Checks offer type (Resi vs UBS)</span>
                              </div>
                              <div className="flex items-start gap-2" style={{ color: '#FEE2E2' }}>
                                <span className="text-lg">→</span>
                                <span>Finds the correct Staffing Pattern sheet</span>
                              </div>
                              <div className="flex items-start gap-2" style={{ color: '#FEE2E2' }}>
                                <span className="text-lg">→</span>
                                <span>Manually validates job offer info</span>
                              </div>
                              <div className="flex items-start gap-2" style={{ color: '#FEE2E2' }}>
                                <span className="text-lg">→</span>
                                <span>Manually adds the employee to the appropriate site roster</span>
                              </div>
                              <div className="flex items-start gap-2" style={{ color: '#FEE2E2' }}>
                                <span className="text-lg">→</span>
                                <span>Manually estimates shift placement</span>
                              </div>
                              <div className="flex items-start gap-2" style={{ color: '#FEE2E2' }}>
                                <span className="text-lg">→</span>
                                <span>May contact supervisors for verification</span>
                              </div>
                            </div>
                          </div>

                          {/* Pain Points */}
                          <div className="mt-4 pt-4 border-t" style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}>
                            <div className="font-semibold mb-2 text-base" style={{ color: '#FCA5A5' }}>
                              Pain Points:
                            </div>
                            <ul className="list-disc list-inside space-y-1.5 ml-2" style={{ color: '#FEE2E2' }}>
                              <li>Staffing Patterns split (UBS vs Residential).</li>
                              <li>Recruiter → HR → Scheduler communication flow is inconsistent.</li>
                              <li>No single system indicates where the employee actually belongs.</li>
                              <li>Start dates often "float" because data is missing.</li>
                            </ul>
                          </div>
                        </div>
                      ) : section.id === 'wf_training_tracker' ? (
                        <div className="space-y-6">
                          {/* Data Sources */}
                          <div>
                            <div className="font-semibold mb-3 text-base" style={{ color: '#FCA5A5' }}>
                              Training team pulls from:
                            </div>
                            <div className="space-y-2 ml-2">
                              <div className="flex items-start gap-2" style={{ color: '#FEE2E2' }}>
                                <span className="text-lg">→</span>
                                <span>New Hire Onboarding Tracker</span>
                              </div>
                              <div className="flex items-start gap-2" style={{ color: '#FEE2E2' }}>
                                <span className="text-lg">→</span>
                                <span>Staffing Pattern (Primary Site)</span>
                              </div>
                              <div className="flex items-start gap-2" style={{ color: '#FEE2E2' }}>
                                <span className="text-lg">→</span>
                                <span>Email from HR (informal pings)</span>
                              </div>
                              <div className="flex items-start gap-2" style={{ color: '#FEE2E2' }}>
                                <span className="text-lg">→</span>
                                <span>Word-of-mouth or Slack messages</span>
                              </div>
                            </div>
                          </div>

                          {/* Isaac/Laura's Manual Tasks */}
                          <div className="mt-4 pt-4 border-t" style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}>
                            <div className="font-semibold mb-3 text-base" style={{ color: '#FCA5A5' }}>
                              Isaac/Laura manually add:
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ml-2">
                              <div className="flex items-start gap-2" style={{ color: '#FEE2E2' }}>
                                <span className="text-xs">•</span>
                                <span>Hire name</span>
                              </div>
                              <div className="flex items-start gap-2" style={{ color: '#FEE2E2' }}>
                                <span className="text-xs">•</span>
                                <span>Supervisor</span>
                              </div>
                              <div className="flex items-start gap-2" style={{ color: '#FEE2E2' }}>
                                <span className="text-xs">•</span>
                                <span>Primary site</span>
                              </div>
                              <div className="flex items-start gap-2" style={{ color: '#86EFAC' }}>
                                <span className="text-xs">•</span>
                                <span className="font-semibold">Whether they are "green"</span>
                              </div>
                              <div className="flex items-start gap-2" style={{ color: '#FEE2E2' }}>
                                <span className="text-xs">•</span>
                                <span>Required trainings (CPR, Med Admin, Orientation)</span>
                              </div>
                              <div className="flex items-start gap-2" style={{ color: '#FEE2E2' }}>
                                <span className="text-xs">•</span>
                                <span>Completion dates</span>
                              </div>
                            </div>
                          </div>

                          {/* Critical Role */}
                          <div className="mt-4 pt-4 border-t" style={{ borderColor: 'rgba(34, 197, 94, 0.3)' }}>
                            <div className="font-semibold mb-2 text-base" style={{ color: '#86EFAC' }}>
                              Critical role:
                            </div>
                            <div className="space-y-2 ml-2" style={{ color: '#D1FAE5' }}>
                              <div className="font-semibold">
                                Isaac marks an employee "green."
                              </div>
                              <div>
                                This is the true readiness signal for the entire organization.
                              </div>
                              <div className="text-sm italic">
                                If Isaac cannot find hire data (common), the process stalls.
                              </div>
                            </div>
                          </div>

                          {/* Training Pain Points */}
                          <div className="mt-4 pt-4 border-t" style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}>
                            <div className="font-semibold mb-2 text-base" style={{ color: '#FCA5A5' }}>
                              Training Pain Points:
                            </div>
                            <ul className="list-disc list-inside space-y-1.5 ml-2" style={{ color: '#FEE2E2' }}>
                              <li>Wrong supervisor assignment → wrong training plan.</li>
                              <li>Missing start dates → training mismatches.</li>
                              <li>No system integrates training completion → must manually check CHR.</li>
                            </ul>
                          </div>
                        </div>
                      ) : section.id === 'wf_supervisor_orientation' ? (
                        <div className="space-y-6">
                          {/* Training Coordination Requirements */}
                          <div>
                            <div className="font-semibold mb-3 text-base" style={{ color: '#FCA5A5' }}>
                              Training must coordinate:
                            </div>
                            <div className="space-y-2 ml-2">
                              <div className="flex items-start gap-2" style={{ color: '#FEE2E2' }}>
                                <span className="text-lg">→</span>
                                <span>Orientation groups</span>
                              </div>
                              <div className="flex items-start gap-2" style={{ color: '#FEE2E2' }}>
                                <span className="text-lg">→</span>
                                <span>Site-specific training</span>
                              </div>
                              <div className="flex items-start gap-2" style={{ color: '#FEE2E2' }}>
                                <span className="text-lg">→</span>
                                <span>CPR / Med Pass</span>
                              </div>
                              <div className="flex items-start gap-2" style={{ color: '#FEE2E2' }}>
                                <span className="text-lg">→</span>
                                <span>Initial shadow shifts</span>
                              </div>
                            </div>
                          </div>

                          {/* Supervisor Communication Issue */}
                          <div className="mt-4 pt-4 border-t" style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}>
                            <div className="font-semibold mb-2 text-base" style={{ color: '#FCA5A5' }}>
                              Supervisor Communication Issue:
                            </div>
                            <div className="ml-2" style={{ color: '#FEE2E2' }}>
                              Supervisors often do not reply or reply late.
                            </div>
                          </div>

                          {/* Impact */}
                          <div className="mt-4 pt-4 border-t" style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}>
                            <div className="font-semibold mb-2 text-base" style={{ color: '#FCA5A5' }}>
                              Impact:
                            </div>
                            <div className="ml-2 font-semibold" style={{ color: '#FEE2E2' }}>
                              Training cannot accurately green-light the employee.
                            </div>
                          </div>
                        </div>
                      ) : section.id === 'wf_google_drive' ? (
                        <div className="space-y-6">
                          {/* Process Flow */}
                          <div>
                            <div className="font-semibold mb-3 text-base" style={{ color: '#FCA5A5' }}>
                              Once HR sees training & background check progress:
                            </div>
                            <div className="flex items-center gap-3 flex-wrap mb-4" style={{ fontFamily: 'monospace' }}>
                              <div className="px-4 py-2 rounded-lg border" style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', borderColor: 'rgba(239, 68, 68, 0.5)' }}>
                                Training & Background Check Progress
                              </div>
                              <span className="text-lg">→</span>
                              <div className="px-4 py-2 rounded-lg border" style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', borderColor: 'rgba(239, 68, 68, 0.5)' }}>
                                Emma manually creates
                              </div>
                            </div>
                          </div>

                          {/* Emma's Manual Tasks */}
                          <div className="mt-4 pt-4 border-t" style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}>
                            <div className="font-semibold mb-3 text-base" style={{ color: '#FCA5A5' }}>
                              Emma manually creates:
                            </div>
                            <div className="space-y-2 ml-2">
                              <div className="flex items-start gap-2" style={{ color: '#FEE2E2' }}>
                                <span className="text-xs">•</span>
                                <span>Employee folder</span>
                              </div>
                              <div className="flex items-start gap-2" style={{ color: '#FEE2E2' }}>
                                <span className="text-xs">•</span>
                                <span>Subfolders for paperwork & training</span>
                              </div>
                              <div className="flex items-start gap-2" style={{ color: '#FCA5A5' }}>
                                <span className="text-xs">•</span>
                                <span>File naming based on site/supervisor <span className="text-xs italic">(often inaccurate)</span></span>
                              </div>
                            </div>
                          </div>

                          {/* Pain Points */}
                          <div className="mt-4 pt-4 border-t" style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}>
                            <div className="font-semibold mb-2 text-base" style={{ color: '#FCA5A5' }}>
                              Pain Points:
                            </div>
                            <ul className="list-disc list-inside space-y-1.5 ml-2" style={{ color: '#FEE2E2' }}>
                              <li>Incorrect folder naming due to bad upstream data.</li>
                              <li>Google Drive is temporary — CHR will eventually replace most storage.</li>
                              <li>Manual drag-and-drop of all documents.</li>
                            </ul>
                          </div>
                        </div>
                      ) : section.id === 'wf_chr_creation' ? (
                        <div className="space-y-6">
                          {/* Process Flow */}
                          <div>
                            <div className="font-semibold mb-3 text-base" style={{ color: '#FCA5A5' }}>
                              Emma manually enters into CHR:
                            </div>
                            <div className="flex items-center gap-3 flex-wrap mb-4" style={{ fontFamily: 'monospace' }}>
                              <div className="px-4 py-2 rounded-lg border" style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', borderColor: 'rgba(239, 68, 68, 0.5)' }}>
                                Emma
                              </div>
                              <span className="text-lg">→</span>
                              <div className="px-4 py-2 rounded-lg border" style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', borderColor: 'rgba(239, 68, 68, 0.5)' }}>
                                [CHR Profile]
                              </div>
                            </div>
                          </div>

                          {/* Fields Emma Enters */}
                          <div className="mt-4 pt-4 border-t" style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}>
                            <div className="font-semibold mb-3 text-base" style={{ color: '#FCA5A5' }}>
                              Fields entered:
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ml-2">
                              <div className="flex items-start gap-2" style={{ color: '#FEE2E2' }}>
                                <span className="text-xs">•</span>
                                <span>Name</span>
                              </div>
                              <div className="flex items-start gap-2" style={{ color: '#FEE2E2' }}>
                                <span className="text-xs">•</span>
                                <span>Email</span>
                              </div>
                              <div className="flex items-start gap-2" style={{ color: '#FEE2E2' }}>
                                <span className="text-xs">•</span>
                                <span>DOB</span>
                              </div>
                              <div className="flex items-start gap-2" style={{ color: '#FEE2E2' }}>
                                <span className="text-xs">•</span>
                                <span>Address</span>
                              </div>
                              <div className="flex items-start gap-2" style={{ color: '#FEE2E2' }}>
                                <span className="text-xs">•</span>
                                <span>Supervisor</span>
                              </div>
                              <div className="flex items-start gap-2" style={{ color: '#FEE2E2' }}>
                                <span className="text-xs">•</span>
                                <span>Site</span>
                              </div>
                              <div className="flex items-start gap-2" style={{ color: '#FEE2E2' }}>
                                <span className="text-xs">•</span>
                                <span>Pay rate</span>
                              </div>
                              <div className="flex items-start gap-2" style={{ color: '#FEE2E2' }}>
                                <span className="text-xs">•</span>
                                <span>Position type</span>
                              </div>
                              <div className="flex items-start gap-2" style={{ color: '#FEE2E2' }}>
                                <span className="text-xs">•</span>
                                <span>Paperwork status</span>
                              </div>
                              <div className="flex items-start gap-2" style={{ color: '#FEE2E2' }}>
                                <span className="text-xs">•</span>
                                <span>Orientation status</span>
                              </div>
                              <div className="flex items-start gap-2" style={{ color: '#FEE2E2' }}>
                                <span className="text-xs">•</span>
                                <span>Background check status</span>
                              </div>
                            </div>
                          </div>

                          {/* Critical Issue */}
                          <div className="mt-4 pt-4 border-t" style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}>
                            <div className="font-semibold mb-2 text-base" style={{ color: '#FCA5A5' }}>
                              Critical Issue:
                            </div>
                            <div className="ml-2 font-semibold" style={{ color: '#FEE2E2' }}>
                              CHR must match Training Tracker, but since both are manual, mismatches are constant.
                            </div>
                          </div>
                        </div>
                      ) : section.id === 'wf_scheduling' ? (
                        <div className="space-y-6">
                          {/* Process Flow */}
                          <div>
                            <div className="font-semibold mb-3 text-base" style={{ color: '#FCA5A5' }}>
                              Once green + staffed:
                            </div>
                            <div className="flex items-center gap-3 flex-wrap mb-4" style={{ fontFamily: 'monospace' }}>
                              <div className="px-4 py-2 rounded-lg border" style={{ backgroundColor: 'rgba(34, 197, 94, 0.2)', borderColor: 'rgba(34, 197, 94, 0.5)' }}>
                                Training says "Ready"
                              </div>
                              <span className="text-lg">→</span>
                              <div className="px-4 py-2 rounded-lg border" style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', borderColor: 'rgba(239, 68, 68, 0.5)' }}>
                                HR confirms documents
                              </div>
                              <span className="text-lg">→</span>
                              <div className="px-4 py-2 rounded-lg border" style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', borderColor: 'rgba(239, 68, 68, 0.5)' }}>
                                Secellia adds to [When I Work]
                              </div>
                            </div>
                          </div>

                          {/* WIW Requirements */}
                          <div className="mt-4 pt-4 border-t" style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}>
                            <div className="font-semibold mb-3 text-base" style={{ color: '#FCA5A5' }}>
                              WIW requires:
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ml-2">
                              <div className="flex items-start gap-2" style={{ color: '#FEE2E2' }}>
                                <span className="text-xs">•</span>
                                <span>Email</span>
                              </div>
                              <div className="flex items-start gap-2" style={{ color: '#FEE2E2' }}>
                                <span className="text-xs">•</span>
                                <span>Position</span>
                              </div>
                              <div className="flex items-start gap-2" style={{ color: '#FEE2E2' }}>
                                <span className="text-xs">•</span>
                                <span>Primary site</span>
                              </div>
                              <div className="flex items-start gap-2" style={{ color: '#FEE2E2' }}>
                                <span className="text-xs">•</span>
                                <span>Schedule blocks</span>
                              </div>
                            </div>
                          </div>

                          {/* Secellia's Manual Tasks */}
                          <div className="mt-4 pt-4 border-t" style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}>
                            <div className="font-semibold mb-3 text-base" style={{ color: '#FCA5A5' }}>
                              Secellia manually builds:
                            </div>
                            <div className="space-y-2 ml-2">
                              <div className="flex items-start gap-2" style={{ color: '#FEE2E2' }}>
                                <span className="text-lg">→</span>
                                <span>December master schedule</span>
                              </div>
                              <div className="flex items-start gap-2" style={{ color: '#FEE2E2' }}>
                                <span className="text-lg">→</span>
                                <span>Weekly backfills</span>
                              </div>
                              <div className="flex items-start gap-2" style={{ color: '#FEE2E2' }}>
                                <span className="text-lg">→</span>
                                <span>Daily gap coverage</span>
                              </div>
                            </div>
                          </div>

                          {/* Pain Points */}
                          <div className="mt-4 pt-4 border-t" style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}>
                            <div className="font-semibold mb-2 text-base" style={{ color: '#FCA5A5' }}>
                              Pain Points:
                            </div>
                            <ul className="list-disc list-inside space-y-1.5 ml-2" style={{ color: '#FEE2E2' }}>
                              <li>Wrong supervisor or site cascades into bad schedules.</li>
                              <li>If HR or Training delays data entry, scheduling is pushed last-minute.</li>
                              <li>If a hire is green late, schedule must be rebalanced manually.</li>
                            </ul>
                          </div>
                        </div>
                      ) : section.id === 'wf_day1_onboarding' ? (
                        <div className="space-y-6">
                          {/* Supervisor Validation */}
                          <div>
                            <div className="font-semibold mb-3 text-base" style={{ color: '#FCA5A5' }}>
                              Supervisor validates:
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ml-2">
                              <div className="flex items-start gap-2" style={{ color: '#FEE2E2' }}>
                                <span className="text-xs">•</span>
                                <span>Arrival</span>
                              </div>
                              <div className="flex items-start gap-2" style={{ color: '#FEE2E2' }}>
                                <span className="text-xs">•</span>
                                <span>Orientation</span>
                              </div>
                              <div className="flex items-start gap-2" style={{ color: '#FEE2E2' }}>
                                <span className="text-xs">•</span>
                                <span>Shadow shifts</span>
                              </div>
                              <div className="flex items-start gap-2" style={{ color: '#FEE2E2' }}>
                                <span className="text-xs">•</span>
                                <span>Site-specific requirements</span>
                              </div>
                            </div>
                          </div>

                          {/* Reporting Flow */}
                          <div className="mt-4 pt-4 border-t" style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}>
                            <div className="font-semibold mb-3 text-base" style={{ color: '#FCA5A5' }}>
                              They report back:
                            </div>
                            <div className="flex items-center gap-3 flex-wrap mb-2" style={{ fontFamily: 'monospace' }}>
                              <div className="px-4 py-2 rounded-lg border" style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', borderColor: 'rgba(239, 68, 68, 0.5)' }}>
                                Supervisor
                              </div>
                              <span className="text-lg">→</span>
                              <div className="px-4 py-2 rounded-lg border" style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', borderColor: 'rgba(239, 68, 68, 0.5)' }}>
                                Training
                              </div>
                              <span className="text-lg">→</span>
                              <div className="px-4 py-2 rounded-lg border" style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', borderColor: 'rgba(239, 68, 68, 0.5)' }}>
                                HR
                              </div>
                              <span className="text-lg">→</span>
                              <div className="px-4 py-2 rounded-lg border" style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', borderColor: 'rgba(239, 68, 68, 0.5)' }}>
                                Scheduler
                              </div>
                            </div>
                            <div className="text-xs italic mt-2 ml-2" style={{ color: '#FCA5A5' }}>
                              But reporting is inconsistent
                            </div>
                          </div>

                          {/* Problems Caused */}
                          <div className="mt-4 pt-4 border-t" style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}>
                            <div className="font-semibold mb-2 text-base" style={{ color: '#FCA5A5' }}>
                              Causing:
                            </div>
                            <ul className="list-disc list-inside space-y-1.5 ml-2" style={{ color: '#FEE2E2' }}>
                              <li>Delayed CHR updates</li>
                              <li>Delayed training completion entries</li>
                              <li>Missed compliance deadlines</li>
                            </ul>
                          </div>
                        </div>
                      ) : section.id === 'wf_ongoing_compliance' ? (
                        <div className="space-y-6">
                          {/* Process Flow */}
                          <div>
                            <div className="font-semibold mb-3 text-base" style={{ color: '#FCA5A5' }}>
                              Training Team + HR must:
                            </div>
                            <div className="flex items-center gap-3 flex-wrap mb-4" style={{ fontFamily: 'monospace' }}>
                              <div className="px-4 py-2 rounded-lg border" style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', borderColor: 'rgba(239, 68, 68, 0.5)' }}>
                                Training Team + HR
                              </div>
                              <span className="text-lg">→</span>
                              <div className="px-4 py-2 rounded-lg border" style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', borderColor: 'rgba(239, 68, 68, 0.5)' }}>
                                Manual Compliance Tracking
                              </div>
                            </div>
                          </div>

                          {/* Tasks */}
                          <div className="mt-4 pt-4 border-t" style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}>
                            <div className="font-semibold mb-3 text-base" style={{ color: '#FCA5A5' }}>
                              Tasks:
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ml-2">
                              <div className="flex items-start gap-2" style={{ color: '#FEE2E2' }}>
                                <span className="text-xs">•</span>
                                <span>Update CPR expirations</span>
                              </div>
                              <div className="flex items-start gap-2" style={{ color: '#FEE2E2' }}>
                                <span className="text-xs">•</span>
                                <span>Update background check renewals</span>
                              </div>
                              <div className="flex items-start gap-2" style={{ color: '#FEE2E2' }}>
                                <span className="text-xs">•</span>
                                <span>Update Med Admin renewals</span>
                              </div>
                              <div className="flex items-start gap-2" style={{ color: '#FEE2E2' }}>
                                <span className="text-xs">•</span>
                                <span>Assign new trainings</span>
                              </div>
                              <div className="flex items-start gap-2" style={{ color: '#FEE2E2' }}>
                                <span className="text-xs">•</span>
                                <span>Perform manual cross-checks with CHR</span>
                              </div>
                            </div>
                          </div>

                          {/* Pain Points */}
                          <div className="mt-4 pt-4 border-t" style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}>
                            <div className="font-semibold mb-2 text-base" style={{ color: '#FCA5A5' }}>
                              Pain Points:
                            </div>
                            <ul className="list-disc list-inside space-y-1.5 ml-2" style={{ color: '#FEE2E2' }}>
                              <li>Monthly tracking is 100% manual</li>
                              <li>Supervisor signatures are inconsistent</li>
                              <li>Wrong start dates break renewal windows</li>
                            </ul>
                          </div>
                        </div>
                      ) : section.id === 'wf_cross_system_pain' ? (
                        <div className="space-y-6">
                          {/* Pain Points Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="px-4 py-3 rounded-lg border" style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', borderColor: 'rgba(239, 68, 68, 0.4)' }}>
                              <div className="flex items-start gap-2">
                                <span className="font-semibold text-sm" style={{ color: '#FCA5A5' }}>1.</span>
                                <span className="text-sm" style={{ color: '#FEE2E2' }}>No automated trigger from JazzHR → HR</span>
                              </div>
                            </div>
                            <div className="px-4 py-3 rounded-lg border" style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', borderColor: 'rgba(239, 68, 68, 0.4)' }}>
                              <div className="flex items-start gap-2">
                                <span className="font-semibold text-sm" style={{ color: '#FCA5A5' }}>2.</span>
                                <span className="text-sm" style={{ color: '#FEE2E2' }}>HR Inbox is the accidental source of truth</span>
                              </div>
                            </div>
                            <div className="px-4 py-3 rounded-lg border" style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', borderColor: 'rgba(239, 68, 68, 0.4)' }}>
                              <div className="flex items-start gap-2">
                                <span className="font-semibold text-sm" style={{ color: '#FCA5A5' }}>3.</span>
                                <span className="text-sm" style={{ color: '#FEE2E2' }}>New Hire Tracker is manual, inconsistent, and incomplete</span>
                              </div>
                            </div>
                            <div className="px-4 py-3 rounded-lg border" style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', borderColor: 'rgba(239, 68, 68, 0.4)' }}>
                              <div className="flex items-start gap-2">
                                <span className="font-semibold text-sm" style={{ color: '#FCA5A5' }}>4.</span>
                                <span className="text-sm" style={{ color: '#FEE2E2' }}>Staffing Pattern has two versions (UBS & Resi)</span>
                              </div>
                            </div>
                            <div className="px-4 py-3 rounded-lg border" style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', borderColor: 'rgba(239, 68, 68, 0.4)' }}>
                              <div className="flex items-start gap-2">
                                <span className="font-semibold text-sm" style={{ color: '#FCA5A5' }}>5.</span>
                                <span className="text-sm" style={{ color: '#FEE2E2' }}>Training depends on multiple systems + human memory</span>
                              </div>
                            </div>
                            <div className="px-4 py-3 rounded-lg border" style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', borderColor: 'rgba(239, 68, 68, 0.4)' }}>
                              <div className="flex items-start gap-2">
                                <span className="font-semibold text-sm" style={{ color: '#FCA5A5' }}>6.</span>
                                <span className="text-sm" style={{ color: '#FEE2E2' }}>"Green" status has no formal trigger</span>
                              </div>
                            </div>
                            <div className="px-4 py-3 rounded-lg border" style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', borderColor: 'rgba(239, 68, 68, 0.4)' }}>
                              <div className="flex items-start gap-2">
                                <span className="font-semibold text-sm" style={{ color: '#FCA5A5' }}>7.</span>
                                <span className="text-sm" style={{ color: '#FEE2E2' }}>Supervisor info is wrong 30–40% of the time</span>
                              </div>
                            </div>
                            <div className="px-4 py-3 rounded-lg border" style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', borderColor: 'rgba(239, 68, 68, 0.4)' }}>
                              <div className="flex items-start gap-2">
                                <span className="font-semibold text-sm" style={{ color: '#FCA5A5' }}>8.</span>
                                <span className="text-sm" style={{ color: '#FEE2E2' }}>CHR requires full re-entry of data</span>
                              </div>
                            </div>
                            <div className="px-4 py-3 rounded-lg border" style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', borderColor: 'rgba(239, 68, 68, 0.4)' }}>
                              <div className="flex items-start gap-2">
                                <span className="font-semibold text-sm" style={{ color: '#FCA5A5' }}>9.</span>
                                <span className="text-sm" style={{ color: '#FEE2E2' }}>WIW scheduling depends on all upstream systems</span>
                              </div>
                            </div>
                            <div className="px-4 py-3 rounded-lg border" style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', borderColor: 'rgba(239, 68, 68, 0.4)' }}>
                              <div className="flex items-start gap-2">
                                <span className="font-semibold text-sm" style={{ color: '#FCA5A5' }}>10.</span>
                                <span className="text-sm" style={{ color: '#FEE2E2' }}>Merge cells & formatting break automations</span>
                              </div>
                            </div>
                            <div className="px-4 py-3 rounded-lg border" style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', borderColor: 'rgba(239, 68, 68, 0.4)' }}>
                              <div className="flex items-start gap-2">
                                <span className="font-semibold text-sm" style={{ color: '#FCA5A5' }}>11.</span>
                                <span className="text-sm" style={{ color: '#FEE2E2' }}>No unique identifier (email created too late)</span>
                              </div>
                            </div>
                            <div className="px-4 py-3 rounded-lg border" style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', borderColor: 'rgba(239, 68, 68, 0.4)' }}>
                              <div className="flex items-start gap-2">
                                <span className="font-semibold text-sm" style={{ color: '#FCA5A5' }}>12.</span>
                                <span className="text-sm" style={{ color: '#FEE2E2' }}>High turnover → high volume → no system can keep up manually</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : section.id === 'wf_paperwork_completion' ? (
                        <div className="space-y-6">
                          {/* Process Flow */}
                          <div>
                            <div className="font-semibold mb-3 text-base" style={{ color: '#FCA5A5' }}>
                              Once DocuSign is completed:
                            </div>
                            <div className="flex items-center gap-3 flex-wrap mb-4" style={{ fontFamily: 'monospace' }}>
                              <div className="px-4 py-2 rounded-lg border" style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', borderColor: 'rgba(239, 68, 68, 0.5)' }}>
                                [HR Inbox]
                              </div>
                              <span className="text-lg">→</span>
                              <div className="px-4 py-2 rounded-lg border" style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', borderColor: 'rgba(239, 68, 68, 0.5)' }}>
                                Emma manually checks
                              </div>
                            </div>
                            
                            {/* Checklist */}
                            <div className="ml-4 mt-3 space-y-1.5">
                              <div className="flex items-center gap-2" style={{ color: '#FEE2E2' }}>
                                <span className="text-xs">•</span>
                                <span>W4</span>
                              </div>
                              <div className="flex items-center gap-2" style={{ color: '#FEE2E2' }}>
                                <span className="text-xs">•</span>
                                <span>I9</span>
                              </div>
                              <div className="flex items-center gap-2" style={{ color: '#FEE2E2' }}>
                                <span className="text-xs">•</span>
                                <span>Direct Deposit</span>
                              </div>
                              <div className="flex items-center gap-2" style={{ color: '#FEE2E2' }}>
                                <span className="text-xs">•</span>
                                <span>Policies</span>
                              </div>
                              <div className="flex items-center gap-2" style={{ color: '#FEE2E2' }}>
                                <span className="text-xs">•</span>
                                <span>Acknowledgments</span>
                              </div>
                              <div className="flex items-center gap-2" style={{ color: '#FEE2E2' }}>
                                <span className="text-xs">•</span>
                                <span>Required DHS forms</span>
                              </div>
                            </div>
                          </div>

                          {/* Emma's Manual Tasks */}
                          <div className="mt-4 pt-4 border-t" style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}>
                            <div className="font-semibold mb-3 text-base" style={{ color: '#FCA5A5' }}>
                              Emma then:
                            </div>
                            <div className="space-y-2 ml-2">
                              <div className="flex items-start gap-2" style={{ color: '#FEE2E2' }}>
                                <span className="text-lg">→</span>
                                <span>Manually adds new hire to the New Hire Onboarding Tracker</span>
                              </div>
                              <div className="flex items-start gap-2" style={{ color: '#FEE2E2' }}>
                                <span className="text-lg">→</span>
                                <span>Manually checks NetStudy background check status</span>
                              </div>
                              <div className="flex items-start gap-2" style={{ color: '#FEE2E2' }}>
                                <span className="text-lg">→</span>
                                <span>Manually begins email creation, folder creation, CHR prep</span>
                              </div>
                            </div>
                          </div>

                          {/* Pain Points */}
                          <div className="mt-4 pt-4 border-t" style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}>
                            <div className="font-semibold mb-2 text-base" style={{ color: '#FCA5A5' }}>
                              Pain Points:
                            </div>
                            <ul className="list-disc list-inside space-y-1.5 ml-2" style={{ color: '#FEE2E2' }}>
                              <li>Zero automation.</li>
                              <li>If recruiters forget to notify her, hires are invisible.</li>
                              <li>Background checks come through a separate DHS system not connected to anything.</li>
                            </ul>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {/* Ideal Flow */}
                          <div>
                            <div className="font-semibold mb-3 text-base" style={{ color: '#86EFAC' }}>
                              ✓ IDEAL FLOW (What Should Happen):
                            </div>
                            <div className="flex items-center gap-3 flex-wrap mb-2" style={{ fontFamily: 'monospace' }}>
                              <div className="px-4 py-2 rounded-lg border" style={{ backgroundColor: 'rgba(54, 196, 196, 0.2)', borderColor: 'rgba(54, 196, 196, 0.5)' }}>
                                [JazzHR]
                              </div>
                              <span className="text-lg">→</span>
                              <div className="px-4 py-2 rounded-lg border" style={{ backgroundColor: 'rgba(54, 196, 196, 0.2)', borderColor: 'rgba(54, 196, 196, 0.5)' }}>
                                [Offer Sent]
                              </div>
                              <span className="text-lg">→</span>
                              <div className="px-4 py-2 rounded-lg border" style={{ backgroundColor: 'rgba(54, 196, 196, 0.2)', borderColor: 'rgba(54, 196, 196, 0.5)' }}>
                                [DocuSign packet]
                              </div>
                            </div>
                            <div className="text-xs italic" style={{ color: '#86EFAC' }}>
                              (automated trigger)
                            </div>
                          </div>

                          {/* Actual Flow */}
                          <div>
                            <div className="font-semibold mb-3 text-base" style={{ color: '#FCA5A5' }}>
                              ✗ ACTUAL FLOW (What Really Happens):
                            </div>
                            <div className="flex items-start gap-3 flex-wrap mb-2" style={{ fontFamily: 'monospace' }}>
                              <div className="px-4 py-2 rounded-lg border" style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', borderColor: 'rgba(239, 68, 68, 0.5)' }}>
                                [JazzHR]
                              </div>
                              <div className="flex flex-col items-center gap-1">
                                <span className="text-lg">→</span>
                                <span className="text-xs italic" style={{ color: '#FCA5A5' }}>(often fails)</span>
                                <span className="text-lg">↘</span>
                              </div>
                              <div className="px-4 py-2 rounded-lg border" style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', borderColor: 'rgba(239, 68, 68, 0.5)' }}>
                                [HR Inbox]
                              </div>
                              <div className="text-xs self-center" style={{ color: '#FCA5A5' }}>
                                receives manual notifications
                              </div>
                            </div>
                          </div>

                          {/* What Actually Happens */}
                          <div className="mt-4 pt-4 border-t" style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}>
                            <div className="font-semibold mb-2 text-base" style={{ color: '#FCA5A5' }}>
                              What Actually Happens:
                            </div>
                            <ul className="list-disc list-inside space-y-1.5 ml-2" style={{ color: '#FEE2E2' }}>
                              <li>Recruiters manually email HR and supervisors.</li>
                              <li>Emma checks the HR inbox constantly for paperwork updates.</li>
                              <li>DocuSign completion triggers an email, not a system update.</li>
                            </ul>
                          </div>

                          {/* Pain Points */}
                          <div className="mt-4 pt-4 border-t" style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}>
                            <div className="font-semibold mb-2 text-base" style={{ color: '#FCA5A5' }}>
                              Pain Points:
                            </div>
                            <ul className="list-disc list-inside space-y-1.5 ml-2" style={{ color: '#FEE2E2' }}>
                              <li>No automated bridge JazzHR → HR.</li>
                              <li>Supervisors often don't know a hire is coming.</li>
                              <li>Emma must reconcile recruiter messages against JazzHR manually.</li>
                            </ul>
                          </div>
                        </div>
                      )
                    ) : (
                      <div className="whitespace-pre-line">{section.body}</div>
                    )}
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



