import "./App.css";
import { myAuth } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import SignIn from "./components/SignIn";
import SignOut from "./components/SignOut";
import ChatRoom from "./components/ChatRoom";

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

export default App;
