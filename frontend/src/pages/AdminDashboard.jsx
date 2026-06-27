import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  BarChart3, 
  Package, 
  ShoppingBag, 
  AlertTriangle, 
  Plus, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  RefreshCw, 
  Layers 
} from 'lucide-react';

const AdminDashboard = () => {
  const { isAuthenticated, api, logout } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'products', 'orders'

  // Product CRUD states
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    category: 'Premium',
    price: '',
    packageSizes: '5kg, 10kg, 25kg, 50kg',
    imageUrl: '',
    inStock: true,
    stockQuantity: ''
  });
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchData();
  }, [isAuthenticated, navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const prodRes = await api.get('/products');
      setProducts(prodRes.data);

      const orderRes = await api.get('/orders');
      setOrders(orderRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Product Form Handlers
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      description: '',
      category: 'Premium',
      price: '',
      packageSizes: '5kg, 10kg, 25kg, 50kg',
      imageUrl: '',
      inStock: true,
      stockQuantity: ''
    });
    setFormError(null);
    setShowProductModal(true);
  };

  const handleOpenEditModal = (prod) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      description: prod.description,
      category: prod.category,
      price: prod.price,
      packageSizes: prod.packageSizes.join(', '),
      imageUrl: prod.imageUrl,
      inStock: prod.inStock,
      stockQuantity: prod.stockQuantity
    });
    setFormError(null);
    setShowProductModal(true);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    // Validate
    if (!productForm.name || !productForm.description || !productForm.price || !productForm.stockQuantity) {
      setFormError('Please enter all required fields.');
      return;
    }

    const payload = {
      ...productForm,
      price: Number(productForm.price),
      stockQuantity: Number(productForm.stockQuantity),
      packageSizes: productForm.packageSizes.split(',').map(s => s.trim()).filter(s => s.length > 0)
    };

    try {
      if (editingProduct) {
        // Edit API call
        await api.put(`/products/${editingProduct._id}`, payload);
      } else {
        // Add API call
        await api.post('/products', payload);
      }
      setShowProductModal(false);
      fetchData();
    } catch (err) {
      console.error(err);
      setFormError(err.response?.data?.message || 'Error processing product operation.');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product variant?')) return;
    try {
      await api.delete(`/products/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Failed to delete product.');
    }
  };

  // Order Status Handler
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}`, { status: newStatus });
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Failed to update status.');
    }
  };

  const handleExportCSV = () => {
    if (orders.length === 0) return;
    const headers = ['Order ID', 'Customer Name', 'Phone', 'Email', 'Products Requested', 'Message', 'Status', 'Date'];
    const rows = orders.map(o => {
      const prodStr = o.products && o.products.length > 0
        ? o.products.map(p => `${p.name} (${p.size}) x${p.quantity}`).join(' | ')
        : 'General Inquiry';
      const dateStr = new Date(o.createdAt).toLocaleDateString();
      return [
        o._id,
        `"${o.customerName.replace(/"/g, '""')}"`,
        o.customerPhone,
        o.customerEmail,
        `"${prodStr.replace(/"/g, '""')}"`,
        `"${(o.message || '').replace(/"/g, '""')}"`,
        o.status,
        dateStr
      ];
    });
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Raja_Rice_Traders_Inquiries_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Analytics Metrics
  const totalProducts = products.length;
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;
  const lowStockProducts = products.filter(p => p.stockQuantity < 500);
  const totalStockVolume = products.reduce((acc, p) => acc + (p.stockQuantity || 0), 0);

  if (loading) {
    return (
      <div className="pt-32 text-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2E7D32] mx-auto mb-4"></div>
        <p className="text-gray-500 font-semibold text-sm">Loading admin dashboard statistics...</p>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-50/50 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Admin Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Hello, Rajashekar. Manage your inventory catalog and inquiries.</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={fetchData}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2.5 rounded-xl border border-gray-200 transition-colors flex items-center gap-1.5 text-xs font-bold"
            >
              <RefreshCw className="h-4 w-4" />
              Reload
            </button>
            <button 
              onClick={logout}
              className="bg-red-50 hover:bg-red-100 text-red-700 px-4 py-2.5 rounded-xl border border-red-200 transition-colors text-xs font-bold"
            >
              Logout Session
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 mb-8 gap-6">
          {['overview', 'products', 'orders'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 px-2 text-sm font-bold capitalize transition-all border-b-2 -mb-0.5 ${
                activeTab === tab 
                  ? 'border-[#2E7D32] text-[#2E7D32]' 
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              {tab === 'orders' ? 'Inquiries & Orders' : tab}
            </button>
          ))}
        </div>

        {/* Tab content conditional rendering */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Card 1 */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="bg-green-50 p-4 rounded-xl text-[#2E7D32]">
                  <Layers className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-xs text-gray-400 font-semibold block">Total Products</span>
                  <span className="text-2xl font-black text-gray-900">{totalProducts}</span>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="bg-blue-50 p-4 rounded-xl text-blue-600">
                  <ShoppingBag className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-xs text-gray-400 font-semibold block">Total Inquiries</span>
                  <span className="text-2xl font-black text-gray-900">{totalOrders}</span>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="bg-yellow-50 p-4 rounded-xl text-yellow-600">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-xs text-gray-400 font-semibold block">Pending Action</span>
                  <span className="text-2xl font-black text-gray-900">{pendingOrders}</span>
                </div>
              </div>

              {/* Card 4 */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="bg-red-50 p-4 rounded-xl text-red-600">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-xs text-gray-400 font-semibold block">Low Stock Alerts</span>
                  <span className="text-2xl font-black text-gray-900">{lowStockProducts.length}</span>
                </div>
              </div>

            </div>

            {/* Sub-panels */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Stock Alerts panel */}
              <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  Low Stock Alerts
                </h3>
                {lowStockProducts.length === 0 ? (
                  <p className="text-xs text-green-600 font-semibold bg-green-50 p-3 rounded-lg">✅ All stock levels are sufficient (above 500 kg).</p>
                ) : (
                  <ul className="space-y-3">
                    {lowStockProducts.map(p => (
                      <li key={p._id} className="p-3 bg-red-50/50 rounded-xl flex justify-between items-center border border-red-100">
                        <div>
                          <span className="font-bold text-gray-900 text-xs">{p.name}</span>
                          <span className="text-[10px] text-gray-400 block">{p.category} variant</span>
                        </div>
                        <span className="text-red-700 font-black text-xs">{p.stockQuantity} kg left</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* General Summary */}
              <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4">Mill Inventory & Operations Overview</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm border-b pb-3">
                    <span className="text-gray-500">Total Stock Volume On-Hand</span>
                    <span className="font-bold text-gray-900">{totalStockVolume.toLocaleString()} kg</span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-b pb-3">
                    <span className="text-gray-500">Active Product Categories Listed</span>
                    <span className="font-bold text-[#2E7D32]">Premium, Standard, Super Premium, Economy</span>
                  </div>
                  <div className="flex justify-between items-center text-sm pb-1">
                    <span className="text-gray-500">Recent Customer Response Rate</span>
                    <span className="font-bold text-blue-600">100% (All Inquiries Persisted)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 flex justify-between items-center border-b">
              <h3 className="font-bold text-gray-900 text-lg">Manage Products</h3>
              <button 
                onClick={handleOpenAddModal}
                className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                Add Product
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-50 text-gray-400 uppercase text-[10px] tracking-wider border-b">
                    <th className="py-4 px-6 font-bold">Product</th>
                    <th className="py-4 px-6 font-bold">Category</th>
                    <th className="py-4 px-6 font-bold">Price</th>
                    <th className="py-4 px-6 font-bold">Stock</th>
                    <th className="py-4 px-6 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map(prod => (
                    <tr key={prod._id} className="hover:bg-gray-50/50">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img src={prod.imageUrl} alt={prod.name} className="w-10 h-10 object-cover rounded-lg border" />
                          <div>
                            <p className="font-bold text-gray-900">{prod.name}</p>
                            <p className="text-[10px] text-gray-400">{prod.packageSizes.join(', ')}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-semibold text-gray-600">{prod.category}</td>
                      <td className="py-4 px-6 font-bold">₹{prod.price} / kg</td>
                      <td className="py-4 px-6 font-bold">
                        <span className={prod.stockQuantity < 500 ? 'text-red-600' : 'text-gray-900'}>
                          {prod.stockQuantity} kg
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex justify-end gap-1">
                          <button 
                            onClick={() => handleOpenEditModal(prod)}
                            className="text-gray-500 hover:text-[#2E7D32] p-1.5 hover:bg-green-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteProduct(prod._id)}
                            className="text-gray-500 hover:text-red-600 p-1.5 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="font-bold text-gray-900 text-lg">Customer Inquiries</h3>
              {orders.length > 0 && (
                <button
                  onClick={handleExportCSV}
                  className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                >
                  Export CSV Report
                </button>
              )}
            </div>

            {orders.length === 0 ? (
              <p className="p-10 text-center text-gray-400">No customer inquiries submitted yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-gray-400 uppercase text-[10px] tracking-wider border-b">
                      <th className="py-4 px-6 font-bold">Client Info</th>
                      <th className="py-4 px-6 font-bold">Products Requested</th>
                      <th className="py-4 px-6 font-bold">Message Details</th>
                      <th className="py-4 px-6 font-bold">Status</th>
                      <th className="py-4 px-6 font-bold text-right">Update Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {orders.map(order => (
                      <tr key={order._id} className="hover:bg-gray-50/50">
                        <td className="py-4 px-6">
                          <div>
                            <p className="font-bold text-gray-900">{order.customerName}</p>
                            <p className="text-xs text-gray-500">{order.customerPhone}</p>
                            <p className="text-[10px] text-gray-400">{order.customerEmail}</p>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          {order.products && order.products.length > 0 ? (
                            <ul className="space-y-1 text-xs">
                              {order.products.map((item, idx) => (
                                <li key={idx} className="font-semibold text-gray-700 bg-gray-50 border p-1 rounded-md">
                                  {item.name} ({item.size}) x {item.quantity}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <span className="text-xs text-gray-400 italic">General Inquiry</span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-xs text-gray-500 max-w-xs truncate" title={order.message}>
                          {order.message || '-'}
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-md ${
                            order.status === 'Pending' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
                            order.status === 'Completed' ? 'bg-green-50 text-green-700 border border-green-200' :
                            'bg-red-50 text-red-700 border border-red-200'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex justify-end gap-1.5">
                            <button
                              onClick={() => handleUpdateOrderStatus(order._id, 'Completed')}
                              className="bg-green-50 hover:bg-green-100 text-green-700 p-1.5 rounded-lg border border-green-200 cursor-pointer"
                              title="Mark Completed"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleUpdateOrderStatus(order._id, 'Cancelled')}
                              className="bg-red-50 hover:bg-red-100 text-red-700 p-1.5 rounded-lg border border-red-200 cursor-pointer"
                              title="Mark Cancelled"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Product Add/Edit Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl overflow-hidden border shadow-2xl relative">
            <div className="bg-[#2E7D32] text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-lg">{editingProduct ? 'Edit Product Variant' : 'Add New Product Variant'}</h3>
              <button onClick={() => setShowProductModal(false)} className="text-white/80 hover:text-white"><X className="h-5 w-5" /></button>
            </div>
            
            <form onSubmit={handleProductSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 flex items-start gap-2 text-xs">
                  <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Product Name *</label>
                <input
                  type="text"
                  value={productForm.name}
                  onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                  className="w-full px-3.5 py-2 border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
                  placeholder="e.g. Premium BPT Rice"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Description *</label>
                <textarea
                  value={productForm.description}
                  onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                  rows="2"
                  className="w-full px-3.5 py-2 border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
                  placeholder="Brief description of texture, expansion, cooking usage..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Category */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Category *</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                    className="w-full px-3.5 py-2 border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
                  >
                    <option value="Premium">Premium</option>
                    <option value="Standard">Standard</option>
                    <option value="Super Premium">Super Premium</option>
                    <option value="Economy">Economy</option>
                  </select>
                </div>

                {/* Price */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Price (₹ per kg) *</label>
                  <input
                    type="number"
                    value={productForm.price}
                    onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                    className="w-full px-3.5 py-2 border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
                    placeholder="e.g. 65"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Stock Quantity */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Stock Quantity (kg) *</label>
                  <input
                    type="number"
                    value={productForm.stockQuantity}
                    onChange={(e) => setProductForm({...productForm, stockQuantity: e.target.value})}
                    className="w-full px-3.5 py-2 border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
                    placeholder="e.g. 1500"
                    required
                  />
                </div>

                {/* In Stock toggle */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Availability Status</label>
                  <select
                    value={productForm.inStock}
                    onChange={(e) => setProductForm({...productForm, inStock: e.target.value === 'true'})}
                    className="w-full px-3.5 py-2 border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
                  >
                    <option value="true">In Stock</option>
                    <option value="false">Out of Stock</option>
                  </select>
                </div>
              </div>

              {/* Package sizes */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Package Sizes (Comma separated) *</label>
                <input
                  type="text"
                  value={productForm.packageSizes}
                  onChange={(e) => setProductForm({...productForm, packageSizes: e.target.value})}
                  className="w-full px-3.5 py-2 border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
                  placeholder="e.g. 5kg, 10kg, 25kg, 50kg"
                  required
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Image URL</label>
                <input
                  type="text"
                  value={productForm.imageUrl}
                  onChange={(e) => setProductForm({...productForm, imageUrl: e.target.value})}
                  className="w-full px-3.5 py-2 border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
                  placeholder="Leave empty for default grain image placeholder"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold py-2.5 rounded-xl text-xs shadow-md transition-colors"
              >
                {editingProduct ? 'Save Changes' : 'Create Product Variant'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
