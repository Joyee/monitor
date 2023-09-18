let userAgent = require('user-agent')
// 主机
let host = 'cn-guangdong-log.aliyuncs.com'
// 项目名
let project = 'yymonitor'
// 存储名
let logstore = 'yymonitor-store'

function getExtraData() {
  return {
    title: document.title,
    url: location.href,
    timestamp: Date.now(),
    ua: userAgent.parse(navigator.userAgent).name,
  }
}

class SendTracker {
  constructor() {
    // this.url = `http://${project}.${host}/logstores/${logstore}/track`
    this.url = `http://localhost:3300/track`
    this.xhr = new XMLHttpRequest()
  }

  send(data = {}) {
    let extraData = getExtraData()
    let log = { ...data, ...extraData }
    // 阿里云要求值不能为数字
    for (const key in log) {
      if (typeof log[key] === 'number') {
        log[key] = `${log[key]}`
      }
    }
    console.log('%c log', 'color: red', log)
    // 接入日志系统
    let body = JSON.stringify({ __logs__: [log] })
    this.xhr.open('POST', this.url, true)
    this.xhr.setRequestHeader('Content-Type', 'application/json')
    this.xhr.setRequestHeader('x-log-apiversion', '1.0.0')
    this.xhr.setRequestHeader('x-log-bodyrawsize', body.length)
    this.xhr.onload = function () {
      // TODO
    }
    this.xhr.onerror = function (error) {
      console.log('%c error:', 'color: red', error)
    }
    this.xhr.send(body)
  }
}

export default new SendTracker()
