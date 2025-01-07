import React, { useState, useEffect } from "react";
import "./Header.css";
import logo from "../../assets/images/Logo.png";
import add from "../../assets/svg/Add.svg";
import removeQuoteIcon from "../../assets/svg/RemoveQuote.svg";
import showQuoteIcon from "../../assets/images/ShowQuoteIcon.png";
import userAvatar from "../../assets/images/avatar.png";
import {
  saveItem,
  getUserIdFromToken,
  getUserEmailFromToken,
} from "../../core/RequestEngine";
import SearchBar from "../SearchBar/SearchBar";
import logout from "../../assets/svg/logout.svg";

const Header = ({ addNewTask, setSearchQuery }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showQuote, setShowQuote] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    dueDate: "",
    estimate: "",
    taskImportance: "",
    userId: "",
  });

  const [userInfo, setUserInfo] = useState({
    avatar: userAvatar,
  });

  const [userIdState, setUserIdState] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      const userId = getUserIdFromToken(token);
      const userEmail = getUserEmailFromToken(token);
      if (userId) {
        setUserIdState(userId);
        setFormData((prevFormData) => ({
          ...prevFormData,
          userId,
        }));
        setUserInfo((prev) => ({ ...prev, email: userEmail || prev.email }));
      }
    }
  }, []);

  const handleMouseEnter = () => setShowTooltip(true);
  const handleMouseLeave = () => setShowTooltip(false);
  const handleAddClick = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleProfileMenuToggle = () => setShowProfileMenu((prev) => !prev);

  const handleLogout = () => {
    sessionStorage.clear();
    alert("Logged out successfully!");
    window.location.href = "/";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!userIdState) {
      alert("User ID is missing. Please log in.");
      return;
    }

    try {
      const formattedData = {
        ...formData,
        userId: userIdState,
        dueDate: formData.dueDate
          ? new Date(formData.dueDate).toISOString()
          : null,
      };

      const response = await saveItem("todo", formattedData);

      const newTask = {
        ...formData,
        toDoId: response.data.toDoId,
        status: "ToDo",
        dueDate: formattedData.dueDate,
      };

      addNewTask(newTask);

      alert("Item added successfully!");
      setShowModal(false);
      setFormData({
        title: "",
        category: "",
        dueDate: "",
        estimate: "",
        taskImportance: "",
        userId: userIdState,
      });
    } catch (error) {
      console.error("Error adding item:", error);
      alert("Failed to add item. Please try again.");
    }
  };

  return (
    <div className="header-wrapper">
      <div className="top-header">
        <img src={logo} width={100} height={60} alt="Logo" />
        <div className="icon-container">
          <SearchBar setSearchQuery={setSearchQuery} />
          <div
            className="add-icon-wrapper"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleAddClick}
          >
            <img src={add} alt="Add" />
            {showTooltip && <div className="tooltip">Add Item</div>}
          </div>

          <div
            className="profile-icon-wrapper"
            onClick={handleProfileMenuToggle}
          >
            <img src={userInfo.avatar} alt="Avatar" className="avatar" />
            {showProfileMenu && (
              <div className="profile-menu">
                <div className="profile-details">
                  <img
                    src={userInfo.avatar}
                    alt="User Avatar"
                    width={69}
                    height={69}
                    style={{ borderRadius: "50%" }}
                  />
                  <div>
                    <p>{userInfo.email}</p>
                    <div onClick={handleLogout} className="logout-btn">
                      Log Out
                      <img
                        src={logout}
                        alt="User Avatar"
                        width={20}
                        height={20}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showQuote ? (
        <div
          className="bottom-header"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <p className="quote">"Anything that can go wrong, will go wrong!"</p>
          {isHovered && (
            <div className="remove-quote" onClick={() => setShowQuote(false)}>
              <img
                src={removeQuoteIcon}
                alt="Remove Quote"
                width={14}
                height={14}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="show-quote-icon" onClick={() => setShowQuote(true)}>
          <img src={showQuoteIcon} alt="Show Quote" width={24} height={24} />
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Add New Item</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label>Title:</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter title"
                  required
                />
              </div>
              <div className="form-group">
                <label>Category:</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  placeholder="Enter category"
                  required
                />
              </div>
              <div className="form-group">
                <label>Due Date:</label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Estimate:</label>
                <input
                  type="text"
                  name="estimate"
                  value={formData.estimate}
                  onChange={handleInputChange}
                  placeholder="Enter estimate (hours)"
                  required
                />
              </div>
              <div className="form-group">
                <label>Important:</label>
                <select
                  name="taskImportance"
                  value={formData.taskImportance}
                  onChange={handleInputChange}
                  required
                >
                  <option value="" disabled>
                    Select Importance
                  </option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <button type="submit" className="submit-btn">
                Add Item
              </button>
              <button
                type="button"
                className="close-btn"
                onClick={handleCloseModal}
              >
                Close
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
