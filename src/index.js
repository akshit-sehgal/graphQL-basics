import { GraphQLServer } from 'graphql-yoga';

// Scalar Types: String, Boolean, Int, Float, ID
// Type Definitions (Schema)
const typeDefs = `
    type Query {
        greeting(name: String, position: String): String!
        add(numbers: [Float!]!): Float!
        grades:[Int!]!
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
        greeting(parent, args, context, info) {
            return `Welcome to the playground ${args.name && args.position ? `${args.name} (${args.position})` : ''}!`
        },
        add(parent, args, context, info) {
            if (args.numbers.length === 0) {
                return 0;
            }
            return args.numbers.reduce((accumulator, currentValue) => {
                return accumulator += currentValue;
            });
        },
        grades(parent, args, context, info) {
            return [98, 85, 70, 90];
        },
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