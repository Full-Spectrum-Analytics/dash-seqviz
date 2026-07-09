import json
import os as _os
import sys as _sys
from pathlib import Path

import dash as _dash

# noinspection PyUnresolvedReferences
from ._imports_ import *
from ._imports_ import __all__
from .parse import parse
from .fetch import fetch_ncbi

if not hasattr(_dash, 'development'):
    print(
        'Dash was not successfully imported. '
        'Make sure you don\'t have a file '
        'named \n"dash.py" in your current directory.',
        file=_sys.stderr,
    )
    _sys.exit(1)

_basepath = Path(__file__).parent
with open(_basepath / 'package-info.json') as f:
    package = json.load(f)

package_name = package['name'].replace(' ', '_').replace('-', '_')
__version__ = package['version']

_async_resources = ["SeqViz"]

_js_dist = [
    {
        "relative_package_path": f"async-{resource}.js",
        "external_url": (
            f"https://unpkg.com/{package_name}@{__version__}"
            f"/{__name__}/async-{resource}.js"
        ),
        "namespace": package_name,
        "async": True,
    }
    for resource in _async_resources
] + [
    {
        "relative_package_path": f"async-{resource}.js.map",
        "external_url": (
            f"https://unpkg.com/{package_name}@{__version__}"
            f"/{__name__}/async-{resource}.js.map"
        ),
        "namespace": package_name,
        "dynamic": True,
    }
    for resource in _async_resources
] + [
    {
        'relative_package_path': 'dash_seqviz.min.js',
        'namespace': package_name,
    },
    {
        'relative_package_path': 'dash_seqviz.min.js.map',
        'namespace': package_name,
        'dynamic': True,
    },
]

_css_dist = [
    {
        'relative_package_path': 'dash_seqviz.css',
        'namespace': package_name,
    },
]

for _component in __all__:
    setattr(locals()[_component], '_js_dist', _js_dist)
    setattr(locals()[_component], '_css_dist', _css_dist)

# Python-side helpers (not Dash components; appended after the component loop
# so the _js_dist/_css_dist assignment above does not try to treat them as one).
__all__ = __all__ + ['parse', 'fetch_ncbi']
