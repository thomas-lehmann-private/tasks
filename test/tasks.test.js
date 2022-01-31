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
const os = require('os')
const fs = require('fs')
const path = require('path')
const { v4: uuidv4 } = require('uuid')

const { describe, it } = require('mocha')
const request = require('supertest')
const assert = require('assert')

const tasks = require('../src/model/tasks')
const server = require('../src/application')

describe('test tasks', () => {
  const strTestData = './test/data/tasks.json'
  const data = JSON.parse(fs.readFileSync(strTestData))

  it('load tasks (get all tasks request)', (done) => {
    tasks.load(strTestData)
    request(server)
      .get('/task')
      .expect('content-type', /json/)
      .expect(200)
      .then((response) => {
        assert.equal(JSON.stringify(response.body), JSON.stringify(data))
        done()
      })
      .catch((err) => done(err))
  })

  it('save tasks (no change)', () => {
    tasks.load(strTestData)
    const strPathAndFileName = path.join(os.tmpdir(), 'tasks-' + uuidv4())
    tasks.save(strPathAndFileName)
    assert.ok(!fs.existsSync(strPathAndFileName))
  })

  it('save tasks (with change)', (done) => {
    tasks.load(strTestData)

    const validData = {
      title: 'test title',
      description: 'test description',
      done: false
    }

    request(server)
      .post('/task')
      .set('content-type', 'application/json')
      .send(validData)
      .expect(200)
      .then((response) => {
        const strPathAndFileName = path.join(os.tmpdir(), 'tasks-' + uuidv4())
        tasks.save(strPathAndFileName)
        assert.ok(fs.existsSync(strPathAndFileName))
        done()
      })
  })

  it('update task', (done) => {
    tasks.load(strTestData)

    request(server)
      .get('/task?id=' + data[1].id)
      .expect('content-type', /json/)
      .expect(200)
      .then((response) => {
        const task = response.body
        task.done = true
        request(server)
          .post('/task')
          .set('content-type', 'application/json')
          .send(task)
          .expect(200)
          .then((response) => {
            assert.ok(response.body.done)
            done()
          })
      })
      .catch((err) => done(err))
  })

  it('get one task by existing id', (done) => {
    tasks.load(strTestData)
    request(server)
      .get('/task?id=' + data[1].id)
      .expect('content-type', /json/)
      .expect(200)
      .then((response) => {
        assert.equal(JSON.stringify(response.body), JSON.stringify(data[1]))
        done()
      })
      .catch((err) => done(err))
  })

  it('get one task (not existing id)', (done) => {
    tasks.load(strTestData)
    request(server)
      .get('/task?id=not-existing-id')
      .expect(404, done)
  })

  it('delete task (get remaining tasks)', (done) => {
    tasks.load(strTestData)
    request(server)
      .delete('/task?id=' + data[0].id)
      .expect(200)
      .then((response) => {
        request(server)
          .get('/task')
          .expect('content-type', /json/)
          .expect(200)
          .then((response) => {
            const expectedJson = '[' + JSON.stringify(data[1]) + ']'
            assert.equal(JSON.stringify(response.body), expectedJson)
            done()
          })
          .catch((err) => done(err))
      })
  })

  it('delete task (not existing id)', (done) => {
    request(server)
      .delete('/task?id=not-existing-id')
      .expect(404, done)
  })

  it('delete task (missing id query parameter)', (done) => {
    request(server)
      .delete('/task')
      .expect(400, done)
  })
})
