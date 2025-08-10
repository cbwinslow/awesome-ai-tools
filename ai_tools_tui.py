import re
import webbrowser
from pathlib import Path

README_PATH = Path(__file__).with_name('README.md')

def parse_readme(path: Path = README_PATH):
    """Parse README and return mapping of category to list of tools.

    Each tool is represented as a dict with keys: name, link, description.
    """
    categories = {}
    current_cat = None
    tool_pattern = re.compile(r"- \[(?P<name>[^\]]+)\]\((?P<link>[^)]+)\)(?: - (?P<desc>.*))?")
    header_pattern = re.compile(r"^(##+)\s+(.*)")

    with path.open(encoding='utf-8') as f:
        for line in f:
            header_match = header_pattern.match(line)
            if header_match:
                level = len(header_match.group(1))
                name = header_match.group(2).strip()
                if level >= 2:
                    current_cat = name
                    categories[current_cat] = []
                continue
            if current_cat is None:
                continue
            line = line.strip()
            if not line.startswith('- ['):
                continue
            match = tool_pattern.match(line)
            if match:
                categories[current_cat].append(match.groupdict())
    return categories

def run_cli():
    data = parse_readme()
    categories = list(data.keys())
    while True:
        print('\nAvailable categories:')
        for idx, name in enumerate(categories, 1):
            print(f"{idx}. {name}")
        print('0. Exit')
        choice = input('Select a category: ').strip()
        if choice == '0':
            break
        if not choice.isdigit() or int(choice) < 1 or int(choice) > len(categories):
            print('Invalid choice. Try again.')
            continue
        cat = categories[int(choice) - 1]
        tools = data[cat]
        while True:
            print(f"\nTools in {cat}:")
            for idx, tool in enumerate(tools, 1):
                print(f"{idx}. {tool['name']}")
            print('0. Back')
            t_choice = input('Select a tool: ').strip()
            if t_choice == '0':
                break
            if not t_choice.isdigit() or int(t_choice) < 1 or int(t_choice) > len(tools):
                print('Invalid choice. Try again.')
                continue
            tool = tools[int(t_choice) - 1]
            print(f"\n{tool['name']}")
            if tool.get('desc'):
                print(tool['desc'])
            print(f"Link: {tool['link']}")
            open_choice = input('Open link in browser? (y/N): ').strip().lower()
            if open_choice == 'y':
                webbrowser.open(tool['link'])

if __name__ == '__main__':
    run_cli()
