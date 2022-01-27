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
/* global $ tasksCrudMixin tasksToolsMixin tasksWorkingTimeMixin */

const tasksManagerApp = {
  mixins: [tasksToolsMixin, tasksCrudMixin, tasksWorkingTimeMixin],
  data: function () {
    return {
      model: {
        priorityMap: { 1: 'Very High', 2: 'High', 3: 'Normal', 4: 'Low', 5: 'Very Low' },
        complexityMap: { 1: 'Very Complex', 2: 'Complex', 3: 'Moderate', 4: 'Easy', 5: 'Very Easy' },
        newTask: { id: '', title: '', description: '', done: false, priority: 3, complexity: 3, workingTimes: [] },
        editTask: { id: '', title: '', description: '', done: false, created: null, changed: null, priority: 3, complexity: 3, workingTimes: [], tags: [] },
        workingTime: '',
        currentTag: ''
      },
      options: { showDoneTasks: false },
      workingTimer: {
        enabled: false,
        start: null, // will be a valid start date
        taskId: '', // will be set by clicking on the clock icon at a specific task
        humanReadable: '' // will be adjusted via interval timer
      },
      tasks: [],
      searchText: ''
    }
  },

  created: function () {
    // get all tasks from the REST service
    this.getTasks()
  },

  methods: {
    editTaskUI: function (task) {
      // the dialog popup itself is handled via bootstrap
      this.model.editTask = this.cloneTask(task)
      this.model.workingTime = ''
      // activate first tab
      $('button[data-bs-target="#edit-task-main"]').click()
    },

    updateTaskUI: function () {
      const workingTime = this.workingTimeFromHumanReadable(this.model.workingTime)

      if (workingTime > 0) {
        this.model.editTask.workingTimes.push({
          created: new Date(),
          workingTime: workingTime
        })
      }

      console.log(JSON.stringify(this.model.editTask))
      this.updateTask(this.model.editTask)
    },

    addTag: function () {
      if (this.model.editTask.tags.indexOf(this.model.currentTag.toLowerCase()) < 0) {
        this.model.editTask.tags.push(this.model.currentTag.toLowerCase())
        this.model.currentTag = ''
      }
    },

    deleteTag: function (tag) {
      const index = this.model.editTask.tags.indexOf(tag)
      if (index >= 0) {
        this.model.editTask.tags.splice(index, 1)
      }
    },

    toggleWorkingTimer: function (id) {
      if (this.workingTimer.enabled) {
        this.workingTimer.enabled = false
        // add working time to task
        const workingTime = Math.trunc((new Date() - this.workingTimer.start) / 1000)
        const index = this.tasks.findIndex(entry => entry.id === this.workingTimer.taskId)
        const clonedTask = this.cloneTask(this.tasks[index])
        clonedTask.workingTimes.push({ created: new Date(), workingTime: workingTime })
        this.updateTask(clonedTask)
      } else {
        this.workingTimer = { enabled: true, start: new Date(), taskId: id, humanReadable: '' }

        setInterval(() => {
          this.workingTimer.humanReadable = this.workingTimeToHumanReadable(
            Math.trunc((new Date() - this.workingTimer.start) / 1000))
        }, 1000)
      }
    },

    deleteWorkingTime: function (workingTimeEntry) {
      const index = this.model.editTask.workingTimes.findIndex(entry =>
        entry.workingTime === workingTimeEntry.workingTime && entry.created === workingTimeEntry.created)
      this.model.editTask.workingTimes.splice(index, 1)
    },

    sortedTasks: function () {
      return this.tasks.sort((taskA, taskB) => {
        if (taskA.done && !taskB.done) {
          return +1
        }
        if (!taskA.done && taskB.done) {
          return -1
        }

        let diff = this.compareNumbers(taskA.priority, taskB.priority)
        if (diff === 0) {
          diff = taskA.title.localeCompare(taskB.title)
        }

        return diff
      })
    }
  },

  computed: {
    filteredTasks: function () {
      return this.sortedTasks().filter(task => {
        const theSearchText = this.searchText.toLowerCase()

        if (!this.options.showDoneTasks && task.done) {
          return false
        }

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
app.mount('#application')
