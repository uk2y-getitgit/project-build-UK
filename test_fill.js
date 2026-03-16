// 랜덤 테스트 데이터 입력 후 HWPX 다운로드 자동화
const puppeteer = require('puppeteer');
const path = require('path');

const DOWNLOAD_DIR = 'C:/Users/user/Downloads';

// waitForTimeout 대체 함수
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
  const browser = await puppeteer.launch({
    headless: false,          // 화면에 보이게
    defaultViewport: null,
    args: ['--start-maximized']
  });
  const page = await browser.newPage();

  // 다운로드 경로 설정
  const client = await page.createCDPSession();
  await client.send('Page.setDownloadBehavior', {
    behavior: 'allow',
    downloadPath: DOWNLOAD_DIR
  });

  console.log('페이지 열기...');
  await page.goto('http://localhost:3000/forms/공사개요서.html', { waitUntil: 'networkidle2' });
  await wait(1000);

  // ── 섹션1: 기본 정보 ──
  await fill(page, '공사명', '서울 강남구 역삼동 오피스텔 신축공사');
  await fill(page, '현장소재지', '서울특별시 강남구 역삼동 123-45번지');
  await fill(page, '전화번호', '02-1234-5678');
  // 공사기간
  await page.evaluate(() => {
    document.getElementById('공사기간_시작').value = '2026-03-01';
    document.getElementById('공사기간_종료').value = '2028-06-30';
  });
  // 공사금액 (천단위 자동 포맷 확인)
  await page.evaluate(() => {
    const el = document.getElementById('공사금액');
    el.value = '28500000000';
    el.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await wait(300);
  // 부가세 포함 선택 (기본값)
  console.log('섹션1 완료');

  // ── 섹션2: 참여자 현황 ──
  await fill(page, '시공자_회사명', '(주)대한건설');
  await fill(page, '시공자_전화번호', '02-9876-5432');
  await fill(page, '시공자_대표자', '홍길동');
  await fill(page, '시공자_현장소장', '김안전');
  await fill(page, '시공자_주소', '서울특별시 서초구 서초대로 100, 5층');
  await fill(page, '발주자_회사명', '(주)강남디벨로퍼');
  await fill(page, '발주자_전화번호', '02-5555-1234');
  await fill(page, '발주자_도급인', '이발주');
  await fill(page, '발주자_주소', '서울특별시 강남구 테헤란로 200');
  await fill(page, '설계자_회사명', '한국건축사무소(주)');
  await fill(page, '설계자_전화번호', '02-7777-8888');
  await fill(page, '설계자_대표자', '박설계');
  await fill(page, '설계자_주소', '서울특별시 마포구 양화로 50');
  await fill(page, '건설사업관리자_회사명', '(주)CM코리아');
  await fill(page, '건설사업관리자_전화번호', '02-3333-4444');
  await fill(page, '건설사업관리자_성명', '최감리');
  await fill(page, '건설사업관리자_주소', '서울특별시 영등포구 여의도동 30');
  console.log('섹션2 완료');

  // ── 섹션3: 공사 개요 ──
  await fill(page, '건물용도', '업무시설 (오피스텔)');
  await fill(page, '구조', '철근콘크리트 구조');
  await fill(page, '규모', '지하3층 / 지상22층');
  await page.evaluate(() => { document.getElementById('개소').value = '1'; });
  await fill(page, '최대굴착깊이', '14.5');
  await fill(page, '최고높이', '88.0');
  await fill(page, '대지면적', '3250.00');
  await fill(page, '건축면적', '1820.50');
  await fill(page, '연면적', '38400.00');
  await fill(page, '건폐율', '56.02%');
  await fill(page, '용적율', '198.5%');
  console.log('섹션3 완료');

  // ── 섹션4: 수립 대상 체크박스 (5개 체크) ──
  const checkTargets = [
    '1종시설물(21층이상)',
    '2m이상 흙막이 지보공',
    '5m이상 거푸집·동바리',
    '항타 및 항발기 사용공사',
    '타워크레인 사용',
    '지하10m이상 굴착'
  ];
  for (const val of checkTargets) {
    await page.evaluate((v) => {
      const cb = document.querySelector(`input[name="수립대상"][value="${v}"]`);
      if (cb && !cb.checked) {
        cb.checked = true;
        cb.closest('.chip-label').click();
      }
    }, val);
    await wait(100);
  }
  console.log('섹션4 완료');

  // ── 섹션5: 주요공법 ──
  await page.evaluate(() => {
    document.getElementById('주요공법').value =
      '• 흙막이공법 : C.I.P (Cast In Place)\n' +
      '• 지지공법 : 제거식 어스앵커 공법\n' +
      '• 콘크리트 타설 : 펌프카 압송\n' +
      '• 철골공사 : 타워크레인 양중';
  });
  await fill(page, '세부대상공종',
    '1종시설물 해당 (22층 오피스텔)\n지하3층 굴착 공사 포함');
  console.log('섹션5 완료');

  // ── 섹션7: 심의·검토 ──
  await page.evaluate(() => {
    ['지하안전평가','소규모지하안전평가','설계안전성검토'].forEach(name => {
      const el = document.querySelector(`input[name="${name}"][value="해당"]`);
      if (el) { el.checked = true; el.dispatchEvent(new Event('change', {bubbles:true})); }
    });
    const tc = document.querySelector('input[name="취약공종"][value="해당"]');
    if (tc) { tc.checked = true; tc.dispatchEvent(new Event('change', {bubbles:true})); }
  });
  console.log('섹션7 완료');

  // ── 섹션8: 5.2 가설구조물 ──
  await page.evaluate(() => {
    document.getElementById('가설_설치시기').value = '2026-04-01';
    document.getElementById('가설_해체시기').value = '2028-05-31';
  });
  const facChecks = ['fac_울타리','fac_출입구','fac_사무실','fac_교육장','fac_창고','fac_화장실','fac_위험물','fac_세륜장'];
  for (const id of facChecks) {
    await page.evaluate((id) => {
      const el = document.getElementById(id);
      if (el && !el.checked) {
        el.checked = true;
        toggleFacility(id);
      }
    }, id);
    await wait(80);
  }
  console.log('섹션8 완료');

  // ── 섹션9: 5.3 공사용 기계설비 ──
  // (1) 공통공사 활성화
  await page.evaluate(() => {
    const cb = document.getElementById('mach1');
    if (cb) { cb.checked = true; toggleMach('mach1'); }
  });
  await wait(200);
  await page.evaluate(() => {
    document.getElementById('mach1_start').value = '2026-04-01';
    document.getElementById('mach1_end').value = '2028-06-30';
  });
  const mach1Subs = ['sub_이동식크레인','sub_천공기','sub_타워크레인','sub_지게차'];
  for (const id of mach1Subs) {
    await page.evaluate((id) => {
      const el = document.getElementById(id);
      if (el && !el.checked) { el.checked = true; toggleSub(id); }
    }, id);
    await wait(80);
  }

  // (2) 굴착 및 흙막이
  await page.evaluate(() => {
    const cb = document.getElementById('mach2');
    if (cb) { cb.checked = true; toggleMach('mach2'); }
  });
  await wait(200);
  await page.evaluate(() => {
    document.getElementById('mach2_start').value = '2026-04-15';
    document.getElementById('mach2_end').value = '2026-12-31';
  });
  for (const id of ['sub_굴착','sub_흙막이']) {
    await page.evaluate((id) => {
      const el = document.getElementById(id);
      if (el && !el.checked) { el.checked = true; toggleSub(id); }
    }, id);
    await wait(80);
  }

  // (3) 구조물 공사
  await page.evaluate(() => {
    const cb = document.getElementById('mach3');
    if (cb) { cb.checked = true; toggleMach('mach3'); }
  });
  await wait(200);
  await page.evaluate(() => {
    document.getElementById('mach3_start').value = '2026-10-01';
    document.getElementById('mach3_end').value = '2028-04-30';
  });
  await page.evaluate(() => {
    const el = document.getElementById('sub_RC');
    if (el && !el.checked) { el.checked = true; toggleSub('sub_RC'); }
  });

  // (4) 건축 마감
  await page.evaluate(() => {
    const cb = document.getElementById('mach4');
    if (cb) { cb.checked = true; toggleMach('mach4'); }
  });
  await wait(200);
  await page.evaluate(() => {
    document.getElementById('mach4_start').value = '2027-06-01';
    document.getElementById('mach4_end').value = '2028-05-31';
  });

  // (5) 전기설비 - 해당없음
  await page.evaluate(() => {
    const cb = document.getElementById('mach5');
    if (cb) { cb.checked = true; toggleMach('mach5'); }
  });
  await wait(200);
  await page.evaluate(() => {
    const na = document.getElementById('mach5_na');
    if (na) { na.checked = true; toggleMachNA('mach5'); }
  });
  console.log('섹션9 완료');

  // ── 스크롤해서 상태 확인 ──
  await page.evaluate(() => window.scrollTo(0, 0));
  await wait(500);

  // ── HWPX 다운로드 ──
  console.log('HWPX 다운로드 시작...');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await wait(500);

  // 다운로드 완료 대기
  const downloadPromise = new Promise(resolve => {
    client.on('Page.downloadProgress', event => {
      if (event.state === 'completed') resolve(event.guid);
    });
  });

  await page.click('#downloadBtn');

  try {
    await Promise.race([
      downloadPromise,
      new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 15000))
    ]);
    console.log('✅ HWPX 다운로드 완료!');
  } catch(e) {
    console.log('⚠️  다운로드 완료 대기 시간 초과 (파일은 생성되었을 수 있음)');
  }

  await wait(3000);
  console.log('완료! 브라우저를 확인해 주세요.');
  // 브라우저 열어둠
}

async function fill(page, id, value) {
  await page.evaluate((id, value) => {
    const el = document.getElementById(id);
    if (el) {
      el.value = value;
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }, id, value);
}

main().catch(e => { console.error('오류:', e.message); process.exit(1); });
