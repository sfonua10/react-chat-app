import React from 'react'
import { myAuth } from '../firebase';
import styled from 'styled-components';

const Message = styled.div`
  display: flex;
  margin-top: 16px;
  justify-content: space-between;

  &.sent {
    justify-content: flex-end;
    align-items: center;

    img {
      order: 2;
      margin-left: 12px;
      margin-right: 0;
    }

    p {
      background-color: #bee3f8;
    }
  }

  &.received {
    justify-content: flex-start;
    align-items: center;
    gap: 0.25rem;
    p {
      background-color: #edf2f7;
    }
  }

  img {
    width: 48px;
    height: 48px;
    border-radius: 50%;
  }

  p {
    padding: 8px;
    border-radius: 12px;

    max-width: 90%; // or whatever width you want to limit it to
  }
`;
const MessageTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  &.sent {
    align-items: flex-end;
  }

  &.received {
    align-items: flex-start;
  }
`;

const Timestamp = styled.span`
  font-size: 0.75rem;
  color: gray;
  margin-top: 4px;
  text-align: right;
  align-self: flex-end; // Add this
  white-space: nowrap; // This ensures timestamp doesn't break into multiple lines
`;

const ChatMessage = ({ message }) => {
    const { text, uid, photoURL, createdAt } = message;
    const messageClass = uid === myAuth.currentUser.uid ? "sent" : "received";
  
    const formattedDate = createdAt?.toDate().toLocaleString();
  
    return (
      <>
        <Message className={messageClass}>
          <img
            alt="user"
            src={
              photoURL || "https://api.adorable.io/avatars/23/abott@adorable.png"
            }
          />
          <MessageTextContainer className={messageClass}>
            <p>{text}</p>
            <Timestamp>{formattedDate}</Timestamp>
          </MessageTextContainer>
        </Message>
      </>
    );
}

export default ChatMessage