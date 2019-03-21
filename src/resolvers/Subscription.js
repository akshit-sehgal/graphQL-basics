const Subscription = {
    count: {
        subscribe(parent, args, { pubsub }, info) {
            let count = 0;

            setInterval(() => {
                count += 1;
                pubsub.publish('count', {
                    count
                });
            }, 5000)
            return pubsub.asyncIterator('count');
        }
    }
}
export default Subscription;