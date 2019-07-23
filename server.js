const express = require('express');
const app = express();
const {pubsubconfig} = require('./pubsubconfig'); 
const {pubsubrun} = require('./pubsub');

app.get('/', (req, res) => {
    res.send('Greetings');
})

app.get('/pubsubconfig', (req, res) => {
    res.send(pubsubconfig);
})

app.listen(process.env.PORT || 3000, async () => {
    console.log('server is on');
    await pubsubrun();
})