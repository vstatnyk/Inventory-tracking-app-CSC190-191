import React, { useState } from 'react';
import Popup from 'reactjs-popup';

const FilterMenu = ({ onFilterSubmit }) => {
  const [filterCriteria1, setFilterCriteria1] = useState('');
  const [filterCriteria2, setFilterCriteria2] = useState('');
  const [filterCriteria3, setFilterCriteria3] = useState('');

  const handleFilterSubmit = () => {
    const filterCriteria = {
      name: filterCriteria1,
      description: filterCriteria2,
      quantity: filterCriteria3,
    };
    onFilterSubmit(filterCriteria);
  };

  return (
    <div>
      <Popup trigger={<button className="open-button">Open Filter Menu</button>} modal closeOnDocumentClick>
        {(close) => (
          <div className="filter-menu">
            <label htmlFor='nameInput'>Name:</label>
            <input
              type="text"
              id='nameInput'
              value={filterCriteria1 || ''}
              onChange={(e) => setFilterCriteria1(e.target.value)}
              className="filter-input"
            />

            <label htmlFor='descriptionInput'>Description:</label>
            <input
              type="text"
              id='descriptionInput'
              value={filterCriteria2 || ''}
              onChange={(e) => setFilterCriteria2(e.target.value)}
              className="filter-input"
            />

            <label htmlFor='quantityInput'>Quantity:</label>
            <input
              type="text"
              id='quantityInput'
              value={filterCriteria3 || ''}
              onChange={(e) => setFilterCriteria3(e.target.value)}
              className="filter-input"
            />

            <button onClick={() => handleFilterSubmit() && close()} className="submit-button">
              Apply Filter
            </button>
          </div>
        )}
      </Popup>
    </div>
  );
};

export default FilterMenu;
