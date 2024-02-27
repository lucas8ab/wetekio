import {bind, /* inject, */ BindingScope} from '@loopback/core';
const {Kafka} = require('kafkajs');

@bind({scope: BindingScope.TRANSIENT})
export class KafkaService {
  constructor() {}

  private async produce(topic: string, message: object) {
    const kafkaHost = process.env.KAFKA_HOST ?? '';
    if (!kafkaHost) return;

    const client = new Kafka({
      clientId: 'webbff',
      brokers: [kafkaHost],
    });

    const producer = client.producer();
    await producer.connect();

    const send = {
      topic: topic,
      messages: [{value: JSON.stringify(message)}],
    };

    console.log(`${new Date()}\n---KAFKA--- 
        ${JSON.stringify(send)}\n---END KAFKA---`);

    await producer.send(send);
    await producer.disconnect();
  }

  async produceContacto(message: object) {
    const topicContactos = process.env.KAFKA_TOPIC_CONTACTOS ?? '';
    if (!topicContactos) return;

    return this.produce(topicContactos, message);
  }

  async produceTramite(message: object) {
    const topicTramites = process.env.KAFKA_TOPIC_TRAMITES ?? '';
    if (!topicTramites) return;

    return this.produce(topicTramites, message);
  }
}
