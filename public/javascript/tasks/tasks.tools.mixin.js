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
const tasksToolsMixin = { // eslint-disable-line
  methods: {
    /**
     * Compare two numbers.
     *
     * @param {number} numberA first number
     * @param {number} numberB second number
     * @returns +1 if greater then, -1 if less then, 0 if equal
     */
    compareNumbers: function (numberA, numberB) {
      if (numberA < numberB) {
        return -1
      }
      if (numberA > numberB) {
        return +1
      }
      return 0
    },

    /**
     * Convert duration in human readable format
     * @param {int} duration duration of someting in seconds
     * @returns {string} human readable format
     */
    workingTimeToHumanReadable: function (duration) {
      const days = (duration >= (60 * 60 * 24)) ? Math.trunc(duration / (60 * 60 * 24)) : 0
      duration = duration - 60 * 60 * 24 * days
      const hours = (duration >= (60 * 60)) ? Math.trunc(duration / (60 * 60)) : 0
      duration = duration - 60 * 60 * hours
      const minutes = (duration >= 60) ? Math.trunc(duration / 60) : 0
      duration = duration - 60 * minutes
      const seconds = duration

      const text = '' +
                ((days > 0) ? days + 'd' : '') +
                ((hours > 0) ? hours + 'h' : '') +
                ((minutes > 0) ? minutes + 'm' : '') +
                ((seconds > 0) ? seconds + 's' : '')
      return text.trim()
    }
  }
}
