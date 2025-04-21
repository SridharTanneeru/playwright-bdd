Feature: Devices Management
    As a user
    I want to access and manage devices
    So that I can monitor and control facility devices

    @devices @only
    Scenario: Access Devices page from facility view
        Given I navigate to the glasshouse homepage
        And I navigate to the building page
        When I navigate to the facility "C1"
        And I click on the Devices button
        Then the Devices page should be displayed
        And I should see all the required columns in the devices list
        And the "Add Device" button should be visible in devices page
        And the actions menu should be available for devices