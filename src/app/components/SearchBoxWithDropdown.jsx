import React from 'react';
import { Button, Select, Input } from 'semantic-ui-react';

const options = [
  { key: 'key', text: 'key', value: 'key' },
  { key: 'value', text: 'value', value: 'value' },
];

const SearchBoxWithDropdown = props => {
  const { handleKeyPress, handleOnChange, handleOnClick } = props;
  return (
    <Input
      onKeyUp={handleKeyPress}
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
        onChange={handleOnChange}
      />
      <Button type="submit" onClick={handleOnClick}>
        Search
      </Button>
    </Input>
  );
};

export default SearchBoxWithDropdown;
