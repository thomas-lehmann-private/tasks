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

// modules provided by nodejs
const fs = require('fs')

const Validator = require('jsonschema').Validator
const { v4: isUuid } = require('uuid')

// the schema for one task
const SCHEMA = JSON.parse(fs.readFileSync('./public/schema.json'))

/**
 * Implement validation for uuid string.
 *
 * @param {string} input expect uuid v4 string.
 * @returns true when uuid string is valid otherwise false.
 */
Validator.prototype.customFormats.uuid = function (input) {
  return isUuid(input)
}

/**
 * Validation object against JSON schema.
 *
 * @param {object} object
 * @returns true when object is valid otherwise false.
 */
function validate (object) {
  const validator = new Validator()
  const result = validator.validate(object, SCHEMA)
  return result.errors.length === 0
}

/**
 * Adding missing fields with default.
 *
 * @param {object} task a task object
 * @returns the passed task object (eventually modified).
 */
function transform (task) {
  if (!('priority' in task)) {
    task.priority = 3
  }

  if (!('complexity' in task)) {
    task.complexity = 3
  }

  if ('workingTime' in task) {
    task.workingTimes = [{ created: task.changed, workingTime: task.workingTime }]
    delete task.workingTime
  }

  return task
}

exports.validate = validate
exports.transform = transform
exports.SCHEMA = SCHEMA
