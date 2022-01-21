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
/* global tasksCrudMixin */

const tasksManagerApp = {
  mixins: [tasksCrudMixin],
  data: function () {
    return {
      model: {
        newTask: { id: '', title: '', description: '', done: false },
        editTask: { id: '', title: '', description: '', done: false, created: null, changed: null }
      },
      tasks: [],
      searchText: ''
    }
  },

  created: function () {
    this.getTasks()
  },

  methods: {
    editTask: function (task) {
      this.model.editTask = this.cloneTask(task)
    },

    sortedTasks: function () {
      return this.tasks.sort((taskA, taskB) => {
        if (taskA.done && !taskB.done) {
          return +1
        }
        if (!taskA.done && taskB.done) {
          return -1
        }
        return taskA.title.localeCompare(taskB.title)
      })
    }
  },

  computed: {
    filteredTasks: function () {
      return this.sortedTasks().filter(task => {
        const theSearchText = this.searchText.toLowerCase()

        if (task.title.toLowerCase().indexOf(theSearchText) >= 0) {
          return true
        }
        if (task.description.toLowerCase().indexOf(theSearchText) >= 0) {
          return true
        }

        return false
      })
    }
  }
}

const app = Vue.createApp(tasksManagerApp) // eslint-disable-line
app.component('newTaskDialog', { template: '#new-task-dialog-template' })
app.mount('#application')
