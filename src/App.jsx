import React, { useState, useEffect, useMemo } from 'react';
import { 
  Wallet, PieChart as PieChartIcon, TrendingUp, Sparkles, MessageSquare, 
  Users, CheckCircle2, AlertCircle, Plus, Trash2, Shield, Search, Download, 
  ArrowUpRight, ArrowDownRight, Sun, Moon, LogOut, Lock, Mail, User, Key, 
  RefreshCw, Send, Check, DollarSign, Calendar, Tag, CreditCard, UserPlus, 
  ShieldCheck, HelpCircle, FileText, ChevronRight, Calculator, Home, Zap
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, 
  LineChart, Line, XAxis, YAxis, CartesianGrid, AreaChart, Area 
} from 'recharts';

// --- INITIAL MOCK DATA ---
const INITIAL_USERS = [
  { id: '1', name: 'Alex Johnson', email: 'alex@student.edu', password: 'Password123!' }
];

const INITIAL_EXPENSES = [
  { id: '1', title: 'Monthly PG Rent', amount: 8500, category: 'Rent', date: '2026-03-01', note: 'Paid via UPI' },
  { id: '2', title: 'Mess Bill', amount: 3200, category: 'Food', date: '2026-03-02', note: 'Monthly mess subscription' },
  { id: '3', title: 'Data Pack & WiFi', amount: 499, category: 'Utilities', date: '2026-03-05', note: 'Recharge' },
  { id: '4', title: 'Semester Books', amount: 1450, category: 'Education', date: '2026-03-08', note: 'CS textbooks' },
  { id: '5', title: 'Weekend Swiggy Order', amount: 680, category: 'Food', date: '2026-03-12', note: 'Pizza with flatmates' },
  { id: '6', title: 'Metro Smart Card Recharge', amount: 500, category: 'Transport', date: '2026-03-15', note: 'Monthly commute' },
  { id: '7', title: 'Movie & Snacks', amount: 450, category: 'Entertainment', date: '2026-03-18', note: 'Inox Mall' },
  { id: '8', title: 'Canteen Coffee & Snacks', amount: 180, category: 'Food', date: '2026-03-22', note: 'Campus canteen' },
];

const INITIAL_FLATMATES = [
  { id: 'f1', name: 'Alex (You)', avatar: '👨‍🎓', paidAmount: 8500 },
  { id: 'f2', name: 'Rohan Sharma', avatar: '👨‍💻', paidAmount: 3200 },
  { id: 'f3', name: 'Priya Patel', avatar: '👩‍🔬', paidAmount: 1200 },
  { id: 'f4', name: 'Aniket Verma', avatar: '👨‍🎨', paidAmount: 0 },
  { id: 'f5', name: 'Sneha Gupta', avatar: '👩‍💻', paidAmount: 2100 },
];

const CATEGORY_COLORS = {
  Food: '#f59e0b',
  Rent: '#3b82f6',
  Utilities: '#10b981',
  Education: '#8b5cf6',
  Transport: '#ec4899',
  Entertainment: '#6366f1',
  Others: '#64748b'
};

const PRESET_ROOM_EXPENSES = [
  { title: 'Flat Monthly Rent', defaultAmount: 25000, cat: 'Rent' },
  { title: 'Electricity Bill', defaultAmount: 2400, cat: 'Utilities' },
  { title: 'High-Speed Wi-Fi', defaultAmount: 999, cat: 'Utilities' },
  { title: 'Groceries & Supplies', defaultAmount: 4500, cat: 'Food' },
  { title: 'Maid / Cook Salary', defaultAmount: 3500, cat: 'Services' },
  { title: 'LPG Gas Cylinder', defaultAmount: 1100, cat: 'Utilities' }
];

export default function App() {
  // Theme State
  const [theme, setTheme] = useState('dark');
  
  // Auth State
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('sw_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('sw_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Auth UI Form State
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup' | 'forgot'
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  // Forgot Password Steps
  const [resetStep, setResetStep] = useState(1); // 1: Email, 2: OTP, 3: New Pass
  const [otpInput, setOtpInput] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Main Dashboard Tab State
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'expenses' | 'roommates' | 'evaluator' | 'aichat'

  // App Data State
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('sw_expenses');
    return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
  });
  const [monthlyBudget, setMonthlyBudget] = useState(18000);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // New Expense Form State
  const [newExpTitle, setNewExpTitle] = useState('');
  const [newExpAmount, setNewExpAmount] = useState('');
  const [newExpCat, setNewExpCat] = useState('Food');
  const [newExpDate, setNewExpDate] = useState(new Date().toISOString().split('T')[0]);
  const [newExpNote, setNewExpNote] = useState('');

  // Roommates Split State
  const [flatmates, setFlatmates] = useState(() => {
    const saved = localStorage.getItem('sw_flatmates');
    return saved ? JSON.parse(saved) : INITIAL_FLATMATES;
  });
  const [newMemberName, setNewMemberName] = useState('');
  const [splitExpenseTitle, setSplitExpenseTitle] = useState('Flat Electricity & Wi-Fi');
  const [splitExpenseAmount, setSplitExpenseAmount] = useState('3500');
  const [paidByMemberId, setPaidByMemberId] = useState('f1');

  // AI Purchase Evaluator State
  const [evalItem, setEvalItem] = useState('');
  const [evalPrice, setEvalPrice] = useState('');
  const [evalCategory, setEvalCategory] = useState('Gadgets');
  const [evalResult, setEvalResult] = useState(null);
  const [evalLoading, setEvalLoading] = useState(false);

  // AI Chatbot State
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: 'Hello Student! 🎓 I am SpendWise AI, your personal financial advisor. Ask me anything about saving money, budgeting, split calculations, or smart investments!' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('sw_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('sw_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('sw_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('sw_flatmates', JSON.stringify(flatmates));
  }, [flatmates]);

  // Apply Theme
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // --- AUTHENTICATION HANDLERS ---
  const handleLogin = (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    if (!authEmail || !authPassword) {
      setAuthError('Please fill in both email and password.');
      return;
    }

    const foundUser = users.find(u => u.email.toLowerCase() === authEmail.trim().toLowerCase());
    if (!foundUser) {
      setAuthError('Invalid email or password. Please check your credentials or signup.');
      return;
    }

    if (foundUser.password !== authPassword) {
      setAuthError('Incorrect password. Please try again or use Forgot Password.');
      return;
    }

    setCurrentUser(foundUser);
    setAuthEmail('');
    setAuthPassword('');
  };

  const handleSignup = (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    if (!authName || !authEmail || !authPassword) {
      setAuthError('All fields are required for signup.');
      return;
    }

    const existing = users.find(u => u.email.toLowerCase() === authEmail.trim().toLowerCase());
    if (existing) {
      setAuthError('An account with this email already exists. Please login instead.');
      return;
    }

    const newUser = {
      id: Date.now().toString(),
      name: authName.trim(),
      email: authEmail.trim().toLowerCase(),
      password: authPassword
    };

    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    setAuthName('');
    setAuthEmail('');
    setAuthPassword('');
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    if (!authEmail) {
      setAuthError('Please enter your registered email.');
      return;
    }

    const existing = users.find(u => u.email.toLowerCase() === authEmail.trim().toLowerCase());
    if (!existing) {
      setAuthError('No user account found with this email.');
      return;
    }

    setResetStep(2);
    setAuthSuccess('Demo OTP code [ 849201 ] sent to your email address!');
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    if (otpInput.trim() !== '849201' && otpInput.trim() !== '123456') {
      setAuthError('Invalid OTP code. Please enter 849201 for demo.');
      return;
    }

    setResetStep(3);
    setAuthSuccess('OTP verified successfully! Set your new password.');
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    setAuthError('');

    if (!newPassword || newPassword.length < 6) {
      setAuthError('New password must be at least 6 characters.');
      return;
    }

    setUsers(users.map(u => {
      if (u.email.toLowerCase() === authEmail.trim().toLowerCase()) {
        return { ...u, password: newPassword };
      }
      return u;
    }));

    setAuthSuccess('Password updated successfully! You can now log in.');
    setTimeout(() => {
      setAuthMode('login');
      setResetStep(1);
      setAuthEmail('');
      setNewPassword('');
      setOtpInput('');
      setAuthSuccess('');
    }, 1500);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('dashboard');
  };

  // --- EXPENSE MANAGEMENT ---
  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!newExpTitle || !newExpAmount) return;

    const exp = {
      id: Date.now().toString(),
      title: newExpTitle,
      amount: parseFloat(newExpAmount),
      category: newExpCat,
      date: newExpDate,
      note: newExpNote
    };

    setExpenses([exp, ...expenses]);
    setNewExpTitle('');
    setNewExpAmount('');
    setNewExpNote('');
  };

  const handleDeleteExpense = (id) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  const filteredExpenses = useMemo(() => {
    return expenses.filter(e => {
      const matchesSearch = e.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            e.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || e.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [expenses, searchTerm, categoryFilter]);

  // Aggregation Calculations
  const totalSpent = useMemo(() => {
    return expenses.reduce((acc, curr) => acc + curr.amount, 0);
  }, [expenses]);

  const categoryBreakdownData = useMemo(() => {
    const map = {};
    expenses.forEach(e => {
      map[e.category] = (map[e.category] || 0) + e.amount;
    });
    return Object.keys(map).map(cat => ({
      name: cat,
      value: map[cat],
      color: CATEGORY_COLORS[cat] || '#64748b'
    }));
  }, [expenses]);

  const dailyTrendData = useMemo(() => {
    const map = {};
    expenses.forEach(e => {
      map[e.date] = (map[e.date] || 0) + e.amount;
    });
    const sortedDates = Object.keys(map).sort();
    return sortedDates.map(date => ({
      date: date.slice(5), // MM-DD
      amount: map[date]
    }));
  }, [expenses]);

  const yearlyData = [
    { month: 'Jan', amount: 14200, budget: 18000 },
    { month: 'Feb', amount: 16500, budget: 18000 },
    { month: 'Mar', amount: totalSpent, budget: monthlyBudget },
    { month: 'Apr', amount: 0, budget: 18000 },
    { month: 'May', amount: 0, budget: 18000 },
    { month: 'Jun', amount: 0, budget: 18000 },
    { month: 'Jul', amount: 0, budget: 18000 },
    { month: 'Aug', amount: 0, budget: 18000 },
    { month: 'Sep', amount: 0, budget: 18000 },
    { month: 'Oct', amount: 0, budget: 18000 },
    { month: 'Nov', amount: 0, budget: 18000 },
    { month: 'Dec', amount: 0, budget: 18000 },
  ];

  // --- FLATMATES ROOM SPLIT ENGINE ---
  const handleAddFlatmate = () => {
    if (!newMemberName.trim()) return;
    if (flatmates.length >= 6) {
      alert('Maximum 6 room members allowed per flat!');
      return;
    }
    const newMember = {
      id: 'f' + (flatmates.length + 1),
      name: newMemberName.trim(),
      avatar: ['👨‍🎓', '👩‍🎓', '👨‍💻', '👩‍🔬', '👨‍🎨', '👩‍💼'][flatmates.length % 6],
      paidAmount: 0
    };
    setFlatmates([...flatmates, newMember]);
    setNewMemberName('');
  };

  const handleRemoveFlatmate = (id) => {
    if (flatmates.length <= 2) {
      alert('You need at least 2 room members for splitting!');
      return;
    }
    setFlatmates(flatmates.filter(m => m.id !== id));
  };

  const handleApplyQuickPreset = (preset) => {
    setSplitExpenseTitle(preset.title);
    setSplitExpenseAmount(preset.defaultAmount.toString());
  };

  const handleAddSharedExpense = (e) => {
    e.preventDefault();
    const amt = parseFloat(splitExpenseAmount);
    if (!amt || isNaN(amt)) return;

    setFlatmates(flatmates.map(m => {
      if (m.id === paidByMemberId) {
        return { ...m, paidAmount: m.paidAmount + amt };
      }
      return m;
    }));

    // Add entry to overall expenses as well
    const exp = {
      id: Date.now().toString(),
      title: `[Shared Split] ${splitExpenseTitle}`,
      amount: Math.round(amt / flatmates.length),
      category: 'Rent',
      date: new Date().toISOString().split('T')[0],
      note: `Split total ₹${amt.toLocaleString('en-IN')} among ${flatmates.length} members`
    };
    setExpenses([exp, ...expenses]);
    setSplitExpenseTitle('');
    setSplitExpenseAmount('');
  };

  const totalSharedPool = useMemo(() => {
    return flatmates.reduce((acc, m) => acc + m.paidAmount, 0);
  }, [flatmates]);

  const perMemberShare = useMemo(() => {
    return flatmates.length ? totalSharedPool / flatmates.length : 0;
  }, [totalSharedPool, flatmates]);

  const settlementTransfers = useMemo(() => {
    const balances = flatmates.map(m => ({
      ...m,
      net: m.paidAmount - perMemberShare
    }));

    const debtors = balances.filter(b => b.net < -1).sort((a, b) => a.net - b.net);
    const creditors = balances.filter(b => b.net > 1).sort((a, b) => b.net - a.net);

    const transactions = [];
    let dIdx = 0;
    let cIdx = 0;

    while (dIdx < debtors.length && cIdx < creditors.length) {
      const debtor = debtors[dIdx];
      const creditor = creditors[cIdx];

      const amountToPay = Math.min(Math.abs(debtor.net), creditor.net);
      if (amountToPay > 1) {
        transactions.push({
          from: debtor.name,
          to: creditor.name,
          amount: Math.round(amountToPay)
        });
      }

      debtor.net += amountToPay;
      creditor.net -= amountToPay;

      if (Math.abs(debtor.net) < 1) dIdx++;
      if (creditor.net < 1) cIdx++;
    }

    return transactions;
  }, [flatmates, perMemberShare]);

  // --- AI EVALUATOR HANDLER ---
  const handleEvaluatePurchase = (e) => {
    e.preventDefault();
    if (!evalItem || !evalPrice) return;

    setEvalLoading(true);
    setTimeout(() => {
      const price = parseFloat(evalPrice);
      const daysOfMessFood = Math.round(price / 120); // ₹120 per meal
      const percentageOfBudget = ((price / monthlyBudget) * 100).toFixed(1);

      let verdict = 'NEUTRAL';
      let score = 65;
      let advice = '';

      if (price > monthlyBudget * 0.3) {
        verdict = 'HIGH RISK';
        score = 25;
        advice = `This purchase takes away ${percentageOfBudget}% of your entire monthly budget! Consider waiting 30 days before making this decision or finding a student discount.`;
      } else if (price < monthlyBudget * 0.05) {
        verdict = 'SAFE BUY';
        score = 92;
        advice = `Easily affordable within your monthly budget allowance. Go ahead if it truly helps your productivity or student life!`;
      } else {
        verdict = 'CONSIDER TWICE';
        score = 58;
        advice = `This is equivalent to roughly ${daysOfMessFood} campus mess meals. Make sure it isn't an impulse buy.`;
      }

      setEvalResult({
        item: evalItem,
        price,
        verdict,
        score,
        advice,
        messMealsEquiv: daysOfMessFood,
        budgetPercent: percentageOfBudget
      });
      setEvalLoading(false);
    }, 1000);
  };

  // --- AI CHATBOT HANDLER ---
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = { sender: 'user', text: chatInput };
    setChatMessages(prev => [...prev, userMsg]);
    const inputQuery = chatInput;
    setChatInput('');
    setChatLoading(true);

    setTimeout(() => {
      let botResponse = '';
      const q = inputQuery.toLowerCase();

      if (q.includes('save') || q.includes('saving')) {
        botResponse = '💡 Top Student Saving Tip: Follow the 50/30/20 budget rule for Indian students! Allocate 50% to essential PG/Mess bills, 30% for study/college needs, and save 20% in a liquid high-yield savings account or emergency fund.';
      } else if (q.includes('mess') || q.includes('food') || q.includes('swiggy')) {
        botResponse = '🍱 Food Budget Advice: Cooking simple meals or sticking to your college mess can save you up to ₹4,000/month compared to ordering online via Swiggy/Zomato!';
      } else if (q.includes('rent') || q.includes('flat') || q.includes('room')) {
        botResponse = '🏠 Flat Split Strategy: Always use our Flat Roommates tab! Splitting WiFi, electricity, maid salary, and gas cylinders equally among 4 to 6 members keeps your individual share under ₹3,500/month.';
      } else if (q.includes('invest') || q.includes('sip') || q.includes('stocks')) {
        botResponse = '📈 Student Investing: Start small! You can begin a Mutual Fund SIP with as little as ₹500/month on platforms like Groww or Zerodha once you build an emergency buffer of 3 months.';
      } else {
        botResponse = `Thanks for asking! Based on your current spend of ₹${totalSpent.toLocaleString('en-IN')}, you have spent ${((totalSpent/monthlyBudget)*100).toFixed(0)}% of your monthly budget. Remember to track every small canteen purchase!`;
      }

      setChatMessages(prev => [...prev, { sender: 'bot', text: botResponse }]);
      setChatLoading(false);
    }, 1000);
  };

  // --- RENDER LOGIN/AUTH OVERLAY IF NOT LOGGED IN ---
  if (!currentUser) {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'} flex flex-col justify-between transition-colors duration-200`}>
        {/* Top Navbar */}
        <header className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-500/30">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                SpendWise AI
              </span>
              <span className="text-xs block text-slate-500 dark:text-slate-400 font-medium">Smart Student Financial Hub</span>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
          </button>
        </header>

        {/* Auth Card Container */}
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden p-6 sm:p-8">
            
            {/* Header Title */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                {authMode === 'login' && 'Welcome Back!'}
                {authMode === 'signup' && 'Create Student Account'}
                {authMode === 'forgot' && 'Reset Password'}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {authMode === 'login' && 'Log in to track expenses & roommate splits'}
                {authMode === 'signup' && 'Join SpendWise AI to manage your college budget'}
                {authMode === 'forgot' && 'Follow steps to recover your account access'}
              </p>
            </div>

            {/* Error / Success Notifications */}
            {authError && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}
            {authSuccess && (
              <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{authSuccess}</span>
              </div>
            )}

            {/* LOGIN FORM */}
            {authMode === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-5 h-5 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="email"
                      value={authEmail}
                      onChange={e => setAuthEmail(e.target.value)}
                      placeholder="alex@student.edu"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-5 h-5 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="password"
                      value={authPassword}
                      onChange={e => setAuthPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => { setAuthMode('forgot'); setResetStep(1); setAuthError(''); setAuthSuccess(''); }}
                    className="text-xs text-indigo-500 hover:text-indigo-400 font-medium"
                  >
                    Forgot Password?
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/25 transition duration-200 text-sm flex items-center justify-center gap-2"
                >
                  <span>Sign In</span>
                  <ChevronRight className="w-4 h-4" />
                </button>

                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
                  Demo Account: <span className="font-mono text-indigo-500">alex@student.edu</span> | Pass: <span className="font-mono text-indigo-500">Password123!</span>
                </div>
              </form>
            )}

            {/* SIGNUP FORM */}
            {authMode === 'signup' && (
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-5 h-5 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      value={authName}
                      onChange={e => setAuthName(e.target.value)}
                      placeholder="Rahul Kumar"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-1">
                    Student Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-5 h-5 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="email"
                      value={authEmail}
                      onChange={e => setAuthEmail(e.target.value)}
                      placeholder="rahul@college.edu"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-1">
                    Create Password
                  </label>
                  <div className="relative">
                    <Lock className="w-5 h-5 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="password"
                      value={authPassword}
                      onChange={e => setAuthPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 transition duration-200 text-sm flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Create Free Account</span>
                </button>
              </form>
            )}

            {/* FORGOT PASSWORD FORM */}
            {authMode === 'forgot' && (
              <div>
                {resetStep === 1 && (
                  <form onSubmit={handleSendOtp} className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-1">
                        Enter Registered Email
                      </label>
                      <div className="relative">
                        <Mail className="w-5 h-5 absolute left-3 top-3 text-slate-400" />
                        <input
                          type="email"
                          value={authEmail}
                          onChange={e => setAuthEmail(e.target.value)}
                          placeholder="alex@student.edu"
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
                          required
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm transition"
                    >
                      Send Verification Code
                    </button>
                  </form>
                )}

                {resetStep === 2 && (
                  <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-1">
                        Enter 6-Digit OTP Code
                      </label>
                      <div className="relative">
                        <Key className="w-5 h-5 absolute left-3 top-3 text-slate-400" />
                        <input
                          type="text"
                          value={otpInput}
                          onChange={e => setOtpInput(e.target.value)}
                          placeholder="849201"
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm font-mono tracking-widest"
                          required
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm transition"
                    >
                      Verify OTP
                    </button>
                  </form>
                )}

                {resetStep === 3 && (
                  <form onSubmit={handleResetPassword} className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-1">
                        Enter New Password
                      </label>
                      <div className="relative">
                        <Lock className="w-5 h-5 absolute left-3 top-3 text-slate-400" />
                        <input
                          type="password"
                          value={newPassword}
                          onChange={e => setNewPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
                          required
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-sm transition"
                    >
                      Confirm Password Reset
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Toggle Modes Footer */}
            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 text-center text-xs">
              {authMode === 'login' ? (
                <p className="text-slate-500">
                  Don't have an account?{' '}
                  <button onClick={() => { setAuthMode('signup'); setAuthError(''); setAuthSuccess(''); }} className="text-indigo-500 hover:underline font-semibold">
                    Sign up now
                  </button>
                </p>
              ) : (
                <p className="text-slate-500">
                  Already have an account?{' '}
                  <button onClick={() => { setAuthMode('login'); setAuthError(''); setAuthSuccess(''); }} className="text-indigo-500 hover:underline font-semibold">
                    Back to Login
                  </button>
                </p>
              )}
            </div>

          </div>
        </main>

        {/* Footer */}
        <footer className="py-4 text-center text-xs text-slate-500 border-t border-slate-200 dark:border-slate-800">
          © SpendWise AI — Student Expense Management System (2026)
        </footer>
      </div>
    );
  }

  // --- MAIN LOGGED-IN DASHBOARD APP ---
  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'} transition-colors duration-200 flex flex-col`}>
      
      {/* HEADER NAVBAR */}
      <header className="sticky top-0 z-40 px-4 sm:px-8 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex flex-wrap justify-between items-center gap-4">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-500/30">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                SpendWise AI
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 rounded-full">
                INR ₹
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Student Financial Dashboard</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-slate-800/60 p-1 rounded-xl border border-slate-200 dark:border-slate-700/50">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
              activeTab === 'dashboard'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <PieChartIcon className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('expenses')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
              activeTab === 'expenses'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Expenses</span>
          </button>

          <button
            onClick={() => setActiveTab('roommates')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
              activeTab === 'roommates'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Flat Split (4-6)</span>
          </button>

          <button
            onClick={() => setActiveTab('evaluator')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
              activeTab === 'evaluator'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Evaluator</span>
          </button>

          <button
            onClick={() => setActiveTab('aichat')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
              activeTab === 'aichat'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>SpendWise AI Chat</span>
          </button>
        </nav>

        {/* User Greeting & Controls */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-xs font-bold block text-slate-800 dark:text-slate-200">Hello Student 🎓</span>
            <span className="text-[11px] text-slate-500 font-mono">{currentUser.email}</span>
          </div>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Toggle Light/Dark Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>

          <button
            onClick={handleLogout}
            className="p-2 rounded-xl border border-red-500/20 bg-red-500/10 text-red-500 hover:bg-red-500/20 transition flex items-center gap-1 text-xs font-medium"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>

      </header>

      {/* MOBILE NAV BOTTOM STRIP */}
      <div className="md:hidden flex overflow-x-auto gap-1 p-2 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-xs">
        <button onClick={() => setActiveTab('dashboard')} className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${activeTab === 'dashboard' ? 'bg-indigo-600 text-white' : ''}`}>Dashboard</button>
        <button onClick={() => setActiveTab('expenses')} className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${activeTab === 'expenses' ? 'bg-indigo-600 text-white' : ''}`}>Expenses</button>
        <button onClick={() => setActiveTab('roommates')} className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${activeTab === 'roommates' ? 'bg-indigo-600 text-white' : ''}`}>Flat Split</button>
        <button onClick={() => setActiveTab('evaluator')} className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${activeTab === 'evaluator' ? 'bg-indigo-600 text-white' : ''}`}>AI Evaluator</button>
        <button onClick={() => setActiveTab('aichat')} className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${activeTab === 'aichat' ? 'bg-indigo-600 text-white' : ''}`}>AI Chatbot</button>
      </div>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">

        {/* 1. DASHBOARD VIEW */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
                <div className="flex justify-between items-center text-slate-500 mb-2">
                  <span className="text-xs font-medium">Total Spent (March)</span>
                  <Wallet className="w-4 h-4 text-indigo-500" />
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">
                  ₹{totalSpent.toLocaleString('en-IN')}
                </div>
                <div className="mt-2 text-xs text-slate-500 flex items-center gap-1">
                  <span>Target Budget: ₹{monthlyBudget.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
                <div className="flex justify-between items-center text-slate-500 mb-2">
                  <span className="text-xs font-medium">Remaining Budget</span>
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                </div>
                <div className={`text-2xl font-black ${monthlyBudget - totalSpent < 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                  ₹{(monthlyBudget - totalSpent).toLocaleString('en-IN')}
                </div>
                <div className="mt-2 w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${totalSpent > monthlyBudget ? 'bg-red-500' : 'bg-emerald-500'}`}
                    style={{ width: `${Math.min((totalSpent / monthlyBudget) * 100, 100)}%` }}
                  />
                </div>
              </div>

              <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
                <div className="flex justify-between items-center text-slate-500 mb-2">
                  <span className="text-xs font-medium">Daily Average</span>
                  <Calendar className="w-4 h-4 text-purple-500" />
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">
                  ₹{Math.round(totalSpent / 22).toLocaleString('en-IN')}
                  <span className="text-xs text-slate-500 font-normal"> / day</span>
                </div>
                <div className="mt-2 text-xs text-slate-500">Calculated over past 22 days</div>
              </div>

              <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
                <div className="flex justify-between items-center text-slate-500 mb-2">
                  <span className="text-xs font-medium">Flatmate Share</span>
                  <Users className="w-4 h-4 text-pink-500" />
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">
                  ₹{Math.round(perMemberShare).toLocaleString('en-IN')}
                </div>
                <div className="mt-2 text-xs text-slate-500">{flatmates.length} Members in Flat</div>
              </div>

            </div>

            {/* CHARTS SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Daily Category Pie Chart */}
              <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">Daily Category Breakdown</h3>
                  <span className="text-xs text-slate-400">Pie Record</span>
                </div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryBreakdownData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {categoryBreakdownData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Amount']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Monthly Spending Trend (Line Chart) */}
              <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm lg:col-span-2">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">Monthly Spending Trend</h3>
                    <p className="text-xs text-slate-500">Day-by-Day record line for current month</p>
                  </div>
                  <span className="px-2.5 py-1 bg-indigo-500/10 text-indigo-500 rounded-full text-xs font-semibold">March 2026</span>
                </div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dailyTrendData}>
                      <defs>
                        <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                      <YAxis stroke="#94a3b8" fontSize={12} />
                      <Tooltip formatter={(val) => [`₹${val.toLocaleString('en-IN')}`, 'Spent']} />
                      <Area type="monotone" dataKey="amount" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorAmt)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>

            {/* Yearly Performance Record (Line Chart) */}
            <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">Yearly Financial Record (2026)</h3>
                  <p className="text-xs text-slate-500">Comparing monthly total expenses against budget thresholds</p>
                </div>
                <span className="text-xs font-mono text-slate-400">Jan – Dec Overview</span>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={yearlyData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} />
                    <Tooltip formatter={(val) => [`₹${val.toLocaleString('en-IN')}`, 'Amount']} />
                    <Legend />
                    <Line type="monotone" dataKey="amount" stroke="#ec4899" strokeWidth={3} name="Actual Spent (₹)" />
                    <Line type="dash" dataKey="budget" stroke="#10b981" strokeWidth={2} name="Budget Cap (₹)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Quick Recent Transactions List */}
            <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">Recent Transactions</h3>
                <button
                  onClick={() => setActiveTab('expenses')}
                  className="text-xs text-indigo-500 hover:underline font-medium"
                >
                  View All Expenses
                </button>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {expenses.slice(0, 4).map(exp => (
                  <div key={exp.id} className="py-3 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white text-xs" style={{ backgroundColor: CATEGORY_COLORS[exp.category] || '#64748b' }}>
                        {exp.category[0]}
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 block">{exp.title}</span>
                        <span className="text-xs text-slate-400">{exp.date} • {exp.category}</span>
                      </div>
                    </div>
                    <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                      - ₹{exp.amount.toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* 2. EXPENSES MANAGEMENT TAB */}
        {activeTab === 'expenses' && (
          <div className="space-y-6">
            
            {/* Add Expense Form */}
            <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
              <h3 className="font-bold text-base text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-indigo-500" />
                <span>Log New Daily Expense</span>
              </h3>

              <form onSubmit={handleAddExpense} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="lg:col-span-2">
                  <label className="text-xs font-semibold text-slate-500 block mb-1">Title / Item</label>
                  <input
                    type="text"
                    value={newExpTitle}
                    onChange={e => setNewExpTitle(e.target.value)}
                    placeholder="e.g. Swiggy Dinner / Metro Pass"
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-500 block mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    value={newExpAmount}
                    onChange={e => setNewExpAmount(e.target.value)}
                    placeholder="450"
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-500 block mb-1">Category</label>
                  <select
                    value={newExpCat}
                    onChange={e => setNewExpCat(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Food">Food / Canteen</option>
                    <option value="Rent">Rent / PG</option>
                    <option value="Utilities">Utilities & WiFi</option>
                    <option value="Education">Education & Books</option>
                    <option value="Transport">Transport / Metro</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Others">Others</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm shadow-md shadow-indigo-500/20 transition flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Expense</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Filters & Expense Table */}
            <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-4">
              
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Search expenses..."
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <select
                    value={categoryFilter}
                    onChange={e => setCategoryFilter(e.target.value)}
                    className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium"
                  >
                    <option value="All">All Categories</option>
                    <option value="Food">Food</option>
                    <option value="Rent">Rent</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Education">Education</option>
                    <option value="Transport">Transport</option>
                    <option value="Entertainment">Entertainment</option>
                  </select>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 dark:bg-slate-800/50 text-slate-500 font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="p-3 rounded-l-xl">Title</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Date</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3 text-right rounded-r-xl">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredExpenses.map(exp => (
                      <tr key={exp.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition">
                        <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">
                          {exp.title}
                          {exp.note && <span className="block text-[10px] text-slate-400 font-normal">{exp.note}</span>}
                        </td>
                        <td className="p-3">
                          <span className="px-2.5 py-1 rounded-full font-medium" style={{ backgroundColor: `${CATEGORY_COLORS[exp.category]}20`, color: CATEGORY_COLORS[exp.category] }}>
                            {exp.category}
                          </span>
                        </td>
                        <td className="p-3 text-slate-500">{exp.date}</td>
                        <td className="p-3 font-bold text-slate-900 dark:text-slate-100">₹{exp.amount.toLocaleString('en-IN')}</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleDeleteExpense(exp.id)}
                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>

          </div>
        )}

        {/* 3. FLAT ROOMMATES EXPENSE SPLIT (4 to 6 members) */}
        {activeTab === 'roommates' && (
          <div className="space-y-6">
            
            <div className="p-5 bg-gradient-to-br from-indigo-900 to-purple-900 text-white rounded-2xl shadow-lg">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Home className="w-5 h-5 text-indigo-400" />
                    <span>Flat Roommates Bill Splitter (4–6 Members)</span>
                  </h2>
                  <p className="text-xs text-indigo-200 mt-1">
                    Equal share settlement for hostel rooms, flats, and shared PG accommodation in Indian college cities.
                  </p>
                </div>
                <div className="bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md text-right">
                  <span className="text-[10px] uppercase text-indigo-200 font-semibold block">Total Shared Flat Pool</span>
                  <span className="text-2xl font-black">₹{totalSharedPool.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Roommate Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {flatmates.map(m => {
                const diff = m.paidAmount - perMemberShare;
                return (
                  <div key={m.id} className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-center relative group">
                    {flatmates.length > 2 && (
                      <button
                        onClick={() => handleRemoveFlatmate(m.id)}
                        className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <div className="text-3xl mb-2">{m.avatar}</div>
                    <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200 truncate">{m.name}</h4>
                    <div className="text-[11px] text-slate-400 mt-1">Paid: ₹{m.paidAmount.toLocaleString('en-IN')}</div>
                    
                    <div className={`mt-2 text-xs font-extrabold ${diff >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                      {diff >= 0 ? `+₹${Math.round(diff)}` : `-₹${Math.abs(Math.round(diff))}`}
                    </div>
                  </div>
                );
              })}

              {flatmates.length < 6 && (
                <div className="p-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center">
                  <input
                    type="text"
                    value={newMemberName}
                    onChange={e => setNewMemberName(e.target.value)}
                    placeholder="Member Name"
                    className="w-full px-2 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-xs mb-2 text-center"
                  />
                  <button
                    onClick={handleAddFlatmate}
                    className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-500 transition"
                  >
                    + Add Member
                  </button>
                </div>
              )}
            </div>

            {/* Quick Presets & Shared Expense Entry */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-4">
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">Log Shared Flat Expense</h3>
                
                {/* Quick Presets */}
                <div>
                  <span className="text-xs text-slate-400 block mb-2">Quick Common Flat Presets:</span>
                  <div className="flex flex-wrap gap-2">
                    {PRESET_ROOM_EXPENSES.map((p, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleApplyQuickPreset(p)}
                        className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-500/10 hover:text-indigo-500 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-medium transition"
                      >
                        {p.title} (₹{p.defaultAmount})
                      </button>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleAddSharedExpense} className="space-y-3">
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">Expense Description</label>
                    <input
                      type="text"
                      value={splitExpenseTitle}
                      onChange={e => setSplitExpenseTitle(e.target.value)}
                      placeholder="e.g. WiFi Bill / Cook Salary"
                      className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-slate-500 block mb-1">Total Bill Amount (₹)</label>
                      <input
                        type="number"
                        value={splitExpenseAmount}
                        onChange={e => setSplitExpenseAmount(e.target.value)}
                        placeholder="3500"
                        className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs text-slate-500 block mb-1">Paid By</label>
                      <select
                        value={paidByMemberId}
                        onChange={e => setPaidByMemberId(e.target.value)}
                        className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        {flatmates.map(m => (
                          <option key={m.id} value={m.id}>{m.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs shadow-md transition"
                  >
                    Split Bill Equally (₹{flatmates.length ? Math.round(parseFloat(splitExpenseAmount || 0)/flatmates.length) : 0} / person)
                  </button>
                </form>
              </div>

              {/* Minimal Debt Settlement transfers */}
              <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">Smart Settlement Ledger ("Who owes Whom")</h3>
                  <span className="text-[10px] text-slate-400 font-mono">Equal Share: ₹{Math.round(perMemberShare)}</span>
                </div>

                {settlementTransfers.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-500 opacity-80" />
                    <span>All room members are completely settled up! No pending debts.</span>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {settlementTransfers.map((t, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-800 dark:text-slate-200">{t.from}</span>
                          <span className="text-slate-400">pays</span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">{t.to}</span>
                        </div>
                        <span className="font-extrabold text-indigo-500 text-sm">₹{t.amount.toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

        {/* 4. AI PURCHASE EVALUATOR TAB */}
        {activeTab === 'evaluator' && (
          <div className="max-w-3xl mx-auto space-y-6">
            
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 rounded-full text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI "Should I Buy This?" Purchase Evaluator</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Smart Decision Advisor</h2>
              <p className="text-xs text-slate-500">
                Type any item you are considering buying (headphones, sneakers, game subscription). Our AI calculates its impact on your student budget!
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
              <form onSubmit={handleEvaluatePurchase} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500 block mb-1">Item Name</label>
                  <input
                    type="text"
                    value={evalItem}
                    onChange={e => setEvalItem(e.target.value)}
                    placeholder="e.g. Sony Wireless Headphones / Mechanical Keyboard"
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 block mb-1">Price (₹)</label>
                    <input
                      type="number"
                      value={evalPrice}
                      onChange={e => setEvalPrice(e.target.value)}
                      placeholder="2999"
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-500 block mb-1">Category</label>
                    <select
                      value={evalCategory}
                      onChange={e => setEvalCategory(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Gadgets">Gadgets & Tech</option>
                      <option value="Fashion">Clothing & Fashion</option>
                      <option value="Gaming">Gaming & Subscriptions</option>
                      <option value="EatingOut">Restaurant & Swiggy</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={evalLoading}
                  className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-xl text-sm shadow-md transition flex items-center justify-center gap-2"
                >
                  {evalLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Analyzing Student Budget Impact...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Evaluate Purchase Decision</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Result Box */}
            {evalResult && (
              <div className="p-6 bg-slate-900 text-white border border-slate-800 rounded-2xl shadow-xl space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs text-slate-400 font-mono">Evaluation Result for</span>
                    <h3 className="text-xl font-bold text-indigo-400">{evalResult.item}</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-white">₹{evalResult.price.toLocaleString('en-IN')}</span>
                    <span className="block text-[10px] text-slate-400">{evalResult.budgetPercent}% of monthly budget</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-800/60 border border-slate-700/50 rounded-xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-slate-300">Financial Safety Verdict:</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      evalResult.verdict === 'SAFE BUY' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      evalResult.verdict === 'HIGH RISK' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                      'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {evalResult.verdict} ({evalResult.score}/100)
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{evalResult.advice}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/30">
                    <span className="text-slate-400 block mb-1">Mess Food Equivalent</span>
                    <span className="font-bold text-amber-400">≈ {evalResult.messMealsEquiv} Mess Meals</span>
                  </div>
                  <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/30">
                    <span className="text-slate-400 block mb-1">Budget Impact</span>
                    <span className="font-bold text-indigo-400">{evalResult.budgetPercent}% Allowance</span>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* 5. SPENDWISE AI CHATBOT TAB */}
        {activeTab === 'aichat' && (
          <div className="max-w-4xl mx-auto h-[600px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col overflow-hidden">
            
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center gap-3">
              <div className="p-2 bg-indigo-600 rounded-xl text-white">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">SpendWise AI Financial Assistant</h3>
                <span className="text-xs text-emerald-500 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Online • Student Budgeting Specialist
                </span>
              </div>
            </div>

            {/* Chat Message Scroll */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-indigo-600 text-white rounded-br-none'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-2xl text-xs text-slate-400 flex items-center gap-2">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-500" />
                    <span>SpendWise AI is thinking...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Prompt Suggestions */}
            <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/50 flex gap-2 overflow-x-auto text-[11px]">
              <button
                onClick={() => setChatInput('How can I save money on mess and food ordering?')}
                className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 whitespace-nowrap hover:border-indigo-500"
              >
                🍱 Save on Food & Mess
              </button>
              <button
                onClick={() => setChatInput('What is the best way to split room rent with 4 flatmates?')}
                className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 whitespace-nowrap hover:border-indigo-500"
              >
                🏠 Room Split Advice
              </button>
              <button
                onClick={() => setChatInput('How should a student start investing ₹500 monthly?')}
                className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 whitespace-nowrap hover:border-indigo-500"
              >
                📈 Student SIP Investing
              </button>
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 dark:border-slate-800 flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                placeholder="Ask SpendWise AI about saving, budgeting, or investments..."
                className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="py-4 text-center text-xs text-slate-500 border-t border-slate-200 dark:border-slate-800 mt-auto">
        © SpendWise AI — Student Expense Management System (2026)
      </footer>

    </div>
  );
}
