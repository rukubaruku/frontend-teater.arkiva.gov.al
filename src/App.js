import "./App.css";
import { Route, Routes } from "react-router-dom";
import PublicComponent from "./Public/PublicComponent";
import Login from "./Admin/Login/Login";

function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicComponent />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
