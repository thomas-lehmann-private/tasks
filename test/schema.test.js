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
const { describe, it } = require('mocha')
const { v4: uuidv4 } = require('uuid')
const assert = require('assert')

const schema = require('../src/model/schema')

describe('test schema', () => {
  it('no data', () => {
    const noData = {}
    assert.equal(schema.validate(noData), false)
  })

  it('valid data (minimum)', () => {
    const validData = {
      title: 'test title',
      description: 'test description',
      created: new Date().toISOString(),
      changed: new Date().toISOString(),
      done: false
    }
    assert.ok(schema.validate(validData))
  })

  it('valid data (with id)', () => {
    const validData = {
      id: uuidv4() + 'x',
      title: 'test title',
      description: 'test description',
      created: new Date().toISOString(),
      changed: new Date().toISOString(),
      done: false
    }
    assert.ok(schema.validate(validData))
  })

  it('valid data (with tags)', () => {
    const validData = {
      title: 'test title',
      description: 'test description',
      created: new Date().toISOString(),
      changed: new Date().toISOString(),
      done: false,
      tags: ['test']
    }
    assert.ok(schema.validate(validData))
  })

  it('invalid title - is not a string', () => {
    const invalidData = {
      title: 1234567890,
      description: 'test description',
      created: new Date().toISOString(),
      changed: new Date().toISOString()
    }
    assert.equal(schema.validate(invalidData), false)
  })

  it('invalid title - too short', () => {
    const invalidData = {
      title: '1234',
      description: 'test description',
      created: new Date().toISOString(),
      changed: new Date().toISOString()
    }
    assert.equal(schema.validate(invalidData), false)
  })

  it('invalid description - is not a string', () => {
    const invalidData = {
      title: 'test title',
      description: 1234567890,
      created: new Date().toISOString(),
      changed: new Date().toISOString()
    }
    assert.equal(schema.validate(invalidData), false)
  })

  it('invalid description - too short', () => {
    const invalidData = {
      title: 'test title',
      description: '1234',
      created: new Date().toISOString(),
      changed: new Date().toISOString()
    }
    assert.equal(schema.validate(invalidData), false)
  })

  it('invalid tag - is not a string', () => {
    const invalidData = {
      title: 'test title',
      description: 'test description',
      created: new Date().toISOString(),
      changed: new Date().toISOString(),
      tags: [1234567890]
    }
    assert.equal(schema.validate(invalidData), false)
  })

  it('invalid tag - too short', () => {
    const invalidData = {
      title: 'test title',
      description: 'test description',
      created: new Date().toISOString(),
      changed: new Date().toISOString(),
      tags: ['ok']
    }
    assert.equal(schema.validate(invalidData), false)
  })

  it('invalid created date', () => {
    const invalidData = {
      title: 'test title',
      description: 'test description',
      created: '1234567890',
      changed: new Date().toISOString(),
      tags: ['test']
    }
    assert.equal(schema.validate(invalidData), false)
  })

  it('invalid changed date', () => {
    const invalidData = {
      title: 'test title',
      description: 'test description',
      created: new Date().toISOString(),
      changed: '1234567890',
      tags: ['test']
    }
    assert.equal(schema.validate(invalidData), false)
  })

  it('invalid additional fields', () => {
    const invalidData = {
      title: 'test title',
      description: 'test description',
      created: new Date().toISOString(),
      changed: new Date().toISOString(),
      foo: 'bar'
    }
    assert.equal(schema.validate(invalidData), false)
  })
})
