"""
HWPX 주입 검증기 — 성공/실패 알림만 출력

사용법:
  python scripts/preview_hwpx.py                        # 테스트 파일 2개 모두
  python scripts/preview_hwpx.py final_form/테스트_공사개요서.hwpx
"""
import zipfile, re, sys, os
from pathlib import Path

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def extract_text(cell_xml: str) -> str:
    cell_xml = re.sub(r'<hp:linesegarray[\s\S]*?</hp:linesegarray>', '', cell_xml)
    cell_xml = re.sub(r'<hp:tab[^/]*/>', ' ', cell_xml)
    parts = re.findall(r'<hp:t[^>]*>(.*?)</hp:t>', cell_xml)
    return ' '.join(p for p in parts if p.strip())

def parse_cells(xml: str) -> dict:
    """(tbl_idx, col, row) → 텍스트"""
    result = {}
    for tbl_idx, tbl_m in enumerate(re.finditer(r'<hp:tbl\s', xml)):
        tbl_start = tbl_m.start()
        tbl_end = xml.find('</hp:tbl>', tbl_start) + 9
        tbl_xml = xml[tbl_start:tbl_end]
        for tc_m in re.finditer(r'<hp:tc\s', tbl_xml):
            tc_start = tc_m.start()
            tc_end = tbl_xml.find('</hp:tc>', tc_start) + 8
            tc_xml = tbl_xml[tc_start:tc_end]
            addr = re.search(r'colAddr="(\d+)"\s+rowAddr="(\d+)"', tc_xml)
            if addr:
                result[(tbl_idx, int(addr.group(1)), int(addr.group(2)))] = extract_text(tc_xml)
    return result

def verify(hwpx_path: str):
    fname = Path(hwpx_path).name

    if not os.path.exists(hwpx_path):
        print(f'  [오류] 파일 없음: {fname}')
        return

    with zipfile.ZipFile(hwpx_path, 'r') as z:
        xml = z.read('Contents/section0.xml').decode('utf-8', errors='replace')

    cells = parse_cells(xml)

    # 파일명에 따라 FIELD_MAP, TEST_DATA 선택
    try:
        if '공사개요' in fname:
            from inject_test import FIELD_MAP_B21, TEST_DATA_B21 as DATA
            field_map = FIELD_MAP_B21
        elif '표지' in fname or '목차' in fname:
            from inject_test import FIELD_MAP_A12, TEST_DATA_A12 as DATA
            field_map = FIELD_MAP_A12
        else:
            print(f'  [경고] 알 수 없는 파일: {fname}')
            return
    except ImportError as e:
        print(f'  [오류] inject_test 로드 실패: {e}')
        return

    ok_list, fail_list = [], []
    for tbl, col, row, key in field_map:
        expected = DATA.get(key, '')
        if not expected:
            continue
        actual = cells.get((tbl, col, row), '')
        # 첫 줄 30자로 비교
        if str(expected).split('\n')[0].strip()[:30] in actual:
            ok_list.append(key)
        else:
            fail_list.append((key, expected, actual))

    total = len(ok_list) + len(fail_list)
    if not fail_list:
        print(f'  ✅ [{fname}] 전체 {total}개 필드 주입 성공')
    else:
        print(f'  ⚠️  [{fname}] {len(ok_list)}/{total} 성공, {len(fail_list)}개 실패:')
        for key, exp, act in fail_list:
            print(f'      ✘ {key}')
            print(f'        기대값: {str(exp)[:50]}')
            print(f'        실제값: {str(act)[:50] if act else "(빈 셀)"}')

if __name__ == '__main__':
    base = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

    if len(sys.argv) > 1:
        targets = [os.path.abspath(t) for t in sys.argv[1:]]
    else:
        targets = [
            os.path.join(base, 'final_form', '테스트_공사개요서.hwpx'),
            os.path.join(base, 'final_form', '테스트_표지및목차.hwpx'),
        ]

    print('\n[HWPX 주입 검증]')
    for t in targets:
        verify(t)
    print()
