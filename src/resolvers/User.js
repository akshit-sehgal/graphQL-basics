const User = {
    posts(parent, args, { db: { posts } }, info) {
        return posts.filter((post) => parent.id === post.author);
    },
    comments(parent, args, { db: { comments } }, info) {
        return comments.filter((comment) => parent.id === comment.author);
    }
};
export default User;