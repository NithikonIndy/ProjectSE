// Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Input, Badge, Button, Group } from '@mantine/core';
import freebird from './picture/freebird.png';
import home from './picture/home.png';
import person from './picture/person.png';
import './Header.css';

const Header = () => (
  <Container size="xl" style={{ maxWidth: 'none' }}>
    <div className="header">
      <div className="logo">
        <img src={freebird} alt="Logo" />
        <p className="logo-text">FREEBIRD</p>
      </div>
      <div className="search">
        <Input
          placeholder="Search..."
          icon={<Badge color="indigo">🔍</Badge>}
          radius="md"
        />
      </div>
      <div className="icons">
        <Button
          style={{ marginLeft: '20px' }}
          icon={<img src={home} alt="Home" />}
          variant="link"
        />
        <Button icon={<img src={person} alt="Profile" />}
         variant="link" />
        {/* Insert icons here */}
      </div>
    </div>
  </Container>
);

export default Header;
