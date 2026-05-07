import json
import os as _os
import sys as _sys
import warnings as _warnings
from pathlib import Path

import dash as _dash

from ._imports_ import SeqViz as _GeneratedSeqViz

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

_css_dist = []


# Map of deprecated camelCase prop names to their snake_case replacements.
# Removed in dash-seqviz 0.3.0.
#
# Note: the upstream `onSelection` / `onSearch` JS callbacks are documented as
# props but Dash filters function-typed props out of the constructor at
# runtime, so they are not in this map — they were never settable from Python.
_DEPRECATED_PROPS = {
    "bpColors": "bp_colors",
    "showComplement": "show_complement",
    "rotateOnScroll": "rotate_on_scroll",
    "disableExternalFonts": "disable_external_fonts",
    "enableCopyEvent": "enable_copy_event",
    "enableSelectAllEvent": "enable_select_all_event",
    "searchResults": "search_results",
}


class SeqViz(_GeneratedSeqViz):
    """SeqViz Dash component.

    Wraps the auto-generated component to emit ``DeprecationWarning`` when any
    of the legacy camelCase props are used. The deprecated names continue to
    work in 0.2.x and are removed in 0.3.0.

    See the auto-generated parent class for the full prop reference.
    """

    def __init__(self, *args, **kwargs):
        for _old, _new in _DEPRECATED_PROPS.items():
            if _old in kwargs:
                _warnings.warn(
                    f"`{_old}` is deprecated since dash-seqviz 0.2.2 and will "
                    f"be removed in 0.3.0. Use `{_new}` instead.",
                    DeprecationWarning,
                    stacklevel=2,
                )
                # snake_case wins on conflict
                kwargs.setdefault(_new, kwargs.pop(_old))
        super().__init__(*args, **kwargs)


SeqViz._js_dist = _js_dist
SeqViz._css_dist = _css_dist

__all__ = ["SeqViz"]
