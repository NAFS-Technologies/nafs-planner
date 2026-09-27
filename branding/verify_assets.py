"""Run with Python 3; checks SVG paths and favicon alpha through ImageMagick."""
from pathlib import Path
import subprocess
import xml.etree.ElementTree as ET
root = Path(__file__).resolve().parents[1]
for name in ['logo', 'icon']:
    path = root / 'branding' / f'taskflow-{name}.svg'
    tree = ET.parse(path)
    assert tree.getroot().get('viewBox')
    assert tree.findall('.//{http://www.w3.org/2000/svg}path')
    assert not tree.findall('.//{http://www.w3.org/2000/svg}image')
for app in ['web', 'admin', 'space']:
    for name in ['taskflow-logo.png', 'taskflow-icon.png']:
        path = root / f'apps/{app}/public' / name
        value = subprocess.check_output(['magick', str(path), '-format', '%[fx:p{0,0}.a]', 'info:'], text=True)
        assert float(value) == 0, path
    for size in [16, 32]:
        path = root / f'apps/{app}/app/assets/favicon/favicon-{size}x{size}.png'
        value = subprocess.check_output(['magick', str(path), '-format', '%[fx:p{0,0}.a]', 'info:'], text=True)
        assert float(value) == 0, path
print('SVG paths and transparent logo/favicon assets verified.')
