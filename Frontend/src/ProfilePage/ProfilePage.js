import React from "react";
import Header from "../Header/Header.js";
import "./ProfilePage.css";
import { Card, Avatar } from 'antd';
import { Col, Row } from 'antd';
import { Link } from "react-router-dom";

const { Meta } = Card;

const gridStyle = {
  width: '25%',
  textAlign: 'center',
};

const ProfilePage = () => {
  return (
    <div>
      <Header />
      <Row justify="left" style={{marginTop:"80px"}}>
        <Col span={8} align="middle">
          <Card
            style={{
              width: 500,
            }}
            cover={
              <img
                alt="example"
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
              />
            }
            actions={[
              <Link to="/YourBlog">
                <div>YourBlog</div>
              </Link>,
              <Link to="/YourCom">
                <div>YourCom</div>
              </Link>,
            ]}
          >
            <Meta
              title="YourName" 
              description="Pongthanat_n@cmu.ac.th"
            />
          </Card>
        </Col>

        <Col span={8} align="middle">
          <Card title="Card Title" style={{ display: 'flex', flexDirection: 'column' }}>
            <Card.Grid style={{ ...gridStyle, flexDirection: 'row-reverse' }}>Content</Card.Grid>
            <Card.Grid style={{ ...gridStyle, flexDirection: 'row-reverse' }}>Content</Card.Grid>
            <Card.Grid style={{ ...gridStyle, flexDirection: 'row-reverse' }}>Content</Card.Grid>
            <Card.Grid style={{ ...gridStyle, flexDirection: 'row-reverse' }}>Content</Card.Grid>
            <Card.Grid style={{ ...gridStyle, flexDirection: 'row-reverse' }}>Content</Card.Grid>
            <Card.Grid style={{ ...gridStyle, flexDirection: 'row-reverse' }}>Content</Card.Grid>
            <Card.Grid style={{ ...gridStyle, flexDirection: 'row-reverse' }}>Content</Card.Grid>
          </Card>
        </Col>
      </Row>
      
    </div>
  );
};

export default ProfilePage;
