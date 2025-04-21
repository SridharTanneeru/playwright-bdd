// utils/apiHelper.ts
import { request, APIRequestContext } from '@playwright/test';
import { glasshouseEnvSettings } from 'env/glasshouse.env';

// API Endpoints configuration
const API_ENDPOINTS = {
    DEVICES: {
        BASE: '/devices/v1',
        LIST: '/devices/v1',
        BY_ID: (id: string) => `/devices/v1/${id}`,
    },
    SENSORS: {
        BASE: '/sensors/v1',
        LIST: '/sensors/v1',
        BY_ID: (id: string) => `/sensors/v1/${id}`,
    },
    TEMPLATES: {
        BASE: '/devices/templates/v1',
        LIST: '/devices/templates/v1',
        BY_ID: (id: string) => `/devices/templates/v1/${id}`,
    },
    CIRCUITS: {
        BASE: '/circuits/v1',
        LIST: '/circuits/v1',
        BY_ID: (id: string) => `/circuits/v1/${id}`,
    },
    RACK_POWER_CONNECTIONS: {
        BASE: '/rack-power-connections/v1',
        LIST: '/rack-power-connections/v1',
        BY_ID: (id: string) => `/rack-power-connections/v1/${id}`,
    }
} as const;

// Common request parameters
interface PaginationParams {
    page?: number;
    pageSize?: number;
    orderByColumn?: string;
    orderByDirection?: 'asc' | 'desc';
}

// Specific request parameters
interface DeviceListParams extends PaginationParams {
    facilityNameFilter?: string;
    typeNameFilter?: string;
}

interface SensorListParams extends PaginationParams {
    deviceId?: string;
    typeFilter?: string;
}

interface TemplateListParams extends PaginationParams {
    parentDeviceTypeFilter?: string;
}

interface CircuitListParams extends PaginationParams {
    facilityFilter?: string;
    statusFilter?: string;
}

interface RackPowerConnectionListParams extends PaginationParams {
    rackId?: string;
    statusFilter?: string;
}

export class APIHelper {
    private static instance: APIHelper;
    private context: APIRequestContext | null = null;
    private bearerToken: string = '';

    private constructor() {}

    static getInstance(): APIHelper {
        if (!APIHelper.instance) {
            APIHelper.instance = new APIHelper();
        }
        return APIHelper.instance;
    }

    async init(bearerToken: string) {
        this.bearerToken = bearerToken;
        this.context = await request.newContext({
            baseURL: glasshouseEnvSettings.URLS.apiBaseURL,
            extraHTTPHeaders: {
                'Authorization': `Bearer ${this.bearerToken}`,
                'Content-Type': 'application/json'
            }
        });
    }

    // Generic request methods
    private async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
        if (!this.context) throw new Error('API context not initialized');

        const queryParams = new URLSearchParams();
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    queryParams.append(key, value.toString());
                }
            });
        }

        const url = `${glasshouseEnvSettings.URLS.apiBaseURL}${endpoint}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        console.log('Making GET request to:', url);

        try {
            const response = await this.context.get(url);
            const status = response.status();
            console.log('Response status:', status);
            
            if (status >= 400) {
                const errorText = await response.text();
                console.error('Error response:', errorText);
                throw new Error(`API request failed with status ${status}: ${errorText}`);
            }

            const responseText = await response.text();
            console.log('Response text:', responseText);

            if (!responseText) {
                throw new Error('Empty response received');
            }

            try {
                return JSON.parse(responseText);
            } catch (e) {
                console.error('Failed to parse JSON response:', e);
                console.error('Response text:', responseText);
                throw new Error(`Failed to parse JSON response: ${e.message}`);
            }
        } catch (e) {
            console.error('API request failed:', e);
            throw e;
        }
    }

    private async post<T>(endpoint: string, data: any): Promise<T> {
        if (!this.context) throw new Error('API context not initialized');

        const url = `${glasshouseEnvSettings.URLS.apiBaseURL}${endpoint}`;
        console.log('Making POST request to:', url);
        console.log('Request data:', JSON.stringify(data, null, 2));

        try {
            const response = await this.context.post(url, { data });
            const status = response.status();
            console.log('Response status:', status);
            
            if (status >= 400) {
                const errorText = await response.text();
                console.error('Error response:', errorText);
                throw new Error(`API request failed with status ${status}: ${errorText}`);
            }

            const responseText = await response.text();
            console.log('Response text:', responseText);

            if (!responseText) {
                throw new Error('Empty response received');
            }

            try {
                return JSON.parse(responseText);
            } catch (e) {
                console.error('Failed to parse JSON response:', e);
                console.error('Response text:', responseText);
                throw new Error(`Failed to parse JSON response: ${e.message}`);
            }
        } catch (e) {
            console.error('API request failed:', e);
            throw e;
        }
    }

    // Device methods
    async getDevices(params?: DeviceListParams) {
        return this.get(API_ENDPOINTS.DEVICES.LIST, params);
    }

    async getDeviceById(id: string) {
        return this.get(API_ENDPOINTS.DEVICES.BY_ID(id));
    }

    async addDevice(deviceData: any) {
        return this.post(API_ENDPOINTS.DEVICES.BASE, deviceData);
    }

    // Sensor methods
    async getSensors(params?: SensorListParams) {
        return this.get(API_ENDPOINTS.SENSORS.LIST, params);
    }

    async getSensorById(id: string) {
        return this.get(API_ENDPOINTS.SENSORS.BY_ID(id));
    }

    // Template methods
    async getTemplates(params?: TemplateListParams) {
        return this.get(API_ENDPOINTS.TEMPLATES.LIST, params);
    }

    async getTemplateById(id: string) {
        return this.get(API_ENDPOINTS.TEMPLATES.BY_ID(id));
    }

    // Circuit methods
    async getCircuits(params?: CircuitListParams) {
        return this.get(API_ENDPOINTS.CIRCUITS.LIST, params);
    }

    async getCircuitById(id: string) {
        return this.get(API_ENDPOINTS.CIRCUITS.BY_ID(id));
    }

    // Rack Power Connection methods
    async getRackPowerConnections(params?: RackPowerConnectionListParams) {
        return this.get(API_ENDPOINTS.RACK_POWER_CONNECTIONS.LIST, params);
    }

    async getRackPowerConnectionById(id: string) {
        return this.get(API_ENDPOINTS.RACK_POWER_CONNECTIONS.BY_ID(id));
    }
}