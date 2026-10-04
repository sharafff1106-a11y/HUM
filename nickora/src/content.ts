// All editable copy lives here. Email and logo are placeholders to replace later.
export const brand = {
  name: "Nickora",
  email: "info@nickora.com",
  whatsapp: "", // e.g. "447000000000" to show a WhatsApp link
};

export const services = [
  { id: "consultancy", title: "Educational Consultancy", for: "Undecided students, career changers", text: "A clear academic roadmap covering course, country, university and funding, built around your goals instead of a template." },
  { id: "admissions", title: "University & Admissions Guidance", for: "Undergraduate, Masters and PhD applicants", text: "Shortlisting, statements of purpose, CVs, references, interview preparation and a realistic deadline plan." },
  { id: "mentoring", title: "Academic Mentoring", for: "Anyone who feels behind or overwhelmed", text: "A dedicated mentor who builds your study system, critical thinking and confidence, one week at a time." },
  { id: "research", title: "Research & Dissertation Guidance", for: "Masters and PhD researchers", text: "From a vague idea to a defensible proposal: research questions, methodology, literature mapping, structure and viva readiness." },
  { id: "proofreading", title: "Academic Proofreading & Editing", for: "Writers who need a final, careful read", text: "Line-by-line work on grammar, clarity, tone and argument flow. Your words and your voice, made sharper." },
  { id: "referencing", title: "Referencing & Document Formatting", for: "Anyone losing marks on format", text: "APA, Harvard, MLA, Chicago, IEEE or Vancouver. Citations, tables, headings and layouts that meet your university's rules." },
] as const;

// Real, recurring student problems, each tied to the service that answers it.
export const struggles = [
  { id: "topic", label: "I can't pick a topic", feel: "Every idea feels too big, too small, or already done. The deadline keeps getting closer.", fix: "We run a structured topic session: your interests, your course rules and what is actually researchable, then narrow it to a question you can defend.", service: "Research & Dissertation Guidance" },
  { id: "feedback", label: "My supervisor's feedback is unclear", feel: "“Be more critical.” “Restructure.” You read it three times and still don't know what to change.", fix: "Bring the comments to your mentor. We translate each one into a short, concrete task list, so you know exactly what to do next.", service: "Academic Mentoring" },
  { id: "lit", label: "My literature review is just summaries", feel: "You've read forty papers and written forty paragraphs, but there's no argument holding them together.", fix: "We teach you to group sources by theme, compare authors, and find the gap your own study fills.", service: "Research & Dissertation Guidance" },
  { id: "method", label: "Methodology and statistics confuse me", feel: "You don't know whether to go qualitative or quantitative, or how to justify your choice to a panel.", fix: "We walk through design choices, sampling and analysis so that you can explain every decision in your own words.", service: "Research & Dissertation Guidance" },
  { id: "english", label: "Writing in English is holding me back", feel: "Your ideas are strong, but your writing doesn't show it, and marks are lost on style.", fix: "Careful editing with explanations, so each correction teaches you something and your voice stays yours.", service: "Academic Proofreading & Editing" },
  { id: "ref", label: "I keep losing marks on referencing", feel: "Missing DOIs, mixed styles and inconsistent headings. Small errors that cost real grades.", fix: "We format your citations and document to your institution's exact guide, and show you how to keep it consistent.", service: "Referencing & Document Formatting" },
  { id: "ai", label: "I'm scared of being wrongly flagged", feel: "Detection software is imperfect, and honest students have been accused. You aren't sure what help is allowed.", fix: "We keep a clear record of your drafts and thinking, and only provide help your university permits. Your work stays your own.", service: "Academic Mentoring" },
  { id: "apply", label: "I don't know which university fits me", feel: "Hundreds of programmes, different deadlines and visa rules. You can't tell which choices are realistic.", fix: "We build a shortlist around your profile, budget and goals, then plan the timeline from statement to visa.", service: "University & Admissions Guidance" },
] as const;

export const steps = [
  { title: "A free first conversation", text: "Tell us where you are and what's worrying you. No pressure and no obligation." },
  { title: "A written plan and fixed scope", text: "You see exactly what's included, how long it takes and what it costs, in writing, before anything starts." },
  { title: "Guided work", text: "Regular mentoring, honest feedback and careful editing. You do the thinking; we sharpen it." },
  { title: "Independence", text: "You finish able to do it again without us. That is the measure of good guidance." },
];

export const dos = [
  "Explain, coach and give honest feedback on your own work",
  "Edit and proofread so your words read clearly",
  "Format references and documents to your university's guide",
  "Keep your drafts, ideas and details strictly confidential",
  "Tell you plainly when we can't help or aren't the right fit",
];
export const donts = [
  "Write your assignment, essay or dissertation for you",
  "Submit any work under your name",
  "Promise grades, admission or visa outcomes",
  "Share your files or personal details with anyone",
  "Hide costs or add fees after you've agreed a scope",
];

export const phdStages = [
  { label: "Idea", note: "Find a question worth a degree" },
  { label: "Proposal", note: "Scope, novelty and feasibility" },
  { label: "Literature", note: "Map the field and find the gap" },
  { label: "Method", note: "A design that survives scrutiny" },
  { label: "Analysis", note: "Make sense of the evidence" },
  { label: "Thesis", note: "Structure, argument and flow" },
  { label: "Viva", note: "Rehearse, defend and finish" },
];

export const styles = ["APA 7", "Harvard", "MLA 9", "Chicago", "IEEE", "Vancouver", "OSCOLA", "AMA"];

export const faqs = [
  { q: "Will you write my assignment or dissertation?", a: "No. We guide, mentor and edit. Work submitted under your name must be yours, and universities treat bought work as misconduct. Our job is to make you capable of producing strong work." },
  { q: "Is proofreading and editing allowed by my university?", a: "Most universities allow proofreading for language and clarity but restrict changes to content or argument. Rules vary, so we ask for your institution's policy and work inside it." },
  { q: "What if my work is flagged by AI-detection software?", a: "Detectors make mistakes. We keep your drafts and feedback as evidence of your own process, and we advise you on how to respond to a query calmly and correctly." },
  { q: "Which levels and subjects do you cover?", a: "Undergraduate, Masters and PhD across most disciplines. If a niche topic needs a specialist, we say so honestly rather than take your money." },
  { q: "How much does it cost?", a: "Every plan is quoted in writing before you commit, with a clear scope. The first conversation is free." },
  { q: "Is my information private?", a: "Yes. Your drafts, ideas and personal details are never shared or reused." },
];
