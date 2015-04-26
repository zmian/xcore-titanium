/**
 * @example
 *  var tableView = new TableView({
 *    data: countries
 *  });
 *  view.add(tableView);
 */
function TableView(options) {
  // Extract options
  options || (options = {});

  var tableView = Ti.UI.createTableView({
    objName:         'customTableView',
    separatorColor:  '#8cc3d6',
    backgroundColor: 'transparent'
  });

  var tableData = [];
  _.map(options.data, function(item, index) {
    var rowView = new TableViewRow({data: item});
    tableData.push(rowView);
  });

  tableView.setData(tableData);

  return tableView;
}

function TableViewRow(options) {
  // Extract options
  options || (options = {});
  options.padding = 20;

  var rowView = Ti.UI.createTableViewRow({
    className:      'customRowView',
    objName:        'customRowView',
    selectionStyle: Ti.UI.iPhone.TableViewCellSelectionStyle.NONE
  });

  // holds custom row view
  var view = Ti.UI.createView({
    width:  '95%',
    height: Ti.UI.SIZE,
    top:    options.padding
    //backgroundImage: 'images/bg-page.png'
  });
  rowView.add(view);
  
  view.addEventListener('touchstart', function(e) { view.backgroundColor = '#3000'; });
  view.addEventListener('touchend',   function(e) { view.backgroundColor = 'transparent'; });
  view.addEventListener('touchmove',  function(e) { view.backgroundColor = 'transparent'; });

  var image = Ti.UI.createImageView({
    backgroundImage: MediaUrlBuilder(options.data.image),
    width:  133,
    height: 133,
    top:    0,
    left:   0,
    borderRadius: 133 / 2,
    borderWidth:  10,
    borderColor: '#fff'
  });
  view.add(image);

  var rightColumn = Ti.UI.createView({
    layout: 'vertical',
    height: Ti.UI.SIZE,
    top:    0,
    left:   (image.width + options.padding)
  });
  view.add(rightColumn);

  var name = Ti.UI.createLabel({
    text:   options.data.name,
    left:   0,
    font:   {fontFamily: 'Rockwell Regular', fontSize: 22, fontWeight: 'bold'},
    color:  '#666666'
  });
  rightColumn.add(name);

  if (options.data.about) {
    var caption = Ti.UI.createLabel({
      text:   options.data.about,
      left:   0,
      font:   {fontFamily: 'Helvetica Neue', fontSize: 16},
      color:  '#666666'
    });
    rightColumn.add(caption);
  }

  var button = Ti.UI.createButton({
    title: 'Deals',
    backgroundImage: 'images/button-normal.png',
    width:           120,
    height:          35,
    top:             5,
    left:            0,
    bubbleParent:    false,
    font:            {fontFamily: 'Helvetica Neue', fontSize: 18},
    color:           '#fff',
    shadowColor:     'red',
    shadowOffset:    {x: 0, y: -1}
  });
  rightColumn.add(button);
  
  return rowView;
}

module.exports = TableView;
