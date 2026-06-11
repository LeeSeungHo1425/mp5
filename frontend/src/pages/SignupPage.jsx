import { useState } from 'react';

function SignupPage({ members, setMembers, onComplete }) {
  const [signupId, setSignupId] = useState('');
  const [signupPw, setSignupPw] = useState('');
  const [signupPwCheck, setSignupPwCheck] = useState('');
  const [signupName, setSignupName] = useState('');
  const [isIdChecked, setIsIdChecked] = useState(false);

  const inputStyle = {
    width: '100%', padding: '12px', border: '1px solid #ddd',
    borderRadius: '4px', fontSize: '14px', marginBottom: '4px', boxSizing: 'border-box',
  };

  const handleIdCheck = () => {
    if (!signupId.trim()) { alert('아이디를 입력해주세요.'); return; }
    if (members.find(m => m.id === signupId)) {
      alert('이미 사용 중인 아이디입니다.');
      setIsIdChecked(false);
    } else {
      alert('사용 가능한 아이디입니다.');
      setIsIdChecked(true);
    }
  };

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
    onComplete();
  };

  return (
    <div className="box" style={{ maxWidth: '500px', margin: '40px auto', padding: '40px' }}>
      <h2 style={{ borderBottom: '2px solid #333', paddingBottom: '10px', marginBottom: '30px' }}>
        📝 회원가입
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label style={{ fontSize: '14px', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>이름</label>
          <input
            type="text"
            placeholder="이름을 입력하세요"
            value={signupName}
            onChange={(e) => setSignupName(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div>
          <label style={{ fontSize: '14px', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>아이디</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              placeholder="아이디를 입력하세요"
              value={signupId}
              onChange={handleSignupIdChange}
              style={{ ...inputStyle, marginBottom: 0, flex: 1 }}
            />
            <button
              type="button"
              onClick={handleIdCheck}
              style={{
                padding: '0 15px', whiteSpace: 'nowrap',
                backgroundColor: isIdChecked ? '#28a745' : '#6c757d',
                color: 'white', border: 'none', borderRadius: '4px',
                cursor: 'pointer', fontWeight: 'bold',
              }}
            >
              {isIdChecked ? '확인완료' : '중복확인'}
            </button>
          </div>
        </div>

        <div>
          <label style={{ fontSize: '14px', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>비밀번호</label>
          <input
            type="password"
            placeholder="비밀번호를 입력하세요"
            value={signupPw}
            onChange={(e) => setSignupPw(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div>
          <label style={{ fontSize: '14px', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>비밀번호 확인</label>
          <input
            type="password"
            placeholder="비밀번호를 다시 입력하세요"
            value={signupPwCheck}
            onChange={(e) => setSignupPwCheck(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSignup()}
            style={inputStyle}
          />
        </div>

        <button
          type="button"
          onClick={handleSignup}
          style={{ padding: '14px', backgroundColor: '#0d6efd', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}
        >
          가입하기
        </button>

        <div
          style={{ textAlign: 'center', fontSize: '13px', color: '#777', cursor: 'pointer' }}
          onClick={onComplete}
        >
          이미 계정이 있으신가요? <span style={{ color: '#0d6efd' }}>로그인하러 가기</span>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
