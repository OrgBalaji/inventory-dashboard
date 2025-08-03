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

// Toast Notification Component
const ToastNotification = ({ notification, onRemove, theme }) => (
  <div
    className={`toast show mb-2 ${
      notification.type === 'success' ? 'bg-success' : 'bg-danger'
    } text-white`}
    role="alert"
  >
    <div className="toast-header">
      <strong className="me-auto">
        {notification.type === 'success' ? '✅ Success' : '❌ Error'}
      </strong>
      <button
        type="button"
        className="btn-close btn-close-white"
        onClick={() => onRemove(notification.id)}
      ></button>
    </div>
    <div className="toast-body">
      {notification.message}
    </div>
  </div>
);

// Summary Card Component
const SummaryCard = ({ title, value, subtitle, theme }) => (
  <div className="col-md-3">
    <div className="card text-center h-100" style={{ 
      backgroundColor: theme.cardBackground, 
      color: theme.textColor, 
      border: `1px solid ${theme.borderColor}` 
    }}>
      <div className="card-body">
        <h5 className="card-title" dangerouslySetInnerHTML={{ __html: title }}></h5>
        <h2 className="card-text">{value}</h2>
        <small style={{ color: theme.textMuted }}>{subtitle}</small>
      </div>
    </div>
  </div>
);

// Chart Component
const ChartCard = ({ title, data, theme, colorClass = 'bg-primary' }) => (
  <div className="col-md-6">
    <div className="card h-100" style={{ 
      backgroundColor: theme.cardBackground, 
      color: theme.textColor, 
      border: `1px solid ${theme.borderColor}` 
    }}>
      <div className="card-header" style={{ 
        backgroundColor: theme.cardBackground, 
        borderBottom: `1px solid ${theme.borderColor}` 
      }}>
        <h5 className="mb-0">{title}</h5>
      </div>
      <div className="card-body">
        {Object.entries(data).map(([category, value]) => {
          const maxValue = Math.max(...Object.values(data));
          const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
          return (
            <div key={category} className="mb-3">
              <div className="d-flex justify-content-between mb-1">
                <small style={{ color: theme.textColor }}>{category}</small>
                <small style={{ color: theme.textMuted }}>{typeof value === 'number' && value > 1000 ? `₹${value.toLocaleString('en-IN')}` : `${value} items`}</small>
              </div>
              <div className="progress" style={{ height: '20px', backgroundColor: theme.borderColor }}>
                <div 
                  className={`progress-bar ${colorClass}`} 
                  role="progressbar" 
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
        {Object.keys(data).length === 0 && (
          <p style={{ color: theme.textMuted, textAlign: 'center', marginTop: '2rem' }}>No data available</p>
        )}
      </div>
    </div>
  </div>
);

// Header Icon Component
const HeaderIcon = ({ icon, title, onClick, isActive = false, showBadge = false, badgeCount = 0, theme }) => (
  <div 
    className="text-center" 
    style={{ 
      background: isActive ? "rgba(34, 197, 94, 0.3)" : "rgba(255,255,255,0.2)", 
      borderRadius: "15px", 
      padding: "12px",
      cursor: "pointer",
      transition: "all 0.3s ease",
      backdropFilter: "blur(10px)",
      border: isActive ? "2px solid rgba(34, 197, 94, 0.5)" : "2px solid transparent"
    }}
    onClick={onClick}
    onMouseEnter={(e) => {
      e.target.style.transform = "scale(1.1)";
      e.target.style.background = isActive ? "rgba(34, 197, 94, 0.4)" : "rgba(255,255,255,0.3)";
    }}
    onMouseLeave={(e) => {
      e.target.style.transform = "scale(1)";
      e.target.style.background = isActive ? "rgba(34, 197, 94, 0.3)" : "rgba(255,255,255,0.2)";
    }}
    title={title}
  >
    <div style={{ 
      fontSize: "1.5rem", 
      filter: isActive ? "drop-shadow(0 0 8px rgba(34, 197, 94, 0.8))" : "none",
      transform: isActive ? "scale(1.1)" : "scale(1)",
      transition: "all 0.3s ease",
      position: "relative"
    }}>
      {icon}
      {showBadge && badgeCount > 0 && (
        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.6rem' }}>
          {badgeCount}
        </span>
      )}
    </div>
    <small style={{ 
      fontSize: "0.7rem", 
      opacity: 0.9,
      color: isActive ? "#ffffff" : "inherit",
      fontWeight: isActive ? "bold" : "normal"
    }}>
      {isActive && title.includes('Charts') ? 'Active' : title.split(' ').pop()}
    </small>
  </div>
);

function App() {
  const [items, setItems] = useState(() => {
    const savedItems = localStorage.getItem('inventoryItems');
    return savedItems ? JSON.parse(savedItems) : initialItems;
  });
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [notifications, setNotifications] = useState([]);
  
  // Tab management
  const [activeTab, setActiveTab] = useState(() => {
    const savedTab = localStorage.getItem('activeTab');
    return savedTab || 'dashboard';
  });
  
  // New state for enhanced features
  const [darkMode, setDarkMode] = useState(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    return savedDarkMode ? JSON.parse(savedDarkMode) : false;
  });
  const [showCharts, setShowCharts] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [quantityRange, setQuantityRange] = useState({ min: '', max: '' });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  // E-commerce state
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [orders, setOrders] = useState(() => {
    const savedOrders = localStorage.getItem('orders');
    return savedOrders ? JSON.parse(savedOrders) : [];
  });
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'Electronics',
    code: '',
    quantity: 0,
    price: 0
  });

  // Save to localStorage whenever items change
  React.useEffect(() => {
    localStorage.setItem('inventoryItems', JSON.stringify(items));
  }, [items]);

  // Save dark mode preference
  React.useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Save active tab preference
  React.useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

  // Save cart and orders to localStorage
  React.useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  React.useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  // E-commerce functions
  const addToCart = (item, quantity = 1) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + quantity }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity }]);
    }
    showNotification(`${item.name} added to cart!`, 'success');
  };

  const updateCartQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart(cart.map(cartItem =>
      cartItem.id === itemId
        ? { ...cartItem, quantity }
        : cartItem
    ));
  };

  const removeFromCart = (itemId) => {
    const item = cart.find(cartItem => cartItem.id === itemId);
    setCart(cart.filter(cartItem => cartItem.id !== itemId));
    if (item) {
      showNotification(`${item.name} removed from cart`, 'success');
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const placeOrder = () => {
    if (cart.length === 0) {
      showNotification('Cart is empty!', 'error');
      return;
    }

    // Validate all mandatory fields
    const errors = [];
    if (!customerInfo.name.trim()) errors.push('Name');
    if (!customerInfo.email.trim()) errors.push('Email');
    if (!customerInfo.phone.trim()) errors.push('Phone');
    if (!customerInfo.address.trim()) errors.push('Address');

    if (errors.length > 0) {
      showNotification(`Please fill in the following required fields: ${errors.join(', ')}`, 'error');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerInfo.email)) {
      showNotification('Please enter a valid email address', 'error');
      return;
    }

    // Phone validation (basic)
    const phoneRegex = /^[\d\s\-\+\(\)]{10,15}$/;
    if (!phoneRegex.test(customerInfo.phone)) {
      showNotification('Please enter a valid phone number (10-15 digits)', 'error');
      return;
    }

    const newOrder = {
      id: Date.now(),
      orderNumber: `ORD-${Date.now().toString().slice(-6)}`,
      items: [...cart],
      customer: { ...customerInfo },
      total: getCartTotal(),
      subtotal: getCartTotal(),
      tax: Math.round(getCartTotal() * 0.18), // 18% GST
      grandTotal: getCartTotal() + Math.round(getCartTotal() * 0.18),
      date: new Date().toISOString(),
      status: 'Confirmed',
      billGenerated: true
    };

    setOrders([newOrder, ...orders]);
    setCart([]);
    setCustomerInfo({ name: '', email: '', phone: '', address: '' });
    setShowCheckout(false);
    setShowCart(false);
    
    // Generate and show bill
    generateBill(newOrder);
    showNotification('Order placed successfully! Bill generated.', 'success');
  };

  // Bill generation function
  const generateBill = (order) => {
    // Create bill content
    const billContent = `
<!DOCTYPE html>
<html>
<head>
    <title>Invoice - ${order.orderNumber}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
        .header { text-align: center; border-bottom: 2px solid #007bff; padding-bottom: 20px; margin-bottom: 20px; }
        .company-name { font-size: 24px; font-weight: bold; color: #007bff; margin-bottom: 5px; }
        .invoice-title { font-size: 20px; font-weight: bold; margin: 20px 0; }
        .info-section { display: flex; justify-content: space-between; margin-bottom: 20px; }
        .info-box { width: 48%; }
        .info-box h4 { margin-bottom: 10px; color: #007bff; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        th { background-color: #007bff; color: white; font-weight: bold; }
        .text-right { text-align: right; }
        .total-section { margin-top: 20px; }
        .total-row { font-weight: bold; background-color: #f8f9fa; }
        .grand-total { font-size: 18px; color: #007bff; background-color: #e3f2fd; }
        .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #ddd; padding-top: 20px; }
        @media print { 
            body { margin: 0; } 
            .no-print { display: none; }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="company-name">🏢 Inventory Management System</div>
        <div>Complete Inventory & E-Commerce Solution</div>
    </div>
    
    <div class="invoice-title">📄 INVOICE</div>
    
    <div class="info-section">
        <div class="info-box">
            <h4>📦 Order Details</h4>
            <p><strong>Order Number:</strong> ${order.orderNumber}</p>
            <p><strong>Order Date:</strong> ${new Date(order.date).toLocaleDateString('en-IN')}</p>
            <p><strong>Order Time:</strong> ${new Date(order.date).toLocaleTimeString('en-IN')}</p>
            <p><strong>Status:</strong> ${order.status}</p>
        </div>
        <div class="info-box">
            <h4>👤 Customer Information</h4>
            <p><strong>Name:</strong> ${order.customer.name}</p>
            <p><strong>Email:</strong> ${order.customer.email}</p>
            <p><strong>Phone:</strong> ${order.customer.phone}</p>
            <p><strong>Address:</strong> ${order.customer.address}</p>
        </div>
    </div>
    
    <table>
        <thead>
            <tr>
                <th>S.No.</th>
                <th>Product Name</th>
                <th>Category</th>
                <th>Unit Price</th>
                <th>Quantity</th>
                <th>Total Amount</th>
            </tr>
        </thead>
        <tbody>
            ${order.items.map((item, index) => `
                <tr>
                    <td>${index + 1}</td>
                    <td>${item.name}</td>
                    <td>${item.type}</td>
                    <td class="text-right">₹${item.price.toLocaleString('en-IN')}</td>
                    <td class="text-right">${item.quantity}</td>
                    <td class="text-right">₹${(item.price * item.quantity).toLocaleString('en-IN')}</td>
                </tr>
            `).join('')}
        </tbody>
    </table>
    
    <div class="total-section">
        <table style="width: 50%; margin-left: auto;">
            <tr>
                <td><strong>Subtotal:</strong></td>
                <td class="text-right">₹${order.subtotal.toLocaleString('en-IN')}</td>
            </tr>
            <tr>
                <td><strong>GST (18%):</strong></td>
                <td class="text-right">₹${order.tax.toLocaleString('en-IN')}</td>
            </tr>
            <tr class="grand-total">
                <td><strong>Grand Total:</strong></td>
                <td class="text-right"><strong>₹${order.grandTotal.toLocaleString('en-IN')}</strong></td>
            </tr>
        </table>
    </div>
    
    <div class="footer">
        <p><strong>Thank you for your business! 🙏</strong></p>
        <p>This is a computer-generated invoice. No signature required.</p>
        <p>For any queries, please contact us at support@inventorymanagement.com</p>
        <p>Generated on: ${new Date().toLocaleString('en-IN')}</p>
    </div>
    
    <div class="no-print" style="margin-top: 20px; text-align: center;">
        <button onclick="window.print()" style="background: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-right: 10px;">🖨️ Print Bill</button>
        <button onclick="downloadPDF()" style="background: #28a745; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">📄 Download PDF</button>
    </div>
    
    <script>
        function downloadPDF() {
            // Simple PDF download using browser's print to PDF
            const originalTitle = document.title;
            document.title = 'Invoice-${order.orderNumber}';
            window.print();
            document.title = originalTitle;
        }
    </script>
</body>
</html>`;

    // Open bill in new window
    const billWindow = window.open('', '_blank');
    billWindow.document.write(billContent);
    billWindow.document.close();
  };

  // Export to CSV functionality
  const exportToCSV = () => {
    const headers = ['Name', 'Type', 'Code', 'Quantity', 'Price (₹)', 'Total Value (₹)'];
    const csvContent = [
      headers.join(','),
      ...filteredAndSortedItems.map(item => [
        `"${item.name}"`,
        `"${item.type}"`,
        `"${item.code}"`,
        item.quantity,
        item.price,
        item.price * item.quantity
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `inventory_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('Inventory data exported to CSV successfully!', 'success');
  };

  // Toast notification system
  const showNotification = (message, type = 'success') => {
    const id = Date.now();
    const notification = { id, message, type };
    setNotifications(prev => [...prev, notification]);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

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
      showNotification('An item with this name already exists. Please choose a different name.', 'error');
      return;
    }
    
    if (codeExists) {
      showNotification('An item with this code already exists. Please choose a different code.', 'error');
      return;
    }

    if (!formData.name.trim() || !formData.code.trim()) {
      showNotification('Item name and code are required fields.', 'error');
      return;
    }

    setItems(items.map(item => 
      item.id === editingItem 
        ? { ...item, ...formData, quantity: parseInt(formData.quantity), price: parseFloat(formData.price) }
        : item
    ));
    setEditingItem(null);
    resetForm();
    showNotification(`Item "${formData.name}" updated successfully!`, 'success');
  };

  const handleDelete = (id) => {
    const item = items.find(item => item.id === id);
    if (window.confirm(`Are you sure you want to delete "${item.name}"?`)) {
      setItems(items.filter(item => item.id !== id));
      showNotification(`Item "${item.name}" deleted successfully!`, 'success');
    }
  };

  const handleAdd = () => {
    const { nameExists, codeExists } = checkDuplicates(formData.name, formData.code);
    
    if (nameExists) {
      showNotification('An item with this name already exists. Please choose a different name.', 'error');
      return;
    }
    
    if (codeExists) {
      showNotification('An item with this code already exists. Please choose a different code.', 'error');
      return;
    }

    if (!formData.name.trim() || !formData.code.trim()) {
      showNotification('Item name and code are required fields.', 'error');
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
    showNotification(`Item "${formData.name}" added successfully!`, 'success');
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
    
    // Apply type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(item => item.type === filterType);
    }

    // Apply search filter
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(search) ||
        item.code.toLowerCase().includes(search) ||
        item.type.toLowerCase().includes(search)
      );
    }

    // Apply price range filter
    if (priceRange.min !== '' || priceRange.max !== '') {
      filtered = filtered.filter(item => {
        const price = item.price;
        const minPrice = priceRange.min === '' ? 0 : parseFloat(priceRange.min);
        const maxPrice = priceRange.max === '' ? Infinity : parseFloat(priceRange.max);
        return price >= minPrice && price <= maxPrice;
      });
    }

    // Apply quantity range filter
    if (quantityRange.min !== '' || quantityRange.max !== '') {
      filtered = filtered.filter(item => {
        const quantity = item.quantity;
        const minQty = quantityRange.min === '' ? 0 : parseInt(quantityRange.min);
        const maxQty = quantityRange.max === '' ? Infinity : parseInt(quantityRange.max);
        return quantity >= minQty && quantity <= maxQty;
      });
    }

    // Apply sorting
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
  }, [items, sortField, sortDirection, filterType, searchTerm, priceRange, quantityRange]);

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

  // Chart data calculations
  const chartData = {
    categoryData: () => {
      const categories = {};
      items.forEach(item => {
        categories[item.type] = (categories[item.type] || 0) + item.quantity;
      });
      return categories;
    },
    
    valueByCategory: () => {
      const categoryValues = {};
      items.forEach(item => {
        const value = item.price * item.quantity;
        categoryValues[item.type] = (categoryValues[item.type] || 0) + value;
      });
      return categoryValues;
    },
    
    lowStockItems: () => {
      return items.filter(item => item.quantity < LOW_QUANTITY_THRESHOLD);
    }
  };

  // Sample sales data (in a real app, this would come from an API)
  const generateSalesData = () => {
    const today = new Date();
    const salesData = [];
    
    // Generate sales for the last 30 days
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Generate random sales for each category
      const categories = ['Electronics', 'Furniture', 'Stationery'];
      categories.forEach(category => {
        const categoryItems = items.filter(item => item.type === category);
        categoryItems.forEach(item => {
          // Random sales (0-5 items per day)
          const quantity = Math.floor(Math.random() * 6);
          if (quantity > 0) {
            salesData.push({
              date: date.toISOString().split('T')[0],
              itemName: item.name,
              category: item.type,
              quantity: quantity,
              revenue: quantity * item.price,
              itemId: item.id
            });
          }
        });
      });
    }
    return salesData;
  };

  const salesData = generateSalesData();

  // Sales analytics calculations
  const salesAnalytics = {
    dailySales: () => {
      const today = new Date().toISOString().split('T')[0];
      return salesData.filter(sale => sale.date === today);
    },
    
    weeklySales: () => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const weekAgoStr = weekAgo.toISOString().split('T')[0];
      return salesData.filter(sale => sale.date >= weekAgoStr);
    },
    
    monthlySales: () => {
      const monthAgo = new Date();
      monthAgo.setDate(monthAgo.getDate() - 30);
      const monthAgoStr = monthAgo.toISOString().split('T')[0];
      return salesData.filter(sale => sale.date >= monthAgoStr);
    },
    
    salesByCategory: (period = 'monthly') => {
      let filteredSales;
      if (period === 'daily') {
        filteredSales = salesAnalytics.dailySales();
      } else if (period === 'weekly') {
        filteredSales = salesAnalytics.weeklySales();
      } else {
        filteredSales = salesAnalytics.monthlySales();
      }
      
      const categoryTotals = {};
      filteredSales.forEach(sale => {
        categoryTotals[sale.category] = (categoryTotals[sale.category] || 0) + sale.quantity;
      });
      return categoryTotals;
    },
    
    revenueByCategory: (period = 'monthly') => {
      let filteredSales;
      if (period === 'daily') {
        filteredSales = salesAnalytics.dailySales();
      } else if (period === 'weekly') {
        filteredSales = salesAnalytics.weeklySales();
      } else {
        filteredSales = salesAnalytics.monthlySales();
      }
      
      const categoryRevenue = {};
      filteredSales.forEach(sale => {
        categoryRevenue[sale.category] = (categoryRevenue[sale.category] || 0) + sale.revenue;
      });
      return categoryRevenue;
    },
    
    topSellingItems: (period = 'monthly', limit = 5) => {
      let filteredSales;
      if (period === 'daily') {
        filteredSales = salesAnalytics.dailySales();
      } else if (period === 'weekly') {
        filteredSales = salesAnalytics.weeklySales();
      } else {
        filteredSales = salesAnalytics.monthlySales();
      }
      
      const itemTotals = {};
      filteredSales.forEach(sale => {
        const key = `${sale.itemName}`;
        itemTotals[key] = (itemTotals[key] || 0) + sale.quantity;
      });
      
      return Object.entries(itemTotals)
        .sort(([,a], [,b]) => b - a)
        .slice(0, limit)
        .map(([name, quantity]) => ({ name, quantity }));
    }
  };

  // Dark mode theme
  const theme = {
    background: darkMode ? '#1a1a1a' : '#f5f5f5',
    cardBackground: darkMode ? '#2d2d2d' : '#ffffff',
    textColor: darkMode ? '#ffffff' : '#000000',
    textMuted: darkMode ? '#cccccc' : '#6c757d',
    borderColor: darkMode ? '#404040' : '#dee2e6',
    headerGradient: darkMode 
      ? 'linear-gradient(135deg, #2d3748 0%, #4a5568 100%)'
      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    buttonPrimary: darkMode ? '#4299e1' : '#007bff',
    buttonSecondary: darkMode ? '#38a169' : '#28a745'
  };

  return (
    <>
      {/* CSS Animations */}
      <style>{`
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(76, 175, 80, 0); }
          100% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .dashboard-icon {
          animation: float 3s ease-in-out infinite;
        }
        
        .gradient-text {
          background: linear-gradient(45deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .hover-scale {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .hover-scale:hover {
          transform: translateY(-5px) scale(1.05);
          box-shadow: 0 15px 35px rgba(0,0,0,0.2);
        }
      `}</style>
      
      <div className="container-fluid" style={{ 
        padding: "2rem", 
        backgroundColor: theme.background, 
        minHeight: "100vh",
        color: theme.textColor,
        transition: "all 0.3s ease"
      }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          
          {/* Enhanced Header Section */}
          <div className="card mb-4 hover-scale" style={{ 
            background: theme.headerGradient,
            border: "none",
            borderRadius: "20px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
            overflow: "hidden"
          }}>
            <div className="card-body text-white position-relative" style={{ padding: "3rem 2rem" }}>
              {/* Background Pattern */}
              <div style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: "200px",
                height: "200px",
                background: "url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><defs><pattern id=\"boxes\" x=\"0\" y=\"0\" width=\"20\" height=\"20\" patternUnits=\"userSpaceOnUse\"><rect x=\"0\" y=\"0\" width=\"10\" height=\"10\" fill=\"%23ffffff\" opacity=\"0.1\"/></pattern></defs><rect width=\"100\" height=\"100\" fill=\"url(%23boxes)\"/></svg>') repeat",
                opacity: 0.3
              }}></div>
              
              <div className="row align-items-center">
                <div className="col-md-8">
                  <div className="d-flex align-items-center">
                    {/* Main Icon */}
                    <div className="dashboard-icon" style={{
                      background: "rgba(255,255,255,0.2)",
                      borderRadius: "20px",
                      padding: "20px",
                      marginRight: "20px",
                      backdropFilter: "blur(10px)"
                    }}>
                      <span style={{ fontSize: "3rem" }}>📊</span>
                    </div>
                    
                    <div>
                      <h1 className="mb-2" style={{ 
                        fontSize: "3rem", 
                        fontWeight: "bold",
                        textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                        background: "linear-gradient(45deg, #ffffff, #f0f8ff)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text"
                      }}>
                        Inventory Dashboard
                      </h1>
                      <p className="mb-0" style={{ 
                        fontSize: "1.2rem", 
                        opacity: 0.9,
                        fontWeight: "300"
                      }}>
                        🚀 Manage your inventory with ease and efficiency
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="col-md-4 text-end">
                  <div className="d-flex flex-column align-items-end">
                    {/* Interactive Icons */}
                    <div className="d-flex gap-2 mb-3 flex-wrap">
                      {/* Dark Mode Toggle */}
                      <div 
                        className="text-center" 
                        style={{ 
                          background: "rgba(255,255,255,0.2)", 
                          borderRadius: "15px", 
                          padding: "12px",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                          backdropFilter: "blur(10px)"
                        }}
                        onClick={() => setDarkMode(!darkMode)}
                        onMouseEnter={(e) => {
                          e.target.style.transform = "scale(1.1)";
                          e.target.style.background = "rgba(255,255,255,0.3)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = "scale(1)";
                          e.target.style.background = "rgba(255,255,255,0.2)";
                        }}
                        title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                      >
                        <div style={{ fontSize: "1.5rem" }}>{darkMode ? '☀️' : '🌙'}</div>
                        <small style={{ fontSize: "0.7rem", opacity: 0.8 }}>Theme</small>
                      </div>

                      {/* Charts Toggle */}
                      <div 
                        className="text-center" 
                        style={{ 
                          background: showCharts ? "rgba(34, 197, 94, 0.3)" : "rgba(255,255,255,0.2)", 
                          borderRadius: "15px", 
                          padding: "12px",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                          backdropFilter: "blur(10px)",
                          border: showCharts ? "2px solid rgba(34, 197, 94, 0.5)" : "2px solid transparent"
                        }}
                        onClick={() => setShowCharts(!showCharts)}
                        onMouseEnter={(e) => {
                          e.target.style.transform = "scale(1.1)";
                          e.target.style.background = showCharts ? "rgba(34, 197, 94, 0.4)" : "rgba(255,255,255,0.3)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = "scale(1)";
                          e.target.style.background = showCharts ? "rgba(34, 197, 94, 0.3)" : "rgba(255,255,255,0.2)";
                        }}
                        title={showCharts ? "Hide Charts View" : "Show Charts View"}
                      >
                        <div style={{ 
                          fontSize: "1.5rem", 
                          filter: showCharts ? "drop-shadow(0 0 8px rgba(34, 197, 94, 0.8))" : "none",
                          transform: showCharts ? "scale(1.1)" : "scale(1)",
                          transition: "all 0.3s ease"
                        }}>
                          {showCharts ? '�' : '�📈'}
                        </div>
                        <small style={{ 
                          fontSize: "0.7rem", 
                          opacity: 0.9,
                          color: showCharts ? "#ffffff" : "inherit",
                          fontWeight: showCharts ? "bold" : "normal"
                        }}>
                          {showCharts ? 'Active' : 'Charts'}
                        </small>
                      </div>

                      {/* Export CSV */}
                      <div 
                        className="text-center" 
                        style={{ 
                          background: "rgba(255,255,255,0.2)", 
                          borderRadius: "15px", 
                          padding: "12px",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                          backdropFilter: "blur(10px)"
                        }}
                        onClick={exportToCSV}
                        onMouseEnter={(e) => {
                          e.target.style.transform = "scale(1.1)";
                          e.target.style.background = "rgba(255,255,255,0.3)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = "scale(1)";
                          e.target.style.background = "rgba(255,255,255,0.2)";
                        }}
                        title="Export to CSV"
                      >
                        <div style={{ fontSize: "1.5rem" }}>📄</div>
                        <small style={{ fontSize: "0.7rem", opacity: 0.8 }}>Export</small>
                      </div>

                      <div 
                        className="text-center" 
                        style={{ 
                          background: "rgba(255,255,255,0.2)", 
                          borderRadius: "15px", 
                          padding: "15px",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                          backdropFilter: "blur(10px)"
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = "scale(1.1)";
                          e.target.style.background = "rgba(255,255,255,0.3)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = "scale(1)";
                          e.target.style.background = "rgba(255,255,255,0.2)";
                        }}
                        title="Notifications"
                      >
                        <div style={{ fontSize: "2rem" }}>🔔</div>
                        <small style={{ fontSize: "0.8rem", opacity: 0.8 }}>Alerts</small>
                      </div>
                      
                      <div 
                        className="text-center" 
                        style={{ 
                          background: "rgba(255,255,255,0.2)", 
                          borderRadius: "15px", 
                          padding: "15px",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                          backdropFilter: "blur(10px)"
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = "scale(1.1)";
                          e.target.style.background = "rgba(255,255,255,0.3)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = "scale(1)";
                          e.target.style.background = "rgba(255,255,255,0.2)";
                        }}
                        title="Settings"
                      >
                        <div style={{ fontSize: "2rem" }}>⚙️</div>
                        <small style={{ fontSize: "0.8rem", opacity: 0.8 }}>Settings</small>
                      </div>
                    </div>
                    
                    {/* Live Status Indicator */}
                    <div className="d-flex align-items-center" style={{ opacity: 0.9 }}>
                      <div 
                        style={{ 
                          width: "10px", 
                          height: "10px", 
                          borderRadius: "50%", 
                          background: "#4CAF50",
                          marginRight: "8px",
                          animation: "pulse 2s infinite"
                        }}
                      ></div>
                      <small style={{ fontSize: "0.9rem" }}>Live Dashboard</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        
        {/* Tab Navigation */}
        <div className="card mb-4" style={{ backgroundColor: theme.cardBackground, border: `1px solid ${theme.borderColor}` }}>
          <div className="card-body p-0">
            <div className="d-flex" role="tablist">
              <button
                className={`btn flex-fill py-3 px-4 rounded-0 border-0 ${activeTab === 'dashboard' ? 'btn-primary' : 'btn-outline-primary'}`}
                style={{
                  backgroundColor: activeTab === 'dashboard' ? theme.buttonPrimary : 'transparent',
                  color: activeTab === 'dashboard' ? '#ffffff' : theme.textColor,
                  borderBottom: activeTab === 'dashboard' ? `3px solid ${theme.buttonPrimary}` : `3px solid transparent`,
                  borderRadius: '0',
                  fontWeight: activeTab === 'dashboard' ? 'bold' : 'normal',
                  fontSize: '1.1rem',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => setActiveTab('dashboard')}
              >
                📊 Dashboard
              </button>
              <button
                className={`btn flex-fill py-3 px-4 rounded-0 border-0 ${activeTab === 'ecommerce' ? 'btn-primary' : 'btn-outline-primary'}`}
                style={{
                  backgroundColor: activeTab === 'ecommerce' ? theme.buttonPrimary : 'transparent',
                  color: activeTab === 'ecommerce' ? '#ffffff' : theme.textColor,
                  borderBottom: activeTab === 'ecommerce' ? `3px solid ${theme.buttonPrimary}` : `3px solid transparent`,
                  borderRadius: '0',
                  fontWeight: activeTab === 'ecommerce' ? 'bold' : 'normal',
                  fontSize: '1.1rem',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => setActiveTab('ecommerce')}
              >
                � E-Commerce {getCartItemCount() > 0 && <span className="badge bg-danger ms-2">{getCartItemCount()}</span>}
              </button>
              <button
                className={`btn flex-fill py-3 px-4 rounded-0 border-0 ${activeTab === 'analytics' ? 'btn-primary' : 'btn-outline-primary'}`}
                style={{
                  backgroundColor: activeTab === 'analytics' ? theme.buttonPrimary : 'transparent',
                  color: activeTab === 'analytics' ? '#ffffff' : theme.textColor,
                  borderBottom: activeTab === 'analytics' ? `3px solid ${theme.buttonPrimary}` : `3px solid transparent`,
                  borderRadius: '0',
                  fontWeight: activeTab === 'analytics' ? 'bold' : 'normal',
                  fontSize: '1.1rem',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => setActiveTab('analytics')}
              >
                � Sales Analytics
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Tab Content */}
        {activeTab === 'dashboard' && (
          <div className="dashboard-content">
        
        {/* Summary Cards */}
        <div className="row mb-4">
          <div className="col-md-3">
            <div className="card text-center h-100" style={{ backgroundColor: theme.cardBackground, color: theme.textColor, border: `1px solid ${theme.borderColor}` }}>
              <div className="card-body">
                <h5 className="card-title text-primary">📦 Total Items</h5>
                <h2 className="card-text">{totalItems}</h2>
                <small style={{ color: theme.textMuted }}>Items in inventory</small>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center h-100" style={{ backgroundColor: theme.cardBackground, color: theme.textColor, border: `1px solid ${theme.borderColor}` }}>
              <div className="card-body">
                <h5 className="card-title text-danger">⚠️ Low Stock</h5>
                <h2 className="card-text">{lowQuantityItems.length}</h2>
                <small style={{ color: theme.textMuted }}>Items below {LOW_QUANTITY_THRESHOLD} units</small>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center h-100" style={{ backgroundColor: theme.cardBackground, color: theme.textColor, border: `1px solid ${theme.borderColor}` }}>
              <div className="card-body">
                <h5 className="card-title text-success">💰 Total Value</h5>
                <h2 className="card-text">₹{items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString('en-IN')}</h2>
                <small style={{ color: theme.textMuted }}>Total inventory worth</small>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center h-100" style={{ backgroundColor: theme.cardBackground, color: theme.textColor, border: `1px solid ${theme.borderColor}` }}>
              <div className="card-body">
                <h5 className="card-title text-info">📊 Categories</h5>
                <h2 className="card-text">{[...new Set(items.map(item => item.type))].length}</h2>
                <small style={{ color: theme.textMuted }}>Product categories</small>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        {showCharts && (
          <div className="row mb-4">
            <div className="col-md-6">
              <div className="card h-100" style={{ backgroundColor: theme.cardBackground, color: theme.textColor, border: `1px solid ${theme.borderColor}` }}>
                <div className="card-header" style={{ backgroundColor: theme.cardBackground, borderBottom: `1px solid ${theme.borderColor}` }}>
                  <h5 className="mb-0">📊 Quantity by Category</h5>
                </div>
                <div className="card-body">
                  {Object.entries(chartData.categoryData()).map(([category, quantity]) => {
                    const maxQuantity = Math.max(...Object.values(chartData.categoryData()));
                    const percentage = (quantity / maxQuantity) * 100;
                    return (
                      <div key={category} className="mb-3">
                        <div className="d-flex justify-content-between mb-1">
                          <small style={{ color: theme.textColor }}>{category}</small>
                          <small style={{ color: theme.textMuted }}>{quantity} items</small>
                        </div>
                        <div className="progress" style={{ height: '20px', backgroundColor: theme.borderColor }}>
                          <div 
                            className="progress-bar bg-primary" 
                            role="progressbar" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card h-100" style={{ backgroundColor: theme.cardBackground, color: theme.textColor, border: `1px solid ${theme.borderColor}` }}>
                <div className="card-header" style={{ backgroundColor: theme.cardBackground, borderBottom: `1px solid ${theme.borderColor}` }}>
                  <h5 className="mb-0">💰 Value by Category</h5>
                </div>
                <div className="card-body">
                  {Object.entries(chartData.valueByCategory()).map(([category, value]) => {
                    const maxValue = Math.max(...Object.values(chartData.valueByCategory()));
                    const percentage = (value / maxValue) * 100;
                    return (
                      <div key={category} className="mb-3">
                        <div className="d-flex justify-content-between mb-1">
                          <small style={{ color: theme.textColor }}>{category}</small>
                          <small style={{ color: theme.textMuted }}>₹{value.toLocaleString('en-IN')}</small>
                        </div>
                        <div className="progress" style={{ height: '20px', backgroundColor: theme.borderColor }}>
                          <div 
                            className="progress-bar bg-success" 
                            role="progressbar" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="card mb-4" style={{ backgroundColor: theme.cardBackground, color: theme.textColor, border: `1px solid ${theme.borderColor}` }}>
          <div className="card-body">
            <div className="row align-items-center mb-3">
              <div className="col-md-6">
                <div className="d-flex align-items-center">
                  <label className="form-label me-3 mb-0"><strong>🔍 Search:</strong></label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by name, code, or category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ 
                      maxWidth: "300px",
                      backgroundColor: theme.cardBackground,
                      color: theme.textColor,
                      borderColor: theme.borderColor
                    }}
                  />
                  {searchTerm && (
                    <button
                      className="btn btn-outline-secondary ms-2"
                      onClick={() => setSearchTerm('')}
                      title="Clear search"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
              <div className="col-md-6 text-end">
                <button 
                  className="btn btn-success me-2"
                  onClick={() => setShowAddForm(true)}
                  style={{ backgroundColor: theme.buttonSecondary, borderColor: theme.buttonSecondary }}
                >
                  + Add New Item
                </button>
                <button 
                  className="btn btn-outline-primary"
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  style={{ borderColor: theme.buttonPrimary, color: theme.buttonPrimary }}
                >
                  🔧 {showAdvancedFilters ? 'Hide' : 'Show'} Advanced Filters
                </button>
              </div>
            </div>

            {/* Advanced Filters */}
            {showAdvancedFilters && (
              <div className="row mt-3 pt-3" style={{ borderTop: `1px solid ${theme.borderColor}` }}>
                <div className="col-md-6">
                  <h6 style={{ color: theme.textColor }}>💰 Price Range</h6>
                  <div className="row">
                    <div className="col-6">
                      <label className="form-label" style={{ color: theme.textMuted }}>Min Price (₹)</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="0"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                        style={{ backgroundColor: theme.cardBackground, color: theme.textColor, borderColor: theme.borderColor }}
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label" style={{ color: theme.textMuted }}>Max Price (₹)</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="No limit"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                        style={{ backgroundColor: theme.cardBackground, color: theme.textColor, borderColor: theme.borderColor }}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <h6 style={{ color: theme.textColor }}>📦 Quantity Range</h6>
                  <div className="row">
                    <div className="col-6">
                      <label className="form-label" style={{ color: theme.textMuted }}>Min Quantity</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="0"
                        value={quantityRange.min}
                        onChange={(e) => setQuantityRange(prev => ({ ...prev, min: e.target.value }))}
                        style={{ backgroundColor: theme.cardBackground, color: theme.textColor, borderColor: theme.borderColor }}
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label" style={{ color: theme.textMuted }}>Max Quantity</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="No limit"
                        value={quantityRange.max}
                        onChange={(e) => setQuantityRange(prev => ({ ...prev, max: e.target.value }))}
                        style={{ backgroundColor: theme.cardBackground, color: theme.textColor, borderColor: theme.borderColor }}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-12 mt-3">
                  <button 
                    className="btn btn-outline-warning me-2"
                    onClick={() => {
                      setPriceRange({ min: '', max: '' });
                      setQuantityRange({ min: '', max: '' });
                      setFilterType('all');
                      setSearchTerm('');
                    }}
                    style={{ borderColor: '#ffc107', color: '#ffc107' }}
                  >
                    🔄 Clear All Filters
                  </button>
                  <small style={{ color: theme.textMuted }}>
                    Showing {filteredAndSortedItems.length} of {items.length} items
                  </small>
                </div>
              </div>
            )}

            <div className="row align-items-center">
              <div className="col-md-3">
                <div className="d-flex align-items-center">
                  <label className="form-label me-3 mb-0"><strong>Filter:</strong></label>
                  <select 
                    className="form-select w-auto"
                    value={filterType} 
                    onChange={(e) => setFilterType(e.target.value)}
                    style={{ backgroundColor: theme.cardBackground, color: theme.textColor, borderColor: theme.borderColor }}
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
                    style={{ backgroundColor: theme.cardBackground, color: theme.textColor, borderColor: theme.borderColor }}
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                    <option value={25}>25</option>
                  </select>
                </div>
              </div>
              <div className="col-md-6 text-end">
                <small style={{ color: theme.textMuted }}>
                  Showing {startIndex + 1}-{Math.min(endIndex, filteredAndSortedItems.length)} of {filteredAndSortedItems.length} items
                  {filterType !== 'all' && ` (filtered from ${totalItems} total)`}
                  {searchTerm && ` (search: "${searchTerm}")`}
                </small>
              </div>
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
        <div className="card" style={{ backgroundColor: theme.cardBackground, color: theme.textColor, border: `1px solid ${theme.borderColor}` }}>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover" style={{ color: theme.textColor }}>
                <thead>
                  <tr>
                    <th 
                      style={{ 
                        cursor: "pointer", 
                        userSelect: "none",
                        backgroundColor: darkMode ? "#374151" : "#e3f2fd",
                        color: darkMode ? "#60a5fa" : "#1976d2",
                        fontWeight: "bold",
                        border: `1px solid ${theme.borderColor}`
                      }}
                      onClick={() => handleSort('name')}
                    >
                      Item Name{getSortIcon('name')}
                    </th>
                    <th 
                      style={{ 
                        cursor: "pointer", 
                        userSelect: "none",
                        backgroundColor: darkMode ? "#374151" : "#e3f2fd",
                        color: darkMode ? "#60a5fa" : "#1976d2",
                        fontWeight: "bold",
                        border: `1px solid ${theme.borderColor}`
                      }}
                      onClick={() => handleSort('type')}
                    >
                      Category{getSortIcon('type')}
                    </th>
                    <th 
                      style={{ 
                        cursor: "pointer", 
                        userSelect: "none",
                        backgroundColor: darkMode ? "#374151" : "#e3f2fd",
                        color: darkMode ? "#60a5fa" : "#1976d2",
                        fontWeight: "bold",
                        border: `1px solid ${theme.borderColor}`
                      }}
                      onClick={() => handleSort('code')}
                    >
                      Code{getSortIcon('code')}
                    </th>
                    <th 
                      style={{ 
                        cursor: "pointer", 
                        userSelect: "none",
                        backgroundColor: darkMode ? "#374151" : "#e3f2fd",
                        color: darkMode ? "#60a5fa" : "#1976d2",
                        fontWeight: "bold",
                        border: `1px solid ${theme.borderColor}`
                      }}
                      onClick={() => handleSort('quantity')}
                    >
                      Quantity{getSortIcon('quantity')}
                    </th>
                    <th 
                      style={{ 
                        cursor: "pointer", 
                        userSelect: "none",
                        backgroundColor: darkMode ? "#374151" : "#e3f2fd",
                        color: darkMode ? "#60a5fa" : "#1976d2",
                        fontWeight: "bold",
                        border: `1px solid ${theme.borderColor}`
                      }}
                      onClick={() => handleSort('price')}
                    >
                      Price{getSortIcon('price')}
                    </th>
                    <th 
                      style={{ 
                        backgroundColor: darkMode ? "#374151" : "#e3f2fd",
                        color: darkMode ? "#60a5fa" : "#1976d2",
                        fontWeight: "bold",
                        border: `1px solid ${theme.borderColor}`
                      }}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((item) => (
                    <tr 
                      key={item.id} 
                      className={item.quantity < LOW_QUANTITY_THRESHOLD ? 'table-warning' : ''}
                      style={{ 
                        backgroundColor: darkMode && item.quantity < LOW_QUANTITY_THRESHOLD ? '#92400e' : 
                                        darkMode ? theme.cardBackground : '',
                        color: theme.textColor,
                        borderColor: theme.borderColor
                      }}
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

        {/* Toast Notifications */}
        <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1050 }}>
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`toast show mb-2 ${
                notification.type === 'success' ? 'bg-success' : 'bg-danger'
              } text-white`}
              role="alert"
            >
              <div className="toast-header">
                <strong className="me-auto">
                  {notification.type === 'success' ? '✅ Success' : '❌ Error'}
                </strong>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => removeNotification(notification.id)}
                ></button>
              </div>
              <div className="toast-body">
                {notification.message}
              </div>
            </div>
          ))}
        </div>
          </div>
        )}

        {/* E-Commerce Tab Content */}
        {activeTab === 'ecommerce' && (
          <div className="ecommerce-content">
            {/* E-Commerce Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 style={{ color: theme.textColor }}>🛒 Online Store</h2>
              <div className="d-flex gap-2">
                <button
                  className="btn btn-outline-primary position-relative"
                  onClick={() => setShowCart(!showCart)}
                  style={{ borderColor: theme.buttonPrimary, color: theme.buttonPrimary }}
                >
                  🛒 Cart
                  {getCartItemCount() > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {getCartItemCount()}
                    </span>
                  )}
                </button>
                {orders.length > 0 && (
                  <button
                    className="btn btn-outline-success"
                    onClick={() => alert(`You have ${orders.length} order(s)`)}
                  >
                    📦 Orders ({orders.length})
                  </button>
                )}
              </div>
            </div>

            {/* Shopping Cart Modal */}
            {showCart && (
              <div className="card mb-4" style={{ backgroundColor: theme.cardBackground, border: `1px solid ${theme.borderColor}` }}>
                <div className="card-header d-flex justify-content-between align-items-center" style={{ backgroundColor: theme.cardBackground, borderBottom: `1px solid ${theme.borderColor}` }}>
                  <h5 className="mb-0" style={{ color: theme.textColor }}>🛒 Shopping Cart</h5>
                  <button className="btn btn-outline-secondary btn-sm" onClick={() => setShowCart(false)}>✕</button>
                </div>
                <div className="card-body">
                  {cart.length === 0 ? (
                    <p style={{ color: theme.textMuted, textAlign: 'center' }}>Your cart is empty</p>
                  ) : (
                    <>
                      {cart.map(item => (
                        <div key={item.id} className="d-flex justify-content-between align-items-center mb-3 p-3" style={{ backgroundColor: darkMode ? '#374151' : '#f8f9fa', borderRadius: '8px' }}>
                          <div>
                            <h6 style={{ color: theme.textColor, margin: 0 }}>{item.name}</h6>
                            <small style={{ color: theme.textMuted }}>₹{item.price.toLocaleString('en-IN')} each</small>
                          </div>
                          <div className="d-flex align-items-center gap-2">
                            <button
                              className="btn btn-outline-secondary btn-sm"
                              onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                            >-</button>
                            <span style={{ color: theme.textColor, minWidth: '30px', textAlign: 'center' }}>{item.quantity}</span>
                            <button
                              className="btn btn-outline-secondary btn-sm"
                              onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                            >+</button>
                            <button
                              className="btn btn-outline-danger btn-sm ms-2"
                              onClick={() => removeFromCart(item.id)}
                            >🗑️</button>
                          </div>
                        </div>
                      ))}
                      <hr style={{ borderColor: theme.borderColor }} />
                      <div className="d-flex justify-content-between align-items-center">
                        <h5 style={{ color: theme.textColor }}>Total: ₹{getCartTotal().toLocaleString('en-IN')}</h5>
                        <button
                          className="btn btn-success"
                          onClick={() => setShowCheckout(true)}
                          style={{ backgroundColor: theme.buttonSecondary, borderColor: theme.buttonSecondary }}
                        >
                          Proceed to Checkout
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Checkout Form */}
            {showCheckout && (
              <div className="card mb-4" style={{ backgroundColor: theme.cardBackground, border: `1px solid ${theme.borderColor}` }}>
                <div className="card-header" style={{ backgroundColor: theme.cardBackground, borderBottom: `1px solid ${theme.borderColor}` }}>
                  <h5 className="mb-0" style={{ color: theme.textColor }}>📋 Checkout</h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <h6 style={{ color: theme.textColor }}>Customer Information</h6>
                      <div className="mb-3">
                        <label className="form-label" style={{ color: theme.textColor }}>
                          Name <span style={{ color: '#dc3545' }}>*</span>
                        </label>
                        <input
                          type="text"
                          className={`form-control ${!customerInfo.name.trim() ? 'is-invalid' : ''}`}
                          value={customerInfo.name}
                          onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                          placeholder="Enter your full name"
                          style={{ backgroundColor: theme.cardBackground, color: theme.textColor, borderColor: theme.borderColor }}
                          required
                        />
                        {!customerInfo.name.trim() && (
                          <div className="invalid-feedback">Name is required</div>
                        )}
                      </div>
                      <div className="mb-3">
                        <label className="form-label" style={{ color: theme.textColor }}>
                          Email <span style={{ color: '#dc3545' }}>*</span>
                        </label>
                        <input
                          type="email"
                          className={`form-control ${!customerInfo.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email) ? 'is-invalid' : ''}`}
                          value={customerInfo.email}
                          onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                          placeholder="Enter your email address"
                          style={{ backgroundColor: theme.cardBackground, color: theme.textColor, borderColor: theme.borderColor }}
                          required
                        />
                        {!customerInfo.email.trim() && (
                          <div className="invalid-feedback">Email is required</div>
                        )}
                        {customerInfo.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email) && (
                          <div className="invalid-feedback">Please enter a valid email address</div>
                        )}
                      </div>
                      <div className="mb-3">
                        <label className="form-label" style={{ color: theme.textColor }}>
                          Phone <span style={{ color: '#dc3545' }}>*</span>
                        </label>
                        <input
                          type="tel"
                          className={`form-control ${!customerInfo.phone.trim() || !/^[\d\s\-\+\(\)]{10,15}$/.test(customerInfo.phone) ? 'is-invalid' : ''}`}
                          value={customerInfo.phone}
                          onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                          placeholder="Enter your phone number"
                          style={{ backgroundColor: theme.cardBackground, color: theme.textColor, borderColor: theme.borderColor }}
                          required
                        />
                        {!customerInfo.phone.trim() && (
                          <div className="invalid-feedback">Phone number is required</div>
                        )}
                        {customerInfo.phone.trim() && !/^[\d\s\-\+\(\)]{10,15}$/.test(customerInfo.phone) && (
                          <div className="invalid-feedback">Please enter a valid phone number (10-15 digits)</div>
                        )}
                      </div>
                      <div className="mb-3">
                        <label className="form-label" style={{ color: theme.textColor }}>
                          Address <span style={{ color: '#dc3545' }}>*</span>
                        </label>
                        <textarea
                          className={`form-control ${!customerInfo.address.trim() ? 'is-invalid' : ''}`}
                          rows="3"
                          value={customerInfo.address}
                          onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                          placeholder="Enter your complete address"
                          style={{ backgroundColor: theme.cardBackground, color: theme.textColor, borderColor: theme.borderColor }}
                          required
                        />
                        {!customerInfo.address.trim() && (
                          <div className="invalid-feedback">Address is required</div>
                        )}
                      </div>
                      <div className="alert alert-info" style={{ fontSize: '0.9rem' }}>
                        <strong>📋 Note:</strong> All fields marked with <span style={{ color: '#dc3545' }}>*</span> are mandatory to place your order.
                      </div>
                    </div>
                    <div className="col-md-6">
                      <h6 style={{ color: theme.textColor }}>Order Summary</h6>
                      <div style={{ backgroundColor: darkMode ? '#374151' : '#f8f9fa', padding: '1rem', borderRadius: '8px' }}>
                        {cart.map(item => (
                          <div key={item.id} className="mb-3 p-2" style={{ backgroundColor: darkMode ? '#2d3748' : '#ffffff', borderRadius: '6px', border: `1px solid ${theme.borderColor}` }}>
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <div className="flex-grow-1">
                                <h6 style={{ color: theme.textColor, margin: 0 }}>{item.name}</h6>
                                <small style={{ color: theme.textMuted }}>₹{item.price.toLocaleString('en-IN')} each</small>
                              </div>
                              <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => removeFromCart(item.id)}
                                title="Remove from cart"
                                style={{ borderColor: '#dc3545', color: '#dc3545', padding: '2px 8px' }}
                              >
                                🗑️
                              </button>
                            </div>
                            <div className="d-flex justify-content-between align-items-center">
                              <div className="d-flex align-items-center gap-2">
                                <button
                                  className="btn btn-outline-secondary btn-sm"
                                  onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                                  style={{ padding: '2px 8px', fontSize: '0.8rem' }}
                                >
                                  -
                                </button>
                                <span style={{ 
                                  color: theme.textColor, 
                                  minWidth: '30px', 
                                  textAlign: 'center',
                                  fontWeight: 'bold'
                                }}>
                                  {item.quantity}
                                </span>
                                <button
                                  className="btn btn-outline-secondary btn-sm"
                                  onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                                  style={{ padding: '2px 8px', fontSize: '0.8rem' }}
                                >
                                  +
                                </button>
                              </div>
                              <div className="text-end">
                                <div style={{ color: theme.textColor, fontWeight: 'bold' }}>
                                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                        {cart.length === 0 && (
                          <div className="text-center py-3">
                            <p style={{ color: theme.textMuted, margin: 0 }}>Your cart is empty</p>
                          </div>
                        )}
                        <hr style={{ borderColor: theme.borderColor }} />
                        <div className="d-flex justify-content-between align-items-center">
                          <strong style={{ color: theme.textColor, fontSize: '1.2rem' }}>
                            Total: ₹{getCartTotal().toLocaleString('en-IN')}
                          </strong>
                          <small style={{ color: theme.textMuted }}>
                            {getCartItemCount()} item(s)
                          </small>
                        </div>
                      </div>
                      <div className="mt-3 d-flex gap-2">
                        <button
                          className="btn btn-secondary"
                          onClick={() => setShowCheckout(false)}
                        >
                          Cancel
                        </button>
                        <button
                          className="btn btn-success flex-fill"
                          onClick={placeOrder}
                          disabled={cart.length === 0}
                          style={{ 
                            backgroundColor: cart.length === 0 ? '#6c757d' : theme.buttonSecondary, 
                            borderColor: cart.length === 0 ? '#6c757d' : theme.buttonSecondary 
                          }}
                        >
                          {cart.length === 0 ? 'Cart is Empty' : 'Place Order'}
                        </button>
                      </div>
                      {cart.length > 0 && (
                        <div className="mt-2">
                          <small style={{ color: theme.textMuted }}>
                            💡 You can still modify quantities or remove items above
                          </small>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Product Grid */}
            <div className="row">
              {items.map(item => (
                <div key={item.id} className="col-md-4 col-lg-3 mb-4">
                  <div className="card h-100" style={{ backgroundColor: theme.cardBackground, border: `1px solid ${theme.borderColor}`, transition: 'transform 0.2s ease' }}>
                    <div className="card-body d-flex flex-column">
                      <div className="text-center mb-3">
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                          {item.type === 'Electronics' ? '💻' : 
                           item.type === 'Furniture' ? '🪑' : '📝'}
                        </div>
                        <h5 className="card-title" style={{ color: theme.textColor }}>{item.name}</h5>
                        <span className={`badge mb-2 ${
                          item.type === "Electronics" ? 'bg-info' :
                          item.type === "Furniture" ? 'bg-secondary' :
                          'bg-success'
                        }`}>
                          {item.type}
                        </span>
                      </div>
                      
                      <div className="flex-grow-1">
                        <p style={{ color: theme.textMuted, fontSize: '0.9rem' }}>Code: {item.code}</p>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span style={{ color: theme.textColor }}>Stock:</span>
                          <span style={{ 
                            color: item.quantity < LOW_QUANTITY_THRESHOLD ? '#dc3545' : theme.textColor,
                            fontWeight: item.quantity < LOW_QUANTITY_THRESHOLD ? 'bold' : 'normal'
                          }}>
                            {item.quantity} left
                          </span>
                        </div>
                        {item.quantity < LOW_QUANTITY_THRESHOLD && (
                          <div className="alert alert-warning p-2 mb-2" style={{ fontSize: '0.8rem' }}>
                            ⚠️ Low Stock!
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-auto">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: theme.textColor }}>
                            ₹{item.price.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <button
                          className="btn btn-primary w-100"
                          onClick={() => addToCart(item)}
                          disabled={item.quantity === 0}
                          style={{ 
                            backgroundColor: item.quantity === 0 ? '#6c757d' : theme.buttonPrimary, 
                            borderColor: item.quantity === 0 ? '#6c757d' : theme.buttonPrimary 
                          }}
                        >
                          {item.quantity === 0 ? 'Out of Stock' : '🛒 Add to Cart'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Orders */}
            {orders.length > 0 && (
              <div className="card mt-4" style={{ backgroundColor: theme.cardBackground, border: `1px solid ${theme.borderColor}` }}>
                <div className="card-header" style={{ backgroundColor: theme.cardBackground, borderBottom: `1px solid ${theme.borderColor}` }}>
                  <h5 className="mb-0" style={{ color: theme.textColor }}>📦 Recent Orders</h5>
                </div>
                <div className="card-body">
                  {orders.slice(0, 3).map(order => (
                    <div key={order.id} className="border-bottom pb-3 mb-3" style={{ borderColor: theme.borderColor }}>
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                          <h6 style={{ color: theme.textColor }}>Order #{order.orderNumber || order.id}</h6>
                          <p style={{ color: theme.textMuted, margin: 0 }}>
                            {new Date(order.date).toLocaleDateString()} - {order.customer.name}
                          </p>
                          <p style={{ color: theme.textMuted, fontSize: '0.9rem' }}>
                            {order.items.length} item(s) - Total: ₹{(order.grandTotal || order.total).toLocaleString('en-IN')}
                          </p>
                        </div>
                        <div className="d-flex flex-column gap-2">
                          <span className="badge bg-success">{order.status}</span>
                          {order.billGenerated && (
                            <button
                              className="btn btn-outline-primary btn-sm"
                              onClick={() => generateBill(order)}
                              style={{ fontSize: '0.8rem', padding: '4px 8px' }}
                            >
                              📄 View Bill
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Sales Analytics Tab Content */}
        {activeTab === 'analytics' && (
          <div className="analytics-content">
            {/* Analytics Summary Cards */}
            <div className="row mb-4">
              <div className="col-md-3">
                <div className="card text-center h-100" style={{ backgroundColor: theme.cardBackground, color: theme.textColor, border: `1px solid ${theme.borderColor}` }}>
                  <div className="card-body">
                    <h5 className="card-title text-success">📈 Daily Sales</h5>
                    <h2 className="card-text">{salesAnalytics.dailySales().reduce((sum, sale) => sum + sale.quantity, 0)}</h2>
                    <small style={{ color: theme.textMuted }}>Items sold today</small>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card text-center h-100" style={{ backgroundColor: theme.cardBackground, color: theme.textColor, border: `1px solid ${theme.borderColor}` }}>
                  <div className="card-body">
                    <h5 className="card-title text-info">📅 Weekly Sales</h5>
                    <h2 className="card-text">{salesAnalytics.weeklySales().reduce((sum, sale) => sum + sale.quantity, 0)}</h2>
                    <small style={{ color: theme.textMuted }}>Items sold this week</small>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card text-center h-100" style={{ backgroundColor: theme.cardBackground, color: theme.textColor, border: `1px solid ${theme.borderColor}` }}>
                  <div className="card-body">
                    <h5 className="card-title text-primary">📊 Monthly Sales</h5>
                    <h2 className="card-text">{salesAnalytics.monthlySales().reduce((sum, sale) => sum + sale.quantity, 0)}</h2>
                    <small style={{ color: theme.textMuted }}>Items sold this month</small>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card text-center h-100" style={{ backgroundColor: theme.cardBackground, color: theme.textColor, border: `1px solid ${theme.borderColor}` }}>
                  <div className="card-body">
                    <h5 className="card-title text-warning">💰 Monthly Revenue</h5>
                    <h2 className="card-text">₹{Object.values(salesAnalytics.revenueByCategory('monthly')).reduce((sum, rev) => sum + rev, 0).toLocaleString('en-IN')}</h2>
                    <small style={{ color: theme.textMuted }}>Revenue this month</small>
                  </div>
                </div>
              </div>
            </div>

            {/* Analytics Charts */}
            <div className="row mb-4">
              <div className="col-md-6">
                <div className="card h-100" style={{ backgroundColor: theme.cardBackground, color: theme.textColor, border: `1px solid ${theme.borderColor}` }}>
                  <div className="card-header" style={{ backgroundColor: theme.cardBackground, borderBottom: `1px solid ${theme.borderColor}` }}>
                    <h5 className="mb-0">📊 Daily Sales by Category</h5>
                  </div>
                  <div className="card-body">
                    {Object.entries(salesAnalytics.salesByCategory('daily')).map(([category, quantity]) => {
                      const maxQuantity = Math.max(...Object.values(salesAnalytics.salesByCategory('daily')));
                      const percentage = maxQuantity > 0 ? (quantity / maxQuantity) * 100 : 0;
                      return (
                        <div key={category} className="mb-3">
                          <div className="d-flex justify-content-between mb-1">
                            <small style={{ color: theme.textColor }}>{category}</small>
                            <small style={{ color: theme.textMuted }}>{quantity} items</small>
                          </div>
                          <div className="progress" style={{ height: '20px', backgroundColor: theme.borderColor }}>
                            <div 
                              className="progress-bar bg-success" 
                              role="progressbar" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                    {Object.keys(salesAnalytics.salesByCategory('daily')).length === 0 && (
                      <p style={{ color: theme.textMuted, textAlign: 'center', marginTop: '2rem' }}>No sales today yet</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card h-100" style={{ backgroundColor: theme.cardBackground, color: theme.textColor, border: `1px solid ${theme.borderColor}` }}>
                  <div className="card-header" style={{ backgroundColor: theme.cardBackground, borderBottom: `1px solid ${theme.borderColor}` }}>
                    <h5 className="mb-0">📅 Weekly Sales by Category</h5>
                  </div>
                  <div className="card-body">
                    {Object.entries(salesAnalytics.salesByCategory('weekly')).map(([category, quantity]) => {
                      const maxQuantity = Math.max(...Object.values(salesAnalytics.salesByCategory('weekly')));
                      const percentage = (quantity / maxQuantity) * 100;
                      return (
                        <div key={category} className="mb-3">
                          <div className="d-flex justify-content-between mb-1">
                            <small style={{ color: theme.textColor }}>{category}</small>
                            <small style={{ color: theme.textMuted }}>{quantity} items</small>
                          </div>
                          <div className="progress" style={{ height: '20px', backgroundColor: theme.borderColor }}>
                            <div 
                              className="progress-bar bg-info" 
                              role="progressbar" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="row mb-4">
              <div className="col-md-6">
                <div className="card h-100" style={{ backgroundColor: theme.cardBackground, color: theme.textColor, border: `1px solid ${theme.borderColor}` }}>
                  <div className="card-header" style={{ backgroundColor: theme.cardBackground, borderBottom: `1px solid ${theme.borderColor}` }}>
                    <h5 className="mb-0">📊 Monthly Sales by Category</h5>
                  </div>
                  <div className="card-body">
                    {Object.entries(salesAnalytics.salesByCategory('monthly')).map(([category, quantity]) => {
                      const maxQuantity = Math.max(...Object.values(salesAnalytics.salesByCategory('monthly')));
                      const percentage = (quantity / maxQuantity) * 100;
                      return (
                        <div key={category} className="mb-3">
                          <div className="d-flex justify-content-between mb-1">
                            <small style={{ color: theme.textColor }}>{category}</small>
                            <small style={{ color: theme.textMuted }}>{quantity} items</small>
                          </div>
                          <div className="progress" style={{ height: '20px', backgroundColor: theme.borderColor }}>
                            <div 
                              className="progress-bar bg-primary" 
                              role="progressbar" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card h-100" style={{ backgroundColor: theme.cardBackground, color: theme.textColor, border: `1px solid ${theme.borderColor}` }}>
                  <div className="card-header" style={{ backgroundColor: theme.cardBackground, borderBottom: `1px solid ${theme.borderColor}` }}>
                    <h5 className="mb-0">🏆 Top Selling Items (Monthly)</h5>
                  </div>
                  <div className="card-body">
                    {salesAnalytics.topSellingItems('monthly', 5).map((item, index) => (
                      <div key={item.name} className="d-flex justify-content-between align-items-center mb-2 p-2" style={{ backgroundColor: darkMode ? '#374151' : '#f8f9fa', borderRadius: '8px' }}>
                        <div className="d-flex align-items-center">
                          <span className="badge bg-warning me-2" style={{ minWidth: '25px' }}>#{index + 1}</span>
                          <span style={{ color: theme.textColor }}>{item.name}</span>
                        </div>
                        <span style={{ color: theme.textMuted, fontWeight: 'bold' }}>{item.quantity} sold</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Revenue Analytics */}
            <div className="row mb-4">
              <div className="col-12">
                <div className="card" style={{ backgroundColor: theme.cardBackground, color: theme.textColor, border: `1px solid ${theme.borderColor}` }}>
                  <div className="card-header" style={{ backgroundColor: theme.cardBackground, borderBottom: `1px solid ${theme.borderColor}` }}>
                    <h5 className="mb-0">💰 Revenue Analytics by Category</h5>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-4">
                        <h6 style={{ color: theme.textColor }}>Daily Revenue</h6>
                        {Object.entries(salesAnalytics.revenueByCategory('daily')).map(([category, revenue]) => (
                          <div key={category} className="d-flex justify-content-between mb-2">
                            <span style={{ color: theme.textColor }}>{category}</span>
                            <span style={{ color: theme.textMuted }}>₹{revenue.toLocaleString('en-IN')}</span>
                          </div>
                        ))}
                        {Object.keys(salesAnalytics.revenueByCategory('daily')).length === 0 && (
                          <p style={{ color: theme.textMuted }}>No revenue today</p>
                        )}
                      </div>
                      <div className="col-md-4">
                        <h6 style={{ color: theme.textColor }}>Weekly Revenue</h6>
                        {Object.entries(salesAnalytics.revenueByCategory('weekly')).map(([category, revenue]) => (
                          <div key={category} className="d-flex justify-content-between mb-2">
                            <span style={{ color: theme.textColor }}>{category}</span>
                            <span style={{ color: theme.textMuted }}>₹{revenue.toLocaleString('en-IN')}</span>
                          </div>
                        ))}
                      </div>
                      <div className="col-md-4">
                        <h6 style={{ color: theme.textColor }}>Monthly Revenue</h6>
                        {Object.entries(salesAnalytics.revenueByCategory('monthly')).map(([category, revenue]) => (
                          <div key={category} className="d-flex justify-content-between mb-2">
                            <span style={{ color: theme.textColor }}>{category}</span>
                            <span style={{ color: theme.textMuted }}>₹{revenue.toLocaleString('en-IN')}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        </div>
      </div>
    </>
  );
}

export default App;