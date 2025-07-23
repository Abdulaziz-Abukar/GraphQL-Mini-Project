const mongoose = require("mongoose");
const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { typeDefs, resolvers } = require("./schema");
require("dotenv").config();

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI;

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log(`Connected to MongoDB`);

    // Create server
    const server = new ApolloServer({
      typeDefs,
      resolvers,
    });

    // Start Apollo standalone server
    startStandaloneServer(server, {
      listen: { port: Number(PORT) },
    }).then(({ url }) => {
      console.log(`Server ready at ${url}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection error: ", err);
  });
