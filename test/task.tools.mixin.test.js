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
const assert = require('assert')

const { tasksToolsMixin } = require('../public/javascript/tasks/mixins/tasks.tools.mixin')

describe('test task tools mixin', () => {
  it('convertion from human readable seconds', () => {
    assert.equal(tasksToolsMixin.methods.workingTimeFromHumanReadable('1s'), 1)
    assert.equal(tasksToolsMixin.methods.workingTimeFromHumanReadable('10s'), 10)
    assert.equal(tasksToolsMixin.methods.workingTimeFromHumanReadable('59s'), 59)
    // that's wrong because '1m' would have been the right one
    assert.equal(tasksToolsMixin.methods.workingTimeFromHumanReadable('60s'), undefined)
  })

  it('convertion from human readable minutes', () => {
    assert.equal(tasksToolsMixin.methods.workingTimeFromHumanReadable('1m'), 60)
    assert.equal(tasksToolsMixin.methods.workingTimeFromHumanReadable('10m'), 10 * 60)
    assert.equal(tasksToolsMixin.methods.workingTimeFromHumanReadable('59m'), 59 * 60)
    // that's wrong because '1h' would have been the right one
    assert.equal(tasksToolsMixin.methods.workingTimeFromHumanReadable('60m'), undefined)
  })

  it('convertion from human readable hours', () => {
    assert.equal(tasksToolsMixin.methods.workingTimeFromHumanReadable('1h'), 60 * 60)
    assert.equal(tasksToolsMixin.methods.workingTimeFromHumanReadable('10h'), 10 * 60 * 60)
    assert.equal(tasksToolsMixin.methods.workingTimeFromHumanReadable('23h'), 23 * 60 * 60)
    // that's wrong because '1d' would have been the right one
    assert.equal(tasksToolsMixin.methods.workingTimeFromHumanReadable('24h'), undefined)
  })

  it('convertion from human readable days', () => {
    assert.equal(tasksToolsMixin.methods.workingTimeFromHumanReadable('1d'), 24 * 60 * 60)
    assert.equal(tasksToolsMixin.methods.workingTimeFromHumanReadable('10d'), 10 * 24 * 60 * 60)
  })

  it('convertion to human readable', () => {
    assert.equal(tasksToolsMixin.methods.workingTimeToHumanReadable(1), '1s')
    assert.equal(tasksToolsMixin.methods.workingTimeToHumanReadable(59), '59s')
    assert.equal(tasksToolsMixin.methods.workingTimeToHumanReadable(60), '1m')
    assert.equal(tasksToolsMixin.methods.workingTimeToHumanReadable(61), '1m1s')
    assert.equal(tasksToolsMixin.methods.workingTimeToHumanReadable(60 * 60), '1h')
    assert.equal(tasksToolsMixin.methods.workingTimeToHumanReadable(60 * 60 + 1), '1h1s')
    assert.equal(tasksToolsMixin.methods.workingTimeToHumanReadable(60 * 60 + 61), '1h1m1s')
    assert.equal(tasksToolsMixin.methods.workingTimeToHumanReadable(60 * 60 * 24), '1d')
    assert.equal(tasksToolsMixin.methods.workingTimeToHumanReadable(60 * 60 * 24 + 1), '1d1s')
    assert.equal(tasksToolsMixin.methods.workingTimeToHumanReadable(60 * 60 * 24 + 61), '1d1m1s')
    assert.equal(tasksToolsMixin.methods.workingTimeToHumanReadable(60 * 60 * 24 + 60 * 60 + 61), '1d1h1m1s')
  })

  it('compareNumbers', () => {
    assert.equal(tasksToolsMixin.methods.compareNumbers(1, 2), -1)
    assert.equal(tasksToolsMixin.methods.compareNumbers(2, 1), +1)
    assert.equal(tasksToolsMixin.methods.compareNumbers(2, 2), 0)
  })

  it('isToday', () => {
    const now = new Date()
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)

    assert.equal(tasksToolsMixin.methods.isToday(now), true)
    assert.equal(tasksToolsMixin.methods.isToday(yesterday), false)
  })
})
