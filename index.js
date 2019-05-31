const { ApolloServer, gql } = require("apollo-server");
const DataLoader = require("dataloader");

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
    book(id: Int!): Book
    books: [Book]
    author(id: Int!): Author
    authors: [Author]
  }
  input LikeBook {
    id: Int!
  }
  type LikeBookResponse {
    success: Boolean!
  }
  type Mutation {
    likeBook(input: LikeBook!): LikeBookResponse!
  }
`;

const resolvers = {
  Book: {
    author: async (book, _, context) =>
      context.loaders.authors.load(book.authorId)
  },
  Query: {
    book: async (_, params) => await db.getBook(params.id),
    books: async () => await db.getBooks(),
    author: async (_, params) => await db.getAuthor(params.id),
    authors: async () => await db.getAuthors()
  },
  Mutation: {
    likeBook: async (_, params) => {
      const success = await db.likeBook(params.input.id);
      return { success };
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const loaders = {
      authors: new DataLoader(keys => db.getManyAuthors(keys))
    };
    return { loaders };
  }
});

server.listen().then(({ url }) => {
  console.log(`Servidor: ${url}`);
});
