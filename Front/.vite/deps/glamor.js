import {
  require_object_assign
} from "./chunk-IRY4GH7U.js";
import {
  __commonJS,
  __esm,
  __export,
  __toCommonJS
} from "./chunk-CEQRFMJQ.js";

// node_modules/glamor/lib/sheet.js
var require_sheet = __commonJS({
  "node_modules/glamor/lib/sheet.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.StyleSheet = StyleSheet;
    var _objectAssign = require_object_assign();
    var _objectAssign2 = _interopRequireDefault(_objectAssign);
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    function _toConsumableArray(arr) {
      if (Array.isArray(arr)) {
        for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
          arr2[i] = arr[i];
        }
        return arr2;
      } else {
        return Array.from(arr);
      }
    }
    function last(arr) {
      return arr[arr.length - 1];
    }
    function sheetForTag(tag) {
      if (tag.sheet) {
        return tag.sheet;
      }
      for (var i = 0; i < document.styleSheets.length; i++) {
        if (document.styleSheets[i].ownerNode === tag) {
          return document.styleSheets[i];
        }
      }
    }
    var isBrowser = typeof window !== "undefined";
    var isDev = true;
    var isTest = false;
    var oldIE = function() {
      if (isBrowser) {
        var div = document.createElement("div");
        div.innerHTML = "<!--[if lt IE 10]><i></i><![endif]-->";
        return div.getElementsByTagName("i").length === 1;
      }
    }();
    function makeStyleTag() {
      var tag = document.createElement("style");
      tag.type = "text/css";
      tag.setAttribute("data-glamor", "");
      tag.appendChild(document.createTextNode(""));
      (document.head || document.getElementsByTagName("head")[0]).appendChild(tag);
      return tag;
    }
    function StyleSheet() {
      var _ref = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, _ref$speedy = _ref.speedy, speedy = _ref$speedy === void 0 ? !isDev && !isTest : _ref$speedy, _ref$maxLength = _ref.maxLength, maxLength = _ref$maxLength === void 0 ? isBrowser && oldIE ? 4e3 : 65e3 : _ref$maxLength;
      this.isSpeedy = speedy;
      this.sheet = void 0;
      this.tags = [];
      this.maxLength = maxLength;
      this.ctr = 0;
    }
    (0, _objectAssign2.default)(StyleSheet.prototype, {
      getSheet: function getSheet() {
        return sheetForTag(last(this.tags));
      },
      inject: function inject() {
        var _this = this;
        if (this.injected) {
          throw new Error("already injected stylesheet!");
        }
        if (isBrowser) {
          this.tags[0] = makeStyleTag();
        } else {
          this.sheet = {
            cssRules: [],
            insertRule: function insertRule(rule) {
              _this.sheet.cssRules.push({ cssText: rule });
            }
          };
        }
        this.injected = true;
      },
      speedy: function speedy(bool) {
        if (this.ctr !== 0) {
          throw new Error("cannot change speedy mode after inserting any rule to sheet. Either call speedy(" + bool + ") earlier in your app, or call flush() before speedy(" + bool + ")");
        }
        this.isSpeedy = !!bool;
      },
      _insert: function _insert(rule) {
        try {
          var sheet = this.getSheet();
          sheet.insertRule(rule, rule.indexOf("@import") !== -1 ? 0 : sheet.cssRules.length);
        } catch (e) {
          if (isDev) {
            console.warn("whoops, illegal rule inserted", rule);
          }
        }
      },
      insert: function insert(rule) {
        if (isBrowser) {
          if (this.isSpeedy && this.getSheet().insertRule) {
            this._insert(rule);
          } else {
            if (rule.indexOf("@import") !== -1) {
              var tag = last(this.tags);
              tag.insertBefore(document.createTextNode(rule), tag.firstChild);
            } else {
              last(this.tags).appendChild(document.createTextNode(rule));
            }
          }
        } else {
          this.sheet.insertRule(rule, rule.indexOf("@import") !== -1 ? 0 : this.sheet.cssRules.length);
        }
        this.ctr++;
        if (isBrowser && this.ctr % this.maxLength === 0) {
          this.tags.push(makeStyleTag());
        }
        return this.ctr - 1;
      },
      // commenting this out till we decide on v3's decision 
      // _replace(index, rule) {
      //   // this weirdness for perf, and chrome's weird bug 
      //   // https://stackoverflow.com/questions/20007992/chrome-suddenly-stopped-accepting-insertrule
      //   try {  
      //     let sheet = this.getSheet()        
      //     sheet.deleteRule(index) // todo - correct index here     
      //     sheet.insertRule(rule, index)
      //   }
      //   catch(e) {
      //     if(isDev) {
      //       // might need beter dx for this 
      //       console.warn('whoops, problem replacing rule', rule) //eslint-disable-line no-console
      //     }          
      //   }          
      // }
      // replace(index, rule) {
      //   if(isBrowser) {
      //     if(this.isSpeedy && this.getSheet().insertRule) {
      //       this._replace(index, rule)
      //     }
      //     else {
      //       let _slot = Math.floor((index  + this.maxLength) / this.maxLength) - 1        
      //       let _index = (index % this.maxLength) + 1
      //       let tag = this.tags[_slot]
      //       tag.replaceChild(document.createTextNode(rule), tag.childNodes[_index])
      //     }
      //   }
      //   else {
      //     let rules = this.sheet.cssRules
      //     this.sheet.cssRules = [ ...rules.slice(0, index), { cssText: rule }, ...rules.slice(index + 1) ]
      //   }
      // }
      delete: function _delete(index) {
        return this.replace(index, "");
      },
      flush: function flush() {
        if (isBrowser) {
          this.tags.forEach(function(tag) {
            return tag.parentNode.removeChild(tag);
          });
          this.tags = [];
          this.sheet = null;
          this.ctr = 0;
        } else {
          this.sheet.cssRules = [];
        }
        this.injected = false;
      },
      rules: function rules() {
        if (!isBrowser) {
          return this.sheet.cssRules;
        }
        var arr = [];
        this.tags.forEach(function(tag) {
          return arr.splice.apply(arr, [arr.length, 0].concat(_toConsumableArray(Array.from(sheetForTag(tag).cssRules))));
        });
        return arr;
      }
    });
  }
});

// node_modules/fbjs/lib/camelize.js
var require_camelize = __commonJS({
  "node_modules/fbjs/lib/camelize.js"(exports, module) {
    "use strict";
    var _hyphenPattern = /-(.)/g;
    function camelize(string) {
      return string.replace(_hyphenPattern, function(_, character) {
        return character.toUpperCase();
      });
    }
    module.exports = camelize;
  }
});

// node_modules/fbjs/lib/camelizeStyleName.js
var require_camelizeStyleName = __commonJS({
  "node_modules/fbjs/lib/camelizeStyleName.js"(exports, module) {
    "use strict";
    var camelize = require_camelize();
    var msPattern2 = /^-ms-/;
    function camelizeStyleName(string) {
      return camelize(string.replace(msPattern2, "ms-"));
    }
    module.exports = camelizeStyleName;
  }
});

// node_modules/glamor/lib/CSSPropertyOperations/CSSProperty.js
var require_CSSProperty = __commonJS({
  "node_modules/glamor/lib/CSSPropertyOperations/CSSProperty.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var isUnitlessNumber = {
      animationIterationCount: true,
      borderImageOutset: true,
      borderImageSlice: true,
      borderImageWidth: true,
      boxFlex: true,
      boxFlexGroup: true,
      boxOrdinalGroup: true,
      columnCount: true,
      flex: true,
      flexGrow: true,
      flexPositive: true,
      flexShrink: true,
      flexNegative: true,
      flexOrder: true,
      gridRow: true,
      gridRowStart: true,
      gridRowEnd: true,
      gridColumn: true,
      gridColumnStart: true,
      gridColumnEnd: true,
      fontWeight: true,
      lineClamp: true,
      lineHeight: true,
      opacity: true,
      order: true,
      orphans: true,
      tabSize: true,
      widows: true,
      zIndex: true,
      zoom: true,
      // SVG-related properties
      fillOpacity: true,
      floodOpacity: true,
      stopOpacity: true,
      strokeDasharray: true,
      strokeDashoffset: true,
      strokeMiterlimit: true,
      strokeOpacity: true,
      strokeWidth: true
      /**
       * @param {string} prefix vendor-specific prefix, eg: Webkit
       * @param {string} key style name, eg: transitionDuration
       * @return {string} style name prefixed with `prefix`, properly camelCased, eg:
       * WebkitTransitionDuration
       */
    };
    function prefixKey(prefix, key) {
      return prefix + key.charAt(0).toUpperCase() + key.substring(1);
    }
    var prefixes = ["Webkit", "ms", "Moz", "O"];
    Object.keys(isUnitlessNumber).forEach(function(prop) {
      prefixes.forEach(function(prefix) {
        isUnitlessNumber[prefixKey(prefix, prop)] = isUnitlessNumber[prop];
      });
    });
    var shorthandPropertyExpansions = {
      background: {
        backgroundAttachment: true,
        backgroundColor: true,
        backgroundImage: true,
        backgroundPositionX: true,
        backgroundPositionY: true,
        backgroundRepeat: true
      },
      backgroundPosition: {
        backgroundPositionX: true,
        backgroundPositionY: true
      },
      border: {
        borderWidth: true,
        borderStyle: true,
        borderColor: true
      },
      borderBottom: {
        borderBottomWidth: true,
        borderBottomStyle: true,
        borderBottomColor: true
      },
      borderLeft: {
        borderLeftWidth: true,
        borderLeftStyle: true,
        borderLeftColor: true
      },
      borderRight: {
        borderRightWidth: true,
        borderRightStyle: true,
        borderRightColor: true
      },
      borderTop: {
        borderTopWidth: true,
        borderTopStyle: true,
        borderTopColor: true
      },
      font: {
        fontStyle: true,
        fontVariant: true,
        fontWeight: true,
        fontSize: true,
        lineHeight: true,
        fontFamily: true
      },
      outline: {
        outlineWidth: true,
        outlineStyle: true,
        outlineColor: true
      }
    };
    var CSSProperty = {
      isUnitlessNumber,
      shorthandPropertyExpansions
    };
    exports.default = CSSProperty;
  }
});

// node_modules/fbjs/lib/emptyFunction.js
var require_emptyFunction = __commonJS({
  "node_modules/fbjs/lib/emptyFunction.js"(exports, module) {
    "use strict";
    function makeEmptyFunction(arg) {
      return function() {
        return arg;
      };
    }
    var emptyFunction = function emptyFunction2() {
    };
    emptyFunction.thatReturns = makeEmptyFunction;
    emptyFunction.thatReturnsFalse = makeEmptyFunction(false);
    emptyFunction.thatReturnsTrue = makeEmptyFunction(true);
    emptyFunction.thatReturnsNull = makeEmptyFunction(null);
    emptyFunction.thatReturnsThis = function() {
      return this;
    };
    emptyFunction.thatReturnsArgument = function(arg) {
      return arg;
    };
    module.exports = emptyFunction;
  }
});

// node_modules/fbjs/lib/warning.js
var require_warning = __commonJS({
  "node_modules/fbjs/lib/warning.js"(exports, module) {
    "use strict";
    var emptyFunction = require_emptyFunction();
    var warning = emptyFunction;
    if (true) {
      printWarning = function printWarning2(format) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }
        var argIndex = 0;
        var message = "Warning: " + format.replace(/%s/g, function() {
          return args[argIndex++];
        });
        if (typeof console !== "undefined") {
          console.error(message);
        }
        try {
          throw new Error(message);
        } catch (x) {
        }
      };
      warning = function warning2(condition, format) {
        if (format === void 0) {
          throw new Error("`warning(condition, format, ...args)` requires a warning message argument");
        }
        if (format.indexOf("Failed Composite propType: ") === 0) {
          return;
        }
        if (!condition) {
          for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
            args[_key2 - 2] = arguments[_key2];
          }
          printWarning.apply(void 0, [format].concat(args));
        }
      };
    }
    var printWarning;
    module.exports = warning;
  }
});

// node_modules/glamor/lib/CSSPropertyOperations/dangerousStyleValue.js
var require_dangerousStyleValue = __commonJS({
  "node_modules/glamor/lib/CSSPropertyOperations/dangerousStyleValue.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _CSSProperty = require_CSSProperty();
    var _CSSProperty2 = _interopRequireDefault(_CSSProperty);
    var _warning = require_warning();
    var _warning2 = _interopRequireDefault(_warning);
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    var isUnitlessNumber = _CSSProperty2.default.isUnitlessNumber;
    var styleWarnings = {};
    function dangerousStyleValue(name, value, component) {
      var isEmpty = value == null || typeof value === "boolean" || value === "";
      if (isEmpty) {
        return "";
      }
      var isNonNumeric = isNaN(value);
      if (isNonNumeric || value === 0 || isUnitlessNumber.hasOwnProperty(name) && isUnitlessNumber[name]) {
        return "" + value;
      }
      if (typeof value === "string") {
        if (true) {
          if (component && value !== "0") {
            var owner = component._currentElement._owner;
            var ownerName = owner ? owner.getName() : null;
            if (ownerName && !styleWarnings[ownerName]) {
              styleWarnings[ownerName] = {};
            }
            var warned = false;
            if (ownerName) {
              var warnings = styleWarnings[ownerName];
              warned = warnings[name];
              if (!warned) {
                warnings[name] = true;
              }
            }
            if (!warned) {
              true ? (0, _warning2.default)(false, "a `%s` tag (owner: `%s`) was passed a numeric string value for CSS property `%s` (value: `%s`) which will be treated as a unitless number in a future version of React.", component._currentElement.type, ownerName || "unknown", name, value) : void 0;
            }
          }
        }
        value = value.trim();
      }
      return value + "px";
    }
    exports.default = dangerousStyleValue;
  }
});

// node_modules/fbjs/lib/hyphenate.js
var require_hyphenate = __commonJS({
  "node_modules/fbjs/lib/hyphenate.js"(exports, module) {
    "use strict";
    var _uppercasePattern = /([A-Z])/g;
    function hyphenate(string) {
      return string.replace(_uppercasePattern, "-$1").toLowerCase();
    }
    module.exports = hyphenate;
  }
});

// node_modules/fbjs/lib/hyphenateStyleName.js
var require_hyphenateStyleName = __commonJS({
  "node_modules/fbjs/lib/hyphenateStyleName.js"(exports, module) {
    "use strict";
    var hyphenate = require_hyphenate();
    var msPattern2 = /^ms-/;
    function hyphenateStyleName2(string) {
      return hyphenate(string).replace(msPattern2, "-ms-");
    }
    module.exports = hyphenateStyleName2;
  }
});

// node_modules/fbjs/lib/memoizeStringOnly.js
var require_memoizeStringOnly = __commonJS({
  "node_modules/fbjs/lib/memoizeStringOnly.js"(exports, module) {
    "use strict";
    function memoizeStringOnly(callback) {
      var cache2 = {};
      return function(string) {
        if (!cache2.hasOwnProperty(string)) {
          cache2[string] = callback.call(this, string);
        }
        return cache2[string];
      };
    }
    module.exports = memoizeStringOnly;
  }
});

// node_modules/glamor/lib/CSSPropertyOperations/index.js
var require_CSSPropertyOperations = __commonJS({
  "node_modules/glamor/lib/CSSPropertyOperations/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.processStyleName = void 0;
    exports.createMarkupForStyles = createMarkupForStyles;
    var _camelizeStyleName = require_camelizeStyleName();
    var _camelizeStyleName2 = _interopRequireDefault(_camelizeStyleName);
    var _dangerousStyleValue = require_dangerousStyleValue();
    var _dangerousStyleValue2 = _interopRequireDefault(_dangerousStyleValue);
    var _hyphenateStyleName = require_hyphenateStyleName();
    var _hyphenateStyleName2 = _interopRequireDefault(_hyphenateStyleName);
    var _memoizeStringOnly = require_memoizeStringOnly();
    var _memoizeStringOnly2 = _interopRequireDefault(_memoizeStringOnly);
    var _warning = require_warning();
    var _warning2 = _interopRequireDefault(_warning);
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    var processStyleName = exports.processStyleName = (0, _memoizeStringOnly2.default)(_hyphenateStyleName2.default);
    if (true) {
      badVendoredStyleNamePattern = /^(?:webkit|moz|o)[A-Z]/;
      badStyleValueWithSemicolonPattern = /;\s*$/;
      warnedStyleNames = {};
      warnedStyleValues = {};
      warnedForNaNValue = false;
      warnHyphenatedStyleName = function warnHyphenatedStyleName2(name, owner) {
        if (warnedStyleNames.hasOwnProperty(name) && warnedStyleNames[name]) {
          return;
        }
        warnedStyleNames[name] = true;
        true ? (0, _warning2.default)(false, "Unsupported style property %s. Did you mean %s?%s", name, (0, _camelizeStyleName2.default)(name), checkRenderMessage(owner)) : void 0;
      };
      warnBadVendoredStyleName = function warnBadVendoredStyleName2(name, owner) {
        if (warnedStyleNames.hasOwnProperty(name) && warnedStyleNames[name]) {
          return;
        }
        warnedStyleNames[name] = true;
        true ? (0, _warning2.default)(false, "Unsupported vendor-prefixed style property %s. Did you mean %s?%s", name, name.charAt(0).toUpperCase() + name.slice(1), checkRenderMessage(owner)) : void 0;
      };
      warnStyleValueWithSemicolon = function warnStyleValueWithSemicolon2(name, value, owner) {
        if (warnedStyleValues.hasOwnProperty(value) && warnedStyleValues[value]) {
          return;
        }
        warnedStyleValues[value] = true;
        true ? (0, _warning2.default)(false, `Style property values shouldn't contain a semicolon.%s Try "%s: %s" instead.`, checkRenderMessage(owner), name, value.replace(badStyleValueWithSemicolonPattern, "")) : void 0;
      };
      warnStyleValueIsNaN = function warnStyleValueIsNaN2(name, value, owner) {
        if (warnedForNaNValue) {
          return;
        }
        warnedForNaNValue = true;
        true ? (0, _warning2.default)(false, "`NaN` is an invalid value for the `%s` css style property.%s", name, checkRenderMessage(owner)) : void 0;
      };
      checkRenderMessage = function checkRenderMessage2(owner) {
        if (owner) {
          var name = owner.getName();
          if (name) {
            return " Check the render method of `" + name + "`.";
          }
        }
        return "";
      };
      warnValidStyle = function warnValidStyle2(name, value, component) {
        var owner = void 0;
        if (component) {
          owner = component._currentElement._owner;
        }
        if (name.indexOf("-") > -1) {
          warnHyphenatedStyleName(name, owner);
        } else if (badVendoredStyleNamePattern.test(name)) {
          warnBadVendoredStyleName(name, owner);
        } else if (badStyleValueWithSemicolonPattern.test(value)) {
          warnStyleValueWithSemicolon(name, value, owner);
        }
        if (typeof value === "number" && isNaN(value)) {
          warnStyleValueIsNaN(name, value, owner);
        }
      };
    }
    var badVendoredStyleNamePattern;
    var badStyleValueWithSemicolonPattern;
    var warnedStyleNames;
    var warnedStyleValues;
    var warnedForNaNValue;
    var warnHyphenatedStyleName;
    var warnBadVendoredStyleName;
    var warnStyleValueWithSemicolon;
    var warnStyleValueIsNaN;
    var checkRenderMessage;
    var warnValidStyle;
    function createMarkupForStyles(styles, component) {
      var serialized = "";
      for (var styleName in styles) {
        var isCustomProp = styleName.indexOf("--") === 0;
        if (!styles.hasOwnProperty(styleName)) {
          continue;
        }
        if (styleName === "label") {
          continue;
        }
        var styleValue = styles[styleName];
        if (!isCustomProp) {
          warnValidStyle(styleName, styleValue, component);
        }
        if (styleValue != null) {
          if (isCustomProp) {
            serialized += styleName + ":" + styleValue + ";";
          } else {
            serialized += processStyleName(styleName) + ":";
            serialized += (0, _dangerousStyleValue2.default)(styleName, styleValue, component) + ";";
          }
        }
      }
      return serialized || null;
    }
  }
});

// node_modules/glamor/lib/clean.js
var require_clean = __commonJS({
  "node_modules/glamor/lib/clean.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
      return typeof obj;
    } : function(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
    exports.default = clean;
    function isFalsy(value) {
      return value === null || value === void 0 || value === false || (typeof value === "undefined" ? "undefined" : _typeof(value)) === "object" && Object.keys(value).length === 0;
    }
    function cleanObject(object) {
      if (isFalsy(object))
        return null;
      if ((typeof object === "undefined" ? "undefined" : _typeof(object)) !== "object")
        return object;
      var acc = {}, keys = Object.keys(object), hasFalsy = false;
      for (var i = 0; i < keys.length; i++) {
        var value = object[keys[i]];
        var filteredValue = clean(value);
        if (filteredValue === null || filteredValue !== value) {
          hasFalsy = true;
        }
        if (filteredValue !== null) {
          acc[keys[i]] = filteredValue;
        }
      }
      return Object.keys(acc).length === 0 ? null : hasFalsy ? acc : object;
    }
    function cleanArray(rules) {
      var hasFalsy = false;
      var filtered = [];
      rules.forEach(function(rule) {
        var filteredRule = clean(rule);
        if (filteredRule === null || filteredRule !== rule) {
          hasFalsy = true;
        }
        if (filteredRule !== null) {
          filtered.push(filteredRule);
        }
      });
      return filtered.length == 0 ? null : hasFalsy ? filtered : rules;
    }
    function clean(input) {
      return Array.isArray(input) ? cleanArray(input) : cleanObject(input);
    }
  }
});

// node_modules/inline-style-prefixer/static/staticData.js
var require_staticData = __commonJS({
  "node_modules/inline-style-prefixer/static/staticData.js"(exports, module) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var w = ["Webkit"];
    var m = ["Moz"];
    var ms = ["ms"];
    var wm = ["Webkit", "Moz"];
    var wms = ["Webkit", "ms"];
    var wmms = ["Webkit", "Moz", "ms"];
    exports.default = {
      plugins: [],
      prefixMap: { "appearance": wm, "userSelect": wmms, "textEmphasisPosition": w, "textEmphasis": w, "textEmphasisStyle": w, "textEmphasisColor": w, "boxDecorationBreak": w, "clipPath": w, "maskImage": w, "maskMode": w, "maskRepeat": w, "maskPosition": w, "maskClip": w, "maskOrigin": w, "maskSize": w, "maskComposite": w, "mask": w, "maskBorderSource": w, "maskBorderMode": w, "maskBorderSlice": w, "maskBorderWidth": w, "maskBorderOutset": w, "maskBorderRepeat": w, "maskBorder": w, "maskType": w, "textDecorationStyle": w, "textDecorationSkip": w, "textDecorationLine": w, "textDecorationColor": w, "filter": w, "fontFeatureSettings": w, "breakAfter": wmms, "breakBefore": wmms, "breakInside": wmms, "columnCount": wm, "columnFill": wm, "columnGap": wm, "columnRule": wm, "columnRuleColor": wm, "columnRuleStyle": wm, "columnRuleWidth": wm, "columns": wm, "columnSpan": wm, "columnWidth": wm, "writingMode": wms, "flex": w, "flexBasis": w, "flexDirection": w, "flexGrow": w, "flexFlow": w, "flexShrink": w, "flexWrap": w, "alignContent": w, "alignItems": w, "alignSelf": w, "justifyContent": w, "order": w, "transform": w, "transformOrigin": w, "transformOriginX": w, "transformOriginY": w, "backfaceVisibility": w, "perspective": w, "perspectiveOrigin": w, "transformStyle": w, "transformOriginZ": w, "animation": w, "animationDelay": w, "animationDirection": w, "animationFillMode": w, "animationDuration": w, "animationIterationCount": w, "animationName": w, "animationPlayState": w, "animationTimingFunction": w, "backdropFilter": w, "fontKerning": w, "scrollSnapType": wms, "scrollSnapPointsX": wms, "scrollSnapPointsY": wms, "scrollSnapDestination": wms, "scrollSnapCoordinate": wms, "shapeImageThreshold": w, "shapeImageMargin": w, "shapeImageOutside": w, "hyphens": wmms, "flowInto": wms, "flowFrom": wms, "regionFragment": wms, "textAlignLast": m, "tabSize": m, "wrapFlow": ms, "wrapThrough": ms, "wrapMargin": ms, "gridTemplateColumns": ms, "gridTemplateRows": ms, "gridTemplateAreas": ms, "gridTemplate": ms, "gridAutoColumns": ms, "gridAutoRows": ms, "gridAutoFlow": ms, "grid": ms, "gridRowStart": ms, "gridColumnStart": ms, "gridRowEnd": ms, "gridRow": ms, "gridColumn": ms, "gridColumnEnd": ms, "gridColumnGap": ms, "gridRowGap": ms, "gridArea": ms, "gridGap": ms, "textSizeAdjust": wms, "borderImage": w, "borderImageOutset": w, "borderImageRepeat": w, "borderImageSlice": w, "borderImageSource": w, "borderImageWidth": w, "transitionDelay": w, "transitionDuration": w, "transitionProperty": w, "transitionTimingFunction": w }
    };
    module.exports = exports["default"];
  }
});

// node_modules/inline-style-prefixer/utils/capitalizeString.js
var require_capitalizeString = __commonJS({
  "node_modules/inline-style-prefixer/utils/capitalizeString.js"(exports, module) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = capitalizeString;
    function capitalizeString(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }
    module.exports = exports["default"];
  }
});

// node_modules/inline-style-prefixer/utils/prefixProperty.js
var require_prefixProperty = __commonJS({
  "node_modules/inline-style-prefixer/utils/prefixProperty.js"(exports, module) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = prefixProperty;
    var _capitalizeString = require_capitalizeString();
    var _capitalizeString2 = _interopRequireDefault(_capitalizeString);
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    function prefixProperty(prefixProperties, property, style) {
      if (prefixProperties.hasOwnProperty(property)) {
        var requiredPrefixes = prefixProperties[property];
        for (var i = 0, len = requiredPrefixes.length; i < len; ++i) {
          style[requiredPrefixes[i] + (0, _capitalizeString2.default)(property)] = style[property];
        }
      }
    }
    module.exports = exports["default"];
  }
});

// node_modules/inline-style-prefixer/utils/prefixValue.js
var require_prefixValue = __commonJS({
  "node_modules/inline-style-prefixer/utils/prefixValue.js"(exports, module) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = prefixValue;
    function prefixValue(plugins, property, value, style, metaData) {
      for (var i = 0, len = plugins.length; i < len; ++i) {
        var processedValue = plugins[i](property, value, style, metaData);
        if (processedValue) {
          return processedValue;
        }
      }
    }
    module.exports = exports["default"];
  }
});

// node_modules/inline-style-prefixer/static/plugins/cursor.js
var require_cursor = __commonJS({
  "node_modules/inline-style-prefixer/static/plugins/cursor.js"(exports, module) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = cursor;
    var prefixes = ["-webkit-", "-moz-", ""];
    var values = {
      "zoom-in": true,
      "zoom-out": true,
      grab: true,
      grabbing: true
    };
    function cursor(property, value) {
      if (property === "cursor" && values.hasOwnProperty(value)) {
        return prefixes.map(function(prefix) {
          return prefix + value;
        });
      }
    }
    module.exports = exports["default"];
  }
});

// node_modules/css-in-js-utils/lib/isPrefixedValue.js
var require_isPrefixedValue = __commonJS({
  "node_modules/css-in-js-utils/lib/isPrefixedValue.js"(exports, module) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = isPrefixedValue;
    var regex = /-webkit-|-moz-|-ms-/;
    function isPrefixedValue(value) {
      return typeof value === "string" && regex.test(value);
    }
    module.exports = exports["default"];
  }
});

// node_modules/inline-style-prefixer/static/plugins/crossFade.js
var require_crossFade = __commonJS({
  "node_modules/inline-style-prefixer/static/plugins/crossFade.js"(exports, module) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = crossFade;
    var _isPrefixedValue = require_isPrefixedValue();
    var _isPrefixedValue2 = _interopRequireDefault(_isPrefixedValue);
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    var prefixes = ["-webkit-", ""];
    function crossFade(property, value) {
      if (typeof value === "string" && !(0, _isPrefixedValue2.default)(value) && value.indexOf("cross-fade(") > -1) {
        return prefixes.map(function(prefix) {
          return value.replace(/cross-fade\(/g, prefix + "cross-fade(");
        });
      }
    }
    module.exports = exports["default"];
  }
});

// node_modules/inline-style-prefixer/static/plugins/filter.js
var require_filter = __commonJS({
  "node_modules/inline-style-prefixer/static/plugins/filter.js"(exports, module) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = filter;
    var _isPrefixedValue = require_isPrefixedValue();
    var _isPrefixedValue2 = _interopRequireDefault(_isPrefixedValue);
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    var prefixes = ["-webkit-", ""];
    function filter(property, value) {
      if (typeof value === "string" && !(0, _isPrefixedValue2.default)(value) && value.indexOf("filter(") > -1) {
        return prefixes.map(function(prefix) {
          return value.replace(/filter\(/g, prefix + "filter(");
        });
      }
    }
    module.exports = exports["default"];
  }
});

// node_modules/inline-style-prefixer/static/plugins/flex.js
var require_flex = __commonJS({
  "node_modules/inline-style-prefixer/static/plugins/flex.js"(exports, module) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = flex;
    var values = {
      flex: ["-webkit-box", "-moz-box", "-ms-flexbox", "-webkit-flex", "flex"],
      "inline-flex": ["-webkit-inline-box", "-moz-inline-box", "-ms-inline-flexbox", "-webkit-inline-flex", "inline-flex"]
    };
    function flex(property, value) {
      if (property === "display" && values.hasOwnProperty(value)) {
        return values[value];
      }
    }
    module.exports = exports["default"];
  }
});

// node_modules/inline-style-prefixer/static/plugins/flexboxOld.js
var require_flexboxOld = __commonJS({
  "node_modules/inline-style-prefixer/static/plugins/flexboxOld.js"(exports, module) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = flexboxOld;
    var alternativeValues = {
      "space-around": "justify",
      "space-between": "justify",
      "flex-start": "start",
      "flex-end": "end",
      "wrap-reverse": "multiple",
      wrap: "multiple"
    };
    var alternativeProps = {
      alignItems: "WebkitBoxAlign",
      justifyContent: "WebkitBoxPack",
      flexWrap: "WebkitBoxLines"
    };
    function flexboxOld(property, value, style) {
      if (property === "flexDirection" && typeof value === "string") {
        if (value.indexOf("column") > -1) {
          style.WebkitBoxOrient = "vertical";
        } else {
          style.WebkitBoxOrient = "horizontal";
        }
        if (value.indexOf("reverse") > -1) {
          style.WebkitBoxDirection = "reverse";
        } else {
          style.WebkitBoxDirection = "normal";
        }
      }
      if (alternativeProps.hasOwnProperty(property)) {
        style[alternativeProps[property]] = alternativeValues[value] || value;
      }
    }
    module.exports = exports["default"];
  }
});

// node_modules/inline-style-prefixer/static/plugins/gradient.js
var require_gradient = __commonJS({
  "node_modules/inline-style-prefixer/static/plugins/gradient.js"(exports, module) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = gradient;
    var _isPrefixedValue = require_isPrefixedValue();
    var _isPrefixedValue2 = _interopRequireDefault(_isPrefixedValue);
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    var prefixes = ["-webkit-", "-moz-", ""];
    var values = /linear-gradient|radial-gradient|repeating-linear-gradient|repeating-radial-gradient/;
    function gradient(property, value) {
      if (typeof value === "string" && !(0, _isPrefixedValue2.default)(value) && values.test(value)) {
        return prefixes.map(function(prefix) {
          return prefix + value;
        });
      }
    }
    module.exports = exports["default"];
  }
});

// node_modules/inline-style-prefixer/static/plugins/imageSet.js
var require_imageSet = __commonJS({
  "node_modules/inline-style-prefixer/static/plugins/imageSet.js"(exports, module) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = imageSet;
    var _isPrefixedValue = require_isPrefixedValue();
    var _isPrefixedValue2 = _interopRequireDefault(_isPrefixedValue);
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    var prefixes = ["-webkit-", ""];
    function imageSet(property, value) {
      if (typeof value === "string" && !(0, _isPrefixedValue2.default)(value) && value.indexOf("image-set(") > -1) {
        return prefixes.map(function(prefix) {
          return value.replace(/image-set\(/g, prefix + "image-set(");
        });
      }
    }
    module.exports = exports["default"];
  }
});

// node_modules/inline-style-prefixer/static/plugins/position.js
var require_position = __commonJS({
  "node_modules/inline-style-prefixer/static/plugins/position.js"(exports, module) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = position;
    function position(property, value) {
      if (property === "position" && value === "sticky") {
        return ["-webkit-sticky", "sticky"];
      }
    }
    module.exports = exports["default"];
  }
});

// node_modules/inline-style-prefixer/static/plugins/sizing.js
var require_sizing = __commonJS({
  "node_modules/inline-style-prefixer/static/plugins/sizing.js"(exports, module) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = sizing;
    var prefixes = ["-webkit-", "-moz-", ""];
    var properties = {
      maxHeight: true,
      maxWidth: true,
      width: true,
      height: true,
      columnWidth: true,
      minWidth: true,
      minHeight: true
    };
    var values = {
      "min-content": true,
      "max-content": true,
      "fill-available": true,
      "fit-content": true,
      "contain-floats": true
    };
    function sizing(property, value) {
      if (properties.hasOwnProperty(property) && values.hasOwnProperty(value)) {
        return prefixes.map(function(prefix) {
          return prefix + value;
        });
      }
    }
    module.exports = exports["default"];
  }
});

// node_modules/hyphenate-style-name/index.js
var hyphenate_style_name_exports = {};
__export(hyphenate_style_name_exports, {
  default: () => hyphenate_style_name_default
});
function toHyphenLower(match) {
  return "-" + match.toLowerCase();
}
function hyphenateStyleName(name) {
  if (cache.hasOwnProperty(name)) {
    return cache[name];
  }
  var hName = name.replace(uppercasePattern, toHyphenLower);
  return cache[name] = msPattern.test(hName) ? "-" + hName : hName;
}
var uppercasePattern, msPattern, cache, hyphenate_style_name_default;
var init_hyphenate_style_name = __esm({
  "node_modules/hyphenate-style-name/index.js"() {
    uppercasePattern = /[A-Z]/g;
    msPattern = /^ms-/;
    cache = {};
    hyphenate_style_name_default = hyphenateStyleName;
  }
});

// node_modules/css-in-js-utils/lib/hyphenateProperty.js
var require_hyphenateProperty = __commonJS({
  "node_modules/css-in-js-utils/lib/hyphenateProperty.js"(exports, module) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = hyphenateProperty;
    var _hyphenateStyleName = (init_hyphenate_style_name(), __toCommonJS(hyphenate_style_name_exports));
    var _hyphenateStyleName2 = _interopRequireDefault(_hyphenateStyleName);
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    function hyphenateProperty(property) {
      return (0, _hyphenateStyleName2.default)(property);
    }
    module.exports = exports["default"];
  }
});

// node_modules/inline-style-prefixer/static/plugins/transition.js
var require_transition = __commonJS({
  "node_modules/inline-style-prefixer/static/plugins/transition.js"(exports, module) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = transition;
    var _hyphenateProperty = require_hyphenateProperty();
    var _hyphenateProperty2 = _interopRequireDefault(_hyphenateProperty);
    var _isPrefixedValue = require_isPrefixedValue();
    var _isPrefixedValue2 = _interopRequireDefault(_isPrefixedValue);
    var _capitalizeString = require_capitalizeString();
    var _capitalizeString2 = _interopRequireDefault(_capitalizeString);
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    var properties = {
      transition: true,
      transitionProperty: true,
      WebkitTransition: true,
      WebkitTransitionProperty: true,
      MozTransition: true,
      MozTransitionProperty: true
    };
    var prefixMapping = {
      Webkit: "-webkit-",
      Moz: "-moz-",
      ms: "-ms-"
    };
    function prefixValue(value, propertyPrefixMap) {
      if ((0, _isPrefixedValue2.default)(value)) {
        return value;
      }
      var multipleValues = value.split(/,(?![^()]*(?:\([^()]*\))?\))/g);
      for (var i = 0, len = multipleValues.length; i < len; ++i) {
        var singleValue = multipleValues[i];
        var values = [singleValue];
        for (var property in propertyPrefixMap) {
          var dashCaseProperty = (0, _hyphenateProperty2.default)(property);
          if (singleValue.indexOf(dashCaseProperty) > -1 && dashCaseProperty !== "order") {
            var prefixes = propertyPrefixMap[property];
            for (var j = 0, pLen = prefixes.length; j < pLen; ++j) {
              values.unshift(singleValue.replace(dashCaseProperty, prefixMapping[prefixes[j]] + dashCaseProperty));
            }
          }
        }
        multipleValues[i] = values.join(",");
      }
      return multipleValues.join(",");
    }
    function transition(property, value, style, propertyPrefixMap) {
      if (typeof value === "string" && properties.hasOwnProperty(property)) {
        var outputValue = prefixValue(value, propertyPrefixMap);
        var webkitOutput = outputValue.split(/,(?![^()]*(?:\([^()]*\))?\))/g).filter(function(val) {
          return !/-moz-|-ms-/.test(val);
        }).join(",");
        if (property.indexOf("Webkit") > -1) {
          return webkitOutput;
        }
        var mozOutput = outputValue.split(/,(?![^()]*(?:\([^()]*\))?\))/g).filter(function(val) {
          return !/-webkit-|-ms-/.test(val);
        }).join(",");
        if (property.indexOf("Moz") > -1) {
          return mozOutput;
        }
        style["Webkit" + (0, _capitalizeString2.default)(property)] = webkitOutput;
        style["Moz" + (0, _capitalizeString2.default)(property)] = mozOutput;
        return outputValue;
      }
    }
    module.exports = exports["default"];
  }
});

// node_modules/glamor/lib/prefixer.js
var require_prefixer = __commonJS({
  "node_modules/glamor/lib/prefixer.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = prefixer;
    var _staticData = require_staticData();
    var _staticData2 = _interopRequireDefault(_staticData);
    var _prefixProperty = require_prefixProperty();
    var _prefixProperty2 = _interopRequireDefault(_prefixProperty);
    var _prefixValue = require_prefixValue();
    var _prefixValue2 = _interopRequireDefault(_prefixValue);
    var _cursor = require_cursor();
    var _cursor2 = _interopRequireDefault(_cursor);
    var _crossFade = require_crossFade();
    var _crossFade2 = _interopRequireDefault(_crossFade);
    var _filter = require_filter();
    var _filter2 = _interopRequireDefault(_filter);
    var _flex = require_flex();
    var _flex2 = _interopRequireDefault(_flex);
    var _flexboxOld = require_flexboxOld();
    var _flexboxOld2 = _interopRequireDefault(_flexboxOld);
    var _gradient = require_gradient();
    var _gradient2 = _interopRequireDefault(_gradient);
    var _imageSet = require_imageSet();
    var _imageSet2 = _interopRequireDefault(_imageSet);
    var _position = require_position();
    var _position2 = _interopRequireDefault(_position);
    var _sizing = require_sizing();
    var _sizing2 = _interopRequireDefault(_sizing);
    var _transition = require_transition();
    var _transition2 = _interopRequireDefault(_transition);
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    var plugins = [_crossFade2.default, _cursor2.default, _filter2.default, _flexboxOld2.default, _gradient2.default, _imageSet2.default, _position2.default, _sizing2.default, _transition2.default, _flex2.default];
    var prefixMap = _staticData2.default.prefixMap;
    function prefixer(style) {
      for (var property in style) {
        var value = style[property];
        var processedValue = (0, _prefixValue2.default)(plugins, property, value, style, prefixMap);
        if (processedValue) {
          style[property] = processedValue;
        }
        (0, _prefixProperty2.default)(prefixMap, property, style);
      }
      return style;
    }
  }
});

// node_modules/glamor/lib/plugins.js
var require_plugins = __commonJS({
  "node_modules/glamor/lib/plugins.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _extends = Object.assign || function(target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
      return target;
    };
    exports.PluginSet = PluginSet;
    exports.fallbacks = fallbacks;
    exports.contentWrap = contentWrap;
    exports.prefixes = prefixes;
    var _objectAssign = require_object_assign();
    var _objectAssign2 = _interopRequireDefault(_objectAssign);
    var _CSSPropertyOperations = require_CSSPropertyOperations();
    var _prefixer = require_prefixer();
    var _prefixer2 = _interopRequireDefault(_prefixer);
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    var isDev = /* @__PURE__ */ function(x) {
      return x === "development" || !x;
    }("development");
    function PluginSet(initial) {
      this.fns = initial || [];
    }
    (0, _objectAssign2.default)(PluginSet.prototype, {
      add: function add() {
        var _this = this;
        for (var _len = arguments.length, fns = Array(_len), _key = 0; _key < _len; _key++) {
          fns[_key] = arguments[_key];
        }
        fns.forEach(function(fn) {
          if (_this.fns.indexOf(fn) >= 0) {
            if (isDev) {
              console.warn("adding the same plugin again, ignoring");
            }
          } else {
            _this.fns = [fn].concat(_this.fns);
          }
        });
      },
      remove: function remove(fn) {
        this.fns = this.fns.filter(function(x) {
          return x !== fn;
        });
      },
      clear: function clear() {
        this.fns = [];
      },
      transform: function transform(o) {
        return this.fns.reduce(function(o2, fn) {
          return fn(o2);
        }, o);
      }
    });
    function fallbacks(node) {
      var hasArray = Object.keys(node.style).map(function(x) {
        return Array.isArray(node.style[x]);
      }).indexOf(true) >= 0;
      if (hasArray) {
        var style = node.style;
        var flattened = Object.keys(style).reduce(function(o, key) {
          o[key] = Array.isArray(style[key]) ? style[key].join("; " + (0, _CSSPropertyOperations.processStyleName)(key) + ": ") : style[key];
          return o;
        }, {});
        return (0, _objectAssign2.default)({}, node, { style: flattened });
      }
      return node;
    }
    var contentValues = ["normal", "none", "counter", "open-quote", "close-quote", "no-open-quote", "no-close-quote", "initial", "inherit"];
    function contentWrap(node) {
      if (node.style.content) {
        var cont = node.style.content;
        if (contentValues.indexOf(cont) >= 0) {
          return node;
        }
        if (/^(attr|calc|counters?|url)\(/.test(cont)) {
          return node;
        }
        if (cont.charAt(0) === cont.charAt(cont.length - 1) && (cont.charAt(0) === '"' || cont.charAt(0) === "'")) {
          return node;
        }
        return _extends({}, node, { style: _extends({}, node.style, { content: '"' + cont + '"' }) });
      }
      return node;
    }
    function prefixes(node) {
      return (0, _objectAssign2.default)({}, node, { style: (0, _prefixer2.default)(_extends({}, node.style)) });
    }
  }
});

// node_modules/glamor/lib/hash.js
var require_hash = __commonJS({
  "node_modules/glamor/lib/hash.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = doHash;
    function doHash(str, seed) {
      var m = 1540483477;
      var r = 24;
      var h = seed ^ str.length;
      var length = str.length;
      var currentIndex = 0;
      while (length >= 4) {
        var k = UInt32(str, currentIndex);
        k = Umul32(k, m);
        k ^= k >>> r;
        k = Umul32(k, m);
        h = Umul32(h, m);
        h ^= k;
        currentIndex += 4;
        length -= 4;
      }
      switch (length) {
        case 3:
          h ^= UInt16(str, currentIndex);
          h ^= str.charCodeAt(currentIndex + 2) << 16;
          h = Umul32(h, m);
          break;
        case 2:
          h ^= UInt16(str, currentIndex);
          h = Umul32(h, m);
          break;
        case 1:
          h ^= str.charCodeAt(currentIndex);
          h = Umul32(h, m);
          break;
      }
      h ^= h >>> 13;
      h = Umul32(h, m);
      h ^= h >>> 15;
      return h >>> 0;
    }
    function UInt32(str, pos) {
      return str.charCodeAt(pos++) + (str.charCodeAt(pos++) << 8) + (str.charCodeAt(pos++) << 16) + (str.charCodeAt(pos) << 24);
    }
    function UInt16(str, pos) {
      return str.charCodeAt(pos++) + (str.charCodeAt(pos++) << 8);
    }
    function Umul32(n, m) {
      n = n | 0;
      m = m | 0;
      var nlo = n & 65535;
      var nhi = n >>> 16;
      var res = nlo * m + ((nhi * m & 65535) << 16) | 0;
      return res;
    }
  }
});

// node_modules/glamor/lib/index.js
var require_lib = __commonJS({
  "node_modules/glamor/lib/index.js"(exports) {
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.compose = exports.merge = exports.$ = exports.style = exports.presets = exports.keyframes = exports.fontFace = exports.insertGlobal = exports.insertRule = exports.plugins = exports.styleSheet = void 0;
    exports.speedy = speedy;
    exports.simulations = simulations;
    exports.simulate = simulate;
    exports.cssLabels = cssLabels;
    exports.isLikeRule = isLikeRule;
    exports.idFor = idFor;
    exports.css = css;
    exports.rehydrate = rehydrate;
    exports.flush = flush;
    exports.select = select;
    exports.parent = parent;
    exports.media = media;
    exports.pseudo = pseudo;
    exports.active = active;
    exports.any = any;
    exports.checked = checked;
    exports.disabled = disabled;
    exports.empty = empty;
    exports.enabled = enabled;
    exports._default = _default;
    exports.first = first;
    exports.firstChild = firstChild;
    exports.firstOfType = firstOfType;
    exports.fullscreen = fullscreen;
    exports.focus = focus;
    exports.hover = hover;
    exports.indeterminate = indeterminate;
    exports.inRange = inRange;
    exports.invalid = invalid;
    exports.lastChild = lastChild;
    exports.lastOfType = lastOfType;
    exports.left = left;
    exports.link = link;
    exports.onlyChild = onlyChild;
    exports.onlyOfType = onlyOfType;
    exports.optional = optional;
    exports.outOfRange = outOfRange;
    exports.readOnly = readOnly;
    exports.readWrite = readWrite;
    exports.required = required;
    exports.right = right;
    exports.root = root;
    exports.scope = scope;
    exports.target = target;
    exports.valid = valid;
    exports.visited = visited;
    exports.dir = dir;
    exports.lang = lang;
    exports.not = not;
    exports.nthChild = nthChild;
    exports.nthLastChild = nthLastChild;
    exports.nthLastOfType = nthLastOfType;
    exports.nthOfType = nthOfType;
    exports.after = after;
    exports.before = before;
    exports.firstLetter = firstLetter;
    exports.firstLine = firstLine;
    exports.selection = selection;
    exports.backdrop = backdrop;
    exports.placeholder = placeholder;
    exports.cssFor = cssFor;
    exports.attribsFor = attribsFor;
    var _objectAssign = require_object_assign();
    var _objectAssign2 = _interopRequireDefault(_objectAssign);
    var _sheet = require_sheet();
    var _CSSPropertyOperations = require_CSSPropertyOperations();
    var _clean = require_clean();
    var _clean2 = _interopRequireDefault(_clean);
    var _plugins = require_plugins();
    var _hash = require_hash();
    var _hash2 = _interopRequireDefault(_hash);
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    function _toConsumableArray(arr) {
      if (Array.isArray(arr)) {
        for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
          arr2[i] = arr[i];
        }
        return arr2;
      } else {
        return Array.from(arr);
      }
    }
    function _defineProperty(obj, key, value) {
      if (key in obj) {
        Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
      } else {
        obj[key] = value;
      }
      return obj;
    }
    var styleSheet = exports.styleSheet = new _sheet.StyleSheet();
    styleSheet.inject();
    function speedy(bool) {
      return styleSheet.speedy(bool);
    }
    var plugins = exports.plugins = styleSheet.plugins = new _plugins.PluginSet([_plugins.prefixes, _plugins.contentWrap, _plugins.fallbacks]);
    plugins.media = new _plugins.PluginSet();
    plugins.fontFace = new _plugins.PluginSet();
    plugins.keyframes = new _plugins.PluginSet([_plugins.prefixes, _plugins.fallbacks]);
    var isDev = true;
    var isTest = false;
    var isBrowser = typeof window !== "undefined";
    var canSimulate = isDev;
    var warned1 = false;
    var warned2 = false;
    function simulations() {
      var bool = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : true;
      canSimulate = !!bool;
    }
    function simulate() {
      for (var _len = arguments.length, pseudos = Array(_len), _key = 0; _key < _len; _key++) {
        pseudos[_key] = arguments[_key];
      }
      pseudos = (0, _clean2.default)(pseudos);
      if (!pseudos)
        return {};
      if (!canSimulate) {
        if (!warned1) {
          console.warn("can't simulate without once calling simulations(true)");
          warned1 = true;
        }
        if (!isDev && !isTest && !warned2) {
          console.warn("don't use simulation outside dev");
          warned2 = true;
        }
        return {};
      }
      return pseudos.reduce(function(o, p) {
        return o["data-simulate-" + simple(p)] = "", o;
      }, {});
    }
    var hasLabels = isDev;
    function cssLabels(bool) {
      hasLabels = !!bool;
    }
    function simple(str) {
      var char = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
      return str.toLowerCase().replace(/[^a-z0-9]/g, char);
    }
    function hashify(obj) {
      var str = JSON.stringify(obj);
      var toRet = (0, _hash2.default)(str).toString(36);
      if (obj.label && obj.label.length > 0 && isDev) {
        return simple(obj.label.join("."), "-") + "-" + toRet;
      }
      return toRet;
    }
    function isLikeRule(rule) {
      var keys = Object.keys(rule).filter(function(x) {
        return x !== "toString";
      });
      if (keys.length !== 1) {
        return false;
      }
      return !!/data\-css\-([a-zA-Z0-9\-_]+)/.exec(keys[0]);
    }
    function idFor(rule) {
      var keys = Object.keys(rule).filter(function(x) {
        return x !== "toString";
      });
      if (keys.length !== 1)
        throw new Error("not a rule");
      var regex = /data\-css\-([a-zA-Z0-9\-_]+)/;
      var match = regex.exec(keys[0]);
      if (!match)
        throw new Error("not a rule");
      return match[1];
    }
    var selectorTokenizer = /[(),]|"(?:\\.|[^"\n])*"|'(?:\\.|[^'\n])*'|\/\*[\s\S]*?\*\//g;
    function splitSelector(selector2) {
      if (selector2.indexOf(",") === -1) {
        return [selector2];
      }
      var indices = [], res = [], inParen = 0, o;
      while (o = selectorTokenizer.exec(selector2)) {
        switch (o[0]) {
          case "(":
            inParen++;
            break;
          case ")":
            inParen--;
            break;
          case ",":
            if (inParen)
              break;
            indices.push(o.index);
        }
      }
      for (o = indices.length; o--; ) {
        res.unshift(selector2.slice(indices[o] + 1));
        selector2 = selector2.slice(0, indices[o]);
      }
      res.unshift(selector2);
      return res;
    }
    function selector(id, path) {
      if (!id) {
        return path.replace(/\&/g, "");
      }
      if (!path)
        return ".css-" + id + ",[data-css-" + id + "]";
      var x = splitSelector(path).map(function(x2) {
        return x2.indexOf("&") >= 0 ? [x2.replace(/\&/mg, ".css-" + id), x2.replace(/\&/mg, "[data-css-" + id + "]")].join(",") : ".css-" + id + x2 + ",[data-css-" + id + "]" + x2;
      }).join(",");
      if (canSimulate && /^\&\:/.exec(path) && !/\s/.exec(path)) {
        x += ",.css-" + id + "[data-simulate-" + simple(path) + "],[data-css-" + id + "][data-simulate-" + simple(path) + "]";
      }
      return x;
    }
    function toCSS(_ref) {
      var selector2 = _ref.selector, style2 = _ref.style;
      var result = plugins.transform({ selector: selector2, style: style2 });
      return result.selector + "{" + (0, _CSSPropertyOperations.createMarkupForStyles)(result.style) + "}";
    }
    function deconstruct(style2) {
      var plain = void 0, selects = void 0, medias = void 0, supports = void 0;
      Object.keys(style2).forEach(function(key) {
        if (key.indexOf("&") >= 0) {
          selects = selects || {};
          selects[key] = style2[key];
        } else if (key.indexOf("@media") === 0) {
          medias = medias || {};
          medias[key] = deconstruct(style2[key]);
        } else if (key.indexOf("@supports") === 0) {
          supports = supports || {};
          supports[key] = deconstruct(style2[key]);
        } else if (key === "label") {
          if (style2.label.length > 0) {
            plain = plain || {};
            plain.label = hasLabels ? style2.label.join(".") : "";
          }
        } else {
          plain = plain || {};
          plain[key] = style2[key];
        }
      });
      return { plain, selects, medias, supports };
    }
    function deconstructedStyleToCSS(id, style2) {
      var css2 = [];
      var plain = style2.plain, selects = style2.selects, medias = style2.medias, supports = style2.supports;
      if (plain) {
        css2.push(toCSS({ style: plain, selector: selector(id) }));
      }
      if (selects) {
        Object.keys(selects).forEach(function(key) {
          return css2.push(toCSS({ style: selects[key], selector: selector(id, key) }));
        });
      }
      if (medias) {
        Object.keys(medias).forEach(function(key) {
          return css2.push(key + "{" + deconstructedStyleToCSS(id, medias[key]).join("") + "}");
        });
      }
      if (supports) {
        Object.keys(supports).forEach(function(key) {
          return css2.push(key + "{" + deconstructedStyleToCSS(id, supports[key]).join("") + "}");
        });
      }
      return css2;
    }
    var inserted = styleSheet.inserted = {};
    function insert(spec) {
      if (!inserted[spec.id]) {
        inserted[spec.id] = true;
        var deconstructed = deconstruct(spec.style);
        var rules = deconstructedStyleToCSS(spec.id, deconstructed);
        inserted[spec.id] = isBrowser ? true : rules;
        rules.forEach(function(cssRule) {
          return styleSheet.insert(cssRule);
        });
      }
    }
    var registered = styleSheet.registered = {};
    function register(spec) {
      if (!registered[spec.id]) {
        registered[spec.id] = spec;
      }
    }
    function _getRegistered(rule) {
      if (isLikeRule(rule)) {
        var ret = registered[idFor(rule)];
        if (ret == null) {
          throw new Error("[glamor] an unexpected rule cache miss occurred. This is probably a sign of multiple glamor instances in your app. See https://github.com/threepointone/glamor/issues/79");
        }
        return ret;
      }
      return rule;
    }
    var ruleCache = {};
    function toRule(spec) {
      register(spec);
      insert(spec);
      if (ruleCache[spec.id]) {
        return ruleCache[spec.id];
      }
      var ret = _defineProperty({}, "data-css-" + spec.id, hasLabels ? spec.label || "" : "");
      Object.defineProperty(ret, "toString", {
        enumerable: false,
        value: function value() {
          return "css-" + spec.id;
        }
      });
      ruleCache[spec.id] = ret;
      return ret;
    }
    function isSelector(key) {
      var possibles = [":", ".", "[", ">", " "], found = false, ch = key.charAt(0);
      for (var i = 0; i < possibles.length; i++) {
        if (ch === possibles[i]) {
          found = true;
          break;
        }
      }
      return found || key.indexOf("&") >= 0;
    }
    function joinSelectors(a, b) {
      var as = splitSelector(a).map(function(a2) {
        return !(a2.indexOf("&") >= 0) ? "&" + a2 : a2;
      });
      var bs = splitSelector(b).map(function(b2) {
        return !(b2.indexOf("&") >= 0) ? "&" + b2 : b2;
      });
      return bs.reduce(function(arr, b2) {
        return arr.concat(as.map(function(a2) {
          return b2.replace(/\&/g, a2);
        }));
      }, []).join(",");
    }
    function joinMediaQueries(a, b) {
      return a ? "@media " + a.substring(6) + " and " + b.substring(6) : b;
    }
    function isMediaQuery(key) {
      return key.indexOf("@media") === 0;
    }
    function isSupports(key) {
      return key.indexOf("@supports") === 0;
    }
    function joinSupports(a, b) {
      return a ? "@supports " + a.substring(9) + " and " + b.substring(9) : b;
    }
    function flatten(inArr) {
      var arr = [];
      for (var i = 0; i < inArr.length; i++) {
        if (Array.isArray(inArr[i]))
          arr = arr.concat(flatten(inArr[i]));
        else
          arr = arr.concat(inArr[i]);
      }
      return arr;
    }
    var prefixedPseudoSelectors = {
      "::placeholder": ["::-webkit-input-placeholder", "::-moz-placeholder", "::-ms-input-placeholder"],
      ":fullscreen": [":-webkit-full-screen", ":-moz-full-screen", ":-ms-fullscreen"]
      // mutable! modifies dest.
    };
    function build(dest, _ref2) {
      var _ref2$selector = _ref2.selector, selector2 = _ref2$selector === void 0 ? "" : _ref2$selector, _ref2$mq = _ref2.mq, mq = _ref2$mq === void 0 ? "" : _ref2$mq, _ref2$supp = _ref2.supp, supp = _ref2$supp === void 0 ? "" : _ref2$supp, _ref2$src = _ref2.src, src = _ref2$src === void 0 ? {} : _ref2$src;
      if (!Array.isArray(src)) {
        src = [src];
      }
      src = flatten(src);
      src.forEach(function(_src) {
        if (isLikeRule(_src)) {
          var reg = _getRegistered(_src);
          if (reg.type !== "css") {
            throw new Error("cannot merge this rule");
          }
          _src = reg.style;
        }
        _src = (0, _clean2.default)(_src);
        if (_src && _src.composes) {
          build(dest, { selector: selector2, mq, supp, src: _src.composes });
        }
        Object.keys(_src || {}).forEach(function(key) {
          if (isSelector(key)) {
            if (prefixedPseudoSelectors[key]) {
              prefixedPseudoSelectors[key].forEach(function(p) {
                return build(dest, { selector: joinSelectors(selector2, p), mq, supp, src: _src[key] });
              });
            }
            build(dest, { selector: joinSelectors(selector2, key), mq, supp, src: _src[key] });
          } else if (isMediaQuery(key)) {
            build(dest, { selector: selector2, mq: joinMediaQueries(mq, key), supp, src: _src[key] });
          } else if (isSupports(key)) {
            build(dest, { selector: selector2, mq, supp: joinSupports(supp, key), src: _src[key] });
          } else if (key === "composes") {
          } else {
            var _dest = dest;
            if (supp) {
              _dest[supp] = _dest[supp] || {};
              _dest = _dest[supp];
            }
            if (mq) {
              _dest[mq] = _dest[mq] || {};
              _dest = _dest[mq];
            }
            if (selector2) {
              _dest[selector2] = _dest[selector2] || {};
              _dest = _dest[selector2];
            }
            if (key === "label") {
              if (hasLabels) {
                dest.label = dest.label.concat(_src.label);
              }
            } else {
              _dest[key] = _src[key];
            }
          }
        });
      });
    }
    function _css(rules) {
      var style2 = { label: [] };
      build(style2, { src: rules });
      var spec = {
        id: hashify(style2),
        style: style2,
        label: hasLabels ? style2.label.join(".") : "",
        type: "css"
      };
      return toRule(spec);
    }
    var nullrule = {
      // 'data-css-nil': ''
    };
    Object.defineProperty(nullrule, "toString", {
      enumerable: false,
      value: function value() {
        return "css-nil";
      }
    });
    var inputCaches = typeof WeakMap !== "undefined" ? [nullrule, /* @__PURE__ */ new WeakMap(), /* @__PURE__ */ new WeakMap(), /* @__PURE__ */ new WeakMap()] : [nullrule];
    var warnedWeakMapError = false;
    function multiIndexCache(fn) {
      return function(args) {
        if (inputCaches[args.length]) {
          var coi = inputCaches[args.length];
          var ctr = 0;
          while (ctr < args.length - 1) {
            if (!coi.has(args[ctr])) {
              coi.set(args[ctr], /* @__PURE__ */ new WeakMap());
            }
            coi = coi.get(args[ctr]);
            ctr++;
          }
          if (coi.has(args[args.length - 1])) {
            var ret = coi.get(args[ctr]);
            if (registered[ret.toString().substring(4)]) {
              return ret;
            }
          }
        }
        var value = fn(args);
        if (inputCaches[args.length]) {
          var _ctr = 0, _coi = inputCaches[args.length];
          while (_ctr < args.length - 1) {
            _coi = _coi.get(args[_ctr]);
            _ctr++;
          }
          try {
            _coi.set(args[_ctr], value);
          } catch (err) {
            if (isDev && !warnedWeakMapError) {
              var _console;
              warnedWeakMapError = true;
              (_console = console).warn.apply(_console, ["failed setting the WeakMap cache for args:"].concat(_toConsumableArray(args)));
              console.warn("this should NOT happen, please file a bug on the github repo.");
            }
          }
        }
        return value;
      };
    }
    var cachedCss = typeof WeakMap !== "undefined" ? multiIndexCache(_css) : _css;
    function css() {
      for (var _len2 = arguments.length, rules = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        rules[_key2] = arguments[_key2];
      }
      if (rules[0] && rules[0].length && rules[0].raw) {
        throw new Error("you forgot to include glamor/babel in your babel plugins.");
      }
      rules = (0, _clean2.default)(rules);
      if (!rules) {
        return nullrule;
      }
      return cachedCss(rules);
    }
    css.insert = function(css2) {
      var spec = {
        id: hashify(css2),
        css: css2,
        type: "raw"
      };
      register(spec);
      if (!inserted[spec.id]) {
        styleSheet.insert(spec.css);
        inserted[spec.id] = isBrowser ? true : [spec.css];
      }
    };
    var insertRule = exports.insertRule = css.insert;
    css.global = function(selector2, style2) {
      style2 = (0, _clean2.default)(style2);
      if (style2) {
        return css.insert(toCSS({ selector: selector2, style: style2 }));
      }
    };
    var insertGlobal = exports.insertGlobal = css.global;
    function insertKeyframe(spec) {
      if (!inserted[spec.id]) {
        var inner = Object.keys(spec.keyframes).map(function(kf) {
          var result = plugins.keyframes.transform({ id: spec.id, name: kf, style: spec.keyframes[kf] });
          return result.name + "{" + (0, _CSSPropertyOperations.createMarkupForStyles)(result.style) + "}";
        }).join("");
        var rules = ["-webkit-", "-moz-", "-o-", ""].map(function(prefix) {
          return "@" + prefix + "keyframes " + (spec.name + "_" + spec.id) + "{" + inner + "}";
        });
        rules.forEach(function(rule) {
          return styleSheet.insert(rule);
        });
        inserted[spec.id] = isBrowser ? true : rules;
      }
    }
    css.keyframes = function(name, kfs) {
      if (!kfs) {
        kfs = name, name = "animation";
      }
      kfs = (0, _clean2.default)(kfs) || {};
      var spec = {
        id: hashify({ name, kfs }),
        type: "keyframes",
        name,
        keyframes: kfs
      };
      register(spec);
      insertKeyframe(spec);
      return name + "_" + spec.id;
    };
    css.fontFace = function(font) {
      font = (0, _clean2.default)(font);
      var spec = {
        id: hashify(font),
        type: "font-face",
        font
      };
      register(spec);
      insertFontFace(spec);
      return font.fontFamily;
    };
    var fontFace = exports.fontFace = css.fontFace;
    var keyframes = exports.keyframes = css.keyframes;
    function insertFontFace(spec) {
      if (!inserted[spec.id]) {
        var rule = "@font-face{" + (0, _CSSPropertyOperations.createMarkupForStyles)(spec.font) + "}";
        styleSheet.insert(rule);
        inserted[spec.id] = isBrowser ? true : [rule];
      }
    }
    function rehydrate(ids) {
      (0, _objectAssign2.default)(inserted, ids.reduce(function(o, i) {
        return o[i] = true, o;
      }, {}));
    }
    function flush() {
      inserted = styleSheet.inserted = {};
      registered = styleSheet.registered = {};
      ruleCache = {};
      styleSheet.flush();
      styleSheet.inject();
    }
    var presets = exports.presets = {
      mobile: "(min-width: 400px)",
      Mobile: "@media (min-width: 400px)",
      phablet: "(min-width: 550px)",
      Phablet: "@media (min-width: 550px)",
      tablet: "(min-width: 750px)",
      Tablet: "@media (min-width: 750px)",
      desktop: "(min-width: 1000px)",
      Desktop: "@media (min-width: 1000px)",
      hd: "(min-width: 1200px)",
      Hd: "@media (min-width: 1200px)"
    };
    var style = exports.style = css;
    function select(selector2) {
      for (var _len3 = arguments.length, styles = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        styles[_key3 - 1] = arguments[_key3];
      }
      if (!selector2) {
        return style(styles);
      }
      return css(_defineProperty({}, selector2, styles));
    }
    var $ = exports.$ = select;
    function parent(selector2) {
      for (var _len4 = arguments.length, styles = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
        styles[_key4 - 1] = arguments[_key4];
      }
      return css(_defineProperty({}, selector2 + " &", styles));
    }
    var merge = exports.merge = css;
    var compose = exports.compose = css;
    function media(query) {
      for (var _len5 = arguments.length, rules = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
        rules[_key5 - 1] = arguments[_key5];
      }
      return css(_defineProperty({}, "@media " + query, rules));
    }
    function pseudo(selector2) {
      for (var _len6 = arguments.length, styles = Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
        styles[_key6 - 1] = arguments[_key6];
      }
      return css(_defineProperty({}, selector2, styles));
    }
    function active(x) {
      return pseudo(":active", x);
    }
    function any(x) {
      return pseudo(":any", x);
    }
    function checked(x) {
      return pseudo(":checked", x);
    }
    function disabled(x) {
      return pseudo(":disabled", x);
    }
    function empty(x) {
      return pseudo(":empty", x);
    }
    function enabled(x) {
      return pseudo(":enabled", x);
    }
    function _default(x) {
      return pseudo(":default", x);
    }
    function first(x) {
      return pseudo(":first", x);
    }
    function firstChild(x) {
      return pseudo(":first-child", x);
    }
    function firstOfType(x) {
      return pseudo(":first-of-type", x);
    }
    function fullscreen(x) {
      return pseudo(":fullscreen", x);
    }
    function focus(x) {
      return pseudo(":focus", x);
    }
    function hover(x) {
      return pseudo(":hover", x);
    }
    function indeterminate(x) {
      return pseudo(":indeterminate", x);
    }
    function inRange(x) {
      return pseudo(":in-range", x);
    }
    function invalid(x) {
      return pseudo(":invalid", x);
    }
    function lastChild(x) {
      return pseudo(":last-child", x);
    }
    function lastOfType(x) {
      return pseudo(":last-of-type", x);
    }
    function left(x) {
      return pseudo(":left", x);
    }
    function link(x) {
      return pseudo(":link", x);
    }
    function onlyChild(x) {
      return pseudo(":only-child", x);
    }
    function onlyOfType(x) {
      return pseudo(":only-of-type", x);
    }
    function optional(x) {
      return pseudo(":optional", x);
    }
    function outOfRange(x) {
      return pseudo(":out-of-range", x);
    }
    function readOnly(x) {
      return pseudo(":read-only", x);
    }
    function readWrite(x) {
      return pseudo(":read-write", x);
    }
    function required(x) {
      return pseudo(":required", x);
    }
    function right(x) {
      return pseudo(":right", x);
    }
    function root(x) {
      return pseudo(":root", x);
    }
    function scope(x) {
      return pseudo(":scope", x);
    }
    function target(x) {
      return pseudo(":target", x);
    }
    function valid(x) {
      return pseudo(":valid", x);
    }
    function visited(x) {
      return pseudo(":visited", x);
    }
    function dir(p, x) {
      return pseudo(":dir(" + p + ")", x);
    }
    function lang(p, x) {
      return pseudo(":lang(" + p + ")", x);
    }
    function not(p, x) {
      var selector2 = p.split(",").map(function(x2) {
        return x2.trim();
      }).map(function(x2) {
        return ":not(" + x2 + ")";
      });
      if (selector2.length === 1) {
        return pseudo(":not(" + p + ")", x);
      }
      return select(selector2.join(""), x);
    }
    function nthChild(p, x) {
      return pseudo(":nth-child(" + p + ")", x);
    }
    function nthLastChild(p, x) {
      return pseudo(":nth-last-child(" + p + ")", x);
    }
    function nthLastOfType(p, x) {
      return pseudo(":nth-last-of-type(" + p + ")", x);
    }
    function nthOfType(p, x) {
      return pseudo(":nth-of-type(" + p + ")", x);
    }
    function after(x) {
      return pseudo("::after", x);
    }
    function before(x) {
      return pseudo("::before", x);
    }
    function firstLetter(x) {
      return pseudo("::first-letter", x);
    }
    function firstLine(x) {
      return pseudo("::first-line", x);
    }
    function selection(x) {
      return pseudo("::selection", x);
    }
    function backdrop(x) {
      return pseudo("::backdrop", x);
    }
    function placeholder(x) {
      return css({ "::placeholder": x });
    }
    function cssFor() {
      for (var _len7 = arguments.length, rules = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
        rules[_key7] = arguments[_key7];
      }
      rules = (0, _clean2.default)(rules);
      return rules ? rules.map(function(r) {
        var style2 = { label: [] };
        build(style2, { src: r });
        return deconstructedStyleToCSS(hashify(style2), deconstruct(style2)).join("");
      }).join("") : "";
    }
    function attribsFor() {
      for (var _len8 = arguments.length, rules = Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
        rules[_key8] = arguments[_key8];
      }
      rules = (0, _clean2.default)(rules);
      var htmlAttributes = rules ? rules.map(function(rule) {
        idFor(rule);
        var key = Object.keys(rule)[0], value = rule[key];
        return key + '="' + (value || "") + '"';
      }).join(" ") : "";
      return htmlAttributes;
    }
  }
});
export default require_lib();
//# sourceMappingURL=glamor.js.map
