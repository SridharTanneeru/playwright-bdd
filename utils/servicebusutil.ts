import dotenv from "dotenv";
import { ServiceBusClient, ServiceBusAdministrationClient } from "@azure/service-bus";
dotenv.config();

// Get the current environment
const currentEnv = process.env.ENV || 'dev';

// Get the appropriate connection string based on environment
const connectionString = process.env.SERVICE_BUS_CONNECTION_STRING!;
if (!connectionString) {
  throw new Error("SERVICE_BUS_CONNECTION_STRING is not defined in the environment variables.");
}

const topicName = "sbt-corp-facility-configuration";
const subscriptionName = "floor-event-messages";
const createSubscriptionIfNotExists = process.env.CREATE_SUBSCRIPTION_IF_NOT_EXISTS === 'true';

async function ensureSubscriptionExists() {
  if (!createSubscriptionIfNotExists) return;

  const adminClient = new ServiceBusAdministrationClient(connectionString);
  
  try {
    // Check if subscription exists
    await adminClient.getSubscription(topicName, subscriptionName);
    console.log(`Subscription '${subscriptionName}' already exists.`);
  } catch (error) {
    if (error.code === 'SubscriptionNotFound') {
      console.log(`Creating subscription '${subscriptionName}'...`);
      await adminClient.createSubscription(topicName, subscriptionName);
      console.log(`Subscription '${subscriptionName}' created successfully.`);
    } else {
      throw error;
    }
  }
}

export async function getLatestFloorEventMessage() {
  await ensureSubscriptionExists();
  
  const sbClient = new ServiceBusClient(connectionString);
  const receiver = sbClient.createReceiver(topicName, subscriptionName, {
    receiveMode: "peekLock"
  });

  try {
    const messages = await receiver.peekMessages(1000); // Peek top 10
    return messages.map(m => m.body); // or filter to match floor name
  } finally {
    await receiver.close();
    await sbClient.close();
  }
}

export async function getLatestEventMessages(): Promise<any[]> {
  await ensureSubscriptionExists();
  
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