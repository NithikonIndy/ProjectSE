import React from "react";
import { Button, Card, CardBody, CardFooter, CardText } from "react-bootstrap";
import "./commentInput.css";

const CommentInput = () => {
  return (
    <Card className="adjust-width">
      <CardBody>
        <CardText className="text-padding adjust-height">
          <textarea type="text" placeholder="Comment..." />
        </CardText>
        <CardFooter>
        <div className="margin-left">
          <Button>COMMENT</Button>
         </div>
        </CardFooter>
      </CardBody>
    </Card>
  );
};

export default CommentInput;
