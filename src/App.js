import React, { useState, useEffect, createContext, useContext } from 'react';
import {
    Home, ShoppingBag, Tractor, CalendarDays, BarChart, Users, PlusCircle, XCircle, LogIn, UserPlus, LogOut,
    CheckCircle2, DollarSign, Sprout, Star, BookOpen, MapPin, RefreshCw, Box, Settings, Truck,
    ShoppingCart, Package, List, Eye, Edit, Trash2, ChevronRight, ChevronLeft, Minus, Plus, Search, Loader2
} from 'lucide-react';

// API Base URL (replace with your backend's actual URL if different)
const API_BASE_URL = 'http://localhost:5000/api';

// --- Contexts for Global State (Auth and Cart) ---
const AuthContext = createContext(null);
const CartContext = createContext(null);

// --- Auth Provider Component ---
const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // { id, username, email, role, token }
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Attempt to load user from localStorage on initial render
        const storedUser = localStorage.getItem('agrihubUser');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse user from localStorage", e);
                localStorage.removeItem('agrihubUser');
            }
        }
        setLoading(false);
    }, []);

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('agrihubUser', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('agrihubUser');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

// --- Cart Provider Component ---
const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        // Load cart from localStorage on initial render
        const savedCart = localStorage.getItem('agrihubCart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // Update localStorage whenever cartItems change
    useEffect(() => {
        localStorage.setItem('agrihubCart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product, quantity = 1) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === product.id);
            if (existingItem) {
                return prevItems.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
                );
            } else {
                return [...prevItems, { ...product, quantity }];
            }
        });
    };

    const updateCartQuantity = (productId, quantity) => {
        setCartItems(prevItems => {
            return prevItems.map(item =>
                item.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
            ).filter(item => item.quantity > 0); // Remove if quantity becomes 0
        });
    };

    const removeFromCart = (productId) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    return (
        <CartContext.Provider value={{ cartItems, addToCart, updateCartQuantity, removeFromCart, clearCart, cartTotal }}>
            {children}
        </CartContext.Provider>
    );
};


// --- Main Application Content Component (now wrapped by providers) ---
const MainAppContent = () => {
    const [currentPage, setCurrentPage] = useState('home');
    const [currentPageData, setCurrentPageData] = useState({});

    const { user, loading: authLoading } = useContext(AuthContext); // Access user and auth loading
    const { cartItems } = useContext(CartContext); // Access cart items

    // Simulate routing
    const navigate = (page, data = {}) => {
        setCurrentPageData(data);
        setCurrentPage(page);
    };

    // --- Components rendered directly within App.js ---

    // Header Component
    const Header = () => {
        const { user, logout } = useContext(AuthContext);
        const { cartItems } = useContext(CartContext);

        return (
            <header className="bg-green-700 text-white p-4 shadow-md">
                <div className="container mx-auto flex justify-between items-center flex-wrap">
                    <h1 className="text-3xl font-bold">AgriHub</h1>
                    <nav className="mt-4 md:mt-0">
                        <ul className="flex space-x-4 md:space-x-6 text-lg">
                            <li>
                                <button
                                    onClick={() => navigate('home')}
                                    className={`flex items-center px-3 py-2 rounded-md transition-colors duration-200 ${currentPage === 'home' ? 'bg-green-800' : 'hover:bg-green-600'}`}
                                >
                                    <Home size={20} className="mr-2" /> Home
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => navigate('products')}
                                    className={`flex items-center px-3 py-2 rounded-md transition-colors duration-200 ${currentPage === 'products' ? 'bg-green-800' : 'hover:bg-green-600'}`}
                                >
                                    <ShoppingBag size={20} className="mr-2" /> Products
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => navigate('services')}
                                    className={`flex items-center px-3 py-2 rounded-md transition-colors duration-200 ${currentPage === 'services' ? 'bg-green-800' : 'hover:bg-green-600'}`}
                                >
                                    <Tractor size={20} className="mr-2" /> Services
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => navigate('events')}
                                    className={`flex items-center px-3 py-2 rounded-md transition-colors duration-200 ${currentPage === 'events' ? 'bg-green-800' : 'hover:bg-green-600'}`}
                                >
                                    <CalendarDays size={20} className="mr-2" /> Events
                                </button>
                            </li>
                            {user && ( // Show Dashboard link only if logged in
                                <li>
                                    <button
                                        onClick={() => navigate('dashboard')}
                                        className={`flex items-center px-3 py-2 rounded-md transition-colors duration-200 ${currentPage === 'dashboard' ? 'bg-green-800' : 'hover:bg-green-600'}`}
                                    >
                                        <BarChart size={20} className="mr-2" /> Dashboard
                                    </button>
                                </li>
                            )}
                            <li>
                                <button
                                    onClick={() => navigate('cart')}
                                    className={`relative flex items-center px-3 py-2 rounded-md transition-colors duration-200 ${currentPage === 'cart' ? 'bg-green-800' : 'hover:bg-green-600'}`}
                                >
                                    <ShoppingCart size={20} className="mr-2" /> Cart
                                    {cartItems.length > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                            {cartItems.length}
                                        </span>
                                    )}
                                </button>
                            </li>
                            {user ? ( // Show Logout button if logged in
                                <li>
                                    <button
                                        onClick={() => { logout(); navigate('home'); }}
                                        className="flex items-center px-3 py-2 rounded-md transition-colors duration-200 hover:bg-red-600 bg-red-700"
                                    >
                                        <LogOut size={20} className="mr-2" /> Logout
                                    </button>
                                </li>
                            ) : ( // Show Login button if not logged in
                                <li>
                                    <button
                                        onClick={() => navigate('auth')}
                                        className="flex items-center px-3 py-2 rounded-md transition-colors duration-200 hover:bg-green-600"
                                    >
                                        <LogIn size={20} className="mr-2" /> Login
                                    </button>
                                </li>
                            )}
                        </ul>
                    </nav>
                </div>
            </header>
        );
    };

    // Footer Component
    const Footer = () => {
        return (
            <footer className="bg-gray-800 text-white p-6 mt-8">
                <div className="container mx-auto text-center text-sm">
                    &copy; {new Date().getFullYear()} AgriHub. All rights reserved.
                </div>
            </footer>
        );
    };

    // Auth Page Component
    const AuthPage = () => {
        const { login } = useContext(AuthContext);
        const [isSigningUp, setIsSigningUp] = useState(false);
        const [username, setUsername] = useState('');
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');
        const [confirmPassword, setConfirmPassword] = useState('');
        const [authError, setAuthError] = useState('');
        const [isLoading, setIsLoading] = useState(false);

        const handleAuthSubmit = async (e) => {
            e.preventDefault();
            setAuthError('');
            setIsLoading(true);

            const endpoint = isSigningUp ? '/auth/register' : '/auth/login';
            const body = isSigningUp ? { username, email, password } : { email, password };

            if (isSigningUp && password !== confirmPassword) {
                setAuthError("Passwords do not match!");
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body),
                });
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Authentication failed');
                }

                login(data); // Store user data in context and local storage
                navigate('home'); // Navigate to home or dashboard after successful auth

            } catch (error) {
                setAuthError(error.message);
                console.error("Auth error:", error);
            } finally {
                setIsLoading(false);
            }
        };

        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
                <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                    <h2 className="text-3xl font-bold text-green-800 mb-6 text-center">
                        {isSigningUp ? 'Sign Up for AgriHub' : 'Log In to AgriHub'}
                    </h2>
                    {authError && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4" role="alert">
                            <span className="block sm:inline">{authError}</span>
                        </div>
                    )}
                    <form onSubmit={handleAuthSubmit} className="space-y-4">
                        {isSigningUp && (
                            <div>
                                <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">Username</label>
                                <input
                                    type="text"
                                    id="username"
                                    className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-green-500"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="your_username"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        )}
                        <div>
                            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                            <input
                                type="email"
                                id="email"
                                className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-green-500"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your@email.com"
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                            <input
                                type="password"
                                id="password"
                                className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-green-500"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="********"
                                required
                                disabled={isLoading}
                            />
                        </div>
                        {isSigningUp && (
                            <div>
                                <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">Confirm Password</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-green-500"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="********"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        )}
                        <button
                            type="submit"
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin mr-2" size={20} />
                            ) : isSigningUp ? (
                                <UserPlus className="mr-2" size={20} />
                            ) : (
                                <LogIn className="mr-2" size={20} />
                            )}
                            {isSigningUp ? 'Sign Up' : 'Log In'}
                        </button>
                    </form>
                    <div className="mt-6 text-center">
                        <button
                            onClick={() => {
                                setIsSigningUp(!isSigningUp);
                                setAuthError('');
                                setUsername('');
                                setEmail('');
                                setPassword('');
                                setConfirmPassword('');
                            }}
                            className="text-green-600 hover:text-green-800 font-semibold transition-colors duration-200"
                            disabled={isLoading}
                        >
                            {isSigningUp ? 'Already have an account? Log In' : 'Need an account? Sign Up'}
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // Home Page Component
    const HomePage = () => {
        return (
            <div className="p-6">
                <h2 className="text-3xl font-bold text-green-800 mb-6">Welcome to AgriHub!</h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-8">
                    AgriHub is a next-generation e-commerce platform designed exclusively for the farming community. Our mission is to empower farmers by providing a digital marketplace where they can easily list, promote, and sell their products directly to consumers, retailers, and businesses—eliminating intermediaries and maximizing profits.
                </p>

                {/* What Makes Agrihub Unique Section */}
                <h3 className="text-2xl font-bold text-green-700 mb-6">What Makes AgriHub Unique?</h3>
                <div className="grid md:grid-cols-2 gap-8 mt-6">
                    {/* Direct-to-Market Sales */}
                    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                        <img
                            src="https://placehold.co/400x250/d4edda/2a5c3a?text=Direct-to-Market"
                            alt="Direct-to-Market Sales"
                            className="w-full h-48 object-cover"
                            onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/400x250/d4edda/2a5c3a?text=Direct-to-Market`; }}
                        />
                        <div className="p-4">
                            <h4 className="text-xl font-semibold text-green-800 mb-2 flex items-center"><ShoppingBag className="mr-2" /> Direct-to-Market Sales</h4>
                            <p className="text-gray-600 text-sm">Sell produce, dairy, grains, meat, and value-added goods directly.</p>
                        </div>
                    </div>
                    {/* Integrated Farm Services */}
                    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                        <img
                            src="https://placehold.co/400x250/d4edda/2a5c3a?text=Farm+Services"
                            alt="Integrated Farm Services"
                            className="w-full h-48 object-cover"
                            onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/400x250/d4edda/2a5c3a?text=Farm+Services`; }}
                        />
                        <div className="p-4">
                            <h4 className="text-xl font-semibold text-green-800 mb-2 flex items-center"><Tractor className="mr-2" /> Integrated Farm Services</h4>
                            <p className="text-gray-600 text-sm">Offer rentals, soil testing, crop spraying, and on-farm experiences.</p>
                        </div>
                    </div>
                    {/* Smart Tools for Farmers */}
                    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                        <img
                            src="https://placehold.co/400x250/d4edda/2a5c3a?text=Smart+Tools"
                            alt="Smart Tools for Farmers"
                            className="w-full h-48 object-cover"
                            onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/400x250/d4edda/2a5c3a?text=Smart+Tools`; }}
                        />
                        <div className="p-4">
                            <h4 className="text-xl font-semibold text-green-800 mb-2 flex items-center"><BarChart className="mr-2" /> Smart Tools for Farmers</h4>
                            <p className="text-gray-600 text-sm">Inventory, analytics, and compliance support for optimized operations.</p>
                        </div>
                    </div>
                    {/* Community and Learning */}
                    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                        <img
                            src="https://placehold.co/400x250/d4edda/2a5c3a?text=Community+%26+Learning"
                            alt="Community and Learning"
                            className="w-full h-48 object-cover"
                            onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/400x250/d4edda/2a5c3a?text=Community+%26+Learning`; }}
                        />
                        <div className="p-4">
                            <h4 className="text-xl font-semibold text-green-800 mb-2 flex items-center"><Users className="mr-2" /> Community and Learning</h4>
                            <p className="text-gray-600 text-sm">Host/join events, access knowledge hub, and farmer-to-farmer exchange.</p>
                        </div>
                    </div>
                </div>

                {/* Customer-Centric Experience Section */}
                <h3 className="text-2xl font-bold text-green-700 mt-10 mb-6">Customer-Centric Experience</h3>
                <div className="grid md:grid-cols-3 gap-8 mt-6">
                    {/* Personalized Shopping */}
                    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                        <img
                            src="https://placehold.co/400x250/cfe7d5/2a5c3a?text=Personalized+Shopping"
                            alt="Personalized Shopping"
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-4 text-center">
                            <CheckCircle2 size={32} className="text-green-500 mx-auto mb-2" />
                            <h4 className="text-xl font-semibold text-green-800 mb-1">Personalized Shopping</h4>
                            <p className="text-gray-600 text-sm">Filter by location, farming method, or product type.</p>
                        </div>
                    </div>
                    {/* Secure & Transparent Transactions */}
                    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                        <img
                            src="https://placehold.co/400x250/cfe7d5/2a5c3a?text=Secure+Transactions"
                            alt="Secure & Transparent Transactions"
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-4 text-center">
                            <DollarSign size={32} className="text-green-500 mx-auto mb-2" />
                            <h4 className="text-xl font-semibold text-green-800 mb-1">Secure & Transparent Transactions</h4>
                            <p className="text-gray-600 text-sm">Flexible payments, secure checkout, transparent delivery.</p>
                        </div>
                    </div>
                    {/* Trust & Quality Assurance */}
                    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                        <img
                            src="https://placehold.co/400x250/cfe7d5/2a5c3a?text=Trust+%26+Quality"
                            alt="Trust & Quality Assurance"
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-4 text-center">
                            <Star size={32} className="text-green-500 mx-auto mb-2" />
                            <h4 className="text-xl font-semibold text-green-800 mb-1">Trust & Quality Assurance</h4>
                            <p className="text-gray-600 text-sm">Ratings and reviews system fosters trust.</p>
                        </div>
                    </div>
                </div>

                {/* Innovative Features Section */}
                <h3 className="text-2xl font-bold text-green-700 mt-10 mb-6">Innovative Features</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Subscription Boxes */}
                    <div className="bg-green-50 p-6 rounded-lg shadow-sm border border-green-100 flex flex-col items-center text-center">
                        <Box size={40} className="text-green-600 mb-3" />
                        <h4 className="text-xl font-semibold text-gray-800 mb-2">Subscription Boxes</h4>
                        <p className="text-gray-600 text-sm">Set up recurring deliveries for loyal customers (weekly, bi-weekly, monthly).</p>
                    </div>
                    {/* Farm Services Marketplace */}
                    <div className="bg-green-50 p-6 rounded-lg shadow-sm border border-green-100 flex flex-col items-center text-center">
                        <Settings size={40} className="text-green-600 mb-3" />
                        <h4 className="text-xl font-semibold text-gray-800 mb-2">Farm Services Marketplace</h4>
                        <p className="text-gray-600 text-sm">List and book specialized farm services or equipment rentals directly.</p>
                    </div>
                    {/* Event Booking */}
                    <div className="bg-green-50 p-6 rounded-lg shadow-sm border border-green-100 flex flex-col items-center text-center">
                        <CalendarDays size={40} className="text-green-600 mb-3" />
                        <h4 className="text-xl font-semibold text-gray-800 mb-2">Event Booking</h4>
                        <p className="text-gray-600 text-sm">Promote farm tours, workshops, or seasonal festivals directly to consumers.</p>
                    </div>
                    {/* Bulk and Wholesale Sales */}
                    <div className="bg-green-50 p-6 rounded-lg shadow-sm border border-green-100 flex flex-col items-center text-center">
                        <Truck size={40} className="text-green-600 mb-3" />
                        <h4 className="text-xl font-semibold text-gray-800 mb-2">Bulk and Wholesale Sales</h4>
                        <p className="text-gray-600 text-sm">Facilitate large orders for restaurants, stores, or food hubs with dedicated tools.</p>
                    </div>
                    {/* Sustainability Dashboard */}
                    <div className="bg-green-50 p-6 rounded-lg shadow-sm border border-green-100 flex flex-col items-center text-center">
                        <Sprout size={40} className="text-green-600 mb-3" />
                        <h4 className="text-xl font-semibold text-gray-800 mb-2">Sustainability Dashboard</h4>
                        <p className="text-gray-600 text-sm">Showcase your eco-friendly practices and certifications to attract conscious buyers.</p>
                    </div>
                </div>
            </div>
        );
    };

    // Product Listing Page Component
    const ProductsPage = ({ selectedCategoryId }) => {
        const { user } = useContext(AuthContext);
        const { addToCart } = useContext(CartContext);

        const [products, setProducts] = useState([]);
        const [categories, setCategories] = useState([]);
        const [isLoading, setIsLoading] = useState(true);
        const [error, setError] = useState(null);
        const [filterCategory, setFilterCategory] = useState(selectedCategoryId || '');
        const [searchTerm, setSearchTerm] = useState('');

        // Modals states for product management
        const [showAddProductModal, setShowAddProductModal] = useState(false);
        const [showEditProductModal, setShowEditProductModal] = useState(false);
        const [currentProduct, setCurrentProduct] = useState(null); // For editing
        const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', unit: '', image_url: '', category_id: '', stock_quantity: 0 });


        // Fetch categories
        useEffect(() => {
            const fetchCategories = async () => {
                try {
                    const response = await fetch(`${API_BASE_URL}/categories`);
                    if (!response.ok) throw new Error('Failed to fetch categories');
                    const data = await response.json();
                    setCategories(data);
                } catch (err) {
                    console.error("Error fetching categories:", err);
                    setError('Failed to load categories.');
                }
            };
            fetchCategories();
        }, []);

        // Fetch products based on category filter or search term
        useEffect(() => {
            const fetchProducts = async () => {
                setIsLoading(true);
                setError(null);
                let url = `${API_BASE_URL}/products`;
                if (filterCategory) {
                    url += `?category=${filterCategory}`;
                }

                try {
                    const response = await fetch(url);
                    if (!response.ok) throw new Error('Failed to fetch products');
                    const data = await response.json();
                    setProducts(data);
                } catch (err) {
                    console.error("Error fetching products:", err);
                    setError('Failed to load products.');
                } finally {
                    setIsLoading(false);
                }
            };
            fetchProducts();
        }, [filterCategory]);

        const handleProductSubmit = async (isEditMode) => {
            setError(null);
            setIsLoading(true);
            const token = user?.token;
            if (!token) {
                setError('You must be logged in to perform this action.');
                setIsLoading(false);
                return;
            }

            const productData = isEditMode ? currentProduct : newProduct;
            if (!productData.name || !productData.price || !productData.unit || !productData.category_id || productData.stock_quantity === undefined) {
                setError('All product fields are required.');
                setIsLoading(false);
                return;
            }

            try {
                const method = isEditMode ? 'PUT' : 'POST';
                const url = isEditMode ? `${API_BASE_URL}/products/${productData.id}` : `${API_BASE_URL}/products`;

                const response = await fetch(url, {
                    method,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(productData),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to save product.');
                }

                if (!isEditMode) setNewProduct({ name: '', description: '', price: '', unit: '', image_url: '', category_id: '', stock_quantity: 0 });
                setShowAddProductModal(false);
                setShowEditProductModal(false);
                setCurrentProduct(null);
                // Re-fetch products after successful operation
                const updatedProductsResponse = await fetch(`${API_BASE_URL}/products`);
                if (!updatedProductsResponse.ok) throw new Error('Failed to re-fetch products.');
                const updatedProductsData = await updatedProductsResponse.json();
                setProducts(updatedProductsData);

            } catch (err) {
                setError(err.message);
                console.error("Product save error:", err);
            } finally {
                setIsLoading(false);
            }
        };

        const handleDeleteProduct = async (productId) => {
            if (!window.confirm("Are you sure you want to delete this product?")) return; // Use custom modal in real app
            setError(null);
            setIsLoading(true);
            const token = user?.token;
            if (!token) {
                setError('You must be logged in to perform this action.');
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to delete product.');
                }

                // Remove from state directly for immediate UI update
                setProducts(prev => prev.filter(p => p.id !== productId));

            } catch (err) {
                setError(err.message);
                console.error("Delete product error:", err);
            } finally {
                setIsLoading(false);
            }
        };

        const filteredAndSearchedProducts = products.filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.category_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.farmer_username.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return (
            <div className="p-6">
                <h2 className="text-3xl font-bold text-green-800 mb-6">Our Farm Products</h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                    Discover a wide range of fresh produce, dairy, grains, meats, and unique value-added goods directly from local farmers. Whether you're looking for weekly staples or specialty items, AgriHub connects you to high-quality, sustainably sourced products.
                </p>

                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-grow">
                        <label htmlFor="category-filter" className="sr-only">Filter by Category</label>
                        <select
                            id="category-filter"
                            className="w-full md:w-auto p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            disabled={isLoading}
                        >
                            <option value="">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="relative flex-grow">
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="w-full p-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            disabled={isLoading}
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    </div>
                    {user?.role === 'farmer' || user?.role === 'admin' ? (
                        <button
                            onClick={() => { setShowAddProductModal(true); setNewProduct({ name: '', description: '', price: '', unit: '', image_url: '', category_id: '', stock_quantity: 0 }); }}
                            className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isLoading}
                        >
                            <PlusCircle className="mr-2" size={20} /> Add New Product
                        </button>
                    ) : null}
                </div>


                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-sm mb-4" role="alert">
                        {error}
                    </div>
                )}

                {isLoading ? (
                    <div className="text-center py-10">
                        <Loader2 className="animate-spin text-green-500 mx-auto mb-2" size={48} />
                        <p className="text-gray-600">Loading products...</p>
                    </div>
                ) : filteredAndSearchedProducts.length === 0 ? (
                    <p className="text-center text-gray-600 py-10">No products found matching your criteria. Be the first to add one!</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredAndSearchedProducts.map(product => (
                            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                <button
                                    onClick={() => navigate('product_detail', { productId: product.id })}
                                    className="block w-full text-left" // Make the card clickable to detail page
                                >
                                    <img
                                        src={product.image_url || `https://placehold.co/400x200/e0ffe0/333333?text=${product.name || 'Product'}`}
                                        alt={product.name}
                                        className="w-full h-48 object-cover"
                                        onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/400x200/e0ffe0/333333?text=${product.name || 'Product'}`; }}
                                    />
                                    <div className="p-4">
                                        <h3 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h3>
                                        <p className="text-gray-600 text-sm mb-3">{product.description?.substring(0, 70)}...</p>
                                        <p className="text-green-700 font-bold text-lg">${product.price} / {product.unit}</p>
                                        <p className="text-gray-500 text-xs mt-2">Category: {product.category_name}</p>
                                        <p className="text-gray-500 text-xs">Farmer: {product.farmer_username}</p>
                                        <p className={`text-sm font-semibold mt-1 ${product.stock_quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            Stock: {product.stock_quantity > 0 ? `${product.stock_quantity} available` : 'Out of Stock'}
                                        </p>
                                    </div>
                                </button>
                                <div className="p-4 border-t border-gray-100 flex justify-between items-center">
                                    <button
                                        onClick={() => addToCart(product)}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={product.stock_quantity <= 0}
                                    >
                                        Add to Cart
                                    </button>
                                    {user?.role === 'farmer' && product.farmer_id === user.id || user?.role === 'admin' ? (
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => { setCurrentProduct(product); setShowEditProductModal(true); }}
                                                className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-md"
                                                title="Edit Product"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteProduct(product.id)}
                                                className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md"
                                                title="Delete Product"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Add/Edit Product Modal */}
                {(showAddProductModal || showEditProductModal) && (
                    <div className="fixed inset-0 flex items-center justify-center modal-overlay">
                        <div className="bg-white p-8 rounded-lg shadow-xl modal-content max-w-md w-full relative">
                            <button
                                onClick={() => { setShowAddProductModal(false); setShowEditProductModal(false); setCurrentProduct(null); }}
                                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition-colors duration-200"
                            >
                                <XCircle size={24} />
                            </button>
                            <h3 className="text-2xl font-bold text-green-800 mb-6">{showEditProductModal ? 'Edit Product' : 'Add New Product'}</h3>
                            {error && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-sm mb-4" role="alert">
                                    {error}
                                </div>
                            )}
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="productName" className="block text-gray-700 text-sm font-bold mb-2">Product Name</label>
                                    <input
                                        type="text"
                                        id="productName"
                                        className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-green-500"
                                        value={showEditProductModal ? currentProduct?.name || '' : newProduct.name}
                                        onChange={(e) => showEditProductModal ? setCurrentProduct({ ...currentProduct, name: e.target.value }) : setNewProduct({ ...newProduct, name: e.target.value })}
                                        placeholder="e.g., Organic Tomatoes"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="productDescription" className="block text-gray-700 text-sm font-bold mb-2">Description</label>
                                    <textarea
                                        id="productDescription"
                                        rows="3"
                                        className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-green-500"
                                        value={showEditProductModal ? currentProduct?.description || '' : newProduct.description}
                                        onChange={(e) => showEditProductModal ? setCurrentProduct({ ...currentProduct, description: e.target.value }) : setNewProduct({ ...newProduct, description: e.target.value })}
                                        placeholder="Freshly picked, juicy and sweet..."
                                        required
                                        disabled={isLoading}
                                    ></textarea>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="productPrice" className="block text-gray-700 text-sm font-bold mb-2">Price</label>
                                        <input
                                            type="number"
                                            id="productPrice"
                                            className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-green-500"
                                            value={showEditProductModal ? currentProduct?.price || '' : newProduct.price}
                                            onChange={(e) => showEditProductModal ? setCurrentProduct({ ...currentProduct, price: parseFloat(e.target.value) }) : setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                                            placeholder="e.g., 3.50"
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="productUnit" className="block text-gray-700 text-sm font-bold mb-2">Unit</label>
                                        <input
                                            type="text"
                                            id="productUnit"
                                            className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-green-500"
                                            value={showEditProductModal ? currentProduct?.unit || '' : newProduct.unit}
                                            onChange={(e) => showEditProductModal ? setCurrentProduct({ ...currentProduct, unit: e.target.value }) : setNewProduct({ ...newProduct, unit: e.target.value })}
                                            placeholder="e.g., kg, dozen, lb"
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="productStock" className="block text-gray-700 text-sm font-bold mb-2">Stock Quantity</label>
                                        <input
                                            type="number"
                                            id="productStock"
                                            className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-green-500"
                                            value={showEditProductModal ? currentProduct?.stock_quantity || 0 : newProduct.stock_quantity}
                                            onChange={(e) => showEditProductModal ? setCurrentProduct({ ...currentProduct, stock_quantity: parseInt(e.target.value) }) : setNewProduct({ ...newProduct, stock_quantity: parseInt(e.target.value) })}
                                            placeholder="e.g., 100"
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="productCategory" className="block text-gray-700 text-sm font-bold mb-2">Category</label>
                                        <select
                                            id="productCategory"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 shadow-sm transition duration-150 ease-in-out"
                                            value={showEditProductModal ? currentProduct?.category_id || '' : newProduct.category_id}
                                            onChange={(e) => showEditProductModal ? setCurrentProduct({ ...currentProduct, category_id: e.target.value }) : setNewProduct({ ...newProduct, category_id: e.target.value })}
                                            required
                                            disabled={isLoading}
                                        >
                                            <option value="">Select a Category</option>
                                            {categories.map(cat => (
                                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="productImageUrl" className="block text-gray-700 text-sm font-bold mb-2">Image URL (Optional)</label>
                                    <input
                                        type="text"
                                        id="productImageUrl"
                                        className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-green-500"
                                        value={showEditProductModal ? currentProduct?.image_url || '' : newProduct.image_url}
                                        onChange={(e) => showEditProductModal ? setCurrentProduct({ ...currentProduct, image_url: e.target.value }) : setNewProduct({ ...newProduct, image_url: e.target.value })}
                                        placeholder="e.g., https://example.com/tomato.jpg"
                                        disabled={isLoading}
                                    />
                                </div>
                                <button
                                    onClick={() => handleProductSubmit(showEditProductModal)}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <Loader2 className="animate-spin mr-2" size={20} />
                                    ) : showEditProductModal ? 'Update Product' : 'Add Product'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    // Product Detail Page Component
    const ProductDetailPage = ({ productId }) => {
        const { addToCart } = useContext(CartContext);
        const [product, setProduct] = useState(null);
        const [isLoading, setIsLoading] = useState(true);
        const [error, setError] = useState(null);

        useEffect(() => {
            const fetchProduct = async () => {
                setIsLoading(true);
                setError(null);
                try {
                    const response = await fetch(`${API_BASE_URL}/products/${productId}`);
                    if (!response.ok) throw new Error('Product not found or failed to fetch.');
                    const data = await response.json();
                    setProduct(data);
                } catch (err) {
                    setError(err.message);
                    console.error("Fetch product detail error:", err);
                } finally {
                    setIsLoading(false);
                }
            };
            if (productId) {
                fetchProduct();
            }
        }, [productId]);

        if (isLoading) {
            return (
                <div className="text-center py-10">
                    <Loader2 className="animate-spin text-green-500 mx-auto mb-2" size={48} />
                    <p className="text-gray-600">Loading product details...</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-sm mb-4 text-center">
                    Error: {error}
                    <button onClick={() => navigate('products')} className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Back to Products</button>
                </div>
            );
        }

        if (!product) return null; // Should not happen if error handling is correct

        return (
            <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
                <button onClick={() => navigate('products')} className="mb-6 text-green-700 hover:text-green-900 flex items-center">
                    <ChevronLeft size={20} className="mr-1" /> Back to Products
                </button>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="flex justify-center items-center bg-gray-50 rounded-lg overflow-hidden">
                        <img
                            src={product.image_url || `https://placehold.co/600x400/e0ffe0/333333?text=${product.name || 'Product'}`}
                            alt={product.name}
                            className="w-full h-auto max-h-96 object-contain"
                            onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/600x400/e0ffe0/333333?text=${product.name || 'Product'}`; }}
                        />
                    </div>
                    <div>
                        <h2 className="text-4xl font-bold text-gray-800 mb-3">{product.name}</h2>
                        <p className="text-green-700 font-bold text-3xl mb-4">${product.price} / {product.unit}</p>
                        <p className="text-gray-700 mb-4">{product.description}</p>
                        <p className="text-gray-600 text-sm mb-2">Category: <span className="font-semibold">{product.category_name}</span></p>
                        <p className="text-gray-600 text-sm mb-4">Farmer: <span className="font-semibold">{product.farmer_username}</span></p>
                        <p className="text-sm font-semibold mb-6">
                            <span className={product.stock_quantity > 0 ? 'text-green-600' : 'text-red-600'}>
                                Stock: {product.stock_quantity > 0 ? `${product.stock_quantity} available` : 'Out of Stock'}
                            </span>
                        </p>
                        <button
                            onClick={() => addToCart(product)}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-md shadow-md transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                            disabled={product.stock_quantity <= 0}
                        >
                            <ShoppingCart size={20} /> Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // Shopping Cart Page Component
    const CartPage = () => {
        const { cartItems, updateCartQuantity, removeFromCart, clearCart, cartTotal } = useContext(CartContext);
        const { user } = useContext(AuthContext); // To check if user is logged in for checkout

        if (cartItems.length === 0) {
            return (
                <div className="p-6 text-center">
                    <ShoppingCart size={64} className="text-gray-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-700 mb-2">Your Cart is Empty</h2>
                    <p className="text-gray-600 mb-6">Looks like you haven't added anything to your cart yet.</p>
                    <button
                        onClick={() => navigate('products')}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md shadow-md transition-colors duration-300"
                    >
                        Start Shopping
                    </button>
                </div>
            );
        }

        return (
            <div className="p-6">
                <h2 className="text-3xl font-bold text-green-800 mb-6">Your Shopping Cart</h2>
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Cart Items List */}
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map(item => (
                            <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm flex items-center space-x-4 border border-gray-200">
                                <img
                                    src={item.image_url || `https://placehold.co/100x100/e0ffe0/333333?text=Product`}
                                    alt={item.name}
                                    className="w-24 h-24 object-cover rounded-md"
                                />
                                <div className="flex-grow">
                                    <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                                    <p className="text-gray-600">${item.price.toFixed(2)} / {item.unit}</p>
                                    <div className="flex items-center mt-2">
                                        <button
                                            onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                                            className="bg-gray-200 hover:bg-gray-300 p-1 rounded-full"
                                            aria-label="Decrease quantity"
                                        >
                                            <Minus size={16} />
                                        </button>
                                        <span className="mx-2 font-bold">{item.quantity}</span>
                                        <button
                                            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                                            className="bg-gray-200 hover:bg-gray-300 p-1 rounded-full"
                                            aria-label="Increase quantity"
                                        >
                                            <Plus size={16} />
                                        </button>
                                        <span className="ml-4 text-green-700 font-semibold">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="text-red-500 hover:text-red-700 p-2 rounded-full"
                                    aria-label="Remove item"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Cart Summary */}
                    <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md border border-green-200 sticky top-4">
                        <h3 className="text-xl font-bold text-green-800 mb-4">Order Summary</h3>
                        <div className="flex justify-between text-lg font-semibold mb-4">
                            <span>Total Items:</span>
                            <span>{cartItems.reduce((total, item) => total + item.quantity, 0)}</span>
                        </div>
                        <div className="flex justify-between text-2xl font-bold text-green-800 mb-6">
                            <span>Subtotal:</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>
                        {user ? (
                            <button
                                onClick={() => navigate('checkout')}
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-md shadow-lg transition-colors duration-300 flex items-center justify-center space-x-2"
                            >
                                <CheckCircle2 size={20} /> Proceed to Checkout
                            </button>
                        ) : (
                            <p className="text-center text-gray-600 text-sm">
                                <button onClick={() => navigate('auth')} className="text-green-600 hover:underline">Log in</button> to proceed to checkout.
                            </p>
                        )}
                        <button
                            onClick={clearCart}
                            className="w-full mt-4 bg-red-100 hover:bg-red-200 text-red-700 font-bold py-2 px-4 rounded-md transition-colors duration-300"
                        >
                            Clear Cart
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // Checkout Page Component
    const CheckoutPage = () => {
        const { user } = useContext(AuthContext);
        const { cartItems, cartTotal, clearCart } = useContext(CartContext);

        const [shippingAddress, setShippingAddress] = useState('');
        const [paymentMethod, setPaymentMethod] = useState('card');
        const [isLoading, setIsLoading] = useState(false);
        const [error, setError] = useState(null);
        const [orderSuccess, setOrderSuccess] = useState(false);
        const [orderId, setOrderId] = useState(null);

        useEffect(() => {
            if (!user) {
                setError('You must be logged in to checkout.');
                setTimeout(() => navigate('auth'), 2000); // Redirect to auth page
            }
            if (cartItems.length === 0 && !orderSuccess) {
                setError('Your cart is empty. Please add products before checking out.');
                setTimeout(() => navigate('products'), 2000); // Redirect to products page
            }
        }, [user, cartItems, orderSuccess]);


        const handlePlaceOrder = async (e) => {
            e.preventDefault();
            setError(null);
            setIsLoading(true);

            if (!shippingAddress.trim() || !paymentMethod.trim()) {
                setError('Shipping address and payment method are required.');
                setIsLoading(false);
                return;
            }

            if (cartItems.length === 0) {
                setError('Your cart is empty. Cannot place an empty order.');
                setIsLoading(false);
                return;
            }

            try {
                const orderItemsPayload = cartItems.map(item => ({
                    productId: item.id,
                    quantity: item.quantity,
                }));

                const response = await fetch(`${API_BASE_URL}/orders`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.token}`,
                    },
                    body: JSON.stringify({
                        orderItems: orderItemsPayload,
                        shippingAddress,
                        paymentMethod,
                    }),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Failed to place order.');
                }

                setOrderId(data.orderId);
                setOrderSuccess(true);
                clearCart(); // Clear cart after successful order
                // Optionally navigate to an order confirmation page or dashboard
            } catch (err) {
                setError(err.message);
                console.error("Place order error:", err);
            } finally {
                setIsLoading(false);
            }
        };

        if (!user || cartItems.length === 0 && !orderSuccess) {
            // Render a loading or redirection message while useEffect handles navigation
            return (
                <div className="text-center py-10">
                    <Loader2 className="animate-spin text-green-500 mx-auto mb-2" size={48} />
                    <p className="text-gray-600">{error || "Redirecting..."}</p>
                </div>
            );
        }

        if (orderSuccess) {
            return (
                <div className="p-6 text-center bg-white rounded-lg shadow-lg max-w-xl mx-auto my-8">
                    <CheckCircle2 size={64} className="text-green-500 mx-auto mb-4" />
                    <h2 className="text-3xl font-bold text-green-800 mb-4">Order Placed Successfully!</h2>
                    <p className="text-gray-700 mb-2">Your order ID is: <span className="font-semibold">{orderId}</span></p>
                    <p className="text-gray-600 mb-6">Thank you for shopping with AgriHub!</p>
                    <button
                        onClick={() => navigate('dashboard')}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md shadow-md transition-colors duration-300"
                    >
                        View My Orders
                    </button>
                    <button
                        onClick={() => navigate('products')}
                        className="ml-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md shadow-md transition-colors duration-300"
                    >
                        Continue Shopping
                    </button>
                </div>
            );
        }

        return (
            <div className="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold text-green-800 mb-6">Checkout</h2>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-sm mb-4" role="alert">
                        {error}
                    </div>
                )}

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Order Summary */}
                    <div>
                        <h3 className="text-xl font-semibold text-green-700 mb-4">Order Summary</h3>
                        <ul className="space-y-2 border-b border-gray-200 pb-4 mb-4">
                            {cartItems.map(item => (
                                <li key={item.id} className="flex justify-between items-center text-gray-700">
                                    <span>{item.name} ({item.quantity} {item.unit})</span>
                                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="flex justify-between text-xl font-bold text-green-800">
                            <span>Total:</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Shipping and Payment Form */}
                    <form onSubmit={handlePlaceOrder} className="space-y-4">
                        <h3 className="text-xl font-semibold text-green-700 mb-4">Shipping & Payment</h3>
                        <div>
                            <label htmlFor="shippingAddress" className="block text-gray-700 text-sm font-bold mb-2">Shipping Address</label>
                            <textarea
                                id="shippingAddress"
                                rows="3"
                                className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-green-500"
                                value={shippingAddress}
                                onChange={(e) => setShippingAddress(e.target.value)}
                                placeholder="Street, City, State, Zip Code"
                                required
                                disabled={isLoading}
                            ></textarea>
                        </div>
                        <div>
                            <label htmlFor="paymentMethod" className="block text-gray-700 text-sm font-bold mb-2">Payment Method</label>
                            <select
                                id="paymentMethod"
                                className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-green-500"
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                required
                                disabled={isLoading}
                            >
                                <option value="card">Credit Card</option>
                                <option value="paypal">PayPal</option>
                                <option value="m-pesa">M-Pesa</option>
                                <option value="cod">Cash on Delivery</option>
                            </select>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-md shadow-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="animate-spin mr-2" size={20} /> Placing Order...
                                </>
                            ) : (
                                <>
                                    <Package size={20} /> Place Order
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        );
    };

    // Dashboard Page Component (with order history for customers, product/order management for farmers/admins)
    const DashboardPage = () => {
        const { user, loading: authLoading } = useContext(AuthContext);
        const [orders, setOrders] = useState([]);
        const [productsManaged, setProductsManaged] = useState([]); // Products listed by farmer/admin
        const [isLoadingData, setIsLoadingData] = useState(true);
        const [error, setError] = useState(null);

        useEffect(() => {
            const fetchData = async () => {
                if (!user || authLoading) return;

                setIsLoadingData(true);
                setError(null);

                const token = user.token;
                const headers = { 'Authorization': `Bearer ${token}` };

                try {
                    // Fetch user's orders (if customer) or all orders (if admin/farmer)
                    const ordersEndpoint = user.role === 'customer' ? '/orders/myorders' : '/orders';
                    const ordersResponse = await fetch(`${API_BASE_URL}${ordersEndpoint}`, { headers });
                    if (!ordersResponse.ok) throw new Error('Failed to fetch orders');
                    const ordersData = await ordersResponse.json();
                    setOrders(ordersData);

                    // If user is a farmer or admin, also fetch their managed products/categories
                    if (user.role === 'farmer' || user.role === 'admin') {
                        const productsResponse = await fetch(`${API_BASE_URL}/products`, { headers });
                        if (!productsResponse.ok) throw new Error('Failed to fetch managed products');
                        const productsData = await productsResponse.json();
                        // Filter for farmer's own products if role is farmer
                        if (user.role === 'farmer') {
                            setProductsManaged(productsData.filter(p => p.farmer_id === user.id));
                        } else {
                            setProductsManaged(productsData); // Admin sees all products
                        }
                    }

                } catch (err) {
                    setError(err.message);
                    console.error("Dashboard data fetch error:", err);
                } finally {
                    setIsLoadingData(false);
                }
            };

            fetchData();
        }, [user, authLoading]); // Re-fetch when user or authLoading state changes

        if (authLoading) return <div className="text-center py-10"><Loader2 className="animate-spin text-green-500 mx-auto mb-2" size={48} /><p>Loading user data...</p></div>;
        if (!user) return <div className="p-6 text-center text-gray-600"><p>Please log in to view your dashboard.</p><button onClick={() => navigate('auth')} className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md">Login</button></div>;


        return (
            <div className="p-6">
                <h2 className="text-3xl font-bold text-green-800 mb-6">Welcome, {user.username}!</h2>
                <p className="text-gray-700 mb-4">Your role: <span className="font-semibold capitalize">{user.role}</span></p>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-sm mb-4" role="alert">
                        {error}
                    </div>
                )}

                {isLoadingData ? (
                    <div className="text-center py-10">
                        <Loader2 className="animate-spin text-green-500 mx-auto mb-2" size={48} />
                        <p className="text-gray-600">Loading dashboard data...</p>
                    </div>
                ) : (
                    <>
                        {/* User ID Section */}
                        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800">
                            <p><strong>Your User ID:</strong> {user.id}</p>
                            <p className="text-sm mt-1">This ID identifies your account and associated data on AgriHub.</p>
                        </div>

                        {/* Customer Orders Section */}
                        {user.role === 'customer' && (
                            <div className="mt-8">
                                <h3 className="text-2xl font-semibold text-green-700 mb-4">My Orders</h3>
                                {orders.length === 0 ? (
                                    <p className="text-gray-600">You haven't placed any orders yet.</p>
                                ) : (
                                    <div className="space-y-4">
                                        {orders.map(order => (
                                            <div key={order.id} className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
                                                <div className="flex justify-between items-center mb-2">
                                                    <h4 className="font-bold text-lg text-gray-800">Order #{order.id?.substring(0, 8)}...</h4>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                    </span>
                                                </div>
                                                <p className="text-gray-600 text-sm">Date: {new Date(order.order_date).toLocaleString()}</p>
                                                <p className="text-gray-600 text-sm">Total: <span className="font-bold">${order.total_amount}</span></p>
                                                <p className="text-gray-600 text-sm mb-2">Address: {order.shipping_address}</p>

                                                <h5 className="font-semibold text-gray-700 mt-3 mb-2">Items:</h5>
                                                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                                    {order.items.map(item => (
                                                        <li key={item.product_name}>
                                                            {item.product_name} x {item.quantity} (${item.price})
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Farmer/Admin Managed Products Section */}
                        {(user.role === 'farmer' || user.role === 'admin') && (
                            <div className="mt-8">
                                <h3 className="text-2xl font-semibold text-green-700 mb-4">Your Managed Products ({productsManaged.length})</h3>
                                {productsManaged.length === 0 ? (
                                    <p className="text-gray-600">You haven't listed any products yet. Go to the Products page to add your first listing!</p>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {productsManaged.map(product => (
                                            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-green-200">
                                                <img
                                                    src={product.image_url || `https://placehold.co/400x200/e0ffe0/333333?text=${product.name || 'Product'}`}
                                                    alt={product.name}
                                                    className="w-full h-32 object-cover"
                                                    onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/400x200/e0ffe0/333333?text=${product.name || 'Product'}`; }}
                                                />
                                                <div className="p-3">
                                                    <h4 className="text-lg font-semibold text-gray-800">{product.name}</h4>
                                                    <p className="text-green-700 font-bold">${product.price} / {product.unit}</p>
                                                    <p className="text-gray-500 text-xs">Stock: {product.stock_quantity}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Admin/Farmer View of All Orders */}
                        {(user.role === 'admin' || user.role === 'farmer') && (
                             <div className="mt-8">
                                <h3 className="text-2xl font-semibold text-green-700 mb-4">
                                    {user.role === 'admin' ? 'All Orders' : 'Orders for Your Products'} ({orders.length})
                                </h3>
                                {orders.length === 0 ? (
                                    <p className="text-gray-600">No orders found.</p>
                                ) : (
                                    <div className="space-y-4">
                                        {orders.map(order => (
                                            <div key={order.id} className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
                                                <div className="flex justify-between items-center mb-2">
                                                    <h4 className="font-bold text-lg text-gray-800">Order #{order.id?.substring(0, 8)}...</h4>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                    </span>
                                                </div>
                                                <p className="text-gray-600 text-sm">Date: {new Date(order.order_date).toLocaleString()}</p>
                                                <p className="text-gray-600 text-sm">Total: <span className="font-bold">${order.total_amount}</span></p>
                                                {user.role === 'admin' && <p className="text-gray-600 text-sm">Customer: {order.customer_username} ({order.customer_email})</p>}
                                                <p className="text-gray-600 text-sm mb-2">Address: {order.shipping_address}</p>

                                                <h5 className="font-semibold text-gray-700 mt-3 mb-2">Items:</h5>
                                                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                                    {order.items.map(item => (
                                                        <li key={item.product_name}>
                                                            {item.product_name} x {item.quantity} (${item.price})
                                                        </li>
                                                    ))}
                                                </ul>
                                                {/* Optional: Update status dropdown for Admin/Farmer */}
                                                {user.role === 'admin' && ( // Only admin can change global order status
                                                    <div className="mt-3">
                                                        <label htmlFor={`status-${order.id}`} className="block text-gray-700 text-sm font-bold mb-1">Update Status</label>
                                                        <select
                                                            id={`status-${order.id}`}
                                                            value={order.status}
                                                            onChange={async (e) => {
                                                                try {
                                                                    const response = await fetch(`${API_BASE_URL}/orders/${order.id}/status`, {
                                                                        method: 'PUT',
                                                                        headers: {
                                                                            'Content-Type': 'application/json',
                                                                            'Authorization': `Bearer ${user.token}`,
                                                                        },
                                                                        body: JSON.stringify({ status: e.target.value }),
                                                                    });
                                                                    if (!response.ok) throw new Error('Failed to update status');
                                                                    // Re-fetch orders to update UI
                                                                    const updatedOrdersResponse = await fetch(`${API_BASE_URL}/orders`, { headers });
                                                                    if (!updatedOrdersResponse.ok) throw new Error('Failed to re-fetch orders.');
                                                                    const updatedOrdersData = await updatedOrdersResponse.json();
                                                                    setOrders(updatedOrdersData);
                                                                } catch (err) {
                                                                    setError(err.message);
                                                                    console.error("Update order status error:", err);
                                                                }
                                                            }}
                                                            className="block w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                                                        >
                                                            <option value="pending">Pending</option>
                                                            <option value="processing">Processing</option>
                                                            <option value="shipped">Shipped</option>
                                                            <option value="delivered">Delivered</option>
                                                            <option value="cancelled">Cancelled</option>
                                                        </select>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        );
    };

    // Services Page (simplified, as per original request, not central to e-commerce flow here)
    const ServicesPage = () => {
        const { user } = useContext(AuthContext);
        const [services, setServices] = useState([]);
        const [isLoading, setIsLoading] = useState(true);
        const [error, setError] = useState(null);

        const [showAddServiceModal, setShowAddServiceModal] = useState(false);
        const [newService, setNewService] = useState({ name: '', description: '', price: '' });

        // Placeholder for fetching services (not connected to backend in this simplified model)
        useEffect(() => {
            setIsLoading(true);
            // Simulate API call for services
            const dummyServices = [
                { id: 's1', name: 'Tractor Rental (Hourly)', description: 'High-power tractor with operator for field preparation.', price: '75.00', providerId: 'mockfarmer1', created_at: '2024-01-01T10:00:00Z' },
                { id: 's2', name: 'Soil Testing & Analysis', description: 'Comprehensive soil nutrient analysis with recommendations.', price: '120.00', providerId: 'mockfarmer2', created_at: '2024-02-01T10:00:00Z' },
                { id: 's3', name: 'Crop Spraying Services', description: 'Professional pest and disease control for various crops.', price: '200.00', providerId: 'mockfarmer1', created_at: '2024-03-01T10:00:00Z' },
            ];
            setServices(dummyServices);
            setIsLoading(false);
        }, []);

        const handleAddService = () => {
            // This is a dummy handler, for a real backend, you'd make a POST request
            if (!newService.name || !newService.description || !newService.price) {
                alert("Service name, description, and price are required.");
                return;
            }
            const newId = `s${services.length + 1}`;
            setServices(prev => [...prev, { ...newService, id: newId, providerId: user?.id || 'anonymous', created_at: new Date().toISOString() }]);
            setNewService({ name: '', description: '', price: '' });
            setShowAddServiceModal(false);
        };


        return (
            <div className="p-6">
                <h2 className="text-3xl font-bold text-green-800 mb-6">Integrated Farm Services</h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                    Beyond products, AgriHub offers a comprehensive marketplace for farm-related services. Farmers can list and book essential services like equipment rentals, specialized agricultural support, or even offer unique on-farm experiences to connect with the community.
                </p>
                {user?.role === 'farmer' || user?.role === 'admin' ? (
                    <button
                        onClick={() => setShowAddServiceModal(true)}
                        className="mb-6 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-300 flex items-center"
                    >
                        <PlusCircle className="mr-2" size={20} /> Add New Service
                    </button>
                ) : null}
                {isLoading ? (
                    <div className="text-center py-10">
                        <Loader2 className="animate-spin text-green-500 mx-auto mb-2" size={48} />
                        <p className="text-gray-600">Loading services...</p>
                    </div>
                ) : services.length === 0 ? (
                    <p className="text-gray-600">No services listed yet. Farmers, offer your expertise!</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {services.map(service => (
                            <div key={service.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">{service.name}</h3>
                                <p className="text-gray-600 text-sm mb-3">{service.description}</p>
                                <p className="text-green-700 font-bold text-lg">${service.price || 'Varies'}</p>
                                <p className="text-gray-500 text-xs mt-2">Provided by: {service.providerId?.substring(0, 8)}...</p>
                            </div>
                        ))}
                    </div>
                )}
                {showAddServiceModal && (
                    <div className="fixed inset-0 flex items-center justify-center modal-overlay">
                        <div className="bg-white p-8 rounded-lg shadow-xl modal-content max-w-md w-full relative">
                            <button
                                onClick={() => setShowAddServiceModal(false)}
                                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition-colors duration-200"
                            >
                                <XCircle size={24} />
                            </button>
                            <h3 className="text-2xl font-bold text-green-800 mb-6">Add New Service</h3>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="serviceName" className="block text-gray-700 text-sm font-bold mb-2">Service Name</label>
                                    <input
                                        type="text"
                                        id="serviceName"
                                        className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-green-500"
                                        value={newService.name}
                                        onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                                        placeholder="e.g., Tractor Rental"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="serviceDescription" className="block text-gray-700 text-sm font-bold mb-2">Description</label>
                                    <textarea
                                        id="serviceDescription"
                                        rows="3"
                                        className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-green-500"
                                        value={newService.description}
                                        onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                                        placeholder="Full-day tractor rental with operator..."
                                        required
                                    ></textarea>
                                </div>
                                <div>
                                    <label htmlFor="servicePrice" className="block text-gray-700 text-sm font-bold mb-2">Price (per hour/day/etc.)</label>
                                    <input
                                        type="number"
                                        id="servicePrice"
                                        className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-green-500"
                                        value={newService.price}
                                        onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                                        placeholder="e.g., 150.00"
                                        required
                                    />
                                </div>
                                <button
                                    onClick={handleAddService}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-300"
                                >
                                    Add Service
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    // Events Page (simplified, as per original request)
    const EventsPage = () => {
        const [events, setEvents] = useState([]);
        const [isLoading, setIsLoading] = useState(true);
        const [error, setError] = useState(null);

        // Placeholder for fetching events (not connected to backend in this simplified model)
        useEffect(() => {
            setIsLoading(true);
            // Simulate API call
            const dummyEvents = [
                { id: 'e1', name: 'Spring Planting Workshop', description: 'Learn best practices for spring planting and soil health.', date: '2025-04-15' },
                { id: 'e2', name: 'Farm-to-Table Dinner Gala', description: 'Enjoy a multi-course meal prepared with local, seasonal ingredients.', date: '2025-05-20' },
                { id: 'e3', name: 'Sustainable Farming Expo', description: 'Explore innovations in eco-friendly agriculture and connect with experts.', date: '2025-06-10' },
            ];
            setEvents(dummyEvents);
            setIsLoading(false);
        }, []);

        return (
            <div className="p-6">
                <h2 className="text-3xl font-bold text-green-800 mb-6">Upcoming Events & Workshops</h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                    Join the AgriHub community at various virtual or in-person events. From seasonal festivals and cooking demonstrations to sustainable farming workshops and farmer meetups, there's always something new to learn and experience.
                </p>
                {isLoading ? (
                    <div className="text-center py-10">
                        <Loader2 className="animate-spin text-green-500 mx-auto mb-2" size={48} />
                        <p className="text-gray-600">Loading events...</p>
                    </div>
                ) : events.length === 0 ? (
                    <p className="text-gray-600">No events scheduled yet. Check back soon!</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events.map(event => (
                            <div key={event.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">{event.name}</h3>
                                <p className="text-gray-600 text-sm mb-3">{event.description}</p>
                                <p className="text-gray-500 text-xs flex items-center"><MapPin size={16} className="mr-1" /> Date: {event.date}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };


    // --- Central Page Rendering Logic ---
    const renderCurrentPage = () => {
        // This 'switch' statement defines which page component to render
        // based on the currentPage state.
        switch (currentPage) {
            case 'home':
                return <HomePage />;
            case 'products':
                return <ProductsPage />;
            case 'product_detail':
                // Pass productId from currentPageData to ProductDetailPage
                return <ProductDetailPage productId={currentPageData.productId} />;
            case 'services':
                return <ServicesPage />;
            case 'events':
                return <EventsPage />;
            case 'dashboard':
                return <DashboardPage />;
            case 'cart':
                return <CartPage />;
            case 'checkout':
                return <CheckoutPage />;
            case 'auth':
                return <AuthPage />;
            default:
                return <HomePage />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 font-sans text-gray-900 flex flex-col">
            {/* The <style> tag below is for specific modal overlays/animations */}
            <style>
                {`
                    body { font-family: 'Inter', sans-serif; }
                    .modal-overlay {
                        background-color: rgba(0, 0, 0, 0.5);
                        z-index: 1000;
                    }
                    .modal-content {
                        z-index: 1001;
                    }
                    .no-scrollbar::-webkit-scrollbar {
                        display: none;
                    }
                    .no-scrollbar {
                        -ms-overflow-style: none;
                        scrollbar-width: none;
                    }
                `}
            </style>

            {/* Show loading spinner while authentication state is being determined */}
            {authLoading ? (
                <div className="flex items-center justify-center min-h-screen">
                    <Loader2 className="animate-spin text-green-500" size={64} />
                </div>
            ) : (
                // If not logged in and not on the auth page, display the AuthPage
                user === null && currentPage !== 'auth' ? (
                    <AuthPage />
                ) : (
                    // Otherwise, display the main application layout
                    <>
                        <Header />
                        <main className="container mx-auto my-8 p-4 bg-white rounded-lg shadow-lg flex-grow">
                            {renderCurrentPage()}
                        </main>
                        <Footer />
                    </>
                )
            )}
        </div>
    );
};

// --- Main App Component (Responsible for providing contexts) ---
// This component now acts as the root that wraps the MainAppContent with providers.
const App = () => {
    return (
        <AuthProvider>
            <CartProvider>
                <MainAppContent />
            </CartProvider>
        </AuthProvider>
    );
};

export default App;
