/**
 * +----------------------------+
 * |      TabBarController      |
 * |       (rootWindow)         |
 * |   +--------------------+   |
 * |   |    contentView     |   |
 * |   |   +------------+   |   |
 * |   |   |  navGroup  |   |   |
 * |   |   +------------+   |   |
 * |   |   |            |   |   |
 * |   |   |  windows   |   |   |
 * |   |   |            |   |   |
 * |   |   +------------+   |   |
 * |   |                    |   |
 * |   +--------------------+   |
 * |   |     tabBarView     |   |
 * |   +--------------------+   |
 * |                            |
 * +----------------------------+
 */
function TabBarController() {
  var self            = {};
  var currentTabGroup = null;

  // App root window
  var rootWindow = Ti.UI.createWindow({backgroundColor: 'yellow'});

  // App tabbar container view, it contains all tabbars
  var tabBarView = Ti.UI.createScrollableView({
    bottom:           0,
    width:            '100%',
    height:           50,
    disableBounce:    true,
    backgroundColor:  'pink',
    zIndex:           10,
    scrollingEnabled: false
  });
  rootWindow.add(tabBarView);

  // App content container view, it contains the very first app window.
  var contentView = Ti.UI.createWindow({navBarHidden: true});

  // Main app navigation controller
  var nav = Ti.UI.iPhone.createNavigationGroup({
    window: contentView
  });
  rootWindow.add(nav); // add the navigation controller to the rootWindow
  rootWindow.open();   // and open the rootWindow to kick start everthing

  // The magic method, which deals with adding further windows
  self.open = function(window, options) {
    if (contentView.children.length == 0 && window.hasTabBar) {
      contentView.add(window.windowsView);   // Add all the tabs windows
      currentTabGroup   = window;            // Set currentTabGroup to this tab group
      tabBarView.height = window.tabBarView.height;
      tabBarView.addView(window.tabBarView);          // add the tabbar to rootWindow
    } else if (window.hasTabBar) {
      currentTabGroup.activeTab.navGroup.open(window.windowsView);
      tabBarView.addView(window.tabBarView);
      tabBarView.scrollToView(1);

      window.windowsView.addEventListener('close', function() {
        tabBarView.removeView(window.tabBarView);
      });
      
    } else {
      // Extract options
      options || (options = {});
      currentTabGroup.activeTab.navGroup.open(window);
      //nav.open(window, options);
    }
  };

  return self;
}

/**
 * +--------------+
 * |   TabView    |
 * |   +------+   |
 * |   | Tab  |   |
 * |   +------+   |
 * |              |
 * +--------------+
 */
function createTab(options) {
  // Extract options
  options || (options = {});

  var defaults = {
    width:         64,
    top:           0,
    bottom:        0,
    font:          {fontSize: 10, fontWeight: 'bold'},
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
  tabView.navGroup = Ti.UI.iPhone.createNavigationGroup({
    window: tabView.window,
    zIndex: 0,
    active: false
  });

  return tabView;
}

/**
 * +-----------------------------+
 * |         TabBarView          |
 * |   +------+-------+------+   |
 * |   | Tab  |  Tab  |  Tab |   |
 * |   +------+-------+------+   |
 * |                             |
 * +-----------------------------+
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
function createTabBar(options) {
  // Extract options
  options || (options = {});

  var defaults = {
    width:           '100%',
    height:          50,
    left:            0,
    right:           0,
    bottom:          0,
    backgroundImage: options.barImage || '#000',
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
  createTabGroup:   createTabBar,
  createTab:        createTab
};