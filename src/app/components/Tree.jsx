import React, { useEffect } from 'react';
import * as d3 from 'd3';

const buildTree = (treeData, isCollapsed = false, isSearching = false) => {
  const svgElement = document.querySelector('svg');
  // Set the dimensions and margins of the diagram
  if (svgElement) {
    console.log('svg element', svgElement);
    svgElement.remove();
  }

  const margin = { top: 20, right: 90, bottom: 30, left: 90 },
    width = 1200 - margin.left - margin.right,
    height = 1000 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  // appends a 'group' element to 'svg'
  // moves the 'group' element to the top left margin
  const svg = d3
    .select('#svg')
    .append('svg')
    .attr('width', width + margin.right + margin.left)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  let i = 0,
    duration = 750,
    root;

  // declares a tree layout and assigns the size
  const treemap = d3.tree().size([height, width]);

  // Assigns parent, children, height, depth
  root = d3.hierarchy(treeData, function(d) {
    return d.children;
  });
  root.x0 = height / 2;
  root.y0 = 0;

  // Collapse after the second level
  if (isCollapsed) root.children.forEach(collapse);

  update(root);

  // collapses the nodes on the array

  // Collapse the node and all it's children
  function collapse(d) {
    if (d.children) {
      d._children = d.children;
      d._children.forEach(collapse);
      d.children = null;
      console.log(d);
    }
  }

  function update(source) {
    // Assigns the x and y position for the nodes
    const treeData = treemap(root);
    let maxY = 0;
    let maxX = 0;

    // Compute the new tree layout.
    const nodes = treeData.descendants(),
      links = treeData.descendants().slice(1);

    // Normalize for fixed-depth and get maxWidth and maxHeight.
    nodes.forEach(d => {
      d.y = d.depth * 180;
      maxY = d.y > maxY ? d.y : maxY;
      maxX = d.x > maxY ? d.x : maxX;
    });

    document.querySelector('svg').style.width =
      (maxY + margin.right + margin.left).toString() + 'px';

    // ****************** Nodes section ***************************

    // Update the nodes...
    const node = svg.selectAll('g.node').data(nodes, d => {
      return d.id || (d.id = ++i);
    });

    // Enter any new modes at the parent's previous position.
    const nodeEnter = node
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', d => {
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
      .style('fill', '280B9F')
      .attr('opacity', d => {
        if (isSearching && !d.data.markedInSearch) {
          return 0.5;
        }
        return 1;
      });

    // Add labels for the nodes
    nodeEnter
      .append('text')
      .attr('dy', '.35em')
      .attr('x', d => {
        return d.children || d._children ? -13 : -13;
      })
      .attr('text-anchor', d => {
        return d.children || d._children ? 'end' : 'end';
      })
      .text(d => {
        return d.data.name;
      })
      .attr('style', d => {
        if (!isSearching) return `opacity: 1; font-weight: normal`;
        if (d.data.markedInSearch) return `opacity: 1; font-weight: bold`;
        return `opacity: 0.5; font-weight: normal`;
      })
      .attr('cursor', 'pointer');

    // UPDATE
    const nodeUpdate = nodeEnter.merge(node);

    // Transition to the proper position for the node
    nodeUpdate
      .transition()
      .duration(duration)
      .attr('transform', d => {
        return 'translate(' + d.y + ',' + d.x + ')';
      });

    // Update the node attributes and style
    nodeUpdate
      .select('circle.node')
      .attr('r', 5)
      .style('fill', '280B9F')
      .style('stroke', 'gray')
      .attr('cursor', 'pointer')
      .attr('opacity', d => {
        if (isSearching && !d.data.markedInSearch) {
          return 0.5;
        }
        return 1;
      });

    // Remove any exiting nodes
    const nodeExit = node
      .exit()
      .transition()
      .duration(duration)
      .attr('transform', d => {
        return 'translate(' + source.y + ',' + source.x + ')';
      })
      .remove();

    // On exit reduce the node circles size to 0
    nodeExit.select('circle').attr('r', 1e-6);

    // On exit reduce the opacity of text labels
    nodeExit.select('text').style('fill-opacity', 1e-6);

    // ****************** links section ***************************

    // Update the links...
    const link = svg.selectAll('path.link').data(links, d => {
      return d.id;
    });

    // Enter any new links at the parent's previous position.
    const linkEnter = link
      .enter()
      .insert('path', 'g')
      .attr('class', 'link')
      .attr('d', d => {
        const o = { x: source.x0, y: source.y0 };
        return diagonal(o, o);
      })
      .style('opacity', 0.2)
      .style('fill', '#ffffff')
      .style('stroke', 'E534AB')
      .style('stroke-width', '4px');

    // UPDATE
    const linkUpdate = linkEnter.merge(link);

    // Transition back to the parent element position
    linkUpdate
      .transition()
      .duration(duration)
      .attr('d', d => {
        return diagonal(d, d.parent);
      })
      .style('opacity', 0.2)
      .style('fill', '#ffffff')
      .style('stroke', 'E534AB');

    // Remove any exiting links
    const linkExit = link
      .exit()
      .transition()
      .duration(duration)
      .attr('d', d => {
        const o = { x: source.x, y: source.y };
        return diagonal(o, o);
      })
      .style('opacity', 0.2)
      .style('fill', '#ffffff')
      .style('stroke', 'red')
      .remove();

    // Store the old positions for transition.
    nodes.forEach(d => {
      d.x0 = d.x;
      d.y0 = d.y;
    });

    // resize the svg

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
          circle.__data__.oldOpacity = circle.style.opacity;
          circle.setAttribute(
            'style',
            `transition: 0.3s; 
            fill: #E534AB; 
            stroke: gray; 
            r: 7; 
            opacity: 1`
          );
          circle.__data__.oldFontSize = circle.parentNode.querySelector(
            'text'
          ).style.fontSize;
          circle.__data__.oldWeight = circle.parentNode.querySelector(
            'text'
          ).style.fontWeight;
          circle.__data__.oldOpacity = circle.parentNode.querySelector(
            'text'
          ).style.opacity;
          circle.nextSibling.setAttribute(
            'style',
            `transition: 0.3s;
            color: #E534AB;
            font-size: 18px;
            font-weight: bold;
            opacity: 1`
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
            opacity: ${circle.__data__.oldOpacity};
            stroke: gray; 
            r: 5;`
          );
          circle.nextSibling.setAttribute(
            'style',
            `transition: 0.3s; 
            color: black; 
            font-size: ${circle.__data__.oldFontSize}; 
            opacity: ${circle.__data__.oldOpacity};
            font-weight: ${circle.__data__.oldWeight};`
          );
        }
      }
    }
  }
};

const Tree = props => {
  useEffect(() => {
    buildTree(props.treeData, false, props.isSearching);
  });

  return <div id='svg' style={{ overflow: 'auto' }} />;
};

export default Tree;
