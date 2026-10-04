// Journal articles. General guidance only: always check your own university's rules.
export type Block =
  | { t: "h"; text: string }
  | { t: "p"; text: string }
  | { t: "list"; items: string[] }
  | { t: "tip"; text: string };

export type Article = { slug: string; title: string; category: string; read: string; excerpt: string; body: Block[] };

export const categories = ["All", "Research", "Writing", "Admissions", "Integrity"];

export const articles: Article[] = [
  {
    slug: "choose-a-dissertation-topic",
    title: "How to choose a dissertation topic you can actually finish",
    category: "Research",
    read: "6 min",
    excerpt: "Interesting is not enough. A good topic is also narrow, researchable and approved. Here is a simple way to test yours.",
    body: [
      { t: "p", text: "Most students lose weeks at the very start of a dissertation, moving between ideas that feel too big, too small, or already done. The problem is rarely a lack of ideas. It is the lack of a way to test them." },
      { t: "h", text: "Start with a field, not a question" },
      { t: "p", text: "List three areas from your course that you genuinely enjoyed. For each, write down one debate, problem or gap that came up in lectures or readings. You now have raw material instead of a blank page." },
      { t: "h", text: "Run the four-question test" },
      { t: "list", items: [
        "Can I answer it with data or sources I can actually access in the time I have?",
        "Is it narrow enough to cover properly in my word count?",
        "Does it connect to at least a few published studies I can build on?",
        "Will my supervisor and department accept it under the module rules?",
      ] },
      { t: "p", text: "If an idea fails any one of these, narrow it rather than throw it away. Add a place, a time period, a population or a method. 'Social media and mental health' becomes 'How first-year international students in the UK describe their use of Instagram during exam periods'." },
      { t: "h", text: "Write it as a question, then as a title" },
      { t: "p", text: "A research question keeps you honest. If you cannot phrase your topic as a single, clear question, it is probably still too broad. Once the question works, a title is easy." },
      { t: "tip", text: "Bring two or three narrowed questions to your supervisor, not one. Asking 'which of these is strongest?' gets far more useful feedback than 'is this okay?'." },
      { t: "h", text: "Check the scale early" },
      { t: "p", text: "Sketch a rough chapter plan with word counts before you commit. If the literature alone would fill your whole word limit, the topic needs tightening. It is far easier to narrow now than in month four." },
    ],
  },
  {
    slug: "supervisor-feedback-into-a-plan",
    title: "Turning vague supervisor feedback into a clear plan",
    category: "Research",
    read: "5 min",
    excerpt: "“Be more critical.” “Restructure this.” What these comments usually mean, and how to act on them.",
    body: [
      { t: "p", text: "Supervisors are busy, and feedback often arrives as short margin notes. They make sense to the person who wrote them, but leave you guessing. The fix is to translate each comment into a task you can finish." },
      { t: "h", text: "Common comments and what they usually mean" },
      { t: "list", items: [
        "“Be more critical” means compare and evaluate sources, rather than describe them one by one.",
        "“Where is your argument?” means each section needs a clear claim in its first lines.",
        "“Restructure” means the order of ideas does not build towards your point. Try outlining the chapter in single sentences.",
        "“Needs more depth” means fewer points, each explained and supported better.",
        "“Unclear” usually means long sentences or undefined terms.",
      ] },
      { t: "h", text: "Make a feedback table" },
      { t: "p", text: "Copy every comment into a simple table with three columns: the comment, what you think it means, and the action you will take. Anything you cannot fill in becomes a question for your next meeting." },
      { t: "tip", text: "Email your table to your supervisor before you start rewriting. A two-line reply confirming you have understood can save you a full redraft." },
      { t: "h", text: "Work from biggest to smallest" },
      { t: "p", text: "Fix structure first, then argument, then paragraphs, then language. Polishing sentences in a section that later moves or disappears wastes time." },
    ],
  },
  {
    slug: "literature-review-synthesis",
    title: "Literature review: from summary to synthesis",
    category: "Writing",
    read: "7 min",
    excerpt: "If every paragraph starts with an author's name, you are summarising. Here is how to build an argument instead.",
    body: [
      { t: "p", text: "A literature review is not a list of everything you read. Its job is to show the reader what is known, where scholars disagree, and the gap your own study fills." },
      { t: "h", text: "Group by theme, not by author" },
      { t: "p", text: "Read your notes and look for the three to five themes, debates or methods that keep returning. These become your sub-headings. Each source then appears wherever it helps that discussion, sometimes more than once." },
      { t: "h", text: "Use a synthesis matrix" },
      { t: "p", text: "Make a grid with sources down the side and your themes across the top. Fill in what each source says about each theme. Patterns, agreements and contradictions become visible very quickly." },
      { t: "h", text: "Change your sentence starters" },
      { t: "list", items: [
        "Instead of “Smith (2019) found…”, try “Several studies suggest… (Smith, 2019; Lee, 2021), although…”.",
        "Use comparison words: similarly, in contrast, however, building on.",
        "End each paragraph with what it means for your research.",
      ] },
      { t: "tip", text: "Read only the topic sentences of your review in order. If they tell a logical story on their own, your structure is working." },
      { t: "h", text: "Finish with the gap" },
      { t: "p", text: "Your final section should lead naturally to your research question: given what is known and what is missing, this is what your study does and why it matters." },
    ],
  },
  {
    slug: "statement-of-purpose",
    title: "Writing a statement of purpose admissions tutors remember",
    category: "Admissions",
    read: "6 min",
    excerpt: "Skip the childhood story and the dictionary definition. Tutors want evidence, direction and fit.",
    body: [
      { t: "p", text: "Admissions tutors read hundreds of statements. The ones that stand out are not the most dramatic. They are the most specific." },
      { t: "h", text: "Answer three questions" },
      { t: "list", items: [
        "What have you done that prepares you for this programme?",
        "What exactly do you want to study, and why now?",
        "Why this programme, at this university, in particular?",
      ] },
      { t: "h", text: "Show, then reflect" },
      { t: "p", text: "For each experience, give one concrete detail (a project, a result, a problem you solved) and then one sentence on what it taught you. Evidence plus reflection is far stronger than claims like 'I am passionate'." },
      { t: "h", text: "Make the fit real" },
      { t: "p", text: "Name modules, research groups or methods that match your interests, and explain the connection. Generic praise of a university's reputation adds nothing." },
      { t: "tip", text: "Write a version for each university. Reusing 80% is fine, but the 'why here' paragraph must be specific every time." },
      { t: "h", text: "Edit for length and voice" },
      { t: "p", text: "Respect the word or character limit exactly, and make sure it still sounds like you. Feedback should sharpen your story, never replace it." },
    ],
  },
  {
    slug: "common-referencing-mistakes",
    title: "Seven referencing mistakes that quietly cost marks",
    category: "Writing",
    read: "5 min",
    excerpt: "Small, repeated errors in citations add up. Most are easy to fix once you know what to look for.",
    body: [
      { t: "p", text: "Markers notice referencing. Consistent, accurate citations signal care; scattered errors suggest the opposite, even when your ideas are strong." },
      { t: "h", text: "The usual suspects" },
      { t: "list", items: [
        "Mixing styles, for example APA in-text citations with a Harvard reference list.",
        "Sources cited in the text but missing from the reference list, or the other way round.",
        "Inconsistent author names, dates or capitalisation of titles.",
        "Missing page numbers for direct quotations.",
        "Missing DOIs or URLs where your style guide asks for them.",
        "Citing a source you only saw quoted elsewhere without saying so.",
        "Relying on a reference manager's output without checking it.",
      ] },
      { t: "h", text: "Use your department's guide" },
      { t: "p", text: "Many departments use a local version of a style such as Harvard, and the details differ. Always follow the guide your university provides over a general website." },
      { t: "tip", text: "Do one final pass that checks only references: every in-text citation against the list, and every list entry against the text." },
    ],
  },
  {
    slug: "what-help-is-allowed",
    title: "Proofreading, editing, AI detectors: what help is allowed?",
    category: "Integrity",
    read: "6 min",
    excerpt: "Many students worry about crossing a line they cannot see. Here is how to stay clearly on the right side.",
    body: [
      { t: "p", text: "Getting support is normal and encouraged. The question is what kind. Universities set their own rules, so the first step is always to read your institution's academic integrity and proofreading policies." },
      { t: "h", text: "What is usually acceptable" },
      { t: "list", items: [
        "Mentoring and tutoring that helps you understand concepts and plan your work.",
        "Feedback that points out problems, which you then fix yourself.",
        "Proofreading for spelling, grammar and punctuation, where your university permits it.",
        "Help with referencing format and document layout.",
      ] },
      { t: "h", text: "What is not" },
      { t: "list", items: [
        "Someone else writing any part of work you submit as your own.",
        "Changes to your arguments, analysis or findings made by another person.",
        "Submitting AI-generated text where your course does not allow it.",
      ] },
      { t: "h", text: "If you are worried about AI detectors" },
      { t: "p", text: "Detection tools can be wrong. The best protection is a visible process: keep your notes, outlines, dated drafts and feedback. If your work is ever questioned, that history shows how it developed." },
      { t: "tip", text: "When in doubt, ask your module leader in writing what support is allowed. A short email gives you a clear answer and a record." },
    ],
  },
];
