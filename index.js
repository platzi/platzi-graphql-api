const { ApolloServer, gql } = require("apollo-server");

const db = require("./db");

const typeDefs = gql`
  type Book {
    id: Int!
    title: String!
    rating: Float!
    year: Int!
    image: String!
    likes: Int!
    authorId: Int!
    author: Author!
  }
  type Author {
    id: Int!
    name: String!
    imageUrl: String!
    about: String!
  }

  type Query {
    books: [Book]
  }
`;

const resolvers = {
  Book: {
    author: async (book) => await db.getAuthor(book.authorId)
  },
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
