import React from 'react';
import { Link } from 'react-router-dom';
import Header from "./Header.js"
import { Card } from '@mantine/core';
import './Homepage.css'; // Import your CSS file for styling

const Homepage = () => {
  return (
    <div className="homepage">
      <Header />

      <section className="featured-section">
        <div className="centered-card">
          <Card className="featured-card" shadow='md' p="lg" withBorder>
            {/* เนื้อหาของ Card 1 */}
          </Card>
          <Card className="featured-card" shadow='md' p="lg" withBorder>
            {/* เนื้อหาของ Card 2 */}
          </Card>
          <Card className="featured-card" shadow='md' p="lg" withBorder>
            {/* เนื้อหาของ Card 3 */}
          </Card>
        </div>
      </section>

      <footer>
        <p>&copy; 2024 Our Website. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Homepage;
