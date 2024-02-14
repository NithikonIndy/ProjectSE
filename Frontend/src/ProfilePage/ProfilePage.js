import React, { useState } from "react";
import Header from "../Header/Header.js";
import "./ProfilePage.css";
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardImage, MDBCardBody, MDBCardTitle, MDBCardText } from "mdb-react-ui-kit";
import { Link } from 'react-router-dom';
import { MDBBtn } from 'mdb-react-ui-kit';


const ProfilePage = () => {
  const [user, setUser] = useState({
    name: "John Doe",
    cmuAccount: "123456789",
    faculty: "Engineering",
    major: "Computer Science",
    year: "2024",
  });

  const handleCommentClick = () => {
    // navigate to comment page
  };

  return (
    <div>
      <Header />
      <MDBContainer>
        <MDBRow>
          <MDBCol md="4">
            <MDBCard>
              <MDBCardImage
                src="https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200"
                alt="Profile"
              />
            </MDBCard>
          </MDBCol>
          <MDBCol md="8">
            <MDBCard>
              <MDBCardBody>
                <MDBCardTitle>{user.name}</MDBCardTitle>
                <MDBCardText>
                  CMU Account: {user.cmuAccount}
                  <br />
                  Faculty: {user.faculty}
                  <br />
                  Major: {user.major}
                  <br />
                  Year: {user.year}
                </MDBCardText>
                <Link to="/YourBlog">Your Blog</Link>
                <MDBBtn onClick={handleCommentClick}>Your Comment</MDBBtn>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
};

export default ProfilePage;
