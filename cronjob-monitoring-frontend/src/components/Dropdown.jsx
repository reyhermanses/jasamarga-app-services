import React, { useState, useEffect } from 'react';
import { Select } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const filterOption = (input, option) =>
  (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

const Dropdown = ({ title, endpoint, parameter, changeDataParent }) => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);

  const onChange = (value) => {
    console.log(`selected ${value}`);
    changeDataParent(value)
  };

  const onSearch = (value) => {
    setInputValue(value);
  };

  useEffect(() => {
    // Define an async function inside the useEffect to use setOptions
    const fetchData = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        };

        const response = await axios.get(`${endpoint}?${parameter}=${inputValue}`, config);
        const data = response.data;

        // Assuming the API response is an array of objects with 'value' and 'label' properties
        setOptions(data.data.map(item => ({ value: item.id, label: `${item.id} - ${item.name}`, key: item.id })));
      } catch (error) {
        if (error.response.status === 403) {
          return navigate('/');
        }
        console.error('Error fetching data:', error);
      }
    };

    // Check if the inputValue is not empty before making the API call
    if (inputValue.trim() !== '') {
      fetchData();
    } else {
      // Clear options if inputValue is empty
      setOptions([]);
    }
  }, [inputValue, endpoint, parameter]);

  return (
    <Select
      showSearch
      placeholder={title}
      optionFilterProp="children"
      onChange={onChange}
      onSearch={onSearch}
      filterOption={filterOption}
      options={options}
    />
  );
};

export default Dropdown;
