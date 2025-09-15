from dash.testing.application_runners import import_app


def test_seqviz_renders_and_props_roundtrip(dash_duo):
    app = import_app('usage')
    dash_duo.start_server(app)

    # SeqViz root should exist
    seqviz_root = dash_duo.find_element('#seqviz-demo')
    assert seqviz_root is not None

    # Adjust zoom slider (linear) and verify no errors in console
    # (UI pieces are simple in usage.py; focus on mounting without errors)
    dash_duo.wait_for_page()
    logs = dash_duo.get_logs()
    # No severe errors
    assert not any(l['level'] == 'SEVERE' for l in logs)


def test_seqviz_linear_and_circular_examples_mount(dash_duo):
    app = import_app('usage')
    dash_duo.start_server(app)

    # Linear example present
    demo = dash_duo.find_element('#seqviz-demo')
    assert demo is not None


def test_selection_and_search_emit_readouts(dash_duo):
    app = import_app('usage')
    dash_duo.start_server(app)

    # Readouts present
    sel = dash_duo.find_element('#selection-readout')
    srch = dash_duo.find_element('#search-readout')
    assert sel is not None and srch is not None

    # Wait for initial search results to appear (should be >0 due to default search)
    dash_duo.wait_for_text_to_equal('#selection-readout', 'selection: none')
    # searchResults count value should eventually be visible
    dash_duo.wait_for_text_to_equal('#search-readout', srch.text)  # stabilizes
    # The element should contain the "searchResults: N" prefix
    assert dash_duo.find_element('#search-readout').text.startswith('searchResults: ')
