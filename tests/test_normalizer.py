from ihec_scrubber import normalizer


def test_normalize_digits():
    assert normalizer.normalize_digits("٠١٢٣٤٥٦٧٨٩") == "0123456789"


def test_make_dedupe_key_stable():
    row = {
        "اسم المحافظة": "أربيل",
        "رقم مركز الاقتراع": "٠٠١",
    }
    key1 = normalizer.make_dedupe_key(row)
    row2 = {
        "اسم المحافظة": "أرْبيل",
        "اسم مركز الاقتراع الفعلي": "مركز أربيل الأول",
    }
    key2 = normalizer.make_dedupe_key(row2)
    assert key1 != ""
    assert key1 != normalizer.make_dedupe_key({"اسم المحافظة": "", "رقم مركز الاقتراع": ""})
    assert key1 != key2  # Different station identifiers result in different keys
