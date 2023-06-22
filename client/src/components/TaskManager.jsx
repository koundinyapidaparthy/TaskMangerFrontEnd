import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../ContextProvider";
import { Edit, Save, Cancel, Add, ExitToApp, Delete } from "@material-ui/icons";
import "./Task.css";
function TaskManager() {
  const { userLoggedIn, setUserLoggedIn } = useContext(LoginContext);
  const navigate = useNavigate();
  const [userTasks, setUserTasks] = React.useState([]);
  const [editTasks, setEditTask] = React.useState({});
  const userName = (userLoggedIn.userEmail || "").split("@")[0];
  function onSave(currentItemIndex, isDelete) {
    let updatedUserTasks = [...userTasks];
    if (!isDelete) {
      updatedUserTasks[currentItemIndex] = {
        task: editTasks.newVal,
        completed: editTasks.completed,
      };
    } else if (isDelete) {
      updatedUserTasks = updatedUserTasks.filter(
        (_each, index) => index !== currentItemIndex
      );
    }

    fetch("https://backendfortaskmanager.onrender.com/storeData", {
      method: "POST",
      body: JSON.stringify({
        email: userLoggedIn.userEmail,
        tasks: updatedUserTasks,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((res) => {
        console.log({ res });
        if (res.status) {
          console.log(res.message);
        } else {
          alert("Issue Occured");
        }
      });
    setUserTasks(updatedUserTasks);
    setEditTask({});
  }
  React.useEffect(() => {
    if (!userLoggedIn.loggedIn) {
      navigate("/");
    } else {
      fetch("https://backendfortaskmanager.onrender.com/findUserTasks", {
        method: "POST",
        body: JSON.stringify({
          email: userLoggedIn.userEmail,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })
        .then((response) => response.json())
        .then((res) => {
          if (res.status) {
            setUserTasks(res.tasks || []);
          } else {
            alert(res.message);
          }
        });
    }
    return () => {};
  }, []);
  return (
    <div>
      <div className="LogoutWrapper">
        <div className="userDetails">Hey!, {userName}</div>
        <button
          className="LogoutButton"
          onClick={() => {
            localStorage.setItem("userLoggedIn", "{}");
            setUserLoggedIn({});
            navigate("/");
          }}
        >
          <ExitToApp />
        </button>
      </div>
      <div className="taskContainer">
        {(userTasks || []).map(({ completed, task }, index) => {
          const isEditMode = editTasks.index === index;
          const classNameForDisabled = editTasks.index >= 0;
          return (
            <div key={index} className="eachTask">
              <input
                type="checkbox"
                className={
                  isEditMode ? "checkboxInput" : "checkboxInput disabled"
                }
                disabled={!isEditMode}
                checked={!isEditMode ? !!completed : !!editTasks.completed}
                onChange={(event) => {
                  setEditTask((prev) => ({
                    ...prev,
                    completed: event.target.checked,
                  }));
                }}
              />
              {!isEditMode && <div>{task}</div>}
              {isEditMode && (
                <input
                  type="text"
                  name="task"
                  className="taskInput"
                  defaultValue={task}
                  onKeyDown={(event) => {
                    if (event.keyCode == 13) {
                      onSave(index);
                    }
                  }}
                  onChange={(event) => {
                    setEditTask((prev) => ({
                      ...prev,
                      newVal: event.target.value,
                    }));
                  }}
                />
              )}
              {!isEditMode && (
                <div className="actionCenter">
                  <Edit
                    onClick={() => {
                      setEditTask({
                        prev: task,
                        newVal: task,
                        index,
                        completed,
                      });
                    }}
                    className={classNameForDisabled ? "edit disabled" : "edit"}
                  />
                  <Delete
                    onClick={() => {
                      onSave(index, true);
                    }}
                    className={
                      classNameForDisabled ? "delete disabled" : "delete"
                    }
                  />
                </div>
              )}
              {isEditMode && (
                <div className="actionCenter">
                  <Cancel
                    className={
                      task && editTasks.prev ? "cancel" : "cancel disabled"
                    }
                    onClick={() => {
                      setEditTask({});
                    }}
                  />
                  <Save
                    className={editTasks.newVal ? "save" : "save disabled"}
                    onClick={() => onSave(index)}
                  />
                </div>
              )}
            </div>
          );
        })}
        {(userTasks || []).length <= 0 && (
          <div className="noTask">No Tasks Are Added</div>
        )}
        <button
          className={editTasks.index >= 0 ? "addTask disabled" : "addTask"}
          onClick={() => {
            setUserTasks((prev) => [
              ...prev,
              {
                completed: false,
                task: "",
                isNew: true,
              },
            ]);
            setEditTask({
              prev: "",
              newVal: "",
              index: userTasks.length,
              completed: false,
            });
          }}
        >
          <Add className="plus" /> Add a Task
        </button>
      </div>
    </div>
  );
}
export default TaskManager;
