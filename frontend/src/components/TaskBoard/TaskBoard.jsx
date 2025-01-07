import React, { useState, useEffect } from "react";
import "./TaskBoard.css";
import TaskCard from "../TaskCard/TaskCard";
import { updateItem } from "../../core/RequestEngine";

function TaskBoard({
  title,
  src,
  tasks,
  onTaskUpdate,
  onTaskDelete,
  searchQuery,
}) {
  const [taskList, setTaskList] = useState(tasks);

  useEffect(() => {
    setTaskList(tasks);
  }, [tasks]);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add("drag-over");
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove("drag-over");
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove("drag-over");

    const taskData = JSON.parse(e.dataTransfer.getData("taskData"));

    try {
      const updatedTask = { ...taskData, status: title };

      // Ensure task is updated correctly
      await updateItem("todo", updatedTask.toDoId, updatedTask);

      const updatedTasks = taskList.map((task) =>
        task.toDoId === updatedTask.toDoId ? updatedTask : task
      );
      setTaskList(updatedTasks);

      if (onTaskUpdate) {
        onTaskUpdate(updatedTask);
      }
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  return (
    <div
      className="task-board"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <h2 className="board-title">
        <img src={src} alt="Title Icon" className="title-icon" />
        {title}
      </h2>
      {taskList.map((task) => (
        <TaskCard
          key={task.toDoId}
          {...task}
          onSave={onTaskUpdate}
          onDelete={onTaskDelete}
          searchQuery={searchQuery}
        />
      ))}
    </div>
  );
}

export default TaskBoard;
