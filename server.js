const express = require('express');
const session = require('express-session');
const path    = require('path');
const { randomUUID } = require('crypto');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── 테스트 계정 ──────────────────────────────
const USERS = {
  'admin':   { pw: 'admin1234', name: '관리자',     company: '안티그래피 주식회사' },
  'test01':  { pw: 'test1234',  name: '홍길동 소장', company: '한국건설(주)' },
  'test02':  { pw: 'safe1234',  name: '이현장 대리', company: '대한안전관리(주)' },
};

// ── 인메모리 데이터 저장소 ────────────────────
// { userId: [ { id, formType, title, savedAt, data } ] }
const formStore = {};

// ── 미들웨어 ─────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'safety-direct-secret-2026',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 8 }   // 8시간
}));
app.use(express.static(path.join(__dirname, 'public')));

// ── 인증 미들웨어 ─────────────────────────────
function requireAuth(req, res, next) {
  if (!req.session.userId) return res.status(401).json({ error: '로그인이 필요합니다.' });
  next();
}

// ── API: 인증 ─────────────────────────────────
app.post('/api/login', (req, res) => {
  const { id, pw } = req.body;
  const user = USERS[id];
  if (!user || user.pw !== pw) {
    return res.status(401).json({ error: '아이디 또는 비밀번호가 올바르지 않습니다.' });
  }
  req.session.userId = id;
  req.session.userName = user.name;
  req.session.userCompany = user.company;
  res.json({ ok: true, name: user.name, company: user.company });
});

app.post('/api/logout', (req, res) => {
  req.session.destroy();
  res.json({ ok: true });
});

app.get('/api/me', (req, res) => {
  if (!req.session.userId) return res.json({ loggedIn: false });
  res.json({
    loggedIn: true,
    id:       req.session.userId,
    name:     req.session.userName,
    company:  req.session.userCompany,
  });
});

// ── API: 양식 저장 ────────────────────────────
app.post('/api/forms/save', requireAuth, (req, res) => {
  const uid = req.session.userId;
  const { formType, title, data } = req.body;

  if (!formStore[uid]) formStore[uid] = [];

  // 같은 formType + title 이면 덮어쓰기
  const existing = formStore[uid].find(f => f.formType === formType && f.title === title);
  if (existing) {
    existing.data    = data;
    existing.savedAt = new Date().toISOString();
    return res.json({ ok: true, id: existing.id, updated: true });
  }

  const record = {
    id:       randomUUID(),
    formType,
    title:    title || `${formType} (${new Date().toLocaleDateString('ko-KR')})`,
    savedAt:  new Date().toISOString(),
    data,
  };
  formStore[uid].unshift(record);
  res.json({ ok: true, id: record.id, updated: false });
});

// ── API: 양식 목록 조회 ───────────────────────
app.get('/api/forms', requireAuth, (req, res) => {
  const uid = req.session.userId;
  res.json(formStore[uid] || []);
});

// ── API: 양식 단건 조회 ───────────────────────
app.get('/api/forms/:id', requireAuth, (req, res) => {
  const uid = req.session.userId;
  const rec = (formStore[uid] || []).find(f => f.id === req.params.id);
  if (!rec) return res.status(404).json({ error: '저장된 양식을 찾을 수 없습니다.' });
  res.json(rec);
});

// ── API: 양식 삭제 ────────────────────────────
app.delete('/api/forms/:id', requireAuth, (req, res) => {
  const uid = req.session.userId;
  if (!formStore[uid]) return res.status(404).json({ error: '없음' });
  const before = formStore[uid].length;
  formStore[uid] = formStore[uid].filter(f => f.id !== req.params.id);
  if (formStore[uid].length === before) return res.status(404).json({ error: '없음' });
  res.json({ ok: true });
});

// ── 기본 라우트 ───────────────────────────────
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
  console.log('──────────────────────────────');
  console.log('테스트 계정:');
  console.log('  ID: admin    PW: admin1234');
  console.log('  ID: test01   PW: test1234');
  console.log('  ID: test02   PW: safe1234');
  console.log('──────────────────────────────');
});
