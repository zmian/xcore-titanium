#xcore-titanium [![MIT License][license-image]][license-url]

A library that brings custom view modules and utilities to develop applications faster and efficiently using [Appcelerator Titanium](http://appcelerator.com/titanium).

## View Modules

A list of view modules included in xcore.

Module                        | Description
----------------------------- | -----------
xcore.UI.GridView             | Generic grid view. It should not be modified for each app. It was written to accommodate grid based layouts. It can be used to construct: Grid, Vertical, or Horizontal based scroll views. Simply think of it, like any other Titanium view. E.g., Ti.UI.createView
xcore.UI.CarouselView         | CarouselView wrapper function to create grid, vertical and horizontal carousels.
xcore.UI.CarouselViewCell     | A helper function to create `CarouselViewCell`.
xcore.UI.SwappableView        | A container view manages and presents its set of child views in a custom way.
xcore.UI.Slidr                | A module for easily creating harmonious magazine like presentations.
xcore.UI.RatingView           | A module for creating rating view.
xcore.UI.PickerView           | A module to create multiple columns picker.
xcore.UI.TableView            | A simple table view wrapper.
xcore.UI.TabBarController     | A module to create fully custom tabbar.
xcore.UI.createTabGroup       | A module to create fully custom tabbar.
xcore.UI.createTab            | A module to create fully custom tabbar.
xcore.UI.FlexView             | A module that extends `Ti.UI.View` to enable CSS-like properties.
xcore.UI.createBorderView     | A module for creating activity indicator.
xcore.UI.createButtonView     | A module for creating activity indicator.
xcore.UI.ActivityIndicator    | A module for creating activity indicator.

## Utilities

A list of utilities and helper functions included in xcore.

Module                        | Description
----------------------------- | -----------
xcore.Utilities               | A collection of resuable utilities
xcore.Exceptions              | A collection of custom exception classes written in JavaScript.
xcore.Console                 | Node.js and browser has it so, why not for Titanium.
xcore.Env                     | A module for easily detecting environment configurations.
xcore.Events                  | Proxy Titanium Events using jQuery like events API.
xcore.Request                 | A module for making HTTP requests.

## Creator

- [Zeeshan Mian](https://github.com/zmian) ([@zmian](https://twitter.com/zmian))

## License

xcore-titanium is released under the MIT license. See LICENSE for details.

[license-image]: http://img.shields.io/badge/license-MIT-blue.svg
[license-url]: LICENSE
