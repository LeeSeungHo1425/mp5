import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import './App.css';

import Header from './components/Header';
import CategorySidebar from './components/CategorySidebar';
import LoginPanel from './components/LoginPanel';
import HomePage from './pages/HomePage';
import BookInfoPage from './pages/BookInfoPage';
import EditBookPage from './pages/EditBookPage';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';
import MyPage from './pages/MyPage';
import SignupPage from './pages/SignupPage';
import PaymentPage from './pages/PaymentPage';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFail from './pages/PaymentFail';

const CATEGORIES = ['전체 도서', '인문학', '자기계발', '경제/경영', '소설/시/희곡', 'IT/컴퓨터'];

function AppShell() {
  const navigate = useNavigate();
  const location = useLocation();

  // ── 도서 데이터 ──────────────────────────────────────
  const [allBooks, setAllBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [activeCategory, setActiveCategory] = useState('전체 도서');
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  // ── 인증 ─────────────────────────────────────────────
  const [members, setMembers] = useState(() => {
    const saved = localStorage.getItem('members');
    return saved ? JSON.parse(saved) : [{ id: 'admin', pw: '1234', name: '최고관리자' }];
  });
  const [userId, setUserId] = useState(() => localStorage.getItem('loggedInUserId') || '');
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('loggedInUserId'));
  const [userPw, setUserPw] = useState('');

  // ── 장바구니 / 찜 ────────────────────────────────────
  const [cartItems, setCartItems] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  // ── 데이터 로딩 ──────────────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('db.json');
        if (!response.ok) throw new Error('데이터 로딩 실패');
        const data = await response.json();
        const books = Array.isArray(data) ? data : data.books || [];
        setAllBooks(books);
        setFilteredBooks(books);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // location state로 새로고침 처리 (책 추가/삭제 후)
  useEffect(() => {
    if (location.state?.refreshBooks) {
      const fetchData = async () => {
        try {
          const response = await fetch('db.json');
          if (!response.ok) return;
          const data = await response.json();
          const books = Array.isArray(data) ? data : data.books || [];
          setAllBooks(books);
          setFilteredBooks(books);
        } catch (error) {
          console.error(error);
        }
      };
      fetchData();
    }
  }, [location.state]);

  // members 변경 시 localStorage 동기화
  useEffect(() => {
    localStorage.setItem('members', JSON.stringify(members));
  }, [members]);

  // ── 카테고리 ─────────────────────────────────────────
  const handleCategoryClick = (categoryName) => {
    navigate('/');
    setActiveCategory(categoryName);
    setSearchTerm('');
    setStatusMessage('');
    if (categoryName === '전체 도서') setFilteredBooks(allBooks);
    else setFilteredBooks(allBooks.filter(book => book.type === categoryName));
  };

  const goHome = () => {
    navigate('/');
    setActiveCategory('전체 도서');
    setFilteredBooks(allBooks);
    setSearchTerm('');
    setStatusMessage('');
  };

  // ── 검색 ─────────────────────────────────────────────
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setFilteredBooks(allBooks);
      setStatusMessage('');
      return;
    }
    const term = searchTerm.toLowerCase();
    const results = allBooks.filter(
      b =>
        b.title?.toLowerCase().includes(term) ||
        b.author?.toLowerCase().includes(term) ||
        b.isbn?.toLowerCase().includes(term)
    );
    setFilteredBooks(results);
    setStatusMessage(`"${searchTerm}" 검색 결과: ${results.length}건`);
    navigate('/');
  };

  // ── 인증 ─────────────────────────────────────────────
  const handleLogin = () => {
    const found = members.find(m => m.id === userId && m.pw === userPw);
    if (found) {
      setIsLoggedIn(true);
      localStorage.setItem('loggedInUserId', userId);
      setUserPw('');
    } else {
      alert('아이디 또는 비밀번호가 틀렸습니다.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserId('');
    setUserPw('');
    localStorage.removeItem('loggedInUserId');
    navigate('/');
  };

  // ── 장바구니 ─────────────────────────────────────────
  const handleAddToCart = (book) => {
    if (!isLoggedIn) { alert('로그인 후 이용 가능합니다.'); return; }
    setCartItems(prev => {
      const existing = prev.find(item => item.cartKey === book.id);
      if (existing) {
        return prev.map(item =>
          item.cartKey === book.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...book, cartKey: book.id, quantity: 1 }];
    });
    alert(`'${book.title}'이(가) 장바구니에 담겼습니다!`);
  };

  const handleRemoveCartItem = (cartKey) => {
    setCartItems(prev => prev.filter(item => item.cartKey !== cartKey));
  };

  const handleUpdateQuantity = (cartKey, newQty) => {
    if (newQty < 1) return;
    setCartItems(prev =>
      prev.map(item => item.cartKey === cartKey ? { ...item, quantity: newQty } : item)
    );
  };

  // ── 찜 ───────────────────────────────────────────────
  const handleToggleWishlist = (book) => {
    if (!isLoggedIn) { alert('로그인 후 이용 가능합니다.'); return; }
    setWishlist(prev => {
      const exists = prev.find(item => item.id === book.id);
      return exists ? prev.filter(item => item.id !== book.id) : [...prev, book];
    });
  };

  // ── 네비게이션 (로그인 필요) ─────────────────────────
  const handleNavigate = (viewName) => {
    if (!isLoggedIn) { alert('로그인 후 이용 가능합니다.'); return; }
    navigate(`/${viewName}`);
  };

  // ── 책 추가 후 콜백 ──────────────────────────────────
  const handleBookCreated = async () => {
    try {
      const response = await fetch('db.json');
      if (!response.ok) return;
      const data = await response.json();
      const books = Array.isArray(data) ? data : data.books || [];
      setAllBooks(books);
      setFilteredBooks(books);
    } catch (error) {
      console.error(error);
    }
    navigate('/');
  };

  const isHomeView = location.pathname === '/';
  const isPaymentRoute =
    location.pathname.startsWith('/payment');

  if (isPaymentRoute) {
    return (
      <Routes>
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/payment/fail" element={<PaymentFail />} />
      </Routes>
    );
  }

  return (
    <div className="app-container">
      <Header
        searchTerm={searchTerm}
        cartCount={cartItems.length}
        wishlistCount={wishlist.length}
        onLogoClick={goHome}
        onNavigate={handleNavigate}
        onSearch={handleSearch}
        onSearchTermChange={setSearchTerm}
      />

      <div className="container">
        <CategorySidebar
          categories={CATEGORIES}
          activeCategory={activeCategory}
          isHomeView={isHomeView}
          onCategoryClick={handleCategoryClick}
        />

        <main>
          <Routes>
            <Route
              path="/"
              element={
                <HomePage
                  books={filteredBooks}
                  isLoading={isLoading}
                  statusMessage={statusMessage}
                  title={activeCategory}
                  onBookSelect={(book) => navigate('/book', { state: { book } })}
                  onAddToCart={handleAddToCart}
                  onToggleWishlist={handleToggleWishlist}
                  wishlist={wishlist}
                />
              }
            />
            <Route
              path="/book"
              element={<BookInfoPage isLoggedIn={isLoggedIn} onAddToCart={handleAddToCart} onToggleWishlist={handleToggleWishlist} wishlist={wishlist} />}
            />
            <Route
              path="/ai-cover"
              element={<EditBookPage onBookCreated={handleBookCreated} onCancel={() => navigate('/')} />}
            />
            <Route
              path="/cart"
              element={
                <CartPage
                  items={cartItems}
                  onContinueShopping={goHome}
                  onRemoveItem={handleRemoveCartItem}
                  onUpdateQuantity={handleUpdateQuantity}
                />
              }
            />
            <Route
              path="/wishlist"
              element={
                <WishlistPage
                  wishlist={wishlist}
                  onToggleWishlist={handleToggleWishlist}
                  onAddToCart={handleAddToCart}
                  onGoHome={goHome}
                />
              }
            />
            <Route
              path="/mypage"
              element={
                <MyPage
                  userId={userId}
                  members={members}
                  setMembers={setMembers}
                  onLogout={handleLogout}
                />
              }
            />
            <Route
              path="/signup"
              element={
                <SignupPage
                  members={members}
                  setMembers={setMembers}
                  onComplete={() => navigate('/')}
                />
              }
            />
          </Routes>
        </main>

        <aside className="right-sidebar">
          <LoginPanel
            isLoggedIn={isLoggedIn}
            userId={userId}
            userPw={userPw}
            members={members}
            onUserIdChange={setUserId}
            onUserPwChange={setUserPw}
            onLogin={handleLogin}
            onLogout={handleLogout}
            onSignup={() => navigate('/signup')}
          />
        </aside>
      </div>
    </div>
  );
}

function App() {
  return <AppShell />;
}

export default App;
