/** Generated from: features\login.feature */
import { test } from "playwright-bdd";

test.describe("Gladdhouse login Feature", () => {

  test("Verify homepage title", async ({ Given, page, Then, When, context, And }) => {
    await Given("I navigate to the glasshouse homepage", null, { page });
    await Then("the page title should be \"Glasshouse\"");
    await When("I navigate to the building page", null, { page });
    await When("I navigate to the facility \"C1\"", null, { context });
    await And("I create a new \"floor\"", null, { context });
  });

});

// == technical section ==

test.use({
  $test: ({}, use) => use(test),
  $uri: ({}, use) => use("features\\login.feature"),
  $bddFileMeta: ({}, use) => use(bddFileMeta),
});

const bddFileMeta = {
  "Verify homepage title": {"pickleLocation":"3:3"},
};