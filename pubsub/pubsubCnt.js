const { pubsubconfig } = require('./config');
const { createTopic, publishToTopic } = require('./topic');
const { createSubscription, listenForMessages } = require('./subscription')
const { makePayment } = require('../payment');

// The worker function is meant to be non-blocking. It starts a long-
// running process, such as writing the message to a table, which may
// take longer than the default 10-sec acknowledge deadline.
async function onMessage(message) {
    try {
        console.log(`Received message id: ${message.id}:`);
        const buffer = Buffer.from(message.data, 'base64');
        const data = JSON.parse(buffer.toString());
        console.log(`\tData: ${JSON.stringify(data)}`);
        console.log(`\tAttributes: ${JSON.stringify(message.attributes)}`);

        try {
            const tid = await makePayment(message.id, data, message.attributes);
            await onResponse({ tid: tid }, { originalMessageId: message.id });
            message.ack();
            console.log(`Finished procesing: ${message.id}`);

        } catch (e) {
            console.error(`Can't make payment`);
        }

    } catch (error) {
        console.error('Can\'t parse message');
        message.ack();
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


async function run() {
    try {
        await prepareInbox();
        await prepareOutbox();

        const subscriptionName = pubsubconfig.topic.inbox.subscription;


        await listenForMessages(subscriptionName, onMessage);
    } catch (e) {
        console.error(e.message)
    }
}

module.exports.run = run;
//
