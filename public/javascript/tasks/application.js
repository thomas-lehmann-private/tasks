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

/* global TasksCrudMixin TasksToolsMixin TasksWorkingTimeMixin
   TagComponent AttributeComponent TasksEditMixin PriorityComponent
   localStorage ComplexityComponent YesNoDialogComponent MarkdownComponent
   TasksFilterMixin */

const TasksManagerApp = {
  // registered mixins
  mixins: [TasksToolsMixin, TasksCrudMixin, TasksWorkingTimeMixin,
    TasksEditMixin, TasksFilterMixin],

  // registered components
  components: {
    tag: TagComponent,
    attribute: AttributeComponent,
    priority: PriorityComponent,
    complexity: ComplexityComponent,
    yesNoDialog: YesNoDialogComponent,
    markdown: MarkdownComponent
  },

  data: function () {
    return {
      model: {
        priorityMap: { 1: 'Very High', 2: 'High', 3: 'Normal', 4: 'Low', 5: 'Very Low' },
        complexityMap: { 1: 'Very Complex', 2: 'Complex', 3: 'Moderate', 4: 'Easy', 5: 'Very Easy' },
        newTask: { id: '', title: '', description: '', done: false, priority: 3, complexity: 3, workingTimes: [] }
      },
      options: { showDoneTasks: false },
      tasks: [],
      searchText: '',
      customFilter: (tasks) => tasks
    }
  },

  created: function () {
    // get all tasks from the REST service
    this.getTasks()

    if (localStorage.searchText) {
      this.searchText = localStorage.searchText
    }

    if (localStorage.showDoneTasks) {
      this.options.showDoneTasks = (localStorage.showDoneTasks === 'true')
    }
  },

  watch: {
    searchText: function (newValue) {
      localStorage.searchText = newValue
    },

    'options.showDoneTasks': function (newValue) {
      localStorage.showDoneTasks = newValue ? 'true' : 'false'
    }
  },

  methods: {

    percentageDone: function (task) {
      let percentage = 0.0

      if (task.done) {
        percentage = 100.0
      } else {
        if (task.subtasks && task.subtasks.length > 0) {
          const doneTasks = task.subtasks.filter(entry => entry.done)
          percentage = doneTasks.length * 100.0 / task.subtasks.length
        }
      }

      return Number(percentage).toFixed(1)
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
      return this.customFilter(this.getFilteredTasks(this.sortedTasks()))
    }
  }
}

const app = Vue.createApp(TasksManagerApp) // eslint-disable-line
app.mount('#application')
