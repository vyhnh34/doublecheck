export type CategoryId =
  | "financial"
  | "identity"
  | "health"
  | "thoughts"
  | "location"
  | "relationships"
  | "work"
  | "creative"
  | "preferences";

export interface SubItem {
  id: string;
  label: string;
  /** Sample matcher used by the detection engine — plain keywords/patterns for the prototype. */
  keywords: string[];
}

export interface Category {
  id: CategoryId;
  label: string;
  description: string;
  subItems: SubItem[];
}

export const CATEGORIES: Category[] = [
  {
    id: "financial",
    label: "Financial",
    description: "Bank, cards, income",
    subItems: [
      { id: "bank-account", label: "Bank account", keywords: ["012345678", "987654321"] },
      { id: "card-number", label: "Card number", keywords: ["4111 1111 1111 1111", "4242 4242 4242 4242"] },
      { id: "income", label: "Income", keywords: ["$85,000", "$120,000"] },
    ],
  },
  {
    id: "identity",
    label: "Identity & ID",
    description: "Name, email, address, ID",
    subItems: [
      { id: "full-name", label: "Full name", keywords: ["Alex", "Alexandra Chen"] },
      { id: "email", label: "Email address", keywords: ["@gmail.com", "@icloud.com", "@outlook.com"] },
      { id: "home-address", label: "Home address", keywords: ["Maple Street", "Elm Avenue", "123 Maple"] },
      { id: "phone", label: "Phone number", keywords: ["555-0142", "206-555-0117"] },
    ],
  },
  {
    id: "health",
    label: "Health",
    description: "Conditions, meds, mental health",
    subItems: [
      { id: "condition", label: "Condition", keywords: ["diabetes", "asthma", "insomnia", "migraines", "chronic pain"] },
      { id: "medication", label: "Medication", keywords: ["metformin", "sertraline", "albuterol"] },
      { id: "mental-health", label: "Mental health", keywords: ["my anxiety", "my therapist", "panic attack"] },
    ],
  },
  {
    id: "thoughts",
    label: "Personal thoughts",
    description: "Journaling, fears, values",
    subItems: [
      { id: "journal-entry", label: "Journal entry", keywords: ["dear diary", "journal entry"] },
      { id: "fear", label: "Fears", keywords: ["I'm scared of", "my biggest fear is"] },
      { id: "value", label: "Values", keywords: ["what matters most to me", "I believe in"] },
    ],
  },
  {
    id: "location",
    label: "Location & browsing",
    description: "Where you go, what you search",
    subItems: [
      { id: "city", label: "City", keywords: ["Seattle", "Portland", "Chicago"] },
      { id: "zip", label: "ZIP code", keywords: ["98101", "97201", "60601"] },
      { id: "search-query", label: "Search query", keywords: ["I searched for", "googled"] },
    ],
  },
  {
    id: "relationships",
    label: "Relationships",
    description: "Partners, friends, family",
    subItems: [
      { id: "partner", label: "Partner", keywords: ["my boyfriend", "my girlfriend", "my husband", "my wife"] },
      { id: "family", label: "Family", keywords: ["my mom", "my dad", "my sister", "my brother"] },
      { id: "friend", label: "Friend", keywords: ["my best friend", "my roommate"] },
    ],
  },
  {
    id: "work",
    label: "Work & education",
    description: "Employer, job title, school",
    subItems: [
      { id: "employer", label: "Employer", keywords: ["I work at", "my employer"] },
      { id: "job-title", label: "Job title", keywords: ["software engineer", "product manager"] },
      { id: "school", label: "School", keywords: ["University of Washington", "my professor"] },
    ],
  },
  {
    id: "creative",
    label: "Creative work",
    description: "Drafts, code, design files",
    subItems: [
      { id: "draft", label: "Unpublished draft", keywords: ["unpublished draft", "my manuscript"] },
      { id: "code", label: "Code", keywords: ["private repo", "my codebase"] },
      { id: "design-file", label: "Design file", keywords: ["Figma file", "design mockup"] },
    ],
  },
  {
    id: "preferences",
    label: "Preferences",
    description: "Food, travel, hobbies",
    subItems: [
      { id: "food", label: "Food", keywords: ["I'm vegetarian", "allergic to"] },
      { id: "travel", label: "Travel", keywords: ["planning a trip to", "flying to"] },
      { id: "hobby", label: "Hobby", keywords: ["in my free time I", "my hobby is"] },
    ],
  },
];
