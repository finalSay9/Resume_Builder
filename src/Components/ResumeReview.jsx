import ModernTemplate   from "../Templates/ModernTemplate";
import ClassicTemplate  from "../Templates/ClassicTemplate";
import CreativeTemplate from "../Templates/CreativeTemplate";
import MinimalTemplate  from "../Templates/MinimalTemplate";
import BoldTemplate     from "../Templates/BoldTemplate";
import ElegantTemplate  from "../Templates/ElegantTemplate";
import { TEMPLATE_THEMES } from "../utils/constants";
import { normalizeData }   from "../utils/templateHelpers";

export default function ResumePreview({ data, template }) {
  const t  = TEMPLATE_THEMES[template] ?? TEMPLATE_THEMES.Modern;
  const nd = normalizeData(data); // normalize once here

  const props = { data: nd, t };

  switch (template) {
    case "Classic":  return <ClassicTemplate  {...props} />;
    case "Creative": return <CreativeTemplate {...props} />;
    case "Minimal":  return <MinimalTemplate  {...props} />;
    case "Bold":     return <BoldTemplate     {...props} />;
    case "Elegant":  return <ElegantTemplate  {...props} />;
    default:         return <ModernTemplate   {...props} />;
  }
}