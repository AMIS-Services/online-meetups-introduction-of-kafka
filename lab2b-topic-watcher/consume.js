const Kafka = require("node-rdkafka"); // see: https://github.com/blizzard/node-rdkafka
const externalConfig = require('./config');

// construct a Kafka Configuration object understood by the node-rdkafka library
// merge the configuration as defined in config.js with additional properties defined here
const kafkaConf = {
    ...externalConfig.kafkaConfig
    , ...{
        "socket.keepalive.enable": true,
        "debug": "generic,broker,security"
    }
};

let messageHandlers = {} // an key-value map with Kafka Topic Names as key and a reference to a function to handle message consumed from that Topic
const setMessageHandler = function (topic, messageHandlingFunction) {
    messageHandlers[topic] = messageHandlingFunction
}

// this function returns a list of (non-administrative) topics on the cluster
const getTopics = async function () {
    const producer = new Kafka.Producer(kafkaConf);
    return new Promise((resolve, reject) => {
        producer.connect()
            .on('ready', function (i, metadata) {
                const clusterTopics = metadata.topics.reduce((topicsList, topic) => {
                    if (!topic.name.startsWith("__")) // do not include internal topics
                        topicsList.push(topic.name)
                    return topicsList
                }, [])
                console.log(`Topics on cluster are ${clusterTopics}`)
                producer.disconnect()
                resolve(clusterTopics)
            })
            .on('event.error', function (err) {
                console.log(err);
                resolve(err)
            });
    })// 
}// getTopics

let stream
let offsetLatest ="latest"  
let offsetEarliest ="earliest"    
// consumption is done in a unique consumer group
// initially it reads only new messages on topics; this can be toggled to re-read all messages from the earliest available on the topic 
function initializeConsumer(topicsToListenTo, readFromBeginning=false) {
    const CONSUMER_GROUP_ID = "kafka-topic-watcher-" + new Date().getTime()
    kafkaConf["group.id"] = CONSUMER_GROUP_ID
    if (stream) {
        stream.consumer.disconnect();
    }

    stream = new Kafka.KafkaConsumer.createReadStream(kafkaConf
        , { "auto.offset.reset": readFromBeginning? offsetEarliest:offsetLatest }, {
        topics: topicsToListenTo
    });
    stream.on('data', function (message) {
        console.log(`Consumed message on Stream from Topic ${message.topic}: ${message.value.toString()} `);
        if (messageHandlers[message.topic]) messageHandlers[message.topic](message)
        else console.log("No message handler is registered for handling mssages on topic ${message.topic}")
    });

    stream.on('error', function (err) {
        console.log(`Error event on Stream ${err} `);

    });
    console.log(`Stream consumer created to consume (from the beginning) from topic ${topicsToListenTo}`);

    stream.consumer.on("disconnected", function (arg) {
        console.log(`The stream consumer has been disconnected`)
    });
}//initializeConsumer


module.exports = { initializeConsumer, setMessageHandler, getTopics };