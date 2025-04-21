// Function to generate a random string of specified length
function generateRandomString(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

// Function to generate a unique floor name and prefix
export function generateFloorName(): { name: string; prefix: string } {
    const randomString = generateRandomString(4); // Generate 4 random characters
    const timestamp = Date.now().toString().slice(-4); // Get last 4 digits of timestamp
    const uniqueId = `${randomString}${timestamp}`;
    
    return {
        name: `Floor ${uniqueId}`,
        prefix: `F${uniqueId}`
    };
}

// Function to generate a unique hall name
export function generateHallName(): { name: string; prefix: string } {
    const randomString = generateRandomString(4);
    const timestamp = Date.now().toString().slice(-4);
    const uniqueId = `${randomString}${timestamp}`;
    
    return {
        name: `Hall ${uniqueId}`,
        prefix: `H${uniqueId}`
    };
} 