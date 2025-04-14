Feature: Gladdhouse login Feature

  Scenario: Verify homepage title
    Given I navigate to the glasshouse homepage
    Then the page title should be "Glasshouse"
    When I navigate to the building page
    When I navigate to the facility "C1"
    And I create a new "floor"
# And I verify that the Device templates button exists on the home page
# When I click on the Device templates page
# Then the page displayed with the available device templates