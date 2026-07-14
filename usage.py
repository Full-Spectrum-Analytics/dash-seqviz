import plotly.express as px
import random
from dash import Dash, html, dcc, Input, Output, ctx
from typing import Optional, List, Dict
from dash_seqviz import SeqViz, legend

# NEB restriction enzyme names (for multi-select UI)
NEB_ENZYME_NAMES: List[str] = [
    "AatII",
    "AbaSI",
    "Acc65I",
    "AccI",
    "AciI",
    "AclI",
    "AcuI",
    "AfeI",
    "AflII",
    "AflIII",
    "AgeI",
    "AhdI",
    "AleI",
    "AluI",
    "AlwI",
    "AlwNI",
    "ApaI",
    "ApaLI",
    "ApeKI",
    "ApoI",
    "AscI",
    "AseI",
    "AsiSI",
    "AvaI",
    "AvaII",
    "AvrII",
    "BaeGI",
    "BaeI",
    "BamHI",
    "BanI",
    "BanII",
    "BbsI",
    "BbvCI",
    "BbvI",
    "BccI",
    "BceAI",
    "BcgI",
    "BciVI",
    "BclI",
    "BcoDI",
    "BfaI",
    "BfuAI",
    "BglI",
    "BglII",
    "BlpI",
    "BmgBI",
    "BmrI",
    "BmtI",
    "BpmI",
    "Bpu10I",
    "BpuEI",
    "BsaAI",
    "BsaBI",
    "BsaHI",
    "BsaI",
    "BsaJI",
    "BsaWI",
    "BsaXI",
    "BseRI",
    "BseYI",
    "BsgI",
    "BsiEI",
    "BsiHKAI",
    "BsiWI",
    "BslI",
    "BsmAI",
    "BsmBI",
    "BsmFI",
    "BsmI",
    "BsoBI",
    "Bsp1286I",
    "BspCNI",
    "BspDI",
    "BspEI",
    "BspHI",
    "BspMI",
    "BspQI",
    "BsrBI",
    "BsrDI",
    "BsrFI",
    "BsrGI",
    "BsrI",
    "BssHII",
    "BssSI",
    "BstAPI",
    "BstBI",
    "BstEII",
    "BstNI",
    "BstUI",
    "BstXI",
    "BstYI",
    "BstZ17I",
    "Bsu36I",
    "BtgI",
    "BtgZI",
    "BtsCI",
    "BtsI",
    "BtsIMutI",
    "Cac8I",
    "ClaI",
    "CspCI",
    "CviAII",
    "CviKI-1",
    "CviQI",
    "DdeI",
    "DpnI",
    "DpnII",
    "DraI",
    "DraIII",
    "DrdI",
    "EaeI",
    "EagI",
    "EarI",
    "EciI",
    "Eco53kI",
    "EcoNI",
    "EcoO109I",
    "EcoRI",
    "EcoRV",
    "Esp3I",
    "FatI",
    "FauI",
    "Fnu4HI",
    "FokI",
    "FseI",
    "FspEI",
    "FspI",
    "HaeII",
    "HaeIII",
    "HgaI",
    "HhaI",
    "HincII",
    "HindIII",
    "HinfI",
    "HinP1I",
    "HpaI",
    "HpaII",
    "HphI",
    "Hpy166II",
    "Hpy188I",
    "Hpy188III",
    "Hpy99I",
    "HpyAV",
    "HpyCH4III",
    "HpyCH4IV",
    "HpyCH4V",
    "I-CeuI",
    "I-SceI",
    "KasI",
    "KpnI",
    "LpnPI",
    "MboI",
    "MboII",
    "MfeI",
    "MluCI",
    "MluI",
    "MlyI",
    "MmeI",
    "MnlI",
    "MscI",
    "MseI",
    "MslI",
    "MspA1I",
    "MspI",
    "MspJI",
    "MwoI",
    "NaeI",
    "NarI",
    "NciI",
    "NcoI",
    "NdeI",
    "NgoMIV",
    "NheI",
    "NlaIII",
    "NlaIV",
    "NmeAIII",
    "NotI",
    "NruI",
    "NsiI",
    "NspI",
    "PacI",
    "PaeR7I",
    "PciI",
    "PflFI",
    "PflMI",
    "PI-PspI",
    "PI-SceI",
    "PleI",
    "PluTI",
    "PmeI",
    "PmlI",
    "PpuMI",
    "PshAI",
    "PsiI",
    "PspGI",
    "PspOMI",
    "PspXI",
    "PstI",
    "PvuI",
    "PvuII",
    "RsaI",
    "RsrII",
    "SacI",
    "SacII",
    "SalI",
    "SapI",
    "Sau3AI",
    "Sau96I",
    "SbfI",
    "ScaI",
    "ScrFI",
    "SexAI",
    "SfaNI",
    "SfcI",
    "SfiI",
    "SfoI",
    "SgrAI",
    "SmaI",
    "SmlI",
    "SnaBI",
    "SpeI",
    "SphI",
    "SrfI",
    "SspI",
    "StuI",
    "StyD4I",
    "StyI",
    "SwaI",
    "TaqI",
    "TfiI",
    "TseI",
    "Tsp45I",
    "TspMI",
    "TspRI",
    "Tth111I",
    "XbaI",
    "XcmI",
    "XhoI",
    "XmaI",
    "XmnI",
    "ZraI",
]

# Preload local GenBank/FASTA records at import so the demo works without a user click
GB_PRELOADED = None
FA_PRELOADED = None

try:  # pragma: no cover
    from Bio import SeqIO  # type: ignore

    def _extract_gb_annotations(record):
        ann = []
        for feat in getattr(record, "features", []) or []:
            try:
                q = feat.qualifiers if hasattr(feat, "qualifiers") else {}
                start = int(feat.location.start)
                end = int(feat.location.end)
                strand = int(getattr(feat.location, "strand", 1) or 1)
                direction = 1 if strand >= 0 else -1

                if feat.type == "CDS":
                    name_q = (
                        (q.get("gene") or [None])[0]
                        or (q.get("product") or [None])[0]
                        or "CDS"
                    )
                    ann.append(
                        {
                            "start": start,
                            "end": end,
                            "name": name_q,
                            "direction": direction,
                        }
                    )

                elif feat.type == "regulatory":
                    reg_class = (q.get("regulatory_class") or [None])[0]
                    name_q = (
                        (q.get("note") or [None])[0]
                        or (q.get("gene") or [None])[0]
                        or reg_class
                        or "regulatory"
                    )
                    ann.append(
                        {
                            "start": start,
                            "end": end,
                            "name": name_q,
                            "direction": direction,
                        }
                    )

            except Exception:
                continue
        return ann

    def _extract_gb_translations(record):
        trs = []
        for feat in getattr(record, "features", []) or []:
            if feat.type in ("CDS",):
                try:
                    start = int(feat.location.start)
                    end = int(feat.location.end)
                    strand = int(getattr(feat.location, "strand", 1) or 1)
                    direction = 1 if strand >= 0 else -1
                    q = feat.qualifiers if hasattr(feat, "qualifiers") else {}
                    name_q = (
                        (q.get("gene") or [None])[0]
                        or (q.get("product") or [None])[0]
                        or "CDS"
                    )
                    trs.append(
                        {
                            "start": start,
                            "end": end,
                            "direction": direction,
                            "name": name_q,
                        }
                    )
                except Exception:
                    continue
        return trs

    # Parse GenBank if available
    try:
        gb_first = [rec for rec in SeqIO.parse("tests/MN623123.gb", "genbank")][0]
        GB_PRELOADED = {
            "name": getattr(gb_first, "name", "")
            or getattr(gb_first, "id", "")
            or "GenBank",
            "seq": str(gb_first.seq).upper(),
            "annotations": _extract_gb_annotations(gb_first),
            "translations": _extract_gb_translations(gb_first),
        }
    except Exception:
        GB_PRELOADED = None

    # Parse FASTA if available
    try:
        fa_first = [rec for rec in SeqIO.parse("tests/MN623123.fasta", "fasta")][0]
        FA_PRELOADED = {
            "name": getattr(fa_first, "name", "")
            or getattr(fa_first, "id", "")
            or "FASTA",
            "seq": str(fa_first.seq).upper(),
            "annotations": [],
            "translations": [],
        }
    except Exception:
        FA_PRELOADED = None
except Exception:
    GB_PRELOADED = None
    FA_PRELOADED = None

# Demo primers adapted from the seqviz JS example
def _choose_random_color() -> str:
    try:
        palette = list(px.colors.colorbrewer.Paired)
        return palette[random.randrange(len(palette))]
    except Exception:
        return "#888888"

app = Dash(__name__, title="Dash SeqViz")


# Demo content aligned with the seqviz JS examples
app.layout = html.Div(
    [
        html.H1("Dash SeqViz Component Demo"),
        # Controls row – mirrors options in the seqviz demo
        html.Div(
            [
                html.Div(
                    [
                        html.Label("Topology"),
                        dcc.Dropdown(
                            id="viewer",
                            options=[
                                {"label": "Both", "value": "both"},
                                {"label": "Both Flip", "value": "both_flip"},
                                {"label": "Circular", "value": "circular"},
                                {"label": "Linear", "value": "linear"},
                            ],
                            value="both",
                            clearable=False,
                        ),
                    ],
                    style={"minWidth": 220},
                ),
                html.Div(
                    [
                        html.Label("Zoom (linear)"),
                        dcc.Slider(
                            id="zoom",
                            min=0,
                            max=100,
                            step=1,
                            value=60,
                            marks=None,
                            tooltip={"placement": "bottom"},
                        ),
                    ],
                    style={"minWidth": 260},
                ),
                html.Div(
                    [
                        html.Label("Show complement"),
                        dcc.Checklist(
                            id="show-complement",
                            options=[{"label": "", "value": "on"}],
                            value=["on"],
                            inline=True,
                        ),
                    ],
                    style={"minWidth": 180, "display": "flex", "alignItems": "end"},
                ),
                html.Div(
                    [
                        html.Label("Rotate on scroll (circular)"),
                        dcc.Checklist(
                            id="rotate-on-scroll",
                            options=[{"label": "", "value": "on"}],
                            value=["on"],
                            inline=True,
                        ),
                    ],
                    style={"minWidth": 220, "display": "flex", "alignItems": "end"},
                ),
                html.Div(
                    [
                        html.Label("Search query"),
                        dcc.Input(
                            id="search-query",
                            type="text",
                            value="ttnnnaat",
                            debounce=True,
                            placeholder="Enter motif (e.g., GCTAGC)",
                        ),
                    ],
                    style={
                        "minWidth": 260,
                        "display": "flex",
                        "flexDirection": "column",
                    },
                ),
                html.Div(
                    [
                        html.Label("Search mismatch"),
                        dcc.Input(
                            id="search-mismatch", type="number", min=0, step=1, value=0
                        ),
                    ],
                    style={
                        "minWidth": 180,
                        "display": "flex",
                        "flexDirection": "column",
                    },
                ),
                html.Div(
                    [
                        html.Label("Restriction enzymes (NEB)"),
                        dcc.Dropdown(
                            id="enzymes",
                            multi=True,
                            options=[
                                {"label": n, "value": n} for n in NEB_ENZYME_NAMES
                            ],
                            value=["PstI", "EcoRI", "XbaI", "SpeI"],
                            placeholder="Select enzymes",
                        ),
                    ],
                    style={"minWidth": 320},
                ),
                html.Div(
                    [
                        html.Label("bp_colors (A/T/C/G)"),
                        html.Div(
                            [
                                dcc.Input(
                                    id="bp-A",
                                    type="text",
                                    value=px.colors.colorbrewer.Paired[1],
                                    placeholder="A color",
                                ),
                                dcc.Input(
                                    id="bp-T",
                                    type="text",
                                    value=px.colors.colorbrewer.Paired[3],
                                    placeholder="T color",
                                ),
                                dcc.Input(
                                    id="bp-C",
                                    type="text",
                                    value=px.colors.colorbrewer.Paired[5],
                                    placeholder="C color",
                                ),
                                dcc.Input(
                                    id="bp-G",
                                    type="text",
                                    value=px.colors.colorbrewer.Paired[9],
                                    placeholder="G color",
                                ),
                            ],
                            style={"display": "flex", "gap": 8},
                        ),
                    ],
                    style={"minWidth": 420},
                ),
                html.Div(
                    [
                        html.Label("Show translations (CDS)"),
                        dcc.Checklist(
                            id="show-translations",
                            options=[{"label": "", "value": "on"}],
                            value=["on"],
                            inline=True,
                        ),
                    ],
                    style={"minWidth": 220, "display": "flex", "alignItems": "end"},
                ),
                html.Div(
                    [
                        html.Label("Theme"),
                        dcc.Dropdown(
                            id="theme",
                            options=[
                                {"label": "Light", "value": "light"},
                                {"label": "Dark", "value": "dark"},
                                {"label": "Auto (follow page)", "value": "auto"},
                                {"label": "Okabe-Ito (light)", "value": "okabe-ito-light"},
                                {"label": "Okabe-Ito (dark)", "value": "okabe-ito-dark"},
                                {"label": "ColorBrewer (light)", "value": "colorbrewer-light"},
                                {"label": "ColorBrewer (dark)", "value": "colorbrewer-dark"},
                                {"label": "Paul Tol (light)", "value": "tol-light"},
                                {"label": "Paul Tol (dark)", "value": "tol-dark"},
                            ],
                            value="light",
                            clearable=False,
                        ),
                    ],
                    style={"minWidth": 200},
                ),
            ],
            style={
                "display": "flex",
                "gap": 24,
                "flexWrap": "wrap",
                "marginBottom": 12,
            },
        ),
        html.Hr(),
        html.H3("Preloaded sequences"),
        html.Div(
            [
                html.Div(
                    [
                        html.Label("Select preloaded"),
                        dcc.Dropdown(
                            id="preloaded-source",
                            options=[
                                *(
                                    [
                                        {
                                            "label": f"GenBank: {GB_PRELOADED['name']}",
                                            "value": "genbank",
                                        }
                                    ]
                                    if GB_PRELOADED
                                    else []
                                ),
                                *(
                                    [
                                        {
                                            "label": f"FASTA: {FA_PRELOADED['name']}",
                                            "value": "fasta",
                                        }
                                    ]
                                    if FA_PRELOADED
                                    else []
                                ),
                            ],
                            value=(
                                "genbank"
                                if GB_PRELOADED
                                else ("fasta" if FA_PRELOADED else None)
                            ),
                            clearable=False,
                        ),
                    ],
                    style={"minWidth": 320},
                ),
            ],
            style={"display": "flex", "gap": 12, "alignItems": "end"},
        ),
        html.Div(
            [
                html.Span("Reference sequence (NCBI): "),
                html.A(
                    "MN623123.1",
                    href="https://www.ncbi.nlm.nih.gov/nuccore/MN623123.1/",
                    target="_blank",
                    rel="noopener noreferrer",
                ),
            ],
            style={"margin": "8px 0 16px 0"},
        ),
        # Initial viewer content – default to preloaded GenBank/FASTA if available
        SeqViz(
            id="seqviz-demo",
            name=(
                GB_PRELOADED["name"]
                if GB_PRELOADED
                else (FA_PRELOADED["name"] if FA_PRELOADED else "")
            ),
            seq=(
                GB_PRELOADED["seq"]
                if GB_PRELOADED
                else (FA_PRELOADED["seq"] if FA_PRELOADED else "")
            ),
            viewer="both",
            annotations=(
                GB_PRELOADED["annotations"]
                if GB_PRELOADED
                else (FA_PRELOADED["annotations"] if FA_PRELOADED else [])
            ),
            primers=[
                {
                    "start": 633,
                    "end": 653,
                    "name": "pLtetO-1 fw primer",
                    "direction": 1,
                    "color": _choose_random_color(),
                },
                {
                    "start": 686,
                    "end": 706,
                    "name": "pLtetO-1 rev primer",
                    "direction": -1,
                    "color": _choose_random_color(),
                },
                {
                    "start": 512,
                    "end": 535,
                    "name": "pLtetO-1 fwd primer",
                    "direction": 1,
                    "color": _choose_random_color(),
                },
                {
                    "start": 512,
                    "end": 535,
                    "name": "pLtetO-1 rev primer",
                    "direction": -1,
                    "color": _choose_random_color(),
                },
            ],
            search={"query": "ttnnnaat"},
            zoom={"linear": 60},
            show_complement=True,
            legend={
                "show": True,
                "title": "Legend",
                "position": "right",
                "size": "sm",
                "radius": "sm",
                "withBorder": True,
                "p": "sm",
            },
            style={"height": "62vh", "width": "100%"},
        ),
        html.Div(id="hidden-readout", style={"fontFamily": "monospace", "marginTop": 6}),
        html.Div(id="selection-readout"),
        html.Div(id="search-readout"),
        html.Div(id="copied-banner", style={"marginTop": 6, "color": "gray"}),
        html.Div(id="file-load-status", style={"marginTop": 8, "fontStyle": "italic"}),
        html.Hr(),
        # --- roadmap feature showcase -------------------------------------
        html.Div(
            [
                html.Div(
                    [
                        html.H4("Annotation legend (E2)"),
                        html.Div(id="legend-area"),
                    ],
                    style={"minWidth": 260},
                ),
                html.Div(
                    [
                        html.H4("Export figure (B1)"),
                        html.Button("Export SVG", id="export-svg"),
                        html.Button("Export PNG", id="export-png",
                                    style={"marginLeft": 8}),
                        # hidden sink for the clientside auto-download callback
                        html.Div(id="export-sink", style={"display": "none"}),
                    ],
                    style={"minWidth": 320},
                ),
                html.Div(
                    [
                        html.H4("Clicked element (C1)"),
                        html.Div("Click an annotation/primer in the viewer.",
                                 id="clicked-readout",
                                 style={"fontFamily": "monospace"}),
                    ],
                    style={"minWidth": 280},
                ),
            ],
            style={"display": "flex", "gap": 32, "flexWrap": "wrap"},
        ),
    ]
)


@app.callback(
    Output("seqviz-demo", "viewer"),
    Input("viewer", "value"),
)
def update_viewer_viewer(viewer):
    return viewer


@app.callback(
    Output("seqviz-demo", "enzymes"),
    Input("enzymes", "value"),
)
def update_viewer_enzymes(enzymes):
    return enzymes


@app.callback(
    Output("seqviz-demo", "zoom"),
    Input("zoom", "value"),
)
def update_viewer_zoom(zoom):
    return {"linear": int(zoom or 0)}


@app.callback(
    Output("seqviz-demo", "show_complement"),
    Input("show-complement", "value"),
)
def update_viewer_show_complement(show_complement_vals):
    return (show_complement_vals or []) == ["on"]


@app.callback(
    Output("selection-readout", "children"),
    Input("seqviz-demo", "selection"),
)
def expose_selection(selection):
    sel_text = f"selection: {selection}" if selection else "selection: none"
    return sel_text


@app.callback(
    Output("search-readout", "children"), Input("seqviz-demo", "search_results")
)
def expose_search_results(search_results):
    count = len(search_results) if isinstance(search_results, list) else 0
    search_text = f"search_results: {count}"
    return search_text


@app.callback(
    Output("seqviz-demo", "search"),
    Input("search-query", "value"),
    Input("search-mismatch", "value"),
)
def update_search(query, mismatch):
    q = (query or "").strip()
    try:
        mm = int(mismatch or 0)
    except Exception:
        mm = 0
    mm = max(0, mm)
    return {"query": q, "mismatch": mm}


@app.callback(
    Output("copied-banner", "children"),
    Input("seqviz-demo", "selection"),
    Input("seqviz-demo", "seq"),
)
def show_copied_banner(selection, seq):
    if not selection or not isinstance(seq, str):
        return ""
    start, end = int(selection.get("start", 0)), int(selection.get("end", 0))
    s = seq or ""
    if not s:
        return ""
    text = s[start:end] if end >= start else (s[start:] + s[:end])
    return f"Selection: {text[:50]}{'...' if len(text) > 50 else ''}"


@app.callback(
    Output("seqviz-demo", "seq"),
    Input("preloaded-source", "value"),
)
def update_seq(source: Optional[str]) -> str:
    if (source == "genbank" or source is None) and GB_PRELOADED:
        return GB_PRELOADED["seq"]
    if source == "fasta" and FA_PRELOADED:
        return FA_PRELOADED["seq"]
    return ""


@app.callback(
    Output("seqviz-demo", "annotations"),
    Input("preloaded-source", "value"),
)
def update_annotations(source: Optional[str]):
    if (source == "genbank" or source is None) and GB_PRELOADED:
        return GB_PRELOADED["annotations"]
    if source == "fasta" and FA_PRELOADED:
        return FA_PRELOADED["annotations"]
    return []


@app.callback(
    Output("seqviz-demo", "translations"),
    Input("preloaded-source", "value"),
    Input("show-translations", "value"),
)
def update_translations(source: Optional[str], show_trans_vals: Optional[List[str]]):
    show = (show_trans_vals or []) == ["on"]
    if not show:
        return []
    if (source == "genbank" or source is None) and GB_PRELOADED:
        return GB_PRELOADED.get("translations", [])
    if source == "fasta" and FA_PRELOADED:
        return FA_PRELOADED.get("translations", [])
    return []


@app.callback(
    Output("file-load-status", "children"),
    Input("preloaded-source", "value"),
)
def update_file_status(source: Optional[str]) -> str:
    if (source == "genbank" or source is None) and GB_PRELOADED:
        return f"Using preloaded GenBank (length={len(GB_PRELOADED['seq'])})"
    if source == "fasta" and FA_PRELOADED:
        return f"Using preloaded FASTA (length={len(FA_PRELOADED['seq'])})"
    return "No preloaded sequence available"


@app.callback(Output("enzymes", "options"), Input("preloaded-source", "value"))
def update_enzyme_options(source):
    # Always offer the full NEB list
    return [{"label": e, "value": e} for e in NEB_ENZYME_NAMES]


@app.callback(
    Output("seqviz-demo", "rotate_on_scroll"),
    Input("rotate-on-scroll", "value"),
)
def update_rotate_on_scroll(vals: Optional[List[str]]) -> bool:
    return (vals or []) == ["on"]


@app.callback(
    Output("seqviz-demo", "theme"),
    Output("seqviz-demo", "style"),
    Input("theme", "value"),
)
def update_theme(theme: Optional[str]):
    t = theme or "light"
    is_dark = t.endswith("dark")
    bg = "#1a1b1e" if is_dark else "#ffffff"
    fg = "#c1c2c5" if is_dark else "#1a1b1e"
    style = {
        "height": "62vh",
        "width": "100%",
        "background": bg,
        "color": fg,
    }
    return t, style


@app.callback(
    Output("seqviz-demo", "bp_colors"),
    Input("bp-A", "value"),
    Input("bp-T", "value"),
    Input("bp-C", "value"),
    Input("bp-G", "value"),
)
def update_bp_colors(
    a: Optional[str], t: Optional[str], c: Optional[str], g: Optional[str]
) -> Dict[str, str]:
    colors: Dict[str, str] = {}
    if isinstance(a, str) and a.strip():
        colors["A"] = a.strip()
    if isinstance(t, str) and t.strip():
        colors["T"] = t.strip()
    if isinstance(c, str) and c.strip():
        colors["C"] = c.strip()
    if isinstance(g, str) and g.strip():
        colors["G"] = g.strip()
    return colors


@app.callback(
    Output("legend-area", "children"),
    Input("seqviz-demo", "annotations"),
    Input("seqviz-demo", "theme"),
)
def update_legend(annotations, theme):
    return legend(annotations or [], theme=theme)


@app.callback(
    Output("hidden-readout", "children"),
    Input("seqviz-demo", "hidden_elements"),
)
def show_hidden(hidden):
    return "hidden_elements: " + repr(hidden or [])


@app.callback(
    Output("seqviz-demo", "export_request"),
    Input("export-svg", "n_clicks"),
    Input("export-png", "n_clicks"),
    prevent_initial_call=True,
)
def request_export(svg_n, png_n):
    if ctx.triggered_id == "export-svg":
        return {"format": "svg", "token": svg_n or 0}
    return {"format": "png", "token": png_n or 0, "scale": 2}


# When an export lands, trigger the browser download directly (no manual
# link). Runs clientside so it can synthesize and click an <a download>.
app.clientside_callback(
    """
    function(uri) {
        if (!uri) { return window.dash_clientside.no_update; }
        var ext = uri.indexOf('data:image/png') === 0 ? 'png' : 'svg';
        var a = document.createElement('a');
        a.href = uri;
        a.download = 'seqviz-figure.' + ext;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        return '';
    }
    """,
    Output("export-sink", "children"),
    Input("seqviz-demo", "export_result"),
    prevent_initial_call=True,
)


@app.callback(
    Output("clicked-readout", "children"),
    Input("seqviz-demo", "clicked_element"),
    prevent_initial_call=True,
)
def show_clicked(el):
    if not el:
        return "none"
    return f"{el.get('type')}: {el.get('name')} ({el.get('start')}..{el.get('end')})"


if __name__ == "__main__":
    app.run(debug=True, port=8888)
