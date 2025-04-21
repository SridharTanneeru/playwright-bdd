import { Given, When, Then } from '@fixtures/fixture';
import { DataTable } from 'playwright-bdd';
import { APIHelper } from 'utils/apiHelper';
import { expect } from '@playwright/test';
import { DeviceListResponse } from '../../types/api';
import { glasshouseEnvSettings } from 'env/glasshouse.env';

let apiResponse: Response;
let responseBody: any;
let apiHelper: APIHelper;

When('I request the list of devices with the following parameters:', async ({}, dataTable: DataTable) => {
    const params: Record<string, string> = {};
    const parameters = dataTable.rows();
    parameters.forEach(([key, value]) => {
        params[key] = value;
    });

    apiHelper = APIHelper.getInstance();
    const queryParams = new URLSearchParams(params);
    const baseUrl = glasshouseEnvSettings.URLS.apiBaseURL;
    const url = `${baseUrl}/devices/v1?${queryParams.toString()}`;
    console.log('Making API request to:', url);
    responseBody = await apiHelper.getDevices(params);
    console.log('Response from api:', responseBody);
    apiResponse = new Response(JSON.stringify(responseBody), { status: 200 });
});

// Then('the response status code should be {int}', async ({}, statusCode: number) => {
//     expect(apiResponse.status).toBe(statusCode);
// });

Then('the response should contain a list of devices', async ({}) => {
    const deviceListResponse = responseBody as DeviceListResponse;
    
    // Validate response structure
    expect(deviceListResponse).toHaveProperty('page');
    expect(deviceListResponse).toHaveProperty('pageSize');
    expect(deviceListResponse).toHaveProperty('totalItems');
    expect(deviceListResponse).toHaveProperty('items');
    expect(Array.isArray(deviceListResponse.items)).toBe(true);

    // Validate device structure if there are any items
    if (deviceListResponse.items.length > 0) {
        const firstDevice = deviceListResponse.items[0];
        expect(firstDevice).toHaveProperty('deviceId');
        expect(firstDevice).toHaveProperty('type');
        expect(firstDevice).toHaveProperty('name');
        expect(firstDevice).toHaveProperty('uniqueName');
        expect(firstDevice).toHaveProperty('description');
        expect(firstDevice).toHaveProperty('properties');
        expect(firstDevice).toHaveProperty('propertiesJson');
        expect(firstDevice).toHaveProperty('sensorCount');
        expect(firstDevice).toHaveProperty('canDelete');
    }
}); 