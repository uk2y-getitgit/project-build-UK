# 🇰🇷 Claude Code 한글 설정 & 한글 깨짐 방지 환경 셋팅 가이드

> 작성일: 2026-03-14  
> 목적: 새 환경 셋팅 시 반복 참조용 체크리스트  
> 참고: https://code.claude.com/docs/ko/vs-code

---

## 📌 한글 설정 전체 체크리스트 (빠른 참조)

```
[ ] 1. VSCode UI → 한국어 언어팩 설치
[ ] 2. VSCode settings.json → 파일 인코딩 UTF-8 설정
[ ] 3. VSCode settings.json → 터미널 인코딩 UTF-8 설정
[ ] 4. Windows 한정 → 시스템 로케일 UTF-8 활성화
[ ] 5. Windows 한정 → PowerShell 프로필에 chcp 65001 등록
[ ] 6. Claude Code 전역 CLAUDE.md → 한국어 응답 지시
[ ] 7. Claude Code 최신 버전 유지 (IME 버그 수정 포함)
```

---

## 1️⃣ VSCode UI 한국어 패치 (VSCode 메뉴를 한국어로)

### 방법 A: 확장 마켓플레이스에서 설치
1. `Ctrl + Shift + X` → Extensions 열기
2. 검색창에 **"Korean Language Pack"** 입력
3. Microsoft 공식 패키지 설치 후 VSCode 재시작

### 방법 B: 커맨드 팔레트로 변경
```
Ctrl + Shift + P → "Configure Display Language" 입력 → ko 선택
```
> VSCode가 자동 재시작되며 메뉴가 한국어로 전환됩니다.

---

## 2️⃣ VSCode 파일 인코딩 → UTF-8 강제 설정

### settings.json 열기
```
Ctrl + Shift + P → "Open User Settings (JSON)" 입력
```

### 추가할 설정값
```json
{
  // ✅ 파일 기본 인코딩을 UTF-8로 고정
  "files.encoding": "utf8",

  // ✅ 인코딩 자동 추측 (EUC-KR 파일도 자동 감지)
  "files.autoGuessEncoding": true,

  // ✅ 새 파일 줄바꿈 형식 (LF 권장, Windows는 CRLF 선택 가능)
  "files.eol": "\n"
}
```

> ⚠️ `autoGuessEncoding`은 확률 기반이므로 특정 파일에서 잘못 감지될 수 있음.  
> 그럴 경우 하단 상태바의 인코딩 표시를 클릭 → "Reopen with Encoding" → 직접 선택.

---

## 3️⃣ VSCode 터미널 인코딩 → UTF-8 설정

### settings.json에 추가
```json
{
  // ✅ 터미널 폰트 (한글 지원 폰트 사용)
  "terminal.integrated.fontFamily": "D2Coding, 'Courier New', monospace",

  // ✅ Windows 한정: cmd 터미널 인코딩
  "terminal.integrated.env.windows": {
    "PYTHONIOENCODING": "utf-8"
  }
}
```

> 한글 지원 권장 폰트: `D2Coding`, `Nanum Gothic Coding`, `Consolas`  
> 폰트가 없으면 한글이 □□□ 으로 보일 수 있음.

---

## 4️⃣ Windows 전용: 시스템 로케일 UTF-8 활성화

> ⛔ Windows에서 Claude Code 터미널 한글 깨짐의 핵심 원인!  
> Windows는 기본으로 CP949(EUC-KR) 인코딩을 사용함.

### 설정 방법
```
제어판 → 시계 및 국가 → 지역 → 관리 탭
→ "시스템 로케일 변경" 클릭
→ ☑ "Beta: 세계 언어 지원을 위해 Unicode UTF-8 사용" 체크
→ 재부팅
```

> ✅ 이 설정 후 명령 프롬프트 기본 인코딩이 UTF-8(65001)로 변경됨.  
> ⚠️ 일부 레거시 프로그램(오래된 게임 등)에서 한글 깨짐이 생길 수 있음.

---

## 5️⃣ Windows 전용: PowerShell 프로필에 UTF-8 등록

> VSCode 터미널이 PowerShell일 경우 필수.

### PowerShell 프로필 파일 열기
```powershell
notepad $PROFILE
# 파일이 없으면: New-Item -Path $PROFILE -ItemType File -Force
```

### 프로필에 아래 내용 추가
```powershell
# UTF-8 인코딩 강제 (한글 깨짐 방지)
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::InputEncoding  = [System.Text.Encoding]::UTF8
$OutputEncoding           = [System.Text.Encoding]::UTF8
chcp 65001 | Out-Null
```

> 저장 후 새 터미널 세션에서 자동 적용됨.

---

## 6️⃣ Claude Code 한국어 응답 설정 (CLAUDE.md)

> Claude Code는 영어 입력 시 영어로 응답하는 경향이 있음.  
> CLAUDE.md 파일로 항상 한국어로 응답하도록 지시 가능.

### 전역 설정 파일 (모든 프로젝트에 적용)
```bash
# 파일 경로
~/.claude/CLAUDE.md          # macOS / Linux
%USERPROFILE%\.claude\CLAUDE.md  # Windows
```

### CLAUDE.md 작성 예시
```markdown
# 전역 규칙

## 언어
- 모든 응답은 반드시 **한국어**로 작성할 것
- 영어로 질문을 받아도 한국어로 답변할 것
- 코드 주석도 한국어로 작성할 것
- 커밋 메시지는 한국어로 작성할 것 (형식: `타입: 변경 내용`)

## 응답 형식
- 명확하고 간결하게 설명할 것
- 코드 변경 시 변경 이유를 한국어로 설명할 것
```

### 프로젝트별 설정 파일 (해당 프로젝트에만 적용)
```
프로젝트_루트/CLAUDE.md
```

---

## 7️⃣ Claude Code 버전 업데이트 (IME 한글 입력 버그 수정)

> Claude Code v2.0.68 이후 한글/중국어/일본어 IME 입력 버그 수정됨.  
> 문장 중간에서 한글 입력 시 글자가 이상하게 나오는 현상이 해결됨.

### 버전 확인 및 업데이트
```bash
# 현재 버전 확인
claude --version

# 네이티브 인스톨러로 설치한 경우 → 자동 업데이트됨

# npm으로 설치한 경우 → 수동 업데이트
npm update -g @anthropic-ai/claude-code

# 또는 네이티브 인스톨러로 마이그레이션 (권장)
curl -fsSL https://claude.ai/install.sh | bash
npm uninstall -g @anthropic-ai/claude-code
```

---

## 8️⃣ VSCode 터미널 설정 (Claude Code 전용)

### `/terminal-setup` 명령어 실행
Claude Code 세션 내에서 아래 명령 실행 시 VSCode 터미널 자동 설정:
```
/terminal-setup
```
> Shift+Enter 멀티라인 입력 키바인딩 자동 적용됨.

### settings.json 추가 권장 설정
```json
{
  // ✅ 파일 자동저장 (Claude Code가 최신 파일 읽도록)
  "files.autoSave": "afterDelay",
  "files.autoSaveDelay": 1000,

  // ✅ 터미널 스크롤백 충분히 확보
  "terminal.integrated.scrollback": 10000
}
```

---

## 🔧 자주 발생하는 한글 문제 & 해결법

| 증상 | 원인 | 해결 방법 |
|------|------|-----------|
| 터미널에서 한글이 `???` 또는 `□□`로 표시 | 터미널 인코딩이 CP949 | PowerShell 프로필에 `chcp 65001` 추가 |
| 파일 내 한글이 `ëì´ê¸°`처럼 표시 | 파일 인코딩 불일치 (EUC-KR ↔ UTF-8) | `autoGuessEncoding: true` 또는 수동으로 인코딩 재지정 |
| 한글 입력 중간에 글자가 이상하게 나옴 | Claude Code IME 버그 (구버전) | Claude Code 최신 버전으로 업데이트 |
| Claude가 영어로만 답변함 | 언어 지시 없음 | CLAUDE.md에 한국어 응답 지시 추가 |
| git commit 메시지 한글 깨짐 | git 인코딩 설정 | 아래 git 설정 참고 |

### Git 한글 설정 (보너스)
```bash
git config --global core.quotepath false
git config --global gui.encoding utf-8
git config --global i18n.commit.encoding utf-8
git config --global i18n.logoutputencoding utf-8
```

---

## ✅ 새 환경 셋팅 최종 확인 순서

```bash
# 1. Claude Code 버전 확인 (v2.0.68 이상)
claude --version

# 2. 터미널 인코딩 확인 (65001 이어야 함)
# Windows PowerShell
[Console]::OutputEncoding.CodePage   # → 65001 확인

# 3. CLAUDE.md 한국어 지시 확인
cat ~/.claude/CLAUDE.md

# 4. 테스트: Claude Code 실행 후 영어로 질문해보기
# "hello" 입력 → 한국어로 답변하면 성공
```

---

## 📚 참고 링크

- Claude Code 공식 한국어 문서: https://code.claude.com/docs/ko/vs-code
- Claude Code 트러블슈팅: https://code.claude.com/docs/ko/troubleshooting
- IME 버그 수정 changelog: https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md
- VSCode 한국어 언어팩: https://marketplace.visualstudio.com/items?itemName=MS-CEINTL.vscode-language-pack-ko
