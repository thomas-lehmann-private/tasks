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
const { v4: isUuid } = require('uuid')

const request = require('supertest')
const assert = require('assert')

const server = require('../src/application')

describe('test application', () => {
  it('POST new valid task', () => {
    const now = new Date()
    const validData = {
      title: 'test title',
      description: 'test description',
      done: false
    }

    request(server)
      .post('/task')
      .set('content-type', 'application/json')
      .send(validData)
      .end((err, response) => {
        const task = response.body
        assert.equal(err, undefined)
        assert.equal(response.statusCode, 200)
        assert.ok(isUuid(task.id))
        assert.ok(new Date(task.created) > now)
        assert.equal(task.created, task.changed)
        assert.equal(task.title, validData.title)
        assert.equal(task.description, validData.description)
      })
  })

  it('POST update valid task', () => {
    const now = new Date()
    const validData = {
      title: 'test title',
      description: 'test description',
      created: now.toISOString(),
      changed: now.toISOString(),
      done: false
    }

    request(server)
      .post('/task')
      .set('content-type', 'application/json')
      .send(validData)
      .end((err, response) => {
        const task = response.body
        assert.equal(err, undefined)
        assert.equal(response.statusCode, 200)
        assert.ok(isUuid(task.id))
        assert.equal(task.created, now.toISOString())
        assert.ok(new Date(task.changed) > now)
        assert.equal(task.title, validData.title)
        assert.equal(task.description, validData.description)
      })
  })

  it('POST invalid task - empty', () => {
    request(server)
      .post('/task')
      .set('content-type', 'application/json')
      .send({})
      .end((err, response) => {
        assert.equal(err, undefined)
        assert.equal(response.statusCode, 400)
      })
  })

  it('POST invalid task - missing field', () => {
    request(server)
      .post('/task')
      .set('content-type', 'application/json')
      .send({ title: 'test title' })
      .end((err, response) => {
        assert.equal(err, undefined)
        assert.equal(response.statusCode, 400)
      })
  })
})
