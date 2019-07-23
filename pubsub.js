const { projectconfig } = require('./projectconfig');
const { pubsubconfig } = require('./pubsubconfig');
const { createTopic, publishToTopic } = require('./topic');
const { createSubscription, listenForMessages } = require('./subscription')
const { payment } = require('./payment');

// The worker function is meant to be non-blocking. It starts a long-
// running process, such as writing the message to a table, which may
// take longer than the default 10-sec acknowledge deadline.
async function onMessage(message) {
    try {
        console.log(`Received message id: ${message.id}:`);
        console.log(`\tData: ${JSON.stringify(message.data)}`);
        console.log(`\tAttributes: ${JSON.stringify(message.attributes)}`);


        const tid = await payment(message.id, message.data, message.attributes);
        await onResponse({tid: tid});
        message.ack();

        console.log(`Finished procesing: ${message.id}`);


    } catch (e) {
        console.error(e);
    }
}

async function onResponse(data, attributes) {
    const topicName = pubsubconfig.topic.outbox.name;
    await publishToTopic(data, attributes, topicName);
}

async function prepareInbox() {
    const topicName = pubsubconfig.topic.inbox.name;
    const subscriptionName = pubsubconfig.topic.inbox.subscription;

    await createTopic(topicName);
    await createSubscription(topicName, subscriptionName);
}

async function prepareOutbox() {
    const topicName = pubsubconfig.topic.outbox.name;
    const subscriptionName = pubsubconfig.topic.outbox.subscription;

    await createTopic(topicName);
    await createSubscription(topicName, subscriptionName);
}


async function start() {
    try {
        await prepareInbox();
        await prepareOutbox();

        const subscriptionName = pubsubconfig.topic.inbox.subscription;


        await listenForMessages(subscriptionName, onMessage);
    } catch (e) {
        console.error(e.message)
    }
}

module.exports.pubsubrun = start;
//
