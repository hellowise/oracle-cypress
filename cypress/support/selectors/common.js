// in variable for concat
const baseTableSelector = '.a-GV-bdy .a-GV-table'
const getOrderSelectorBase = (order) => {
    if (typeof order !== 'number' || isNaN(order)) {
        throw new Error('The order must be a valid number')
    }
    return `${baseTableSelector} tbody [data-id="${order}"]`
}

export default {
    table: baseTableSelector,
    tableRows: `${baseTableSelector} tbody tr`,
    processingSpinner: '.u-Processing',
    dialog: '.ui-dialog',
    pageFirst: '.js-pg-first',
    pageNext: '.js-pg-next',
    saveButton: 'footer .t-Region-buttons-right button',
    graphDots: 'div[class*="oj-chart"] svg g[fill] *',
    graphTooltips: '.oj-dvt-datatip-table tr',
    quantityColumnForOrder: (order) => {
        const baseSelector = getOrderSelectorBase(order)
        return `${baseSelector} :nth-child(5)`  // Appending specific part for quantity column
    },
    quantityInputForOrder: (order) => {
        const baseSelector = getOrderSelectorBase(order)
        return `${baseSelector} td .a-GV-columnItem input`  // Appending specific part for quantity input
    },
    customerInputForOrder: (order) => {
        const baseSelector = getOrderSelectorBase(order)
        return `${baseSelector} :nth-child(6)`  // Appending specific part for customer input
    },
    customerOpenItemList: (order) => {
        const baseSelector = getOrderSelectorBase(order)
        return `${baseSelector} td .a-GV-columnItem button`  // Appending specific part for customer item list button
    },
    dialogIconList: '.ui-dialog .a-IconList',
    dialogListItems: 'li.a-IconList-item'
}