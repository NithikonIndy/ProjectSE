import React from "react";
import "./blog.css";
import {
  Card,
  CardText,
  CardBody,
  CardFooter,
  CardHeader,
  Button,
} from "react-bootstrap";

const Blog = ({
  randomName,
  cmuAccount,
  description,
  likeCount,
  commentCount,
  onClickgetblogId,
  togglePopup,
  showPopup,
}) => {
  return (
    <Card>
      <CardBody>
        <CardHeader>
          <div className="flex-div">
            <p>{randomName}</p>
            <p>{cmuAccount}</p>
          </div>
          <Button>DELETE</Button>
        </CardHeader>

        <CardText>{description}</CardText>

        <CardFooter>
          <div className="flex-div">
            <p>❤️ {likeCount} </p>
            <p>💬 {commentCount}</p>
          </div>
          <Button onClick={togglePopup}>report</Button>
          {showPopup}
        </CardFooter>
      </CardBody>
    </Card>
  );
};
export default Blog;
