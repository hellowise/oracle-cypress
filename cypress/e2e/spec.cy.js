describe('validate user input', () => {

  const orderId = Cypress.env('orderId')
  const quantity = Cypress.env('quantity')
  const customer = Cypress.env('customer')

  it('Alter quantity for order', () => {
    let graphDataBefore = []
    let graphDataAfter = []

    let tableDataBefore = []
    let tableDataAfter = []

    cy.graphData().then(data => {
      graphDataBefore = data
    })

    cy.tableData().then(data => {
      tableDataBefore = data
    })

    cy.updateData(orderId, 'quantity', quantity).then(() => {
      cy.graphData().then(data => {
        graphDataAfter = data
        cy.tableData().then(data => {
          tableDataAfter = data

          const entryOld = tableDataBefore.find(o => o.order == orderId)
          const entryOldSum = tableDataBefore
            .filter(o => o.product == entryOld.product)
            .map(o => o.quantity)
            .reduce((a, b) => a + b, 0)
          const graphQuantityBefore = graphDataBefore
            .filter(o => o.product == entryOld.product)
            .map(o => o.quantity)
            .reduce((a, b) => a + b, 0)

          const entryNew = tableDataAfter.find(o => o.order == orderId)
          const entryNewSum = tableDataAfter
            .filter(o => o.product == entryOld.product)
            .map(o => o.quantity)
            .reduce((a, b) => a + b, 0)
          const graphQuantityAfter = graphDataAfter
            .filter(o => o.product == entryOld.product)
            .map(o => o.quantity)
            .reduce((a, b) => a + b, 0)

          expect(entryNewSum).to.not.equal(entryOldSum, `Expected entryNewSum to be different from entryOldSum. Before: ${entryOldSum}, After: ${entryNewSum}`)

          expect(graphQuantityBefore).to.not.equal(graphQuantityAfter, `Expected graphQuantityBefore to be different from graphQuantityAfter. Before: ${graphQuantityBefore}, After: ${graphQuantityAfter}`)

          expect(entryNew.quantity).to.equal(quantity, `Expected entryNew.quantity to be equal to ${quantity}. Actual value: ${entryNew.quantity}`)

          expect(graphQuantityAfter).to.equal(entryNewSum, `Expected graphQuantityAfter to be equal to entryNewSum. Expected: ${entryNewSum}, Actual: ${graphQuantityAfter}`)
        })
      })
    })
  })

  it('Alter customer for order', () => {
    let graphDataBefore = []
    let graphDataAfter = []

    let tableDataBefore = []
    let tableDataAfter = []

    cy.graphData().then(data => {
      graphDataBefore = data
    })

    cy.tableData().then(data => {
      tableDataBefore = data
    })

    cy.updateData(orderId, 'customer', customer).then(() => {
      cy.graphData().then(data => {
        graphDataAfter = data
        cy.tableData().then(data => {
          tableDataAfter = data

          const entryOld = tableDataBefore.find(o => o.order == orderId)
          const graphItemsForCustomerBefore = graphDataBefore
            .filter(o => o.customer == entryOld.customer)
            .map(o => o.quantity)
            .reduce((a, b) => a + b, 0)

          const entryNew = tableDataAfter.find(o => o.order == orderId)
          const graphItemsForCustomerAfter = graphDataAfter
            .filter(o => o.customer == entryOld.customer)
            .map(o => o.quantity)
            .reduce((a, b) => a + b, 0)

          expect(entryNew.customer).to.not.equal(entryOld.customer, `Expected customer value to be different. New customer: ${entryNew.customer}, Old customer: ${entryOld.customer}`)

          expect(entryNew.customer).to.equal(customer, `Expected New customer to be equal to ${customer}. Actual value: ${entryNew.customer}`)

          expect(graphItemsForCustomerBefore).to.not.equal(graphItemsForCustomerAfter, `Expected graphItemsForCustomerBefore to be different from graphItemsForCustomerAfter. 
            Before: ${graphItemsForCustomerBefore}, After: ${graphItemsForCustomerAfter}`)
        })
      })
    })
  })
})