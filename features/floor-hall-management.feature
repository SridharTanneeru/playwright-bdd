Feature: Floor and Hall Management
    As a user
    I want to manage floors and halls
    So that I can organize my data center effectively

    @only
    Scenario: Create and manage floor with hall and rack
        Given I navigate to the glasshouse homepage
        And I navigate to the building page
        When I navigate to the facility "C1"
        And I create a new "floor"
        Then the floor should be visible on the floors page
        And verify that the event has been created in the service bus for "floor add"
        When I add a new hall to the current floor
        Then the hall should be visible on the floor page
        And verify that the event has been created in the service bus for "hall add"
        When I navigate to the hall view page
        And I add a new rack to the hall
        Then verify that the event has been created in the service bus for "rack add"
        When I delete the rack
        Then verify that the event has been created in the service bus for "rack remove"
        When I navigate back to facility view
        And I navigate to the floor view
        Then the floor should be visible on the floors page
        When I delete the newly created hall
        Then verify that the event has been created in the service bus for "hall remove"
        When I delete the newly created floor
        Then verify that the event has been created in the service bus for "floor remove"
        And the floor should not be visible on the floors page