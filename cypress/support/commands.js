import loginSelectors from '../support/selectors/login.js'
import commonSelectors from '../support/selectors/common.js'

Cypress.Commands.add('login', (email, password) => {
    // Loads the webpage
    cy.visit(`/pls/apex/r/${Cypress.env('workspace')}/qa-application`)

    // Login
    cy.get(loginSelectors.username).clear().type(email)
    cy.get(loginSelectors.password).clear().type(password)
    cy.get(loginSelectors.signIn).realClick()

    // Wait for login
    cy.wait('@login')
    cy.url().should('contain', 'home?session=')

    // Wait for table & graph data to load
    cy.wait('@data')
    cy.get(commonSelectors.table).should('be.visible') // verify that the table is visible
    cy.get('svg').should('be.visible') // verify that the graph is visible
    cy.waitForSpinner()
})

Cypress.Commands.add('save', () => {
    cy.wait('@data')
    cy.get(commonSelectors.saveButton).realClick()
    cy.wait('@login')
    cy.wait('@data')
    cy.waitForSpinner()
})

Cypress.Commands.add('waitForSpinner', () => {
    return cy.get(commonSelectors.processingSpinner, { timeout: 10000 }).should('not.exist')
})

Cypress.Commands.add('graphData', () => {
    cy.waitForSpinner()
    cy.wait(1000) // seems tricky to wait for graph to be fully loaded

    const items = []
    cy.get(commonSelectors.graphDots)
        .each(($el) => {
            cy.wrap($el).click({ force: true }).then(() => {
                const entry = {}

                cy.get(commonSelectors.graphTooltips).each(row => {
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

Cypress.Commands.add('tableData', () => {
    cy.get(commonSelectors.pageFirst).realClick() // ensure we are on the first page    
    const items = []

    const goToNextPage = () => {
        cy.get(commonSelectors.pageNext)
            .then($el => {
                cy.get(commonSelectors.tableRows).each(row => {
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

                cy.get(commonSelectors.pageNext).realClick().then(goToNextPage)
            })
    }

    goToNextPage()
    return cy.wrap(items)
})

Cypress.Commands.add('updateData', (order, column, value) => {
    cy.get(commonSelectors.pageFirst).realClick() // ensure we are on the first page

    const goToNextPage = () => {
        cy.get(commonSelectors.pageNext)
            .then($el => {
                let isCorrectPage = false
                cy.get(commonSelectors.tableRows).each(row => {
                    if (row.attr("data-id") == order) {
                        isCorrectPage = true
                    }
                }).then(() => {
                    if ($el.attr('disabled') === 'disabled' || isCorrectPage)
                        return
                    cy.get(commonSelectors.pageNext).realClick().then(goToNextPage)
                })
            })
    }

    goToNextPage()

    if (column === 'quantity') {
        cy.get(commonSelectors.quantityColumnForOrder(order))
            .then(row => {
                cy.wrap(row).realClick({ clickCount: 2 }).then(() => {
                    cy.get(commonSelectors.quantityInputForOrder(order)).clear().type(`${value}{enter}`).then(() => {
                        cy.save()
                    })
                })
            })
    } else if (column === 'customer') {
        cy.get(commonSelectors.customerInputForOrder(order))
            .then(row => {
                cy.wrap(row).realClick({ clickCount: 2 }).then(() => {
                    cy.get(commonSelectors.customerOpenItemList(order))
                        .realClick()
                        .then(() => {
                            cy.wait('@data')
                            cy.get(commonSelectors.dialogIconList).find('li').its('length').should('be.gte', 1).then(() => {
                                cy.waitForSpinner().then(() => {
                                    cy.get(commonSelectors.dialogListItems).contains(value).realClick().then(() => {
                                        cy.get(commonSelectors.dialog, { timeout: 10000 }).should('not.be.visible').then(() => {
                                            cy.save()
                                        })
                                    })
                                })
                            })
                        })
                })
            })
    }
})