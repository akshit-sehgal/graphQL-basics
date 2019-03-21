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
    updateUser(parent, args, { db: { users } }, info) {
        const { id, data: { email, name, age } } = args;
        const user = users.find((user) => user.id === id);
        if (!user) {
            throw new Error('User not found')
        }
        if (typeof email === 'string') {
            const emailTaken = users.some((user) => user.email === email && user.id !== id);
            if (emailTaken) {
                throw new Error('Email is already taken')
            }
            user.email = email;
        }
        if (typeof name === 'string') {
            user.name = name;
        }
        if (typeof age !== 'undefined') {
            user.age = age;
        }
        return user;
    },
    createPost(parent, args, { db: { users, posts }, pubsub }, info) {
        const userExists = users.some((user) => user.id === args.data.author)
        if (!userExists) {
            throw new Error('Author does not exist');
        }
        const post = {
            id: uuidv4(),
            ...args.data
        }
        posts.push(post);
        if (post.published)
            pubsub.publish('post', {
                post: {
                    mutation: 'CREATED',
                    data: post
                }
            });
        return post;
    },
    deletePost(parent, args, { db: { posts, comments }, pubsub }, info) {
        const deletedPostIndex = posts.findIndex((post) => post.id === args.id)
        if (deletedPostIndex === -1) {
            throw new Error('Post not found');
        }
        const deletedPost = posts.splice(deletedPostIndex, 1)[0];
        comments = comments.filter((comment) => comment.post !== args.id);
        if (deletedPost.published) {
            pubsub.publish('post', {
                post: {
                    mutation: 'DELETED',
                    data: deletedPost
                }
            });
        }
        return deletedPost;
    },
    updatePost(parent, args, { db: { posts }, pubsub }, info) {
        const { id, data: { title, body, published } } = args;
        const post = posts.find((post) => post.id === id);
        const originalPost = { ...post };
        if (!post)
            throw new Error("No Post found");
        if (typeof title === 'string')
            post.title = title;
        if (typeof body === 'string')
            post.body = body;
        if (typeof published === 'boolean') {
            post.published = published;
            if (originalPost.published && !published) {
                pubsub.publish('post', {
                    post: {
                        mutation: 'DELETED',
                        data: originalPost
                    }
                });
            } else if (!originalPost.published && published) {
                pubsub.publish('post', {
                    post: {
                        mutation: 'CREATED',
                        data: post
                    }
                });
            } else if (published) {
                pubsub.publish('post', {
                    post: {
                        mutation: 'UPDATED',
                        data: post
                    }
                });
            }
        }
        return post;
    },
    createComment(parent, args, { db: { users, posts, comments }, pubsub }, info) {
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
        pubsub.publish(`comment ${comment.post}`, {
            comment: {
                mutation: 'CREATED',
                data: comment
            }
        });
        return comment;
    },
    deleteComment(parent, args, { db: { comments },pubsub }, info) {
        const deletedCommentIndex = comments.findIndex((comment) => comment.id === args.id);
        if (deletedCommentIndex === -1) {
            throw new Error('Comment not found');
        }
        const deletedComment = comments.splice(deletedCommentIndex, 1)[0];
        pubsub.publish(`comment ${deletedComment.post}`, {
            comment: {
                mutation: 'DELETED',
                data: deletedComment
            }
        });
        return deletedComment;
    },
    updateComment(parent, args, { db: { comments },pubsub }, info) {
        const { id, data: { text } } = args;
        const comment = comments.find((comment) => comment.id === id);
        if (!comment) {
            throw new Error('No comment found')
        }
        if (typeof text === 'string')
            comment.text = text;
        pubsub.publish(`comment ${comment.post}`, {
            comment: {
                mutation: 'UPDATED',
                data: comment
            }
        });
        return comment;
    }
};
export default Mutation;