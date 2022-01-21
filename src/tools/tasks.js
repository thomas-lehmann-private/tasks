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

/**
 * Updating created and/or changed date.
 * Throwing an exception when the created date is invalid.
 *
 * @param {object} task the task object to be updated for its timestamps.
 */
function updateTimestamps (task) {
  if (task.created === undefined) {
    // dates are not defined
    task.created = new Date().toISOString()
    task.changed = task.created
  } else {
    // ensure that nothing is wrong with the created date
    const created = Date.parse(task.created)
    if (isNaN(created)) {
      throw new Error('Invalid creation date!')
    } else {
      if (created > new Date()) {
        throw new Error('Created Date cannot be in future!')
      }

      // just updating the changed date.
      task.changed = new Date().toISOString()
    }
  }
}

exports.updateTimestamps = updateTimestamps
