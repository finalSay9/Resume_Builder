// ─── Central data model ───────────────────────────────────────────────────────

export const DEGREE_OPTIONS = [
  "High School Diploma",
  "GED",
  "Associate of Arts (AA)",
  "Associate of Science (AS)",
  "Associate of Applied Science (AAS)",
  "Bachelor of Arts (BA)",
  "Bachelor of Science (BS)",
  "Bachelor of Business Administration (BBA)",
  "Bachelor of Engineering (BEng)",
  "Bachelor of Fine Arts (BFA)",
  "Bachelor of Education (BEd)",
  "Bachelor of Laws (LLB)",
  "Bachelor of Medicine (MBBS / MBChB)",
  "Bachelor of Nursing (BN)",
  "Bachelor of Technology (BTech)",
  "Master of Arts (MA)",
  "Master of Science (MS / MSc)",
  "Master of Business Administration (MBA)",
  "Master of Engineering (MEng)",
  "Master of Fine Arts (MFA)",
  "Master of Education (MEd)",
  "Master of Laws (LLM)",
  "Master of Public Health (MPH)",
  "Master of Social Work (MSW)",
  "Master of Public Administration (MPA)",
  "Doctor of Philosophy (PhD)",
  "Doctor of Medicine (MD)",
  "Doctor of Education (EdD)",
  "Doctor of Business Administration (DBA)",
  "Doctor of Law (JD)",
  "Doctor of Pharmacy (PharmD)",
  "Doctor of Nursing Practice (DNP)",
  "Professional Certificate",
  "Postgraduate Diploma",
  "Other",
];

export const EMPTY_EXPERIENCE = () => ({
  id: Date.now() + Math.random(),
  jobTitle: "",
  company: "",
  location: "",
  startDate: "",
  endDate: "",
  currentlyWorking: false,
  description: "",
});

export const EMPTY_EDUCATION = () => ({
  id: Date.now() + Math.random(),
  school: "",
  degree: "",
  fieldOfStudy: "",
  country: "",
  city: "",
  startYear: "",
  graduationYear: "",
});

export const EMPTY_EXTRA = () => ({
  id: Date.now() + Math.random(),
  type: "certification", // certification | accomplishment | language | hobby
  value: "",
});

export const EMPTY_DATA = {
  // Personal
  fullName: "",
  email: "",
  phone: "",
  location: "",
  // Experience
  experience: [EMPTY_EXPERIENCE()],
  // Education
  education: [EMPTY_EDUCATION()],
  // Skills
  skills: [],
  skillInput: "",
  // Summary
  summary: "",
  // Extras
  extras: [],
};

export const SAMPLE_DATA = {
  fullName: "Alex Johnson",
  email: "alex.johnson@email.com",
  phone: "+1 (555) 234-5678",
  location: "San Francisco, CA",
  experience: [
    {
      id: 1,
      jobTitle: "Senior Product Designer",
      company: "Stripe",
      location: "San Francisco, CA",
      startDate: "2021-03",
      endDate: "",
      currentlyWorking: true,
      description:
        "Led redesign of core dashboard used by 500K+ businesses globally. Built and maintained Stripe's design system (Sail UI) with 200+ components. Mentored 3 junior designers and established the design review process. Collaborated with engineering and product teams to ship 15+ major feature releases.",
    },
    {
      id: 2,
      jobTitle: "Product Designer",
      company: "Figma",
      location: "San Francisco, CA",
      startDate: "2018-06",
      endDate: "2021-02",
      currentlyWorking: false,
      description:
        "Designed collaborative editing features used by 4M+ users worldwide. Improved onboarding flow, increasing activation rate by 28%. Partnered with engineering to ship 12 major feature releases on time.",
    },
  ],
  education: [
    {
      id: 1,
      school: "Rhode Island School of Design",
      degree: "Bachelor of Fine Arts (BFA)",
      fieldOfStudy: "Graphic Design",
      country: "United States",
      city: "Providence, RI",
      startYear: "2012",
      graduationYear: "2016",
    },
  ],
  skills: ["Figma", "Prototyping", "Design Systems", "User Research", "Sketch", "Adobe XD", "HTML/CSS", "Accessibility"],
  skillInput: "",
  summary:
    "Creative product designer with 7+ years of experience crafting intuitive digital experiences. Proven ability to lead design systems, collaborate cross-functionally, and ship products used by millions. Passionate about accessibility and human-centered design.",
  extras: [
    { id: 1, type: "certification", value: "Google UX Design Certificate" },
    { id: 2, type: "certification", value: "Nielsen Norman UX Certification" },
    { id: 3, type: "language",      value: "English (Native)" },
    { id: 4, type: "language",      value: "Spanish (Conversational)" },
    { id: 5, type: "accomplishment", value: "Speaker at Design Summit 2023" },
    { id: 6, type: "hobby",         value: "Photography & Film" },
  ],
};