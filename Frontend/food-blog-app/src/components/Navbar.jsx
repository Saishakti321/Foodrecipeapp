


import React, { useState } from "react";
import Modal from "./Modal";
import InputForm from "./inputForm";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // true = logged in
  const [isLogin, setIsLogin] = useState(
    !!localStorage.getItem("token")
  );
  let user = JSON.parse(localStorage.getItem("user"))


  const handleAuthClick = () => {
    if (isLogin) {
      // LOGOUT
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setIsLogin(false);
    } else {
      setIsOpen(true);
    }
  };

  return (
    <div>
      <header>
        <h2>Chilli Flame</h2>
        <ul>
          <li>
            <NavLink to="/">Home</NavLink>
          </li>

         
          <li>
            <NavLink
              to={isLogin ? "/myRecipe" : "#"}
              onClick={(e) => {
                if (!isLogin) {
                  e.preventDefault();
                  setIsOpen(true);
                }
              }}
            >
              My Recipe
            </NavLink>
          </li>

         
          <li>
            <NavLink
              to={isLogin ? "/favRecipe" : "#"}
              onClick={(e) => {
                if (!isLogin) {
                  e.preventDefault();
                  setIsOpen(true);
                }
              }}
            >
              Favourites
            </NavLink>
          </li>

          {/* Login / Logout */}
          <li onClick={handleAuthClick}>
            <p className="login">
              {isLogin ? "Logout" : "Login"}{user?.email ? `(${user?.email})` : ""}
            </p>
          </li>
        </ul>
      </header>

      {isOpen && (
        <Modal onClose={() => setIsOpen(false)}>
          <InputForm
            setIsLogin={setIsLogin}
            setIsOpen={setIsOpen}
          />
        </Modal>
      )}
    </div>
  );
};

export default Navbar;
