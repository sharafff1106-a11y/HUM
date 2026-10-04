// Journal articles. Written in plain English at university level.
// General guidance only: readers should always check their own university's rules.
export type Block =
  | { t: "h"; text: string }
  | { t: "p"; text: string }
  | { t: "list"; items: string[] }
  | { t: "steps"; items: { title: string; text: string }[] }
  | { t: "example"; label: string; bad: string; good: string; why: string }
  | { t: "tip"; text: string }
  | { t: "checklist"; title: string; items: string[] }
  | { t: "faq"; items: { q: string; a: string }[] };

export type Article = {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  metaDescription: string;
  keywords: string[];
  updated: string;
  takeaways: string[];
  body: Block[];
  sources: { label: string; url: string }[];
};

export const categories = ["All", "Research", "Writing", "Admissions", "Integrity"];

export const articles: Article[] = [
  /* ------------------------------------------------------------------ */
  {
    slug: "choose-a-dissertation-topic",
    title: "How to choose a dissertation topic you can actually finish",
    category: "Research",
    excerpt: "Interesting is not enough. A good topic is also narrow, researchable and approved. Here is a simple, step-by-step way to find and test yours.",
    metaDescription: "A step-by-step guide to choosing a dissertation topic: find ideas, narrow them into a research question, test feasibility and get supervisor approval.",
    keywords: ["how to choose a dissertation topic", "dissertation topic ideas", "research question", "narrow a research topic", "dissertation feasibility"],
    updated: "October 2026",
    takeaways: [
      "Start from your course and your interests, not from a blank page.",
      "Narrow your idea until it fits your word count, time and data.",
      "Turn your topic into one clear research question.",
      "Test feasibility early, before you write a single chapter.",
      "Take two or three options to your supervisor, not one.",
    ],
    body: [
      { t: "p", text: "Choosing a dissertation topic feels like a huge decision, and in some ways it is. You will live with this topic for months. Many students lose weeks at the start, jumping between ideas that feel too big, too small, or already done. The problem is rarely a lack of ideas. It is the lack of a simple way to test them." },
      { t: "p", text: "This guide gives you that method. It works for undergraduate, Masters and PhD projects. The scale changes, but the logic is the same." },

      { t: "h", text: "What makes a good dissertation topic?" },
      { t: "p", text: "A strong topic does three jobs at once. It interests you enough to keep you going. It connects to existing research, so you have something to build on. And it is feasible, which means you can actually finish it with the time, data and word count you have." },
      { t: "list", items: [
        "Interesting: you will read about it for months, so you need some genuine curiosity.",
        "Relevant: it links to debates or gaps in your field, not just your personal opinion.",
        "Feasible: you can get the sources or data you need, in the time you have.",
        "Focused: it can be answered properly within your word limit.",
        "Approved: it fits your module or programme rules.",
      ] },
      { t: "p", text: "Most failed topics fail on the last three points, not the first two. Being passionate about a subject does not help if the data is impossible to collect or the question would need a book to answer." },

      { t: "h", text: "Step-by-step: from vague idea to research question" },
      { t: "steps", items: [
        { title: "Read your programme rules first", text: "Check the word count, deadline, whether you need ethics approval, and whether primary research (surveys, interviews, experiments) is expected or optional. These rules decide what is realistic before you even think about ideas." },
        { title: "List three areas you enjoyed", text: "Look back at your modules, essays and readings. Which lectures did you actually enjoy? Which essay got your best mark? Write down three broad areas." },
        { title: "Find the debates inside each area", text: "For each area, note one problem, disagreement or unanswered question that came up in class or in your reading. Recent review articles and the 'future research' sections at the end of journal papers are excellent places to look." },
        { title: "Do quick preliminary reading", text: "Spend a few hours searching your library database and Google Scholar. If you find almost nothing, the topic may be too new or too niche. If you find thousands of studies, it is probably too broad." },
        { title: "Narrow it down", text: "Add limits until the topic becomes manageable. Common limits are a place, a time period, a group of people, a sector, or a specific method." },
        { title: "Write one research question", text: "A topic is a subject area. A research question is something you can actually answer. If you cannot write your idea as a single clear question, it still needs work." },
      ] },

      { t: "h", text: "How to narrow a topic that is too broad" },
      { t: "p", text: "Being too broad is the most common problem students face. A broad topic leads to a shallow dissertation, because you can only say a little about a lot. Narrowing lets you say a lot about a little, which is what markers reward." },
      { t: "example", label: "Narrowing in practice", bad: "Social media and mental health.", good: "How do first-year international students at UK universities describe their use of Instagram during exam periods?", why: "The second version names a group (first-year international students), a place (UK universities), a platform (Instagram) and a time (exam periods). It is now possible to design a study and answer it." },
      { t: "p", text: "Try asking: who exactly, where exactly, when exactly, and which aspect exactly? Each answer makes the topic sharper." },

      { t: "h", text: "The feasibility test: can you actually finish it?" },
      { t: "p", text: "Before you commit, run your idea through these four questions. If any answer is no, adjust the idea instead of abandoning it." },
      { t: "checklist", title: "Feasibility check", items: [
        "Can I access the sources or data I need, legally and ethically?",
        "Can I collect and analyse the data within my timeline?",
        "Is there enough published research to build a literature review?",
        "Can the question be answered properly within my word count?",
        "Does my supervisor or department have the expertise to support it?",
      ] },
      { t: "tip", text: "Sketch a rough chapter plan with word counts before you commit. If the literature review alone would fill your whole word limit, the topic needs to be narrower." },

      { t: "h", text: "Common mistakes to avoid" },
      { t: "list", items: [
        "Choosing a topic only because it sounds impressive.",
        "Relying on data you do not yet have access to, such as company records or a specific hospital.",
        "Picking a question you already know the answer to. Research should genuinely find something out.",
        "Ignoring ethics approval timelines. Research with people can take weeks to approve.",
        "Waiting for the 'perfect' idea instead of improving a good one.",
      ] },

      { t: "h", text: "How to talk to your supervisor about it" },
      { t: "p", text: "Supervisors give much better feedback when you bring options. Instead of asking 'Is my topic okay?', bring two or three narrowed research questions with a short note on the data you would use for each. Then ask, 'Which of these is strongest, and why?'" },
      { t: "p", text: "This shows that you have done the thinking. It also turns a vague conversation into a concrete decision, which saves you weeks." },

      { t: "faq", items: [
        { q: "How long should it take to choose a dissertation topic?", a: "For most taught programmes, aim to settle on a working research question within two to four weeks. It can keep evolving, but you need a clear direction to start reading properly." },
        { q: "Can I change my topic later?", a: "Small changes to your question are normal as you read more. Big changes late in the year are risky. Always discuss changes with your supervisor first." },
        { q: "Does my topic have to be completely original?", a: "No. At undergraduate and Masters level, a fresh angle on existing research is usually enough, for example a new group, setting or method. PhD research needs a more significant original contribution." },
      ] },
    ],
    sources: [
      { label: "Scribbr: How to choose a dissertation topic", url: "https://www.scribbr.com/dissertation/dissertation-topic/" },
      { label: "Falmouth University Library: Finding a topic", url: "https://libguides.falmouth.ac.uk/dissertations/finding-topic" },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "supervisor-feedback-into-a-plan",
    title: "Turning vague supervisor feedback into a clear plan",
    category: "Research",
    excerpt: "“Be more critical.” “Restructure this.” What these comments usually mean, how to act on them, and how to ask for clarity without feeling awkward.",
    metaDescription: "Learn what common supervisor comments really mean and how to turn vague thesis feedback into a clear, step-by-step revision plan.",
    keywords: ["supervisor feedback", "thesis feedback", "be more critical meaning", "how to respond to feedback", "dissertation revision plan"],
    updated: "October 2026",
    takeaways: [
      "Pause before you react. Read feedback twice, a day apart.",
      "Translate every comment into a specific task.",
      "Fix big problems (structure, argument) before small ones (grammar).",
      "Ask for clarification with specific questions, not 'what did you mean?'.",
      "Keep a feedback log so you can show what you changed.",
    ],
    body: [
      { t: "p", text: "Feedback is meant to help you, but it often arrives as short notes in the margin: 'unclear', 'more critical', 'restructure'. They make sense to the person who wrote them. To you, they can feel confusing or even discouraging." },
      { t: "p", text: "The good news is that most comments follow a small number of patterns. Once you learn to decode them, feedback becomes a to-do list instead of a source of stress." },

      { t: "h", text: "First, manage the emotional reaction" },
      { t: "p", text: "It is completely normal to feel frustrated or upset when you read critical feedback, especially on work you spent weeks on. Feedback on your writing is not a judgement of you as a person or of your intelligence. It is a normal part of academic work. Even professors receive harsh reviews on their papers." },
      { t: "tip", text: "Read the feedback once, then close it. Come back the next day and read it again. The second reading is almost always calmer and more useful." },

      { t: "h", text: "What common supervisor comments usually mean" },
      { t: "steps", items: [
        { title: "“Be more critical”", text: "You are describing sources instead of evaluating them. Ask: how strong is this evidence? What are its limits? Do other authors disagree? Why does it matter for your question?" },
        { title: "“Where is your argument?”", text: "The reader cannot see your main point. Each section and paragraph should open with a clear claim, then support it." },
        { title: "“Restructure” or “this doesn't flow”", text: "The order of your ideas does not build towards your point. Try writing a one-sentence summary of each paragraph and rearranging them until they tell a logical story." },
        { title: "“Needs more depth”", text: "You have covered too many points too quickly. Choose fewer points and explain each one properly, with evidence and analysis." },
        { title: "“Unclear” or “awkward”", text: "Usually long sentences, vague words or undefined terms. Split long sentences and define key terms the first time you use them." },
        { title: "“So what?”", text: "You have made a point but not explained why it matters. Add a sentence linking it back to your research question." },
      ] },

      { t: "h", text: "Build a feedback table" },
      { t: "p", text: "The simplest way to turn comments into action is a three-column table. Copy every comment into it, then fill in the other two columns." },
      { t: "example", label: "One row of a feedback table", bad: "Comment: “Section 2.3 is descriptive.”", good: "My action: Rewrite 2.3 so each paragraph compares at least two authors and ends with what this means for my study.", why: "A vague comment becomes a specific, finishable task. Anything you cannot turn into an action becomes a question for your next meeting." },
      { t: "p", text: "Once your table is complete, sort the actions by size. Structural changes go first, then argument, then paragraph-level fixes, and finally language and formatting. Polishing sentences in a section you later delete is wasted time." },

      { t: "h", text: "How to ask for clarification" },
      { t: "p", text: "If you do not understand a comment, asking is a sign of professionalism, not weakness. The trick is to ask specific questions that are easy to answer." },
      { t: "example", label: "Asking well", bad: "“I didn't understand your feedback, can you explain?”", good: "“On page 4 you wrote ‘be more critical’. Do you mean I should compare Smith and Lee directly, or discuss the limitations of their methods? I've drafted a revised paragraph below.”", why: "The second version shows effort, offers a concrete interpretation, and lets your supervisor answer in one line." },
      { t: "tip", text: "Send your feedback table to your supervisor before you start a major rewrite. A two-line reply confirming you have understood can save you a full redraft." },

      { t: "h", text: "What if you disagree with the feedback?" },
      { t: "p", text: "Sometimes you will. That is fine, and part of becoming an independent researcher. Do not ignore the comment silently. Instead, explain your reasoning politely: 'I considered moving this section, but kept it here because it introduces the concept used in Chapter 3. Would you still prefer it moved?' Supervisors usually respect a thoughtful reason." },

      { t: "checklist", title: "Before your next supervision meeting", items: [
        "I have read all comments twice, on different days.",
        "Every comment is in my feedback table with an action.",
        "I have listed specific questions for anything unclear.",
        "I have started on the biggest structural changes first.",
        "I can show what I changed since the last draft.",
      ] },

      { t: "faq", items: [
        { q: "How often should I meet my supervisor?", a: "It depends on your programme, but regular, short meetings work better than rare, long ones. Agree a rhythm early and always send work a few days in advance." },
        { q: "What if my supervisor's feedback is late?", a: "Supervisors are often very busy. Send a polite reminder with a clear deadline and keep working on other sections. If delays seriously affect your progress, speak to your programme lead." },
        { q: "Should I accept every suggestion?", a: "Take every comment seriously, but you are the author. If a suggestion would not improve the work, explain your reasoning respectfully." },
      ] },
    ],
    sources: [
      { label: "University of Exeter Doctoral College: Ten steps for dealing with feedback", url: "https://sites.exeter.ac.uk/doctoralcollege/2018/11/19/ten-steps-for-dealing-with-feedback-adapted-from-get-a-life-phd/" },
      { label: "Hasselt University: How to deal with feedback on your master's thesis", url: "https://www.uhasselt.be/en/info-for/current-students/guidance-and-support/study-coaching/study-tips/master-thesis/how-to-deal-with-feedback" },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "literature-review-synthesis",
    title: "Literature review: from summary to synthesis",
    category: "Writing",
    excerpt: "If every paragraph starts with an author's name, you are summarising. Learn how to group sources by theme, use a synthesis matrix and build a real argument.",
    metaDescription: "How to write a literature review that synthesises instead of summarises: thematic structure, the synthesis matrix method, sentence examples and a checklist.",
    keywords: ["how to write a literature review", "literature review synthesis", "synthesis matrix", "thematic literature review", "critical literature review"],
    updated: "October 2026",
    takeaways: [
      "A literature review is an argument, not a list of summaries.",
      "Organise by themes or debates, not by author.",
      "A synthesis matrix shows patterns across your sources quickly.",
      "Each paragraph should compare sources and say what it means.",
      "End by showing the gap your own study fills.",
    ],
    body: [
      { t: "p", text: "The literature review is often the hardest chapter to get right. Many students read dozens of papers, then write one paragraph per paper. The result is long, descriptive and gets comments like 'too descriptive' or 'be more critical'." },
      { t: "p", text: "The difference between a weak and a strong literature review is one word: synthesis. Instead of reporting what each author said, you bring sources together to show what the field knows, where it disagrees, and what is missing." },

      { t: "h", text: "Summary vs synthesis: what is the difference?" },
      { t: "p", text: "A summary tells the reader what one source says. Synthesis connects several sources to make a point of your own." },
      { t: "example", label: "Summary vs synthesis", bad: "Smith (2019) found that feedback improves grades. Lee (2021) found that peer feedback is useful. Khan (2020) found that students value timely comments.", good: "Research consistently links feedback to better performance (Khan, 2020; Smith, 2019), but studies disagree about who should give it. While Lee (2021) argues that peer feedback is as effective as tutor feedback, Smith's findings suggest tutor comments carry more weight with students.", why: "The second version groups sources around one idea, shows agreement and disagreement, and makes a point that no single source makes on its own." },

      { t: "h", text: "Choose a structure: thematic is usually best" },
      { t: "p", text: "There are a few common ways to organise a literature review. For most dissertations, a thematic structure works best because it lets you compare older and newer sources within each theme." },
      { t: "list", items: [
        "Thematic: grouped around key themes, concepts or debates. Best for most dissertations.",
        "Chronological: shows how thinking developed over time. Useful when the history of an idea matters.",
        "Methodological: grouped by the methods researchers used. Useful when you want to show a gap in how a topic has been studied.",
      ] },
      { t: "p", text: "You can also combine them. For example, a thematic review might briefly trace the history of each theme before comparing recent studies." },

      { t: "h", text: "Use a synthesis matrix" },
      { t: "p", text: "A synthesis matrix is a simple table that university writing centres recommend for exactly this problem. Put your themes down the side and your sources across the top. As you read each source, note what it says about each theme in the matching cell. Add a final column where you write your own observation about each theme." },
      { t: "steps", items: [
        { title: "List your sources", text: "Start with the 10 to 20 most relevant studies. You can add more later." },
        { title: "Identify themes", text: "Read your notes and look for ideas, debates or methods that keep returning. Three to five themes is a good range." },
        { title: "Fill in the grid", text: "For each source, write a short note in each relevant theme cell. Leave cells empty if a source does not address that theme." },
        { title: "Look across the rows", text: "Where do sources agree? Where do they disagree? Which cells are empty? Empty cells often point to research gaps." },
        { title: "Write your synthesis column", text: "For each theme, write one or two sentences in your own words summarising the overall picture. These sentences often become your topic sentences." },
      ] },
      { t: "tip", text: "A spreadsheet works perfectly for a synthesis matrix. Colour-code cells green for 'agrees', orange for 'partly agrees' and red for 'disagrees' to see patterns at a glance." },

      { t: "h", text: "Write paragraphs that compare" },
      { t: "p", text: "A good literature review paragraph usually follows a simple pattern: make a claim, support it with several sources, show any disagreement or limitations, then explain what it means for your research." },
      { t: "list", items: [
        "Agreement: 'Several studies suggest… (Author, year; Author, year).'",
        "Contrast: 'However, … argues the opposite, finding that…'",
        "Limitation: 'These studies mainly focus on…, which limits…'",
        "Building on: 'Extending this work, … shows that…'",
        "Relevance: 'This matters for the present study because…'",
      ] },
      { t: "p", text: "Notice that these sentences start with ideas, not author names. When every paragraph begins with 'Smith (2019) found…', it is a sign you are summarising." },

      { t: "h", text: "Finish with the gap" },
      { t: "p", text: "The final part of your review should lead naturally to your own research question. In plain terms: given what we know and what is missing, this is what my study does and why it matters. A clear gap makes your whole dissertation feel purposeful." },

      { t: "checklist", title: "Literature review self-check", items: [
        "My sub-headings are themes, not author names.",
        "Most paragraphs cite two or more sources.",
        "I point out agreements, disagreements and limitations.",
        "Each section ends by linking back to my research question.",
        "Reading only my topic sentences tells a logical story.",
        "My review ends by identifying a clear gap.",
      ] },

      { t: "faq", items: [
        { q: "How many sources should a literature review include?", a: "There is no fixed number. It depends on your level, subject and word count. Quality and relevance matter more than quantity. Ask your supervisor what is typical for your programme." },
        { q: "How old can my sources be?", a: "Use recent research where possible, often from the last 5 to 10 years, but include older key studies that shaped the field." },
        { q: "Can I include my own opinion?", a: "Yes, through evaluation. Instead of 'I think', show your judgement through comparison and critique, supported by evidence." },
      ] },
    ],
    sources: [
      { label: "University of Sheffield: How to write a literature review", url: "https://www.sheffield.ac.uk/study-skills/writing/critical/literature-review" },
      { label: "Stanford Teaching Writing: Synthesis matrix", url: "https://teachingwriting.stanford.edu/synthesis-matrix" },
      { label: "James Cook University Library: Synthesise", url: "https://libguides.jcu.edu.au/litreview/synthesise" },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "statement-of-purpose",
    title: "Writing a statement of purpose admissions tutors remember",
    category: "Admissions",
    excerpt: "Skip the childhood story and the dictionary definition. Tutors want evidence, direction and fit. Here is a clear structure, with examples.",
    metaDescription: "How to write a strong statement of purpose for a Masters or PhD: structure, ideal length, what admissions committees look for, and before-and-after examples.",
    keywords: ["statement of purpose", "how to write a statement of purpose", "SOP for masters", "personal statement postgraduate", "SOP structure"],
    updated: "October 2026",
    takeaways: [
      "Your statement should answer three questions: what you've done, what you want to study, and why this programme.",
      "Specific evidence beats big claims like 'I am passionate'.",
      "Most statements are 500 to 1,000 words; always follow the stated limit.",
      "Write a tailored 'why this programme' paragraph for every university.",
      "Feedback should sharpen your story, never replace your voice.",
    ],
    body: [
      { t: "p", text: "Your grades and test scores show what you have achieved. Your statement of purpose (SOP) explains who you are, what you want to do next, and why this programme is the right place to do it. For many applicants, it is the part of the application they control the most." },
      { t: "p", text: "Admissions tutors read hundreds of statements. The ones that stand out are not the most dramatic. They are the clearest and most specific." },

      { t: "h", text: "What admissions committees are looking for" },
      { t: "list", items: [
        "Preparation: evidence that you have the academic background to succeed.",
        "Direction: a clear sense of what you want to study and why.",
        "Fit: a real connection between your goals and this specific programme.",
        "Clarity: the ability to explain your ideas concisely, within the limit.",
      ] },
      { t: "p", text: "That last point matters more than many students realise. Going over the word limit or rambling suggests you struggle to prioritise, which is exactly the skill postgraduate study requires." },

      { t: "h", text: "How long should a statement of purpose be?" },
      { t: "p", text: "Always follow the instructions from the university first. If none are given, most Masters statements are around 500 to 1,000 words (one to two pages). PhD statements can be longer, especially when you describe research interests in detail." },

      { t: "h", text: "A simple structure that works" },
      { t: "steps", items: [
        { title: "Opening (about 10%)", text: "Start with a specific moment, project or question that shows your interest, then quickly state what you want to study. Avoid quotes and dictionary definitions." },
        { title: "Academic background (about 20%)", text: "Highlight the modules, projects or results most relevant to the programme. Explain what you learned, not just what you did." },
        { title: "Research or work experience (about 25%)", text: "Describe one or two experiences in detail: the problem, your role, the result, and what it taught you." },
        { title: "Why this programme (about 20%)", text: "Name specific modules, research groups, methods or resources, and explain how they connect to your goals." },
        { title: "Future goals (about 15%)", text: "Explain where this degree leads, whether further research, a specific career or a problem you want to solve." },
        { title: "Closing (about 10%)", text: "Bring it together in two or three confident sentences. No need to repeat everything." },
      ] },

      { t: "h", text: "Show, then reflect" },
      { t: "p", text: "The most common weakness in statements is claims without evidence. Words like 'passionate', 'hard-working' and 'dedicated' mean little on their own. Instead, describe what you did and then reflect on what it taught you." },
      { t: "example", label: "Turning a claim into evidence", bad: "Ever since I was a child, I have been passionate about data and helping people.", good: "During my internship at a city hospital, I built a scheduling model that cut patient waiting times by 18%. Seeing how a spreadsheet could change people's days made me want to study health data science properly.", why: "The second version proves interest through action, includes a concrete result, and links naturally to the programme." },

      { t: "h", text: "Make the 'why this programme' paragraph specific" },
      { t: "p", text: "Generic praise such as 'your world-class university' adds nothing, because it could be sent anywhere. Instead, spend time on the programme website. Look at modules, staff research interests, labs, placements and recent student projects." },
      { t: "example", label: "Showing real fit", bad: "I want to study at your prestigious university because it is one of the best in the world.", good: "The programme's module in operational research and its partnership with NHS trusts would let me build on my internship with real hospital data.", why: "It names concrete features and explains exactly why they matter to you." },
      { t: "tip", text: "It is fine to reuse most of your statement across applications, but rewrite the 'why this programme' section for every single university." },

      { t: "h", text: "Common mistakes to avoid" },
      { t: "list", items: [
        "Telling your life story instead of focusing on academic and professional evidence.",
        "Listing achievements without explaining what you learned.",
        "Repeating your CV in paragraph form.",
        "Using overly complex vocabulary to sound impressive.",
        "Ignoring the word limit or the specific questions the university asked.",
        "Making excuses for weak grades without showing what has changed since.",
      ] },

      { t: "checklist", title: "Before you submit", items: [
        "It answers every question in the university's instructions.",
        "It is within the word or character limit.",
        "Every claim is backed by a specific example.",
        "The 'why this programme' section is unique to this university.",
        "It sounds like me, not like a template.",
        "Someone I trust has read it for clarity and errors.",
      ] },

      { t: "faq", items: [
        { q: "Is a statement of purpose the same as a personal statement?", a: "They overlap. A statement of purpose usually focuses more on academic goals and research interests, while a personal statement can include more personal background. Follow what each university asks for." },
        { q: "Should I mention low grades?", a: "Only briefly, and only if it helps. Explain the context in one or two sentences, then focus on evidence that you have improved since." },
        { q: "Can someone else edit my statement?", a: "Feedback and proofreading are normal and helpful. However, the ideas, experiences and voice must be yours. Admissions tutors can often spot statements that were written by someone else." },
      ] },
    ],
    sources: [
      { label: "Wordvice: Statement of purpose guidance", url: "https://wordvice.com/blog/?p=1446" },
      { label: "Admit Lab: How long should a statement of purpose be?", url: "https://admit-lab.com/blog/how-long-should-a-statement-of-purpose-be/" },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "common-referencing-mistakes",
    title: "Seven referencing mistakes that quietly cost marks",
    category: "Writing",
    excerpt: "Small, repeated errors in citations add up. Learn the most common APA and Harvard mistakes, with clear examples of how to fix each one.",
    metaDescription: "The most common referencing mistakes in APA and Harvard style, with examples: missing citations, DOI format, et al., hanging indents and more.",
    keywords: ["referencing mistakes", "APA 7 referencing", "Harvard referencing", "how to reference DOI", "et al. APA 7", "hanging indent"],
    updated: "October 2026",
    takeaways: [
      "Use one referencing style consistently, the one your department requires.",
      "Every in-text citation needs a reference list entry, and vice versa.",
      "In APA 7, write DOIs as full links: https://doi.org/…",
      "In APA 7, use 'et al.' from the first citation for three or more authors.",
      "Always check what your reference manager produces.",
    ],
    body: [
      { t: "p", text: "Referencing can feel like a boring technical detail, but markers notice it. Accurate, consistent citations show care and academic honesty. Scattered errors suggest the opposite, even when your ideas are strong. Poor referencing can also lead to accidental plagiarism, which is far more serious than losing a few marks." },
      { t: "p", text: "Here are seven of the most common mistakes, with examples mainly in APA 7th edition, one of the most widely used styles. Always check your own department's guide, because many universities use their own version of a style." },

      { t: "h", text: "1. Mixing referencing styles" },
      { t: "p", text: "Using APA in one section and Harvard in another, or copying references from different websites without adjusting them, creates inconsistency. Pick the style your department requires and apply it everywhere." },

      { t: "h", text: "2. Citations and reference list don't match" },
      { t: "p", text: "Every source you cite in the text must appear in your reference list, and every entry in the list must be cited in the text. This is one of the easiest mistakes to fix, and one of the most common." },
      { t: "tip", text: "Do one final pass that checks only references: go through your text citation by citation and tick each one off in your reference list." },

      { t: "h", text: "3. Getting 'et al.' wrong" },
      { t: "p", text: "In APA 7, for sources with three or more authors, you use the first author's name followed by 'et al.' from the very first in-text citation. In the reference list, however, you list up to 20 authors." },
      { t: "example", label: "APA 7 in-text citation, three or more authors", bad: "(Chen, Patel, Okafor, & Silva, 2022)", good: "(Chen et al., 2022)", why: "APA 7 simplified this rule compared to earlier editions. Other styles such as Harvard may follow different rules, so check your guide." },

      { t: "h", text: "4. Formatting DOIs incorrectly" },
      { t: "p", text: "A DOI (digital object identifier) is a permanent link to an article. In APA 7, it should be written as a full web address, in lower case, with no full stop at the end." },
      { t: "example", label: "APA 7 DOI format", bad: "DOI: 10.1080/03075079.2020.1234567.", good: "https://doi.org/10.1080/03075079.2020.1234567", why: "The correct version is a working link, with no 'DOI:' label and no full stop at the end." },

      { t: "h", text: "5. Missing page numbers for direct quotes" },
      { t: "p", text: "When you quote a source word for word, most styles require a page number (or paragraph number for sources without pages). For example: (Smith, 2019, p. 45). Paraphrasing usually does not require one, although some departments encourage it." },

      { t: "h", text: "6. Forgetting the hanging indent" },
      { t: "p", text: "In APA and many other styles, each reference list entry uses a hanging indent: the first line starts at the margin and the following lines are indented (about 1.27 cm or 0.5 inches). Word processors do not do this automatically. Set it in your paragraph settings, not with spaces or tabs." },

      { t: "h", text: "7. Trusting your reference manager blindly" },
      { t: "p", text: "Tools like Zotero, Mendeley and EndNote save huge amounts of time, but their output is only as good as the information saved. Common problems include titles in the wrong capitalisation, missing issue numbers and author names saved incorrectly. Always check the final list by eye." },

      { t: "h", text: "Bonus: citing sources you haven't read" },
      { t: "p", text: "If you read about a study in another book or article but did not read the original yourself, you should make that clear. This is called secondary citation. In APA, you would write something like: (Brown, 1998, as cited in Smith, 2019). Only Smith goes in your reference list. Where possible, try to find and read the original source." },

      { t: "checklist", title: "Final referencing check", items: [
        "I have used one style throughout, as required by my department.",
        "Every in-text citation has a matching reference list entry.",
        "Direct quotes include page or paragraph numbers.",
        "DOIs are formatted as full links where required.",
        "My reference list is in alphabetical order with hanging indents.",
        "I have checked my reference manager's output by eye.",
      ] },

      { t: "faq", items: [
        { q: "What is the difference between APA and Harvard?", a: "Both are author-date styles, so they look similar. They differ in details such as punctuation, how titles are formatted and how many authors to list. Harvard also has many university-specific versions, so always use your own university's guide." },
        { q: "Do I need to reference ideas I paraphrase?", a: "Yes. Any idea, data or argument that comes from someone else needs a citation, whether you quote it directly or put it in your own words." },
        { q: "Is it plagiarism if I forget a reference?", a: "It can be treated as poor academic practice or plagiarism, depending on how serious and frequent the problem is. Careful referencing protects you." },
      ] },
    ],
    sources: [
      { label: "University of Iowa College of Education: APA style tips", url: "https://education.uiowa.edu/sites/education.uiowa.edu/files/2026-07/APA-Style-Tips-4.pdf" },
      { label: "Appalachian State University: Common APA errors", url: "https://journals.library.appstate.edu/index.php/JTSE/APA" },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "what-help-is-allowed",
    title: "Proofreading, editing, AI detectors: what help is allowed?",
    category: "Integrity",
    excerpt: "Many students worry about crossing a line they cannot see. Here is what universities typically allow, what they don't, and how to protect yourself.",
    metaDescription: "What academic help is allowed at university? A clear guide to proofreading policies, editing, tutoring, AI tools and protecting yourself from false AI-detection flags.",
    keywords: ["is proofreading allowed at university", "university proofreading policy", "academic integrity", "AI detector false positive", "academic misconduct"],
    updated: "October 2026",
    takeaways: [
      "Rules differ between universities, so always read your own policy.",
      "Proofreading for language is often allowed; changing content usually is not.",
      "Tutoring and mentoring that build your understanding are normal and encouraged.",
      "Someone else writing your work is misconduct, whoever it is.",
      "Keep drafts and notes as evidence of your own writing process.",
    ],
    body: [
      { t: "p", text: "Getting help with your studies is normal. Universities offer writing centres, tutors and library support because learning is not meant to be done alone. But many students worry about where the line is. Can a friend check my grammar? Can I pay for proofreading? What if an AI detector flags my work?" },
      { t: "p", text: "This guide explains the typical rules in plain language. One important point first: every university sets its own policy, and some are stricter than others. Treat this as a starting point, and always check your institution's academic integrity and proofreading policies." },

      { t: "h", text: "What is usually allowed" },
      { t: "list", items: [
        "Tutoring and mentoring that help you understand concepts, plan your work or improve your skills.",
        "Feedback that points out problems, which you then fix yourself.",
        "University writing centre and library support.",
        "Proofreading for spelling, grammar and punctuation, where your university permits it.",
        "Help with referencing format and document layout, where permitted.",
      ] },

      { t: "h", text: "What proofreaders typically can and cannot do" },
      { t: "p", text: "Many UK universities publish proofreading policies that define exactly what a third party may do. These policies usually draw the same line: a proofreader can point out language errors, but cannot change your ideas." },
      { t: "example", label: "Typical proofreading rules", bad: "Not allowed: rewriting passages, changing arguments, restructuring sections, adding content, reducing word count, correcting facts or translating your work.", good: "Usually allowed: identifying spelling, grammar and punctuation errors, flagging unclear sentences, and pointing out formatting inconsistencies.", why: "The key principle is that the work you submit must reflect your own knowledge, ideas and writing. Some universities only allow proofreaders to highlight errors for you to correct yourself." },
      { t: "p", text: "Some institutions do not allow paid third-party proofreading at all, except in specific approved cases. This is why checking your own policy is essential." },

      { t: "h", text: "What is not allowed" },
      { t: "list", items: [
        "Someone else writing any part of an assignment you submit as your own. This is often called contract cheating.",
        "Another person making material changes to your arguments, analysis or findings. Universities may treat this as collusion.",
        "Submitting AI-generated text where your course does not allow it.",
        "Buying, selling or sharing completed assignments.",
      ] },
      { t: "p", text: "The consequences can be serious, ranging from a failed module to expulsion. In some countries, including Australia and England, providing or advertising essay-writing services to students is also against the law." },

      { t: "h", text: "What about AI tools?" },
      { t: "p", text: "Policies on AI tools are changing quickly and vary between universities and even between modules. Some allow AI for brainstorming or checking grammar, some require you to declare any use, and some ban it entirely for assessed work. Check your module handbook, and if it is unclear, ask your module leader in writing." },

      { t: "h", text: "If you are worried about AI detectors" },
      { t: "p", text: "AI detection tools are not perfect. They can incorrectly flag human writing, and there have been real cases of honest students being questioned because of them. That understandably makes many students anxious." },
      { t: "steps", items: [
        { title: "Keep your drafts", text: "Save dated versions of your work as you write. Tools like Google Docs and Word keep version history automatically." },
        { title: "Keep your notes and outlines", text: "Reading notes, plans and mind maps show how your ideas developed over time." },
        { title: "Save your feedback", text: "Comments from supervisors, tutors or editors, along with your responses, show your learning process." },
        { title: "Stay calm if questioned", text: "If your work is flagged, ask what evidence the concern is based on, present your drafts and notes, and use the support your university offers, such as a student union adviser." },
      ] },
      { t: "tip", text: "A visible writing process is your best protection. If you can show how your work developed, you can explain it confidently." },

      { t: "h", text: "How Nickora works within these rules" },
      { t: "p", text: "At Nickora, we mentor, guide and edit. We never write assignments or dissertations for students, and we never submit work on anyone's behalf. Before editing, we ask for your institution's policy and work inside it. Our goal is to make you a stronger writer, not to replace your voice." },

      { t: "checklist", title: "Stay on the right side", items: [
        "I have read my university's academic integrity policy.",
        "I know whether third-party proofreading is allowed on my course.",
        "I know my module's rules on AI tools.",
        "I keep dated drafts and notes for every assignment.",
        "Every idea and argument I submit is my own.",
      ] },

      { t: "faq", items: [
        { q: "Can a friend proofread my essay?", a: "Often yes, within the same limits as any proofreader: they can point out language errors, but should not rewrite or change your ideas. Some universities apply the same rules to friends and family as to paid proofreaders." },
        { q: "Is using Grammarly allowed?", a: "Many universities allow basic spelling and grammar tools, but rules about AI-powered rewriting features vary. Check your policy or ask your module leader." },
        { q: "What should I do if I am accused of academic misconduct?", a: "Do not panic. Read the allegation carefully, gather your drafts and notes, and contact your student union or advice service for support before any meeting." },
      ] },
    ],
    sources: [
      { label: "Swansea University: Proofreading policy", url: "https://myuni.swansea.ac.uk/academic-life/academic-regulations/aqs-policies/proof-reading-policy" },
      { label: "Scribbr: Is professional proofreading allowed at a UK university?", url: "https://www.scribbr.co.uk/?p=44070" },
      { label: "Times Higher Education: Fear of being flagged by AI detectors", url: "https://www.timeshighereducation.com/node/741504" },
    ],
  },
];

// Reading time at about 200 words per minute.
export function readTime(a: Article) {
  const text = [a.excerpt, ...a.takeaways, ...a.body.flatMap((b) => {
    switch (b.t) {
      case "h": case "p": case "tip": return [b.text];
      case "list": return b.items;
      case "checklist": return [b.title, ...b.items];
      case "steps": return b.items.flatMap((s) => [s.title, s.text]);
      case "example": return [b.bad, b.good, b.why];
      case "faq": return b.items.flatMap((f) => [f.q, f.a]);
    }
  })].join(" ");
  return `${Math.max(1, Math.round(text.split(/\s+/).length / 200))} min`;
}
