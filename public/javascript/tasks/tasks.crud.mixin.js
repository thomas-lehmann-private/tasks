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
/* global $ */

const tasksCrudMixin = { // eslint-disable-line
  methods: {
    /**
     * Cloning a task.
     *
     * @param {object} task the task to clone.
     * @returns cloned task.
     */
    cloneTask: function (task) {
      return {
        id: task.id,
        title: task.title,
        description: task.description,
        created: task.created,
        changed: task.changed,
        done: task.done,
        priority: task.priority,
        complexity: task.complexity,
        workingTime: task.workingTime
      }
    },

    /**
     * Adding a new task posting data to the REST service.
     * On success the data is appended to the array.
     */
    addTask: function () {
      $.ajax('/task', {
        data: JSON.stringify(this.model.newTask),
        contentType: 'application/json',
        type: 'POST',
        success: (data) => {
          this.tasks.push(data)
        }
      })

      this.model.newTask.title = ''
      this.model.newTask.description = ''
    },

    deleteTask: function (id) {
      const self = this

      console.log('Trying to delete task with id ' + id)

      $.ajax('/task?id=' + id, {
        type: 'DELETE',
        success: () => {
          const iTask = self.tasks.findIndex(entry => entry.id === id)
          self.tasks.splice(iTask, 1)
        }
      })
    },

    /**
     * Changing an existing task sending the change to the REST service.
     * On success the relating array item will be updated.
     *
     * @param {object} task the task with the changes.
     */
    updateTask: function (task) {
      const self = this

      $.ajax('/task', {
        data: JSON.stringify(task),
        contentType: 'application/json',
        type: 'POST',
        success: (data) => {
          const index = self.tasks.findIndex(entry => entry.id === task.id)
          self.tasks[index] = data
        }
      })
    },

    /**
     * Toogle done state of task (finally an 'updateTask' call).
     *
     * @param {*} task the task to change done state for.
     */
    toggleDone: function (task) {
      const clonedTask = this.cloneTask(task)
      clonedTask.done = !clonedTask.done
      this.updateTask(clonedTask)
    },

    /**
     * Get (read) all task from the REST service.
     */
    getTasks: function () {
      const self = this
      $.getJSON('/task', function (data) {
        self.tasks = data
      })
    }
  }
}
