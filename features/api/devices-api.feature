# features/api/devices-api.feature
Feature: Devices API
    As an API user
    I want to manage devices through the API
    So that I can automate device operations

    Background:
        Given I have valid API credentials

    @api @devicesapi
    Scenario: Get list of devices
        When I request the list of devices with the following parameters:
            | parameter          | value |
            | page               | 1     |
            | facilityNameFilter | PH1   |
            | pageSize           | 50    |
        # | orderByColumn    | displayName   |
        # | orderByDirection | asc           |
        # | typeNameFilter   | BRANCHBUSDUCT |
        Then the response status code should be 200
# And the response should contain a list of devices
# And each device should have the required fields

# @api @devices
# Scenario: Add a new device
#     When I send a request to add a new device with the following details:
#         | field    | value         |
#         | name     | Test Device   |
#         | type     | BRANCHBUSDUCT |
#         | facility | PH1           |
#     Then the response status code should be 201
#     And the response should contain the created device details