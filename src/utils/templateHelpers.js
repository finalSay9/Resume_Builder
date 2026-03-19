/**
 * Converts the new data model into a normalized shape all templates can use.
 * This is the single place that bridges builder data → template rendering.
 */
export function normalizeData(data) {
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    try {
      const [y, m] = dateStr.split("-");
      if (!m) return y;
      const month = new Date(`${y}-${m}-01`).toLocaleString("en", { month: "short" });
      return `${month} ${y}`;
    } catch { return dateStr; }
  };

  return {
    name:     data.fullName || data.name || "",
    title:    data.experience?.[0]?.jobTitle || data.title || "",
    email:    data.email    || "",
    phone:    data.phone    || "",
    location: data.location || "",
    website:  data.website  || "",
    summary:  data.summary  || "",

    experience: (data.experience || []).map((e) => ({
      id:      e.id,
      role:    e.jobTitle   || e.role    || "",
      company: e.company    || "",
      location: e.location  || "",
      period:  e.currentlyWorking
        ? `${formatDate(e.startDate)} – Present`
        : e.startDate
          ? `${formatDate(e.startDate)} – ${formatDate(e.endDate) || "Present"}`
          : e.period || "",
      bullets: e.description
        ? e.description.split("\n").map(l => l.replace(/^[-•*]\s*/, "").trim()).filter(Boolean)
        : (e.bullets || []).filter(Boolean),
    })),

    education: (data.education || []).map((e) => ({
      id:      e.id,
      school:  e.school      || "",
      degree:  e.degree      || "",
      field:   e.fieldOfStudy || e.field || "",
      year:    e.graduationYear || e.year || "",
      city:    e.city        || "",
      country: e.country     || "",
    })),

    skills: (data.skills || []).filter(Boolean),

    certifications: (data.extras || [])
      .filter(x => x.type === "certification" && x.value)
      .map(x => x.value),

    accomplishments: (data.extras || [])
      .filter(x => x.type === "accomplishment" && x.value)
      .map(x => x.value),

    languages: (data.extras || [])
      .filter(x => x.type === "language" && x.value)
      .map(x => x.value),

    hobbies: (data.extras || [])
      .filter(x => x.type === "hobby" && x.value)
      .map(x => x.value),
  };
}