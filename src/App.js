// Correct the imports
import './App.css';
import { useState, useRef } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, orderBy, limit, query, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCCeM3R5sL2SJm_P8C7iWji4yWh6Xb-Qgk",
  authDomain: "react-chat-app-17b4c.firebaseapp.com",
  projectId: "react-chat-app-17b4c",
  storageBucket: "react-chat-app-17b4c.appspot.com",
  messagingSenderId: "341113114816",
  appId: "1:341113114816:web:81af879e1267dedd115d25"
};

const app = initializeApp(firebaseConfig);
const myAuth = getAuth(app);
const myFireStore = getFirestore(app);


function App() {
  const [ user ] = useAuthState(myAuth);
  return (
    <div className="App">
      <header>
        <h1>Saia's React Chat App</h1>
        <SignOut />
      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}
function SignIn() {
  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(myAuth, provider);
  }

  return (
    <>
      <button className="sign-in" onClick={signInWithGoogle}>Sign in with Google</button>
      <p>Do not violate the community guidelines or you will be banned!</p>
    </>
  )

}

function SignOut() {
  return myAuth.currentUser && (
    <button className="sign-out" onClick={() => signOut(myAuth)}>Sign Out</button>
  )
}

function ChatRoom() {
  const dummy = useRef();
  const messagesRef = collection(myFireStore, 'messages');
  const myQuery = query(messagesRef, orderBy('createdAt'), limit(25));

  const [messages] = useCollectionData(myQuery, { idField: 'id' });

  const [formValue, setFormValue] = useState('');


  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = myAuth.currentUser;

    await addDoc(messagesRef, {
      text: formValue,
      createdAt: serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (<>
    <main>

      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

      <span ref={dummy}></span>

    </main>

    <form onSubmit={sendMessage}>

      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="say something nice" />

      <button type="submit" disabled={!formValue}>🕊️</button>

    </form>
  </>)
}


function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === myAuth.currentUser.uid ? 'sent' : 'received';

  return (<>
    <div className={`message ${messageClass}`}>
      <img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} />
      <p>{text}</p>
    </div>
  </>)
}
export default App;
