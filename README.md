# Dash SeqViz

Dash SeqViz is a Dash component library that provides a Python wrapper for the [SeqViz](https://github.com/Lattice-Automation/seqviz) JavaScript library. SeqViz is a powerful DNA, RNA, and protein sequence visualization tool that supports circular and linear viewers, annotations, primers, restriction enzymes, and more.

## Features

- **Multiple Viewer Types**: Support for linear, circular, and both viewers
- **Rich Annotations**: Add annotations, primers, highlights, and translations to sequences
- **Restriction Enzymes**: Visualize restriction enzyme cut sites
- **Interactive**: Full interactivity including selection, search, and zooming
- **Custom Styling**: Comprehensive styling options
- **Dash Integration**: Seamless integration with Dash applications and callbacks

## Quick Start

```python
from dash_seqviz import SeqViz
from dash import Dash, html

app = Dash(__name__)

app.layout = html.Div([
    SeqViz(
        id='my-seqviz',
        seq="TTGACGGCTAGCTCAGTCCTAGGTACAGTGCTAGC",
        name="J23100",
        viewer="both",
        annotations=[
            {
                "start": 0,
                "end": 22,
                "name": "Strong promoter",
                "direction": 1,
                "color": "blue"
            }
        ],
        style={"height": "500px", "width": "100%"}
    )
])

if __name__ == '__main__':
    app.run(debug=True)
```

## API Reference

### SeqViz Properties

#### Required Properties

- **`seq`** (string): The sequence to render. Can be DNA, RNA, or amino acid sequence.

#### Optional Properties

- **`id`** (string): The ID used to identify this component in Dash callbacks.

- **`name`** (string): The name of the sequence/plasmid. Shown at the center of the circular viewer.

- **`viewer`** (string): The type and orientation of the sequence viewers.
  - Options: `"linear"`, `"circular"`, `"both"`, `"both_flip"`
  - Default: `"both"`

- **`annotations`** (list): Array of annotation objects to render.
  - Each annotation: `{"start": int, "end": int, "name": str, "direction"?: int, "color"?: str}`

- **`primers`** (list): Array of primer objects to render.
  - Each primer: `{"start": int, "end": int, "name": str, "direction": int, "color"?: str}`

- **`highlights`** (list): Array of highlight objects.
  - Each highlight: `{"start": int, "end": int, "color"?: str}`

- **`translations`** (list): Array of translation objects.
  - Each translation: `{"start": int, "end": int, "direction": int, "name"?: str, "color"?: str}`

- **`enzymes`** (list): Array of restriction enzymes.
  - Can be enzyme names (strings) or custom enzyme objects.
  - Custom enzyme: `{"name": str, "rseq": str, "fcut": int, "rcut": int, "color"?: str, "range"?: {"start": int, "end": int}}`

- **`search`** (dict): Search configuration object.
  - Format: `{"query": str, "mismatch"?: int}`

- **`selection`** (dict): Selection state object.
  - Format: `{"start": int, "end": int, "clockwise"?: bool}`

- **`colors`** (list): Array of colors for annotations, translations, and highlights.

- **`bpColors`** (dict): Object mapping base pairs or indexes to custom colors.
  - Example: `{"A": "#FF0000", "T": "#00FF00", 12: "#0000FF"}`

- **`style`** (dict): CSS styles for the outer container div.
  - Example: `{"height": "500px", "width": "100%"}`

- **`zoom`** (dict): Zoom configuration object.
  - Format: `{"linear": int}` (0-100)
  - Default: `{"linear": 50}`

- **`showComplement`** (bool): Whether to show the complement sequence.
  - Default: `true`

- **`rotateOnScroll`** (bool): Whether the circular viewer rotates on scroll.
  - Default: `true`

- **`disableExternalFonts`** (bool): Whether to disable downloading external fonts.
  - Default: `false`

- Deprecated (prefer parsing externally with `seqparse`):
  - **`file`** (string | File): FASTA, GenBank, SnapGene, JBEI, or SBOL file
  - **`accession`** (string): NCBI accession-ID

- Events / Read-only:
  - **`onSelection`** (function): Called after selection events; selection returned also via `selection`
  - **`onSearch`** (function): Called after search; results returned also via `searchResults` (read-only)

## Examples

### Basic Sequence Viewer

```python
dash_seqviz.SeqViz(
    seq="ATCGATCGATCGATCG",
    name="Simple Sequence",
    viewer="linear"
)
```

### Advanced Sequence with Annotations

```python
dash_seqviz.SeqViz(
    seq="TTGACGGCTAGCTCAGTCCTAGGTACAGTGCTAGC",
    name="J23100 Promoter",
    viewer="both",
    annotations=[
        {
            "start": 0,
            "end": 22,
            "name": "Strong promoter",
            "direction": 1,
            "color": "blue"
        },
        {
            "start": 23,
            "end": 43,
            "name": "RBS",
            "direction": 1,
            "color": "green"
        }
    ],
    primers=[
        {
            "start": 0,
            "end": 20,
            "name": "Forward Primer",
            "direction": 1,
            "color": "red"
        }
    ],
    highlights=[
        {
            "start": 10,
            "end": 30,
            "color": "yellow"
        }
    ],
    style={"height": "500px", "width": "100%"}
)
```

### With Restriction Enzymes

```python
dash_seqviz.SeqViz(
    seq="GAATTCCTGCAGTTAA",  # Contains EcoRI and PstI sites
    name="Enzyme Test",
    viewer="circular",
    enzymes=["EcoRI", "PstI"],
    style={"height": "400px", "width": "400px"}
)
```

### With Search Functionality

```python
dash_seqviz.SeqViz(
    seq="TTGACGGCTAGCTCAGTCCTAGGTACAGTGCTAGC",
    name="Search Example",
    viewer="both",
    search={
        "query": "GCTAGC",
        "mismatch": 1
    },
    style={"height": "500px", "width": "100%"}
)
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md)

### Install dependencies

If you have selected install_dependencies during the prompt, you can skip this part.

1. Install npm packages
    ```
    $ npm install
    ```
2. Create a virtual env and activate.
    ```
    $ virtualenv venv
    $ . venv/bin/activate
    ```
    _Note: venv\Scripts\activate for windows_

3. Install python packages required to build components.
    ```
    $ pip install -r requirements.txt
    ```
4. Install the python packages for testing (optional)
    ```
    $ pip install -r tests/requirements.txt
    ```
    (Includes biopython for demo/testing of FASTA/GenBank parsing.)

### Write your component code in `src/lib/components/SeqViz.react.js`.

- The demo app is in `src/demo` and you will import your example component code into your demo app.
- Test your code in a Python environment:
    1. Build your code
        ```
        $ npm run build
        ```
    2. Run and modify the `usage.py` sample dash app:
        ```
        $ python usage.py
        ```
- Write tests for your component.
    - A sample test is available in `tests/test_usage.py`, it will load `usage.py` and you can then automate interactions with selenium.
    - Run the tests with `$ pytest tests`.
    - The Dash team uses these types of integration tests extensively. Browse the Dash component code on GitHub for more examples of testing (e.g. https://github.com/plotly/dash-core-components)
- Add custom styles to your component by putting your custom CSS files into your distribution folder (`dash_seqviz`).
    - Make sure that they are referenced in `MANIFEST.in` so that they get properly included when you're ready to publish your component.
    - Make sure the stylesheets are added to the `_css_dist` dict in `dash_seqviz/__init__.py` so dash will serve them automatically when the component suite is requested.
- [Review your code](./review_checklist.md)

### Create a production build and publish:

1. Build your code:
    ```
    $ npm run build
    ```
2. Create a Python distribution
    ```
    $ python setup.py sdist bdist_wheel
    ```
    This will create source and wheel distribution in the generated the `dist/` folder.
    See [PyPA](https://packaging.python.org/guides/distributing-packages-using-setuptools/#packaging-your-project)
    for more information.

3. Test your tarball by copying it into a new environment and installing it locally:
    ```
    $ pip install dash_seqviz-0.0.1.tar.gz
    ```

4. If it works, then you can publish the component to NPM and PyPI:
    1. Publish on PyPI
        ```
        $ twine upload dist/*
        ```
    2. Cleanup the dist folder (optional)
        ```
        $ rm -rf dist
        ```
    3. Publish on NPM (Optional if chosen False in `publish_on_npm`)
        ```
        $ npm publish
        ```
        _Publishing your component to NPM will make the JavaScript bundles available on the unpkg CDN. By default, Dash serves the component library's CSS and JS locally, but if you choose to publish the package to NPM you can set `serve_locally` to `False` and you may see faster load times._

5. Share your component with the community! https://community.plotly.com/c/dash
    1. Publish this repository to GitHub
    2. Tag your GitHub repository with the plotly-dash tag so that it appears here: https://github.com/topics/plotly-dash
    3. Create a post in the Dash community forum: https://community.plotly.com/c/dash
