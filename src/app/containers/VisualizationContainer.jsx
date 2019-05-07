import React, { useState, useEffect } from 'react';
import Tree from '../components/Tree';
import SearchBoxWithDropdown from '../components/SearchBoxWithDropdown';
import { Icon, Label } from 'semantic-ui-react';
// import { AsyncResource } from 'async_hooks';

const VisualizationContainer = props => {
  let [fullTree, setFullTree] = useState(parse('root', props.treeData));
  let [newTree, setNewTree] = useState(null);
  let [inputOnTag, setInputOnTag] = useState(null);
  let [filterOnTag, setFilterOnTag] = useState(null);
  let [input, setInput] = useState(null);
  let [filter, setFilter] = useState('key');
  let [isSearching, setIsSearching] = useState(false);

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
    else setInput(eventValue.target.value);
  };

  const handleOnClick = event => {
    if (input) {
      setNewTree(markFound(fullTree, input));
      setIsSearching(true);
      setInputOnTag(input);
      setFilterOnTag(filter);
    } else handleClearSearch();
  };

  const handleClearSearch = () => {
    setIsSearching(false);
  };

  // Tree structure from data
  function Data(name) {
    this.name = name;
    this.markedInSearch = false;
  }

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

  const markFound = (tree, input) => {
    tree.markedInSearch = RegExp(input, 'g').test(tree.name) ? true : false;
    if (tree.children) {
      for (let index in tree.children) {
        markFound(tree.children[index], input);
      }
    }
    return tree;
  };

  return (
    <div style={{ margin: '10px' }}>
      <SearchBoxWithDropdown
        handleOnChange={handleOnChange}
        handleOnClick={handleOnClick}
        handleKeyPress={handleKeyPress}
        searchWord={input}
      />
      {isSearching ? (
        <Label as="a" color="pink">
          {filterOnTag + ' : ' + inputOnTag}
          <Icon name="delete" onClick={handleClearSearch} />
        </Label>
      ) : null}
      {isSearching ? (
        <Tree treeData={newTree} isSearching={isSearching} />
      ) : (
        <Tree treeData={fullTree} isSearching={isSearching} />
      )}
    </div>
  );
};

export default VisualizationContainer;
