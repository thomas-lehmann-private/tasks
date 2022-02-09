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
  data: function () {
    return {
      searchText: '',
      customFilter: this.getNotDoneTasks()
    }
  },

  methods: {
    /**
     * Create filter object with name and filter function.
     *
     * @param {string} name name of filter
     * @param {function} filterFunction filter function for tasks
     * @returns {object} custom filter
     */
    createCustomFilter: function (name, filterFunction) {
      return { name: name, filterFunction: filterFunction }
    },

    /*
     * Default filter that does always apply.
     *
     * @returns array of filtered tasks.
     */
    getFilteredTasks: function (tasks) {
      return tasks.filter(task => {
        const theSearchText = this.searchText.toLowerCase()

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
     * @returns {object} filter for all tasks.
     */
    getAllTasks: function () {
      return this.createCustomFilter('All', (tasks) => tasks)
    },

    /**
     * Get all task that have been created today.
     *
     * @returns {object} filter that provide tasks that have been created today.
     */
    getTasksCreatedToday: function () {
      const self = this
      return this.createCustomFilter(
        'Created Today', (tasks) => tasks.filter(task => self.isToday(new Date(task.created))))
    },

    /**
     * Get all task that are done.
     *
     * @returns {object} filter that provide tasks that are done.
     */
    getDoneTasks: function () {
      return this.createCustomFilter('Done', (tasks) => tasks.filter(task => task.done))
    },

    /**
     * Get all task that are not done.
     *
     * @returns {object} filter that provide tasks that are not done.
     */
    getNotDoneTasks: function () {
      return this.createCustomFilter('Not Done', (tasks) => tasks.filter(task => !task.done))
    },

    /**
     * Count the tasks which contain the given tag.
     *
     * @param {*} strTag tag to search for.
     * @returns number of tasks containing given tag.
     */
    countTasksForTag: function (strTag) {
      return this.tasks.filter(task => task.tags && task.tags.indexOf(strTag) >= 0).length
    },

    /**
     * Get tasks filtered by tag.
     *
     * @param {string} tag tag to use for filtering tasks.
     * @returns {object} filter for providing filtered tasks by given tag.
     */
    getTasksForTag: function (tag) {
      return this.createCustomFilter(
        "Tag '" + tag + "'", (tasks) => tasks.filter(task => task.tags && task.tags.indexOf(tag) >= 0))
    }
  },

  computed: {
    /**
     * Get all tags from any task.
     *
     * @returns array of all tags
     */
    getAllTags: function () {
      const allTags = new Set()
      for (let iTask = 0; iTask < this.tasks.length; ++iTask) {
        if (this.tasks[iTask].tags) {
          for (let iTag = 0; iTag < this.tasks[iTask].tags.length; ++iTag) {
            allTags.add(this.tasks[iTask].tags[iTag])
          }
        }
      }
      return Array.from(allTags).sort()
    }
  }
}
