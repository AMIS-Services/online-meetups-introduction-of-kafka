const http = require('http')
const consumer = require('./consume')
const express = require('express') //npm install express
const bodyParser = require('body-parser')
const sseMW = require('./sse');
const PORT = 3010

const app = express()
  .use(bodyParser.urlencoded({ extended: true }))
  .use(bodyParser.json()) // to parse body of content type application/json
  //configure sseMW.sseMiddleware as function to get a stab at incoming requests, in this case by adding a Connection property to the request
  .use(sseMW.sseMiddleware)
  // to serve static files from the *public* folder under the current directory  
  .use(express.static(__dirname + '/public'))
  // /updates is the SSE endpoint; any client that sends a GET request to this endpoint is 'connected', becomes a client and is informed with SSE events
  .get('/updates', function (req, res) {
    var sseConnection = res.sseConnection;
    sseConnection.setup();
    sseClients.add(sseConnection);
  })
  // retrieve a list of topics on the target Kafka Cluster
  .get('/topics', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(topics))
  })
  // refresh the message consumer (from earliest messages)
  .post('/config', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    // reinitialize the Kafka Topic Consumer from the earliest messages available on the topic
    consumer.initializeConsumer(topics,true)
    res.end(JSON.stringify(req.body ))
  });

const server = http.createServer(app);
server.listen(PORT, function listening() {
  console.log(`HTTP Server is listening at port ${PORT} for HTTP requests`)
});

// Realtime updates
var sseClients = new sseMW.Topic();

updateSseClients = function (message) {
  sseClients.forEach(function (sseConnection) {
    sseConnection.send(message);
  }
    , this // this second argument to forEach is the thisArg (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach) 
  );
}

let heartbeatCount = 0
// heartbeat
setInterval(() => {
  updateSseClients({
    "topic": "Heartbeat", "content": "Heartbeat signal from Topic Watcher "
    , "partition": "N/A", "key": "HB", "timestamp": new Date(), "offset": heartbeatCount++
  })
}
  , 120000
)

const handleMessage = function (message) {
  const messageContent = message.value.toString()
  const messageKey = message.key ? message.key.toString() : ""
  let msg = message
  msg.value = null
  msg.key = null
  msg.content = messageContent
  msg.key = messageKey
  updateSseClients(
    message
  )
}

let topics
async function getStarted() {
  topics = await consumer.getTopics()
  console.log(`Topics have returned: ${topics}`)
  topics.forEach((topic) => { consumer.setMessageHandler(topic, handleMessage) })
  consumer.initializeConsumer(topics)
}

getStarted()