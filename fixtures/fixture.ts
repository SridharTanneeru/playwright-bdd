import { test, createBdd } from "playwright-bdd";

// export const test = base.extend<>( {

// })

export const { Given, When, Then } = createBdd(test)