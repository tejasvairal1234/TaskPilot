import mongoSanitize from "express-mongo-sanitize";

/**
 * Express 5 compatible NoSQL injection sanitizer.
 * In Express 5, req.query is a getter-only property on IncomingMessage.
 * Default express-mongo-sanitize middleware attempts `req.query = target`,
 * which throws: "TypeError: Cannot set property query of #<IncomingMessage> which has only a getter".
 * 
 * mongoSanitize.sanitize() modifies the target object in-place without reassigning the property.
 */
const sanitizeData = (req, _res, next) => {
  if (req.body) {
    mongoSanitize.sanitize(req.body);
  }
  if (req.params) {
    mongoSanitize.sanitize(req.params);
  }
  if (req.query) {
    mongoSanitize.sanitize(req.query);
  }
  next();
};

export default sanitizeData;
