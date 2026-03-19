import { useState } from "react";
import HomePage from "./Components/HomePage";
import BuilderPage from "./Components/BuilderPage";

export const EMPTY_DATA = {
  name: "", title: "", email: "", phone: "", location: "", website: "",
  summary: "",
  experience: [{ id: 1, company: "", role: "", period: "", bullets: [""] }],
  education:  [{ id: 1, school: "", degree: "", year: "", gpa: "" }],
  skills: [""],
  certifications: [""],
  languages: [""],
};

export const SAMPLE_DATA = {
  name: "Alex Johnson",
  title: "Senior Product Designer",
  email: "alex.johnson@email.com",
  phone: "+1 (555) 234-5678",
  location: "San Francisco, CA",
  website: "alexjohnson.design",
  summary:
    "Creative product designer with 7+ years of experience crafting intuitive digital experiences. Proven ability to lead design systems, collaborate cross-functionally, and ship products used by millions. Passionate about accessibility and human-centered design.",
  experience: [
    { id: 1, company: "Stripe",  role: "Senior Product Designer", period: "2021 – Present",
      bullets: ["Led redesign of core dashboard used by 500K+ businesses", "Built and maintained Stripe's design system (Sail UI)", "Mentored 3 junior designers and established design review process"] },
    { id: 2, company: "Figma",   role: "Product Designer",        period: "2018 – 2021",
      bullets: ["Designed collaborative editing features used by 4M+ users", "Improved onboarding flow, increasing activation rate by 28%", "Partnered with engineering to ship 12 major feature releases"] },
    { id: 3, company: "Airbnb",  role: "UX Designer",             period: "2016 – 2018",
      bullets: ["Redesigned host onboarding, reducing drop-off by 35%", "Conducted 50+ user interviews to inform product decisions"] },
  ],
  education: [
    { id: 1, school: "Rhode Island School of Design", degree: "BFA, Graphic Design", year: "2016", gpa: "3.9" },
  ],
  skills: ["Figma", "Prototyping", "Design Systems", "User Research", "Sketch", "Adobe XD", "HTML/CSS", "Accessibility"],
  certifications: ["Google UX Design Certificate", "Nielsen Norman UX Certification"],
  languages: ["English (Native)", "Spanish (Conversational)"],
};

export default function App() {
  const [page, setPage]         = useState("home");
  const [data, setData]         = useState(EMPTY_DATA);
  const [template, setTemplate] = useState("Modern");

  const startFresh = () => { setData(EMPTY_DATA);   setPage("build"); };
  const loadSample = () => { setData(SAMPLE_DATA);  setPage("build"); };

  // Called after the user uploads and we've parsed their CV text
  const handleUpload = (parsedData) => {
    setData(parsedData);
    setPage("build");
  };

  if (page === "home")
    return (
      <HomePage
        onStart={startFresh}
        onSample={loadSample}
        onUpload={handleUpload}
        setTemplate={setTemplate}
      />
    );

  return (
    <BuilderPage
      data={data}
      setData={setData}
      template={template}
      setTemplate={setTemplate}
      onBack={() => setPage("home")}
      sampleData={SAMPLE_DATA}
    />
  );
}