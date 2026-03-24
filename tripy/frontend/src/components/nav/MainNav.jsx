import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { Pages } from "../../context/ValueContext";
// import styles from "./MainNav.module.scss";

const MainNav = () => {
  const { page, setPage } = useContext(Pages);
  return (
    <div className="MainNav">
      <ul>
        <Link to="/main">
          <li
            className={`${page === "Main" ? "check" : ""}`}
            onClick={() => setPage("Main")}
          >
            Main
          </li>
        </Link>
        <Link to="/plan">
          <li
            className={`${page === "Plan" ? "check" : ""}`}
            onClick={() => setPage("Plan")}
          >
            Plan
          </li>
        </Link>
        <Link to="/review">
          <li
            className={`${page === "Review" ? "check" : ""}`}
            onClick={() => setPage("Review")}
          >
            Review
          </li>
        </Link>
        <Link to="/recommend">
          <li
            className={`${page === "Recommend" ? "check" : ""}`}
            onClick={() => setPage("Recommend")}
          >
            Recommend
          </li>
        </Link>
        <Link to="/album">
          <li
            className={`${page === "Album" ? "check" : ""}`}
            onClick={() => setPage("Album")}
          >
            Album
          </li>
        </Link>
        <Link to="/theme">
          <li
            className={`${page === "Theme" ? "check" : ""}`}
            onClick={() => setPage("Theme")}
          >
            Theme
          </li>
        </Link>
        {/* <Link to="/ai">
          <li
            className={`${page === "AI" ? "check" : ""}`}
            onClick={() => setPage("AI")}
          >
            AI
          </li>
        </Link> */}
        <Link to="/rag">
          <li
            className={`${page === "Rag" ? "check" : ""}`}
            onClick={() => setPage("Rag")}
          >
            Setting
          </li>
        </Link>
      </ul>
    </div>
  );
};

export default MainNav;
