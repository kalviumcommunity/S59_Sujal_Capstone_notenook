function isOwner(userId, postedById) {
  const userIdString = String(userId);
  const postedByIdString = String(postedById);

  return userIdString === postedByIdString;
}