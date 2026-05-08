# Changelog

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
