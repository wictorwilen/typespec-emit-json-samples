
# Change Log
All notable changes to this project will be documented in this file.
 
The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [1.1.0] - 2025-04-06
 
### Added

- Added support for `setUndefinedToNull` in options. Defaults to true. If set to true all non-defined properties to null, otherwise omit from sample.
- Added new `fillArrays` that can be used to populate empty arrays of a type, even if the example decorator specifies an empty array (`[]`), defaults to false
- Added `arraySize` to specify the size of sample arrays
- Added `randomize` to opt-in or opt-out of random sample selection
 
### Changed

- Both `namespace` and `models` can either be of type `string` or `string[]`
- Random sample selection is no longer default
 
### Fixed

- Fixed issue with numeric and boolean values
 
## [1.0.0] - 2025-04-06
 
Initial release
 
### Added
 
### Changed
 
### Fixed
 