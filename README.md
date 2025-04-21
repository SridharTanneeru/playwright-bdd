# Glasshouse Web Tests

This is a test automation framework for testing the Glasshouse web application using Playwright and Cucumber.

## Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)
- Git

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd glasshouse-webtests
```

2. Install dependencies:
```bash
npm install
```

## Project Structure

```
glasshouse-webtests/
├── env/                    # Environment configuration files
├── features/              # Cucumber feature files
├── pages/                 # Page object models
├── steps/                 # Step definitions
│   ├── api/              # API test steps
│   └── ui/               # UI test steps
├── types/                 # TypeScript type definitions
├── utils/                 # Utility functions and helpers
└── playwright.config.ts   # Playwright configuration
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run specific feature
```bash
npm test -- features/floor-management.feature
```

### Run tests with specific tags
```bash
npm test -- --tags @api
```

### Run tests in headed mode
```bash
npm test -- --headed
```

### Run tests in debug mode
```bash
npm test -- --debug
```

## Test Types

### UI Tests
- Floor management
- Hall management
- Rack management
- Device management

### API Tests
- Device API
- Sensor API
- Template API
- Circuit API
- Rack Power Connection API

## Environment Configuration

Environment settings are configured in `env/glasshouse.env.ts`. Update the following settings as needed:

```typescript
export const glasshouseEnvSettings = {
    URLS: {
        baseURL: 'http://localhost:4200',
        apiBaseURL: 'http://localhost:5000/api'
    },
    CREDENTIALS: {
        username: 'testuser',
        password: 'testpass'
    }
};
```

## Writing Tests

### Feature Files
Feature files are written in Gherkin syntax and located in the `features/` directory.

Example:
```gherkin
Feature: Floor Management
  Scenario: Create a new floor
    Given I am logged in
    When I navigate to the floor management page
    And I create a new floor with name "Test Floor"
    Then the floor should be created successfully
```

### Step Definitions
Step definitions are written in TypeScript and located in the `steps/` directory.

Example:
```typescript
When('I create a new floor with name {string}', async ({}, floorName: string) => {
    await floorPage.createFloor(floorName);
});
```

### Page Objects
Page objects are used to encapsulate page-specific functionality and are located in the `pages/` directory.

Example:
```typescript
export class FloorPage {
    async createFloor(name: string) {
        await this.page.getByRole('button', { name: 'Create Floor' }).click();
        await this.page.getByLabel('Floor Name').fill(name);
        await this.page.getByRole('button', { name: 'Save' }).click();
    }
}
```

## API Testing

The framework includes an `APIHelper` class for making API requests and validating responses.

Example:
```typescript
const apiHelper = APIHelper.getInstance();
const response = await apiHelper.getDevices();
expect(response.status).toBe(200);
```

## Best Practices

1. Use descriptive names for features, scenarios, and steps
2. Keep step definitions focused and single-purpose
3. Use page objects to encapsulate UI interactions
4. Add appropriate waits and assertions
5. Handle errors gracefully
6. Use environment variables for configuration
7. Write tests that are independent and can run in any order

## Troubleshooting

### Common Issues

1. **Tests failing with timeout**
   - Check if the application is running
   - Verify network connectivity
   - Increase timeout in playwright.config.ts

2. **Element not found**
   - Verify the element selector
   - Check if the page has loaded completely
   - Add appropriate waits

3. **API requests failing**
   - Check API endpoint URL
   - Verify authentication
   - Check request payload

### Debugging

1. Run tests in headed mode:
```bash
npm test -- --headed
```

2. Use Playwright's debug mode:
```bash
npm test -- --debug
```

3. Add console logs in step definitions:
```typescript
console.log('Debug info:', someValue);
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 