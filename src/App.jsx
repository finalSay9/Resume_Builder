import { useState } from "react";
import HomePage from "./Components/HomePage";
import BuilderPage from "./Components/BuilderPage";
import { EMPTY_DATA, SAMPLE_DATA } from "./utils/dataModel";

export { SAMPLE_DATA }; // re-export for HomePage preview

export default function App() {
  const [page,     setPage]     = useState("home");
  const [data,     setData]     = useState(EMPTY_DATA);
  const [template, setTemplate] = useState("Modern");

  const startFresh  = () => { setData({ ...EMPTY_DATA }); setPage("build"); };
  const loadSample  = () => { setData(SAMPLE_DATA);        setPage("build"); };
  const handleUpload = (parsed) => { setData(parsed);      setPage("build"); };

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
    />
  );
}