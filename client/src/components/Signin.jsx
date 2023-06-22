import React, { useState, useContext } from "react";
import { LoginContext } from "../ContextProvider";
import { useNavigate } from "react-router-dom";
import "../App.css";
const SignIn = ({ isSigin }) => {
  const [userDetails, setUserDetails] = useState({
    password: "",
    email: "",
  });
  const { userLoggedIn, setUserLoggedIn } = useContext(LoginContext);
  const navigate = useNavigate();
  const register = () => {
    const fetchUrl = isSigin
      ? "https://backendfortaskmanager.onrender.com/sigin"
      : "https://backendfortaskmanager.onrender.com/login";
    const bodyData = {
      password: userDetails.password,
      email: userDetails.email,
    };

    fetch(fetchUrl, {
      method: "POST",
      body: JSON.stringify(bodyData),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((res) => {
        console.log({ res });
        if (res.loggedIn) {
          setUserLoggedIn({
            loggedIn: true,
            userEmail: res.email,
            tasks: res.tasks || [],
          });
          localStorage.setItem(
            "userLoggedIn",
            JSON.stringify({
              loggedIn: true,
              userEmail: res.email,
              tasks: res.tasks || [],
            })
          );
          navigate("/taskManager");
        } else {
          alert(`${res.message}`);
        }
      });
  };

  React.useEffect(() => {
    if (userLoggedIn.loggedIn) {
      navigate("/taskManager");
    }
    return () => {};
  }, []);

  return (
    <div className="mainWrapper">
      <div className="main">
        <div className="wrapperDiv">
          <input
            type="email"
            className="loginInput"
            required
            placeholder="Enter Your email"
            value={userDetails.email}
            onChange={(e) => {
              setUserDetails((prev) => ({
                ...prev,
                email: e.target.value,
              }));
            }}
          />
          <input
            type="password"
            required
            className="loginInput"
            placeholder="Enter your password"
            value={userDetails.password}
            onChange={(e) => {
              setUserDetails((prev) => ({
                ...prev,
                password: e.target.value,
              }));
            }}
          />
          <button type="submit" className={"siginButton"} onClick={register}>
            {isSigin ? "Sign In" : "Log In"}
          </button>
          <div
            className="linkButton"
            onClick={() => {
              navigate(isSigin ? "/" : "/signin");
            }}
          >
            {isSigin ? "Log In" : "Sign In"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
