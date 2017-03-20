  function divScrollBar(selector, config = {}) {

    var _container = $(selector).get(0);

    if (_container == undefined)
      return false;
    if ($(_container).find('.scrollBarContainer').length > 0)
      return false;

    _container.style.position = 'relative';

    this.objX = null;
    this.objY = null;
    this.config = config;

    this.getContainer = function() {
      return _container;
    }

  }

  divScrollBar.prototype.bindEventX = function(containerData) {
    if (this.objX == null)
      return false;
    var container = this.getContainer();

    //Transfer the slider to a DOM from the DOM array
    var slider = $(this.objX).find('div').get(0);

    //How long should the container move while the slider move 1px
    var ratio = (containerData.realWidth - containerData.displayWidth) / (containerData.displayWidth - slider.clientWidth);

    //Bind the mouse events
    var _self = this;
    var orignalX;
    $(slider).bind('mousedown', function(event) {
      var event = event || window.event;
      orignalX = event.clientX;
      $(document).bind('mousemove', function(event) {
        var event = event || window.event;
        var currentX = event.clientX;
        var deltaX = currentX - orignalX;
        orignalX = currentX;

        //Prevent the text selected
        event.preventDefault();

        //Reset the position of slider
        var newPosition = parseInt(slider.style.left) + deltaX;
        if (newPosition < 0)
          newPosition = 0;
        else if (newPosition > containerData.displayWidth - slider.clientWidth)
          newPosition = containerData.displayWidth - slider.clientWidth;
        slider.style.left = newPosition + 'px'

        //Reset the left padding of container
        var newPadding = $(container).scrollLeft() + (ratio * deltaX);
        if (newPadding < 0)
          newPadding = 0;
        else if (newPadding > containerData.realWidth - containerData.displayWidth)
          newPadding = containerData.realWidth - containerData.displayWidth;
        $(container).scrollLeft(newPadding);

        //Reset the position of scroll bar
        $(_self.objX).css('left', newPadding + 'px');
        if (_self.objY != null)
          $(_self.objY).css('right', (-newPadding) + 'px');

        //Unbind the events
        $(document).bind('mouseup', function() {
          $(this).unbind('mousemove')
        });
      });
    });
  }

  divScrollBar.prototype.bindEventY = function(containerData) {
    if (this.objY == null)
      return false;

    var container = this.getContainer();

    //Transfer the slider to a DOM from the DOM array
    var slider = $(this.objY).find('div').get(0);

    //How long should the container move while the slider move 1px
    var ratio = (containerData.realHeight - containerData.displayHeight) / (containerData.displayHeight - slider.clientHeight);

    //Bind the mouse events
    var _self = this;
    var orignalY;
    $(slider).bind('mousedown', function(event) {
      var event = event || window.event;
      orignalY = event.clientY;
      $(document).bind('mousemove', function(event) {
        var event = event || window.event;
        var currentY = event.clientY;
        var deltaY = currentY - orignalY;
        orignalY = currentY;

        //Prevent the text selected
        event.preventDefault();

        //Reset the position of slider
        var newPosition = parseInt(slider.style.top) + deltaY;
        if (newPosition < 0)
          newPosition = 0;
        else if (newPosition > containerData.displayHeight - slider.clientHeight)
          newPosition = containerData.displayHeight - slider.clientHeight;
        slider.style.top = newPosition + 'px'

        //Reset the left padding of container
        var newPadding = $(container).scrollTop() + (ratio * deltaY);
        if (newPadding < 0)
          newPadding = 0;
        else if (newPadding > containerData.realHeight - containerData.displayHeight)
          newPadding = containerData.realHeight - containerData.displayHeight;
        $(container).scrollTop(newPadding);

        //Reset the position of scroll bars

        $(_self.objY).css('top', newPadding + 'px');
        if (_self.objX != null)
          $(_self.objX).css('bottom', (-newPadding) + 'px');

        //Unbind the events
        $(document).bind('mouseup', function() {
          $(this).unbind('mousemove')
        });
      });
    });
  }

  divScrollBar.prototype.unbindEventX = function() {
    if (this.objX == null)
      return false;

    var slider = $(this.objX).find('div').get(0);
    $(slider).unbind('mousedown');

    $(this.getContainer()).scrollLeft(0);
    $(this.objX).css('left', 0);
    if (this.objY != null)
      $(this.objY).css('right', 0);
    slider.style.left = '0';
  }

  divScrollBar.prototype.unbindEventY = function() {
    if (this.objY == null)
      return false;
    var slider = $(this.objY).find('div').get(0);
    $(slider).unbind('mousedown');

    $(this.getContainer()).scrollTop(0);
    $(this.objY).css('top', 0);
    if (this.objX != null)
      $(this.objX).css('bottom', 0);
    slider.style.top = '0';
  }

  divScrollBar.prototype.drawX = function() {
    //Check existence
    if (this.objX != null)
      return false;

    //Draw the scroll bar and slider on the container
    var container = this.getContainer();
    var containerData = {
      paddingRight: $(container).css('paddingRight') ? parseInt($(container).css('paddingRight')) : 0,
      displayWidth: container.clientWidth
    }

    containerData.realWidth = container.scrollWidth + containerData.paddingRight;

    if (containerData.displayWidth / containerData.realWidth == 1 && this.config.alwaysShowX !== true)
      return false;

    var slider = $('<div></div>')
      .attr('class', 'slider')
      .css({
        position: 'relative',
        left: '0',
        width: containerData.displayWidth / containerData.realWidth * 100 + '%',
        height: (this.config.width || 12) + 'px',
        borderRadius: (this.config.borderRadius || 0) + 'px',
        background: this.config.color || '#999',
        cursor: 'pointer',
        opacity: this.config.opacity || 1,
      })
    var scrollBar = $('<div></div>')
      .css({
        position: 'absolute',
        bottom: '0',
        left: '0',
        width: containerData.displayWidth + 'px',
        height: (this.config.width || 12) + 'px',
        background: this.config.barColor || 'rgba(225, 225, 225, 0.5)',
      })
      .append(slider);
    this.objX = scrollBar;
    $(container).append(scrollBar);

    this.bindEventX(containerData);

    return this;
  }

  divScrollBar.prototype.drawY = function() {
    //Check existence
    if (this.objY != null)
      return false;

    //Draw the scroll bar and slider on the container
    var container = this.getContainer();

    var containerData = {
      realHeight: container.scrollHeight,
      displayHeight: container.clientHeight
    }

    if (containerData.displayHeight / containerData.realHeight == 1 && this.config.alwaysShowY !== true)
      return false;

    var slider = $('<div></div>')
      .attr('class', 'slider')
      .css({
        position: 'relative',
        top: '0',
        height: containerData.displayHeight / containerData.realHeight * 100 + '%',
        width: (this.config.width || 12) + 'px',
        borderRadius: (this.config.borderRadius || 0) + 'px',
        background: this.config.color || '#999',
        cursor: 'pointer',
        opacity: this.config.opacity || 1,
      })
    var scrollBar = $('<div></div>')
      .css({
        position: 'absolute',
        right: '0',
        top: '0',
        height: containerData.displayHeight + 'px',
        width: (this.config.width || 12) + 'px',
        background: this.config.barColor || 'rgba(225, 225, 225, 0.5)',
      })
      .append(slider);
    this.objY = scrollBar;
    $(container).append(scrollBar);

    this.bindEventY(containerData);

    return this;
  }

  divScrollBar.prototype.draw = function() {
    return this.drawX().drawY();
  }

  divScrollBar.prototype.updateX = function() {
    if (this.objX == null)
      return false;

    //Draw the scroll bar and slider on the container
    var container = this.getContainer();
    var containerData = {
      paddingRight: $(container).css('paddingRight') ? parseInt($(container).css('paddingRight')) : 0,
      displayWidth: container.clientWidth
    }

    containerData.realWidth = container.scrollWidth + containerData.paddingRight;

    if (containerData.displayWidth / containerData.realWidth == 1 && this.config.alwaysShowX !== true)
      $(this.ojbX).hide();
    else
      $(this.objX).show();

    $(this.objX).find('div').css({
      width: containerData.displayWidth / containerData.realWidth * 100 + '%',
    })
    $(this.objX).css({
      width: containerData.displayWidth + 'px',
    });

    this.unbindEventX();
    this.bindEventX(containerData);

    return this;
  }

  divScrollBar.prototype.updateY = function() {
    if (this.objY == null)
      return false;

    //Draw the scroll bar and slider on the container
    var container = this.getContainer();
    var containerData = {
      displayHeight: container.clientHeight,
      realHeight: container.scrollHeight
    }


    if (containerData.displayHeight / containerData.realHeight == 1 && this.config.alwaysShowY !== true)
      $(this.ojbY).hide();
    else
      $(this.objY).show();

    $(this.objY).find('div').css({
      height: containerData.displayHeight / containerData.realHeight * 100 + '%',
    })
    $(this.objY).css({
      height: containerData.displayHeight + 'px',
    });

    this.unbindEventY();
    this.bindEventY(containerData);

    return this;
  }

  divScrollBar.prototype.update = function() {
    return this.updateX().updateY();
  }
