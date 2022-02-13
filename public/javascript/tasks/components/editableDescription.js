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

const EditableDescriptionComponent = { // eslint-disable-line
  props: ['modelValue'],
  emits: ['update:modelValue'],
  template: `
    <div>
        <label class="form-label fw-bold">Description</label>
        <ul class="nav nav-tabs">
            <li class="nav-item">
                <button class="nav-link active" type="button"
                        data-bs-toggle="tab" data-bs-target="#task-description-edit">Edit</button>
            </li>
            <li class="nav-item">
                <button class="nav-link" type="button"
                        data-bs-toggle="tab" data-bs-target="#task-description-preview">Preview</button>
            </li>
        </ul>

        <div class="tab-content">
            <div class="tab-pane fade show active border-left border-bottom border-right p-2" id="task-description-edit">
                <textarea class="form-control" type="text" rows=3 placeholder="Enter Description"
                       v-bind:value="modelValue"
                       v-on:input="$emit('update:modelValue', $event.target.value)"></textarea>
            </div>

            <div class="tab-pane border-left border-bottom border-right p-2" id="task-description-preview">
                <markdown v-bind:text="modelValue"></markdown>
            </div>
        </div>
    </div>
  `
}
