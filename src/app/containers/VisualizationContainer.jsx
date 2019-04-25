import React, { Component, useState, useEffect } from 'react';
import Tree from '../components/Tree';
import SearchBoxWithDropdown from '../components/SearchBoxWithDropdown';
import { Icon, Label } from 'semantic-ui-react';

const VisualizationContainer = props => {
  // let [fullTree, setFullTree] = useState(parse('root', props.treeData));
  let [newTree, setNewTree] = useState(null);
  let [inputOnTag, setInputOnTag] = useState(null);
  let [filterOnTag, setFilterOnTag] = useState(null);
  let [input, setInput] = useState(null);
  let [filter, setFilter] = useState('key');
  let [search, setSearch] = useState(false);

  const handleOnChange = event => {
    let eventValue = event;
    eventValue.target.localName === 'input'
      ? setInput(eventValue.target.value)
      : setFilter(eventValue.target.innerText);
  };

  const handleKeyPress = event => {
    let eventValue = event;
    let keyCode = eventValue.keyCode;
    if (keyCode === 13) handleOnClick();
  };

  const handleOnClick = event => {
    if (input) {
      console.log(input, ' ', filter);
      createNewTree(fullTree, input);
      setSearch(true);
      setInputOnTag(input);
      setFilterOnTag(filter);
    } else handleClearSearch();
  };

  const handleClearSearch = () => {
    setSearch(false);
  };

  // Tree structure from data
  function Data(name) {
    this.name = name;
  }

  // add child function not working when recursing through data ...
  Data.prototype.addChild = function(childObj) {
    this.children.push(childObj);
    return this.children.length;
  };

  /**
   * Naive parser that returns an object fitted for D3 rendering
   *
   * expects an object (JSON parse beforehand if necessary)
   * @param {Object} input layout of the object to be parsed
   */

  function parse(name = 'App', input) {
    let result = new Data(name);
    result.children = new Array(0);
    for (let el of Object.entries(input)) {
      let newChild = new Data(el[0]);
      if (typeof el[1] === 'object') {
        newChild.children = new Array(0);
        newChild.children.push(parse(el[0], el[1]));
      } else {
        newChild.value = el[1];
      }
      result.children.push(newChild);
    }
    return result;
  }

  const createNewTree = (fullTree, input) => {
    for (let key in fullTree) {
      if ((!contains(fullTree[key]), input)) delete fullTree[key];
    }
    return fullTree;
  };

  const contains = (tree, input) => {
    for (let obj of tree) {
      if (obj.name.match(`/${input}/g`)) return true;
      else if (obj.children) {
        for (let index in obj.children) {
          if (constains(obj.children[index])) return true;
        }
      }
    }
    return false;
  };

  return (
    <div style={{ margin: '10px' }}>
      <SearchBoxWithDropdown
        handleOnChange={handleOnChange}
        handleOnClick={handleOnClick}
        handleKeyPress={handleKeyPress}
        searchWord={input}
      />
      {search ? (
        <Label as="a" color="pink">
          {filterOnTag + ' : ' + inputOnTag}
          <Icon name="delete" onClick={handleClearSearch} />
        </Label>
      ) : null}
      <Tree
        treeData={
          search ? parse('root', newTree) : parse('root', props.treeData)
        }
      />
    </div>
  );
};

export default VisualizationContainer;
