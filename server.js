const express = require('express');
const app = express();
const {pubsubconfig} = require('./pubsub/config'); 
const {run} = require('./pubsub/pubsubCnt');

app.get('/', (req, res) => {
    res.send('Greetings!');
})

app.get('/pubsubconfig', (req, res) => {
    res.send(pubsubconfig);
})

const port = process.env.PORT || 3000;
app.listen(port, async () => {
    console.log(`monPAY server is on port ${port}`);
    await run();
})
///