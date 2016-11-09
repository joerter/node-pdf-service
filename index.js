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
