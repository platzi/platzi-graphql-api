const { ApolloServer, gql } = require("apollo-server");

const db = require("./db");

const typeDefs = gql`
  type Book {
    id: Int!
    title: String!
  }
  type Query {
    books: [Book]
  }
`;

const resolvers = {
  Query: {
    books: async () => await db.getBooks()
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers
});

server.listen().then(({ url }) => {
  console.log(`Servidor: ${url}`);
});
