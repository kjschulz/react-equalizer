'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Equalizer = function (_Component) {
  _inherits(Equalizer, _Component);

  function Equalizer() {
    _classCallCheck(this, Equalizer);

    var _this = _possibleConstructorReturn(this, (Equalizer.__proto__ || Object.getPrototypeOf(Equalizer)).call(this));

    _this.handleResize = debounce(_this.handleResize.bind(_this), 50);
    _this.updateChildrenHeights = _this.updateChildrenHeights.bind(_this);
    return _this;
  }

  _createClass(Equalizer, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.handleResize();
      addEventListener('resize', this.handleResize);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.rootNode = null;
      this.handleResize.clear();
      removeEventListener('resize', this.handleResize);
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this.handleResize();
    }
  }, {
    key: 'handleResize',
    value: function handleResize() {
      setTimeout(this.updateChildrenHeights, 0);
    }
  }, {
    key: 'updateChildrenHeights',
    value: function updateChildrenHeights() {
      var _props = this.props,
          property = _props.property,
          byRow = _props.byRow,
          byBsCol = _props.byBsCol,
          enabled = _props.enabled;

      var node = this.rootNode;

      if (!node || !enabled(this, node)) {
        return;
      }

      if (node !== undefined) {
        var children = this.props.nodes(this, node);
        var heights = this.constructor.getHeights(children, byRow, byBsCol);

        for (var row = 0; row < heights.length; row++) {
          var max = heights[row][heights[row].length - 1];

          for (var i = 0; i < heights[row].length - 1; i++) {
            heights[row][i][0].style[property] = max + 'px';
          }
        }
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props2 = this.props,
          children = _props2.children,
          property = _props2.property,
          byRow = _props2.byRow,
          byBsCol = _props2.byBsCol,
          enabled = _props2.enabled,
          nodes = _props2.nodes,
          otherProps = _objectWithoutProperties(_props2, ['children', 'property', 'byRow', 'byBsCol', 'enabled', 'nodes']);

      return _react2.default.createElement(
        'div',
        _extends({ ref: function ref(node) {
            return _this2.rootNode = node;
          }, onLoad: this.handleResize }, otherProps),
        children
      );
    }
  }], [{
    key: 'getHeights',
    value: function getHeights(nodes) {
      var byRow = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      var byBsCol = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      if (byBsCol) {
        byRow = false;
      }

      var lastElTopOffset = 0,
          groups = [],
          row = 0,
          rowColTotal = 0;

      groups[row] = [];

      for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];

        node.style.height = 'auto';
        node.style.maxHeight = '';
        node.style.minHeight = '';

        // http://ejohn.org/blog/getboundingclientrect-is-awesome/

        var _node$getBoundingClie = node.getBoundingClientRect(),
            elOffsetTop = _node$getBoundingClie.top,
            elHeight = _node$getBoundingClie.height;

        if (i === 0) {
          lastElTopOffset = elOffsetTop;
        }

        if (byBsCol) {
          var bsColSize = Number(node.className.split('col-md-')[1].slice(0, 2));

          if (rowColTotal >= 12) {
            row++;
            groups[row] = [];
            lastElTopOffset = elOffsetTop;
            rowColTotal = 0;
          }

          rowColTotal += bsColSize;
        } else if (elOffsetTop != lastElTopOffset && byRow) {
          row++;
          groups[row] = [];
          lastElTopOffset = elOffsetTop;
        }

        groups[row].push([node, elHeight]);
      }

      for (var j = 0; j < groups.length; j++) {
        var heights = groups[j].map(function (item) {
          return item[1];
        });
        var max = Math.max.apply(null, heights);
        groups[j].push(max);
      }

      return groups;
    }
  }]);

  return Equalizer;
}(_react.Component);

exports.default = Equalizer;


Equalizer.defaultProps = {
  property: 'height',
  byRow: true,
  byBsCol: false,
  enabled: function enabled() {
    return true;
  },
  nodes: function nodes(component, node) {
    return node.children;
  }
};

Equalizer.propTypes = {
  children: _react.PropTypes.node.isRequired,
  property: _react.PropTypes.string,
  byRow: _react.PropTypes.bool,
  byBsCol: _react.PropTypes.bool,
  enabled: _react.PropTypes.func,
  nodes: _react.PropTypes.func
};

// from: https://github.com/component/debounce
function debounce(func, wait, immediate) {
  var timeout, args, context, timestamp, result;
  if (null == wait) wait = 100;

  function later() {
    var last = Date.now() - timestamp;

    if (last < wait && last >= 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      if (!immediate) {
        result = func.apply(context, args);
        context = args = null;
      }
    }
  }

  var debounced = function debounced() {
    context = this;
    args = arguments;
    timestamp = Date.now();
    var callNow = immediate && !timeout;
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  };

  debounced.clear = function () {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  };

  return debounced;
}