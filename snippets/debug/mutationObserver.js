/**
 *
 * @param {*} targetClass query selector of the node that should be monitored
 * @param {*} config describe which DOM mutations should be reported to mutationObserver's callback.
 * @see [developer.mozilla.org/.../API/MutationObserver/observe](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver/observe)
 */
const ObservingClassMutation = (targetClass, config) => {
  const elements = document.getElementsByClassName(targetClass)
  Array.prototype.forEach.call(elements, function (elem) {
    let observer = new MutationObserver((mutationRecords) => {
      console.group(
        `%c"${targetClass}" mutations`,
        "color:orange; font-size:1.3em;"
      )
      for (const mutationRecord in mutationRecords) {
        if (Object.hasOwnProperty.call(mutationRecords, mutationRecord)) {
          const record = mutationRecords[mutationRecord]
          const oldValue = record.oldValue.split(" ")
          const newValue = record.target.className.split(" ")
          const diff = {
            intersection: oldValue.filter((x) => newValue.includes(x)),
            "added 🟢": newValue.filter((x) => !oldValue.includes(x)),
            "removed 🔴": oldValue.filter((x) => !newValue.includes(x)),
          }
          //   console.table(diff)
          console.log(
            `${diff["intersection"]}, %c${diff["added 🟢"]}, %c${diff["removed 🔴"]}`,
            "color:limegreen;",
            "color:red;"
          )
          //   debugger;
          // const transit = { "oldValue": oldValue, "newValue": newValue}
          // console.table(transit);
          //   debugger;
        }
      }
      console.log(mutationRecords) // console.log(the changes)
      console.groupEnd(
        `%c"${targetClass}" mutations`,
        "color:orange; font-size:1.3em;"
      )
    })

    console.group("config")

    console.warn(
      `%cobserving attribute "${config.attributeFilter}" on:`,
      "font-size:1.5em;",
      elem
    )
    console.log({ config })
    observer.observe(elem, config)
    console.log(observer)

    console.groupEnd("config")
  })
  // observe everything except attributes
}

ObservingClassMutation("search-filter", {
  // attributes: true,
  attributeFilter: ["class"],
  attributeOldValue: true,
  //   characterDataOldValue: true,
  // childList: true, // observe direct children
  // subtree: true, // and lower descendants too
  // characterDataOldValue: true, // pass old data to callback
})
export { ObservingClassMutation as default }
