import React from "react";
import Header from "../Header/Header.js";
import "./ProfilePage.css";
import { Card, Avatar, Divider, Typography, Button } from 'antd';
import { Col, Row } from 'antd';
import { Link } from "react-router-dom";

const { Title, Text } = Typography;

const ProfilePage = () => {
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
