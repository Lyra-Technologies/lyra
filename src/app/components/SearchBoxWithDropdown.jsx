import React, { useState } from 'react';
import { Button, Select, Input } from 'semantic-ui-react';

const options = [
  { key: 'key', text: 'key', value: 'key' },
  { key: 'value', text: 'value', value: 'value' },
];

const SearchBoxWithDropdown = props => {
  return (
    <Input
      onKeyUp={props.handleKeyPress}
      className="inputSearch"
      type="text"
      placeholder="Search..."
      action
    >
      <input id="inputTextBox" />
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
