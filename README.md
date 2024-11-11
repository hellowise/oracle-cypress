# APEX Oracle QA
Cypress project for Oracle hiring process

This project was built with the following framework versions:
- Cypress package version: 13.15.2
- Cypress binary version: 13.15.2
- Bundled Node version: 18.17.1

### Installing
To clone the repo, run the following command:
```
git clone https://github.com/hellowise/oracle-cypress.git
```

To install the dependencies, cd into the root folder of the project and run the following command:
```
npm install
```

### Setup local env
Create the cypress.env.json file in the root dir, with this content:
```json
{
    "email": "<your e-mail>",
    "password": "<your password>"
}
```

Replace email and password with valid credentials.
You can also alter the workspace env var in cypress.config.js if necessary.

### Running
To run the project, run the following command:
```
npx cypress run --headless --browser chrome
```

This will run the tests and change the values to those specified in the env file.
The project was built with chromium in mind (refer to "Issues" for more info), so to ensure successful runs, I recommend using chrome.

### Env variables
The following variables should be changed according to the desired values.
Workspace depends on user, the other values will be used for the test data and can be kept as the default value.

- workspace: 'hellowise',
- orderId: 10,
- quantity: 30,
- customer: 'Deli'

Example: Will change order 10 to quantity 30 and customer Deli.
You can overwrite env variables at execution time with the env param:

```
npx cypress run --headless --browser chrome --env orderId=12
```

### Issues
- I had some issues with the save function in this app, the save POST request gets blocked with "Error: read ECONNRESET", thus preventing me from running the
tests properly. However, a similar issue has been discussed here https://github.com/cypress-io/cypress/issues/27804, which is why the tests will only work with chrome for now (at least on my end).

- I decided to use https://github.com/dmtrKovalenko/cypress-real-events to improve button click functionality (only works for chromium based browsers), to make it less simulated, seen as the webpage responded better to this.
I encountered a bug when I wanted to update the customer part, using a normal click would somehow not reflect the selected customer choice, thus on save, it would not work.

- After setting the values to the ones specified, the app will stay in that state unless reverted manually. Its possible to have a method that will set those values back to default, or even use random generated values for the tests to avoid this from happening, however, it was not implemented in this case because it wasn't clear to me if it was important in the scope or not.
