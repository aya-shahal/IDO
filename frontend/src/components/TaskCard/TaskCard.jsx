// TaskCard.js
import React, { useState } from "react";
import "./TaskCard.css";
import { updateItem, deleteItem } from "../../core/RequestEngine";
import Edit from "../../assets/svg/edit1.svg";
import Trash from "../../assets/images/trash.png";

function TaskCard({
  toDoId,
  title,
  category,
  dueDate,
  estimate,
  taskImportance,
  onSave,
  onDelete,
  searchQuery,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({
    toDoId,
    title,
    category,
    dueDate,
    estimate,
    taskImportance,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedTask((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // const handleDelete = async () => {
  //   try {
  //     await deleteItem("todo", editedTask.toDoId);
  //     if (onDelete) {
  //       onDelete(editedTask.toDoId);
  //     }
  //     alert("Item deleted successfully!");
  //   } catch (error) {
  //     console.error("Error deleting task:", error);
  //     alert("Failed to delete task.");
  //   }
  // };

  const handleEdit = async () => {
    try {
      const updatedTask = await updateItem(
        "todo",
        editedTask.toDoId,
        editedTask
      );
      setIsEditing(false);
      if (onSave) {
        onSave(updatedTask);
      }
      alert("Item edited successfully!");
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleDragStart = (e) => {
    e.dataTransfer.setData("taskData", JSON.stringify(editedTask));
  };

  const formatDate = (isoDate) => {
    if (!isoDate) return "None";
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const getImportanceClass = (taskImportance) => {
    const normalizedImportance = taskImportance?.toLowerCase().trim();
    switch (normalizedImportance) {
      case "high":
        return "high";
      case "medium":
        return "medium";
      case "low":
        return "low";
      default:
        return "none";
    }
  };

  const highlightSearchQuery = (text) => {
    if (!searchQuery) return text;
    const regex = new RegExp(`(${searchQuery})`, "gi");
    return text.split(regex).map((part, index) =>
      regex.test(part) ? (
        <span key={index} className="highlight">{part}</span>
      ) : (
        part
      )
    );
  };



  return (
    <div className="task-card" draggable onDragStart={handleDragStart}>
      <div className="task-header">
        <h3 className="task-title">
          {isEditing ? (
            <input
              type="text"
              name="title"
              value={editedTask.title}
              onChange={handleChange}
            />
          ) : (
            highlightSearchQuery(editedTask.title)
          )}
        </h3>
        <div>
          {!isEditing && (
            <img
              src={Edit}
              alt="editicon"
              width={24}
              height={24}
              style={{ cursor: "pointer" }}
              onClick={() => setIsEditing(true)}
            />
          )}

          {/* <img
            src={Trash}
            alt="trashicon"
            width={34}
            height={34}
            style={{ cursor: "pointer" }}
            onClick={handleDelete}
          /> */}
        </div>
      </div>
      <div className="task-details">
        <div className="task-row">
          <span className="task-label">Category</span>
          {isEditing ? (
            <input
              type="text"
              name="category"
              value={editedTask.category}
              onChange={handleChange}
            />
          ) : (
            <span className="task-value">{editedTask.category}</span>
          )}
        </div>
        <div className="task-row">
          <span className="task-label">Due Date</span>
          {isEditing ? (
            <input
              type="date"
              name="dueDate"
              value={editedTask.dueDate}
              onChange={handleChange}
            />
          ) : (
            <span className="task-value">{formatDate(editedTask.dueDate)}</span>
          )}
        </div>

        <div className="task-row">
          <span className="task-label">Estimate</span>
          {isEditing ? (
            <input
              type="text"
              name="estimate"
              value={editedTask.estimate}
              onChange={handleChange}
            />
          ) : (
            <span className="task-value">{editedTask.estimate || "None"}</span>
          )}
        </div>
        <div className="task-row">
          <span className="task-label">Importance</span>
          {isEditing ? (
            <select
              name="taskImportance"
              value={editedTask.taskImportance}
              onChange={handleChange}
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          ) : (
            <span
              className={`task-importance ${getImportanceClass(
                editedTask.taskImportance
              )}`}
            >
              {editedTask.taskImportance || "None"}
            </span>
          )}
        </div>
      </div>
      {isEditing && (
        <div className="task-actions">
          <button onClick={handleEdit}>Save</button>
        </div>
      )}
    </div>
  );
}

export default TaskCard;
