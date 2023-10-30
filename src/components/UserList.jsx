import styled from "styled-components";

// UserList container
const UserListContainer = styled.div`
  max-height: 500px; // you can adjust this
  overflow-y: auto;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 8px;

  // Custom Scrollbar styles for webkit browsers
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #4299e1;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-track {
    background: #f7fafc;
  }
`;

// UserItem styled component
const UserItemContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 6px;
  margin-bottom: 8px;
  cursor: pointer;
  background-color: ${props => props.isActive ? '#BEE3F8' : props.isCurrentUser ? '#F0FFF4' : 'transparent'}; // Blue if active, light green if current user

  &:hover {
    background-color: ${props => props.isActive ? '#B2EBF2' : '#EDF2F7'}; // Different shade of blue on hover if active, light gray otherwise
  }
`;

const UserAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 12px;
`;

const UserName = styled.span`
  font-weight: 500;
`;

// Potentially, a status icon (optional)
const UserStatus = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-left: 8px;
  background-color: ${(props) =>
    props.online ? "#34D399" : "#9CA3AF"}; // green for online, gray for offline
`;

function UserList({ users = [], onUserClick, currentUser, activeUser }) {
  // Ensure currentUser is defined before accessing its properties
  const currentUserId = currentUser ? currentUser.uid : null;

  const sortedUsers = [...users].sort((a, b) => {
    // Put the current user at the top
    if (a.id === currentUserId) return -1;
    if (b.id === currentUserId) return 1;

    // Sort online users to the top
    if (a.online && !b.online) return -1;
    if (!a.online && b.online) return 1;

    // Keep the order of users as is if none of the above conditions are met
    return 0;
  });

  return (
    <UserListContainer>
      {sortedUsers.map((user) => (
        <UserItem
          user={user}
          key={user.id}
          onUserClick={onUserClick}
          isActive={activeUser === user.id}
          isCurrentUser={currentUserId === user.id}
        />
      ))}
    </UserListContainer>
  );
}



function UserItem({ user, onUserClick, isActive, isCurrentUser }) {
  return (
    <UserItemContainer onClick={() => onUserClick(user)} isActive={isActive} isCurrentUser={isCurrentUser}>
      <UserAvatar src={user.avatar} alt={`${user.name}'s avatar`} />
      <UserName>{user.name}</UserName>
      <UserStatus online={user.online} />
    </UserItemContainer>
  );
}

export default UserList;
