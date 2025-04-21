// steps/api/common-api.steps.ts
import { Then } from '@fixtures/fixture';
import { expect } from '@playwright/test';

// Store API responses in a map to handle multiple concurrent requests
const apiResponses = new Map<string, any>();

export function storeApiResponse(key: string, response: any) {
    console.log(`Storing API response for key: ${key}`);
    console.log('Response:', JSON.stringify(response, null, 2));
    apiResponses.set(key, response);
}

export function getApiResponse(key: string) {
    const response = apiResponses.get(key);
    if (!response) {
        console.error(`No API response found for key: ${key}`);
        console.error('Available keys:', Array.from(apiResponses.keys()));
    }
    return response;
}

Then('the response status code should be {int}', async ({}, statusCode: number) => {
    // Get the most recent response if no key is provided
    const response = Array.from(apiResponses.values()).pop();
    if (!response) {
        console.error('No API response found in map');
        console.error('Available keys:', Array.from(apiResponses.keys()));
        throw new Error('No API response found. Make sure to store the response using storeApiResponse()');
    }
    console.log('Validating response status code:', response.status);
    expect(response.status).toBe(statusCode);
});

Then('the response with key {string} status code should be {int}', async ({}, key: string, statusCode: number) => {
    const response = getApiResponse(key);
    if (!response) {
        console.error(`No API response found for key: ${key}`);
        console.error('Available keys:', Array.from(apiResponses.keys()));
        throw new Error(`No API response found for key: ${key}`);
    }
    console.log(`Validating response status code for key ${key}:`, response.status);
    expect(response.status).toBe(statusCode);
});

Then('the response should contain {string}', async ({}, field: string) => {
    const response = Array.from(apiResponses.values()).pop();
    if (!response) {
        console.error('No API response found in map');
        console.error('Available keys:', Array.from(apiResponses.keys()));
        throw new Error('No API response found. Make sure to store the response using storeApiResponse()');
    }
    console.log(`Validating response contains field: ${field}`);
    expect(response.data).toHaveProperty(field);
});

Then('the response with key {string} should contain {string}', async ({}, key: string, field: string) => {
    const response = getApiResponse(key);
    if (!response) {
        console.error(`No API response found for key: ${key}`);
        console.error('Available keys:', Array.from(apiResponses.keys()));
        throw new Error(`No API response found for key: ${key}`);
    }
    console.log(`Validating response for key ${key} contains field: ${field}`);
    expect(response.data).toHaveProperty(field);
});