
import dotenv from "dotenv";
import { ServiceBusClient } from "@azure/service-bus";
dotenv.config();

const connectionString = process.env.SERVICE_BUS_CONNECTION_STRING!;
if (!connectionString) {
  throw new Error("SERVICE_BUS_CONNECTION_STRING is not defined in the environment variables.");
}
const topicName = "sbt-corp-facility-configuration";
const subscriptionName = "floor-event-messages";

export async function getLatestFloorEventMessage() {
  const sbClient = new ServiceBusClient(connectionString);
  const receiver = sbClient.createReceiver(topicName, subscriptionName, {
    receiveMode: "peekLock"
  });

  try {
    const messages = await receiver.peekMessages(100); // Peek top 10
    return messages.map(m => m.body); // or filter to match floor name
  } finally {
    await receiver.close();
    await sbClient.close();
  }
}

export async function getLatestEventMessages(): Promise<any[]> {
    const sbClient = new ServiceBusClient(connectionString);
    const receiver = sbClient.createReceiver(topicName, subscriptionName, {
      receiveMode: "peekLock"
    });
  
    try {
      const messages = await receiver.peekMessages(1000);
      return messages.map(m => m.body);
    } finally {
      await receiver.close();
      await sbClient.close();
    }
  }