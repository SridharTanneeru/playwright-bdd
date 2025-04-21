// types/api.ts
export interface DeviceResponse {
    id: string;
    name: string;
    type: string;
    facilityId: string;
    displayName: string;
    status: string;
    lastUpdated: string;
}

interface Device {
    deviceId: string;
    type: string;
    name: string;
    uniqueName: string;
    description: string;
    properties: Record<string, unknown>;
    propertiesJson: string;
    sensorCount: number;
    canDelete: boolean;
}

interface PaginatedResponse<T> {
    page: number;
    pageSize: number;
    totalItems: number;
    items: T[];
}

type DeviceListResponse = PaginatedResponse<Device>;

export type { Device, DeviceListResponse, PaginatedResponse };