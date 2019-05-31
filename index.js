const { ApolloServer, gql } = require("apollo-server");

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
    books: () => [{ id: 1, title: "meu livro" }]
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers
});

server.listen().then(({ url }) => {
  console.log(`Servidor: ${url}`);
});
