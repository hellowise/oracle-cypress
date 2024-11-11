# APEX Oracle QA
Cypress project for Oracle hiring process

### Installing
Run npm install

### Setup local env
Create the cypress.env.json file in the root dir, with this content:
```json
{
    "email": "<your e-mail>",
    "password": "<your password>"
}
```

You can also alter the workspace env var in cypress.config.js if necessary.

### Running
npx cypress run --headless --browser chrome

#### Issues
I had some issues with the save function in this app, the save POST request gets blocked with "Error: read ECONNRESET", thus preventing me from running the
tests properly, however, a similar issue has been discussed here https://github.com/cypress-io/cypress/issues/27804, which is why the tests will only work with chrome for now (at least on my end)..

I decided to use https://github.com/dmtrKovalenko/cypress-real-events to improve button click functionality, to make it less simulated, seen as the webpage responded better to this.
I encountered a bug when I wanted to update the customer part, using a normal click would somehow not reflect the selected customer choice, thus on save, it would not work.
