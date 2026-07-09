"""Optional integrations for dash-seqviz.

Submodules here depend on third-party packages that are *not* required to use
the core component. Import them explicitly, e.g.::

    from dash_seqviz.integrations import mlflow as sv_mlflow

Each submodule raises a clear ImportError if its optional dependency is
missing (install with the matching extra, e.g. ``pip install dash-seqviz[mlflow]``).
"""
