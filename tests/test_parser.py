from pathlib import Path

from ihec_scrubber.parser import Parser


def test_parser_extracts_rows(tmp_path):
    html = Path("tests/fixtures/sample_page_1.html").read_text(encoding="utf-8")
    parser = Parser("https://example.com")
    result = parser.parse(html, "https://example.com/page/1")
    assert len(result.rows) == 2
    first = result.rows[0]
    assert first["اسم المحافظة"] == "أربيل"
    assert first["رقم مركز الاقتراع"] == "001"
    assert first["dedupe_key"]
    assert result.next_page_url == "/page/2"
    assert result.source_date_iso == "2023-10-15"
