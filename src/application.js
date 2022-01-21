/*
 * The MIT License
 *
 * Copyright 2022 Thomas Lehmann.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

// modules already delivery by nodejs
const os = require('os')
const fs = require('fs')
const path = require('path')

// external modules (package.json)
const express = require('express')
const schedule = require('node-schedule')
const yargs = require('yargs/yargs')

// own modules (part of the project)
const logging = require('./tools/logging')
const tasks = require('./model/tasks')
const schema = require('./model/schema')

const app = express()
const port = 8000

const logger = logging.createLogger('tasks.log')

// define folder for static content
app.use(express.static('public'))
// parse request body as JSON
app.use(express.json())

// providing (main) HTML for tasks.
app.get('/', function (request, response) {
  const content = fs.readFileSync('public/index.html')
  response.set('content-type', 'text/html')
  response.send(content)
})

// providing schema.
app.get('/schema', function (request, response) {
  response.set('content-type', 'application/json')
  response.send(schema.SCHEMA)
})

// creating or updating a task object.
app.post('/task', tasks.post)
// get one task by id or all tasks
app.get('/task', tasks.get)
// delete task by id
app.delete('/task', tasks.delete)

if (require.main === module) {
  const argv = yargs(process.argv)
    .option('port', {
      alias: 'p',
      describe: 'port at which the service should run',
      default: port
    })
    .option('tasks-path', {
      alias: 't',
      describe: 'path where to read and write the tasks data (there in subfolder tasks)',
      default: os.homedir()
    })
    .argv

  const tasksPath = path.join(argv.tasksPath, 'Documents', 'tasks')
  if (!fs.existsSync(tasksPath)) {
    // ensure that the path does exist
    fs.mkdirSync(tasksPath)
  }

  tasks.load(path.join(tasksPath, 'tasks.json'))

  // check each minute whether data has changed. If so then store it.
  schedule.scheduleJob('*/1 * * * *', function () {
    tasks.save(path.join(tasksPath, 'tasks.json'))
  })

  app.listen(port, () => {
    logger.info(`Running tasks service at http://localhost:${argv.port}`)
  })
} else {
  module.exports = app
}
