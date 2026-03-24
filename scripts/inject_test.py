"""
랜덤 테스트 데이터를 HWPX에 삽입하는 스크립트
JavaScript의 injectByCellAddr / injectMultiline 로직을 Python으로 재현
"""
import zipfile, re, shutil, os, html as htmllib

# ── 공통 유틸 ──────────────────────────────────────────────────────
def esc_xml(s):
    return htmllib.escape(str(s), quote=True)

def inject_by_cell_addr(xml, tbl_idx, col_addr, row_addr, value):
    if not value:
        return xml
    escaped = esc_xml(value)
    # tbl_idx 번째 <hp:tbl> 찾기
    cnt, pos = 0, 0
    tbl_start = -1
    while True:
        f = xml.find('<hp:tbl ', pos)
        if f == -1:
            return xml
        if cnt == tbl_idx:
            tbl_start = f
            break
        cnt += 1
        pos = f + 1

    tbl_end = xml.find('</hp:tbl>', tbl_start) + 9
    tbl = xml[tbl_start:tbl_end]

    addr_pat = f'colAddr="{col_addr}" rowAddr="{row_addr}"'
    ai = tbl.find(addr_pat)
    if ai == -1:
        return xml

    ts = tbl.rfind('<hp:tc', 0, ai)
    te = tbl.find('</hp:tc>', ai) + 8
    tc = tbl[ts:te]

    ht_o = tc.find('<hp:t>')
    ht_c = tc.find('</hp:t>')
    if ht_o != -1 and ht_c != -1:
        tc = tc[:ht_o + 6] + escaped + tc[ht_c:]
    else:
        ri = tc.find('<hp:run ')
        if ri == -1:
            return xml
        self_close = tc.find('/>', ri)
        run_close  = tc.find('</hp:run>', ri)
        if self_close != -1 and (run_close == -1 or self_close < run_close):
            tc = tc[:self_close] + '><hp:t>' + escaped + '</hp:t></hp:run>' + tc[self_close + 2:]
        elif run_close != -1:
            tc = tc[:run_close] + '<hp:t>' + escaped + '</hp:t>' + tc[run_close:]
        else:
            return xml

    new_tbl = tbl[:ts] + tc + tbl[te:]
    return xml[:tbl_start] + new_tbl + xml[tbl_end:]

def inject_multiline(xml, tbl_idx, col_addr, row_addr, value):
    lines = value.split('\n')
    if len(lines) == 1:
        return inject_by_cell_addr(xml, tbl_idx, col_addr, row_addr, value)
    # 첫 줄은 injectByCellAddr로, 나머지는 단순 추가 (간략 구현)
    for line in lines:
        if line.strip():
            xml = inject_by_cell_addr(xml, tbl_idx, col_addr, row_addr, line.strip())
            break
    return xml

def process_hwpx(src_path, dst_path, inject_fn):
    shutil.copy2(src_path, dst_path)
    with zipfile.ZipFile(dst_path, 'r') as z:
        xml = z.read('Contents/section0.xml').decode('utf-8', errors='replace')
    xml = inject_fn(xml)
    # 임시 파일로 재패키징
    tmp = dst_path + '.tmp.zip'
    with zipfile.ZipFile(dst_path, 'r') as zin:
        with zipfile.ZipFile(tmp, 'w', zipfile.ZIP_DEFLATED) as zout:
            for item in zin.infolist():
                if item.filename == 'Contents/section0.xml':
                    zout.writestr(item, xml.encode('utf-8'))
                else:
                    zout.writestr(item, zin.read(item.filename))
    os.replace(tmp, dst_path)
    print(f'생성: {dst_path}')

# ══════════════════════════════════════════════════════════════════
# 테스트 데이터
# ══════════════════════════════════════════════════════════════════

TEST_DATA_B21 = {
    '공사명':                  '(가칭)강남 복합주거문화시설 신축공사',
    '현장소재지':              '서울특별시 강남구 테헤란로 521',
    '전화번호':                '02-1234-5678',
    'gen_공사기간':            '2026.03.01 ~ 2028.12.31',
    '공사금액':                '48,500,000,000 (부가세 포함)',
    '시공자_회사명':           '한국종합건설 주식회사 (02-3456-7890)',
    '시공자_대표자':           '김태영',
    '시공자_주소':             '서울특별시 서초구 반포대로 100, 한국건설빌딩 12층',
    '현장대리인_회사명':       '한국종합건설 주식회사 (02-3456-9999)',
    '현장대리인_대표자':       '박현수',
    '현장대리인_주소':         '서울특별시 강남구 테헤란로 521 현장사무소',
    '발주자_회사명':           '강남구청 (02-3463-2114)',
    '발주자_대표자':           '이재원',
    '발주자_주소':             '서울특별시 강남구 학동로 426',
    '설계자_회사명':           '(주)삼성종합건축사사무소 (02-2222-3333)',
    '설계자_대표자':           '최건우',
    '설계자_주소':             '서울특별시 종로구 종로 33',
    '건설사업관리자_회사명':   '(주)우리CM엔지니어링 (02-4444-5555)',
    '건설사업관리자_성명':     '정민철',
    '건설사업관리자_주소':     '서울특별시 마포구 마포대로 119',
    '사업관리단장_회사명':     '한국PM협회 (02-6666-7777)',
    '사업관리단장_성명':       '홍기범',
    '사업관리단장_주소':       '서울특별시 강서구 화곡로 68',
    '대지면적':               '8,542',
    '건축면적':               '3,981',
    '연면적':                 '62,450',
    '건폐율':                 '46.60%',
    '용적율':                 '299.80%',
    '규모':                   '지하 4층 / 지상 28층',
    '구조':                   'RC구조 + 철골구조 (복합)',
    '최고높이':               '112.5',
    '최대굴착깊이':           '18.2',
    '주요공법':               '• 흙막이공법 : CIP + 어스앵커\n• 지지공법 : 제거식 어스앵커 공법\n• 슬래브 : 무량판 공법',
    '세부대상공종':           '가설공사(방진벽, 가설비계, 이동식크레인)\n굴착 및 흙막이, 암발파\n거푸집·동바리, 데크플레이트, 갱폼\n콘크리트 공사\n철골구조\n타워크레인 공사',
    'gen_수립대상':           '② 2종시설물(연면적 3만㎡ 이상 건축물) ③ 2m이상 흙막이 지보공 ⑤ 10m이상 천공기를 사용 ⑦ 타워크레인 사용',
    '지하안전평가':           '해당',
    '소규모지하안전평가':      '해당 없음',
    '설계안전성검토':         '해당',
    '해체계획서작성대상':      '해당 없음',
    '취약공종':               '해당',
}

FIELD_MAP_B21 = [
    (1, 2, 1,  '공사명'),
    (1, 2, 2,  '현장소재지'),
    (1, 7, 2,  '전화번호'),
    (1, 2, 3,  'gen_공사기간'),
    (1, 7, 3,  '공사금액'),
    (1, 2, 4,  '시공자_회사명'),
    (1, 7, 4,  '시공자_대표자'),
    (1, 3, 5,  '시공자_주소'),
    (1, 2, 6,  '현장대리인_회사명'),
    (1, 7, 6,  '현장대리인_대표자'),
    (1, 3, 7,  '현장대리인_주소'),
    (1, 2, 8,  '발주자_회사명'),
    (1, 7, 8,  '발주자_대표자'),
    (1, 3, 9,  '발주자_주소'),
    (1, 2, 10, '설계자_회사명'),
    (1, 7, 10, '설계자_대표자'),
    (1, 3, 11, '설계자_주소'),
    (1, 2, 12, '건설사업관리자_회사명'),
    (1, 7, 12, '건설사업관리자_성명'),
    (1, 3, 13, '건설사업관리자_주소'),
    (1, 2, 14, '사업관리단장_회사명'),
    (1, 7, 14, '사업관리단장_성명'),
    (1, 3, 15, '사업관리단장_주소'),
    (1, 4, 17, '대지면적'),
    (1, 4, 18, '건축면적'),
    (1, 4, 19, '연면적'),
    (1, 4, 20, '건폐율'),
    (1, 4, 21, '용적율'),
    (1, 4, 22, '규모'),
    (1, 4, 23, '구조'),
    (1, 4, 24, '최고높이'),
    (1, 4, 25, '최대굴착깊이'),
    (1, 2, 26, '주요공법'),
    (1, 2, 27, '세부대상공종'),
    (1, 6, 17, 'gen_수립대상'),
    (1, 8, 28, '지하안전평가'),
    (1, 8, 29, '소규모지하안전평가'),
    (1, 8, 30, '설계안전성검토'),
    (1, 8, 31, '해체계획서작성대상'),
    (1, 8, 32, '취약공종'),
]

TEST_DATA_A12 = {
    '건설사명':          '한국종합건설 주식회사',
    '안전총괄책임자':    '박현수 안전관리자',
    '현장대리인_성명':   '이종민',
    '연락처':           '010-1234-5678',
    '사무소소재지':      '서울특별시 강남구 테헤란로 521 현장사무소',
    'gen_공사명':       '(가칭)강남 복합주거문화시설 신축공사',
    'gen_현장소재지':   '서울특별시 강남구 테헤란로 521',
    'gen_착공예정일':   '2026.03.01',
    'gen_준공예정일':   '2028.12.31',
    'gen_공사금액':     '48,500,000,000 (부가세 포함)',
    'gen_대표자':       '김태영',
}

FIELD_MAP_A12 = [
    (0, 2, 2, '건설사명'),
    (0, 6, 2, '안전총괄책임자'),
    (0, 2, 3, '현장대리인_성명'),
    (0, 6, 3, '연락처'),
    (0, 2, 4, '사무소소재지'),
    (0, 2, 5, 'gen_공사명'),
    (0, 2, 6, 'gen_현장소재지'),
    (0, 3, 7, 'gen_착공예정일'),
    (0, 7, 7, 'gen_준공예정일'),
    (0, 2, 8, 'gen_공사금액'),
    (0, 2, 1, 'gen_대표자'),
]

def inject_b21(xml):
    data = TEST_DATA_B21
    for tbl, col, row, key in FIELD_MAP_B21:
        val = data.get(key, '')
        if not val:
            continue
        if key in ('주요공법', '세부대상공종'):
            xml = inject_multiline(xml, tbl, col, row, val)
        else:
            xml = inject_by_cell_addr(xml, tbl, col, row, val)
    return xml

def inject_a12(xml):
    data = TEST_DATA_A12
    # 표지 {{현장명}} 치환
    xml = xml.replace('{{현장명}}', esc_xml(data.get('gen_공사명', '')))
    for tbl, col, row, key in FIELD_MAP_A12:
        val = data.get(key, '')
        if not val:
            continue
        xml = inject_by_cell_addr(xml, tbl, col, row, val)
    # 개정 이력 샘플
    revision_samples = {
        (2, 1, 5): '2026.03.01',
        (2, 1, 6): '2026.03.01',
        (2, 1, 8): '2026.03.05',
    }
    for (tbl, col, row), val in revision_samples.items():
        xml = inject_by_cell_addr(xml, tbl, col, row, val)
    return xml

# ── 실행 ──────────────────────────────────────────────────────────
if __name__ == '__main__':
    base = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    src_b21 = os.path.join(base, 'final_form', '양식 B-2-1 공사개요.hwpx')
    src_a12 = os.path.join(base, 'final_form', '양식 A-1-2 표지 및 목차.hwpx')
    out_b21 = os.path.join(base, 'final_form', '테스트_공사개요서.hwpx')
    out_a12 = os.path.join(base, 'final_form', '테스트_표지및목차.hwpx')

    process_hwpx(src_b21, out_b21, inject_b21)
    process_hwpx(src_a12, out_a12, inject_a12)

    print('\n[테스트 데이터]')
    print(f'  공사명: {TEST_DATA_B21["공사명"]}')
    print(f'  현장소재지: {TEST_DATA_B21["현장소재지"]}')
    print(f'  공사금액: {TEST_DATA_B21["공사금액"]}')
    print(f'  규모: {TEST_DATA_B21["규모"]}')
    print(f'  사업관리단장: {TEST_DATA_B21["사업관리단장_성명"]}')
