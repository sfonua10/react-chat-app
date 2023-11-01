export const createOrFindChannel = (currentUserId, targetUserId) => {
  if (!currentUserId || !targetUserId) return;

  if (currentUserId < targetUserId) {
    return `${currentUserId}_${targetUserId}`;
  } else {
    return `${targetUserId}_${currentUserId}`;
  }
};
