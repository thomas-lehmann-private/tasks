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
/* global $ */

const TasksCrudMixin = { // eslint-disable-line
  data: function () {
    return {
      tasks: [],
      about: {}
    }
  },

  methods: {
    /**
     * Cloning a task.
     *
     * @param {object} task the task to clone.
     * @returns cloned task.
     */
    cloneTask: function (task) {
      const workingTimes = []
      const tags = []
      const subtasks = []

      for (let iWorkingTime = 0; iWorkingTime < task.workingTimes.length; ++iWorkingTime) {
        workingTimes.push({
          created: task.workingTimes[iWorkingTime].created,
          workingTime: task.workingTimes[iWorkingTime].workingTime
        })
      }

      if (task.tags) {
        for (let iTag = 0; iTag < task.tags.length; ++iTag) {
          tags.push(task.tags[iTag])
        }
      }

      if (task.subtasks) {
        for (let iSubTask = 0; iSubTask < task.subtasks.length; ++iSubTask) {
          subtasks.push({
            created: task.subtasks[iSubTask].created,
            changed: task.subtasks[iSubTask].changed,
            title: task.subtasks[iSubTask].title,
            done: task.subtasks[iSubTask].done
          })
        }
      }

      return {
        id: task.id,
        title: task.title,
        description: task.description,
        created: task.created,
        changed: task.changed,
        done: task.done,
        priority: task.priority,
        complexity: task.complexity,
        workingTimes: workingTimes,
        tags: tags,
        subtasks: subtasks
      }
    },

    /**
     * Adding a new task posting data to the REST service.
     * On success the data is appended to the array.
     */
    addTask: function (task) {
      $.ajax('/task', {
        data: JSON.stringify(task),
        contentType: 'application/json',
        type: 'POST',
        success: (data) => {
          this.tasks.push(data)
        }
      })
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
     * @param {object} task the task to change done state for.
     */
    toggleDone: function (task) {
      const clonedTask = this.cloneTask(task)
      clonedTask.done = !clonedTask.done
      this.updateTask(clonedTask)
    },

    /**
     * Toogle done state of subtask (finally an 'updateTask' call).
     *
     * @param {object} task the task containing the relating subtask.
     * @param {int} index the index of the subtask
     */
    toggleSubtaskDone: function (task, index) {
      const clonedTask = this.cloneTask(task)
      clonedTask.subtasks[index].done = !clonedTask.subtasks[index].done
      this.updateTask(clonedTask)
    },

    /**
     * Delete subtask (finally an 'updateTask' call).
     *
     * @param {object} task the task containing the relating subtask.
     * @param {int} index the index of the subtask
     */
    deleteSubtask: function (task, index) {
      const clonedTask = this.cloneTask(task)
      clonedTask.subtasks.splice(index, 1)
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
    },

    /**
     * Get (read) about details from the REST service.
     */
    getAbout: function () {
      const self = this
      $.getJSON('/about', function (data) {
        self.about = data
      })
    }
  }
}
