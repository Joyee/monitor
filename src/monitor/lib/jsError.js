import getLastEvent from '../utils/getLastEvent'
import getSelector from '../utils/getSelector'
import tracker from '../utils/tracker'

export function injectJsError() {
  window.addEventListener(
    'error',
    function (ev) {
      let lastEvent = getLastEvent()
      let log = {
        kind: 'stability', // 监控指标大类
        type: 'error', // 小类
        errorType: 'jsError',
        url: '',
        message: ev.message,
        filename: ev.filename,
        position: `${ev.lineno}:${ev.colno}`, // 报错的行列位置
        stack: getLines(ev.error.stack),
        selector: lastEvent ? getSelector(lastEvent.composedPath()) : '',
      }
      tracker.send(log)
    },
    true,
  )

  window.addEventListener(
    'unhandledrejection',
    function (ev) {
      console.log('this is unhandledrejection')
      console.log(ev)
      const lastEvent = getLastEvent()
      let message = '',
        filename = '',
        line = 0,
        column = 0,
        stack = 0
      let reason = ev.reason
      if (typeof reason === 'string') {
        message = reason
      } else if (typeof reason === 'object') {
        message = reason.message
        if (reason.stack) {
          let matchResult = reason.stack.match(/at\s+(.+):(\d+):(\d+)/)
          filename = matchResult[1]
          line = matchResult[2]
          column = matchResult[3]
          stack = getLines(reason.stack)
        }
      }
      tracker.send({
        kind: 'stability',
        type: 'error',
        errorType: 'promiseError',
        message,
        filename,
        position: `${line}:${column}`,
        stack,
        selector: lastEvent ? getSelector(lastEvent.composedPath()) : '',
      })
    },
    true,
  )
}

function getLines(stack) {
  return stack
    .split('\n')
    .slice(1)
    .map((item) => item.replace(/^\s+at\s+/g, '')) // 以多个空白字符开头，后跟着 "at " 字符串的文本。用于解析错误堆栈中的函数调用信息
    .join('^')
}

// Error: Something went wrong
//     at foo (/path/to/file.js:10:5)
//     at bar (/path/to/file.js:20:10)
//     at baz (/path/to/file.js:30:15)

// ===>
// at foo (/path/to/file.js:10:5)
// at bar (/path/to/file.js:20:10)
// at baz (/path/to/file.js:30:15)
