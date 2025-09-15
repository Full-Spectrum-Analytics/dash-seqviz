% Auto-generated: do not edit by hand
\name{seqViz}

\alias{seqViz}

\title{SeqViz component}

\description{
SeqViz is a Dash wrapper for the seqviz JavaScript library. It provides DNA, RNA, and protein sequence visualization with circular and linear viewers, annotations, primers, and more.
}

\usage{
seqViz(id=NULL, accession=NULL, annotations=NULL, bpColors=NULL,
colors=NULL, disableExternalFonts=NULL,
enableCopyEvent=NULL, enableSelectAllEvent=NULL,
enzymes=NULL, file=NULL, highlights=NULL, name=NULL,
onSearch=NULL, onSelection=NULL, primers=NULL,
rotateOnScroll=NULL, search=NULL, searchResults=NULL,
selection=NULL, seq=NULL, showComplement=NULL, style=NULL,
translations=NULL, viewer=NULL, zoom=NULL)
}

\arguments{
\item{id}{Character. The ID used to identify this component in Dash callbacks.}

\item{accession}{Character. (Deprecated upstream) NCBI accession ID. Prefer parsing with seqparse.}

\item{annotations}{List of lists containing elements 'start', 'end', 'name', 'direction', 'color'.
those elements have the following types:
  - start (numeric; required)
  - end (numeric; required)
  - name (character; required)
  - direction (numeric; optional)
  - color (character; optional)s. Array of annotation objects to render.
Each annotation: { start: number, end: number, name: string, direction?: number, color?: string }}

\item{bpColors}{Named list. Object mapping base pairs or indexes to custom colors.}

\item{colors}{List of characters. Array of colors for annotations, translations, and highlights.}

\item{disableExternalFonts}{Logical. Whether to disable downloading external fonts.}

\item{enableCopyEvent}{Logical. When false, disables the default copyEvent (ctrl/cmd + C).}

\item{enableSelectAllEvent}{Logical. When false, disables the default selectAllEvent (ctrl/cmd + A).}

\item{enzymes}{List of character | lists containing elements 'name', 'rseq', 'fcut', 'rcut', 'color', 'range'.
those elements have the following types:
  - name (character; required)
  - rseq (character; required)
  - fcut (numeric; required)
  - rcut (numeric; required)
  - color (character; optional)
  - range (optional): . range has the following type: lists containing elements 'start', 'end'.
those elements have the following types:
  - start (numeric; optional)
  - end (numeric; optional)s. Array of restriction enzymes.
Can be enzyme names (strings) or custom enzyme objects.}

\item{file}{Character | named list. (Deprecated upstream) Sequence file or URL. Prefer parsing with seqparse.}

\item{highlights}{List of lists containing elements 'start', 'end', 'color'.
those elements have the following types:
  - start (numeric; required)
  - end (numeric; required)
  - color (character; optional)s. Array of highlight objects.
Each highlight: { start: number, end: number, color?: string }}

\item{name}{Character. The name of the sequence/plasmid. Shown at the center of the circular viewer.}

\item{onSearch}{Callback function for search events.}

\item{onSelection}{Callback function for selection events.}

\item{primers}{List of lists containing elements 'start', 'end', 'name', 'direction', 'color'.
those elements have the following types:
  - start (numeric; required)
  - end (numeric; required)
  - name (character; required)
  - direction (numeric; required)
  - color (character; optional)s. Array of primer objects to render.
Each primer: { start: number, end: number, name: string, direction: number, color?: string }}

\item{rotateOnScroll}{Logical. Whether the circular viewer rotates on scroll.}

\item{search}{Lists containing elements 'query', 'mismatch'.
those elements have the following types:
  - query (character; required)
  - mismatch (numeric; optional). Search configuration object.
{ query: string, mismatch?: number }}

\item{searchResults}{Unnamed list. Search results emitted by seqviz (read-only for Dash usage).}

\item{selection}{Lists containing elements 'start', 'end', 'clockwise'.
those elements have the following types:
  - start (numeric; required)
  - end (numeric; required)
  - clockwise (logical; optional). Selection state object.
{ start: number, end: number, clockwise?: boolean }}

\item{seq}{Character. The sequence to render. Can be DNA, RNA, or amino acid sequence.}

\item{showComplement}{Logical. Whether to show the complement sequence.}

\item{style}{Named list. CSS styles for the outer container div.}

\item{translations}{List of lists containing elements 'start', 'end', 'direction', 'name', 'color'.
those elements have the following types:
  - start (numeric; required)
  - end (numeric; required)
  - direction (numeric; required)
  - name (character; optional)
  - color (character; optional)s. Array of translation objects.
Each translation: { start: number, end: number, direction: number, name?: string, color?: string }}

\item{viewer}{A value equal to: 'linear', 'circular', 'both', 'both_flip'. The type and orientation of the sequence viewers.
Options: "linear", "circular", "both", "both_flip"}

\item{zoom}{Lists containing elements 'linear'.
those elements have the following types:
  - linear (numeric; optional). Zoom configuration object.
Currently supports: { linear: number } (0-100)}
}

\value{named list of JSON elements corresponding to React.js properties and their values}

