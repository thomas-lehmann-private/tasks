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
/* global $ localStorage */

const tasksEditMixin = { // eslint-disable-line
  data: function () {
    return {
      editModel: {
        task: { id: '', title: '', description: '', done: false, created: null, changed: null, priority: 3, complexity: 3, workingTimes: [], tags: [] },
        workingTime: '',
        currentTag: ''
      },
      workingTimer: {
        enabled: false, // when true the working time is active
        start: null, // will be a valid start date
        taskId: '', // will be set by clicking on the clock icon at a specific task
        humanReadable: '' // will be adjusted via interval timer
      },
      deleteModel: {
        task: { task: { id: '', title: '' } }
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
    editTaskUI: function (task) {
      // the dialog popup itself is handled via bootstrap
      this.editModel.task = this.cloneTask(task)
      this.editModel.workingTime = ''
      // activate first tab
      $('button[data-bs-target="#edit-task-main"]').click()
    },

    updateTaskUI: function () {
      const workingTime = this.workingTimeFromHumanReadable(this.editModel.workingTime)

      if (workingTime > 0) {
        this.editModel.task.workingTimes.push({
          created: new Date(),
          workingTime: workingTime
        })
      }

      this.updateTask(this.editModel.task)
    },

    deleteTaskUI: function (id) {
      const index = this.tasks.findIndex(task => task.id === id)
      this.deleteModel.task = this.tasks[index]
    },

    /**
     * Adding a tag while being in the edit dialog.
     */
    addTag: function () {
      if (this.editModel.task.tags.indexOf(this.editModel.currentTag.toLowerCase()) < 0) {
        this.editModel.task.tags.push(this.editModel.currentTag.toLowerCase())
        this.editModel.currentTag = ''
      }
    },

    /**
     * Deleting a tag while being in the edit dialog.
     */
    deleteTag: function (tag) {
      const index = this.editModel.task.tags.indexOf(tag)
      if (index >= 0) {
        this.editModel.task.tags.splice(index, 1)
      }
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
    },

    deleteWorkingTime: function (workingTimeEntry) {
      const index = this.editModel.task.workingTimes.findIndex(entry =>
        entry.workingTime === workingTimeEntry.workingTime && entry.created === workingTimeEntry.created)
      this.editModel.task.workingTimes.splice(index, 1)
    }
  },

  computed: {
    getAllTags: function () {
      const allTags = new Set()
      for (let iTask = 0; iTask < this.tasks.length; ++iTask) {
        if (this.tasks[iTask].tags) {
          for (let iTag = 0; iTag < this.tasks[iTask].tags.length; ++iTag) {
            allTags.add(this.tasks[iTask].tags[iTag])
          }
        }
      }
      return allTags
    }
  }
}
