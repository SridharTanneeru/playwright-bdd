Feature: Floor Management

  @only
  Scenario: Create a new floor in Glasshouse
    Given I navigate to the glasshouse homepage
    Then the page title should be "Glasshouse"
    When I navigate to the building page
    When I navigate to the facility "C1"
    And I create a new "floor"
    Then the floor should be visible on the floors page
    And verify that the event has been created in the service bus for "floor add"
    When I delete the newly created floor
    Then the floor should not be visible on the floors page
    And verify that the event has been created in the service bus for "floor remove"
