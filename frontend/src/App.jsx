import { useState, useEffect } from 'react';
import './App.css';
 
function App() {
  const [allBooks, setAllBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [activeCategory, setActiveCategory] = useState('전체 도서');
  // 1. localStorage를 활용한 상태 초기화 (새로고침 시 데이터 유지)
  const [members, setMembers] = useState(() => {
    const savedMembers = localStorage.getItem('members');
    return savedMembers ? JSON.parse(savedMembers) : [{ id: 'admin', pw: '1234', name: '최고관리자' }];
  });
  const [userId, setUserId] = useState(() => localStorage.getItem('loggedInUserId') || '');
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('loggedInUserId'));
  const [userPw, setUserPw] = useState('');
  const [currentView, setCurrentView] = useState('home');
  const [cartItems, setCartItems] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  // 회원가입 상태
  const [signupId, setSignupId] = useState('');
  const [signupPw, setSignupPw] = useState('');
  const [signupPwCheck, setSignupPwCheck] = useState('');
  const [signupName, setSignupName] = useState('');
  const [isIdChecked, setIsIdChecked] = useState(false); // 중복확인 통과 여부
 
  // 마이페이지 탭 상태
  const [mypageTab, setMypageTab] = useState('info');
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [newPwCheck, setNewPwCheck] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNum, setAccountNum] = useState('');
  const [savedAccount, setSavedAccount] = useState(null);
 
  // 데이터 로딩
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('db.json');
        if (!response.ok) throw new Error('데이터 로딩 실패');
        const data = await response.json();
        const books = Array.isArray(data) ? data : data.books || [];
        setAllBooks(books);
        setFilteredBooks(books);
      } catch (error) { console.error(error); }
    };
    fetchData();
  }, []);
 
  // 2. members 배열이 변경될 때마다 localStorage에 자동 저장
  useEffect(() => {
    localStorage.setItem('members', JSON.stringify(members));
  }, [members]);
 
  const handleCategoryClick = (categoryName) => {
    setCurrentView('home');
    setActiveCategory(categoryName);
    if (categoryName === '전체 도서') setFilteredBooks(allBooks);
    else setFilteredBooks(allBooks.filter(book => book.type === categoryName));
  };
 
  const handleNavigation = (viewName) => {
    if (!isLoggedIn) { alert('로그인 후 이용 가능합니다.'); return; }
    setCurrentView(viewName);
  };
 
  const goHome = () => {
    setCurrentView('home');
    setActiveCategory('전체 도서');
    setFilteredBooks(allBooks);
  };
 
  // 로그인 시 localStorage에 저장
  const handleLogin = () => {
    const found = members.find(m => m.id === userId && m.pw === userPw);
    if (found) {
      setIsLoggedIn(true);
      localStorage.setItem('loggedInUserId', userId); // 로그인 정보 저장
      setUserPw(''); // 비밀번호 입력창 초기화
    } else {
      alert('아이디 또는 비밀번호가 틀렸습니다.');
    }
  };
 
  // 로그아웃 시 localStorage에서 삭제
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserId('');
    setCurrentView('home');
    localStorage.removeItem('loggedInUserId'); // 로그인 정보 삭제
  };
 
  // 3. 아이디 중복 확인 기능
  const handleIdCheck = () => {
    if (!signupId.trim()) {
      alert('아이디를 입력해주세요.');
      return;
    }
    if (members.find(m => m.id === signupId)) {
      alert('이미 사용 중인 아이디입니다.');
      setIsIdChecked(false);
    } else {
      alert('사용 가능한 아이디입니다.');
      setIsIdChecked(true);
    }
  };
 
  // 아이디 입력값이 변경되면 중복확인 상태 초기화
  const handleSignupIdChange = (e) => {
    setSignupId(e.target.value);
    setIsIdChecked(false); 
  };
 
  const handleSignup = () => {
    if (!signupId || !signupPw || !signupName) { alert('모든 항목을 입력해주세요.'); return; }
    if (!isIdChecked) { alert('아이디 중복 확인을 진행해주세요.'); return; }
    if (signupPw !== signupPwCheck) { alert('비밀번호가 일치하지 않습니다.'); return; }
    setMembers(prev => [...prev, { id: signupId, pw: signupPw, name: signupName }]);
    alert(`'${signupName}'님 회원가입 완료!\n아이디: ${signupId}`);
    setSignupId(''); setSignupPw(''); setSignupPwCheck(''); setSignupName(''); setIsIdChecked(false);
    setCurrentView('home');
  };
 
  const handleChangePw = () => {
    const me = members.find(m => m.id === userId);
    if (me.pw !== currentPw) { alert('현재 비밀번호가 틀렸습니다.'); return; }
    if (!newPw) { alert('새 비밀번호를 입력해주세요.'); return; }
    if (newPw !== newPwCheck) { alert('새 비밀번호가 일치하지 않습니다.'); return; }
    setMembers(prev => prev.map(m => m.id === userId ? { ...m, pw: newPw } : m));
    alert('비밀번호가 변경되었습니다.');
    setCurrentPw(''); setNewPw(''); setNewPwCheck('');
  };
 
  const handleSaveAccount = () => {
    if (!bankName || !accountNum) { alert('은행명과 계좌번호를 입력해주세요.'); return; }
    setSavedAccount({ bankName, accountNum });
    alert('계좌가 등록되었습니다.');
    setBankName(''); setAccountNum('');
  };
 
  const handleWithdraw = () => {
    if (!window.confirm('정말 탈퇴하시겠습니까?\n탈퇴 시 모든 정보가 삭제됩니다.')) return;
    setMembers(prev => prev.filter(m => m.id !== userId));
    handleLogout();
    alert('회원 탈퇴가 완료되었습니다.');
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
 
  const inputStyle = { width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', marginBottom: '4px' };
  const tabStyle = (tab) => ({
    padding: '10px 20px', border: 'none', borderBottom: mypageTab === tab ? '2px solid #0d6efd' : '2px solid transparent',
    background: 'none', cursor: 'pointer', fontWeight: mypageTab === tab ? 'bold' : 'normal',
    color: mypageTab === tab ? '#0d6efd' : '#555', fontSize: '14px'
  });
 
  return (
    <div className="app-container">
      <header>
        <div className="logo" onClick={goHome} style={{ cursor: 'pointer' }}>📖 BookStore</div>
        <div className="global-search">
          <input type="text" placeholder="도서명, 저자, ISBN 검색" />
          <button>검색</button>
        </div>
        {/* 마이페이지, 장바구니, 찜 목록 span 태그에 cursor: 'pointer' 스타일 추가 완료 */}
        <div className="header-icons">
          <span onClick={() => handleNavigation('mypage')} style={{ cursor: 'pointer' }}>👤 마이페이지</span>
          <span onClick={() => handleNavigation('cart')} style={{ cursor: 'pointer' }}>🛒 장바구니 {cartItems.length > 0 && `(${cartItems.length})`}</span>
          <span onClick={() => handleNavigation('wishlist')} style={{ cursor: 'pointer' }}>🤍 찜 목록 {wishlist.length > 0 && `(${wishlist.length})`}</span>
        </div>
      </header>
 
      <div className="container">
        <aside className="left-sidebar box">
          <h3 style={{ marginBottom: '15px' }}>📑 카테고별 도서</h3>
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
 
          {/* 회원가입 */}
          {currentView === 'signup' && (
            <div className="box" style={{ maxWidth: '500px', margin: '40px auto', padding: '40px' }}>
              <h2 style={{ borderBottom: '2px solid #333', paddingBottom: '10px', marginBottom: '30px' }}>📝 회원가입</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>이름</label>
                  <input type="text" placeholder="이름을 입력하세요" value={signupName} onChange={(e) => setSignupName(e.target.value)} style={inputStyle} />
                </div>
                {/* 4. 중복확인 UI 추가 */}
                <div>
                  <label style={{ fontSize: '14px', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>아이디</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input type="text" placeholder="아이디를 입력하세요" value={signupId} onChange={handleSignupIdChange} style={{ ...inputStyle, marginBottom: 0 }} />
                    <button onClick={handleIdCheck} style={{ padding: '0 15px', whiteSpace: 'nowrap', backgroundColor: isIdChecked ? '#28a745' : '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                      {isIdChecked ? '확인완료' : '중복확인'}
                    </button>
                  </div>
                </div>
 
                <div>
                  <label style={{ fontSize: '14px', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>비밀번호</label>
                  <input type="password" placeholder="비밀번호를 입력하세요" value={signupPw} onChange={(e) => setSignupPw(e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>비밀번호 확인</label>
                  <input type="password" placeholder="비밀번호를 다시 입력하세요" value={signupPwCheck} onChange={(e) => setSignupPwCheck(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSignup()} style={inputStyle} />
                </div>
                <button onClick={handleSignup} style={{ padding: '14px', backgroundColor: '#0d6efd', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>
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
            <div className="box" style={{ minHeight: '500px', padding: '30px' }}>
              <h2 style={{ borderBottom: '2px solid #333', paddingBottom: '10px', marginBottom: '20px' }}>👤 마이페이지</h2>
 
              <div style={{ display: 'flex', borderBottom: '1px solid #eee', marginBottom: '30px' }}>
                <button style={tabStyle('info')} onClick={() => setMypageTab('info')}>내 정보</button>
                <button style={tabStyle('password')} onClick={() => setMypageTab('password')}>비밀번호 변경</button>
                <button style={tabStyle('account')} onClick={() => setMypageTab('account')}>결제 계좌</button>
                <button style={tabStyle('withdraw')} onClick={() => setMypageTab('withdraw')}>회원 탈퇴</button>
              </div>
 
              {mypageTab === 'info' && (
                <div style={{ fontSize: '16px' }}>
                  <p style={{ marginBottom: '15px' }}><strong>아이디:</strong> {userId}</p>
                  <p style={{ marginBottom: '15px' }}><strong>이름:</strong> {members.find(m => m.id === userId)?.name}</p>
                  <p style={{ marginBottom: '15px' }}><strong>회원등급:</strong> VIP</p>
                </div>
              )}
 
              {mypageTab === 'password' && (
                <div style={{ maxWidth: '400px' }}>
                  <p style={{ marginBottom: '20px', color: '#555' }}>비밀번호를 변경합니다.</p>
                  <label style={{ fontSize: '14px', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>현재 비밀번호</label>
                  <input type="password" placeholder="현재 비밀번호" value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} style={inputStyle} />
                  <label style={{ fontSize: '14px', fontWeight: 'bold', display: 'block', marginBottom: '6px', marginTop: '10px' }}>새 비밀번호</label>
                  <input type="password" placeholder="새 비밀번호" value={newPw} onChange={(e) => setNewPw(e.target.value)} style={inputStyle} />
                  <label style={{ fontSize: '14px', fontWeight: 'bold', display: 'block', marginBottom: '6px', marginTop: '10px' }}>새 비밀번호 확인</label>
                  <input type="password" placeholder="새 비밀번호 확인" value={newPwCheck} onChange={(e) => setNewPwCheck(e.target.value)} style={inputStyle} />
                  <button onClick={handleChangePw} style={{ marginTop: '15px', padding: '12px 30px', backgroundColor: '#0d6efd', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                    변경하기
                  </button>
                </div>
              )}
 
              {mypageTab === 'account' && (
                <div style={{ maxWidth: '400px' }}>
                  {savedAccount && (
                    <div style={{ padding: '15px', backgroundColor: '#f0f7ff', borderRadius: '8px', marginBottom: '20px', border: '1px solid #cce0ff' }}>
                      <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>✅ 등록된 계좌</p>
                      <p style={{ color: '#555' }}>{savedAccount.bankName} | {savedAccount.accountNum}</p>
                    </div>
                  )}
                  <p style={{ marginBottom: '20px', color: '#555' }}>{savedAccount ? '계좌를 변경합니다.' : '결제 계좌를 등록합니다.'}</p>
                  <label style={{ fontSize: '14px', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>은행명</label>
                  <input type="text" placeholder="예: 국민은행, 신한은행" value={bankName} onChange={(e) => setBankName(e.target.value)} style={inputStyle} />
                  <label style={{ fontSize: '14px', fontWeight: 'bold', display: 'block', marginBottom: '6px', marginTop: '10px' }}>계좌번호</label>
                  <input type="text" placeholder="계좌번호를 입력하세요" value={accountNum} onChange={(e) => setAccountNum(e.target.value)} style={inputStyle} />
                  <button onClick={handleSaveAccount} style={{ marginTop: '15px', padding: '12px 30px', backgroundColor: '#0d6efd', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                    {savedAccount ? '계좌 변경하기' : '계좌 등록하기'}
                  </button>
                </div>
              )}
 
              {mypageTab === 'withdraw' && (
                <div style={{ maxWidth: '400px' }}>
                  <div style={{ padding: '20px', backgroundColor: '#fff5f5', borderRadius: '8px', border: '1px solid #ffd0d0', marginBottom: '20px' }}>
                    <p style={{ fontWeight: 'bold', color: '#e53e3e', marginBottom: '10px' }}>⚠️ 탈퇴 전 확인해주세요</p>
                    <p style={{ fontSize: '14px', color: '#555', lineHeight: '1.6' }}>
                      회원 탈퇴 시 모든 개인정보 및 구매 내역이 삭제됩니다.<br />
                      삭제된 데이터는 복구할 수 없습니다.
                    </p>
                  </div>
                  <button onClick={handleWithdraw} style={{ padding: '12px 30px', backgroundColor: '#e53e3e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                    회원 탈퇴하기
                  </button>
                </div>
              )}
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
                <p style={{ fontSize: '16px', marginBottom: '20px' }}><strong>{members.find(m => m.id === userId)?.name || userId}</strong>님<br />환영합니다!</p>
                <button className="btn-login" onClick={handleLogout} style={{ backgroundColor: '#6c757d' }}>로그아웃</button>
              </div>
            ) : (
              <div className="login-form">
                <h3 style={{ marginBottom: '15px' }}>로그인</h3>
                <input type="text" placeholder="아이디" value={userId} onChange={(e) => setUserId(e.target.value)} />
                <input type="password" placeholder="비밀번호" value={userPw} onChange={(e) => setUserPw(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleLogin()} />
                <button className="btn-login" onClick={handleLogin}>로그인</button>
                <div style={{ textAlign: 'center', fontSize: '12px', marginTop: '10px', color: '#777' }}>
                  계정이 없으신가요?{' '}
                  <span style={{ color: '#0d6efd', cursor: 'pointer' }} onClick={() => setCurrentView('signup')}>회원가입</span>
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