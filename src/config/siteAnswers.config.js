/**
 * Answers for questions this site does not already answer.
 * Anything written on a page is searched from that page instead.
 *
 * Entries here also appear as the "Questions you can ask" suggestion buttons.
 */
export const siteAnswers = [
  {
    question: "Where is Lowell High School?",
    keywords: ["address", "location", "campus", "eucalyptus", "directions"],
    answer:
      "Lowell High School is at 1101 Eucalyptus Drive, San Francisco, CA 94132. The campus address is not listed on this LSA site.",
    to: "https://www.sfusd.edu/school/lowell-high-school",
  },
  {
    question: "Where is the bell schedule?",
    keywords: ["bell", "schedule", "periods", "what time", "block", "dismissal"],
    answer:
      "This site does not post the bell schedule. Check with the main office or the SFUSD Lowell High School page for the current times.",
    to: "https://www.sfusd.edu/school/lowell-high-school",
  },
  {
    question: "How do I check my grades?",
    keywords: ["grades", "studentvue", "gpa", "report card", "assignments"],
    answer:
      "Grades are not on this site. Sign in to SFUSD StudentVUE, or ask the main office if you cannot get into your account.",
  },
  {
    question: "How do I get a transcript?",
    keywords: ["transcript", "records", "registrar", "counseling"],
    answer:
      "Transcripts are not on this site. Request them through the counseling office or the school registrar.",
  },
  {
    question: "How do I reach the main office?",
    keywords: ["phone", "call", "attendance", "tardy", "office", "contact the school"],
    answer:
      "The main office phone number is not listed on this site. School contacts are on the SFUSD Lowell High School page.",
    to: "https://www.sfusd.edu/school/lowell-high-school",
  },
  {
    question: "How do I reset my school password?",
    keywords: ["password", "login", "email", "google account", "locked out"],
    answer:
      "School email and password resets are not handled on this site. Use SFUSD account help, or ask the main office.",
  },
  {
    question: "How do I replace my student ID?",
    keywords: ["id card", "student id", "lost id", "replacement"],
    answer:
      "Student ID replacements are not on this site. Ask the main office.",
  },
];

/**
 * General questions people can type into search.
 * Matched with a distinct answer, but never shown as suggestion buttons.
 */
export const siteGeneralAnswers = [
  {
    question: "What is the LSA?",
    keywords: [
      "what is lsa",
      "lowell student association",
      "student government",
      "what does lsa do",
      "who runs this site",
    ],
    answer:
      "The Lowell Student Association (LSA) is Lowell's student government. It runs events, clubs coordination, spirit, and student advocacy. Learn more on the About LSA page.",
    to: "/LSA",
  },
  {
    question: "How do I start a club?",
    keywords: [
      "start a club",
      "new club",
      "create a club",
      "register a club",
      "club application",
    ],
    answer:
      "Use the club resources guide for steps on starting a new club, including forms and coordinator contacts.",
    to: "/Clubs/NewClub",
  },
  {
    question: "How do I join a club?",
    keywords: ["join a club", "sign up for club", "club meeting", "find a club"],
    answer:
      "Browse Clubs & Sports for meeting times and contacts, then show up to a meeting or message the club through Instagram or their website if listed.",
    to: "/Clubs",
  },
  {
    question: "What are Cardinalympics?",
    keywords: [
      "cardinalympics",
      "cardinal olympics",
      "house games",
      "class competition",
    ],
    answer:
      "Cardinalympics is Lowell's class competition with events and a scoreboard. See the Cardinalympics page for schedules, scores, and signup when open.",
    to: "/Cardinalympics",
  },
  {
    question: "When are student elections?",
    keywords: [
      "student elections",
      "vote",
      "campaign",
      "election results",
      "when do elections",
    ],
    answer:
      "Election dates and ballots are posted on the Elections pages when a cycle is open. Check there for candidates, voting, and results.",
    to: "/Elections",
  },
  {
    question: "Where can I find wellness resources?",
    keywords: [
      "wellness",
      "mental health",
      "counseling resources",
      "feeling stressed",
      "support",
    ],
    answer:
      "Wellness and support links are collected on the Resources → Wellness page.",
    to: "/Resources/Wellness",
  },
  {
    question: "What is Title IX?",
    keywords: ["title ix", "title 9", "harassment", "discrimination", "report"],
    answer:
      "Title IX covers sex-based discrimination and harassment. See the Title IX page for how reporting works at Lowell / SFUSD.",
    to: "/Resources/TitleIX",
  },
  {
    question: "Where is the school calendar?",
    keywords: [
      "school calendar",
      "academic calendar",
      "holidays",
      "minimum day",
      "days off",
    ],
    answer:
      "This LSA site does not host the official academic calendar. Use the SFUSD Lowell page or district calendar for holidays and term dates.",
    to: "https://www.sfusd.edu/school/lowell-high-school",
  },
  {
    question: "What is the best bathroom at Lowell?",
    keywords: [
      "best bathroom",
      "best restroom",
      "nicest bathroom",
      "cleanest bathroom",
      "bathroom ranking",
      "which bathroom",
    ],
    answer: 
      "All are equal.",
  },
];

/** All searchable Q&A (suggested buttons + typed-only general questions). */
export const allSiteAnswers = [...siteAnswers, ...siteGeneralAnswers];
