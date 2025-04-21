Feature: Device Templates Management
    As different types of users
    I want to access and manage device templates
    So that I can control device configurations based on my role

    @device-templates @only
    Scenario Outline: Access Device Templates with different user roles
        Given I navigate to the glasshouse homepage
        # And I am logged in as "<userRole>"
        When I click on the Device templates icon in the navigation
        Then the Device templates page should be displayed
        And I should see the device templates list
        And I should see all the required columns in the device templates list
        And the "Add Device Type" button should be visible
        And the delete action in the menu should be visible

        Examples:
            | userRole     | addButtonVisibility | deleteActionVisibility |
            | Global Admin | visible             | visible                |
# | Admin Operator | visible             | not visible            |