import { ExtendedBrowserContext } from '../types/browser';
import { getLatestEventMessages } from './servicebusutil';

interface MessageValidationResult {
  Type: string;
  Time: string;
  Name?: string;
  FloorId?: string;
}

/**
 * Waits for a specific message type to appear in the service bus
 * @param expectedType - The expected message type to wait for
 * @param context - The browser context containing test state
 * @param maxAttempts - Maximum number of retry attempts (default: 10)
 * @param delayMs - Delay between retries in milliseconds (default: 1000)
 * @returns Promise<any> - The found message
 */
export async function waitForMessage(
  expectedType: string,
  context: ExtendedBrowserContext,
  maxAttempts = 10,
  delayMs = 1000
): Promise<any> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    console.log(`🔄 Attempt ${attempt}/${maxAttempts} to find message`);
    
    const messages = await getLatestEventMessages();
    const latestMessages = messages.sort((a, b) => 
      new Date(b.Time).getTime() - new Date(a.Time).getTime()
    );

    // Log the latest messages we're checking
    console.log('📩 Latest messages:', latestMessages.slice(0, 3).map(m => ({
      Type: m.Type,
      Time: m.Time,
      Name: m.Data?.Name,
      FloorId: m.Data?.FloorId
    } as MessageValidationResult)));

    const message = latestMessages.find(msg => {
      if (msg.Type !== expectedType) return false;

      console.log(`🔍 Checking message:`, {
        messageTime: msg.Time,
        messageType: msg.Type,
        messageFloorId: msg.Data?.FloorId,
        contextFloorName: context.floorName
      });

      return true;
    });

    if (message) {
      console.log('✅ Found matching message:', {
        Type: message.Type,
        Time: message.Time,
        FloorId: message.Data?.FloorId
      } as MessageValidationResult);
      return message;
    }

    console.log(`⏳ Message not found, waiting ${delayMs}ms before retry...`);
    await new Promise(resolve => setTimeout(resolve, delayMs));
  }

  throw new Error(`Failed to find message of type ${expectedType} after ${maxAttempts} attempts`);
} 