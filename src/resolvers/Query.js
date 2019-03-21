const Query = {
    users(parent, args, { db: { users } }, info) {
        if (!args.query)
            return users;
        return users.filter((user) => user.name.toLowerCase().includes(args.query.toLowerCase()))
    },
    posts(parent, args, { db: { posts } }, info) {
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
    comments(parent, args, { db: { comments } }, info) {
        return comments;
    }
};
export default Query;