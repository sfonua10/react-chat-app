import "./App.css";
import { useState, useRef } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut
} from "firebase/auth";
import {
  getFirestore,
  collection,
  orderBy,
  limit,
  query,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import styled from 'styled-components';

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
  max-width: 750px;
  background-color: white;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  margin: 16px auto;
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
    gap: .25rem;
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
  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(myAuth, provider);
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
  return (
    myAuth.currentUser && (
      <SignOutButton className="sign-out" onClick={() => signOut(myAuth)}>
        Sign Out
      </SignOutButton>
    )
  );
}

function ChatRoom() {
  const dummy = useRef();
  const messagesRef = collection(myFireStore, "messages");
  const myQuery = query(messagesRef, orderBy("createdAt"), limit(25));

  const [messages] = useCollectionData(myQuery, { idField: "id" });

  const [formValue, setFormValue] = useState("");

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
    <>
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
    </>
  );
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;
  const messageClass = uid === myAuth.currentUser.uid ? "sent" : "received";

  return (
    <>
      <Message className={messageClass}>
        <img
          alt="user"
          src={
            photoURL || "https://api.adorable.io/avatars/23/abott@adorable.png"
          }
        />
        <p>{text}</p>
      </Message>
    </>
  );
}
export default App;
