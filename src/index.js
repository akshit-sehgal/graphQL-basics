import { GraphQLServer } from 'graphql-yoga';
import uuidv4 from 'uuid/v4';
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

const comments = [
    {
        id: '1',
        text: 'Comment no. one',
        author: '1',
        post: '1'
    },
    {
        id: '2',
        text: 'Comment no. two',
        author: '1',
        post: '1'
    },
    {
        id: '3',
        text: 'Comment no. three',
        author: '2',
        post: '2'
    },
    {
        id: '4',
        text: 'Comment no. four',
        author: '3',
        post: '2'
    }]
// Scalar Types: String, Boolean, Int, Float, ID
// Type Definitions (Schema)
const typeDefs = `
    type Query {
        users(query: String): [User!]!
        posts(query: String): [Post!]!
        comments: [Comment!]!
        me: User!
        post: Post!
    }
    type Mutation {
        createUser(data: CreateUserInput!): User!
        createPost(data: CreatePostInput!):Post!
        createComment(data: CreateCommentInput!): Comment!
    }
    input CreateUserInput{
        name: String!
        email: String!
        age: Int
    }
    input CreatePostInput{
        title: String! 
        body: String! 
        published: Boolean! 
        author: ID!
    }
    input CreateCommentInput{
        text: String!
        author: ID!
        post: ID!
    }
    type User{
        id: ID!
        name: String!
        email: String!
        age: Int
        posts:[Post!]!
        comments:[Comment!]!
    }
    type Post{
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
        comments:[Comment!]!
    }
    type Comment{
        id: ID!
        text: String!
        author: User!
        post: Post!
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
        },
        comments() {
            return comments;
        }
    },
    Mutation: {
        createUser(parent, args, context, info) {
            const emailTaken = users.some((user) => user.email === args.data.email);
            if (emailTaken) {
                throw new Error('E-Mail ID already in use.')
            }
            const user = {
                id: uuidv4(),
                ...args.data
            }
            users.push(user);
            return user;
        },
        createPost(parent, args, context, info) {
            const userExists = users.some((user) => user.id === args.data.author)
            if (!userExists) {
                throw new Error('Author does not exist');
            }
            const post = {
                id: uuidv4(),
                ...args.data
            }
            posts.push(post);
            return post;
        },
        createComment(parent, args, context, info) {
            const userExists = users.some((user) => user.id === args.data.author);
            const postExists = posts.some((post) => post.id === args.data.post && post.published)
            if (!userExists) {
                throw new Error('Author does not exist')
            }
            if (!postExists) {
                throw new Error('Post is not published')
            }
            const comment = {
                id: uuidv4(),
                ...args.data
            }
            comments.push(comment);
            return comment;
        }
    },
    Post: {
        author(parent, args, context, info) {
            return users.find((user) => user.id === parent.author);
        },
        comments(parent, args, context, info) {
            return comments.filter((comment) => comment.post === parent.id)
        }
    },
    User: {
        posts(parent, args, context, info) {
            return posts.filter((post) => parent.id === post.author);
        },
        comments(parent, args, context, info) {
            return comments.filter((comment) => parent.id === comment.author);
        }
    },
    Comment: {
        author(parent, args, context, info) {
            return users.find((user) => user.id === parent.author)
        },
        post(parent, args, context, info) {
            return posts.find((post) => post.id === parent.post)
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