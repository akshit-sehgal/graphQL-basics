import { GraphQLServer } from 'graphql-yoga';

// Type Definitions (Schema)
const typeDefs = `
    type Query {
        hello: String!
        name: String!
        location: String!
        bio: String!
    }
`

// Resolvers (Functions for operations)
const resolvers = {
    Query: {
        hello() {
            return "First Query";
        },
        name() {
            return "Akshit Sehgal";
        },
        location() {
            return "India";
        },
        bio() {
            return "Goooooooooooooooooooooooo!";
        }
    }
}

const server = new GraphQLServer({
    typeDefs,
    resolvers
});

server.start(() => {
    console.log("The server is running");
})