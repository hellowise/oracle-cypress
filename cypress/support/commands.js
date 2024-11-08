import loginSelectors from '../support/selectors/login.js';

Cypress.Commands.add('login', (email, password) => {
    // Loads the webpage
    cy.visit('/pls/apex/r/hellowise/qa-application')

    // Login
    cy.get(loginSelectors.username).clear().type(email)
    cy.get(loginSelectors.password).clear().type(password)
    cy.get(loginSelectors.signIn).click()

    // Wait for login
    cy.wait('@login')
    cy.url().should('contain', 'home?session=')
});

Cypress.Commands.add('graphdata', () => {
    const items = []
    cy.get('div[class*="oj-chart"] svg g[fill] *')
        .each(($el) => {
            cy.wrap($el).click({ force: true }).then(() => {
                const entry = {}

                cy.get('.oj-dvt-datatip-table tr').each(row => {
                    const text = row.text()
                    if (text.startsWith('Series')) {
                        entry['customer'] = text.replace('Series', '')
                    } else if (text.startsWith('Group')) {
                        entry['product'] = text.replace('Group', '')
                    } else if (text.startsWith('Value')) {
                        entry['quantity'] = text.replace('Value', '')
                    }
                })

                items.push(entry)
            })
        })
    return cy.wrap(items)
})

Cypress.Commands.add('tabledata', () => {
    const items = []
    const goToNextPage = () => {
        cy.get('.js-pg-next')
            .then($el => {
                cy.get('.a-GV-bdy .a-GV-table tbody tr').each(row => {
                    const elements = row.children().slice(2) // skip the two 'button' columns
                    items.push({
                        'order': Number(elements[0].innerText),
                        'customer': elements[3].innerText,
                        'product': elements[1].innerText,
                        'quantity': Number(elements[2].innerText)
                    })
                })

                if ($el.attr('disabled') === 'disabled')
                    return

                cy.get('.js-pg-next').click().then(goToNextPage)
            })
    }
    goToNextPage()
    return cy.wrap(items)
})