//Configuration Details for the Kafka Brokers and Topic
const localConfig = {
    // If you added kafka to the hosts file mapped to the IP address of the Docker Host machine, then you can work with these Broker Endpoints
    KAFKA_BROKERS: "kafka:9092,kafka:9093,kafka:9094"
    // If you did not (add kafka to the hosts file) you need to uncomment this next line, comment out the previous line and make sure the right IP address is used
    //KAFKA_BROKERS: "192.168.188.110:9092,192.168.188.110:9093,192.168.188.110:9094" 
    

};

const KAFKA_TOPIC= "workflow-queue"

const I_AM_USING_CLOUD_KARAFKA = false

const cloudkarafka_config = {
    // Specify the endpoints of the CloudKarafka Servers for your instance found under Connection Details on the Instance Details Page
    // this looks like this: moped-01.srvs.cloudkafka.com:9094,moped-02.srvs.cloudkafka.com:9094,moped-03.srvs.cloudkafka.com:9094"

    "metadata.broker.list": "YOUR BROKER ENDPOINTS"
    , "security.protocol": "SASL_SSL",
    "sasl.mechanisms": "SCRAM-SHA-256",
    "sasl.username": "YOUR_USERNAME",
    "sasl.password": "YOUR_PASSWORD"
};

// merge the cloudkarafka_config property with config properties; cloudkarafka_config will override properties with the same name
const kafkaConfig = I_AM_USING_CLOUD_KARAFKA ? cloudkarafka_config : localConfig

module.exports = { kafkaConfig, KAFKA_TOPIC};