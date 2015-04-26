var Slidr = require('ui/com.xcore.ui.slidr');

function IslandWindow() {
  var pageView = new PageView({
    title:          'Island',
    rightNavButton: new ShareButton(),
    body: {
      layout:         '',
      verticalBounce: false
    }
  });

  var slide1 = ui.view({backgroundColor: 'red'});
  var slide2 = ui.view({backgroundColor: 'blue'});
  var slide3 = ui.view({backgroundColor: 'green'});
  var slide4 = ui.view({backgroundColor: 'yellow'});
  var slide5 = ui.view({backgroundColor: 'orange'});

  var slide1_child1 = ui.view({backgroundColor: 'pink'});
  var slide1_child2 = ui.view({backgroundColor: 'purple'});

  var slide2_child1 = ui.view({backgroundColor: 'gray'});

  var slidr = new Slidr({slides: [slide1, slide2], debug: true});
  slidr.addSlide([slide3, slide4]);
  slidr.addSlide(slide5);
  slidr.addSlide([slide1_child1, slide1_child2], {parentIndex: 0});
  slidr.addSlide(slide2_child1, {parentIndex: 1});

  pageView.addModule(slidr);


// disable slide gesture on the view only allow to got next when tapping the sides
// wrap it inside container...
// dots should be bigger and father from the views
//
// wrap child views inside container tooo.... and give them classnames
// remove layout property and and can used the same createSlide function
// test if slide is given with 300 height it should be center unless user expilicly sets it...

  return pageView;
}

module.exports = IslandWindow;
