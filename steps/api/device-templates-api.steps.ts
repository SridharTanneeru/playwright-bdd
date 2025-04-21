// steps/api/devices-api.steps.ts
import { When, Then } from '@fixtures/fixture';
import { expect } from '@playwright/test';
import { APIHelper } from '../../utils/apiHelper';
import { DataTable } from 'playwright-bdd';
import { glasshouseEnvSettings } from 'env/glasshouse.env';

let apiHelper: APIHelper;
let responseBody: any;
let apiResponse: any;

When('I request the list of device templates with the following parameters:', async ({}, dataTable: DataTable) => {
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
    responseBody = await apiHelper.getTemplates(params);
    console.log('Response from api:', responseBody);
    apiResponse = new Response(JSON.stringify(responseBody), { status: 200 });
});

Then('each device should have the required fields', async () => {
    const requiredFields = ['id', 'name', 'type', 'facilityId'];
    
    apiResponse.data.forEach((device: any) => {
        for (const field of requiredFields) {
            expect(device[field]).toBeDefined();
        }
    });
});