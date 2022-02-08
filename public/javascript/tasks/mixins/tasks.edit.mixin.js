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
/* global $ localStorage */

const TasksEditMixin = { // eslint-disable-line
  data: function () {
    return {
      workingTimer: {
        enabled: false, // when true the working time is active
        start: null, // will be a valid start date
        taskId: '', // will be set by clicking on the clock icon at a specific task
        humanReadable: '' // will be adjusted via interval timer
      },
      about: {
        repository: {
          url: ''
        }
      }
    }
  },

  created: function () {
    if (localStorage.workingTimer) {
      this.workingTimer = JSON.parse(localStorage.workingTimer)
      // date is serialized as string and won't be a date when deserialized
      this.workingTimer.start = new Date(this.workingTimer.start)

      if (this.workingTimer.enabled) {
        const self = this
        setInterval(() => {
          self.workingTimer.humanReadable = self.workingTimeToHumanReadable(
            Math.trunc((new Date() - self.workingTimer.start) / 1000))
        }, 1000)
      }
    }
  },

  watch: {
    workingTimer (newValue) {
      localStorage.workingTimer = JSON.stringify(newValue)
    }
  },

  methods: {
    // because the one dialog can handle both it is decided by a given id.
    createOrUpdateTask: function () {
      if (this.model.task.id.length > 0) {
        this.updateTaskUI(this.model)
      } else {
        this.addTaskUI(this.model)
      }
    },

    createTaskUI: function () {
      // the dialog popup itself is handled via bootstrap
      this.model.task = {
        id: '',
        title: '',
        description: '',
        done: false,
        priority: 3,
        complexity: 3,
        workingTimes: [],
        tags: []
      }
    },

    editTaskUI: function (task) {
      // the dialog popup itself is handled via bootstrap
      this.model.task = this.cloneTask(task)
      this.model.workingTime = ''

      // activate first tab
      $('button[data-bs-target="#task-main"]').click()
    },

    addTaskUI: function (model) {
      this.addTask(model.task)
    },

    addSubtaskUI: function (task) {
      // the dialog popup itself is handled via bootstrap
      this.model.task = this.cloneTask(task)
      this.model.subtask = { title: '', index: -1 }
      this.model.workingTime = ''
    },

    editSubtaskUI: function (task, index) {
      // the dialog popup itself is handled via bootstrap
      this.model.task = this.cloneTask(task)
      this.model.subtask = { title: task.subtasks[index].title, index: index }
      this.model.workingTime = ''
    },

    deleteSubtaskUI: function (task, index) {
      // the dialog popup itself is handled via bootstrap
      this.model.task = this.cloneTask(task)
      this.model.subtask = { title: task.subtasks[index].title, index: index }
    },

    updateTaskUI: function (model) {
      const workingTime = this.workingTimeFromHumanReadable(model.workingTime)
      const now = new Date()

      if (workingTime > 0) {
        model.task.workingTimes.push({
          created: now,
          workingTime: workingTime
        })
      }

      if (model.subtask.title.length > 0) {
        if (model.subtask.index < 0) {
          if (!model.task.subtasks) {
            model.task.subtasks = []
          }

          model.task.subtasks.push({
            title: model.subtask.title,
            created: now,
            changed: now,
            done: false
          })
        } else {
          model.task.subtasks[model.subtask.index].title = model.subtask.title
          model.task.subtasks[model.subtask.index].changed = now
        }
        model.subtask = { title: '', index: -1 }
      }

      this.updateTask(model.task)
    },

    deleteTaskUI: function (id) {
      const index = this.tasks.findIndex(task => task.id === id)
      this.model.task = this.tasks[index]
    },

    toggleWorkingTimer: function (id) {
      if (this.workingTimer.enabled) {
        // add working time to task
        const workingTime = Math.trunc((new Date() - this.workingTimer.start) / 1000)
        const index = this.tasks.findIndex(entry => entry.id === this.workingTimer.taskId)
        const clonedTask = this.cloneTask(this.tasks[index])
        clonedTask.workingTimes.push({ created: new Date(), workingTime: workingTime })
        this.updateTask(clonedTask)

        // disable it
        this.workingTimer = { enabled: false, start: new Date(), taskId: id, humanReadable: '' }
      } else {
        this.workingTimer = { enabled: true, start: new Date(), taskId: id, humanReadable: '' }

        const self = this
        setInterval(() => {
          self.workingTimer.humanReadable = self.workingTimeToHumanReadable(
            Math.trunc((new Date() - self.workingTimer.start) / 1000))
        }, 1000)
      }
    }
  }
}
