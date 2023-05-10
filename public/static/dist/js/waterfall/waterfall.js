"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
/*
 ReactJS code for the Waterfall page. Grid calls the Variant class for each distro, and the Variant class renders each build variant for every version that exists. In each build variant we iterate through all the tasks and render them as well. The row of headers is just a placeholder at the moment.
*/

// React doesn't provide own functionality for making http calls
// window.fetch doesn't handle query params
var http = angular.bootstrap().get('$http');

// Returns string from datetime object in "5/7/96 1:15 AM" format
// Used to display version headers
function getFormattedTime(input, userTz, fmt) {
  return moment(input).tz(userTz).format(fmt);
}
function gitTagsMessage(git_tags) {
  if (!git_tags || git_tags === "") {
    return "";
  }
  return "Git Tags: " + git_tags + "";
}
function generateURLParameters(params) {
  var ret = [];
  for (var p in params) {
    ret.push(encodeURIComponent(p) + "=" + encodeURIComponent(params[p]));
  }
  return ret.join("&");
}

// getParameterByName returns the value associated with a given query parameter.
// Based on: http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
function getParameterByName(name, url) {
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
  var results = regex.exec(url);
  if (!results) {
    return null;
  }
  if (!results[2]) {
    return '';
  }
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}
function updateURLParams(bvFilter, taskFilter, skip, baseURL, showUpstream) {
  var params = {};
  if (bvFilter && bvFilter != '') params["bv_filter"] = bvFilter;
  if (taskFilter && taskFilter != '') params["task_filter"] = taskFilter;
  if (skip !== 0) {
    params["skip"] = skip;
  }
  if (showUpstream !== undefined) {
    params["upstream"] = showUpstream;
  }
  if (Object.keys(params).length > 0) {
    var paramString = generateURLParameters(params);
    window.history.replaceState({}, '', baseURL + "?" + paramString);
  } else {
    window.history.replaceState({}, '', baseURL);
  }
}
var JIRA_REGEX = /[A-Z]{1,10}-\d{1,6}/ig;
var JiraLink = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(JiraLink, _React$PureComponent);
  var _super = _createSuper(JiraLink);
  function JiraLink() {
    _classCallCheck(this, JiraLink);
    return _super.apply(this, arguments);
  }
  _createClass(JiraLink, [{
    key: "render",
    value: function render() {
      var contents;
      if (_.isString(this.props.children)) {
        var tokens = this.props.children.split(/\s/);
        var jiraHost = this.props.jiraHost;
        contents = _.map(tokens, function (token, i) {
          var hasSpace = i !== tokens.length - 1;
          var maybeSpace = hasSpace ? ' ' : '';
          var capture = '';
          if (capture = token.match(JIRA_REGEX)) {
            var jiraLink = "https://" + jiraHost + "/browse/" + capture;
            return /*#__PURE__*/React.createElement("a", {
              href: jiraLink
            }, token + maybeSpace);
          } else {
            return token + maybeSpace;
          }
        });
      } else {
        return null;
      }
      return /*#__PURE__*/React.createElement("div", null, contents);
    }
  }]);
  return JiraLink;
}(React.PureComponent); // The Root class renders all components on the waterfall page, including the grid view and the filter and new page buttons
// The one exception is the header, which is written in Angular and managed by menu.html
var Root = /*#__PURE__*/function (_React$PureComponent2) {
  _inherits(Root, _React$PureComponent2);
  var _super2 = _createSuper(Root);
  function Root(props) {
    var _this;
    _classCallCheck(this, Root);
    _this = _super2.call(this, props);
    var href = window.location.href;
    var buildVariantFilter = getParameterByName('bv_filter', href) || '';
    var taskFilter = getParameterByName('task_filter', href) || '';
    var collapsed = localStorage.getItem("collapsed") == "true";
    var showUpstream = localStorage.getItem("show_upstream") == "true";
    _this.state = {
      collapsed: collapsed,
      shortenCommitMessage: true,
      buildVariantFilter: buildVariantFilter,
      taskFilter: taskFilter,
      showUpstream: showUpstream,
      data: null
    };
    _this.nextSkip = getParameterByName('skip', href) || 0;
    _this.baseURL = "/waterfall/" + _this.props.project;

    // Handle state for a collapsed view, as well as shortened header commit messages
    _this.handleCollapseChange = _this.handleCollapseChange.bind(_assertThisInitialized(_this));
    _this.onToggleShowUpstream = _this.onToggleShowUpstream.bind(_assertThisInitialized(_this));
    _this.handleHeaderLinkClick = _this.handleHeaderLinkClick.bind(_assertThisInitialized(_this));
    _this.handleBuildVariantFilter = _this.handleBuildVariantFilter.bind(_assertThisInitialized(_this));
    _this.handleTaskFilter = _this.handleTaskFilter.bind(_assertThisInitialized(_this));
    _this.loadDataPortion = _this.loadDataPortion.bind(_assertThisInitialized(_this));
    _this.loadDataPortion();
    _this.loadDataPortion = _.debounce(_this.loadDataPortion, 1000);
    _this.loadData = _this.loadData.bind(_assertThisInitialized(_this));
    return _this;
  }
  _createClass(Root, [{
    key: "updatePaginationContext",
    value: function updatePaginationContext(data) {
      // Initialize newer|older buttons
      var versionsOnPage = _.reduce(data.versions, function (m, d) {
        return m + d.authors.length;
      }, 0);
      this.currentSkip = data.current_skip;
      this.nextSkip = this.currentSkip + versionsOnPage;
      this.prevSkip = this.currentSkip - data.previous_page_count;
      if (this.nextSkip >= data.total_versions) {
        this.nextSkip = -1;
      }
      if (this.currentSkip <= 0) {
        this.prevSkip = -1;
      }
    }
  }, {
    key: "loadData",
    value: function loadData(direction) {
      var skip = direction === -1 ? this.prevSkip : this.nextSkip;
      this.loadDataPortion(undefined, skip);
    }
  }, {
    key: "loadDataPortion",
    value: function loadDataPortion(filter, skip) {
      var _this2 = this;
      var params = {
        skip: skip === undefined ? this.nextSkip : skip
      };
      if (this.state.buildVariantFilter) {
        params.bv_filter = this.state.buildVariantFilter;
      }
      if (filter !== undefined && filter !== this.state.buildVariantFilter) {
        params.bv_filter = filter;
        params.skip = 0;
      }
      if (this.state.showUpstream) {
        params.upstream = true;
      }
      if (params.skip === -1) {
        delete params.skip;
      }
      this.setState({
        data: null
      });
      http.get("/rest/v1/waterfall/".concat(this.props.project), {
        params: params
      }).then(function (_ref) {
        var data = _ref.data;
        _this2.updatePaginationContext(data);
        _this2.setState({
          data: data,
          nextSkip: _this2.nextSkip + data.versions.length
        });
        updateURLParams(params.bv_filter, _this2.state.taskFilter, _this2.currentSkip, _this2.baseURL);
      });
    }
  }, {
    key: "handleCollapseChange",
    value: function handleCollapseChange(collapsed) {
      localStorage.setItem("collapsed", collapsed);
      this.setState({
        collapsed: collapsed
      });
    }
  }, {
    key: "handleBuildVariantFilter",
    value: function handleBuildVariantFilter(filter) {
      this.loadDataPortion(filter, this.currentSkip);
      updateURLParams(filter, this.state.taskFilter, this.currentSkip, this.baseURL);
      this.setState({
        buildVariantFilter: filter
      });
    }
  }, {
    key: "handleTaskFilter",
    value: function handleTaskFilter(filter) {
      updateURLParams(this.state.buildVariantFilter, filter, this.currentSkip, this.baseURL);
      this.setState({
        taskFilter: filter
      });
    }
  }, {
    key: "handleHeaderLinkClick",
    value: function handleHeaderLinkClick(shortenMessage) {
      this.setState({
        shortenCommitMessage: !shortenMessage
      });
    }
  }, {
    key: "onToggleShowUpstream",
    value: function onToggleShowUpstream() {
      var showUpstream = !this.state.showUpstream;
      this.loadDataPortion(this.state.buildVariantFilter, this.currentSkip);
      localStorage.setItem("show_upstream", showUpstream);
      updateURLParams(this.state.buildVariantFilter, this.state.taskFilter, this.currentSkip, this.baseURL, showUpstream);
      this.setState({
        showUpstream: showUpstream
      });
    }
  }, {
    key: "render",
    value: function render() {
      if (this.state.data && this.state.data.rows.length == 0) {
        return /*#__PURE__*/React.createElement("div", null, "There are no builds for this project.");
      }
      var collapseInfo = {
        collapsed: this.state.collapsed,
        activeTaskStatuses: ['failed', 'system-failed']
      };
      return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Toolbar, {
        collapsed: this.state.collapsed,
        onCheckCollapsed: this.handleCollapseChange,
        baseURL: this.baseURL,
        nextSkip: this.nextSkip,
        prevSkip: this.prevSkip,
        buildVariantFilter: this.state.buildVariantFilter,
        taskFilter: this.state.taskFilter,
        buildVariantFilterFunc: this.handleBuildVariantFilter,
        taskFilterFunc: this.handleTaskFilter,
        isLoggedIn: this.props.user !== null,
        project: this.props.project,
        disabled: false,
        loadData: this.loadData,
        onToggleShowUpstream: this.onToggleShowUpstream,
        showUpstream: this.state.showUpstream
      }), /*#__PURE__*/React.createElement(Headers, {
        shortenCommitMessage: this.state.shortenCommitMessage,
        versions: this.state.data === null ? null : this.state.data.versions,
        onLinkClick: this.handleHeaderLinkClick,
        userTz: this.props.userTz,
        jiraHost: this.props.jiraHost
      }), /*#__PURE__*/React.createElement(Grid, {
        data: this.state.data,
        collapseInfo: collapseInfo,
        project: this.props.project,
        buildVariantFilter: this.state.buildVariantFilter,
        taskFilter: this.state.taskFilter
      }));
    }
  }]);
  return Root;
}(React.PureComponent); // Toolbar
function Toolbar(_ref2) {
  var collapsed = _ref2.collapsed,
    onCheckCollapsed = _ref2.onCheckCollapsed,
    baseURL = _ref2.baseURL,
    nextSkip = _ref2.nextSkip,
    prevSkip = _ref2.prevSkip,
    buildVariantFilter = _ref2.buildVariantFilter,
    taskFilter = _ref2.taskFilter,
    buildVariantFilterFunc = _ref2.buildVariantFilterFunc,
    taskFilterFunc = _ref2.taskFilterFunc,
    isLoggedIn = _ref2.isLoggedIn,
    project = _ref2.project,
    disabled = _ref2.disabled,
    loadData = _ref2.loadData,
    showUpstream = _ref2.showUpstream,
    onToggleShowUpstream = _ref2.onToggleShowUpstream;
  var Form = ReactBootstrap.Form;
  return /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-xs-12"
  }, /*#__PURE__*/React.createElement(Form, {
    inline: true,
    className: "waterfall-toolbar pull-right"
  }, /*#__PURE__*/React.createElement(CollapseButton, {
    collapsed: collapsed,
    onCheckCollapsed: onCheckCollapsed,
    disabled: disabled
  }), /*#__PURE__*/React.createElement(FilterBox, {
    filterFunction: buildVariantFilterFunc,
    placeholder: "Filter variant",
    currentFilter: buildVariantFilter,
    disabled: disabled
  }), /*#__PURE__*/React.createElement(FilterBox, {
    filterFunction: taskFilterFunc,
    placeholder: "Filter task",
    currentFilter: taskFilter,
    disabled: collapsed || disabled
  }), /*#__PURE__*/React.createElement(PageButtons, {
    nextSkip: nextSkip,
    prevSkip: prevSkip,
    baseURL: baseURL,
    buildVariantFilter: buildVariantFilter,
    taskFilter: taskFilter,
    disabled: disabled,
    loadData: loadData
  }), /*#__PURE__*/React.createElement(GearMenu, {
    project: project,
    isLoggedIn: isLoggedIn,
    showUpstream: showUpstream,
    onToggleShowUpstream: onToggleShowUpstream
  }))));
}
;
var PageButtons = /*#__PURE__*/function (_React$PureComponent3) {
  _inherits(PageButtons, _React$PureComponent3);
  var _super3 = _createSuper(PageButtons);
  function PageButtons(props) {
    var _this3;
    _classCallCheck(this, PageButtons);
    _this3 = _super3.call(this, props);
    _this3.loadNext = function () {
      return _this3.props.loadData(1);
    };
    _this3.loadPrev = function () {
      return _this3.props.loadData(-1);
    };
    return _this3;
  }
  _createClass(PageButtons, [{
    key: "render",
    value: function render() {
      var ButtonGroup = ReactBootstrap.ButtonGroup;
      return /*#__PURE__*/React.createElement("span", {
        className: "waterfall-form-item"
      }, /*#__PURE__*/React.createElement(ButtonGroup, null, /*#__PURE__*/React.createElement(PageButton, {
        disabled: this.props.disabled || this.props.prevSkip < 0,
        directionIcon: "fa-chevron-left",
        loadData: this.loadPrev
      }), /*#__PURE__*/React.createElement(PageButton, {
        disabled: this.props.disabled || this.props.nextSkip < 0,
        directionIcon: "fa-chevron-right",
        loadData: this.loadNext
      })));
    }
  }]);
  return PageButtons;
}(React.PureComponent);
function PageButton(_ref3) {
  var directionIcon = _ref3.directionIcon,
    disabled = _ref3.disabled,
    loadData = _ref3.loadData;
  var Button = ReactBootstrap.Button;
  var classes = "fa " + directionIcon;
  return /*#__PURE__*/React.createElement(Button, {
    onClick: loadData,
    disabled: disabled
  }, /*#__PURE__*/React.createElement("i", {
    className: classes
  }));
}
var FilterBox = /*#__PURE__*/function (_React$PureComponent4) {
  _inherits(FilterBox, _React$PureComponent4);
  var _super4 = _createSuper(FilterBox);
  function FilterBox(props) {
    var _this4;
    _classCallCheck(this, FilterBox);
    _this4 = _super4.call(this, props);
    _this4.applyFilter = _this4.applyFilter.bind(_assertThisInitialized(_this4));
    return _this4;
  }
  _createClass(FilterBox, [{
    key: "applyFilter",
    value: function applyFilter() {
      this.props.filterFunction(this.refs.searchInput.value);
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/React.createElement("input", {
        type: "text",
        ref: "searchInput",
        className: "form-control waterfall-form-item",
        placeholder: this.props.placeholder,
        value: this.props.currentFilter,
        onChange: this.applyFilter,
        disabled: this.props.disabled
      });
    }
  }]);
  return FilterBox;
}(React.PureComponent);
var CollapseButton = /*#__PURE__*/function (_React$PureComponent5) {
  _inherits(CollapseButton, _React$PureComponent5);
  var _super5 = _createSuper(CollapseButton);
  function CollapseButton(props) {
    var _this5;
    _classCallCheck(this, CollapseButton);
    _this5 = _super5.call(this, props);
    _this5.handleChange = _this5.handleChange.bind(_assertThisInitialized(_this5));
    return _this5;
  }
  _createClass(CollapseButton, [{
    key: "handleChange",
    value: function handleChange(event) {
      this.props.onCheckCollapsed(this.refs.collapsedBuilds.checked);
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/React.createElement("span", {
        className: "semi-muted waterfall-form-item"
      }, /*#__PURE__*/React.createElement("span", {
        id: "collapsed-prompt"
      }, "Show collapsed view"), /*#__PURE__*/React.createElement("input", {
        className: "checkbox waterfall-checkbox",
        type: "checkbox",
        checked: this.props.collapsed,
        ref: "collapsedBuilds",
        onChange: this.handleChange,
        disabled: this.props.disabled
      }));
    }
  }]);
  return CollapseButton;
}(React.PureComponent);
var GearMenu = /*#__PURE__*/function (_React$PureComponent6) {
  _inherits(GearMenu, _React$PureComponent6);
  var _super6 = _createSuper(GearMenu);
  function GearMenu(props) {
    var _this6;
    _classCallCheck(this, GearMenu);
    _this6 = _super6.call(this, props);
    _this6.addNotification = _this6.addNotification.bind(_assertThisInitialized(_this6));
    var requesterSubscriberSettings = {
      text: "Build initiator",
      key: "requester",
      type: "select",
      options: {
        "gitter_request": "Commit",
        "patch_request": "Patch",
        "github_pull_request": "Pull Request",
        "merge_test": "Commit Queue",
        "ad_hoc": "Periodic Build"
      },
      "default": "gitter_request"
    };
    _this6.triggers = [{
      trigger: "outcome",
      resource_type: "TASK",
      label: "any task finishes",
      regex_selectors: taskRegexSelectors(),
      extraFields: [requesterSubscriberSettings]
    }, {
      trigger: "failure",
      resource_type: "TASK",
      label: "any task fails",
      regex_selectors: taskRegexSelectors(),
      extraFields: [{
        text: "Failure type",
        key: "failure-type",
        type: "select",
        options: {
          "any": "Any",
          "test": "Test",
          "system": "System",
          "setup": "Setup"
        },
        "default": "any"
      }, requesterSubscriberSettings]
    }, {
      trigger: "success",
      resource_type: "TASK",
      label: "any task succeeds",
      regex_selectors: taskRegexSelectors(),
      extraFields: [requesterSubscriberSettings]
    }, {
      trigger: "exceeds-duration",
      resource_type: "TASK",
      label: "the runtime for any task exceeds some duration",
      extraFields: [{
        text: "Task duration (seconds)",
        key: "task-duration-secs",
        validator: validateDuration
      }],
      regex_selectors: taskRegexSelectors()
    }, {
      trigger: "runtime-change",
      resource_type: "TASK",
      label: "the runtime for a successful task changes by some percentage",
      extraFields: [{
        text: "Percent change",
        key: "task-percent-change",
        validator: validatePercentage
      }],
      regex_selectors: taskRegexSelectors()
    }, {
      trigger: "outcome",
      resource_type: "BUILD",
      label: "a build-variant in any version finishes",
      regex_selectors: buildRegexSelectors(),
      extraFields: [requesterSubscriberSettings]
    }, {
      trigger: "failure",
      resource_type: "BUILD",
      label: "a build-variant in any version fails",
      regex_selectors: buildRegexSelectors(),
      extraFields: [requesterSubscriberSettings]
    }, {
      trigger: "success",
      resource_type: "BUILD",
      label: "a build-variant in any version succeeds",
      regex_selectors: buildRegexSelectors(),
      extraFields: [requesterSubscriberSettings]
    }, {
      trigger: "outcome",
      resource_type: "VERSION",
      label: "any version finishes",
      extraFields: [requesterSubscriberSettings]
    }, {
      trigger: "failure",
      resource_type: "VERSION",
      label: "any version fails",
      extraFields: [requesterSubscriberSettings]
    }, {
      trigger: "success",
      resource_type: "VERSION",
      label: "any version succeeds",
      extraFields: [requesterSubscriberSettings]
    }];
    return _this6;
  }
  _createClass(GearMenu, [{
    key: "dialog",
    value: function dialog($mdDialog, $mdToast, notificationService, mciSubscriptionsService) {
      var _omitMethods;
      var omitMethods = (_omitMethods = {}, _defineProperty(_omitMethods, SUBSCRIPTION_JIRA_ISSUE, true), _defineProperty(_omitMethods, SUBSCRIPTION_EVERGREEN_WEBHOOK, true), _omitMethods);
      var self = this;
      var promise = addSubscriber($mdDialog, this.triggers, omitMethods);
      return $mdDialog.show(promise).then(function (data) {
        addProjectSelectors(data, self.project);
        var success = function success() {
          return $mdToast.show({
            templateUrl: "/static/partials/subscription_confirmation_toast.html",
            position: "bottom right"
          });
        };
        var failure = function failure(resp) {
          notificationService.pushNotification('Error saving subscriptions: ' + resp.data.error, 'errorHeader');
        };
        mciSubscriptionsService.post([data], {
          success: success,
          error: failure
        });
      })["catch"](function (e) {
        notificationService.pushNotification('Error saving subscriptions: ' + e, 'errorHeader');
      });
    }
  }, {
    key: "addNotification",
    value: function addNotification() {
      var waterfall = angular.module('waterfall', ['ng', 'MCI', 'material.components.toast']);
      waterfall.provider({
        $rootElement: function $rootElement() {
          this.$get = function () {
            var root = document.getElementById("root");
            return angular.element(root);
          };
        }
      });
      var injector = angular.injector(['waterfall']);
      return injector.invoke(this.dialog, {
        triggers: this.triggers,
        project: this.props.project
      });
    }
  }, {
    key: "render",
    value: function render() {
      if (!this.props.isLoggedIn) {
        return null;
      }
      var ButtonGroup = ReactBootstrap.ButtonGroup;
      var Button = ReactBootstrap.Button;
      var DropdownButton = ReactBootstrap.DropdownButton;
      var MenuItem = ReactBootstrap.MenuItem;
      return /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(DropdownButton, {
        className: "fa fa-gear",
        pullRight: true,
        id: "waterfall-gear-menu"
      }, /*#__PURE__*/React.createElement(MenuItem, {
        onClick: this.addNotification
      }, "Add Notification"), /*#__PURE__*/React.createElement(MenuItem, {
        onClick: this.props.onToggleShowUpstream
      }, this.props.showUpstream ? "Hide Upstream Commits" : "Show Upstream Commits")));
    }
  }]);
  return GearMenu;
}(React.PureComponent);
;

// Headers

function Headers(_ref4) {
  var shortenCommitMessage = _ref4.shortenCommitMessage,
    versions = _ref4.versions,
    onLinkClick = _ref4.onLinkClick,
    userTz = _ref4.userTz,
    jiraHost = _ref4.jiraHost;
  if (versions === null) {
    return /*#__PURE__*/React.createElement(VersionHeaderTombstone, null);
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "row version-header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "variant-col col-xs-2 version-header-rolled"
  }), /*#__PURE__*/React.createElement("div", {
    className: "col-xs-10"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, versions.map(function (version) {
    if (version.rolled_up) {
      return /*#__PURE__*/React.createElement(RolledUpVersionHeader, {
        key: version.ids[0],
        version: version,
        userTz: userTz,
        jiraHost: jiraHost
      });
    }
    // Unrolled up version, no popover
    return /*#__PURE__*/React.createElement(ActiveVersionHeader, {
      key: version.ids[0],
      version: version,
      userTz: userTz,
      shortenCommitMessage: shortenCommitMessage,
      onLinkClick: onLinkClick,
      jiraHost: jiraHost
    });
  }))));
}
function VersionHeaderTombstone() {
  return /*#__PURE__*/React.createElement("div", {
    className: "row version-header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "variant-col col-xs-2 version-header-rolled"
  }), /*#__PURE__*/React.createElement("div", {
    className: "col-xs-10"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "header-col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "version-header-expanded"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-xs-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "waterfall-tombstone",
    style: {
      'height': '14px',
      'width': '126px'
    }
  }, "\xA0"))), /*#__PURE__*/React.createElement("div", {
    className: "col-xs-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "waterfall-tombstone",
    style: {
      'marginTop': '5px',
      'height': '14px',
      'width': '78px'
    }
  }, "\xA0"), /*#__PURE__*/React.createElement("div", {
    className: "waterfall-tombstone",
    style: {
      'marginTop': '5px',
      'height': '14px',
      'width': '205px'
    }
  }, "\xA0"))))))));
}
function ActiveVersionHeader(_ref5) {
  var shortenCommitMessage = _ref5.shortenCommitMessage,
    version = _ref5.version,
    onLinkClick = _ref5.onLinkClick,
    userTz = _ref5.userTz,
    jiraHost = _ref5.jiraHost;
  var message = version.messages[0];
  var author = version.authors[0];
  var id_link = "/version/" + version.ids[0];
  var commit = version.revisions[0].substring(0, 5);
  var tags = gitTagsMessage(version.git_tags[0]);
  if (version.upstream_data) {
    var upstreamData = version.upstream_data[0];
    var upstreamLink = "/" + upstreamData.trigger_type + "/" + upstreamData.trigger_id;
    var upstreamAnchor = /*#__PURE__*/React.createElement("a", {
      href: upstreamLink
    }, upstreamData.project_name);
    var upstreamElem = /*#__PURE__*/React.createElement("div", {
      className: "row"
    }, " From ", upstreamAnchor, " ");
  }
  var formatted_time = getFormattedTime(version.create_times[0], userTz, 'M/D/YY h:mm A');
  var maxChars = 44;
  var button;
  if (message.length > maxChars) {
    // If we shorten the commit message, only display the first maxChars chars
    if (shortenCommitMessage) {
      message = message.substring(0, maxChars - 3) + "...";
    }
    button = /*#__PURE__*/React.createElement(HideHeaderButton, {
      onLinkClick: onLinkClick,
      shortenCommitMessage: shortenCommitMessage
    });
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "header-col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "version-header-expanded"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-xs-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("a", {
    className: "githash",
    href: id_link
  }, commit), formatted_time), upstreamElem), /*#__PURE__*/React.createElement("div", {
    className: "col-xs-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("strong", null, author), " - ", /*#__PURE__*/React.createElement(JiraLink, {
    jiraHost: jiraHost
  }, message), button, /*#__PURE__*/React.createElement("div", null, tags)))));
}
;
var HideHeaderButton = /*#__PURE__*/function (_React$Component) {
  _inherits(HideHeaderButton, _React$Component);
  var _super7 = _createSuper(HideHeaderButton);
  function HideHeaderButton(props) {
    var _this7;
    _classCallCheck(this, HideHeaderButton);
    _this7 = _super7.call(this, props);
    _this7.onLinkClick = _this7.onLinkClick.bind(_assertThisInitialized(_this7));
    return _this7;
  }
  _createClass(HideHeaderButton, [{
    key: "onLinkClick",
    value: function onLinkClick(event) {
      this.props.onLinkClick(this.props.shortenCommitMessage);
    }
  }, {
    key: "render",
    value: function render() {
      var textToShow = this.props.shortenCommitMessage ? "more" : "less";
      return /*#__PURE__*/React.createElement("span", {
        onClick: this.onLinkClick
      }, " ", /*#__PURE__*/React.createElement("a", {
        href: "#"
      }, textToShow), " ");
    }
  }]);
  return HideHeaderButton;
}(React.Component);
function RolledUpVersionHeader(_ref6) {
  var version = _ref6.version,
    userTz = _ref6.userTz,
    jiraHost = _ref6.jiraHost;
  var Popover = ReactBootstrap.Popover;
  var OverlayTrigger = ReactBootstrap.OverlayTrigger;
  var Button = ReactBootstrap.Button;
  var versionStr = version.messages.length > 1 ? "versions" : "version";
  var rolledHeader = version.messages.length + " inactive " + versionStr;
  var popovers = /*#__PURE__*/React.createElement(Popover, {
    id: "popover-positioned-bottom",
    title: ""
  }, version.ids.map(function (id, i) {
    return /*#__PURE__*/React.createElement(RolledUpVersionSummary, {
      author: version.authors[i],
      commit: version.revisions[i],
      message: version.messages[i],
      gitTags: version.git_tags[i],
      versionId: version.ids[i],
      key: id,
      userTz: userTz,
      createTime: version.create_times[i],
      jiraHost: jiraHost
    });
  }));
  return /*#__PURE__*/React.createElement("div", {
    className: "header-col version-header-rolled"
  }, /*#__PURE__*/React.createElement(OverlayTrigger, {
    trigger: "click",
    placement: "bottom",
    overlay: popovers,
    className: "col-xs-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pointer"
  }, " ", rolledHeader, " ")));
}
;
function RolledUpVersionSummary(_ref7) {
  var author = _ref7.author,
    commit = _ref7.commit,
    message = _ref7.message,
    gitTags = _ref7.gitTags,
    versionId = _ref7.versionId,
    createTime = _ref7.createTime,
    userTz = _ref7.userTz,
    jiraHost = _ref7.jiraHost;
  var formatted_time = getFormattedTime(new Date(createTime), userTz, 'M/D/YY h:mm A');
  gitTags = gitTagsMessage(gitTags);
  commit = commit.substring(0, 10);
  return /*#__PURE__*/React.createElement("div", {
    className: "rolled-up-version-summary"
  }, /*#__PURE__*/React.createElement("span", {
    className: "version-header-time"
  }, formatted_time), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("a", {
    href: "/version/" + versionId
  }, commit), " - ", /*#__PURE__*/React.createElement("strong", null, author), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement(JiraLink, {
    jiraHost: jiraHost
  }, message), /*#__PURE__*/React.createElement("div", null, gitTags), /*#__PURE__*/React.createElement("br", null));
}
function TaskTombstones(num) {
  var out = [];
  for (var i = 0; i < num; ++i) {
    out.push( /*#__PURE__*/React.createElement("a", {
      className: "waterfall-box inactive"
    }));
  }
  return out;
}
function VariantTombstone() {
  return /*#__PURE__*/React.createElement("div", {
    className: "row variant-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-xs-2 build-variants"
  }, /*#__PURE__*/React.createElement("div", {
    className: "waterfall-tombstone",
    style: {
      'height': '18px',
      'width': '159px',
      'float': 'right'
    }
  }, "\xA0")), /*#__PURE__*/React.createElement("div", {
    className: "col-xs-10"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row build-cells"
  }, /*#__PURE__*/React.createElement("div", {
    className: "waterfall-build"
  }, /*#__PURE__*/React.createElement("div", {
    className: "active-build"
  }, TaskTombstones(1))))));
}
function GridTombstone() {
  return /*#__PURE__*/React.createElement("div", {
    className: "waterfall-grid"
  }, /*#__PURE__*/React.createElement(VariantTombstone, null));
}
//# sourceMappingURL=waterfall.js.map
