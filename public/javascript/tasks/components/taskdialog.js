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

/* global EditableTitleComponent EditableDescriptionComponent
          PriorityComponent ComplexityComponent EditableTagsComponent
          EditableWorkingtimeComponent
          TasksToolsMixin */

const TaskDialogComponent = { // eslint-disable-line
  components: {
    editableTitle: EditableTitleComponent,
    editableDescription: EditableDescriptionComponent,
    priority: PriorityComponent,
    complexity: ComplexityComponent,
    editableWorkingtime: EditableWorkingtimeComponent,
    editableTags: EditableTagsComponent
  },

  mixins: [TasksToolsMixin],

  props: ['id', 'model', 'tags'],
  emits: ['clickedSave', 'clickedCancel'],

  methods: {
    getDialogTitle: function (task) {
      return task.id.length > 0 ? 'Edit Task' : 'Create Task'
    },

    getButtonTitle: function (task) {
      return task.id.length > 0 ? 'Update Task' : 'Create Task'
    },

    deleteWorkingTime: function (task, workingTimeEntry) {
      const index = task.workingTimes.findIndex(entry =>
        entry.workingTime === workingTimeEntry.workingTime && entry.created === workingTimeEntry.created)
      task.workingTimes.splice(index, 1)
    }
  },

  template: `
    <div v-bind:id="id" class="modal" tabindex="-1">
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header text-white bg-dark">
                    <h5 class="modal-title">{{ getDialogTitle(model.task) }}</h5>
                    <small v-if="model.task.id.length > 0" class="ms-3">Id: {{model.task.id}}</small>
                    <button type="button" class="btn-close bg-light" data-bs-dismiss="modal"
                            v-on:click="$emit('clickedCancel')"></button>
                </div>

                <div class="modal-body">
                    <ul class="nav nav-tabs">
                        <li class="nav-item">
                            <button class="nav-link active" type="button"
                                    data-bs-toggle="tab" data-bs-target="#task-main">Main</button>
                        </li>
                        <li v-if="model.task.id.length > 0" class="nav-item">
                            <button class="nav-link" type="button"
                                    data-bs-toggle="tab" data-bs-target="#task-working-times">Working Times</button>
                        </li>
                    </ul>

                    <div class="tab-content">
                        <div class="tab-pane fade show active border-left border-bottom border-right p-2" id="task-main">
                            <editable-title class="mt-2" v-model="model.task.title"></editable-title>
                            <editable-description class="mt-2" v-model="model.task.description"></editable-description>
                            <priority class="mt-2" v-model="model.task.priority"></priority>
                            <complexity class="mt-2" v-model="model.task.complexity"></complexity>
                            <editable-workingtime class="mt-2" v-model="model.workingTime"></editable-workingtime>
                            <editable-tags class="mt-2"
                                        v-bind:task="model.task"
                                        v-bind:tags="tags.filter(entry => model.task.tags.indexOf(entry) &lt; 0).sort()">
                            </editable-tags>
                        </div>

                        <div class="tab-pane fade border-left border-bottom border-right p-2" id="task-working-times">
                            <table class="table table-striped">
                                <thead class="table-dark">
                                    <th>Working Time</th>
                                    <th>Created</th>
                                    <th></th>
                                </thead>
                                <tbody>
                                    <tr v-for="entry in model.task.workingTimes">
                                        <td>{{ workingTimeToHumanReadable(entry.workingTime) }}</td>
                                        <td>{{ entry.created }}</td>
                                        <td>
                                            <span class="bi-trash"
                                                  v-on:click="deleteWorkingTime(model.task, entry)"></span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal"
                            v-on:click="$emit('clickedCancel')">Cancel</button>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" 
                            v-on:click="$emit('clickedSave')">{{ getButtonTitle(model.task) }}</button>
                </div>
            </div>
        </div>
    </div>
  `
}
