/**
 *
 * @param {*} targetClass query selector of the node that should be monitored
 * @param {*} config describe which DOM mutations should be reported to mutationObserver's callback.
 * @see [developer.mozilla.org/.../API/MutationObserver/observe](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver/observe)
 */
const Observing = (targetClass, config) => {
  const elem = document.getElementsByClassName(targetClass)[0]
  // console.log(elem);
  // console.debug(elem);
  let observer = new MutationObserver((mutationRecords) => {
    console.group(`${targetClass} mutations`)
    for (const mutationRecord in mutationRecords) {
      if (Object.hasOwnProperty.call(mutationRecords, mutationRecord)) {
        const record = mutationRecords[mutationRecord]
        const oldValue = record.oldValue.split(" ")
        const newValue = record.target.className.split(" ")
        const diff = {
          intersection: oldValue.filter((x) => newValue.includes(x)),
          removed: oldValue.filter((x) => !newValue.includes(x)),
          added: newValue.filter((x) => !oldValue.includes(x)),
        }
        console.table(diff)
        // const transit = { "oldValue": oldValue, "newValue": newValue}
        // console.table(transit);
      }
    }
    console.groupEnd(`${targetClass} mutations`)
    console.table(mutationRecords) // console.log(the changes)
  })
  // observe everything except attributes

  console.group("config")

  console.warn(`observe ${config.attributeFilter} on:`, elem)
  console.log({ config })
  observer.observe(elem, config)
  console.log(observer)

  console.groupEnd("config")
}

Observing("search-filter", {
  // attributes: true,
  attributeFilter: ["class"],
  attributeOldValue: true,
  characterDataOldValue: true,
  // childList: true, // observe direct children
  // subtree: true, // and lower descendants too
  // characterDataOldValue: true, // pass old data to callback
})
