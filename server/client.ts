import * as http from 'http'
import * as https from 'https'
import {isHttps} from './utils'


export const requestAsync = (host, port, path, method, headers, encoding = 'utf-8') => {
  const options = {
    host, port, path, method, headers
  }
}

export const getAsync = (url, coding = 'utf-8') => {
  return new Promise((resolve, reject) => {
    const httpActions = [http, https][+isHttps(url)] 
    https.get(url, ret => {
      let html = ""
      ret.setEncoding(coding)
      ret.on("data", chunk => {
        html += chunk
      })
      ret.on("end", () => {
        resolve(html)
      })
    }).on("error", e => {
      reject(e)
    })
  })
}