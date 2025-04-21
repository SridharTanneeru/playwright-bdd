export enum EventType {
    // Floor events
    FLOOR_ADD = "floor add",
    FLOOR_REMOVE = "floor remove",
    FLOOR_UPDATE = "floor update",
    // Hall events
    HALL_ADD = "hall add",
    HALL_REMOVE = "hall remove",
    HALL_UPDATE = "hall update",
    // Rack events
    RACK_ADD = "rack add",
    RACK_REMOVE = "rack remove",
    RACK_UPDATE = "rack update",
    // Power connection events
    POWER_CONNECTION_ADD = "power connection add",
    POWER_CONNECTION_REMOVE = "power connection remove"
}

export enum EventMessageType {
    // Floor events
    FLOOR_ADD = "ndc.corp.facility.configuration.floor.added.v2",
    FLOOR_REMOVE = "ndc.corp.facility.configuration.floor.removed.v2",
    FLOOR_UPDATE = "ndc.corp.facility.configuration.floor.updated.v2",
    // Hall events
    HALL_ADD = "ndc.corp.facility.configuration.hall.added.v2",
    HALL_REMOVE = "ndc.corp.facility.configuration.hall.removed.v2",
    HALL_UPDATE = "ndc.corp.facility.configuration.hall.updated.v2",
    // Rack events
    RACK_ADD = "ndc.corp.facility.configuration.rack.added.v2",
    RACK_REMOVE = "ndc.corp.facility.configuration.rack.removed.v2",
    RACK_UPDATE = "ndc.corp.facility.configuration.rack.updated.v2",
    // Power connection events
    POWER_CONNECTION_ADD = "ndc.corp.facility.configuration.power.connection.added.v2",
    POWER_CONNECTION_REMOVE = "ndc.corp.facility.configuration.power.connection.removed.v2"
}

export const eventTypeToMessageType: Record<EventType, EventMessageType> = {
    [EventType.FLOOR_ADD]: EventMessageType.FLOOR_ADD,
    [EventType.FLOOR_REMOVE]: EventMessageType.FLOOR_REMOVE,
    [EventType.FLOOR_UPDATE]: EventMessageType.FLOOR_UPDATE,
    [EventType.HALL_ADD]: EventMessageType.HALL_ADD,
    [EventType.HALL_REMOVE]: EventMessageType.HALL_REMOVE,
    [EventType.HALL_UPDATE]: EventMessageType.HALL_UPDATE,
    [EventType.RACK_ADD]: EventMessageType.RACK_ADD,
    [EventType.RACK_REMOVE]: EventMessageType.RACK_REMOVE,
    [EventType.RACK_UPDATE]: EventMessageType.RACK_UPDATE,
    [EventType.POWER_CONNECTION_ADD]: EventMessageType.POWER_CONNECTION_ADD,
    [EventType.POWER_CONNECTION_REMOVE]: EventMessageType.POWER_CONNECTION_REMOVE
}; 