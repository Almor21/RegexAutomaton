import { useState } from "react";
import InputRegex from "./components/InputRegex";
import Title from "./components/Title";
import "./App.css";

function App() {
  const [regex, setRegex] = useState('');

  return (
    <>
      <Title />
      <InputRegex set={setRegex} />
    </>
  );
}

export default App;
