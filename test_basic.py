#!/usr/bin/env python3
"""
Basic test script to verify the SeqViz Dash component can be imported and instantiated.
"""

def test_import():
    """Test that the SeqViz component can be imported."""
    try:
        import dash_seqviz
        print("✓ Successfully imported dash_seqviz")
        return True
    except ImportError as e:
        print(f"✗ Failed to import dash_seqviz: {e}")
        return False

def test_instantiation():
    """Test that the SeqViz component can be instantiated with basic properties."""
    try:
        import dash_seqviz

        # Test basic instantiation
        component = dash_seqviz.SeqViz(
            id='test-seqviz',
            seq='ATCGATCG',
            name='Test Sequence'
        )
        print("✓ Successfully instantiated SeqViz component")

        # Test with all properties
        component_full = dash_seqviz.SeqViz(
            id='test-seqviz-full',
            seq='TTGACGGCTAGCTCAGTCCTAGGTACAGTGCTAGC',
            name='J23100',
            viewer='both',
            annotations=[
                {
                    'start': 0,
                    'end': 22,
                    'name': 'Strong promoter',
                    'direction': 1,
                    'color': 'blue'
                }
            ],
            primers=[
                {
                    'start': 0,
                    'end': 20,
                    'name': 'Forward Primer',
                    'direction': 1
                }
            ],
            highlights=[
                {
                    'start': 10,
                    'end': 30,
                    'color': 'yellow'
                }
            ],
            style={'height': '500px', 'width': '100%'}
        )
        print("✓ Successfully instantiated SeqViz component with all properties")
        return True
    except Exception as e:
        print(f"✗ Failed to instantiate SeqViz component: {e}")
        return False

def test_properties():
    """Test that component properties are set correctly."""
    try:
        import dash_seqviz

        component = dash_seqviz.SeqViz(
            id='test-properties',
            seq='ATCG',
            name='Test',
            viewer='linear'
        )

        # Check if properties are accessible
        assert hasattr(component, '_prop_names'), "Component should have _prop_names"
        print(f"✓ Component has {len(component._prop_names)} properties")

        # Check some key properties
        expected_props = ['id', 'seq', 'name', 'viewer', 'annotations']
        for prop in expected_props:
            assert prop in component._prop_names, f"Property {prop} should be in _prop_names"

        print("✓ All expected properties are present")
        return True
    except Exception as e:
        print(f"✗ Failed to verify component properties: {e}")
        return False

def test_snake_case_props_silent():
    """snake_case props should work without warnings."""
    import warnings
    import dash_seqviz

    with warnings.catch_warnings(record=True) as caught:
        warnings.simplefilter('always')
        dash_seqviz.SeqViz(
            seq='ATCG',
            bp_colors={'A': '#fff'},
            show_complement=False,
            rotate_on_scroll=False,
            disable_external_fonts=True,
            enable_copy_event=False,
            enable_select_all_event=False,
            search_results=[],
        )
        assert not caught, [str(w.message) for w in caught]
    print("✓ snake_case props are silent")
    return True


def test_camel_case_props_warn():
    """camelCase props should still work but emit DeprecationWarning."""
    import warnings
    import dash_seqviz

    deprecated_kwargs = {
        'bpColors': {'A': '#fff'},
        'showComplement': False,
        'rotateOnScroll': False,
        'disableExternalFonts': True,
        'enableCopyEvent': False,
        'enableSelectAllEvent': False,
        'searchResults': [],
    }
    with warnings.catch_warnings(record=True) as caught:
        warnings.simplefilter('always')
        dash_seqviz.SeqViz(seq='ATCG', **deprecated_kwargs)
        assert len(caught) == len(deprecated_kwargs), (
            f'expected {len(deprecated_kwargs)} warnings, got {len(caught)}'
        )
        assert all(issubclass(w.category, DeprecationWarning) for w in caught)
    print(f"✓ camelCase props emit {len(caught)} DeprecationWarnings")
    return True


def test_snake_case_wins_on_conflict():
    """When both snake_case and camelCase are passed, snake_case wins."""
    import warnings
    import dash_seqviz

    with warnings.catch_warnings():
        warnings.simplefilter('ignore', DeprecationWarning)
        c = dash_seqviz.SeqViz(seq='ATCG', showComplement=False, show_complement=True)
    assert c.show_complement is True
    print("✓ snake_case wins when both forms are passed")
    return True


if __name__ == '__main__':
    print("Running basic tests for dash-seqviz component...")
    print("=" * 50)

    tests = [
        test_import,
        test_instantiation,
        test_properties,
        test_snake_case_props_silent,
        test_camel_case_props_warn,
        test_snake_case_wins_on_conflict,
    ]

    passed = 0
    total = len(tests)

    for test in tests:
        if test():
            passed += 1
        print()

    print("=" * 50)
    print(f"Results: {passed}/{total} tests passed")

    if passed == total:
        print("🎉 All tests passed! The SeqViz Dash component is working correctly.")
        print("\nNote: To use the component in a full Dash app, you'll need to:")
        print("1. Install Node.js and npm")
        print("2. Run 'npm install' in the project directory")
        print("3. Build the component with 'npm run build'")
    else:
        print("❌ Some tests failed. Please check the error messages above.")
