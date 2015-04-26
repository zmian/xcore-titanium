var xcoreModules = require('lib/xcore/modulePaths');

var xcore = {
  Base:                require(xcoreModules.Base),
  Utils:               require(xcoreModules.Utilities),
  Exceptions:          require(xcoreModules.Exceptions),
  Console:             require(xcoreModules.Console),
  Env:                 require(xcoreModules.Env),
  Events:              require(xcoreModules.Events),
  Request:             require(xcoreModules.Request),
  UI: {
    GridView:          require(xcoreModules.GridView),
    CarouselView:      require(xcoreModules.CarouselView).CarouselView,
    CarouselViewCell:  require(xcoreModules.CarouselView).CarouselViewCell,
    SwappableView:     require(xcoreModules.SwappableView),
    Slidr:             require(xcoreModules.Slidr),
    RatingView:        require(xcoreModules.RatingView),
    PickerView:        require(xcoreModules.PickerView),
    TableView:         require(xcoreModules.TableView),
    TabBarController:  require(xcoreModules.TabBar).TabBarController,
    createTabGroup:    require(xcoreModules.TabBar).createTabGroup,
    createTab:         require(xcoreModules.TabBar).createTab,

    // Experimental
    FlexView:          require(xcoreModules.FlexView).FlexView,
    createBorderView:  require(xcoreModules.FlexView).createBorderView,
    createButtonView:  require(xcoreModules.FlexView).createButtonView,
    ActivityIndicator: require(xcoreModules.ActivityIndicator),
  }
};

module.exports = xcore;
