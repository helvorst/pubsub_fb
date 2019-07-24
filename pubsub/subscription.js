const { PubSub } = require('@google-cloud/pubsub');
const pubsub = new PubSub();


module.exports.createSubscription = async function(topicName, subscriptionName) {
    try {
        await pubsub.topic(topicName).createSubscription(subscriptionName);
    } catch (e) {
        console.warn(e.details);
    }
}


module.exports.listenForMessages = async function(subscriptionName, messageHandler) {
    console.log(`Listening to messages in subscription: ${subscriptionName}`);
    // References an existing subscription
    const subscription = pubsub.subscription(subscriptionName);

    // Listen for new messages until timeout is hit
    subscription.on(`message`, messageHandler);
}


