function isOwner(userId, postedById) {
  if (userId.toString() === postedById.toString()) {
    return true;
  } else {
    return false;
  }
}

module.exports = { isOwner };