const typeDefs = `
  type User {
    _id: ID
    username: String
    email: String
    savedBooks: [Book]
  }

  type Book {
    bookId: String
    authors: [String]
    title: String
    description: String
    image: String
    link: String
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    me: User
  }
 input BookData {
    authors: [String]
    description: String
    bookId: String
    image: String
    link: String
    title: String
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    saveBook(input: BookData): User
    removeBook(bookId: String!): User
  }
`;

module.exports = typeDefs;