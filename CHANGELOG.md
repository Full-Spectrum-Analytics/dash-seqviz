# Changelog

## [0.5.0](https://github.com/Full-Spectrum-Analytics/dash-seqviz/compare/v0.4.0...v0.5.0) (2026-07-15)


### Features

* built-in interactive (Plotly-style) legend for SeqViz ([#33](https://github.com/Full-Spectrum-Analytics/dash-seqviz/issues/33)) ([ee13a27](https://github.com/Full-Spectrum-Analytics/dash-seqviz/commit/ee13a277270e416575c5df9b8ecd2a95f02ca967))
* **seqviz:** legend in figure exports + theme-aware hover tooltip ([#36](https://github.com/Full-Spectrum-Analytics/dash-seqviz/issues/36)) ([9921d10](https://github.com/Full-Spectrum-Analytics/dash-seqviz/commit/9921d102880b0849d5253c0155f729dde8a59dee))
* **tooltip:** Plotly-style hover tooltips for annotations ([#34](https://github.com/Full-Spectrum-Analytics/dash-seqviz/issues/34)) ([ce4318b](https://github.com/Full-Spectrum-Analytics/dash-seqviz/commit/ce4318b3f7ec5b6759b9b15d84404dd94c529290))


### Bug Fixes

* **explorer:** restore NCBI GenBank annotation parsing; drop homepage install note ([401b6ec](https://github.com/Full-Spectrum-Analytics/dash-seqviz/commit/401b6ecf8afdfb29be035be8bbafb86fdd49b481))


### Documentation

* **index:** curate version badges (add conda-forge, drop npm) ([#31](https://github.com/Full-Spectrum-Analytics/dash-seqviz/issues/31)) ([bd26117](https://github.com/Full-Spectrum-Analytics/dash-seqviz/commit/bd2611707e367ff313a0d3fe99661e1d70e67669))

## [0.4.0](https://github.com/Full-Spectrum-Analytics/dash-seqviz/compare/v0.3.0...v0.4.0) (2026-07-13)


### Features

* add aria_label and accessible roles for screen readers (H1) ([75d7c51](https://github.com/Full-Spectrum-Analytics/dash-seqviz/commit/75d7c5140080f22b66ac2e4b35cbb9166a949113))
* add fetch_ncbi() to load NCBI accessions as SeqViz props ([4a52626](https://github.com/Full-Spectrum-Analytics/dash-seqviz/commit/4a5262694efa6c1215abec1a08e105677ae59ec6))
* add legend() companion for annotation color legends (E2) ([e53cdbd](https://github.com/Full-Spectrum-Analytics/dash-seqviz/commit/e53cdbdd4dbe0d79d8dcded1aec7694a55e23d58))
* add max_seq_length guard for very long sequences (F1) ([3644a0c](https://github.com/Full-Spectrum-Analytics/dash-seqviz/commit/3644a0cc50876078287ed3e6f474bd43863434b6))
* add parse() for FASTA/GenBank files to SeqViz props ([fc92654](https://github.com/Full-Spectrum-Analytics/dash-seqviz/commit/fc92654fa315175a346438479f625475ff5c2a0d))
* add read-only clicked_element prop for feature clicks (C1) ([91235d7](https://github.com/Full-Spectrum-Analytics/dash-seqviz/commit/91235d748dc99bd8b9cc40ce778814967d1f992b))
* add theme prop (dark mode, colorblind palettes, xkcd) ([42d2195](https://github.com/Full-Spectrum-Analytics/dash-seqviz/commit/42d2195adf17382781c726772e97df23a47e7471))
* add theme=auto to follow the page color scheme (E1) ([3c3f0ab](https://github.com/Full-Spectrum-Analytics/dash-seqviz/commit/3c3f0abb1719b29a5e4e5f20f60274c723fd5e87))
* add TypedDicts and validate_props() for SeqViz inputs ([1216d5e](https://github.com/Full-Spectrum-Analytics/dash-seqviz/commit/1216d5e637dbd023ceba21408682b244ba495d63))
* **examples:** add MLflow integration for logging SeqViz as a run artifact ([b664a21](https://github.com/Full-Spectrum-Analytics/dash-seqviz/commit/b664a21fd698e7e64e9017d6b80a1ba846bfbe47))
* export viewer as SVG/PNG via export_request/export_result (B1) ([ae23e79](https://github.com/Full-Spectrum-Analytics/dash-seqviz/commit/ae23e7943889844c12153ae5faaa271326bd79b8))
* **legend:** accept grouped input for a faceted legend ([587ccf6](https://github.com/Full-Spectrum-Analytics/dash-seqviz/commit/587ccf6342e907ec8dff7482288274d86c819a8f))
* promote MLflow example to dash_seqviz.integrations.mlflow ([db41c03](https://github.com/Full-Spectrum-Analytics/dash-seqviz/commit/db41c0388191e3dec8a29b5bb6b7cff921a51ef4))


### Documentation

* add component library roadmap ([8e2a5d5](https://github.com/Full-Spectrum-Analytics/dash-seqviz/commit/8e2a5d570b8a6a284f42965716eb57b891de7eb5))
* document Cloudflare Pages native Git integration for PR previews ([7801503](https://github.com/Full-Spectrum-Analytics/dash-seqviz/commit/78015039c6193b33183b158dee42797ad2e59f79))
* **examples:** add linked-selection recipes (DataTable/AgGrid, dash-bio) ([df575f3](https://github.com/Full-Spectrum-Analytics/dash-seqviz/commit/df575f314628b5437ba8debf1e12106946453578))
* **explorer:** 2x2 readouts, three-column bottom alignment; footer ([906fdb8](https://github.com/Full-Spectrum-Analytics/dash-seqviz/commit/906fdb8eb5c5b20acb8e321c519679d9fdbeea8c))
* **explorer:** allow native scroll of the linear sequence view ([7f69034](https://github.com/Full-Spectrum-Analytics/dash-seqviz/commit/7f69034a1cc16dd5dce796105fb65c146c80b9e9))
* **explorer:** demo max_seq_length guard, aria_label, primers/highlights toggles ([ca8ffed](https://github.com/Full-Spectrum-Analytics/dash-seqviz/commit/ca8ffed81f0b26235a88615d05c57268291e653b))
* **explorer:** pixel-align the canvas; single-row bar ([9fb31ce](https://github.com/Full-Spectrum-Analytics/dash-seqviz/commit/9fb31ce5c2e73569e153147cad888c27fc249120))
* **explorer:** viewer-centered 3-column layout + faceted legend ([6d16060](https://github.com/Full-Spectrum-Analytics/dash-seqviz/commit/6d160609a65f921f457f71023e7ad0823fd3099d))
* **explorer:** viewer-dominant layout + legend controls ([a807511](https://github.com/Full-Spectrum-Analytics/dash-seqviz/commit/a8075115dfa39a561902644efb653a3095448542))
* make demo Export SVG/PNG buttons download directly ([d4b694f](https://github.com/Full-Spectrum-Analytics/dash-seqviz/commit/d4b694fb89ed97f4993f91c04f79d5af1cd0841e))
* relayout explorer + integrations; conda-forge now available ([04692ae](https://github.com/Full-Spectrum-Analytics/dash-seqviz/commit/04692ae3ac64fb74f9366e15f4b2a370c8f0aa01))
* showcase roadmap features in usage.py demo ([7e96d33](https://github.com/Full-Spectrum-Analytics/dash-seqviz/commit/7e96d332738a4add26a3a3a10e2238b88fabe242))
* **site:** document roadmap features on the hosted docs site ([2ffd9a2](https://github.com/Full-Spectrum-Analytics/dash-seqviz/commit/2ffd9a2862e51f78ecbee9a34c60122227d5604a))
* **site:** explorer parity, 12-card home grid, Integrations page ([486e7e7](https://github.com/Full-Spectrum-Analytics/dash-seqviz/commit/486e7e7805bc995bc4f9564c8caf6380fe702a29))
* **site:** re-skin to Naturalist Press house style ([62a8c8f](https://github.com/Full-Spectrum-Analytics/dash-seqviz/commit/62a8c8f1f7b3701d652d11a3d23e70f9232b2ff3))
* **site:** tabbed install (pip/conda/mamba/pixi) + honest conda-forge status ([fe57cb3](https://github.com/Full-Spectrum-Analytics/dash-seqviz/commit/fe57cb398bd95691647adb855a05575e40f0d4f5))
* **site:** warmer, less-boxy visual redesign + mlflow_seqviz alias + xkcd reference note ([f1c6e54](https://github.com/Full-Spectrum-Analytics/dash-seqviz/commit/f1c6e545796fc2cf4785fc1e9842cb13ed3d2cbe))
* tidy root docs and add Cloudflare Pages PR-preview workflow ([fde5a2f](https://github.com/Full-Spectrum-Analytics/dash-seqviz/commit/fde5a2f04979db769fed7c7bc0e88de95e831e40))
* tighten explorer + home page UX ([#13](https://github.com/Full-Spectrum-Analytics/dash-seqviz/issues/13)) ([c8b18e9](https://github.com/Full-Spectrum-Analytics/dash-seqviz/commit/c8b18e9837235a6401919c65cf3ed5907464af06))
* use Cloudflare Pages native Git integration for PR previews ([d6b121e](https://github.com/Full-Spectrum-Analytics/dash-seqviz/commit/d6b121e2ea02421238bc5db9b9c7176419262b83))


### Continuous Integration

* add Cloudflare Workers static-assets config for docs previews ([4ade1be](https://github.com/Full-Spectrum-Analytics/dash-seqviz/commit/4ade1be487077ec10d8484525e34b0cea5b7792b))
* disable fail-fast so all matrix jobs report independently ([7981a94](https://github.com/Full-Spectrum-Analytics/dash-seqviz/commit/7981a9471067e07cf21366adff614d7e162a8cdc))
* install Python deps before build so dash-generate-components is available ([8648b2c](https://github.com/Full-Spectrum-Analytics/dash-seqviz/commit/8648b2ca2ec6e7c4a2be2b0ea08d3521323734b2))
* let Selenium Manager provision chromedriver (drop install-chromedriver) ([59caf40](https://github.com/Full-Spectrum-Analytics/dash-seqviz/commit/59caf40fd8031501a45cb7d96554115573829ea0))
* resolve selenium version conflict with dash[testing] ([143a8d9](https://github.com/Full-Spectrum-Analytics/dash-seqviz/commit/143a8d99e7b55c632c3d5be0cacac23d179b21b6))

## [0.3.0](https://github.com/Full-Spectrum-Analytics/dash-seqviz/compare/v0.2.2...v0.3.0) (2026-05-08)


### ⚠ BREAKING CHANGES

* camelCase prop names removed. Migrate to snake_case per the table above. Dash callbacks using `Input(..., "searchResults")` must update to `Input(..., "search_results")`.

### Features

* remove deprecated camelCase prop aliases ([#11](https://github.com/Full-Spectrum-Analytics/dash-seqviz/issues/11)) ([ea0e7e4](https://github.com/Full-Spectrum-Analytics/dash-seqviz/commit/ea0e7e441a8f84da303cd93903499b41af2cb004))


### Continuous Integration

* fix Trusted Publishing by dispatching publish.yml from release-please ([#9](https://github.com/Full-Spectrum-Analytics/dash-seqviz/issues/9)) ([8436697](https://github.com/Full-Spectrum-Analytics/dash-seqviz/commit/843669783419d88e96855327851033869beb672f))

## [0.2.2](https://github.com/Full-Spectrum-Analytics/dash-seqviz/compare/v0.2.1...v0.2.2) (2026-05-07)


### Features

* add snake_case prop aliases with deprecation warnings ([#7](https://github.com/Full-Spectrum-Analytics/dash-seqviz/issues/7)) ([95f74d3](https://github.com/Full-Spectrum-Analytics/dash-seqviz/commit/95f74d36ae49004e6c81203744934c5811b739c5))
