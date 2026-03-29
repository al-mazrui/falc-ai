// ============================================================
// FALC.AI — Dummy Data for 20 Portfolio Companies
// ============================================================

export type PaymentStatus = "paid" | "upcoming" | "overdue" | "partial";
export type Severity = "low" | "medium" | "high" | "critical";
export type GovernanceOrgan = "board" | "shareholders" | "executive";

export interface Payment {
  id: string;
  description: string;
  amount: number; // USD
  currency: string;
  dueDate: string; // ISO
  status: PaymentStatus;
  paidDate?: string;
  penaltyRate?: number; // daily % if overdue
  notes?: string;
}

export interface AdminObligation {
  id: string;
  title: string;
  type: "board_meeting" | "filing" | "regulatory" | "tax" | "reporting" | "other";
  dueDate: string;
  jurisdiction: string;
  requiresPhysicalPresence: boolean;
  recurring: boolean;
  frequency?: string;
  status: "completed" | "pending" | "overdue" | "upcoming";
  description: string;
}

export interface GovernanceRight {
  id: string;
  organ: GovernanceOrgan;
  matter: string;
  threshold?: string;
  vetoRight: boolean;
  description: string;
}

export interface SPVNode {
  id: string;
  name: string;
  jurisdiction: string;
  ownershipPct: number;
  parentId?: string;
  type: "fund" | "spv" | "holdco" | "target";
}

export interface Deal {
  id: string;
  targetCompany: string;
  sector: string;
  country: string;
  dealDate: string;
  totalInvestment: number;
  currency: string;
  ownershipPct: number;
  securityType: string;
  instrumentDescription: string;
  payments: Payment[];
  adminObligations: AdminObligation[];
  governanceRights: GovernanceRight[];
  spvChain: SPVNode[];
  // Computed summaries
  financialHealthScore: number; // 0-100
  adminBurdenScore: number; // 0-100 (higher = more burden)
  upcomingPaymentsCount: number;
  overduePaymentsCount: number;
  overdueAdminCount: number;
  totalOutstanding: number;
  totalPaid: number;
}

// ============================================================
// Helper to generate realistic dummy data
// ============================================================

const sectors = [
  "Oil & Gas Upstream", "Petrochemicals", "Steel & Metals", "Cement & Construction",
  "Shipping & Ports", "Fisheries & Aquaculture", "Mining & Quarrying",
  "Energy Infrastructure", "Water & Desalination", "Real Estate Development",
  "Telecommunications", "Automotive & Transport", "Food Processing",
  "Pharmaceutical Manufacturing", "Agriculture & Dates",
  "Industrial Gases", "Aviation & MRO", "Marble & Stone",
  "Defense & Security", "LNG & Gas Processing"
];

const countries = [
  "Oman", "Oman", "Oman", "UAE", "Saudi Arabia",
  "Oman", "Oman", "Bahrain", "Oman", "Oman",
  "Qatar", "Kuwait", "Oman", "Oman", "Oman",
  "UAE", "Oman", "Oman", "Oman", "Oman"
];

const jurisdictions = [
  "UAE (DIFC)", "UAE (ADGM)", "Cayman Islands", "BVI", "Jersey",
  "Bahrain", "Singapore", "Luxembourg", "Mauritius", "Cyprus",
  "Oman (SAOC)", "Qatar (QFC)", "Saudi Arabia", "Hong Kong", "Netherlands"
];

const securityTypes = [
  "Ordinary Shares", "Preference Shares", "Convertible Notes",
  "Participating Preferred", "Mezzanine Debt + Warrants",
  "Redeemable Preference Shares", "Compulsory Convertible Debentures",
  "Equity-Linked Notes", "Ordinary Shares + Shareholder Loan",
  "Class B Shares with Liquidation Preference"
];

function randomDate(start: string, end: string): string {
  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  return new Date(s + Math.random() * (e - s)).toISOString().split("T")[0];
}

function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

function generatePayments(dealDate: string, totalInvestment: number): Payment[] {
  const payments: Payment[] = [];
  const baseAmount = totalInvestment;

  // Purchase price tranches
  const tranche1 = Math.round(baseAmount * 0.6);
  const tranche2 = Math.round(baseAmount * 0.25);
  const tranche3 = Math.round(baseAmount * 0.15);

  const statuses: PaymentStatus[] = ["paid", "paid", "upcoming", "overdue", "partial"];

  payments.push({
    id: uid(),
    description: "Purchase Price — Tranche 1 (Closing)",
    amount: tranche1,
    currency: "USD",
    dueDate: dealDate,
    status: "paid",
    paidDate: dealDate,
  });

  payments.push({
    id: uid(),
    description: "Purchase Price — Tranche 2 (Deferred)",
    amount: tranche2,
    currency: "USD",
    dueDate: randomDate("2025-06-01", "2026-06-30"),
    status: statuses[Math.floor(Math.random() * 3)],
    penaltyRate: 0.05,
  });

  payments.push({
    id: uid(),
    description: "Purchase Price — Tranche 3 (Earn-out)",
    amount: tranche3,
    currency: "USD",
    dueDate: randomDate("2026-06-01", "2027-12-31"),
    status: "upcoming",
  });

  // Shareholder loan interest
  if (Math.random() > 0.4) {
    const loanAmount = Math.round(baseAmount * 0.3);
    const interestPayments = Math.floor(Math.random() * 4) + 2;
    for (let i = 0; i < interestPayments; i++) {
      const due = randomDate("2025-01-01", "2027-12-31");
      const s = new Date(due) < new Date("2026-03-29") ?
        (Math.random() > 0.3 ? "paid" : "overdue") : "upcoming";
      payments.push({
        id: uid(),
        description: `Shareholder Loan Interest — Q${i + 1}`,
        amount: Math.round(loanAmount * 0.02),
        currency: "USD",
        dueDate: due,
        status: s as PaymentStatus,
        penaltyRate: s === "overdue" ? 0.25 : undefined,
        notes: s === "overdue" ? "CRITICAL: Daily penalty accruing" : undefined,
      });
    }
  }

  // Management fees
  for (let q = 0; q < 4; q++) {
    const due = `2026-0${q * 3 + 1}-15`;
    const validDue = due.length > 10 ? `2026-${String(q * 3 + 1).padStart(2, "0")}-15` : due;
    payments.push({
      id: uid(),
      description: `Management Fee — Q${q + 1} 2026`,
      amount: Math.round(baseAmount * 0.005),
      currency: "USD",
      dueDate: validDue.slice(0, 10),
      status: q === 0 ? "paid" : q === 1 ? (Math.random() > 0.5 ? "paid" : "overdue") : "upcoming",
    });
  }

  return payments;
}

function generateAdminObligations(country: string): AdminObligation[] {
  const obligations: AdminObligation[] = [];

  // Board meetings
  const boardMeetings = Math.floor(Math.random() * 3) + 2;
  for (let i = 0; i < boardMeetings; i++) {
    const due = randomDate("2026-01-01", "2026-12-31");
    obligations.push({
      id: uid(),
      title: `Board Meeting Q${i + 1}`,
      type: "board_meeting",
      dueDate: due,
      jurisdiction: country,
      requiresPhysicalPresence: Math.random() > 0.4,
      recurring: true,
      frequency: "Quarterly",
      status: new Date(due) < new Date("2026-03-29") ?
        (Math.random() > 0.2 ? "completed" : "overdue") : "upcoming",
      description: `Quarterly board meeting as per SHA clause 8.2. ${Math.random() > 0.5 ? "Quorum requires 2 investor-nominated directors present in person." : "Video attendance permitted for investor nominees."}`,
    });
  }

  // Tax filings
  obligations.push({
    id: uid(),
    title: `Annual Tax Filing — ${country}`,
    type: "tax",
    dueDate: randomDate("2026-03-01", "2026-09-30"),
    jurisdiction: country,
    requiresPhysicalPresence: false,
    recurring: true,
    frequency: "Annual",
    status: Math.random() > 0.6 ? "completed" : "upcoming",
    description: `Annual corporate tax return filing for ${country} operating entity. Local tax advisor required.`,
  });

  // Regulatory filings
  if (Math.random() > 0.3) {
    obligations.push({
      id: uid(),
      title: `Regulatory Filing — ${country} Industrial Authority`,
      type: "regulatory",
      dueDate: randomDate("2026-02-01", "2026-08-31"),
      jurisdiction: country,
      requiresPhysicalPresence: Math.random() > 0.6,
      recurring: true,
      frequency: "Semi-annual",
      status: Math.random() > 0.5 ? "overdue" : "upcoming",
      description: `Compliance filing with ${country} industrial/manufacturing regulatory authority. Includes environmental and safety certifications.`,
    });
  }

  // SPV jurisdiction filings
  const spvJurisdiction = jurisdictions[Math.floor(Math.random() * jurisdictions.length)];
  obligations.push({
    id: uid(),
    title: `SPV Annual Return — ${spvJurisdiction}`,
    type: "filing",
    dueDate: randomDate("2026-01-15", "2026-06-30"),
    jurisdiction: spvJurisdiction,
    requiresPhysicalPresence: false,
    recurring: true,
    frequency: "Annual",
    status: Math.random() > 0.5 ? "completed" : "upcoming",
    description: `Annual return filing for SPV entity in ${spvJurisdiction}. Must include audited financial statements.`,
  });

  // Reporting obligations
  obligations.push({
    id: uid(),
    title: "Investor Reporting Package",
    type: "reporting",
    dueDate: randomDate("2026-04-01", "2026-04-30"),
    jurisdiction: "N/A",
    requiresPhysicalPresence: false,
    recurring: true,
    frequency: "Quarterly",
    status: "upcoming",
    description: "Quarterly financial and operational reporting package to LPs as per LPA Section 12.",
  });

  // Random extra burden
  if (Math.random() > 0.5) {
    obligations.push({
      id: uid(),
      title: `Annual General Meeting — ${country}`,
      type: "other",
      dueDate: randomDate("2026-05-01", "2026-09-30"),
      jurisdiction: country,
      requiresPhysicalPresence: true,
      recurring: true,
      frequency: "Annual",
      status: "upcoming",
      description: `Mandatory AGM per ${country} Companies Act. Physical attendance required for shareholder resolutions.`,
    });
  }

  return obligations;
}

function generateGovernanceRights(): GovernanceRight[] {
  return [
    {
      id: uid(),
      organ: "board",
      matter: "Annual Budget Approval",
      threshold: "Simple Majority",
      vetoRight: true,
      description: "Investor director has veto right on annual budget exceeding 110% of prior year.",
    },
    {
      id: uid(),
      organ: "board",
      matter: "Capital Expenditure > $5M",
      threshold: "Unanimous",
      vetoRight: true,
      description: "Any single capex exceeding $5M requires unanimous board approval including investor nominee.",
    },
    {
      id: uid(),
      organ: "board",
      matter: "Related Party Transactions",
      threshold: "Investor Director Consent",
      vetoRight: true,
      description: "All related party transactions require prior written consent of investor-nominated director.",
    },
    {
      id: uid(),
      organ: "shareholders",
      matter: "Share Issuance / Dilution",
      threshold: "75% Supermajority",
      vetoRight: true,
      description: "New share issuances require 75% shareholder approval. Investor has anti-dilution protection.",
    },
    {
      id: uid(),
      organ: "shareholders",
      matter: "Amendment to Articles",
      threshold: "Special Resolution (75%)",
      vetoRight: false,
      description: "Amendments to articles of association require special resolution.",
    },
    {
      id: uid(),
      organ: "shareholders",
      matter: "Dividend Distribution",
      threshold: "Ordinary Resolution",
      vetoRight: false,
      description: "Dividend declarations require ordinary resolution. Preference shares have priority.",
    },
    {
      id: uid(),
      organ: "executive",
      matter: "Day-to-day Operations",
      threshold: "CEO Authority",
      vetoRight: false,
      description: "CEO has authority for operational decisions within approved budget parameters.",
    },
    {
      id: uid(),
      organ: "executive",
      matter: "Hiring Senior Management",
      threshold: "Board Notification",
      vetoRight: false,
      description: "CEO may hire C-suite with board notification. Investor can object within 15 business days.",
    },
    {
      id: uid(),
      organ: "board",
      matter: "Debt Incurrence > $10M",
      threshold: "Investor Consent Required",
      vetoRight: true,
      description: "Borrowings exceeding $10M aggregate require prior investor consent.",
    },
  ];
}

function generateSPVChain(targetCompany: string, country: string, ownershipPct: number): SPVNode[] {
  const chain: SPVNode[] = [];
  const spvJurisdictions = [...jurisdictions].sort(() => Math.random() - 0.5).slice(0, 3);

  chain.push({
    id: "fund",
    name: "Al Falaj Capital Fund III",
    jurisdiction: "Cayman Islands",
    ownershipPct: 100,
    type: "fund",
  });

  chain.push({
    id: "holdco",
    name: `Al Falaj ${spvJurisdictions[0]} Holdings Ltd`,
    jurisdiction: spvJurisdictions[0],
    ownershipPct: 100,
    parentId: "fund",
    type: "holdco",
  });

  const midPct = Math.round(ownershipPct * (1 + Math.random() * 0.3));
  chain.push({
    id: "spv1",
    name: `AF ${targetCompany.split(" ")[0]} Investments ${spvJurisdictions[1]}`,
    jurisdiction: spvJurisdictions[1],
    ownershipPct: Math.min(midPct, 100),
    parentId: "holdco",
    type: "spv",
  });

  if (Math.random() > 0.4) {
    chain.push({
      id: "spv2",
      name: `AF ${targetCompany.split(" ")[0]} Sub Ltd`,
      jurisdiction: spvJurisdictions[2],
      ownershipPct: Math.min(midPct, 100),
      parentId: "spv1",
      type: "spv",
    });

    chain.push({
      id: "target",
      name: targetCompany,
      jurisdiction: country,
      ownershipPct: ownershipPct,
      parentId: "spv2",
      type: "target",
    });
  } else {
    chain.push({
      id: "target",
      name: targetCompany,
      jurisdiction: country,
      ownershipPct: ownershipPct,
      parentId: "spv1",
      type: "target",
    });
  }

  return chain;
}

// ============================================================
// Generate 20 deals with realistic data
// ============================================================

const targetCompanies = [
  "Al Jabal Oil & Gas SAOC", "Oman Petrochemical Industries SAOG", "Muscat Steel & Metals Co.",
  "Raysut Cement SAOG", "Sohar Port & Freezone Co.", "Al Wusta Fisheries LLC",
  "Al Batinah Mining SAOC", "Mazoon Energy Holdings SAOC", "Barka Desalination SAOC",
  "Al Mouj Real Estate SAOC", "Nawras Telecom SAOG", "Salalah Automotive LLC",
  "Dhofar Food Processing SAOG", "Al Hayat Pharma SAOC", "Nizwa Dates & Agriculture Co.",
  "Jebel Ali Industrial Gases FZE", "Oman Aviation Services SAOC", "Al Jabal Al Akhdar Marble SAOC",
  "Muscat Defense Systems SAOC", "Qalhat LNG Processing SAOC"
];

export function generateDeals(): Deal[] {
  return targetCompanies.map((company, i) => {
    const country = countries[i];
    const sector = sectors[i];
    const dealDate = randomDate("2016-01-01", "2025-12-31");
    const totalInvestment = Math.round((Math.random() * 400 + 50) * 1e6); // 50M - 450M
    const ownershipPct = Math.round(Math.random() * 45 + 15); // 15-60%

    const payments = generatePayments(dealDate, totalInvestment);
    const adminObligations = generateAdminObligations(country);
    const governanceRights = generateGovernanceRights();
    const spvChain = generateSPVChain(company, country, ownershipPct);

    const overduePayments = payments.filter(p => p.status === "overdue");
    const paidPayments = payments.filter(p => p.status === "paid");
    const upcomingPayments = payments.filter(p => p.status === "upcoming");
    const overdueAdmin = adminObligations.filter(a => a.status === "overdue");

    const totalPaid = paidPayments.reduce((s, p) => s + p.amount, 0);
    const totalOutstanding = payments.filter(p => p.status !== "paid").reduce((s, p) => s + p.amount, 0);

    // Financial health: penalize overdue items heavily
    let financialHealthScore = 85;
    financialHealthScore -= overduePayments.length * 15;
    financialHealthScore -= overduePayments.filter(p => p.penaltyRate && p.penaltyRate >= 0.1).length * 20;
    financialHealthScore = Math.max(10, Math.min(100, financialHealthScore));

    // Admin burden: more obligations = higher burden
    let adminBurdenScore = adminObligations.length * 12;
    adminBurdenScore += adminObligations.filter(a => a.requiresPhysicalPresence).length * 10;
    adminBurdenScore += overdueAdmin.length * 15;
    adminBurdenScore = Math.min(100, adminBurdenScore);

    return {
      id: `deal-${i + 1}`,
      targetCompany: company,
      sector,
      country,
      dealDate,
      totalInvestment,
      currency: "USD",
      ownershipPct,
      securityType: securityTypes[i % securityTypes.length],
      instrumentDescription: `${securityTypes[i % securityTypes.length]} in ${company} held via ${spvChain.length - 1} layered SPV structure through ${spvChain.filter(s => s.type === "spv" || s.type === "holdco").map(s => s.jurisdiction).join(", ")}.`,
      payments,
      adminObligations,
      governanceRights,
      spvChain,
      financialHealthScore,
      adminBurdenScore,
      upcomingPaymentsCount: upcomingPayments.length,
      overduePaymentsCount: overduePayments.length,
      overdueAdminCount: overdueAdmin.length,
      totalOutstanding,
      totalPaid,
    };
  });
}

export const deals = generateDeals();

// Portfolio-level aggregations
export function getPortfolioSummary() {
  const d = deals;
  return {
    totalDeals: d.length,
    totalInvested: d.reduce((s, deal) => s + deal.totalInvestment, 0),
    totalOutstanding: d.reduce((s, deal) => s + deal.totalOutstanding, 0),
    totalPaid: d.reduce((s, deal) => s + deal.totalPaid, 0),
    overduePayments: d.reduce((s, deal) => s + deal.overduePaymentsCount, 0),
    overdueAdmin: d.reduce((s, deal) => s + deal.overdueAdminCount, 0),
    avgFinancialHealth: Math.round(d.reduce((s, deal) => s + deal.financialHealthScore, 0) / d.length),
    avgAdminBurden: Math.round(d.reduce((s, deal) => s + deal.adminBurdenScore, 0) / d.length),
    bySector: d.reduce((acc, deal) => {
      acc[deal.sector] = (acc[deal.sector] || 0) + deal.totalInvestment;
      return acc;
    }, {} as Record<string, number>),
    byCountry: d.reduce((acc, deal) => {
      acc[deal.country] = (acc[deal.country] || 0) + deal.totalInvestment;
      return acc;
    }, {} as Record<string, number>),
  };
}
