const elementsWithZIndex = [];

// Get all elements in the document
const allElements = document.querySelectorAll('*');

// Loop through each element and check if it has a z-index property
allElements.forEach((element) => {
  const zIndex = getComputedStyle(element).getPropertyValue('z-index');

  if (zIndex !== 'auto' && !isNaN(zIndex)) {
    // If the z-index property is defined and not "auto", add the element to the array
    elementsWithZIndex.push(element);
  }
});

// Sort the elements by stacking order
elementsWithZIndex.sort((a, b) => {
  const aIndex = parseInt(getComputedStyle(a).zIndex);
  const bIndex = parseInt(getComputedStyle(b).zIndex);
  return aIndex - bIndex;
});

console.log(
  `Found ${elementsWithZIndex.length} elements with a z-index property defined:`,
  elementsWithZIndex,
  // z-index values
  elementsWithZIndex.map((element) => {
    return parseInt(getComputedStyle(element).zIndex);
  }),
);
// Log the elements in a table
console.table(
  elementsWithZIndex.map((element) => {
    return {
      'Element': element,
      "Elements's stacking context":
        getComputedStyle(element).getPropertyValue('position') === 'static'
          ? 'none'
          : getComputedStyle(element).getPropertyValue('position'),
      'z-index': parseInt(getComputedStyle(element).zIndex),
    };
  }),
);
