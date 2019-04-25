import React, { useState } from 'react';
import { Button, Select, Input } from 'semantic-ui-react';

const options = [
  { key: 'key', text: 'key', value: 'key' },
  { key: 'value', text: 'value', value: 'value' },
];

const SearchBoxWithDropdown = props => {
  const [searchType, setSearchType] = useState('key');
  const [inputText, setInputText] = useState('');

  // document.addEventListener('keydown', props.handleKeyPress);

  return (
    <Input
      onKeyUp={props.handleKeyPress}
      className="inputSearch"
      type="text"
      placeholder="Search..."
      onChange={props.handleOnChange}
      action
    >
      <input />
      <Select
        compact
        options={options}
        defaultValue="key"
        onChange={props.handleOnChange}
      />
      <Button type="submit" onClick={props.handleOnClick}>
        Search
      </Button>
    </Input>
  );
};

export default SearchBoxWithDropdown;
