// All editable copy lives here. Replace placeholders (contact details) before launch.
export const brand = {
  name: "Nickora",
  tagline: "Where ambition meets academic mastery.",
  email: "hello@nickora.com", // TODO: replace
  whatsapp: "", // TODO: e.g. "447000000000" to enable the WhatsApp button
};

export const services = [
  { id: "consultancy", icon: "Compass", title: "Educational Consultancy", tag: "Strategy", text: "A clear academic roadmap — course, country, university and funding — built around your goals, not a template." },
  { id: "admissions", icon: "GraduationCap", title: "University & Admissions Guidance", tag: "Admissions", text: "Shortlisting, statements of purpose, CVs, references and interview prep so every application tells a sharp, honest story." },
  { id: "mentoring", icon: "Sparkles", title: "Academic Mentoring", tag: "1:1", text: "A dedicated mentor who builds your study system, critical thinking and confidence from first lecture to final grade." },
  { id: "research", icon: "Telescope", title: "Research & Dissertation Guidance", tag: "PhD · Masters", text: "From a fuzzy idea to a defensible proposal: research questions, methodology, literature mapping, structure and viva readiness." },
  { id: "proofreading", icon: "PenLine", title: "Academic Proofreading & Editing", tag: "Polish", text: "Line-by-line clarity, tone, flow and argument checks — your voice, sharpened to a scholarly standard." },
  { id: "referencing", icon: "Quote", title: "Referencing & Document Formatting", tag: "Precision", text: "Flawless APA, Harvard, MLA, Chicago, IEEE or Vancouver. Templates, citations, tables and layouts that meet university rules." },
] as const;

export const disciplines = [
  "Engineering", "Medicine & Health", "Business & Management", "Law", "Computer Science & AI", "Psychology",
  "Education", "Economics", "Architecture", "Humanities", "Natural Sciences", "Social Sciences", "Nursing", "Public Policy",
];

export const journey = [
  { n: "01", title: "Discover", text: "A free conversation about where you are, where you want to be, and what stands in the way." },
  { n: "02", title: "Map", text: "We design a personalised plan with milestones, deadlines and the right level of support." },
  { n: "03", title: "Build", text: "Weekly mentoring, drafts and feedback loops. You do the thinking; we sharpen it." },
  { n: "04", title: "Refine", text: "Editing, referencing and formatting to the exact standard your institution expects." },
  { n: "05", title: "Succeed", text: "Submit, interview or defend with confidence — and keep a mentor for what comes next." },
];

export const phdStages = [
  { label: "Idea", note: "Find a question worth a doctorate" },
  { label: "Proposal", note: "Scope, novelty, feasibility" },
  { label: "Literature", note: "Map the field, find the gap" },
  { label: "Method", note: "Design that stands up to scrutiny" },
  { label: "Analysis", note: "Make sense of the evidence" },
  { label: "Thesis", note: "Structure, argument, flow" },
  { label: "Viva", note: "Rehearse, defend, celebrate" },
];

export const styles = ["APA 7", "Harvard", "MLA 9", "Chicago", "IEEE", "Vancouver", "OSCOLA", "AMA"];

export const faqs = [
  { q: "Do you write assignments or dissertations for students?", a: "No. Nickora is guidance, mentoring and editing — we help you think, structure, improve and present your own work. That keeps you safe under university academic-integrity rules and makes you a stronger scholar." },
  { q: "Which levels and subjects do you support?", a: "Undergraduate, Masters and PhD across most disciplines. If a niche topic needs a specialist, we match you with the right mentor or tell you honestly it's not a fit." },
  { q: "How does editing differ from proofreading?", a: "Proofreading fixes grammar, spelling and punctuation. Editing goes deeper: clarity, argument flow, tone and structure — always keeping your voice." },
  { q: "Can you help with applications abroad?", a: "Yes. We guide course and university selection, statements, CVs, references, interview preparation and the overall timeline for study destinations worldwide." },
  { q: "How do I get started?", a: "Send a short message below. We'll reply with a free discovery call slot and a first-step plan." },
];
