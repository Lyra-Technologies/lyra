import React from 'react';
import { Component } from 'react';
import * as d3 from 'd3';

const buildTree = (treeData, collapseArray = null) => {
  if (!collapseArray) {
    // Set the dimensions and margins of the diagram
    var margin = { top: 20, right: 90, bottom: 30, left: 90 },
      width = window.innerWidth - margin.left - margin.right,
      height = window.innerHeight - margin.top - margin.bottom;

    // append the svg object to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var svg = d3
      .select('#svg')
      .append('svg')
      .attr('width', width + margin.right + margin.left)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    var i = 0,
      duration = 750,
      root;

    // declares a tree layout and assigns the size
    var treemap = d3.tree().size([height, width]);

    // Assigns parent, children, height, depth
    root = d3.hierarchy(treeData, function(d) {
      return d.children;
    });
    root.x0 = height / 2;
    root.y0 = 0;

    // Collapse after the second level
    root.children.forEach(collapse);

    update(root);
  }
  // collapses the nodes on the array
  else {
  }
  // Collapse the node and all it's children
  function collapse(d) {
    if (d.children) {
      d._children = d.children;
      d._children.forEach(collapse);
      d.children = null;
    }
  }

  function update(source) {
    // Assigns the x and y position for the nodes
    var treeData = treemap(root);

    // Compute the new tree layout.
    var nodes = treeData.descendants(),
      links = treeData.descendants().slice(1);

    // Normalize for fixed-depth.
    nodes.forEach(function(d) {
      d.y = d.depth * 180;
    });

    // ****************** Nodes section ***************************

    // Update the nodes...
    var node = svg.selectAll('g.node').data(nodes, function(d) {
      return d.id || (d.id = ++i);
    });

    // Enter any new modes at the parent's previous position.
    var nodeEnter = node
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', function(d) {
        return `translate(${source.y0},${source.x0})`;
      })
      .on('click', handleClick)
      .on('mouseover', handleMouseOver)
      .on('mouseout', handleMouseOut);

    // Add Circle for the nodes
    nodeEnter
      .append('circle')
      .attr('class', 'node')
      .attr('r', 1e-6)
      .style('fill', function(d) {
        return d._children ? '280B9F' : '2A45A6';
      });

    // Add labels for the nodes
    nodeEnter
      .append('text')
      .attr('dy', '.35em')
      .attr('x', function(d) {
        return d.children || d._children ? -13 : 13;
      })
      .attr('text-anchor', function(d) {
        return d.children || d._children ? 'end' : 'start';
      })
      .text(function(d) {
        return d.data.name;
      })
      .attr('cursor', 'pointer');

    // UPDATE
    var nodeUpdate = nodeEnter.merge(node);

    // Transition to the proper position for the node
    nodeUpdate
      .transition()
      .duration(duration)
      .attr('transform', function(d) {
        return 'translate(' + d.y + ',' + d.x + ')';
      });

    // Update the node attributes and style
    nodeUpdate
      .select('circle.node')
      .attr('r', 5)
      .style('fill', function(d) {
        return d._children ? '280B9F' : '2A45A6';
      })
      .style('stroke', 'gray')
      .attr('cursor', 'pointer');

    // Remove any exiting nodes
    var nodeExit = node
      .exit()
      .transition()
      .duration(duration)
      .attr('transform', function(d) {
        return 'translate(' + source.y + ',' + source.x + ')';
      })
      .remove();

    // On exit reduce the node circles size to 0
    nodeExit.select('circle').attr('r', 1e-6);

    // On exit reduce the opacity of text labels
    nodeExit.select('text').style('fill-opacity', 1e-6);

    // ****************** links section ***************************

    // Update the links...
    var link = svg.selectAll('path.link').data(links, function(d) {
      return d.id;
    });

    // Enter any new links at the parent's previous position.
    var linkEnter = link
      .enter()
      .insert('path', 'g')
      .attr('class', 'link')
      .attr('d', function(d) {
        var o = { x: source.x0, y: source.y0 };
        return diagonal(o, o);
      })
      .style('opacity', 0.2)
      .style('fill', '#ffffff')
      .style('stroke', 'E534AB')
      .style('stroke-width', '4px');

    // UPDATE
    var linkUpdate = linkEnter.merge(link);

    // Transition back to the parent element position
    linkUpdate
      .transition()
      .duration(duration)
      .attr('d', function(d) {
        return diagonal(d, d.parent);
      })
      .style('opacity', 0.2)
      .style('fill', '#ffffff')
      .style('stroke', 'E534AB');

    // Remove any exiting links
    var linkExit = link
      .exit()
      .transition()
      .duration(duration)
      .attr('d', function(d) {
        var o = { x: source.x, y: source.y };
        return diagonal(o, o);
      })
      .style('opacity', 0.2)
      .style('fill', '#ffffff')
      .style('stroke', 'red')
      .remove();

    // Store the old positions for transition.
    nodes.forEach(function(d) {
      d.x0 = d.x;
      d.y0 = d.y;
    });

    // Creates a curved (diagonal) path from parent to the child nodes
    function diagonal(s, d) {
      let path = `M ${s.y} ${s.x}
            C ${(s.y + d.y) / 2} ${s.x},
              ${(s.y + d.y) / 2} ${d.x},
              ${d.y} ${d.x}`;

      return path;
    }

    // Toggle children on click.
    function handleClick(d) {
      if (d.children) {
        d._children = d.children;
        d.children = null;
      } else {
        d.children = d._children;
        d._children = null;
      }
      update(d);
    }

    // grow when mouse hovers
    function handleMouseOver(d) {
      let circles = document.querySelectorAll('circle');
      for (let circle of circles) {
        if (d.x === circle.__data__.x && d.y === circle.__data__.y) {
          circle.__data__.oldColor = circle.style.fill;
          circle.setAttribute(
            'style',
            'transition: 0.3s; fill: #E534AB; stroke: gray; r: 7',
          );
          circle.__data__.oldFontSize = circle.parentNode.querySelector(
            'text',
          ).style.fontSize;
          circle.nextSibling.setAttribute(
            'style',
            `transition: 0.3s;
            color: #E534AB;
            font-size: 18px;
            font-weight: bold`,
          );
        }
      }
    }

    // shrink back when mouse is out
    function handleMouseOut(d) {
      let circles = document.querySelectorAll('circle');
      for (let circle of circles) {
        if (d.x === circle.__data__.x && d.y === circle.__data__.y) {
          circle.setAttribute(
            'style',
            `transition: 0.3s; 
            fill: ${circle.__data__.oldColor};
            stroke: gray; r: 5`,
          );
          circle.nextSibling.setAttribute(
            'style',
            `transition: 0.3s; 
            color: black; 
            font-size: ${circle.__data__.oldFontSize}; 
            font-weight: normal`,
          );
        }
      }
    }
  }
};

class Tree extends Component {
  constructor() {
    super();
  }

  componentDidMount() {
    buildTree(this.props.treeData);
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return <div id="svg"> </div>;
  }
}

export default Tree;
