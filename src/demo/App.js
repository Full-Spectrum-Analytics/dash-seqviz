/* eslint no-magic-numbers: 0 */
import React, { useState } from 'react';
import { SeqViz } from '../lib';

const enzymeOptions = ['PstI', 'EcoRI', 'XbaI', 'SpeI'];

const App = () => {
    const [viewer, setViewer] = useState('both');
    const [zoom, setZoom] = useState(60);
    const [showComplement, setShowComplement] = useState(true);
    const [enzymes, setEnzymes] = useState(['PstI', 'EcoRI']);
    const [selection, setSelection] = useState(null);

    return (
        <div style={{ padding: 16, display: 'grid', gap: 16 }}>
            {/* Controls */}
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <div>
                    <label>Topology</label><br />
                    <select value={viewer} onChange={(e) => setViewer(e.target.value)}>
                        <option value="both">Both</option>
                        <option value="both_flip">Both Flip</option>
                        <option value="circular">Circular</option>
                        <option value="linear">Linear</option>
                    </select>
                </div>

                <div>
                    <label>Zoom (linear): {zoom}</label><br />
                    <input type="range" min={0} max={100} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <label>Show complement</label>
                    <input type="checkbox" checked={showComplement} onChange={(e) => setShowComplement(e.target.checked)} />
                </div>

                <div>
                    <label>Enzymes</label><br />
                    {enzymeOptions.map((e) => (
                        <label key={e} style={{ marginRight: 8 }}>
                            <input
                                type="checkbox"
                                checked={enzymes.includes(e)}
                                onChange={(ev) => {
                                    setEnzymes((prev) => ev.target.checked ? [...prev, e] : prev.filter((x) => x !== e));
                                }}
                            />{' '}{e}
                        </label>
                    ))}
                </div>
            </div>

            {/* Viewer */}
            <SeqViz
                id="seqviz-demo-react"
                name="J23100"
                seq="TTGACGGCTAGCTCAGTCCTAGGTACAGTGCTAGC"
                viewer={viewer}
                annotations={[
                    { start: 0, end: 22, name: 'Strong promoter', direction: 1, color: '#3b82f6' },
                    { start: 23, end: 43, name: 'RBS', direction: 1, color: '#10b981' }
                ]}
                primers={[{ start: 0, end: 20, name: 'Forward Primer', direction: 1, color: '#ef4444' }]}
                highlights={[{ start: 10, end: 30, color: '#fde047' }]}
                translations={[
                    { start: 0, end: 30, direction: 1, name: 'ORF 1', color: '#FAA887' },
                    { start: 31, end: 60, direction: -1, name: '' }
                ]}
                bpColors={{ A: '#FF0000', T: 'blue', 12: '#00FFFF' }}
                enzymes={enzymes}
                zoom={{ linear: zoom }}
                showComplement={showComplement}
                style={{ height: '460px', width: '100%' }}
                selection={selection}
                onSelection={(sel) => setSelection(sel)}
            />
        </div>
    )
};


export default App;
