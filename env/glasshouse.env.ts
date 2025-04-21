const baseURL=`https://${process.env.ENV}-glasshouse.nextdc.com/`
const facilityId = process.env.FACILITY_ID || 'C1' // Default to C1 if not specified

export const glasshouseEnvSettings = {
    URLS: {
        baseURL: baseURL,
        apiBaseURL: 'https://dev-api.nextdc.com/facility/glasshouse-api'
    },
    FACILITY: {
        id: facilityId
    },
    API: {
        token: process.env.API_TOKEN || '',
        defaultPageSize: 50
    }
}