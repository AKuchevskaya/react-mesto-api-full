import React from "react";
import { Link, Route } from "react-router-dom";
import logo from "../../src/images/logo.svg";

function Header(props) {
  let { email } = props.userData || {};
  return (
    <header className="header">
      <Route>
        <Link to="/">
          <img src={logo} alt="Логотип сайта" className="header__logo" />
        </Link>
      </Route>

      <Route path="/signup">
        <Link className="header__link" to="/signin">
          <p className="header__autorization">Войти</p>
        </Link>
      </Route>

      <Route path="/signin">
        <Link className="header__link" to="/signup">
          <p className="header__registration">Регистрация</p>
        </Link>
      </Route>

      <Route exact path="/">
        <div className="header__box">
          <p className="header__email">{email}</p>
          <Link className="header__link" to="/signin" onClick={props.signOut}>
            Выйти
          </Link>
        </div>
      </Route>
    </header>
  );
}

export default Header;
