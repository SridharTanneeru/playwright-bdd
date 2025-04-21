import { BrowserContext } from "playwright";

export interface ExtendedBrowserContext extends BrowserContext {
    facilityId?: string;
    floorName?: string;
    floorPrefix?: string;
    floorShortId?: string;
    hallName?: string;
    hallShortId?: string;
    rackId?: string;
    rackCount?: number; // To track number of racks for generating sequential IDs
} 