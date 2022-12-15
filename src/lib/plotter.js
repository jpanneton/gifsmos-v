// The MIT License (MIT)
// 
// Copyright (c) 2015 angus croll
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

import * as d3 from 'd3';

// Based on https://github.com/angus-c/react-function-plot
export default class Plotter {
  constructor({ selector = 'body', thickness = 4 }) {
    Object.assign(this, { selector, thickness });
  }

  addPath(fn) {
    this.d3Container = d3.select(this.selector);
    
    // Render in a square SVG, adjust margins to center
    const width = this.d3Container.node().getBoundingClientRect().width;
    const height = this.d3Container.node().getBoundingClientRect().height;
    const marginOffset = Math.abs((width - height) / 2);
    const marginToAdjust =  width > height ? 'margin-left' : 'margin-top';
    this.size = Math.min(width, height);

    const { size, thickness } = this;

    const svgContainer =
      this.d3Container
        .append('svg')
        .attr('width', size)
        .attr('height', size)
        .attr('style', `${marginToAdjust}: ${marginOffset}px`)

    svgContainer.append('path')
      .attr('d', this.getLineFunction(fn)([...new Array(Math.round(size))].map((_, i) => i)))
      .attr('stroke', 'white')
      .attr('stroke-width', thickness)
      .attr('fill', 'none');
  }

  updatePath(fn) {
    const { size } = this;
    const svgContainer = this.d3Container;

    svgContainer.select('path')
      .attr('d', this.getLineFunction(fn)([...new Array(Math.round(size))].map((_, i) => i)))
  }
  
  getLineFunction(fn) {
    const { size, thickness } = this;
    return d3.line()
      .x(i => i)
      .y(i => size - thickness / 2 - size * fn(i / size) * (1 - thickness / size));
  }
}
