import ai_tools_tui

def test_parse_readme_has_editors_choice():
    data = ai_tools_tui.parse_readme()
    assert "Editor's Choice" in data

def test_parse_readme_first_tool_structure():
    data = ai_tools_tui.parse_readme()
    first_category = next(iter(data.values()))
    assert isinstance(first_category, list)
    if first_category:  # ensure not empty
        tool = first_category[0]
        assert set(tool.keys()) == {"name", "link", "desc"}
