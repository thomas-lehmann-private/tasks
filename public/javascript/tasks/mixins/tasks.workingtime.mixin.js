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
const tasksWorkingTimeMixin = { // eslint-disable-line
  methods: {
    /**
     * Get working time (sum) for task human readable.
     *
     * @param {object} task any task obkject
     * @returns sum of working time human readable
     */
    getWorkingTimeForTask: function (task) {
      let sumWorkingTime = 0
      for (let iWorkingTime = 0; iWorkingTime < task.workingTimes.length; ++iWorkingTime) {
        sumWorkingTime += task.workingTimes[iWorkingTime].workingTime
      }
      return sumWorkingTime
    },

    /**
     * Get working time (sum) for task human readable.
     *
     * @param {object} task any task obkject
     * @returns sum of working time human readable
     */
    getWorkingTimeForTaskHumanReadable: function (task) {
      return this.workingTimeToHumanReadable(this.getWorkingTimeForTask(task))
    },

    /**
     * Get working tome for today in human readable format.
     *
     * @param tasks list of tasks.
     * @returns working time in human readable format.
     */
    getWorkingTimeForTodayHumanReadable: function (tasks) {
      let sumWorkingTime = 0
      for (let iTask = 0; iTask < tasks.length; ++iTask) {
        for (let iWorkingTime = 0; iWorkingTime < tasks[iTask].workingTimes.length; ++iWorkingTime) {
          if (this.isToday(new Date(tasks[iTask].workingTimes[iWorkingTime].created))) {
            sumWorkingTime += tasks[iTask].workingTimes[iWorkingTime].workingTime
          }
        }
      }
      return this.workingTimeToHumanReadable(sumWorkingTime)
    }

  }
}
