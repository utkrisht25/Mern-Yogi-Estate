import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const SearchForm = ({ onSearch }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    searchTerm: searchParams.get('searchTerm') || '',
    type: searchParams.get('type')?.split(',') || ['rent', 'sale'],
    parking: searchParams.get('parking') === 'true',
    furnished: searchParams.get('furnished') === 'true',
    sort: searchParams.get('sort') || 'createdAt_desc',
    priceMin: searchParams.get('priceMin') || '',
    priceMax: searchParams.get('priceMax') || '',
  });

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.searchTerm) params.set('searchTerm', filters.searchTerm);
    if (filters.type.length > 0) params.set('type', filters.type.join(','));
    if (filters.parking) params.set('parking', filters.parking);
    if (filters.furnished) params.set('furnished', filters.furnished);
    if (filters.sort) params.set('sort', filters.sort);
    if (filters.priceMin) params.set('priceMin', filters.priceMin);
    if (filters.priceMax) params.set('priceMax', filters.priceMax);
    
    setSearchParams(params);
    onSearch(filters);
  }, [filters, setSearchParams, onSearch]);

  const handleTypeChange = (type) => {
    const updatedTypes = filters.type.includes(type)
      ? filters.type.filter(t => t !== type)
      : [...filters.type, type];
    setFilters(prev => ({ ...prev, type: updatedTypes }));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(filters);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-md">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Search Term:
        </label>
        <input
          type="text"
          name="searchTerm"
          value={filters.searchTerm}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search by title, description, or location..."
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Type:
        </label>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filters.type.includes('rent')}
              onChange={() => handleTypeChange('rent')}
              className="mr-2"
            />
            Rent
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filters.type.includes('sale')}
              onChange={() => handleTypeChange('sale')}
              className="mr-2"
            />
            Sale
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filters.type.includes('offer')}
              onChange={() => handleTypeChange('offer')}
              className="mr-2"
            />
            Offer
          </label>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Price Range:
        </label>
        <div className="flex gap-4">
          <input
            type="number"
            name="priceMin"
            value={filters.priceMin}
            onChange={handleInputChange}
            className="w-1/2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Min Price"
          />
          <input
            type="number"
            name="priceMax"
            value={filters.priceMax}
            onChange={handleInputChange}
            className="w-1/2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Max Price"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Amenities:
        </label>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="parking"
              checked={filters.parking}
              onChange={handleInputChange}
              className="mr-2"
            />
            Parking
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="furnished"
              checked={filters.furnished}
              onChange={handleInputChange}
              className="mr-2"
            />
            Furnished
          </label>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Sort By:
        </label>
        <select
          name="sort"
          value={filters.sort}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="createdAt_desc">Latest</option>
          <option value="createdAt_asc">Oldest</option>
          <option value="price_desc">Price (High to Low)</option>
          <option value="price_asc">Price (Low to High)</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
      >
        Search
      </button>
    </form>
  );
};

export default SearchForm; 