import "./App.css";
import { useState, useRef } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
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
import { useAuthState } from "react-firebase-hooks/auth";
import {
  useCollectionData,
  useCollection,
} from "react-firebase-hooks/firestore";
import styled from "styled-components";
import UserList from "./components/UserList";
// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCCeM3R5sL2SJm_P8C7iWji4yWh6Xb-Qgk",
  authDomain: "react-chat-app-17b4c.firebaseapp.com",
  projectId: "react-chat-app-17b4c",
  storageBucket: "react-chat-app-17b4c.appspot.com",
  messagingSenderId: "341113114816",
  appId: "1:341113114816:web:81af879e1267dedd115d25",
};

const app = initializeApp(firebaseConfig);
const myAuth = getAuth(app);
const myFireStore = getFirestore(app);

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: #f7fafc;
`;

const Header = styled.header`
  background-color: #4299e1;
  color: white;
  padding: 16px;
  text-align: center;

  h1 {
    font-size: 1.5rem;
    font-weight: 600;
  }
`;

const SignInButton = styled.button`
  background: linear-gradient(90deg, #63b3ed, #3182ce);
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  margin-top: 16px;
`;

const SignOutButton = styled.button`
  background-color: #e53e3e;
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  margin-top: 16px;
`;

const ChatContainer = styled.main`
  width: 100%; // Take up full available width
  max-width: 900px; // But don't exceed 900px
  margin: 0 auto; // Center it
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
const ChatRoomContainer = styled.div`
  display: flex;
  justify-content: center; // Add this
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

function App() {
  const [user] = useAuthState(myAuth);
  return (
    <AppContainer>
      <Header>
        <h1>Saia's React Chat App</h1>
        <SignOut />
      </Header>

      <section>{user ? <ChatRoom /> : <SignIn />}</section>
    </AppContainer>
  );
}
function SignIn() {

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(myAuth, provider);

    // After successful sign-in, check if user exists in Firestore.
    if (result) {
      const user = result.user;
      const userRef = doc(myFireStore, "users", user.uid);
      const docSnapshot = await getDoc(userRef);

      // If user does not exist in Firestore, add them.
      if (!docSnapshot.exists()) {
        await setDoc(userRef, {
          name: user.displayName,
          avatar: user.photoURL,
          email: user.email,
          // ... any other fields you want to save for the user.
        });
      } else {
               // If user exists, just update their online status
               await setDoc(userRef, { online: true }, { merge: true });
      }
    }
  };

  return (
    <>
      <SignInButton className="sign-in" onClick={signInWithGoogle}>
        Sign in with Google
      </SignInButton>
      <p>Do not violate the community guidelines or you will be banned!</p>
    </>
  );
}

function SignOut() {
  const signOutUser = async () => {
    if (myAuth.currentUser) {
      const userRef = doc(myFireStore, "users", myAuth.currentUser.uid);
      await setDoc(userRef, { online: false }, { merge: true });
      await signOut(myAuth);
    }
  };

  return (
    myAuth.currentUser && (
      <SignOutButton className="sign-out" onClick={signOutUser}>
        Sign Out
      </SignOutButton>
    )
  );
}

function generateChannelId(uid1, uid2) {
  return [uid1, uid2].sort().join("_");
}

const createOrFindChannel = (currentUserId, targetUserId) => {
  if (!currentUserId || !targetUserId) return;

  if (currentUserId < targetUserId) {
    return `${currentUserId}_${targetUserId}`;
  } else {
    return `${targetUserId}_${currentUserId}`;
  }
};

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
  // const myQuery = query(messagesRef, orderBy("createdAt"), limit(25));

  const [messages] = useCollectionData(myQuery, { idField: "id" });
  // const [usersData] = useCollectionData(usersRef, { idField: "id" });
  const [usersSnapshot] = useCollection(usersRef);

  const usersData =
    usersSnapshot?.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    })) || [];

  const [formValue, setFormValue] = useState("");

  const handleUserClick = async (user) => {
    console.log("user =======>", user);
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

function ChatMessage(props) {
  const { text, uid, photoURL, createdAt } = props.message;
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
export default App;
