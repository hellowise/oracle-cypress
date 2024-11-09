# APEX Oracle QA
Cypress project for Oracle hiring process

### Installing
Run npm install

### Running
npx cypress run --headless --browser chrome

#### Issues
I had some issues with the save function in this app, the save POST request gets blocked with "Error: read ECONNRESET", thus preventing me from running the
tests properly, however, a similar issue has been discussed here https://github.com/cypress-io/cypress/issues/27804, which is why the tests will only work with chrome for now (at least on my end)..
