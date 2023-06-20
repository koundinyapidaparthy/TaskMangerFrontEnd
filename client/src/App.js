import React from "react";
import "./App.css";
import Login from "./components/Signin";
import TaskManager from "./components/TaskManager";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import { LoginContext } from "./ContextProvider";
function App() {
  const loggedInDetails = JSON.parse(
    localStorage.getItem("userLoggedIn") || "{}"
  );
  const [userLoggedIn, setUserLoggedIn] = React.useState({
    loggedIn: false,
    userEmail: "",
    tasks: [],
    ...loggedInDetails,
  });
  return (
    <div>
      <LoginContext.Provider
        value={{
          userLoggedIn,
          setUserLoggedIn,
        }}
      >
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signin" element={<Login isSigin />} />
            <Route path="/taskManager" element={<TaskManager />} />
          </Routes>
        </BrowserRouter>
      </LoginContext.Provider>
    </div>
  );
}

export default App;
