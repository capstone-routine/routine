import React, { useState, useEffect } from "react"; // Import useEffect
import styled from "styled-components";
import axios from "axios";

function Review({ successRate }) {
  const [feedback, setFeedback] = useState({
    strengths: "",
    improvements: "",
  });

  const [localSuccessRate, setLocalSuccessRate] = useState(0);
  const [userId, setUserId] = useState(null);

  // 세션에서 user_id 가져오고 review 데이터 로드
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/session")
      .then((response) => {
        const userId = response.data.user_id;
        setUserId(userId);
  
        if (userId) {
          axios
            .get(`http://localhost:3000/api/reviewfetch?user_id=${userId}`)
            .then((res) => {
              console.log("Fetched latest review data:", res.data);
              const { success_rate, achievement, improvement } = res.data;
              setLocalSuccessRate(success_rate || 0);
              setFeedback({
                strengths: achievement || "",
                improvements: improvement || "",
              });
            })
            .catch((err) => console.error("Error fetching review data:", err));
        }
      })
      .catch((err) => console.error("Error fetching session data:", err));
  }, []);
  

  const handleSubmit = () => {
    axios
      .post("http://localhost:3000/api/reviewinput", {
        user_id: userId,
        strengths: feedback.strengths,
        improvements: feedback.improvements,
      })
      .then((res) => {
        console.log("Review updated successfully:", res.data);
        alert("Review updated successfully!");
      })
      .catch((err) => {
        console.error("Error updating review:", err);
        alert("Error updating review. Check console for details.");
      });
  };
  
  

  return (
    <Wrap>
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
    </Wrap>
  );
}

export default Review;


// Styled Components

const Wrap = styled.div`
  height: 600px;
`;

const Container = styled.div`
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: auto;
  margin-top: 50px;
`;

const Header = styled.h3`
  text-align: center;
  color: #333;
  margin-bottom: 20px;
`;

const SuccessRate = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const Label = styled.span`
  font-weight: bold;
  font-size: 1.2rem;
  color: #555;
`;

const Rate = styled.span`
  font-size: 1.5rem;
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
  font-size: 1rem;
  resize: none;
`;

const SubmitButton = styled.button`
  margin-top: 20px;
  width: 100%;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;
