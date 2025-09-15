# AUTO GENERATED FILE - DO NOT EDIT

export seqviz

"""
    seqviz(;kwargs...)

A SeqViz component.
SeqViz is a Dash wrapper for the seqviz JavaScript library.
It provides DNA, RNA, and protein sequence visualization with
circular and linear viewers, annotations, primers, and more.
Keyword arguments:
- `id` (String; optional): The ID used to identify this component in Dash callbacks.
- `accession` (String; optional): (Deprecated upstream) NCBI accession ID. Prefer parsing with seqparse.
- `annotations` (optional): Array of annotation objects to render.
Each annotation: { start: number, end: number, name: string, direction?: number, color?: string }. annotations has the following type: Array of lists containing elements 'start', 'end', 'name', 'direction', 'color'.
Those elements have the following types:
  - `start` (Real; required)
  - `end` (Real; required)
  - `name` (String; required)
  - `direction` (Real; optional)
  - `color` (String; optional)s
- `bpColors` (Dict; optional): Object mapping base pairs or indexes to custom colors.
- `colors` (Array of Strings; optional): Array of colors for annotations, translations, and highlights.
- `disableExternalFonts` (Bool; optional): Whether to disable downloading external fonts.
- `enableCopyEvent` (Bool; optional): When false, disables the default copyEvent (ctrl/cmd + C).
- `enableSelectAllEvent` (Bool; optional): When false, disables the default selectAllEvent (ctrl/cmd + A).
- `enzymes` (optional): Array of restriction enzymes.
Can be enzyme names (strings) or custom enzyme objects.. enzymes has the following type: Array of String | lists containing elements 'name', 'rseq', 'fcut', 'rcut', 'color', 'range'.
Those elements have the following types:
  - `name` (String; required)
  - `rseq` (String; required)
  - `fcut` (Real; required)
  - `rcut` (Real; required)
  - `color` (String; optional)
  - `range` (optional): . range has the following type: lists containing elements 'start', 'end'.
Those elements have the following types:
  - `start` (Real; optional)
  - `end` (Real; optional)s
- `file` (String | Dict; optional): (Deprecated upstream) Sequence file or URL. Prefer parsing with seqparse.
- `highlights` (optional): Array of highlight objects.
Each highlight: { start: number, end: number, color?: string }. highlights has the following type: Array of lists containing elements 'start', 'end', 'color'.
Those elements have the following types:
  - `start` (Real; required)
  - `end` (Real; required)
  - `color` (String; optional)s
- `name` (String; optional): The name of the sequence/plasmid. Shown at the center of the circular viewer.
- `primers` (optional): Array of primer objects to render.
Each primer: { start: number, end: number, name: string, direction: number, color?: string }. primers has the following type: Array of lists containing elements 'start', 'end', 'name', 'direction', 'color'.
Those elements have the following types:
  - `start` (Real; required)
  - `end` (Real; required)
  - `name` (String; required)
  - `direction` (Real; required)
  - `color` (String; optional)s
- `rotateOnScroll` (Bool; optional): Whether the circular viewer rotates on scroll.
- `search` (optional): Search configuration object.
{ query: string, mismatch?: number }. search has the following type: lists containing elements 'query', 'mismatch'.
Those elements have the following types:
  - `query` (String; required)
  - `mismatch` (Real; optional)
- `searchResults` (Array; optional): Search results emitted by seqviz (read-only for Dash usage).
- `selection` (optional): Selection state object.
{ start: number, end: number, clockwise?: boolean }. selection has the following type: lists containing elements 'start', 'end', 'clockwise'.
Those elements have the following types:
  - `start` (Real; required)
  - `end` (Real; required)
  - `clockwise` (Bool; optional)
- `seq` (String; optional): The sequence to render. Can be DNA, RNA, or amino acid sequence.
- `showComplement` (Bool; optional): Whether to show the complement sequence.
- `style` (Dict; optional): CSS styles for the outer container div.
- `translations` (optional): Array of translation objects.
Each translation: { start: number, end: number, direction: number, name?: string, color?: string }. translations has the following type: Array of lists containing elements 'start', 'end', 'direction', 'name', 'color'.
Those elements have the following types:
  - `start` (Real; required)
  - `end` (Real; required)
  - `direction` (Real; required)
  - `name` (String; optional)
  - `color` (String; optional)s
- `viewer` (a value equal to: 'linear', 'circular', 'both', 'both_flip'; optional): The type and orientation of the sequence viewers.
Options: "linear", "circular", "both", "both_flip"
- `zoom` (optional): Zoom configuration object.
Currently supports: { linear: number } (0-100). zoom has the following type: lists containing elements 'linear'.
Those elements have the following types:
  - `linear` (Real; optional)
"""
function seqviz(; kwargs...)
        available_props = Symbol[:id, :accession, :annotations, :bpColors, :colors, :disableExternalFonts, :enableCopyEvent, :enableSelectAllEvent, :enzymes, :file, :highlights, :name, :primers, :rotateOnScroll, :search, :searchResults, :selection, :seq, :showComplement, :style, :translations, :viewer, :zoom]
        wild_props = Symbol[]
        return Component("seqviz", "SeqViz", "dash_seqviz", available_props, wild_props; kwargs...)
end

