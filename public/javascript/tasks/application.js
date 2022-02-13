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

/* global $ TasksModelMixin TasksCrudMixin TasksToolsMixin TasksWorkingTimeMixin
   TagComponent AttributeComponent TasksEditMixin PriorityComponent
   localStorage ComplexityComponent YesNoDialogComponent MarkdownComponent
   TasksFilterMixin EditableTagsComponent TaskDialogComponent */

$(document).on('shown.bs.modal', '.modal', function () {
  $(this).find('[autofocus]').focus()
})

const TasksManagerApp = {
  // registered mixins
  mixins: [TasksModelMixin, TasksToolsMixin, TasksCrudMixin, TasksWorkingTimeMixin,
    TasksEditMixin, TasksFilterMixin],

  created: function () {
    // get all tasks from the REST service
    this.getTasks()
    this.getAbout()

    if (localStorage.searchText) {
      this.searchText = localStorage.searchText
    }
  },

  watch: {
    searchText: function (newValue) {
      localStorage.searchText = newValue
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
    },

    /**
     * Get color for task depending on tags.
     * @param {object} task the task with eventually containing tags.
     * @returns color for task as a class.
     */
    getTaskColor: function (task) {
      if (task.tags) {
        if (task.tags.indexOf('feature') >= 0) {
          return 'bg-success'
        } else if (task.tags.indexOf('bug') >= 0) {
          return 'bg-danger'
        }

        return 'bg-light'
      }
    }
  },

  computed: {
    filteredTasks: function () {
      return this.customFilter.filterFunction(this.getFilteredTasks(this.sortedTasks()))
    }
  }
}

const app = Vue.createApp(TasksManagerApp) // eslint-disable-line
app.component('markdown', MarkdownComponent)
app.component('tag', TagComponent)
app.component('attribute', AttributeComponent)
app.component('priority', PriorityComponent)
app.component('complexity', ComplexityComponent)
app.component('yesNoDialog', YesNoDialogComponent)
app.component('editableTags', EditableTagsComponent)
app.component('taskDialog', TaskDialogComponent)
app.mount('#application')
