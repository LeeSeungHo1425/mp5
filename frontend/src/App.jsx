import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [allBooks, setAllBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [activeCategory, setActiveCategory] = useState('전체 도서');
  const [userId, setUserId] = useState('');
  const [userPw, setUserPw] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState('home');
  const [cartItems, setCartItems] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [signupId, setSignupId] = useState('');
  const [signupPw, setSignupPw] = useState('');
  const [signupPwCheck, setSignupPwCheck] = useState('');
  const [signupName, setSignupName] = useState('');
  const [members, setMembers] = useState([{ id: 'admin', pw: '1234', name: '최고관리자' }]);

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
      }
    };
    fetchData();
  }, []);

  const handleCategoryClick = (categoryName) => {
    setCurrentView('home');
    setActiveCategory(categoryName);
    if (categoryName === '전체 도서') {
      setFilteredBooks(allBooks);
    } else {
      setFilteredBooks(allBooks.filter(book => book.type === categoryName));
    }
  };

  const handleNavigation = (viewName) => {
    if (!isLoggedIn) {
      alert('로그인 후 이용 가능합니다.');
      return;
    }
    setCurrentView(viewName);
  };

  const goHome = () => {
    setCurrentView('home');
    setActiveCategory('전체 도서');
    setFilteredBooks(allBooks);
  };

  const handleLogin = () => {
    const found = members.find(m => m.id === userId && m.pw === userPw);
    if (found) {
      setIsLoggedIn(true);
    } else {
      alert('아이디 또는 비밀번호가 틀렸습니다.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserId('');
    setUserPw('');
    setCurrentView('home');
  };

  const handleSignup = () => {
    if (!signupId || !signupPw || !signupName) {
      alert('모든 항목을 입력해주세요.');
      return;
    }
    if (signupPw !== signupPwCheck) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (members.find(m => m.id === signupId)) {
      alert('이미 사용 중인 아이디입니다.');
      return;
    }
    setMembers(prev => [...prev, { id: signupId, pw: signupPw, name: signupName }]);
    alert(`'${signupName}'님 회원가입 완료!\n아이디: ${signupId}`);
    setSignupId(''); setSignupPw(''); setSignupPwCheck(''); setSignupName('');
    setCurrentView('home');
  };

  const handleAddToCart = (book) => {
    if (!isLoggedIn) { alert('로그인 후 이용 가능합니다.'); return; }
    setCartItems(prev => {
      const existing = prev.find(item => item.id === book.id);
      if (existing) return prev.map(item => item.id === book.id ? { ...item, qty: item.qty + 1 } : item);
      return [...prev, { ...book, qty: 1 }];
    });
    alert(`'${book.title}'이(가) 장바구니에 담겼습니다!`);
  };

  const handleToggleWishlist = (book) => {
    if (!isLoggedIn) { alert('로그인 후 이용 가능합니다.'); return; }
    setWishlist(prev => {
      const exists = prev.find(item => item.id === book.id);
      if (exists) return prev.filter(item => item.id !== book.id);
      return [...prev, book];
    });
  };

  const BookCard = ({ book }) => {
    const isWished = wishlist.some(item => item.id === book.id);
    return (
      <div className="book-card" style={{ position: 'relative' }}>
        <button onClick={() => handleToggleWishlist(book)} style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', lineHeight: 1 }}>
          {isWished ? '❤️' : '🤍'}
        </button>
        <img src={book.cover || book.coverers || ''} alt={book.title} onError={(e) => { e.target.src = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='; e.target.style.backgroundColor = '#ccc'; }} />
        <div className="title" style={{ fontWeight: 'bold', margin: '5px 0' }}>{book.title}</div>
        <div style={{ fontSize: '12px', color: '#777' }}>{book.author}</div>
        <div style={{ color: '#e53e3e', fontWeight: 'bold', margin: '5px 0' }}>{book.price ? book.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '0'}원</div>
        <button className="btn-cart" onClick={() => handleAddToCart(book)}>🛒 장바구니 담기</button>
      </div>
    );
  };

  return (
    <div className="app-container">
      <header>
        <div className="logo" onClick={goHome} style={{ cursor: 'pointer' }}>📖 BookStore</div>
        <div className="global-search">
          <input type="text" placeholder="도서명, 저자, ISBN 검색" />
          <button>검색</button>
        </div>
        <div className="header-icons">
          <span onClick={() => handleNavigation('mypage')}>👤 마이페이지</span>
          <span onClick={() => handleNavigation('cart')}>🛒 장바구니 {cartItems.length > 0 && `(${cartItems.length})`}</span>
          <span onClick={() => handleNavigation('wishlist')}>🤍 찜 목록 {wishlist.length > 0 && `(${wishlist.length})`}</span>
        </div>
      </header>

      <div className="container">
        <aside className="left-sidebar box">
          <h3 style={{ marginBottom: '15px' }}>📑 카테고리별 도서</h3>
          <ul className="menu-list">
            {['전체 도서', '인문학', '자기계발', '경제/경영', '소설/시/희곡', 'IT/컴퓨터'].map((category) => (
              <li key={category} onClick={() => handleCategoryClick(category)}
                className={activeCategory === category && currentView === 'home' ? 'active' : ''}
                style={{ color: activeCategory === category && currentView === 'home' ? '#0d6efd' : '#555', fontWeight: activeCategory === category && currentView === 'home' ? 'bold' : 'normal' }}>
                {category}
              </li>
            ))}
          </ul>
        </aside>

        <main>
          {/* 홈 */}
          {currentView === 'home' && (
            <>
              <div className="hero-banner">
                <h2>당신의 마음을 채우는<br />좋은 책을 만나보세요</h2>
                <p>다양한 분야의 도서를 지금 바로 검색해보세요!</p>
              </div>
              <div className="box">
                <h3 style={{ marginBottom: '15px' }}>추천 도서</h3>
                <div className="book-grid">
                  {filteredBooks.length === 0 ? (
                    <p style={{ gridColumn: 'span 4', textAlign: 'center', padding: '20px', color: '#888' }}>해당 카테고리에 도서가 없습니다.</p>
                  ) : (
                    filteredBooks.slice(0, 4).map((book) => <BookCard key={book.id || book.title} book={book} />)
                  )}
                </div>
              </div>
            </>
          )}

          {/* ⭐ 회원가입 화면 - 중앙에 크게 */}
          {currentView === 'signup' && (
            <div className="box" style={{ maxWidth: '500px', margin: '40px auto', padding: '40px' }}>
              <h2 style={{ borderBottom: '2px solid #333', paddingBottom: '10px', marginBottom: '30px' }}>📝 회원가입</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>이름</label>
                  <input type="text" placeholder="이름을 입력하세요" value={signupName} onChange={(e) => setSignupName(e.target.value)}
                    style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }} />
                </div>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>아이디</label>
                  <input type="text" placeholder="아이디를 입력하세요" value={signupId} onChange={(e) => setSignupId(e.target.value)}
                    style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }} />
                </div>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>비밀번호</label>
                  <input type="password" placeholder="비밀번호를 입력하세요" value={signupPw} onChange={(e) => setSignupPw(e.target.value)}
                    style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }} />
                </div>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>비밀번호 확인</label>
                  <input type="password" placeholder="비밀번호를 다시 입력하세요" value={signupPwCheck} onChange={(e) => setSignupPwCheck(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSignup()}
                    style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }} />
                </div>
                <button onClick={handleSignup} style={{ padding: '14px', backgroundColor: '#0d6efd', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', marginTop: '10px' }}>
                  가입하기
                </button>
                <div style={{ textAlign: 'center', fontSize: '13px', color: '#777', cursor: 'pointer' }} onClick={() => setCurrentView('home')}>
                  이미 계정이 있으신가요? <span style={{ color: '#0d6efd' }}>로그인하러 가기</span>
                </div>
              </div>
            </div>
          )}

          {/* 마이페이지 */}
          {currentView === 'mypage' && (
            <div className="box" style={{ minHeight: '500px', padding: '40px' }}>
              <h2 style={{ borderBottom: '2px solid #333', paddingBottom: '10px' }}>👤 마이페이지</h2>
              <div style={{ marginTop: '30px', fontSize: '16px' }}>
                <p style={{ marginBottom: '10px' }}><strong>아이디:</strong> {userId}</p>
                <p style={{ marginBottom: '10px' }}><strong>이름:</strong> {members.find(m => m.id === userId)?.name}</p>
                <p style={{ marginBottom: '10px' }}><strong>회원등급:</strong> VIP</p>
                <p style={{ color: '#777', marginTop: '20px' }}>(회원정보 수정 기능은 준비 중입니다.)</p>
              </div>
            </div>
          )}

          {/* 장바구니 */}
          {currentView === 'cart' && (
            <div className="box" style={{ minHeight: '500px', padding: '40px' }}>
              <h2 style={{ borderBottom: '2px solid #333', paddingBottom: '10px' }}>🛒 장바구니</h2>
              {cartItems.length === 0 ? (
                <div style={{ marginTop: '50px', textAlign: 'center', color: '#777' }}>
                  <div style={{ fontSize: '50px', marginBottom: '20px' }}>🛍️</div>
                  <p>장바구니에 담긴 도서가 없습니다.</p>
                  <button onClick={goHome} style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#0d6efd', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>쇼핑 계속하기</button>
                </div>
              ) : (
                <>
                  <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #ddd', backgroundColor: '#f8f9fa' }}>
                        <th style={{ padding: '12px', textAlign: 'left' }}>도서</th>
                        <th style={{ padding: '12px', textAlign: 'center' }}>수량</th>
                        <th style={{ padding: '12px', textAlign: 'right' }}>금액</th>
                        <th style={{ padding: '12px', textAlign: 'center' }}>삭제</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartItems.map(item => (
                        <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                          <td style={{ padding: '15px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                              <img src={item.cover || ''} alt={item.title} style={{ width: '55px', height: '75px', objectFit: 'cover', borderRadius: '4px', backgroundColor: '#eee' }} onError={(e) => { e.target.style.backgroundColor = '#ccc'; e.target.src = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='; }} />
                              <div>
                                <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{item.title}</div>
                                <div style={{ fontSize: '13px', color: '#777' }}>{item.author}</div>
                                <div style={{ fontSize: '13px', color: '#e53e3e', marginTop: '4px' }}>{item.price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원</div>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: '15px', textAlign: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                              <button onClick={() => setCartItems(prev => prev.map(i => i.id === item.id && i.qty > 1 ? { ...i, qty: i.qty - 1 } : i))} style={{ width: '28px', height: '28px', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', backgroundColor: '#fff' }}>−</button>
                              <span style={{ minWidth: '24px', textAlign: 'center' }}>{item.qty}</span>
                              <button onClick={() => setCartItems(prev => prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i))} style={{ width: '28px', height: '28px', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', backgroundColor: '#fff' }}>＋</button>
                            </div>
                          </td>
                          <td style={{ padding: '15px', textAlign: 'right', fontWeight: 'bold', color: '#e53e3e' }}>{(item.price * item.qty).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원</td>
                          <td style={{ padding: '15px', textAlign: 'center' }}>
                            <button onClick={() => setCartItems(prev => prev.filter(i => i.id !== item.id))} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#aaa' }}>✕</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div style={{ marginTop: '30px', textAlign: 'right', borderTop: '2px solid #333', paddingTop: '20px' }}>
                    <p style={{ fontSize: '14px', color: '#777', marginBottom: '6px' }}>총 {cartItems.reduce((sum, i) => sum + i.qty, 0)}권</p>
                    <p style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>합계: <span style={{ color: '#e53e3e' }}>{cartItems.reduce((sum, i) => sum + i.price * i.qty, 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원</span></p>
                    <button onClick={goHome} style={{ marginRight: '10px', padding: '12px 24px', backgroundColor: '#fff', border: '1px solid #0d6efd', color: '#0d6efd', borderRadius: '4px', cursor: 'pointer' }}>쇼핑 계속하기</button>
                    <button style={{ padding: '12px 24px', backgroundColor: '#0d6efd', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>주문하기</button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* 찜 목록 */}
          {currentView === 'wishlist' && (
            <div className="box" style={{ minHeight: '500px', padding: '40px' }}>
              <h2 style={{ borderBottom: '2px solid #333', paddingBottom: '10px' }}>🤍 찜 목록</h2>
              {wishlist.length === 0 ? (
                <div style={{ marginTop: '50px', textAlign: 'center', color: '#777' }}>
                  <div style={{ fontSize: '50px', marginBottom: '20px' }}>💔</div>
                  <p>아직 찜한 도서가 없습니다.</p>
                  <button onClick={goHome} style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#0d6efd', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>도서 보러가기</button>
                </div>
              ) : (
                <div className="book-grid" style={{ marginTop: '20px' }}>
                  {wishlist.map(book => <BookCard key={book.id} book={book} />)}
                </div>
              )}
            </div>
          )}
        </main>

        <aside className="right-sidebar">
          <div className="box">
            {isLoggedIn ? (
              <div style={{ textAlign: 'center', padding: '10px 0' }}>
                <h3 style={{ marginBottom: '15px' }}>내 정보</h3>
                <div style={{ fontSize: '50px', marginBottom: '10px' }}>🧑‍💻</div>
                <p style={{ fontSize: '16px', marginBottom: '20px' }}><strong>{members.find(m => m.id === userId)?.name}</strong>님<br />환영합니다!</p>
                <button className="btn-login" onClick={handleLogout} style={{ backgroundColor: '#6c757d' }}>로그아웃</button>
              </div>
            ) : (
              <div className="login-form">
                <h3 style={{ marginBottom: '15px' }}>로그인</h3>
                <input type="text" placeholder="아이디" value={userId} onChange={(e) => setUserId(e.target.value)} />
                <input type="password" placeholder="비밀번호" value={userPw} onChange={(e) => setUserPw(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleLogin()} />
                <button className="btn-login" onClick={handleLogin}>로그인</button>
                {/* ⭐ 회원가입 링크 - 클릭하면 중앙 화면이 회원가입으로 바뀜 */}
                <div style={{ textAlign: 'center', fontSize: '12px', marginTop: '10px', color: '#777' }}>
                  계정이 없으신가요?{' '}
                  <span style={{ color: '#0d6efd', cursor: 'pointer' }} onClick={() => setCurrentView('signup')}>
                    회원가입
                  </span>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

export default App;
