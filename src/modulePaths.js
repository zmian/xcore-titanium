var firstSeparator = (Ti.Platform.name === 'mobileweb') ? '' : '/';
var path           = firstSeparator + 'lib/xcore/';

exports = {
  // UIKit
  GridView:          path + 'gridView',
  CarouselView:      path + 'carouselView',
  SwappableView:     path + 'swappableView',
  Slidr:             path + 'modules/slidr/com.xcore.ui.slidr',
  RatingView:        path + 'ratingView',
  PickerView:        path + 'pickerView',
  TableView:         path + 'tableView',
  TabBar:            path + 'tabGroup',
  FlexView:          path + 'flexView',
  ActivityIndicator: path + 'activityIndicator',

  // Utilities
  Base:              path + 'base',
  Utilities:         path + 'utilities',
  Exceptions:        path + 'exceptions',
  Console:           path + 'console',
  Env:               path + 'modules/env/com.xcore.env',
  Events:            path + 'events',
  Request:           path + 'modules/request/com.xcore.request'
};
