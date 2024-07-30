const { GraphQLError } = require('graphql');
const jwt = require('jsonwebtoken');

// set token secret and expiration date
const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
  // function for our unauthenticated routes
  AuthenticationError: new GraphQLError('Could not authenticate user.', {
    extensions: {
      code: 'UNAUTHENTICATED',
    },
  }),
  // Middleware function for authentication.
  authMiddleware: function ({ req }) {
    // Extract token from the request body, query, or headers.
    let token = req.body.token || req.query.token || req.headers.authorization;

    // If the token is in "Bearer <token>" format, extract the token value.
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ").pop().trim();
    }

    // If no token is found, return the request object unmodified.
    if (!token) {
      return req;
    }

    try {
      // Verify the token and attach user data to the request object.
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch (err) {
      // Log any errors for debugging purposes.
      console.error("Invalid token:", err);
    }

    return req; // Return the modified request object.
  },
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
