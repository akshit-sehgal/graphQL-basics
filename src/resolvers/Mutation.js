import uuidv4 from 'uuid/v4';

const Mutation = {
    createUser(parent, args, { db: { users } }, info) {
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
    deleteUser(parent, args, { db: { users, posts, comments } }, info) {
        const userIndex = users.findIndex((user) => user.id === args.id)
        if (userIndex === -1) {
            throw new Error('User not found');
        }
        const deletedUser = users.splice(userIndex, 1)[0];
        posts = posts.filter((post) => {
            const match = post.author === args.id;
            if (match) {
                comments = comments.filter((comment) => comment.post !== post.id)
            }
            return !match;
        });
        comments = comments.filter((comment) => comment.author !== args.id);
        return deletedUser;

    },
    createPost(parent, args, { db: { users, posts } }, info) {
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
    deletePost(parent, args, { db: { posts, comments } }, info) {
        const deletedPostIndex = posts.findIndex((post) => post.id === args.id)
        if (deletedPostIndex === -1) {
            throw new Error('Post not found');
        }
        const deletedPost = posts.splice(deletedPostIndex, 1)[0];
        comments = comments.filter((comment) => comment.post !== args.id);
        return deletedPost;
    },
    createComment(parent, args, { db: { users, posts, comments } }, info) {
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
    },
    deleteComment(parent, args, { db: { comments } }, info) {
        const deletedCommentIndex = comments.findIndex((comment) => comment.id === args.id);
        if (deletedCommentIndex === -1) {
            throw new Error('Comment not found');
        }
        const deletedComment = comments.splice(deletedCommentIndex, 1)[0];
        return deletedComment;
    }
};
export default Mutation;