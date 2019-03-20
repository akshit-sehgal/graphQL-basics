import { GraphQLServer } from 'graphql-yoga';

// Scalar Types: String, Boolean, Int, Float, ID
// Type Definitions (Schema)
const typeDefs = `
    type Query {
        id: ID!
        name: String!
        age: Int!
        employed: Boolean!
        gpa: Float
    }
`

// Resolvers (Functions for operations)
const resolvers = {
    Query: {
        id() {
            return 'ABCD2';
        },
        name() {
            return 'Akshit Sehgal';
        },
        age() {
            return 23;
        },
        employed() {
            return true;
        },
        gpa() {
            return null;
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