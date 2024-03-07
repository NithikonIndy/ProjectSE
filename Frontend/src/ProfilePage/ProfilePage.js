import Header from "../Header/Header.js";
import "./ProfilePage.css"
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, Avatar, Divider, Typography, Button, Col, Row } from 'antd';
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardTitle, MDBCardText, MDBCardBody, MDBCardImage, MDBBtn } from 'mdb-react-ui-kit';

const { Title, Text } = Typography;

const ProfilePage = () => {
  const navigate = useNavigate();
  const [usersID, setUsersID] = useState("");
  const [userRole, setUserRole] = useState("");
  const [userBlog,setUserBlog] = useState([]);
  const [userComment,setUserComment] = useState([]);
  const [userName,setUserName] = useState("");
  const [useremail,setUserEmail] = useState("");

  useEffect(() => {
    fetchSession();
  }, []);

  const fetchSession = async () => {
    try {
      const response = await axios.get("https://backend-b1ep.onrender.com/api/user/status", {
        withCredentials: true,
      });
      setUsersID(response.data._id);
      setUserBlog(response.data.blogs);
      setUserComment(response.data.comments);
      setUserName(response.data.name);
      setUserEmail(response.data.email);
      console.log("This session user:", response.data.name);
    } catch (error) {
      console.error("Error fetching user session:", error);
    }
  };

  const fetchLogOut = async () => {
    try {
      const response = await axios.get("https://backend-b1ep.onrender.com/api/user/deleteSession", {
        withCredentials: true,
      });
      console.log("log: ", response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUserRole = async () => {
    try {
      const { data: role } = await axios.get("https://backend-b1ep.onrender.com/api/user/role", { withCredentials: true });
      setUserRole(role);
    } catch (error) {
      console.error("Error fetching user role:", error);
    }
  };


  return (
    <div>
      <Header />
      <Row justify="center" style={{ marginTop: "80px" }}>
        <Col span={8} align="middle">
          <Card
            style={{
              width: "100%",
              borderRadius: "16px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)"
            }}
            cover={
              <img
                alt="example"
                src="https://wallpaperaccess.com/full/4382314.jpg"
                style={{
                  height: "200px",
                  objectFit: "cover",
                  borderRadius: "16px 16px 0 0"
                }}
              />
            }
          >
            <Avatar size={64} src="https://wallpaperaccess.com/full/4382314.jpg" style={{ position: "absolute", top: "120px", left: "50%", transform: "translate(-50%, -50%)" }} />
            <Divider />
            <Card.Meta
              title={<Title level={3}>{userName}</Title>}
              description={<Text>{useremail}</Text>}
            />
            <Divider />
            <Row justify="center">
              <Col span={12}>
                <Button className="button-css" block size="large" href="/YourBlog">Your Blog {userBlog.length}</Button>
              </Col>
              <Col span={12}>
                <Button className="button-css" block size="large" href="/YourCom">Your Comment {userComment.length}</Button>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
export default ProfilePage;
