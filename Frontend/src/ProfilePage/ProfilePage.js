import Header from "../Header/Header.js";
import "./ProfilePage.css"
import React, { useState, useEffect }  from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardTitle, MDBCardText, MDBCardBody, MDBCardImage, MDBBtn } from 'mdb-react-ui-kit';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    fetchSession();
  }, []);

  const fetchSession = async () => {
    try {
      const response = await axios.get("http://localhost:3000/Userid", {
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
      const { data: role } = await axios.get("http://localhost:3000/session",{ withCredentials: true });
        setUserRole(role);
        //console.log("This session user role:" ,role);
        //console.log(userRole);
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
  };

  return (
    <div className="profile-page">
      <Header />
      <div className="vh-100" style={{ backgroundColor: '#9de2ff' }}>
      <MDBContainer>
        <MDBRow className="justify-content-center">
          <MDBCol md="9" lg="7" xl="5" className="mt-5">
            <MDBCard style={{ borderRadius: '15px' }}>
              <MDBCardBody className="p-4">
                <div className="d-flex text-black">
                  <div className="flex-shrink-0">
                    <MDBCardImage
                      style={{ width: '180px', borderRadius: '10px' }}
                      src='https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-profiles/avatar-1.webp'
                      alt='Generic placeholder image'
                      fluid />
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <MDBCardTitle>Danny McLoan</MDBCardTitle>
                    <MDBCardText>Senior Journalist</MDBCardText>

                    <div className="d-flex justify-content-start rounded-3 p-2 mb-2"
                      style={{ backgroundColor: '#efefef' }}>
                      <div>
                        <p className="small text-muted mb-1">Articles</p>
                        <p className="mb-0">41</p>
                      </div>
                      <div className="px-3">
                        <p className="small text-muted mb-1">Followers</p>
                        <p className="mb-0">976</p>
                      </div>
                      <div>
                        <p className="small text-muted mb-1">Rating</p>
                        <p className="mb-0">8.5</p>
                      </div>
                    </div>
                    <div className="d-flex pt-1">
                      <MDBBtn outline className="me-1 flex-grow-1">Chat</MDBBtn>
                      <MDBBtn className="flex-grow-1">Follow</MDBBtn>
                    </div>
                  </div>
                </div>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
    </div>
  );
};
export default ProfilePage;
