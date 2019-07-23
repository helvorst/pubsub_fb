const { PubSub } = require('@google-cloud/pubsub');
const pubsub = new PubSub();

module.exports.createTopic = async function createTopic(topicName) {
    try {
        await pubsub.createTopic(topicName);
    } catch (e) {
        console.warn(e);
    }
}

module.exports.publishToTopic = async function(data, attr, topicName) {
    const payload = JSON.stringify(data);
    const dataBuffer = Buffer.from(payload);

    const messageId = await pubsub.topic(topicName).publish(dataBuffer, attr);
    console.log(`Message ${messageId} published.`);
    return messageId;
}
