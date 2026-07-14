/**
 * Self-contained build of the REAL SeqViz component for the static docs demo.
 *
 * The hosted explorer has no Dash runtime and no build step, so it can't use
 * the normal dash_seqviz bundle (which defers its implementation to an async
 * chunk resolved by Dash's dynamic-import shim). This entry bundles React,
 * ReactDOM and seqviz together with the actual component implementation
 * (`../lib/fragments/SeqViz.react`) into one window global, so the explorer
 * renders the exact same component — interactive legend and all — that ships
 * to Dash users.
 */
import React from 'react';
import {createRoot} from 'react-dom/client';
import SeqViz from '../lib/fragments/SeqViz.react';

const roots = new WeakMap();

// Mount (or update) the real SeqViz into `el` with `props`. `props.setProps`
// receives the component's write-backs (selection, search_results,
// clicked_element, export_result, hidden_elements) so the demo can react
// exactly as a Dash app would.
export function render(el, props) {
    if (!el) {
        return;
    }
    let root = roots.get(el);
    if (!root) {
        root = createRoot(el);
        roots.set(el, root);
    }
    root.render(React.createElement(SeqViz, props));
}
