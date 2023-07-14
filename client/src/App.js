import { useContext } from "react";
import TopBar from "./components/topbar/TopBar";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Settings from "./pages/settings/Settings";
import Single from "./pages/single/Single";
import Write from "./pages/write/Write";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Context } from "./context/Context";

function App() {
  const { user } = useContext(Context);
  return (
    <BrowserRouter>
      <TopBar />
      <Routes>
        <Route index element={<Home />} />
        <Route path="login" element={user ? <Home /> : <Login />} />
        <Route path="Register" element={user ? <Home /> : <Register />} />
        <Route path="Settings" element={user ? <Settings /> : <Register />} />
        <Route path="Write" element={user ? <Write /> : <Register />} />
        <Route path="post/:postId" element={<Single />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
