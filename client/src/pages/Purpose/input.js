// input.js
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import SideContent from "./SideContentComponent";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function PurposeInput() {
    const [selectedNumber, setSelectedNumber] = useState(1); // Track the selected number
    const [formData, setFormData] = useState({ mainGoal: "", achievedList: "" });
    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get("http://localhost:3000/api/session") // 세션 확인 및 사용자 ID 가져오기
            .then((sessionResponse) => {
                const user_id = sessionResponse.data.user_id;
    
                if (user_id) {
                    // 사용자 데이터 가져오기
                    axios
                        .get(`http://localhost:3000/api/purposefetch?user_id=${user_id}`)
                        .then((response) => {
                            const fetchedData = response.data;
    
                            // 선택된 번호에 따라 데이터 매핑
                            setFormData({
                                mainGoal: fetchedData.mainGoals[selectedNumber - 1] || "", // 데이터가 없으면 빈 문자열
                                achievedList: fetchedData.achievedLists[selectedNumber - 1] || "", // 데이터가 없으면 빈 문자열
                            });
                        })
                        .catch((error) => {
                            console.error("목적 데이터 로드 실패:", error);
                        });
                } else {
                    alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
                    navigate("/SignIn");
                }
            })
            .catch((error) => {
                console.error("세션 확인 중 오류 발생:", error);
                alert("세션 확인 중 문제가 발생했습니다. 다시 시도해주세요.");
            });
    }, [selectedNumber]);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
          ...prevFormData,
          [name]: value,
        }));
      };
    
      // 제출 핸들러
      const handleSubmit = () => {
        const apiPayload = {
            selectedNumber: selectedNumber, // 번호 선택
            mainGoal: formData.mainGoal,   // 제목
            achievedList: formData.achievedList, // 내용
        };
    
        console.log("API Payload:", apiPayload);
    
        // 서버로 데이터 전송
        axios
            .post("http://localhost:3000/api/purposeupdate", apiPayload)
            .then((response) => {
                alert(response.data.message); // 서버 응답 메시지 표시
                navigate("/purpose");
            })
            .catch((error) => {
                console.error("API 요청 중 오류 발생:", error);
                alert("데이터 저장 중 문제가 발생했습니다. 다시 시도해주세요.");
            });
    };

    return (
        <Wrap>
            <RightSide>
                <Form>
                    <Label>수정 페이지</Label>
                    <SelectNumber>
                        <label>번호 선택: </label>
                        <select value={selectedNumber} onChange={(e) => setSelectedNumber(Number(e.target.value))}>
                            <option value={1}>1</option>
                            <option value={2}>2</option>
                            <option value={3}>3</option>
                        </select>
                    </SelectNumber>
                    <Input
                        type="text"
                        name="mainGoal"
                        value={formData.mainGoal}
                        onChange={handleChange}
                        placeholder="Main Goal"
                    />
                    <Textarea
                        name="achievedList"
                        value={formData.achievedList}
                        onChange={handleChange}
                        placeholder="Achieved List"
                    />
                    <SubmitButton onClick={handleSubmit}>제출</SubmitButton>
                </Form>
            </RightSide>
            <LeftSide>
                <SideContent/>
            </LeftSide>
        </Wrap>
    );
}

export default PurposeInput;

const Wrap = styled.div`
    display: flex;
    height: 100vh;
`;

const LeftSide = styled.div`
    flex: 1;
    padding: 20px;
`;

const RightSide = styled.div`
    flex: 2;
    padding: 20px;
    display: flex;
    flex-direction: column;
`;

const Form = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const Label = styled.div`
    font-size: 20px;
    margin-bottom: 10px;
`;

const SelectNumber = styled.div`
    margin-bottom: 10px;
`;

const Input = styled.input`
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
`;

const Textarea = styled.textarea`
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    height: 150px; /* 5x the height of a normal input */
`;

const SubmitButton = styled.button`
    padding: 10px 20px;
    background-color: black;
    color: white;
    border: none;
    cursor: pointer;
    border-radius: 5px;
`;
