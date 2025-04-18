"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _connectdb = _interopRequireDefault(require("../config/connectdb.js"));
var _my_logger = _interopRequireDefault(require("../services/my_logger.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var AdvisingModel = /*#__PURE__*/function () {
  function AdvisingModel() {
    _classCallCheck(this, AdvisingModel);
  }
  return _createClass(AdvisingModel, null, [{
    key: "getAllRecords",
    value: (
    /**
     *Get all advising records
     */
    function () {
      var _getAllRecords = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
        var _yield$pool$execute, _yield$pool$execute2, rows;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return _connectdb["default"].execute("SELECT * FROM courseadvising ORDER BY date DESC");
            case 3:
              _yield$pool$execute = _context.sent;
              _yield$pool$execute2 = _slicedToArray(_yield$pool$execute, 1);
              rows = _yield$pool$execute2[0];
              // Convert `planned_courses` from JSON string to object
              rows.forEach(function (row) {
                if (typeof row.planned_courses === "string") {
                  row.planned_courses = JSON.parse(row.planned_courses);
                }
              });
              _my_logger["default"].info("Retrieved ".concat(rows.length, " advising records."));
              return _context.abrupt("return", rows);
            case 11:
              _context.prev = 11;
              _context.t0 = _context["catch"](0);
              _my_logger["default"].error(" Error fetching all advising records:", _context.t0.message);
              throw _context.t0;
            case 15:
            case "end":
              return _context.stop();
          }
        }, _callee, null, [[0, 11]]);
      }));
      function getAllRecords() {
        return _getAllRecords.apply(this, arguments);
      }
      return getAllRecords;
    }()
    /**
     *Get records by student email
     */
    )
  }, {
    key: "getRecordsByEmail",
    value: (function () {
      var _getRecordsByEmail = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(studentEmail) {
        var _yield$pool$execute3, _yield$pool$execute4, rows;
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              _context2.next = 3;
              return _connectdb["default"].execute("SELECT * FROM courseadvising WHERE student_email = ? ORDER BY date DESC", [studentEmail]);
            case 3:
              _yield$pool$execute3 = _context2.sent;
              _yield$pool$execute4 = _slicedToArray(_yield$pool$execute3, 1);
              rows = _yield$pool$execute4[0];
              if (rows.length === 0) {
                _my_logger["default"].warn("No advising records found for ".concat(studentEmail));
              }

              // Convert `planned_courses` from JSON string to object
              rows.forEach(function (row) {
                if (typeof row.planned_courses === "string") {
                  row.planned_courses = JSON.parse(row.planned_courses);
                }
              });
              return _context2.abrupt("return", rows);
            case 11:
              _context2.prev = 11;
              _context2.t0 = _context2["catch"](0);
              _my_logger["default"].error(" Error fetching advising records for ".concat(studentEmail, ":"), _context2.t0.message);
              throw _context2.t0;
            case 15:
            case "end":
              return _context2.stop();
          }
        }, _callee2, null, [[0, 11]]);
      }));
      function getRecordsByEmail(_x) {
        return _getRecordsByEmail.apply(this, arguments);
      }
      return getRecordsByEmail;
    }()
    /**
     *Create a new advising record
     */
    )
  }, {
    key: "createAdvisingRecord",
    value: (function () {
      var _createAdvisingRecord = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3(_ref) {
        var date, current_term, last_term, last_gpa, prerequisites, student_name, planned_courses, student_email, _yield$pool$execute5, _yield$pool$execute6, result;
        return _regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              date = _ref.date, current_term = _ref.current_term, last_term = _ref.last_term, last_gpa = _ref.last_gpa, prerequisites = _ref.prerequisites, student_name = _ref.student_name, planned_courses = _ref.planned_courses, student_email = _ref.student_email;
              _context3.prev = 1;
              if (!(!student_email || !current_term || !planned_courses)) {
                _context3.next = 4;
                break;
              }
              throw new Error(" Missing required fields: student_email, current_term, or planned_courses");
            case 4:
              _context3.next = 6;
              return _connectdb["default"].execute("INSERT INTO courseadvising \n         (date, current_term, status, last_term, last_gpa, prerequisites, \n          student_name, planned_courses, student_email, rejectionReason)\n         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [date || new Date().toISOString().split("T")[0],
              // Default to today's date
              current_term, "Pending",
              // Default status
              last_term, last_gpa, prerequisites || "None", student_name, JSON.stringify(planned_courses),
              // Ensure planned_courses is stored as JSON
              student_email, "N/A" // Default rejection reason
              ]);
            case 6:
              _yield$pool$execute5 = _context3.sent;
              _yield$pool$execute6 = _slicedToArray(_yield$pool$execute5, 1);
              result = _yield$pool$execute6[0];
              _my_logger["default"].info("New advising record created for ".concat(student_email, " (ID: ").concat(result.insertId, ")"));
              return _context3.abrupt("return", {
                id: result.insertId
              });
            case 13:
              _context3.prev = 13;
              _context3.t0 = _context3["catch"](1);
              _my_logger["default"].error(" Error creating new advising record:", _context3.t0.message);
              throw _context3.t0;
            case 17:
            case "end":
              return _context3.stop();
          }
        }, _callee3, null, [[1, 13]]);
      }));
      function createAdvisingRecord(_x2) {
        return _createAdvisingRecord.apply(this, arguments);
      }
      return createAdvisingRecord;
    }() // In your AdvisingModel.js
    )
  }, {
    key: "updateRecordById",
    value: function () {
      var _updateRecordById = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4(id, data) {
        var date, current_term, last_term, last_gpa, prerequisites, student_name, planned_courses, _yield$pool$execute7, _yield$pool$execute8, result;
        return _regeneratorRuntime().wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              _context4.prev = 0;
              date = data.date, current_term = data.current_term, last_term = data.last_term, last_gpa = data.last_gpa, prerequisites = data.prerequisites, student_name = data.student_name, planned_courses = data.planned_courses;
              _context4.next = 4;
              return _connectdb["default"].execute("UPDATE courseadvising \n       SET date = ?, \n           current_term = ?, \n           last_term = ?, \n           last_gpa = ?, \n           prerequisites = ?, \n           student_name = ?, \n           planned_courses = ?\n       WHERE id = ?", [date, current_term, last_term, last_gpa, prerequisites || "None", student_name, JSON.stringify(planned_courses), id]);
            case 4:
              _yield$pool$execute7 = _context4.sent;
              _yield$pool$execute8 = _slicedToArray(_yield$pool$execute7, 1);
              result = _yield$pool$execute8[0];
              return _context4.abrupt("return", result);
            case 10:
              _context4.prev = 10;
              _context4.t0 = _context4["catch"](0);
              _my_logger["default"].error("Error updating record ".concat(id, ":"), _context4.t0.message);
              throw _context4.t0;
            case 14:
            case "end":
              return _context4.stop();
          }
        }, _callee4, null, [[0, 10]]);
      }));
      function updateRecordById(_x3, _x4) {
        return _updateRecordById.apply(this, arguments);
      }
      return updateRecordById;
    }()
    /**
     *Update record status (and rejectionReason) by ID
     */
  }, {
    key: "updateStatusById",
    value: (function () {
      var _updateStatusById = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5(id, status) {
        var rejectionReason,
          _yield$pool$execute9,
          _yield$pool$execute10,
          result,
          _args5 = arguments;
        return _regeneratorRuntime().wrap(function _callee5$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              rejectionReason = _args5.length > 2 && _args5[2] !== undefined ? _args5[2] : "N/A";
              _context5.prev = 1;
              _context5.next = 4;
              return _connectdb["default"].execute("UPDATE courseadvising SET status=?, rejectionReason=? WHERE id=?", [status, rejectionReason, id]);
            case 4:
              _yield$pool$execute9 = _context5.sent;
              _yield$pool$execute10 = _slicedToArray(_yield$pool$execute9, 1);
              result = _yield$pool$execute10[0];
              if (!(result.affectedRows === 0)) {
                _context5.next = 10;
                break;
              }
              _my_logger["default"].warn("No advising record found for ID ".concat(id));
              return _context5.abrupt("return", false);
            case 10:
              _my_logger["default"].info("Advising record ID ".concat(id, " updated to status: ").concat(status));
              return _context5.abrupt("return", true);
            case 14:
              _context5.prev = 14;
              _context5.t0 = _context5["catch"](1);
              _my_logger["default"].error(" Error updating status for record ".concat(id, ":"), _context5.t0.message);
              throw _context5.t0;
            case 18:
            case "end":
              return _context5.stop();
          }
        }, _callee5, null, [[1, 14]]);
      }));
      function updateStatusById(_x5, _x6) {
        return _updateStatusById.apply(this, arguments);
      }
      return updateStatusById;
    }()
    /**
     *Get an advising record by its ID
     */
    )
  }, {
    key: "getRecordById",
    value: (function () {
      var _getRecordById = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee6(id) {
        var _yield$pool$execute11, _yield$pool$execute12, rows;
        return _regeneratorRuntime().wrap(function _callee6$(_context6) {
          while (1) switch (_context6.prev = _context6.next) {
            case 0:
              _context6.prev = 0;
              _context6.next = 3;
              return _connectdb["default"].execute("SELECT * FROM courseadvising WHERE id = ?", [id]);
            case 3:
              _yield$pool$execute11 = _context6.sent;
              _yield$pool$execute12 = _slicedToArray(_yield$pool$execute11, 1);
              rows = _yield$pool$execute12[0];
              if (!(rows.length === 0)) {
                _context6.next = 9;
                break;
              }
              _my_logger["default"].warn("No advising record found with ID ".concat(id));
              return _context6.abrupt("return", null);
            case 9:
              // Convert `planned_courses` from JSON string to object
              if (typeof rows[0].planned_courses === "string") {
                rows[0].planned_courses = JSON.parse(rows[0].planned_courses);
              }
              _my_logger["default"].info("Advising record ID ".concat(id, " retrieved successfully."));
              return _context6.abrupt("return", rows[0]);
            case 14:
              _context6.prev = 14;
              _context6.t0 = _context6["catch"](0);
              _my_logger["default"].error(" Error fetching advising record for ID ".concat(id, ":"), _context6.t0.message);
              throw _context6.t0;
            case 18:
            case "end":
              return _context6.stop();
          }
        }, _callee6, null, [[0, 14]]);
      }));
      function getRecordById(_x7) {
        return _getRecordById.apply(this, arguments);
      }
      return getRecordById;
    }()
    /**
     *Get student email by record ID (for notifications)
     */
    )
  }, {
    key: "getStudentEmailById",
    value: (function () {
      var _getStudentEmailById = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee7(id) {
        var _yield$pool$execute13, _yield$pool$execute14, rows;
        return _regeneratorRuntime().wrap(function _callee7$(_context7) {
          while (1) switch (_context7.prev = _context7.next) {
            case 0:
              _context7.prev = 0;
              _context7.next = 3;
              return _connectdb["default"].execute("SELECT student_email FROM courseadvising WHERE id = ?", [id]);
            case 3:
              _yield$pool$execute13 = _context7.sent;
              _yield$pool$execute14 = _slicedToArray(_yield$pool$execute13, 1);
              rows = _yield$pool$execute14[0];
              if (!(rows.length === 0)) {
                _context7.next = 9;
                break;
              }
              _my_logger["default"].warn("No email found for advising record ID ".concat(id));
              return _context7.abrupt("return", null);
            case 9:
              return _context7.abrupt("return", rows[0].student_email);
            case 12:
              _context7.prev = 12;
              _context7.t0 = _context7["catch"](0);
              _my_logger["default"].error(" Error retrieving student email for record ".concat(id, ":"), _context7.t0.message);
              throw _context7.t0;
            case 16:
            case "end":
              return _context7.stop();
          }
        }, _callee7, null, [[0, 12]]);
      }));
      function getStudentEmailById(_x8) {
        return _getStudentEmailById.apply(this, arguments);
      }
      return getStudentEmailById;
    }())
  }]);
}();
var _default = exports["default"] = AdvisingModel;