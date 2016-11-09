const http = require('http')
const pdf = require('html-pdf')
const request = require('request')
const through = require('through2')

const options = { format: 'Letter' };
const tr = through(function (buffer, _, next) {
  const json = JSON.parse(buffer.toString())
  const url = json.url
  request.get(url, (err, response, body) => {
    pdf.create(body, options).toFile('./test.pdf', (err, file) => {
      this.push(file.filename)
      next()
    })
  })
})

const server = http.createServer( (req, res) => {
  if (req.method !== 'POST')
    return res.end()

  req.pipe(tr).pipe(res)
})

server.listen(3000)

// const getUrl = (url, success, fail) => {
//   http.get(url, (response) => {
//     const statusCode = response.statusCode
//     const contentType = response.headers['content-type']

//     let error
//     if (statusCode !== 200) {
//       error = new Error(`Request Failed.\n` + `Status Code: ${statusCode}`)
//       // what does this mean?
//       response.resume()
//       fail(error)
//     } 

//     response.setEncoding('utf8')
//     let rawData = ''
//     response.on('data', (chunk) => rawData += chunk)
//     response.on('end', () => {
//       try {
//         const options = { format: 'Letter' }
//         pdf.create(rawData, options).toFile('./test.pdf', (err, file) => {
//           if (err) {
//             fail(err)
//             return
//           }
//           success(file.filename)
//         })
//       } catch (e) {
//         fail(e)
//       }
//     })
//   })
// }
//
