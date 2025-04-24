import React from 'react';
import {  FaSortUp, FaSortDown } from 'react-icons/fa';

interface SortOption {
  value: string;
  label: string;
}

interface SortSelectProps {
  options: SortOption[];
  value: string;
  order: 'asc' | 'desc';
  onChange: (value: string, order: 'asc' | 'desc') => void;
}

const SortSelect: React.FC<SortSelectProps> = ({ options, value, order, onChange }) => {
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value, order);
  };

  const toggleOrder = () => {
    onChange(value, order === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="flex items-center space-x-2">
      <select
        value={value}
        onChange={handleSortChange}
        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <button
        onClick={toggleOrder}
        className="p-2 text-gray-600 hover:text-gray-800 focus:outline-none"
      >
        {order === 'asc' ? <FaSortUp /> : <FaSortDown />}
      </button>
    </div>
  );
};

export default SortSelect; 