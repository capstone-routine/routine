import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { primaryColor } from "../../styles/colors";
import backgroundImage from "../../assets/img/testBackground.png";

function Review({ successRate }) {
  const [feedback, setFeedback] = useState({
    strengths: "",
    improvements: "",
  });

  const [localSuccessRate, setLocalSuccessRate] = useState(successRate || 0);

  useEffect(() => {
    axios
      .get("/api/successRate")
      .then((response) => setLocalSuccessRate(response.data.successRate))
      .catch((err) => console.error("Error fetching success rate:", err));
  }, []);

  const handleSubmit = () => {
    axios
      .post("/api/review", { successRate: localSuccessRate, ...feedback })
      .then(() => alert("Review has been submitted."))
      .catch((err) => console.error("Error saving review:", err));
  };

  return (
    <Page>
      <Container>
        <Header>Review Submission</Header>
        <SuccessRate>
          <Label>Success Rate:</Label>
          <Rate>{localSuccessRate}%</Rate>
        </SuccessRate>
        <FeedbackSection>
          <label>
            성취한 점:
            <TextArea
              value={feedback.strengths}
              onChange={(e) =>
                setFeedback({ ...feedback, strengths: e.target.value })
              }
            />
          </label>
          <label>
            개선할 점:
            <TextArea
              value={feedback.improvements}
              onChange={(e) =>
                setFeedback({ ...feedback, improvements: e.target.value })
              }
            />
          </label>
        </FeedbackSection>
        <SubmitButton onClick={handleSubmit}>Submit</SubmitButton>
      </Container>
    </Page>
  );
}

export default Review;

// Styled Components
const Page = styled.div`
  height: 70vh;
  background-image: url(${backgroundImage});
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Container = styled.div`
  width: 700px;
  height: 400px;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Header = styled.h3`
  text-align: center;
  font-weight: bold;
  color: ${primaryColor};
  margin-bottom: 20px;
`;

const SuccessRate = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 40px;
`;

const Label = styled.span`
  font-weight: bold;
  font-size: 1.2rem;
  color: #555;
  margin-right: 5px;
`;

const Rate = styled.span`
  font-size: 1.2rem;
  color: #333;
`;

const FeedbackSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 14px;
  resize: none;
`;

const SubmitButton = styled.button`
  margin-top: 20px;
  width: 150px;
  padding: 10px 20px;
  border: 1.5px solid ${primaryColor};
  border-radius: 5px;
  background-color: ${primaryColor};
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  align-self: center;

  &:hover {
    background-color: white;
    color: ${primaryColor};
  }
`;