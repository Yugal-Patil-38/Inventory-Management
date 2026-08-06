const getStockStatus = (quantity) => {
  if (quantity === 0) {
    return 'Out of Stock'
  }

  if (quantity <= 10) {
    return 'Low Stock'
  }

  return 'In Stock'
}

export { getStockStatus }
