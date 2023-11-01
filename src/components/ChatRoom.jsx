import React, { useState, useRef } from "react";
import { myAuth, myFireStore } from "../firebase";
import {
  collection,
  orderBy,
  limit,
  query,
  addDoc,
  serverTimestamp,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { createOrFindChannel } from "../utils/channelUtils";
import {
  useCollectionData,
  useCollection,
} from "react-firebase-hooks/firestore";
import UserList from "./UserList";
import ChatMessage from "./ChatMessage";
import styled from "styled-components";

const ChatRoomContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  max-width: 100%;
  margin: 0 auto;
`;

const UserListSidebar = styled.aside`
  flex: 1;
  max-width: 250px;
  border-right: 1px solid #e2e8f0;
  padding: 16px;
`;
const ChatArea = styled.div`
  flex: 4;
  display: flex;
  flex-direction: column;
`;
const MainConversationButton = styled.button`
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  padding: 8px;
  margin-bottom: 10px;
  border-radius: 4px;
  cursor: pointer;

  &.active-chat-button {
    background-color: #e2e8f0;
  }
`;
const ChatContainer = styled.main`
  width: 100%; // Take up full available width
  max-width: 900px; // But don't exceed 900px
  margin: 0 auto;
  background-color: white;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;

const Form = styled.form`
  max-width: 750px;
  margin: 16px auto;
  display: flex;

  input {
    flex-grow: 1;
    padding: 8px;
    border-radius: 8px 0 0 8px;
    border: 1px solid #e2e8f0;
  }

  button {
    background-color: #4299e1;
    color: white;
    padding: 8px 16px;
    border-radius: 0 8px 8px 0;
    border: none;
  }
`;
function ChatRoom() {
  const { uid } = myAuth.currentUser;
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeChat, setActiveChat] = useState("main"); // defaults to main conversation
  const dummy = useRef();
  const messagesRef =
    activeChat === "private"
      ? collection(
          myFireStore,
          "channels",
          createOrFindChannel(uid, selectedUser),
          "messages"
        )
      : collection(myFireStore, "messages");

  const myQuery = query(messagesRef, orderBy("createdAt"), limit(25));

  const usersRef = collection(myFireStore, "users");

  const [messages] = useCollectionData(myQuery, { idField: "id" });
  const [usersSnapshot] = useCollection(usersRef);

  const usersData =
    usersSnapshot?.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    })) || [];

  const [formValue, setFormValue] = useState("");

  const handleUserClick = async (user) => {
    const channelId = createOrFindChannel(myAuth.currentUser.uid, user.id);

    // Check if this channel exists.
    const channelRef = doc(myFireStore, "channels", channelId);
    const channelSnapshot = await getDoc(channelRef);

    // If it doesn't, create it.
    if (!channelSnapshot.exists()) {
      await setDoc(channelRef, {
        // any initial data you want to set for the channel, if any.
      });
    }

    setSelectedUser(user.id);
    setActiveChat("private"); // set the active chat to private when a user is clicked
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    const { uid, photoURL } = myAuth.currentUser;

    await addDoc(messagesRef, {
      text: formValue,
      createdAt: serverTimestamp(),
      uid,
      photoURL,
    });

    setFormValue("");
    dummy.current.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <ChatRoomContainer>
      <UserListSidebar>
        <MainConversationButton
          className={activeChat === "main" ? "active-chat-button" : ""}
          onClick={() => {
            setActiveChat("main");
            setSelectedUser(null); // Ensure you reset the selected user
          }}
        >
          Main Conversation
        </MainConversationButton>
        <UserList
          users={usersData || []}
          onUserClick={handleUserClick}
          currentUser={myAuth.currentUser || {}}
          activeUser={selectedUser}
        />
      </UserListSidebar>

      <ChatArea>
        <ChatContainer>
          {messages &&
            messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}
          <span ref={dummy}></span>
        </ChatContainer>

        <Form onSubmit={sendMessage}>
          <input
            value={formValue}
            onChange={(e) => setFormValue(e.target.value)}
            placeholder="Hi, how are you?"
          />
          <button type="submit" disabled={!formValue}>
            Send
          </button>
        </Form>
      </ChatArea>
    </ChatRoomContainer>
  );
}

export default ChatRoom;
