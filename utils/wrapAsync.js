export default (fn) => (req, res, next) => {
  return fn(req, res).catch(next);
};
