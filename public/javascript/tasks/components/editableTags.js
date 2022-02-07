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

const EditableTagsComponent = { // eslint-disable-line
  data: function () {
    return {
      currentTag: ''
    }
  },
  methods: {
    /**
     * Adding a tag while being in the edit dialog.
     */
    addTag: function (task) {
      if (this.currentTag.trim().length > 0) {
        if (task.tags.indexOf(this.currentTag) < 0) {
          // you cannot add 'bug' when 'feature' is already present and vice versa
          if (this.currentTag === 'bug' && task.tags.indexOf('feature') < 0) {
            task.tags.push(this.currentTag)
          } else if (this.currentTag === 'feature' && task.tags.indexOf('bug') < 0) {
            task.tags.push(this.currentTag)
          } else if (this.currentTag !== 'bug' && this.currentTag !== 'feature') {
            task.tags.push(this.currentTag)
          }
        }
      }
      this.currentTag = ''
    },

    /**
     * Deleting a tag while being in the edit dialog.
     */
    deleteTag: function (task, tag) {
      const index = task.tags.indexOf(tag)
      if (index >= 0) {
        task.tags.splice(index, 1)
      }
    }
  },
  props: ['task', 'tags'],
  template: `
    <div>
        <label class="form-label fw-bold">Tag</label>
        <div class="d-flex flex-row">
            <input class="form-control" type="text" placeholder="Enter a tag"
                   v-model="currentTag" list="all-tags">
            <button type="button" class="btn btn-success text-nowrap ms-2"
                    v-on:click="addTag(task)">Add</button>
            <datalist id="all-tags">
                <option v-for="tag in tags" v-bind:value="tag"></option>
            </datalist>
        </div>

        <div class="d-fley flex-row">
            <span v-for="tag in task.tags.sort()">
                <span class="badge bg-dark text-white ms-1">
                    {{ tag }}
                    <span class="bi-file-excel-fill ms-1" v-on:click="deleteTag(task, tag)"></span>
                </span>
            </span>
        </div>
    </div>
  `
}
