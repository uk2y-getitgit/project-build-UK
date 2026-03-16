# /new-form — 새 안전관리계획서 양식 페이지 생성

공사개요서와 동일한 A4 스타일로 새 양식 HTML 페이지를 생성한다.

## 사용법
```
/new-form [양식명] [서식번호(선택)]
```
예: `/new-form 현장특성분석 별지 제5호`

---

## 사전 확인 (실행 전 반드시)

1. `public/forms/공사개요서.html` 을 **Read**로 열어 현재 디자인 기준을 확인한다
2. hwpx 파일이 있으면 `hwpx-form-builder` 스킬 STEP1~2 절차로 FIELD_MAP을 추출한다
3. `public/forms.html` 에서 해당 양식 항목의 상태(badge-soon)를 확인해둔다

---

## 생성 파일

- **경로**: `public/forms/{양식명}.html`
- **파일명**: 한글 그대로 사용 (예: `현장특성분석.html`)

---

## A4 디자인 템플릿 (반드시 이 구조를 따를 것)

공사개요서에서 확립된 표준 템플릿이다. CSS 변수·클래스명·구조를 그대로 유지한다.

```html
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{양식명} 작성 | Safety-Direct</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Noto Sans KR', sans-serif; background: #CDD3DA; min-height: 100vh; color: #1A2E44; }

/* 네비바 */
.sd-nav { background:#0D1B2A; padding:0 24px; height:52px; display:flex; align-items:center; justify-content:space-between; position:sticky; top:0; z-index:200; box-shadow:0 3px 12px rgba(0,0,0,0.4); }
.sd-nav-logo { color:#fff; font-size:15px; font-weight:800; text-decoration:none; letter-spacing:1px; }
.sd-nav-logo span { color:#E8500A; }
.sd-nav-center { color:#8899AA; font-size:12px; font-weight:500; }
.sd-nav-back { color:#8899AA; font-size:12px; text-decoration:none; display:flex; align-items:center; gap:6px; padding:6px 12px; border-radius:6px; border:1px solid #2a3f52; transition:all 0.15s; }
.sd-nav-back:hover { color:#fff; border-color:#5a7a99; background:#1a2e44; }

/* A4 용지 */
.page-wrap { padding:32px 20px 60px; display:flex; flex-direction:column; align-items:center; }
.a4-paper { width:100%; max-width:794px; background:#fff; box-shadow:0 1px 1px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.18), 0 16px 40px rgba(0,0,0,0.12); border-radius:2px; }

/* 문서 헤더 */
.doc-header { background:linear-gradient(135deg,#1A3A5C 0%,#2D5A8E 100%); padding:20px 32px 16px; display:flex; align-items:flex-start; justify-content:space-between; }
.doc-header-left { display:flex; flex-direction:column; gap:4px; }
.doc-badge { display:inline-block; background:rgba(200,168,75,0.25); color:#C8A84B; font-size:10px; font-weight:700; padding:2px 10px; border-radius:12px; border:1px solid rgba(200,168,75,0.4); letter-spacing:0.5px; width:fit-content; }
.doc-subtitle { color:rgba(255,255,255,0.55); font-size:11px; margin-top:2px; }
.doc-org { color:rgba(255,255,255,0.4); font-size:10px; }
.doc-title-bar { background:#fff; text-align:center; padding:18px 0 14px; border-bottom:2.5px solid #1A3A5C; }
.doc-title-text { font-size:22px; font-weight:800; letter-spacing:16px; color:#1A3A5C; text-indent:16px; }

/* 섹션 밴드 */
.section-band { background:#1A3A5C; color:#fff; font-size:11px; font-weight:700; letter-spacing:1px; padding:6px 16px; display:flex; align-items:center; gap:8px; }
.section-band .band-icon { opacity:0.7; font-size:12px; }

/* 폼 테이블 */
.form-table { width:100%; border-collapse:collapse; font-size:13px; }
.form-table tr { border-bottom:1px solid #D0D8E4; }
.form-table tr:last-child { border-bottom:none; }
.form-table td { border-right:1px solid #D8E2EE; }
.form-table td:last-child { border-right:none; }

/* 레이블 셀 */
td.lbl { background:#EEF3FA; color:#1A3A5C; font-weight:700; font-size:12px; text-align:center; vertical-align:middle; padding:10px 8px; border-right:1px solid #C8D6E8; line-height:1.5; white-space:pre-line; letter-spacing:0.3px; }
td.lbl.major { background:#1A3A5C; color:#fff; font-size:12px; font-weight:700; letter-spacing:2px; writing-mode:vertical-rl; padding:12px 6px; }
td.lbl.sub { background:#F5F8FC; color:#3A5A7C; font-size:11.5px; font-weight:600; }
td.lbl.header-row { background:#2D5A8E; color:#fff; font-size:11px; font-weight:700; text-align:center; padding:8px 6px; }

/* 입력 셀 */
td.inp { background:#fff; border-right:1px solid #E0E8F0; padding:0; }
td.inp:last-child { border-right:none; }
td.inp input[type=text], td.inp input[type=tel] { display:block; width:100%; height:100%; min-height:42px; border:none; outline:none; padding:10px 14px; font-family:'Noto Sans KR',sans-serif; font-size:13px; color:#1A2E44; background:transparent; line-height:1.5; }
td.inp textarea { display:block; width:100%; border:none; outline:none; padding:12px 14px; font-family:'Noto Sans KR',sans-serif; font-size:13px; color:#1A2E44; background:transparent; resize:vertical; line-height:1.7; min-height:100px; }
td.inp input:focus, td.inp textarea:focus { background:#F0F6FF; box-shadow:inset 3px 0 0 #2D5A8E; }
td.inp input::placeholder, td.inp textarea::placeholder { color:#A0B0C4; font-size:12px; }

/* 빈칸 강조 */
.field-empty { background:#FFF3F3 !important; box-shadow:inset 3px 0 0 #E53E3E !important; }
.field-empty::placeholder { color:#E53E3E !important; font-weight:600; }

/* select */
td.review { background:#F9FAFB; text-align:center; padding:8px 10px; border-left:1px solid #D8E2EE; }
td.review select { border:1.5px solid #B8C8DC; border-radius:6px; padding:6px 10px; font-size:12px; font-family:'Noto Sans KR',sans-serif; background:#fff; color:#1A3A5C; cursor:pointer; width:90%; font-weight:500; outline:none; transition:border-color 0.15s; }
td.review select:focus { border-color:#2D5A8E; box-shadow:0 0 0 3px rgba(45,90,142,0.12); }

/* 체크박스 */
td.check-wrap { padding:14px 16px; background:#FAFBFD; vertical-align:top; border-left:2px solid #2D5A8E; }
.check-section-label { font-size:11px; font-weight:700; color:#2D5A8E; margin-bottom:10px; padding-bottom:6px; border-bottom:1px solid #D0DCEC; letter-spacing:0.5px; }
.check-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:6px 12px; }
.check-grid label { display:flex; align-items:flex-start; gap:7px; font-size:12px; color:#2A3F55; cursor:pointer; line-height:1.5; padding:4px 6px; border-radius:5px; transition:background 0.12s; }
.check-grid label:hover { background:#EEF3FA; }
.check-grid input[type=checkbox] { margin-top:2px; flex-shrink:0; accent-color:#1A3A5C; width:14px; height:14px; }
.check-notice { font-size:10px; color:#E8500A; margin-top:10px; font-style:italic; padding-top:8px; border-top:1px dashed #D0DCEC; }

/* 액션바 */
.action-bar { max-width:794px; width:100%; margin-top:12px; background:#fff; border-radius:2px; padding:16px 24px; display:flex; align-items:center; justify-content:space-between; gap:10px; flex-wrap:wrap; box-shadow:0 4px 16px rgba(0,0,0,0.1); }
.action-left { display:flex; gap:8px; }
.btn { display:inline-flex; align-items:center; gap:6px; padding:10px 20px; border:none; border-radius:7px; font-family:'Noto Sans KR',sans-serif; font-size:13px; font-weight:600; cursor:pointer; transition:all 0.18s; letter-spacing:0.2px; }
.btn-danger { background:#fff; color:#C0392B; border:1.5px solid #C0392B; }
.btn-danger:hover { background:#FEF0EE; }
.btn-secondary { background:#fff; color:#1A3A5C; border:1.5px solid #1A3A5C; }
.btn-secondary:hover { background:#EEF3FA; }
.btn-primary { background:linear-gradient(135deg,#1A3A5C,#2D5A8E); color:#fff; box-shadow:0 4px 14px rgba(26,58,92,0.3); }
.btn-primary:hover { transform:translateY(-1px); box-shadow:0 6px 18px rgba(26,58,92,0.35); }
.btn-primary:disabled { opacity:0.6; cursor:not-allowed; transform:none; }
.btn-save { background:linear-gradient(135deg,#1A6B3C,#22883F); color:#fff; box-shadow:0 4px 14px rgba(26,107,60,0.3); }
.btn-save:hover { transform:translateY(-1px); box-shadow:0 6px 18px rgba(26,107,60,0.35); }
.status-msg { font-size:12px; font-weight:600; padding:0 4px; }
.status-msg.ok { color:#1A6B3C; }
.status-msg.err { color:#C0392B; }
.status-msg.loading { color:#2D5A8E; }
.spinner { display:inline-block; width:13px; height:13px; border:2px solid rgba(255,255,255,0.3); border-top-color:#fff; border-radius:50%; animation:spin 0.7s linear infinite; vertical-align:middle; }
@keyframes spin { to { transform:rotate(360deg); } }

/* 빈칸 토스트 */
.empty-toast { position:fixed; bottom:28px; left:50%; transform:translateX(-50%); background:#2D3748; color:#fff; padding:12px 24px; border-radius:10px; font-size:13px; font-weight:600; box-shadow:0 8px 24px rgba(0,0,0,0.25); display:flex; align-items:center; gap:10px; z-index:999; opacity:0; pointer-events:none; transition:opacity 0.25s; white-space:nowrap; }
.empty-toast.show { opacity:1; pointer-events:auto; }
.toast-count { background:#E53E3E; color:#fff; font-size:11px; font-weight:800; padding:2px 8px; border-radius:20px; }

@media print {
  .sd-nav, .action-bar { display:none; }
  body { background:#fff; }
  .a4-paper { box-shadow:none; }
  .page-wrap { padding:0; }
}
</style>
</head>
<body>

<nav class="sd-nav">
  <a href="/" class="sd-nav-logo">SAFETY<span>-DIRECT</span></a>
  <span class="sd-nav-center">건설 안전관리계획서 작성 시스템</span>
  <a href="/forms.html" class="sd-nav-back">← 양식 목록</a>
</nav>

<div class="page-wrap">
  <div class="a4-paper">

    <div class="doc-header">
      <div class="doc-header-left">
        <span class="doc-badge">{서식번호}</span>
        <span class="doc-subtitle">건설기술진흥법 시행규칙 제58조 관련</span>
      </div>
      <div class="doc-header-right">
        <div class="doc-org">Safety-Direct</div>
      </div>
    </div>

    <div class="doc-title-bar">
      <div class="doc-title-text">{양식 제목 (자음 사이 2칸 띄어쓰기)}</div>
    </div>

    <!-- 섹션1 -->
    <div class="section-band"><span class="band-icon">🏗</span> {섹션명}</div>
    <table class="form-table">
      <colgroup>
        <col style="width:18%">
        <col style="width:82%">
      </colgroup>
      <!-- 필드 행 추가 -->
      <tr>
        <td class="lbl">필드명</td>
        <td class="inp"><input type="text" id="필드id" placeholder="예시값"></td>
      </tr>
    </table>

    <!-- 필요에 따라 섹션 추가 -->

  </div><!-- /.a4-paper -->

  <div class="action-bar">
    <div class="action-left">
      <button class="btn btn-danger" onclick="clearAll()">🗑 초기화</button>
      <button class="btn btn-secondary" onclick="checkEmpty()">✔ 입력 확인</button>
    </div>
    <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
      <span class="status-msg" id="statusMsg"></span>
      <button class="btn btn-primary" id="downloadBtn" onclick="generateHwpx()">⬇ hwpx 다운로드</button>
      <button class="btn btn-save" onclick="saveAndGo()">💾 저장하기</button>
    </div>
  </div>
</div>

<div class="empty-toast" id="emptyToast">
  <span id="toastMsg">빈칸이 있습니다</span>
  <span class="toast-count" id="toastCount"></span>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
<script>
// hwpx Base64 (Python으로 생성: base64.b64encode(open('template.hwpx','rb').read()).decode())
const HWPX_B64 = "%%HWPX_BASE64%%";

// 필드ID → (행인덱스, 셀인덱스) 매핑 (0-based, hwpx-form-builder STEP2 참고)
const FIELD_MAP = {
  // "필드id": [행번호, 셀번호],
};

function collectData() {
  const data = {};
  document.querySelectorAll('td.inp input[type=text], td.inp input[type=tel], td.inp textarea').forEach(el => {
    if (el.id) data[el.id] = el.value.trim();
  });
  const checked = [...document.querySelectorAll('input[name="수립대상"]:checked')];
  if (checked.length) data["수립대상_메모"] = checked.map(c => c.value).join(', ');
  return data;
}

function clearAll() {
  if (!confirm('모든 입력값을 초기화하시겠습니까?')) return;
  document.querySelectorAll('input[type=text],input[type=tel],textarea').forEach(el => el.value = '');
  document.querySelectorAll('input[type=checkbox]').forEach(el => el.checked = false);
  document.querySelectorAll('select').forEach(el => el.selectedIndex = 0);
  document.querySelectorAll('.field-empty').forEach(el => el.classList.remove('field-empty'));
  document.getElementById('statusMsg').textContent = '';
}

let toastTimer = null;
function checkEmpty() {
  document.querySelectorAll('.field-empty').forEach(el => el.classList.remove('field-empty'));
  const fields = document.querySelectorAll('td.inp input[type=text], td.inp input[type=tel], td.inp textarea');
  const emptyFields = [];
  fields.forEach(el => {
    if (el.value.trim() === '') {
      el.classList.add('field-empty');
      emptyFields.push(el);
      el.addEventListener('input', function onInput() {
        if (this.value.trim() !== '') { this.classList.remove('field-empty'); this.removeEventListener('input', onInput); }
      });
    }
  });
  if (emptyFields.length === 0) {
    showToast('✅ 모든 항목이 입력되었습니다!', 0, true);
  } else {
    emptyFields[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
    emptyFields[0].focus();
    showToast('빈칸을 확인해주세요', emptyFields.length, false);
  }
}

function showToast(msg, count, isOk) {
  const toast = document.getElementById('emptyToast');
  document.getElementById('toastMsg').textContent = msg;
  const countEl = document.getElementById('toastCount');
  countEl.textContent = count > 0 ? count + '개' : '';
  countEl.style.display = count > 0 ? 'inline' : 'none';
  toast.style.background = isOk ? '#276749' : '#2D3748';
  toast.classList.add('show');
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}

function saveAndGo() { window.location.href = '/forms.html'; }

function injectText(xmlStr, fieldId, value) {
  if (!value || !FIELD_MAP[fieldId]) return xmlStr;
  const [rowIdx, cellIdx] = FIELD_MAP[fieldId];
  const HP = "http://www.hancom.co.kr/hwpml/2011/paragraph";
  const doc = new DOMParser().parseFromString(xmlStr, "application/xml");
  const tbl = doc.getElementsByTagNameNS(HP, "tbl")[0];
  if (!tbl) return xmlStr;
  const rows = tbl.getElementsByTagNameNS(HP, "tr");
  if (rowIdx >= rows.length) return xmlStr;
  const cells = rows[rowIdx].getElementsByTagNameNS(HP, "tc");
  if (cellIdx >= cells.length) return xmlStr;
  const cell = cells[cellIdx];
  const paras = cell.getElementsByTagNameNS(HP, "p");
  if (!paras.length) return xmlStr;
  const runs = paras[0].getElementsByTagNameNS(HP, "run");
  if (runs.length) {
    const tTags = runs[0].getElementsByTagNameNS(HP, "t");
    if (tTags.length) { tTags[0].textContent = value; }
    else { const t = doc.createElementNS(HP, "hp:t"); t.textContent = value; runs[0].appendChild(t); }
  } else {
    const allRuns = tbl.getElementsByTagNameNS(HP, "run");
    if (allRuns.length) {
      const ref = allRuns[0].cloneNode(true);
      const tTags = ref.getElementsByTagNameNS(HP, "t");
      if (tTags.length) { tTags[0].textContent = value; while (tTags.length > 1) tTags[1].remove(); }
      paras[0].appendChild(ref);
    }
  }
  return new XMLSerializer().serializeToString(doc);
}

async function generateHwpx() {
  const btn = document.getElementById('downloadBtn');
  const status = document.getElementById('statusMsg');
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> 생성 중...';
  status.className = 'status-msg loading';
  status.innerHTML = '<span class="spinner"></span> hwpx 파일을 생성하고 있습니다...';
  try {
    const raw = atob(HWPX_B64);
    const bytes = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
    const zip = await JSZip.loadAsync(bytes);
    let xmlStr = await zip.file("Contents/section0.xml").async("string");
    const data = collectData();
    for (const [fid, val] of Object.entries(data)) {
      if (val && FIELD_MAP[fid]) xmlStr = injectText(xmlStr, fid, val);
    }
    zip.file("Contents/section0.xml", xmlStr);
    const blob = await zip.generateAsync({ type: "blob", mimeType: "application/hwp+zip", compression: "DEFLATE" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const name = document.querySelector('td.inp input[type=text]')?.value.trim() || '{양식명}';
    a.href = url; a.download = `{양식명}_${name}.hwpx`; a.click();
    URL.revokeObjectURL(url);
    status.className = 'status-msg ok';
    status.textContent = '✅ hwpx 파일이 생성되었습니다.';
  } catch(e) {
    console.error(e);
    status.className = 'status-msg err';
    status.textContent = '❌ 오류: ' + e.message;
  }
  btn.disabled = false;
  btn.innerHTML = '⬇ hwpx 다운로드';
}
</script>
</body>
</html>
```

---

## 컬럼 구조 가이드

### 2열 (단순 양식)
```html
<colgroup><col style="width:18%"><col style="width:82%"></colgroup>
```

### 5열 (관계자 정보 등)
```html
<colgroup>
  <col style="width:9%">   <!-- 대분류 major -->
  <col style="width:12%">  <!-- 소분류 sub -->
  <col style="width:37%">  <!-- 주 입력 -->
  <col style="width:12%">  <!-- 우측 레이블 -->
  <col style="width:30%">  <!-- 우측 입력 -->
</colgroup>
```

### 4열 (공사개요 수치+체크박스)
```html
<colgroup>
  <col style="width:7%">   <!-- major 세로 -->
  <col style="width:16%">  <!-- 항목명 -->
  <col style="width:20%">  <!-- 수치 입력 -->
  <col style="width:57%">  <!-- 체크박스 (rowspan) -->
</colgroup>
```

---

## UI 검토 체크리스트 (form-ui-reviewer 요약)

새 양식 생성 후 반드시 확인:

- [ ] 레이블 셀(`td.lbl`)과 입력 셀(`td.inp`) 배경이 명확히 구분되는가
- [ ] 입력 최소 높이 42px 이상인가 (클릭 영역 충분)
- [ ] 섹션 밴드(`.section-band`)로 영역이 명확히 나뉘는가
- [ ] 회사명/전화번호 레이블은 `<br>`로 2줄 처리
- [ ] 긴 텍스트(주소, 공종)는 `<textarea>` 사용
- [ ] 날짜 범위는 `type="text"` + placeholder 예시값 제공
- [ ] `checkEmpty()` 빈칸 검증 작동 확인
- [ ] `saveAndGo()` → `/forms.html` 이동 확인
- [ ] `clearAll()` confirm 다이얼로그 있는가

---

## hwpx Base64 임베드 방법 (hwpx-form-builder STEP5)

hwpx 파일이 있을 경우 Python으로 Base64를 생성해서 HWPX_B64에 붙인다:

```python
import base64, re

with open('template.hwpx', 'rb') as f:
    b64 = base64.b64encode(f.read()).decode('utf-8')

with open('public/forms/{양식명}.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 플레이스홀더 치환
html = html.replace('%%HWPX_BASE64%%', b64)
# 또는 기존 Base64 교체
html = re.sub(r'(const HWPX_B64 = ")[^"]*(")', rf'\g<1>{b64}\g<2>', html)

with open('public/forms/{양식명}.html', 'w', encoding='utf-8') as f:
    f.write(html)
```

---

## 완료 후 처리

1. `public/forms.html` 에서 해당 항목 수정:
   - `badge-soon` → `badge-ready` (✅ 작성 가능)
   - `btn-write disabled` → `btn-write` (활성화)
   - `onclick="goForm('준비중')"` → `onclick="goForm('/forms/{양식명}.html')"`

2. server.js는 static 파일 서빙 중이므로 별도 라우트 추가 불필요
