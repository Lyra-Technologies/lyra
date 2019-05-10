import React, { useEffect } from 'react';
import * as d3 from 'd3';
import { parse } from 'querystring';

const buildTree = (treeData, isCollapsed = false, isSearching = false) => {
  // Set the dimensions and margins of the diagram
  let temp = document.querySelectorAll('svg');
  if (temp.length) {
    temp.forEach(el => {
      el.remove();
    });
  }

  const margin = { top: 20, right: 90, bottom: 30, left: 90 },
    width = 1200 - margin.left - margin.right,
    height = 4000 - margin.top - margin.bottom;

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
      maxY = maxY > 600 ? maxY : 600;
      maxX = d.x > maxY ? d.x : maxX;
    });

    document.querySelector('svg').style.width =
      (maxY + margin.right + margin.left + 200).toString() + 'px';

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
        let length = d.data.name.length;
        if (length < 15) return d.data.name;
        else {
          return (
            d.data.name
              .split('')
              .slice(0, 13)
              .join('') + '...'
          );
        }
      })
      .attr('style', d => {
        if (!isSearching) return `opacity: 1; font-weight: normal`;
        if (d.data.markedInSearch) return `opacity: 1; font-weight: bold`;
        return `opacity: 0.5; font-weight: normal`;
      })
      .attr('cursor', 'pointer');

    nodeEnter
      .append('foreignObject')
      .attr('class', 'modeless-popup-show')
      .attr('dy', '.35em')
      .attr('x', 13)
      .attr('y', 13);

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
            opacity: 1`,
          );
          circle.__data__.oldFontSize = circle.parentNode.querySelector(
            'text',
          ).style.fontSize;
          circle.__data__.oldWeight = circle.parentNode.querySelector(
            'text',
          ).style.fontWeight;
          circle.__data__.oldOpacity = circle.parentNode.querySelector(
            'text',
          ).style.opacity;
          circle.nextSibling.setAttribute(
            'style',
            `transition: 0.3s;
            color: #E534AB;
            font-size: 18px;
            font-weight: bold;
            opacity: 1`,
          );
          let parentNode = circle.parentElement;
          let coordinates = parentNode.attributes.transform.value
            .replace(/(translate)|\(|\)/g, '')
            .split(',');
          console.log(coordinates);
          coordinates[0] = (parseInt(coordinates[0]) + 110).toString();
          coordinates[1] = (parseInt(coordinates[1]) - 30).toString();
          if (circle.__data__.data.value) {
            const dataProps = circle.__data__;
            dataProps.data.value =
              typeof dataProps.data.value === 'string'
                ? dataProps.data.value
                : dataProps.data.value.toString();
            const spanElement1 = document.createElement('span');
            const spanElement2 = document.createElement('span');
            const spanElement3 = document.createElement('span');
            const spanElement4 = document.createElement('span');
            const breakElement = document.createElement('br');
            let spanStyle =
              'color:#E534AB;font-size: 12px;font-weight: bold; padding-left: 10px; opacity: 1';
            let valueStyle =
              'color: #ffffff;font-size: 12px;font-weight: bold; padding-left: 10px; opacity: 1';
            let ns = 'http://www.w3.org/2000/svg';
            let divElement = document.createElement('div');
            let popupWidth =
              dataProps.data.name.length > dataProps.data.value.length
                ? dataProps.data.name.length
                : dataProps.data.value.length;
            popupWidth += 6;
            popupWidth *= 10;
            console.log(
              popupWidth,
              dataProps.data.name.length,
              dataProps.data.value.length,
            );
            foreignObject.setAttribute('width', popupWidth);
            foreignObject.setAttribute('height', 50);
            foreignObject.setAttribute('z-index', '998');
            // foreignObject.setAttribute('x', coordinates[0]);
            // foreignObject.setAttribute('y', coordinates[1]);
            // foreignObject.setAttribute('x', (d.y + 130).toString());
            // foreignObject.setAttribute('y', (d.x - 20).toString());
            document.querySelector('svg').appendChild(foreignObject);
            spanElement1.innerText = 'key: ';
            spanElement1.setAttribute('style', spanStyle);
            divElement.appendChild(spanElement1);
            spanElement2.innerHTML = dataProps.data.name;
            spanElement2.setAttribute('style', valueStyle);
            divElement.appendChild(spanElement2);
            divElement.appendChild(breakElement);
            spanElement3.innerText = 'value: ';
            spanElement3.setAttribute('style', spanStyle);
            divElement.appendChild(spanElement3);
            spanElement4.innerHTML = dataProps.data.value;
            spanElement4.setAttribute('style', valueStyle);
            divElement.appendChild(spanElement4);
            divElement.setAttribute(
              'style',
              `z-index: 999;
            height: 100%;
            width: 100%;
            background-color: black;
            opacity: 0.8;
            position: absolute;
            left: ${d.y};
            top: ${d.x};
            text-align: left;
            border-radius: 5px;
            `,
            );
            document.querySelector('foreignObject').appendChild(divElement);
            console.log(dataProps.data);
          }
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
            r: 5;`,
          );
          circle.nextSibling.setAttribute(
            'style',
            `transition: 0.3s; 
            color: black; 
            font-size: ${circle.__data__.oldFontSize}; 
            opacity: ${circle.__data__.oldOpacity};
            font-weight: ${circle.__data__.oldWeight};`,
          );
          let foreignObject = document.querySelector('foreignObject');
          let divElement = foreignObject.firstChild;
          divElement.remove();
          foreignObject.remove();
        }
      }
    }
  }
};

const Tree = props => {
  useEffect(() => {
    buildTree(props.treeData, false, props.isSearching);
  });

  return <div id="svg" style={{ overflow: 'auto' }} />;
};

export default Tree;
