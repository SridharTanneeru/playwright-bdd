# features/api/devices-api.feature
Feature: Device Templates API
    As an API user
    I want to manage devices through the API
    So that I can automate device operations

    Background:
        Given I have valid API credentials

    @api @deviceTemplates
    Scenario: Get list of device templates
        When I request the list of device templates with the following parameters:
            | parameter              | value |
            | page                   | 1     |
            | parentDeviceTypeFilter | MSB   |
            | pageSize               | 50    |
        Then the response status code should be 200
