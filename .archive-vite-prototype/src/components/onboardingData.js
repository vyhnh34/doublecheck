import {
  CreditCard, Heart, BookOpen, MapPin, Users,
  Briefcase, Paintbrush, Star, FileText,
} from 'lucide-react'

export const CATS = [
  { id: 'financial',     Icon: CreditCard,  label: 'Financial',           sub: 'Bank, cards, income',              detail: 'Bank accounts, credit & debit cards, salary, loans, investments, and spending history.',             main: true  },
  { id: 'identity',      Icon: FileText,    label: 'Identity & ID',        sub: 'Name, email, address, ID',         detail: 'Full name, email addresses, home address, phone number, passport, and date of birth.',              main: true  },
  { id: 'health',        Icon: Heart,       label: 'Health',               sub: 'Conditions, meds, mental health',  detail: 'Medical diagnoses, prescriptions, therapy notes, mental health history, and fitness data.',         main: true  },
  { id: 'thoughts',      Icon: BookOpen,    label: 'Personal thoughts',    sub: 'Journaling, fears, values',        detail: 'Private journal entries, personal fears, deeply held values, and anything you write to reflect.',    main: true  },
  { id: 'location',      Icon: MapPin,      label: 'Location & browsing',  sub: 'Where you go, what you search',    detail: 'GPS coordinates, places visited, search queries, websites browsed, and commute patterns.',           main: true  },
  { id: 'relationships', Icon: Users,       label: 'Relationships',        sub: 'Partners, friends, family',        detail: 'Romantic partners, family members, close friends, contact lists, and conversation content.',        main: true  },
  { id: 'work',          Icon: Briefcase,   label: 'Work & education',     sub: 'Resume, performance, career',      detail: 'Employer details, job title, performance reviews, career goals, and educational background.',       main: false },
  { id: 'creative',      Icon: Paintbrush,  label: 'Creative work',        sub: 'Drafts, designs, code, ideas',     detail: 'Unpublished writing, code repositories, design files, and ideas you haven\'t shared yet.',         main: false },
  { id: 'preferences',   Icon: Star,        label: 'Preferences',          sub: 'Food, travel, shopping, hobbies',  detail: 'Dietary preferences, travel destinations, shopping habits, favourite media, and hobbies.',          main: false },
]

export const RULE_LABEL = {
  ask:   'Nudge me',
  share: 'Share automatically',
  never: 'Not nudging',
}

export const RULE_TRAILING = {
  ask:   'Nudge me',
  share: 'Automatically',
  never: 'Not nudging',
}

export const INITIAL_RULES = Object.fromEntries(CATS.map((c) => [c.id, 'ask']))
