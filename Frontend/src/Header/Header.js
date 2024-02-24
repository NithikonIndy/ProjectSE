import React from "react";
import "./Header.css";
import freebird from "./picture/freebird.png";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faHome, faRightFromBracket, faUser } from "@fortawesome/free-solid-svg-icons";
import { Col, Row } from "antd";

const Header = () => (
  <div className="header">
    <Row justify="center" wrap>
      <Col span={8} align="left">
        <div className="container-logo" style={{margin:"8px"}}>
          <span className="free">Free</span>
          <span className="bird">Bird</span>
        </div>
      </Col>
      <Col span={8} align="center">
        <div className="container-search" style={{margin:"8px"}}>
          <input type="text" placeholder="Search..." />
        </div>
      </Col>
      <Col span={8} align="right">
        <div className="container-icons">
          <Link to="/home">
            <FontAwesomeIcon icon={faBell} alt="notify-icon" style={{margin:"8px"}} />
          </Link>
          <Link to="/home">
            <FontAwesomeIcon icon={faHome} alt="home-icon" style={{margin:"8px"}} />
          </Link>
          <Link to="/profile">
            <FontAwesomeIcon icon={faUser} alt="profile-icon" style={{margin:"8px"}}/>
          </Link>
          <Link to="http://localhost:3000/logout">
            <FontAwesomeIcon icon={faRightFromBracket} alt="logout-icon" style={{margin:"8px"}}/>
          </Link>
        </div>
      </Col>
    </Row>
  </div>
);

export default Header;
