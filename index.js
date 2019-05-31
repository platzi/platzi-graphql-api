const { ApolloServer, gql, PubSub } = require("apollo-server");
const DataLoader = require("dataloader");

const pubsub = new PubSub();
const BOOK_CHANGED_TOPIC = "BOOK_CHANGED_TOPIC";

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
  type Subscription {
    bookChanged: Book!
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
      if (success) {
        const book = await db.getBook(params.input.id);
        pubsub.publish(BOOK_CHANGED_TOPIC, { bookChanged: book });
      }
      return { success };
    }
  },
  Subscription: {
    bookChanged: {
      subscribe: () => pubsub.asyncIterator(BOOK_CHANGED_TOPIC)
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  subscriptions: {
    onConnect: async connectionParams => {
      const user = await db.getUserByToken(connectionParams.authToken);
      return { user };
    }
  },
  context: async ({ req, connection }) => {
    const loaders = {
      authors: new DataLoader(keys => db.getManyAuthors(keys))
    };
    if (connection) {
      return { ...connection.context, loaders };
    }
    const user = await db.getUserByToken(req.headers.authorization);
    console.log(user);
    return { loaders, user };
  }
});

server.listen().then(({ url }) => {
  console.log(`Servidor: ${url}`);
});
