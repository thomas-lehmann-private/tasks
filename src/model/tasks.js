/*
 * The MIT License
 *
 * Copyright 2020 Thomas Lehmann.
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

// modules provided by nodejs
const fs = require('fs')

// external modules added to the dependencies
const { v4: uuidv4 } = require('uuid')

// internal own modules
const schema = require('../model/schema')
const commonTools = require('../tools/common')
const tasksTools = require('../tools/tasks')
const logger = require('../tools/logging').defaultLogger

// the map of tasks
const data = new Map()
let dataModified = false

/**
 * Load tasks from a file.
 * @param {string} strPathAndFileName path and name of file where to read the tasks.
 */
module.exports.load = function (strPathAndFileName) {
  if (fs.existsSync(strPathAndFileName)) {
    const loadedData = JSON.parse(fs.readFileSync(strPathAndFileName))
    data.clear()
    for (let iTask = 0; iTask < loadedData.length; ++iTask) {
      data.set(loadedData[iTask].id, loadedData[iTask])
    }
    dataModified = false
  }
}

/**
 * Save the modified tasks to file.
 *
 * @param {string} strPathAndFileName path and name of file where to store the tasks.
 */
module.exports.save = function (strPathAndFileName) {
  if (dataModified) {
    fs.writeFileSync(strPathAndFileName, JSON.stringify(Array.from(data.values())))
    logger.info('Data stored to ' + strPathAndFileName + '!')
    dataModified = false
  }
}

module.exports.post = function (request, response) {
  const task = commonTools.clone(request.body)
  tasksTools.updateTimestamps(task)

  if (schema.validate(task)) {
    // updating a given todo by id?
    if ('id' in task) {
      if (task.id && data.has(task.id)) {
        logger.info(`Updating task with id ${task.id}`)
        data.set(task.id, task)
      } else {
        task.id = uuidv4()
        logger.info(`Creating new task with id ${task.id}`)
        data.set(task.id, task)
      }
      // creating a new todo
    } else {
      task.id = uuidv4()
      logger.info(`Creating new task with id ${task.id}`)
      data.set(task.id, task)
    }

    dataModified = true
    response.setHeader('content-type', 'application/json')
    response.end(JSON.stringify(task))
  } else {
    logger.error('Task object not valid!')
    response.sendStatus(400)
  }
}

/**
 * Retrieving a task by id or a list of all tasks.
 *
 * @param {object} request the request object
 * @param {object} response the response object
 */
module.exports.get = function (request, response) {
  if (request.query.id) {
    const task = data.get(request.query.id)
    if (task === undefined) {
      response.set('content-type', 'application/json')
      response.sendStatus(404)
    } else {
      response.set('content-type', 'application/json')
      response.end(JSON.stringify(task))
    }
  } else {
    response.set('content-type', 'application/json')
    response.end(JSON.stringify(Array.from(data.values())))
  }
}

module.exports.delete = function (request, response) {
  if (request.query.id) {
    if (data.delete(request.query.id)) {
      dataModified = true
      response.sendStatus(200)
    } else {
      response.sendStatus(404)
    }
  } else {
    response.sendStatus(400)
  }
}
