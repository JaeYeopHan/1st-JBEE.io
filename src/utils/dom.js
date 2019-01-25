export const getElement = selector => document.querySelector(selector)
export const getElementPosition = selector => position =>
  getElement(selector).getClientRects()[0][position]
