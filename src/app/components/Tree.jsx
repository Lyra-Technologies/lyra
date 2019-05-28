import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';

const Tree = props => {
  const clickedLeaves = {};

  let treeStyles = {
    selectedCircle: `transition: 0.2s; fill: #E534AB; stroke: gray; r: 7;`,
    selectedText: `transition: 0.2s; color: #E534AB; font-size: 18px; font-weight: bold; pacity: 1;`,
    unselectedCircle: `transition: 0.2s; fill: #280B9F; stroke: gray; r: 5;`,
    unselectedText: `transition: 0.2s; color: black; font-size: 14px; opacity: 1; font-weight: normal;`,
  };

  useEffect(() => {
    buildTree(props.treeData, false, props.isSearching);
  });

  const buildTree = (treeData, isCollapsed = false, isSearching = false) => {
    // Set the dimensions and margins of the diagram
    let temp = document.querySelectorAll('svg');
    if (temp.length) {
      temp.forEach(el => {
        el.remove();
      });
    }

    const margin = { top: 20, right: 90, bottom: 30, left: 90 },
      width = 800 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

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

    // Assigns parent, children, height, depth
    root = d3.hierarchy(treeData, function(d) {
      return d.children;
    });
    root.x0 = height / 2;
    root.y0 = 0;

    // declares a tree layout and assigns the size
    const treemap = d3.tree().size([height, width]);

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

      // Compute the new tree layout.
      const nodes = treeData.descendants(),
        links = treeData.descendants().slice(1);
      // Normalize for fixed-depth and get maxWidth and maxHeight.
      nodes.forEach(d => {
        d.y = d.depth * 180;
      });

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
        .on('dblclick', handleLeafClick);

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
        });
      // .attr('cursor', 'pointer');

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

      // creates use tag in order to bring modeless popup to the front of the canvas
      if (!document.querySelectorAll('use').length) {
        d3.select('g')
          .append('use')
          .attr('xlink:href', '#selectedNode');
      }

      // resize svg and tree
      function recalculateSize() {
        let maxX = 0;
        let maxY = 0;
        let levelsObj = treeData.descendants().reduce((acc, cur) => {
          if (acc[cur.depth]) acc[cur.depth]++;
          else acc[cur.depth] = 1;
          maxY = maxY > cur.y ? maxY : cur.y;
          maxX = maxX > cur.x ? maxX : cur.x;
          return acc;
        }, {});
        if (maxX > 0) {
          let newHeight =
            Object.values(levelsObj).reduce((acc, cur) => {
              return acc >= cur ? acc : cur;
            }) * 20;
          treemap.size([newHeight, treeX]);
          let [treeY, treeX] = treemap.size();
          let svgElement = document.querySelector('svg');
          svgElement.setAttribute('height', treeY + 200);
          svgElement.setAttribute('width', treeX + 180);
          console.log(
            'tree size: ',
            treemap.size(),
            'maxX:',
            maxY,
            'maxX:',
            maxX,
          );
        }
      }

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
          recalculateSize();
          update(d);
        } else if (d._children) {
          d.children = d._children;
          d._children = null;
          recalculateSize();
          update(d);
        } else {
          handleLeafClick(d);
        }
      }

      // grow and display modeless popup when mouse click
      function handleLeafClick(d) {
        const circles = document.querySelectorAll('circle');
        let { id } = d;
        console.log(id, Object.keys(clickedLeaves));
        for (let key in clickedLeaves) {
          if (key !== id) {
            let selectedNode = document.querySelector('#selectedNode');
            selectedNode.firstChild.setAttribute(
              'style',
              treeStyles.unselectedCircle,
            );
            selectedNode.firstChild.nextSibling.setAttribute(
              'style',
              treeStyles.unselectedText,
            );
            selectedNode.setAttribute('id', '');
            delete clickedLeaves[key];
            d3.selectAll('.modeless-popup').remove();
          }
        }
        for (let circle of circles) {
          if (d.x === circle.__data__.x && d.y === circle.__data__.y) {
            console.log('leaves:', clickedLeaves);
            if (!d.hasOwnProperty('clicked') || !d.clicked) {
              d.clicked = true;
              clickedLeaves[id] = circle.parentNode;
              const text = clickedLeaves[id].querySelector('text');
              circle.setAttribute('style', treeStyles.selectedCircle);
              text.setAttribute('style', treeStyles.selectedText);
              if (circle.__data__.data.hasOwnProperty('value')) {
                clickedLeaves[id].setAttribute('id', 'selectedNode');
                const modelessPopup = d3.select('#selectedNode');
                modelessPopup
                  .append('rect')
                  .attr('class', 'modeless-popup')
                  .attr('width', d => {
                    if (d.data.hasOwnProperty('value')) {
                      let popupWidth =
                        d.data.name.length > d.data.value.toString().length
                          ? d.data.name.length
                          : d.data.value.length;
                      popupWidth += 9;
                      popupWidth *= 8;
                      return popupWidth;
                    } else return 1e-6;
                  })
                  .attr('height', '50')
                  .attr('rx', '10')
                  .attr('fill', '333333')
                  .style('fill-opacity', '0.8')
                  .attr('x', '15');

                // nodeEnter
                modelessPopup
                  .append('text')
                  .attr('class', 'modeless-popup')
                  .attr('dy', '.35em')
                  .attr('x', '25')
                  .attr('y', '15')
                  .attr('text-anchor', 'start')
                  .attr('color', '#E534AB')
                  .attr('fill', '#E534AB')
                  .attr('font-weight', 'normal')
                  .attr('font-size', '14')
                  .text('key: ');

                modelessPopup
                  .append('text')
                  .attr('class', 'modeless-popup')
                  .attr('dy', '.35em')
                  .attr('x', '55')
                  .attr('y', '15')
                  .attr('text-anchor', 'start')
                  .attr('color', '#ffffff')
                  .attr('fill', '#ffffff')
                  .attr('font-weight', 'normal')
                  .attr('font-size', '14')
                  .text(d => {
                    if (d.data.hasOwnProperty('value')) return d.data.name;
                  });

                modelessPopup
                  .append('text')
                  .attr('class', 'modeless-popup')
                  .attr('dy', '.35em')
                  .attr('x', '25')
                  .attr('y', '35')
                  .attr('text-anchor', 'start')
                  .attr('color', '#E534AB')
                  .attr('fill', '#E534AB')
                  .attr('font-weight', 'normal')
                  .attr('font-size', '14')
                  .text('value: ');

                modelessPopup
                  .append('text')
                  .attr('class', 'modeless-popup')
                  .attr('dy', '.35em')
                  .attr('x', '65')
                  .attr('y', '35')
                  .attr('text-anchor', 'start')
                  .attr('color', '#ffffff')
                  .attr('fill', '#ffffff')
                  .attr('font-weight', 'normal')
                  .attr('font-size', '14')
                  .text(d => {
                    if (d.data.hasOwnProperty('value')) {
                      console.log(d.data.value);
                      return d.data.value.toString();
                    }
                  });
              }
            } else {
              delete clickedLeaves[id];
              d.clicked = false;
              circle.setAttribute('style', treeStyles.unselectedCircle);
              circle.nextSibling.setAttribute(
                'style',
                treeStyles.unselectedText,
              );
              //eliminates modeless popup
              d3.selectAll('.modeless-popup').remove();
              delete clickedLeaves[id];
            }
          }
        }
      }
    }
  };

  return <div id="svg" style={{ overflow: 'auto' }} />;
};

export default Tree;
