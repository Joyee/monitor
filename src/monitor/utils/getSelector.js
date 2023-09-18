function getSelectors(path) {
  console.log(path)
  return path
    .reverse()
    .filter((e) => e !== document && e !== window)
    .map((e) => {
      console.log('element:', e)
      let selector = ''
      if (e.id) {
        return `${e.nodeName.toLowerCase()}#${e.id}`
      } else if (e.className && typeof e.className === 'string') {
        return `${e.nodeName.toLowerCase()}.${e.className}`
      } else {
        selector = e.nodeName.toLowerCase()
      }
      return selector
    })
    .join(' ')
}

export default function (pathsOrTarget) {
  if (Array.isArray(pathsOrTarget)) {
    return getSelectors(pathsOrTarget)
  } else {
    let path = []
    while (pathsOrTarget) {
      path.push(pathsOrTarget)
      pathsOrTarget = pathsOrTarget.parentNode
    }
    return getSelectors(path)
  }
}
