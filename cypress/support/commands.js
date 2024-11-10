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

    // Wait for table & graph data to load
    cy.wait('@data')
    cy.get('.a-GV-bdy .a-GV-table').should('be.visible') // verify that the table is visible
    cy.get('svg').should('be.visible') // verify that the graph is visible
});

Cypress.Commands.add('graphdata', () => {
    cy.wait(1000) // wait for load -- lazy

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
                        entry['quantity'] = Number(text.replace('Value', ''))
                    }
                })

                items.push(entry)
            })
        })

    return cy.wrap(items)
})

Cypress.Commands.add('tabledata', () => {
    cy.get('.js-pg-first').click({ force: true }) // ensure we are on the first page    
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

Cypress.Commands.add('updatedata', (order, column, value) => {
    cy.get('.js-pg-first').click({ force: true }) // ensure we are on the first page

    const goToNextPage = () => {
        cy.get('.js-pg-next')
            .then($el => {
                let isCorrectPage = false
                cy.get('.a-GV-bdy .a-GV-table tbody tr').each(row => {
                    if (row.attr("data-id") == order) {
                        isCorrectPage = true
                    }
                }).then(() => {
                    if ($el.attr('disabled') === 'disabled' || isCorrectPage)
                        return
                    cy.get('.js-pg-next').click().then(goToNextPage)
                })
            })
    }

    goToNextPage()

    if (column === 'quantity') {
        cy.get(`.a-GV-bdy .a-GV-table tbody [data-id="${order}"] :nth-child(5)`)
            .then(row => {
                cy.wrap(row).dblclick().then(() => {
                    cy.get(`.a-GV-bdy .a-GV-table tbody [data-id="${order}"] td .a-GV-columnItem input`).clear().type(`${value}{enter}`)
                })
            })
    } else if (column === 'customer') {
        cy.get(`.a-GV-bdy .a-GV-table tbody [data-id="${order}"] :nth-child(6)`)
            .then(row => {
                cy.wrap(row).dblclick().then(() => {
                    cy.get(`.a-GV-bdy .a-GV-table tbody [data-id="${order}"] td .a-GV-columnItem button`)
                        .click()
                        .then(() => {
                            // cy.get('.a-PopupLOV-searchBar .a-PopupLOV-search').clear().type(`${value}{enter}`)
                            // cy.get('.a-PopupLOV-searchBar button').click({ force: true })
                            cy.get('.ui-dialog .a-PopupLOV-results ul li').contains(value).click()
                        })
                })
            })
    }

    cy.wait(1000)
    cy.get('footer .t-Region-buttons-right button').click()
    cy.wait(4000)
})