import React, { useEffect, useState } from "react";
import "./DashboardScreen.css";
import TaskBoard from "../../components/TaskBoard/TaskBoard";
import TodoIcon from "../../assets/svg/ToDoIcon.svg";
import DoingIcon from "../../assets/svg/DoingIcon.svg";
import DoneIcon from "../../assets/svg/DoneIcon.svg";
import Header from "../../components/Header/Header";
import { getItem, getUserIdFromToken } from "../../core/RequestEngine";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      const token = sessionStorage.getItem("token");
      if (!token) {
        console.error("Token not found. Unable to fetch tasks.");
        setLoading(false);
        return;
      }

      const userId = getUserIdFromToken(token);
      if (!userId) {
        console.error("Failed to extract userId from token.");
        setLoading(false);
        return;
      }

      try {
        const response = await getItem(`todo/user/${userId}`);
        setTasks(response.data || []);
      } catch (error) {
        console.error(error.message || "Failed to fetch tasks.");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const addNewTask = (newTask) => {
    setTasks((prevTasks) => [newTask, ...prevTasks]);
  };

  const deleteTask = (taskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.toDoId !== taskId));
  };

  const updateTaskStatus = (updatedTask) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.toDoId === updatedTask.toDoId ? updatedTask : task
      )
    );
  };

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const todoTasks = filteredTasks.filter((task) => task.status === "ToDo");
  const doingTasks = filteredTasks.filter((task) => task.status === "Doing");
  const doneTasks = filteredTasks.filter((task) => task.status === "Done");

  if (loading) return <p>Loading tasks...</p>;

  return (
    <div className="dashboard">
      <Header addNewTask={addNewTask} setSearchQuery={setSearchQuery} />
      <div className="task-boards">
        <TaskBoard
          key={tasks.length}
          title="ToDo"
          src={TodoIcon}
          tasks={todoTasks}
          onTaskUpdate={updateTaskStatus}
          onTaskDelete={deleteTask}
          searchQuery={searchQuery}
        />
        <TaskBoard
          title="Doing"
          src={DoingIcon}
          tasks={doingTasks}
          onTaskUpdate={updateTaskStatus}
          onTaskDelete={deleteTask}
          searchQuery={searchQuery}
        />
        <TaskBoard
          title="Done"
          src={DoneIcon}
          tasks={doneTasks}
          onTaskUpdate={updateTaskStatus}
          onTaskDelete={deleteTask}
          searchQuery={searchQuery}
        />
      </div>
    </div>
  );
}

export default Dashboard;
