# /formspree-connect — Formspree 연동 추가

기존 양식 HTML 페이지에 Formspree AJAX 제출 기능이 올바르게 연동되어 있는지 확인하고, 없으면 추가합니다.

## 사용법
```
/formspree-connect [파일경로 또는 양식명]
```
예: `/formspree-connect 현장특성분석`
예: `/formspree-connect public/forms/현장특성분석.html`

## 동작 순서

1. **파일 확인**: `public/forms/{양식명}.html` 파일을 Read로 읽는다.

2. **Formspree 연동 체크**: 아래 3가지가 모두 있는지 확인한다.
   - `.formspree-section` div 영역
   - `submitToFormspree()` 함수
   - fetch URL `https://formspree.io/f/xaqpbvry`

3. **없으면 추가**: Edit 도구로 아래 코드를 삽입한다.

### 추가할 HTML (action-bar 아래, </div> 바로 뒤):
```html
<div class="formspree-section">
  <label>📧 작성 내용을 이메일로 제출 (선택사항)</label>
  <input type="email" id="submitterEmail" placeholder="담당자 이메일 입력">
  <button class="btn-submit-formspree" onclick="submitToFormspree()">제출하기</button>
  <div class="formspree-status" id="formspreeStatus"></div>
</div>
```

### 추가할 CSS (</style> 바로 앞):
```css
.formspree-section { max-width:960px; margin:0 auto; background:#f0f4f8; border:1px solid #aaa; border-top:none; padding:14px 20px; display:flex; align-items:center; gap:12px; flex-wrap:wrap; }
.formspree-section label { font-size:11.5px; color:#334; font-weight:600; }
.formspree-section input[type=email] { flex:1; min-width:200px; max-width:300px; padding:6px 10px; border:1px solid #aab; border-radius:4px; font-size:12px; font-family:'Noto Sans KR',sans-serif; }
.btn-submit-formspree { background:#E8500A; color:#fff; border:none; padding:7px 18px; border-radius:4px; font-size:12px; font-weight:700; cursor:pointer; font-family:'Noto Sans KR',sans-serif; }
.formspree-status { font-size:11px; width:100%; }
.formspree-status.ok { color:#1a7a3a; font-weight:700; }
.formspree-status.err { color:#b00; font-weight:700; }
```

### 추가할 JS 함수 (마지막 </script> 바로 앞):
```javascript
async function submitToFormspree() {
  const email = document.getElementById('submitterEmail').value.trim();
  const status = document.getElementById('formspreeStatus');
  if (!email) { status.className='formspree-status err'; status.textContent='이메일을 입력해주세요.'; return; }
  const data = collectData();
  const formName = document.querySelector('.app-header h1')?.textContent?.trim() || '양식';
  const payload = { _replyto: email, _subject: `[Safety-Direct] ${formName} 제출`, ...data };
  status.className='formspree-status'; status.textContent='제출 중...';
  try {
    const res = await fetch('https://formspree.io/f/xaqpbvry', {
      method:'POST', body:JSON.stringify(payload),
      headers:{ 'Accept':'application/json', 'Content-Type':'application/json' }
    });
    if (res.ok) {
      status.className='formspree-status ok';
      status.textContent='✅ 제출이 완료되었습니다. 담당자가 검토 후 연락드립니다.';
    } else {
      status.className='formspree-status err'; status.textContent='❌ 제출 실패. 다시 시도해주세요.';
    }
  } catch(e) {
    status.className='formspree-status err'; status.textContent='❌ 네트워크 오류.';
  }
}
```

4. **완료 후 확인**: 연동된 파일에서 `formspree.io/f/xaqpbvry`가 정상 포함되어 있는지 Grep으로 확인한다.

5. **결과 보고**: 파일명, 추가한 내용, 적용 여부를 요약해서 알려준다.

## 참고 정보
- Formspree Form ID: `xaqpbvry`
- Formspree URL: `https://formspree.io/f/xaqpbvry`
- collectData() 함수는 각 양식 HTML에 이미 포함되어 있어야 함 (/new-form 스킬로 생성된 파일은 기본 포함)
- 이미 연동되어 있으면 "이미 연동되어 있습니다"라고 알리고 종료
