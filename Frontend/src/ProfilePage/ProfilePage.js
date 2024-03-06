import React, { useState, useEffect } from "react";
import Header from "../Header/Header.js";
import "./ProfilePage.css";
import { Card, Avatar, Divider, Typography, Button, Col, Row } from 'antd';
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const { Title, Text } = Typography;



const ProfilePage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    fetchSession();
  }, []);

  const fetchSession = async () => {
    try {
      const response = await axios.get("https://backend-b1ep.onrender.com/Userid", {
        withCredentials: true,
      });
        if (!response.data.user) {
          navigate("/");
        } else {
          setUsers([response.data.user]);
          fetchUserRole();
        }
      } catch (error) {
        console.error("Error fetching user session:", error);
    }
  };  

  const fetchUserRole = async () => {
    try {
      const { data: role } = await axios.get("https://backend-b1ep.onrender.com/session",{ withCredentials: true });
        setUserRole(role);
        //console.log("This session user role:" ,role);
        //console.log(userRole);
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
      const userblog = () =>{
        // try{
        //   const response = await axios.get("")
        // }
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
              title={<Title level={3}>YourName</Title>}
              description={<Text>Pongthanat_n@cmu.ac.th</Text>}
            />
            <Divider />
            <Row justify="center">
              <Col span={12}>
                <Button className="button-css" block size="large" href="/YourBlog">Your Blog</Button>
              </Col>
              <Col span={12}>
                <Button className="button-css" block size="large" href="/YourCom">Your Comment</Button>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProfilePage;
