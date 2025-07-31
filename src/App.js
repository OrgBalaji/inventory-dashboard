import React, { useState, useMemo } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

const initialItems = [
  { id: 1, name: "Laptop", type: "Electronics", code: "E001", quantity: 5, price: 82999.00 },
  { id: 2, name: "Chair", type: "Furniture", code: "F002", quantity: 2, price: 12400.00 },
  { id: 3, name: "Pen", type: "Stationery", code: "S003", quantity: 20, price: 25.00 },
  { id: 4, name: "Notebook", type: "Stationery", code: "S004", quantity: 3, price: 50.00 },
  { id: 5, name: "Mouse", type: "Electronics", code: "E005", quantity: 1, price: 2499.00 },
  { id: 6, name: "Desk", type: "Furniture", code: "F006", quantity: 8, price: 24800.00 },
  { id: 7, name: "Monitor", type: "Electronics", code: "E007", quantity: 12, price: 20799.00 },
  { id: 8, name: "Stapler", type: "Stationery", code: "S008", quantity: 6, price: 1080.00 },
  { id: 9, name: "Keyboard", type: "Electronics", code: "E009", quantity: 15, price: 3499.00 },
  { id: 10, name: "Bookshelf", type: "Furniture", code: "F010", quantity: 4, price: 18900.00 },
  { id: 11, name: "Printer", type: "Electronics", code: "E011", quantity: 3, price: 25999.00 },
  { id: 12, name: "Eraser", type: "Stationery", code: "S012", quantity: 50, price: 5.00 },
  { id: 13, name: "Webcam", type: "Electronics", code: "E013", quantity: 2, price: 4999.00 },
  { id: 14, name: "Table Lamp", type: "Furniture", code: "F014", quantity: 7, price: 2499.00 },
  { id: 15, name: "Highlighter", type: "Stationery", code: "S015", quantity: 25, price: 45.00 },
  { id: 16, name: "Tablet", type: "Electronics", code: "E016", quantity: 6, price: 35999.00 },
  { id: 17, name: "Filing Cabinet", type: "Furniture", code: "F017", quantity: 3, price: 15999.00 },
  { id: 18, name: "Marker", type: "Stationery", code: "S018", quantity: 30, price: 35.00 },
  { id: 19, name: "Headphones", type: "Electronics", code: "E019", quantity: 9, price: 7999.00 },
  { id: 20, name: "Office Chair", type: "Furniture", code: "F020", quantity: 5, price: 18500.00 },
  { id: 21, name: "Calculator", type: "Electronics", code: "E021", quantity: 12, price: 1299.00 },
  { id: 22, name: "Whiteboard", type: "Furniture", code: "F022", quantity: 2, price: 8999.00 },
  { id: 23, name: "Ruler", type: "Stationery", code: "S023", quantity: 40, price: 15.00 },
  { id: 24, name: "Scanner", type: "Electronics", code: "E024", quantity: 1, price: 18999.00 },
  { id: 25, name: "Drawer Unit", type: "Furniture", code: "F025", quantity: 4, price: 12999.00 },
];

const LOW_QUANTITY_THRESHOLD = 5;

function App() {
  const [items, setItems] = useState(initialItems);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [filterType, setFilterType] = useState('all');
  const [editingItem, setEditingItem] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [formData, setFormData] = useState({
    name: '',
    type: 'Electronics',
    code: '',
    quantity: 0,
    price: 0
  });

  const totalItems = items.length;
  const lowQuantityItems = items.filter(item => item.quantity < LOW_QUANTITY_THRESHOLD);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item.id);
    setFormData({
      name: item.name,
      type: item.type,
      code: item.code,
      quantity: item.quantity,
      price: item.price
    });
  };

  const checkDuplicates = (name, code, excludeId = null) => {
    const nameExists = items.some(item => 
      item.id !== excludeId && item.name.toLowerCase() === name.toLowerCase()
    );
    const codeExists = items.some(item => 
      item.id !== excludeId && item.code.toLowerCase() === code.toLowerCase()
    );
    
    return { nameExists, codeExists };
  };

  const getValidationClass = (fieldName) => {
    if (!formData[fieldName].trim()) {
      return 'form-control is-invalid';
    }
    
    if (fieldName === 'name') {
      const { nameExists } = checkDuplicates(formData.name, formData.code, editingItem);
      return nameExists ? 'form-control is-invalid' : 'form-control is-valid';
    }
    
    if (fieldName === 'code') {
      const { codeExists } = checkDuplicates(formData.name, formData.code, editingItem);
      return codeExists ? 'form-control is-invalid' : 'form-control is-valid';
    }
    
    return 'form-control';
  };

  const getValidationMessage = (fieldName) => {
    if (!formData[fieldName].trim()) {
      return `${fieldName === 'name' ? 'Item name' : 'Item code'} is required.`;
    }
    
    if (fieldName === 'name') {
      const { nameExists } = checkDuplicates(formData.name, formData.code, editingItem);
      return nameExists ? 'An item with this name already exists.' : '';
    }
    
    if (fieldName === 'code') {
      const { codeExists } = checkDuplicates(formData.name, formData.code, editingItem);
      return codeExists ? 'An item with this code already exists.' : '';
    }
    
    return '';
  };

  const isFormValid = () => {
    if (!formData.name.trim() || !formData.code.trim()) {
      return false;
    }
    
    const { nameExists, codeExists } = checkDuplicates(formData.name, formData.code, editingItem);
    return !nameExists && !codeExists;
  };

  const handleUpdate = () => {
    const { nameExists, codeExists } = checkDuplicates(formData.name, formData.code, editingItem);
    
    if (nameExists) {
      alert('Error: An item with this name already exists. Please choose a different name.');
      return;
    }
    
    if (codeExists) {
      alert('Error: An item with this code already exists. Please choose a different code.');
      return;
    }

    if (!formData.name.trim() || !formData.code.trim()) {
      alert('Error: Item name and code are required fields.');
      return;
    }

    setItems(items.map(item => 
      item.id === editingItem 
        ? { ...item, ...formData, quantity: parseInt(formData.quantity), price: parseFloat(formData.price) }
        : item
    ));
    setEditingItem(null);
    resetForm();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const handleAdd = () => {
    const { nameExists, codeExists } = checkDuplicates(formData.name, formData.code);
    
    if (nameExists) {
      alert('Error: An item with this name already exists. Please choose a different name.');
      return;
    }
    
    if (codeExists) {
      alert('Error: An item with this code already exists. Please choose a different code.');
      return;
    }

    if (!formData.name.trim() || !formData.code.trim()) {
      alert('Error: Item name and code are required fields.');
      return;
    }

    const newId = Math.max(...items.map(item => item.id)) + 1;
    const newItem = {
      id: newId,
      ...formData,
      quantity: parseInt(formData.quantity),
      price: parseFloat(formData.price)
    };
    setItems([...items, newItem]);
    setShowAddForm(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'Electronics',
      code: '',
      quantity: 0,
      price: 0
    });
  };

  const handleCancel = () => {
    setEditingItem(null);
    setShowAddForm(false);
    resetForm();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const filteredAndSortedItems = useMemo(() => {
    let filtered = items;
    
    if (filterType !== 'all') {
      filtered = items.filter(item => item.type === filterType);
    }

    return filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [items, sortField, sortDirection, filterType]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredAndSortedItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredAndSortedItems.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page
  };

  const generatePageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  const getSortIcon = (field) => {
    if (sortField === field) {
      return sortDirection === 'asc' ? ' ↑' : ' ↓';
    }
    return ' ↕';
  };

  return (
    <div className="container-fluid" style={{ padding: "2rem", backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <h1 className="text-center mb-4" style={{ color: "#333" }}>Inventory Dashboard</h1>
        
        {/* Summary Cards */}
        <div className="row mb-4">
          <div className="col-md-4">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title text-primary">Total Items</h5>
                <h2 className="card-text">{totalItems}</h2>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title text-danger">Low Stock Alert</h5>
                <h2 className="card-text">{lowQuantityItems.length}</h2>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title text-success">Categories</h5>
                <h2 className="card-text">{[...new Set(items.map(item => item.type))].length}</h2>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="card mb-4">
          <div className="card-body">
            <div className="row align-items-center">
              <div className="col-md-3">
                <div className="d-flex align-items-center">
                  <label className="form-label me-3 mb-0"><strong>Filter:</strong></label>
                  <select 
                    className="form-select w-auto"
                    value={filterType} 
                    onChange={(e) => setFilterType(e.target.value)}
                  >
                    <option value="all">All Types</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Stationery">Stationery</option>
                  </select>
                </div>
              </div>
              <div className="col-md-3">
                <div className="d-flex align-items-center">
                  <label className="form-label me-3 mb-0"><strong>Per Page:</strong></label>
                  <select 
                    className="form-select w-auto"
                    value={itemsPerPage} 
                    onChange={(e) => handleItemsPerPageChange(parseInt(e.target.value))}
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                    <option value={25}>25</option>
                  </select>
                </div>
              </div>
              <div className="col-md-6 text-end">
                <button 
                  className="btn btn-success"
                  onClick={() => setShowAddForm(true)}
                >
                  + Add New Item
                </button>
              </div>
            </div>
            <div className="mt-2 text-muted">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredAndSortedItems.length)} of {filteredAndSortedItems.length} items
              {filterType !== 'all' && ` (filtered from ${totalItems} total)`}
            </div>
          </div>
        </div>

        {/* Add/Edit Form */}
        {(showAddForm || editingItem) && (
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">{editingItem ? 'Edit Item' : 'Add New Item'}</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Item Name *</label>
                    <input
                      type="text"
                      className={getValidationClass('name')}
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter item name"
                    />
                    {formData.name && (
                      <div className={getValidationClass('name').includes('is-invalid') ? 'invalid-feedback' : 'valid-feedback'}>
                        {getValidationMessage('name') || 'Item name looks good!'}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Category</label>
                    <select
                      className="form-select"
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                    >
                      <option value="Electronics">Electronics</option>
                      <option value="Furniture">Furniture</option>
                      <option value="Stationery">Stationery</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="mb-3">
                    <label className="form-label">Item Code *</label>
                    <input
                      type="text"
                      className={getValidationClass('code')}
                      name="code"
                      value={formData.code}
                      onChange={handleInputChange}
                      placeholder="Enter item code (e.g., E001)"
                    />
                    {formData.code && (
                      <div className={getValidationClass('code').includes('is-invalid') ? 'invalid-feedback' : 'valid-feedback'}>
                        {getValidationMessage('code') || 'Item code looks good!'}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="mb-3">
                    <label className="form-label">Quantity</label>
                    <input
                      type="number"
                      className="form-control"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      min="0"
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="mb-3">
                    <label className="form-label">Price (₹)</label>
                    <input
                      type="number"
                      className="form-control"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
              </div>
              <div className="d-flex gap-2">
                {editingItem ? (
                  <button 
                    className="btn btn-primary" 
                    onClick={handleUpdate}
                    disabled={!isFormValid()}
                  >
                    Update Item
                  </button>
                ) : (
                  <button 
                    className="btn btn-success" 
                    onClick={handleAdd}
                    disabled={!isFormValid()}
                  >
                    Add Item
                  </button>
                )}
                <button className="btn btn-secondary" onClick={handleCancel}>
                  Cancel
                </button>
                {!isFormValid() && (
                  <small className="text-muted align-self-center ms-2">
                    Please fix validation errors to continue
                  </small>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Items Table */}
        <div className="card">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th 
                      style={{ cursor: "pointer", userSelect: "none" }}
                      onClick={() => handleSort('name')}
                    >
                      Item Name{getSortIcon('name')}
                    </th>
                    <th 
                      style={{ cursor: "pointer", userSelect: "none" }}
                      onClick={() => handleSort('type')}
                    >
                      Category{getSortIcon('type')}
                    </th>
                    <th 
                      style={{ cursor: "pointer", userSelect: "none" }}
                      onClick={() => handleSort('code')}
                    >
                      Code{getSortIcon('code')}
                    </th>
                    <th 
                      style={{ cursor: "pointer", userSelect: "none" }}
                      onClick={() => handleSort('quantity')}
                    >
                      Quantity{getSortIcon('quantity')}
                    </th>
                    <th 
                      style={{ cursor: "pointer", userSelect: "none" }}
                      onClick={() => handleSort('price')}
                    >
                      Price{getSortIcon('price')}
                    </th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((item) => (
                    <tr 
                      key={item.id} 
                      className={item.quantity < LOW_QUANTITY_THRESHOLD ? 'table-warning' : ''}
                    >
                      <td>
                        <strong>{item.name}</strong>
                      </td>
                      <td>
                        <span className={`badge ${
                          item.type === "Electronics" ? 'bg-info' :
                          item.type === "Furniture" ? 'bg-secondary' :
                          'bg-success'
                        }`}>
                          {item.type}
                        </span>
                      </td>
                      <td>
                        <code>{item.code}</code>
                      </td>
                      <td>
                        <span className={item.quantity < LOW_QUANTITY_THRESHOLD ? 'text-danger fw-bold' : ''}>
                          {item.quantity}
                          {item.quantity < LOW_QUANTITY_THRESHOLD && (
                            <span className="ms-1">⚠️</span>
                          )}
                        </span>
                      </td>
                      <td className="text-success fw-bold">
                        ₹{item.price.toLocaleString('en-IN')}
                      </td>
                      <td>
                        <div className="btn-group" role="group">
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => handleEdit(item)}
                            title="Edit Item"
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(item.id)}
                            title="Delete Item"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {filteredAndSortedItems.length > 0 && totalPages > 1 && (
              <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                <div className="text-muted">
                  Page {currentPage} of {totalPages}
                </div>
                <nav aria-label="Table pagination">
                  <ul className="pagination pagination-sm mb-0">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button 
                        className="page-link"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </button>
                    </li>
                    
                    {generatePageNumbers().map((pageNum, index) => (
                      <li 
                        key={index} 
                        className={`page-item ${
                          pageNum === currentPage ? 'active' : ''
                        } ${pageNum === '...' ? 'disabled' : ''}`}
                      >
                        {pageNum === '...' ? (
                          <span className="page-link">...</span>
                        ) : (
                          <button 
                            className="page-link"
                            onClick={() => handlePageChange(pageNum)}
                          >
                            {pageNum}
                          </button>
                        )}
                      </li>
                    ))}
                    
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                      <button 
                        className="page-link"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            )}

            {filteredAndSortedItems.length === 0 && (
              <div className="text-center py-4 text-muted">
                <h5>No items found</h5>
                <p>No items match the current filter criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;