// SideContent.js
import React, { useState } from "react";
import styled from "styled-components";
import { textColor, primaryColor, secondaryColor, tertiaryColor } from '../../styles/colors';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';

const systemMessage = { 
    "role": "system", 
    "content": "당신은 유저의 메인 목적을 이루기 위해서 필요한 수행 리스트를 6단계로 뽑아주는 AI챗봇입니다."
  };

function SideContent () {

    const [messages, setMessages] = useState([
        {
          message: "안녕하세요 저는 당신의 메인 목적을 이루기 위해서 필요한 수행 리스트를 6단계로 뽑아주는 AI챗봇입니다. 메인 목적을 적어주세요:)",
          sentTime: "just now",
          sender: "ChatGPT"
        }
      ]);
      const [isTyping, setIsTyping] = useState(false);
    
      const handleSend = async (message) => {
        const newMessage = {
          message,
          direction: 'outgoing',
          sender: "user"
        };
    
        const newMessages = [...messages, newMessage];
    
        setMessages(newMessages);
    
        setIsTyping(true);
        await processMessageToChatGPT(newMessages);
      };
    
      async function processMessageToChatGPT(chatMessages) {
        let apiMessages = chatMessages.map((messageObject) => {
          let role = "";
          if (messageObject.sender === "ChatGPT") {
            role = "assistant";
          } else {
            role = "user";
          }
          return { role: role, content: messageObject.message };
        });
    
        const apiRequestBody = {
          "model": "gpt-3.5-turbo",
          "messages": [systemMessage, ...apiMessages],
          "max_tokens": 100
        };
    
        await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": "Bearer " + API_KEY,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(apiRequestBody)
        }).then((data) => {
          return data.json();
        }).then((data) => {
          setMessages([...chatMessages, {
            message: data.choices[0].message.content,
            sender: "ChatGPT"
          }]);
          setIsTyping(false);
        });
      }

    return (
        <SideContentWrapper>
            <AppContainer>
            <ChatWrapper>
                <ChatBox>
                <CustomMessageList
                    scrollBehavior="smooth"
                    typingIndicator={isTyping ? <TypingIndicator content="ChatGPT is typing" /> : null}
                >
                    {messages.map((message, i) => (
                    <Message key={i} model={message} />
                    ))}
                </CustomMessageList>
                <CustomMessageInput placeholder="Type message here" onSend={handleSend} />
                </ChatBox>
            </ChatWrapper>
            </AppContainer>
        </SideContentWrapper>
    );
};

export default SideContent;

const SideContentWrapper = styled.div`
    flex: 1;
    padding: 20px;
    background: #fff;
    border-radius: 10px;
    border: 2px solid #FBE0D1;
    margin-left: 20px;
`;

// Styled Components for layout
const AppContainer = styled.div`
  position: relative;
  height: 800px;
  width: 700px;
`;

const ChatWrapper = styled(MainContainer)`
  height: 100%;
  width: 100%;
`;

const ChatBox = styled(ChatContainer)`
  height: 100%;
  width: 100%;
`;

const CustomMessageList = styled(MessageList)`
  scroll-behavior: smooth;
`;

const CustomMessageInput = styled(MessageInput)`
  width: 100%;
`;