import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardText,
  Button,
  CardFooter,
} from "react-bootstrap";
import "./comment.css";

const Comment = ({
  randomName,
  cmuAccount,
  description,
  likeCount,
  onClickgetblogId,
  togglePopup,
  showPopup,
}) => {
  return (
    <Card className="adjust-width margin-bottom">
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
          </div>
          <Button onClick={togglePopup}>report</Button>
          {showPopup}
        </CardFooter>
      </CardBody>
    </Card>
  );
};
export default Comment;
