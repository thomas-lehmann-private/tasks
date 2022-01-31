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

const ComplexityComponent = { // eslint-disable-line
  data: function () {
    return {
      complexityMap: { 1: 'Very Complex', 2: 'Complex', 3: 'Moderate', 4: 'Easy', 5: 'Very Easy' }
    }
  },

  props: ['modelValue'],
  emits: ['update:modelValue'],

  template: `
      <div>
          <label class="form-label fw-bold">Complexity</label>
          <select class="form-select" aria-label="Select Complexity"
                  v-bind:value="modelValue"
                  v-on:input="$emit('update:modelValue', $event.target.value)">
              <option value="1">{{ this.complexityMap[1]}}</option>
              <option value="2">{{ this.complexityMap[2]}}</option>
              <option value="3">{{ this.complexityMap[3]}}</option>
              <option value="4">{{ this.complexityMap[4]}}</option>
              <option value="5">{{ this.complexityMap[5]}}</option>
          </select>
      </div>
    `
}
