import React, { useState } from "react";
import styled from "styled-components";
import {
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";

const API_KEY = ""; // API 키를 여기에 입력하세요.
const systemMessage = {
  role: "system",
  content:
    "당신은 유저의 메인 목적을 이루기 위해서 필요한 수행 리스트를 6단계로 뽑아주는 AI챗봇입니다.",
};

function SideContent() {
  const [messages, setMessages] = useState([
    {
      message:
        "안녕하세요 저는 당신의 메인 목적을 이루기 위해서 필요한 수행 리스트를 6단계로 뽑아주는 AI챗봇입니다. 메인 목적을 적어주세요:)",
      sentTime: "just now",
      sender: "ChatGPT",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (message) => {
    const newMessage = {
      message,
      direction: "outgoing",
      sender: "user",
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
      model: "gpt-3.5-turbo",
      messages: [systemMessage, ...apiMessages],
      max_tokens: 100,
    };

    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiRequestBody),
    })
      .then((data) => data.json())
      .then((data) => {
        setMessages([
          ...chatMessages,
          {
            message: data.choices[0].message.content,
            sender: "ChatGPT",
          },
        ]);
        setIsTyping(false);
      });
  }

  return (
    <ChatWrapper>
      <MessageListContainer>
        <MessageList
          scrollBehavior="smooth"
          typingIndicator={isTyping ? <TypingIndicator content="ChatGPT is typing" /> : null}
        >
          {messages.map((message, i) => (
            <StyledMessage
              key={i}
              model={{
                message: message.message,
                sentTime: message.sentTime,
                sender: message.sender === "ChatGPT" ? "ChatGPT" : "You",
              }}
              className={message.sender === "ChatGPT" ? "chatgpt" : "user"}
            />
          ))}
        </MessageList>
      </MessageListContainer>
      <MessageInputContainer>
        <MessageInput
          placeholder="메시지를 입력하세요"
          onSend={handleSend}
          attachButton={false} // 첨부파일 버튼 제거
        />
      </MessageInputContainer>
    </ChatWrapper>
  );
}

export default SideContent;

// Styled components
const SideContentWrapper = styled.div`
  padding: 20px;
  background: #fff;
  border-radius: 10px;
  border: 2px solid #fbe0d1;
  margin-left: 20px;
  width: 300px;
`;

const AppContainer = styled.div`
  position: relative;
  height: 570px;
`;
const ChatWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%; /* Set to parent's height or use a specific value */
  position: relative;
  background: #fff;
  border-radius: 10px;
  border: 2px solid #fbe0d1;
`;

const MessageListContainer = styled.div`
  flex: 1; /* Allows the message list to take up all available space */
  overflow-y: auto; /* Enables scrolling */
  padding: 10px;
`;

const MessageInputContainer = styled.div`
  position: sticky; /* Keeps the input box fixed at the bottom */
  bottom: 0;
  background: white;
  padding: 10px;
  border-top: 1px solid #ddd;
  border-radius: 10px;
`;

const StyledMessage = styled(Message)`
  &.chatgpt {
    background: #f5f5f5;
    color: #333;
    border-radius: 10px 10px 10px 0;
  }

  &.user {
    background: #d1e7fd;
    color: #000;
    border-radius: 10px 10px 0 10px;
    align-self: flex-end;
  }
`;
