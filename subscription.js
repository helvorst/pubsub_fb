const { PubSub } = require('@google-cloud/pubsub');
const pubsub = new PubSub();


module.exports.createSubscription = async function(topicName, subscriptionName) {
    try {
        await pubsub.topic(topicName).createSubscription(subscriptionName);
    } catch (e) {
        console.warn(e);
    }
}


module.exports.listenForMessages = async function(subscriptionName, messageHandler) {
    console.log(`Listening to messages in subscription: ${subscriptionName}`);
    // References an existing subscription
    const subscription = pubsub.subscription(subscriptionName);

    // Listen for new messages until timeout is hit
    subscription.on(`message`, messageHandler);
}


async function synchronousPull(direction, worker) {

    const formattedSubscription = client.subscriptionPath(
        projectconfig.project.id,
        pubsubconfig.topic[direction].subscription
    );
    // The maximum number of messages returned for this request.
    // Pub/Sub may return fewer than the number specified.
    const maxMessages = 1;
    const newAckDeadlineSeconds = 30;
    const request = {
        subscription: formattedSubscription,
        maxMessages: maxMessages,
    };

    let isProcessed = false;

    // The subscriber pulls a specified number of messages.
    const [response] = await client.pull(request);
    // Obtain the first message.
    const message = response.receivedMessages[0];
    // Send the message to the worker function.
    worker(message);

    let waiting = true;
    while (waiting) {
        await new Promise(r => setTimeout(r, 10000));
        // If the message has been processed..
        if (isProcessed) {
            const ackRequest = {
                subscription: formattedSubscription,
                ackIds: [message.ackId],
            };

            //..acknowledges the message.
            await client.acknowledge(ackRequest);
            console.log(`Acknowledged: "${message.message.data}".`);
            // Exit after the message is acknowledged.
            waiting = false;
            console.log(`Done.`);
        } else {
            // If the message is not yet processed..
            const modifyAckRequest = {
                subscription: formattedSubscription,
                ackIds: [message.ackId],
                ackDeadlineSeconds: newAckDeadlineSeconds,
            };

            //..reset its ack deadline.
            await client.modifyAckDeadline(modifyAckRequest);

            console.log(
                `Reset ack deadline for "${message.message.data}" for ${newAckDeadlineSeconds}s.`
            );
        }
    }
    // [END pubsub_subscriber_sync_pull]
}
