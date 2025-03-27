module.exports = (fn) => {
  return async (socket, next) => {
    await fn(socket, next).catch(next);
  };
};
