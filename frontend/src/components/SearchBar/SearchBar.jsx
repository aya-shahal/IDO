import React from "react";
import searchIcon from "../../assets/svg/Search.svg";
import "./SearchBar.css";

const SearchBar = ({ setSearchQuery }) => {
  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="search-wrapper">
      <input
        type="text"
        placeholder="What are you looking for?"
        className="search-input"
        onChange={handleInputChange}
      />
      <img src={searchIcon} alt="Search Icon" />
    </div>
  );
};

export default SearchBar;
