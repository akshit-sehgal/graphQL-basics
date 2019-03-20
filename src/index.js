import { GraphQLServer } from 'graphql-yoga';

const users = [{
    id: '1',
    name: 'Aks',
    email: 'aks@example.com',
    age: 12
}, {
    id: '2',
    name: 'xyz',
    email: 'xyz@example.com'
}, {
    id: '3',
    name: 'mrq',
    email: 'mrq@example.com',
    age: 27
}]

const posts = [
    {
        id: '1',
        title: 'One',
        body: 'Something one',
        author: '1',
        published: true
    },
    {
        id: '2',
        title: 'Two',
        body: 'Something two',
        author: '1',
        published: true
    },
    {
        id: '3',
        title: 'Three',
        body: 'Something three',
        author: '2',
        published: false
    }
]

// Scalar Types: String, Boolean, Int, Float, ID
// Type Definitions (Schema)
const typeDefs = `
    type Query {
        users(query: String):[User!]!
        posts(query: String):[Post!]!
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
        author: User!
    }
`;

// Resolvers (Functions for operations)
const resolvers = {
    Query: {
        users(parent, args, context, info) {
            if (!args.query)
                return users;
            return users.filter((user) => user.name.toLowerCase().includes(args.query.toLowerCase()))
        },
        posts(parent, args, context, info) {
            if (!args.query)
                return posts;
            return posts.filter((post) => post.title.toLowerCase().includes(args.query.toLowerCase()) || post.body.toLowerCase().includes(args.query.toLowerCase()))
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
    },
    Post: {
        author(parent, args, context, info) {
            return users.find((user) => user.id === parent.author);
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