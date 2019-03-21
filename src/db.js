const users = [
    {
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
    }
];

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
];

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
        post: '3'
    }
]
const db = {
    users,
    posts,
    comments
}
export default db;