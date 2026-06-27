const bcrypt = require('bcryptjs');

// Pre-populated default products
let products = [
  {
    _id: "prod_1",
    name: "Sona Masoori Rice",
    description: "Premium lightweight and aromatic grain, perfect for daily consumption and rich in taste.",
    category: "Premium",
    price: 65,
    packageSizes: ["5kg", "10kg", "25kg", "50kg"],
    imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600",
    inStock: true,
    stockQuantity: 1500
  },
  {
    _id: "prod_2",
    name: "BPT Rice",
    description: "Delicate texture and superb cooking quality, preferred by families for its premium quality.",
    category: "Premium",
    price: 70,
    packageSizes: ["10kg", "25kg", "50kg"],
    imageUrl: "https://images.unsplash.com/photo-1568254183919-78a4f43a2877?auto=format&fit=crop&q=80&w=600",
    inStock: true,
    stockQuantity: 1200
  },
  {
    _id: "prod_3",
    name: "Steam Rice",
    description: "Steam-processed high quality rice, ideal for catering, restaurants, and long storage.",
    category: "Standard",
    price: 55,
    packageSizes: ["25kg", "50kg"],
    imageUrl: "https://images.unsplash.com/photo-1591821099449-74c0c1170757?auto=format&fit=crop&q=80&w=600",
    inStock: true,
    stockQuantity: 2000
  },
  {
    _id: "prod_4",
    name: "Raw Rice",
    description: "Traditionally milled raw rice, ideal for making traditional South Indian delicacies.",
    category: "Standard",
    price: 52,
    packageSizes: ["25kg", "50kg"],
    imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600",
    inStock: true,
    stockQuantity: 900
  },
  {
    _id: "prod_5",
    name: "Basmati Rice",
    description: "Extra long slender grains with rich aroma, aged to perfection for biryanis and special occasions.",
    category: "Super Premium",
    price: 130,
    packageSizes: ["5kg", "10kg", "25kg"],
    imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600",
    inStock: true,
    stockQuantity: 500
  },
  {
    _id: "prod_6",
    name: "Broken Rice",
    description: "Nutritious and clean broken rice, perfect for idli/dosa batters or porridge preparation.",
    category: "Economy",
    price: 35,
    packageSizes: ["25kg", "50kg"],
    imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600",
    inStock: true,
    stockQuantity: 3000
  }
];

let orders = [
  {
    _id: "ord_1",
    customerName: "Ramesh Kumar",
    customerPhone: "9876543210",
    customerEmail: "ramesh@example.com",
    products: [
      { name: "Sona Masoori Rice", size: "25kg", quantity: 2 }
    ],
    status: "Pending",
    message: "Interested in buying 2 bags of 25kg Sona Masoori. Please call me back.",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
  },
  {
    _id: "ord_2",
    customerName: "Saritha Reddy",
    customerPhone: "8765432109",
    customerEmail: "saritha@example.com",
    products: [
      { name: "BPT Rice", size: "50kg", quantity: 5 }
    ],
    status: "Completed",
    message: "Wholesale inquiry for hotel usage.",
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000) // 2 days ago
  }
];

let users = [];
let customers = [];

// Initialize default admin and customer user with bcrypt hashed passwords
const initMockUsers = async () => {
  const adminHashed = await bcrypt.hash("admin123", 10);
  users.push({
    _id: "user_admin",
    username: "admin",
    password: adminHashed
  });
  users.push({
    _id: "user_admin_gmail",
    username: "rajaricetraders01@gmail.com",
    password: adminHashed
  });

  const customerHashed = await bcrypt.hash("password123", 10);
  customers.push({
    _id: "cust_1",
    name: "Gaurav Sen",
    phone: "9876543210",
    email: "customer@example.com",
    password: customerHashed
  });
};

initMockUsers();

module.exports = {
  products,
  orders,
  users,
  customers
};
