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

  return task
}

exports.validate = validate
exports.transform = transform
exports.SCHEMA = SCHEMA
