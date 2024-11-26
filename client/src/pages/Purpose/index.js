// index.js
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { secondaryColor } from "../../styles/colors";
import Content from "./ContentComponent";
import SideContent from "./SideContentComponent";

function Purpose() {
    const navigate = useNavigate();
    const [contentData, setContentData] = useState({ mainGoal: ["", "", ""], achievedList: ["", "", ""] });

    useEffect(() => {
        // Fetch purpose data
        axios.get("/http://localhost:3000/api/purpose")
            .then((response) => {
                if (response.data) {
                    const { mainGoal, achievedList } = response.data;
                    setPurposeData({
                        mainGoal: mainGoal.split(",").slice(0, 3).concat(Array(3).fill("")).slice(0, 3),
                        achievedList: achievedList.split(",").slice(0, 3).concat(Array(3).fill("")).slice(0, 3)
                    });
                }
            })
            .catch((error) => console.error("Error fetching purpose data:", error));

        // Fetch achieve data
        axios.get("http://localhost:3000/api/achieve")
            .then((response) => {
                if (response.data) {
                    const { mainGoal, achievedList } = response.data;
                    setAchieveData({
                        mainGoal: mainGoal.split(",").slice(0, 3).concat(Array(3).fill("")).slice(0, 3),
                        achievedList: achievedList.split(",").slice(0, 3).concat(Array(3).fill("")).slice(0, 3)
                    });
                }
            })
            .catch((error) => console.error("Error fetching achieve data:", error));
    }, []);

    const handleEdit = () => {
        navigate("/purpose/input"); // Navigate to input page
    };

    const handleDelete = (index) => {
        // Delete data at the specific index
        const updatedMainGoal = [...contentData.mainGoal];
        const updatedAchievedList = [...contentData.achievedList];

        updatedMainGoal[index] = ""; // Clear the data for the corresponding number
        updatedAchievedList[index] = ""; // Clear the data for the corresponding number

        setContentData({ mainGoal: updatedMainGoal, achievedList: updatedAchievedList });

        // Optional: You can send the updated data to the server
        axios.post("/api/purpose", {
            mainGoal: updatedMainGoal.join(","),
            achievedList: updatedAchievedList.join(",")
        });
    };

    return (
        <Intro>
            <Wrap>
                <MainContent>
                    {/* Main Goal Section */}
                    <Content
                        header="메인 목적"
                        items={[1, 2, 3]} // Fixed 1, 2, 3 icons
                        data={contentData.mainGoal} // Pass the main goals (max 3)
                        onEdit={handleEdit}
                        onDelete={handleDelete} // Pass the delete function
                    />

                    {/* Achievement List Section */}
                    <Content
                        header="달성 리스트"
                        items={[1, 2, 3]} // Fixed 1, 2, 3 icons
                        data={contentData.achievedList} // Pass the achievement list (max 3)
                        onEdit={handleEdit}
                        onDelete={handleDelete} // Pass the delete function
                    />
                </MainContent>
                <SideContent text="안녕하세요. 저는 메인 목적을 이루기 위해..." />
            </Wrap>
        </Intro>
    );
}

export default Purpose;

const Intro = styled.div`
    width: 100%;
    height: 650px;
    background-color: ${secondaryColor};
`;

const Wrap = styled.div`
    display: flex;
    width: 1280px;
    height: 100%;
    margin: 0 auto;
`;

const MainContent = styled.div`
    flex: 3;
    display: flex;
    flex-direction: column;
    gap: 20px;
`;
