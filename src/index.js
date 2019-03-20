import { GraphQLServer } from 'graphql-yoga';

// Scalar Types: String, Boolean, Int, Float, ID
// Type Definitions (Schema)
const typeDefs = `
    type Query {
        me: User!
        post: Post!
    }
    type User{
        id: ID!
        name: String!
        email: String!
        age: Int
    }
    type Post{
        id: ID!
        title: String!
        body: String!
        published: Boolean!
    }
`;

// Resolvers (Functions for operations)
const resolvers = {
    Query: {
        me() {
            return {
                id: '8231jd72',
                name: 'Max',
                email: 'max@example.com'
            }
        },
        post() {
            return {
                id: 'dji3844',
                title: 'GraphQL is awesome',
                body: 'Redefined Backend solution in the form of GraphQL.',
                published: true
            }
        }
    }
};

const server = new GraphQLServer({
    typeDefs,
    resolvers
});

server.start(() => {
    console.log("The server is running");
});