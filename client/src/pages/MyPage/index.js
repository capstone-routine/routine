import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function MyPage() {
  const [userData, setUserData] = useState({ name: "", type: "" });
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null); // 에러 상태 추가
  const navigate = useNavigate();

  // 타입별 경로 매핑
  const typePageMap = {
    "Balanced Type": "/typetest/result1",
    "Perfectionist": "/typetest/result2",
    "Spontaneous Type": "/typetest/result3",
    "Social Type": "/typetest/result4",
    "Emotional Type": "/typetest/result5",
    "Goal-Oriented Type": "/typetest/result6",
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchUserData();
      await fetchReviews();
    };

    fetchData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/userdata");
      setUserData({
        name: response.data.userName,
        type: response.data.userType,
      });
    } catch (error) {
      setError("Failed to fetch user data.");
      console.error("Error fetching user data:", error);
    }
  };

  const fetchReviews = async () => {
    try {
      const sessionResponse = await axios.get("http://localhost:3000/api/session");
      const userId = sessionResponse.data.user_id;

      if (userId) {
        const reviewResponse = await axios.get(
          `http://localhost:3000/api/myreviewfetch?user_id=${userId}`
        );

        const mappedReviews = reviewResponse.data.map((review) => ({
          id: review.id, // 각 리뷰의 고유 ID
          successRate: review.success_rate,
          strengths: review.achievement,
          improvements: review.improvement,
        }));

        setReviews(mappedReviews);
      }
    } catch (error) {
      setError("Failed to fetch reviews.");
      console.error("Error fetching reviews:", error);
    }
  };

  const handleTypeClick = () => {
    const path = typePageMap[userData.type];
    if (path) {
      navigate(path);
    } else {
      alert(userData.type ? "알 수 없는 타입입니다." : "유저 타입 정보가 없습니다.");
    }
  };

  const deleteReview = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/deletereview`, {
        data: { id }, // 요청 본문
        headers: { "Content-Type": "application/json" },
      });
      setReviews(reviews.filter((review) => review.id !== id)); // 삭제된 리뷰 제외
    } catch (error) {
      setError("Failed to delete the review.");
      console.error("Error deleting review:", error);
    }
  };

  return (
    <Container>
      <Header>My Page</Header>
      <UserInfo>
        <UserField>
          <Label>Name:</Label>
          <Value>{userData.name || "Loading..."}</Value>
        </UserField>
        <UserField>
          <Label>Type:</Label>
          <TypeLink onClick={handleTypeClick}>
            {userData.type || "No type assigned"}
          </TypeLink>
        </UserField>
      </UserInfo>

      <ReviewSection>
        <SectionHeader>Reviews</SectionHeader>
        {error && <ErrorMessage>{error}</ErrorMessage>} {/* 에러 메시지 표시 */}
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <ReviewCard key={review.id}>
              <ReviewHeader>
                <DayLabel>{`${index + 1}일차`}</DayLabel>
                <SuccessRate>{review.successRate}%</SuccessRate>
              </ReviewHeader>
              <ReviewBody>
                <Feedback>
                  <FeedbackLabel>Strengths:</FeedbackLabel>
                  <FeedbackText>{review.strengths || "No data"}</FeedbackText>
                </Feedback>
                <Feedback>
                  <FeedbackLabel>Areas for Improvement:</FeedbackLabel>
                  <FeedbackText>{review.improvements || "No data"}</FeedbackText>
                </Feedback>
              </ReviewBody>
              <DeleteButton onClick={() => deleteReview(review.id)}>
                Delete
              </DeleteButton>
            </ReviewCard>
          ))
        ) : (
          <NoReviews>No reviews available</NoReviews>
        )}
      </ReviewSection>
    </Container>
  );
}

export default MyPage;

// Styled Components
const Container = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;

const Header = styled.h1`
  text-align: center;
  color: #333;
  margin-bottom: 30px;
`;

const UserInfo = styled.div`
  margin-bottom: 30px;
`;

const UserField = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const Label = styled.span`
  font-weight: bold;
  color: #555;
`;

const Value = styled.span`
  color: #333;
`;

const TypeLink = styled(Value)`
  cursor: pointer;
  text-decoration: underline;
  color: #007bff;

  &:hover {
    color: #0056b3;
  }
`;

const ReviewSection = styled.div`
  margin-top: 20px;
`;

const SectionHeader = styled.h2`
  color: #333;
  margin-bottom: 20px;
`;

const ReviewCard = styled.div`
  margin-bottom: 20px;
  padding: 15px;
  border-radius: 10px;
  background-color: #f9f9f9;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const DayLabel = styled.span`
  font-weight: bold;
  color: #ff6f61;
`;

const SuccessRate = styled.span`
  font-size: 1.2rem;
  color: #333;
`;

const ReviewBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Feedback = styled.div``;

const FeedbackLabel = styled.span`
  font-weight: bold;
  color: #555;
`;

const FeedbackText = styled.p`
  margin: 0;
  color: #333;
`;

const DeleteButton = styled.button`
  background-color: #ff4d4f;
  color: #fff;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #d9363e;
  }
`;

const NoReviews = styled.p`
  text-align: center;
  color: #999;
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 14px;
  text-align: center;
`;
