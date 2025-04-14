/** Generated from: features\floor-management.feature */
import { test } from "playwright-bdd";

test.describe("Floor Management", () => {

  test.only("Create a new floor in Glasshouse", { tag: ["@only"] }, async ({ Given, page, Then, When, context, And }) => {
    await Given("I navigate to the glasshouse homepage", null, { page });
    await Then("the page title should be \"Glasshouse\"");
    await When("I navigate to the building page", null, { page });
    await When("I navigate to the facility \"C1\"", null, { context });
    await And("I create a new \"floor\"", null, { context });
    await Then("the floor should be visible on the floors page", null, { page, context });
    await And("verify that the event has been created in the service bus for \"floor add\"", null, { context });
    await When("I delete the newly created floor", null, { page, context });
    await Then("the floor should not be visible on the floors page", null, { page, context });
    await And("verify that the event has been created in the service bus for \"floor remove\"", null, { context });
  });

});

// == technical section ==

test.use({
  $test: ({}, use) => use(test),
  $uri: ({}, use) => use("features\\floor-management.feature"),
  $bddFileMeta: ({}, use) => use(bddFileMeta),
});

const bddFileMeta = {
  "Create a new floor in Glasshouse": {"pickleLocation":"4:3","tags":["@only"],"ownTags":["@only"]},
};