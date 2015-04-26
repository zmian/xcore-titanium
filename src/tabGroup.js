var IS_RETINA = (Ti.Platform.displayCaps.density === 'high');

/**
 * ┌────────────────────────────┐
 * |      TabBarController      |
 * |       (rootWindow)         |
 * |   ┌────────────────────┐   |
 * |   |    contentView     |   |
 * |   |   ┌────────────┐   |   |
 * |   |   |  navGroup  |   |   |
 * |   |   ├────────────┤   |   |
 * |   |   |            |   |   |
 * |   |   |  windows   |   |   |
 * |   |   |            |   |   |
 * |   |   └────────────┘   |   |
 * |   |                    |   |
 * |   ├────────────────────┤   |
 * |   |     tabBarView     |   |
 * |   └────────────────────┘   |
 * │                            |
 * └────────────────────────────┘
 * 
 * @todo
 *  - Add the ability to go back to parent tab if child tab is open and tab is clicked
 *  - Enable Android compatibility by using `NavigationController`
 * 
 * @issues
 *  - If current tab's nested page is half the width the other view is shown
 */
function TabBarController() {
  var self          = {};
  var tabGroupStack = []; // Stack of all open tabgroups

  // App root window
  var rootWindow = Ti.UI.createWindow();

  // App content container view, it contains the very first app window.
  var contentView = Ti.UI.createWindow({navBarHidden: true});

  // Main app navigation controller
  var nav = Ti.UI.iOS.createNavigationWindow({
    window: contentView
  });
  rootWindow.add(nav); // add the navigation controller to the rootWindow
  rootWindow.open();   // and open the rootWindow to kick start everthing

  // The magic method, which deals with
  // adding, removing, opening, and closing further tabgroups and windows
  self.open = function(window, options) {
    if (window.hasTabBar && ! window.differentStyleTabBars) {
      window.tabBarView.backgroundImage = 'transparent';
      window.tabBarView.backgroundColor = 'transparent';
    }

    // Main tabgroup (first tabgroup added to the app)
    if (contentView.children.length == 0 && window.hasTabBar) {
      tabGroupStack.push(window);
      contentView.add(window);

      // this keeps the background static and moves the tabs only
      // It provides navigation bar style transition between tabgroups.
      if (! window.differentStyleTabBars) {
        var tabBarView = Ti.UI.createView({
          bottom:           0,
          width:            '100%',
          height:           window.tabBarView.height,
          backgroundImage:  window.tabBarView.barImage,
          backgroundColor:  window.tabBarView.barColor,
          zIndex:           -10
        });
        rootWindow.add(tabBarView);
      }

    // Nested tabgroup(s)
    } else if (window.hasTabBar) {
      tabGroupStack.push(window);
      //contentView.navBarHidden = false;
      nav.open(window);

      // Set the back button manually
      // Ideally, we want this to be handled by navGroup. C'est la vie
      var backButton = ui.button({
        width:                   100,
        height:                  31,
        backgroundImage:         'images/back-button.png',
        backgroundSelectedImage: 'images/back-button-selected.png'
      });

      // Add back button to all children tabs
      for (var x = 0; x < window.tabs.length; x++) {
        var backButtonLabel = ui.label({
          text:         '➜',
          width:        50,
          textAlign:    'center',
          color:        '#7f7f7f',
          shadowColor:  '#8000',
          shadowOffset: {x: 0, y: -1},
          font:         {fontFamily: 'Rockwell', fontSize: 38},
          transform:    Ti.UI.create2DMatrix().rotate(180) // flip it to point towards proper direction
        });
        window.tabs[x].window.leftNavButton = backButtonLabel;
        
        //window.activeTab.window.leftNavButton = backButtonLabel;
        backButtonLabel.addEventListener('singletap', function() {
          nav.close(window);
          tabGroupStack.pop();
        });
      }
    } else {
      // Extract options
      options || (options = {});

      try {
        _.last(tabGroupStack).activeTab.navGroup.open(window);
      } catch(e) {
        Ti.API.error('xcore.UI module: TabBarController unable to open the requested window.');
      }
    }
  };

  return self;
}

/**
 * ┌─────────────────────────────┐
 * |         TabBarView          |
 * |   ┌──────┬───────┬──────┐   |
 * |   | Tab  |  Tab  |  Tab |   |
 * |   └──────┴───────┴──────┘   |
 * |                             |
 * └─────────────────────────────┘
 * 
 * @example
 *  var tabGroup = ui.createTabGroup({
 *    barImage: 'images/tabbar-bg.png',
 *    height:   50,
 *  });
 * 
 *  var featureWindow = ui.window({
 *    title:           'Feature'
 *    backgroundColor: 'blue',
 *  });
 * 
 *  var featureTab = ui.createTab({
 *      title:                   'Feature',
 *    color:                   '#fff',
 *    colorSelected:           '#333',
 *      icon:                    'images/tabbar-icon-feature.png',
 *      iconSelected:            'images/tabbar-icon-feature-selected.png',
 *    backgroundSelectedImage: 'images/tab-selected.png',
 *    backgroundSelectedColor: '#ff8000',
 *      window:                   new featureWindow()
 *  });
 * 
 *  tabGroup.addTab(featureTab);
 * 
 *  // Set active tab
 *  tabGroup.setActiveTab(featureTab);
 */
function createTabGroup(options) {
  // Extract options
  options || (options = {});

  var defaults = {
    width:           '100%',
    height:          50,
    left:            0,
    right:           0,
    bottom:          0,
    backgroundImage: options.barImage || 'transparent',
    backgroundColor: options.barColor || 'transparent'
  };

  var options = extend(defaults, options);

  var tabGroup         = Ti.UI.createWindow({hasTabBar: true});                       // TabGroup:    WindowsView and TabBarView
  tabGroup.windowsView = Ti.UI.createWindow({bottom: options.height});                // WindowsView: A container view that contains all the tabs windows
  tabGroup.tabBarView  = Ti.UI.createView(options);                                   // TabBarView:  The bar view and TabsView
  var tabsView         = Ti.UI.createView({layout: 'horizontal', width: Ti.UI.SIZE}); // TabsView:    A container view that contains all the tabs
  tabGroup.tabBarView.add(tabsView);

  tabGroup.add(tabGroup.windowsView);
  tabGroup.add(tabGroup.tabBarView);

  tabGroup.tabs        = [];                   // An array to keep track of all tabs and their properties
  tabGroup.activeTab   = null;                 // Variable to keep track of current active tab
  tabGroup.previousTab = null;                 // Variable to keep track of previous active tab

  var toggleTabUI = function(tab) {
    // swap the background images
    var tempBackgroundImage     = tab.backgroundImage;
    tab.backgroundImage         = tab.backgroundSelectedImage;
    tab.backgroundSelectedImage = tempBackgroundImage;
    
    // swap the title properties
    var tempColor               = tab.title.color;
    tab.title.color             = tab.title.colorSelected;
    tab.title.colorSelected     = tempColor;

    // swap the icon properties
    var tempIcon                = tab.icon.image;
    tab.icon.image              = tab.icon.imageSelected;
    tab.icon.imageSelected      = tempIcon;
  };

  /**
   * Wrapper function to add and remove tabs instances from `tabGroup.tabs`
   * http://developer.appcelerator.com/question/131454/commonjs-array-quirk
   */
  var tabs = {
    push: function(tab) {
      var temp = tabGroup.tabs;
      temp.push(tab);
      tabGroup.tabs = temp;
    },
    pop: function(tab) {
      var temp = tabGroup.tabs;
      temp.pop(tab);
      tabGroup.tabs = temp;
    }
  };

  tabGroup.addTab = function(tab) {
    tab.addEventListener('click', function(e) {
      tabGroup.setActiveTab(tab);
    });

    tabGroup.windowsView.add(tab.navGroup); // add the specified tab's windows to `windowsView`
    tabsView.add(tab);                        // add the specified tab to `tabsView`
    tabs.push(tab);                           // add the specified tab reference to `tabs` array
  };

  tabGroup.removeTab = function(tab) {
    tabGroup.windowsView.remove(tab.navGroup); // remove the specified tab's windows from `windowsView`
    tabsView.remove(tab);                        // remove the specified tab from `tabsView`
    tabs.pop(tab);                               // remove the specified tab reference from `tabs` array
  };

  tabGroup.setActiveTab = function(tab) {
    // if this tab is already active tab, don't do anything
    if (tab.active) return;

    // We're here and tab isn't active; toggle the ui to make it active
    tabGroup.previousTab = tabGroup.activeTab; // set the previous tab to current tab
    tabGroup.activeTab   = tab;                // set the current tab to the specified tab

    // make this window active
    toggleTabUI(tabGroup.activeTab);
    tabGroup.activeTab.navGroup.zIndex = 1;
    tabGroup.activeTab.navGroup.active = true;
    tabGroup.activeTab.active          = true;

    // close the previous window
    if (tabGroup.previousTab !== null) {
      toggleTabUI(tabGroup.previousTab);
      tabGroup.previousTab.navGroup.zIndex = 0;
      tabGroup.previousTab.navGroup.active = false;
      tabGroup.previousTab.active          = false;
    }
  };

    return tabGroup;
}

/**
 * ┌─────────────┐
 * |   TabView   |
 * |   ┌─────┐   |
 * |   | Tab |   |
 * |   └─────┘   |
 * |             |
 * └─────────────┘
 */
function createTab(options) {
  // Extract options
  options || (options = {});

  var defaults = {
    width:         64,
    top:           0,
    bottom:        0,
    font:          {fontSize: 10, fontWeight: IS_RETINA ? 'normal' : 'bold'},
    color:         '#fff',
    colorSelected: '#fff',
    icon:          'transparent',
    iconSelected:  'transparent',
    title:         'TITLE'
  };

  var options = extend(defaults, options);
  var tabView = Ti.UI.createView(options);

  tabView.icon = Ti.UI.createImageView({
    top:           6,
    image:         options.icon,
    imageSelected: options.iconSelected
  });
  tabView.add(tabView.icon);

  tabView.title = Ti.UI.createLabel({
    bottom:         1,
    text:           options.title,
    font:           options.font,
    color:          options.color,
    colorSelected:  options.colorSelected
  });
  tabView.add(tabView.title);

  tabView.active   = false; // not active tab
  tabView.navGroup = Ti.UI.iOS.createNavigationWindow({
    window: tabView.window,
    zIndex: 0,
    active: false
  });

  return tabView;
}

/**
 * Recursively merge properties of two objects
 * @author Markus
 * @url http://stackoverflow.com/questions/171251/how-can-i-merge-properties-of-two-javascript-objects-dynamically/#answer-383245
 */
function extend(obj1, obj2) {
  for (var p in obj2) {
    try {
      // Property in destination object set; update its value.
      if (obj2[p].constructor === Object) {
        obj1[p] = extend(obj1[p], obj2[p]);
      } else {
        obj1[p] = obj2[p];
      }
    } catch(e) {
      // Property in destination object not set; create it and set its value.
      obj1[p] = obj2[p];
    }
  }
  return obj1;
}

exports = {
  TabBarController: TabBarController,
  createTabGroup:   createTabGroup,
  createTab:        createTab
};