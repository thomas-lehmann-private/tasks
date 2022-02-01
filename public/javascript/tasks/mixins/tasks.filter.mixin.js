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

const TasksFilterMixin = { // eslint-disable-line
  methods: {
    /*
     * Default filter that does always apply.
     *
     * @returns array of filtered tasks.
     */
    getFilteredTasks: function (tasks) {
      return tasks.filter(task => {
        const theSearchText = this.searchText.toLowerCase()

        if (!this.options.showDoneTasks && task.done) {
          return false
        }

        const match = theSearchText.match(/tag:(.*)/)
        if (match !== null) {
          const tag = match[1]
          return task.tags && task.tags.indexOf(tag) >= 0
        }

        if (task.title.toLowerCase().indexOf(theSearchText) >= 0) {
          return true
        }
        if (task.description.toLowerCase().indexOf(theSearchText) >= 0) {
          return true
        }

        return false
      })
    },

    /**
     * Default sorted and filtered tasks are passed through.
     *
     * @param {array} tasks all tasks filtered by search text and options.
     * @returns {array} filtered tasks.
     */
    getAllTasks: function (tasks) {
      return tasks
    },

    /**
     * Get all task that have been created today.
     *
     * @param {array} tasks all tasks filtered by search text and options.
     * @returns {array} tasks that have been created today.
     */
    getTasksCreatedToday: function (tasks) {
      const self = this
      return tasks.filter(task => self.isToday(new Date(task.created)))
    },

    /**
     * Get all task that are done.
     *
     * @param {array} tasks all tasks filtered by search text and options.
     * @returns {array} tasks that are done.
     */
    getDoneTasks: function (tasks) {
      return tasks.filter(task => task.done)
    },

    /**
     * Get all task that are not done.
     *
     * @param {array} tasks all tasks filtered by search text and options.
     * @returns {array} tasks that are not done.
     */
    getNotDoneTasks: function (tasks) {
      return tasks.filter(task => !task.done)
    },

    getCustomFilterName: function (customFilter) {
      if (customFilter === this.getNotDoneTasks) {
        return 'Not Done'
      } else if (customFilter === this.getDoneTasks) {
        return 'Done'
      } else if (customFilter === this.getTasksCreatedToday) {
        return 'Created Today'
      } else if (customFilter === this.getAllTasks) {
        return 'All'
      }

      return 'unknown'
    }
  }
}
