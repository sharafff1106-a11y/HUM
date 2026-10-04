// All editable copy lives here. Email and logo are placeholders to replace later.
export const brand = {
  name: "Nickora",
  email: "info@nickora.com",
  url: "https://nickora.com", // your live domain: used for canonical links and the sitemap
};

export const chapters = [
  { id: "top", label: "Intro" },
  { id: "services", label: "Services" },
  { id: "struggles", label: "Stuck?" },
  { id: "process", label: "Process" },
  { id: "promise", label: "Promise" },
  { id: "journal-teaser", label: "Journal" },
  { id: "faq", label: "FAQ" },
  { id: "contact", label: "Contact" },
];

export const services = [
  { id: "consultancy", title: "Consultancy", line: "Plan your path", for: "Course · Country · Funding",
    text: "A clear academic roadmap built around your goals.", includes: ["Course and career mapping", "Country and university options", "Scholarship and funding guidance"] },
  { id: "admissions", title: "Admissions", line: "Get into the right university", for: "UG · Masters · PhD",
    text: "Applications that tell a sharp, honest story.", includes: ["University shortlisting", "Statement of purpose and CV review", "Interview preparation"] },
  { id: "mentoring", title: "Mentoring", line: "Never study alone", for: "One to one",
    text: "A dedicated mentor, week by week, from first lecture to final grade.", includes: ["Study system and planning", "Feedback you can act on", "Confidence and critical thinking"] },
  { id: "research", title: "Research", line: "From idea to viva", for: "Masters · PhD",
    text: "Guidance through every stage of your dissertation or thesis.", includes: ["Topic and research questions", "Literature review and methodology", "Structure and viva preparation"] },
  { id: "editing", title: "Editing", line: "Your voice, sharpened", for: "Proofreading · Editing",
    text: "Line-by-line clarity, tone and flow, keeping every word yours.", includes: ["Grammar and clarity", "Argument flow and structure", "Tracked changes with notes"] },
  { id: "referencing", title: "Referencing", line: "Every citation right", for: "APA · Harvard · IEEE",
    text: "Citations and formatting to your university's exact rules.", includes: ["Any referencing style", "Tables, headings and layout", "Template setup"] },
] as const;

export const struggles = [
  { id: "topic", label: "Choosing a topic", fix: "We narrow your interests into one clear, researchable question." },
  { id: "feedback", label: "Unclear feedback", fix: "We turn vague supervisor comments into a short list of concrete tasks." },
  { id: "lit", label: "Literature review", fix: "We help you compare authors and find your gap, instead of summarising papers." },
  { id: "method", label: "Methodology", fix: "We walk through your design so you can defend every choice in your own words." },
  { id: "english", label: "Academic English", fix: "Careful editing with notes, so you learn while your voice stays yours." },
  { id: "apply", label: "Choosing a university", fix: "A realistic shortlist and timeline, from statement to visa." },
] as const;

export const steps = [
  { title: "Talk", text: "A free first conversation about where you are and where you want to be." },
  { title: "Plan", text: "A written plan with clear scope and cost, before anything starts." },
  { title: "Work", text: "Regular sessions, honest feedback and careful editing." },
  { title: "Finish", text: "You submit, interview or defend with confidence." },
];

export const faqs = [
  { q: "Do you write assignments for students?", a: "No. We guide, mentor and edit. The work you submit is always your own, which keeps you safe under university rules." },
  { q: "Which levels do you support?", a: "Undergraduate, Masters and PhD students, plus applicants preparing for university." },
  { q: "Is proofreading allowed by universities?", a: "Most universities allow proofreading for language and clarity. We ask for your institution's policy and work inside it." },
  { q: "How is it priced?", a: "Every plan is quoted in writing before you commit. The first conversation is free." },
  { q: "Is my work kept private?", a: "Always. Your drafts and details are never shared." },
];

export const disciplines = ["Admissions", "Mentoring", "Dissertations", "PhD research", "Editing", "Referencing", "Literature reviews", "Methodology"];
