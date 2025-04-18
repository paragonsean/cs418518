"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _advising_model = _interopRequireDefault(require("../models/advising_model.js"));
var _user_model = _interopRequireDefault(require("../models/user_model.js"));
var _email_service = require("../services/email_service.js");
var _my_logger = _interopRequireDefault(require("../services/my_logger.js"));
var _completed_courses_model = _interopRequireDefault(require("../models/completed_courses_model.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } // File: src/controllers/AdminAdvisingController.js
var AdminAdvisingController = /*#__PURE__*/function () {
  function AdminAdvisingController() {
    _classCallCheck(this, AdminAdvisingController);
  }
  return _createClass(AdminAdvisingController, null, [{
    key: "updateCoursesFromAdvising",
    value: (
    /**
     * POST /api/admin/advising/:id/update-courses
     * Converts planned courses to completed courses for a given advising ID
     */
    function () {
      var _updateCoursesFromAdvising = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(req, res) {
        var advisingId, advisingRecord, studentEmail, planned_courses, term, parsedCourses, inserted, _iterator, _step, courseName;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              advisingId = req.params.id;
              _my_logger["default"].info("Starting updateCoursesFromAdvising for advisingId: ".concat(advisingId));
              _context.next = 5;
              return _advising_model["default"].getRecordById(advisingId);
            case 5:
              advisingRecord = _context.sent;
              _my_logger["default"].info("Advising record fetched:", advisingRecord);
              if (advisingRecord) {
                _context.next = 10;
                break;
              }
              _my_logger["default"].warn("No advising record found for ID: ".concat(advisingId));
              return _context.abrupt("return", res.status(404).json({
                status: "failed",
                message: "Advising record not found"
              }));
            case 10:
              _my_logger["default"].info("🔍 Full advisingRecord contents:", advisingRecord);
              studentEmail = advisingRecord.student_email, planned_courses = advisingRecord.planned_courses, term = advisingRecord.term;
              if (!(!planned_courses || !studentEmail)) {
                _context.next = 15;
                break;
              }
              _my_logger["default"].warn("Missing planned_courses or student_email");
              return _context.abrupt("return", res.status(400).json({
                status: "failed",
                message: "Missing planned courses or student email"
              }));
            case 15:
              _my_logger["default"].info("Student: ".concat(studentEmail, ", Planned Courses (raw):"), planned_courses);
              try {
                parsedCourses = Array.isArray(planned_courses) ? planned_courses : JSON.parse(planned_courses);
              } catch (parseError) {
                // Try fallback to CSV parsing
                parsedCourses = planned_courses.split(",").map(function (c) {
                  return c.trim();
                });
              }
              if (!(!Array.isArray(parsedCourses) || parsedCourses.length === 0)) {
                _context.next = 20;
                break;
              }
              _my_logger["default"].warn("Parsed courses are empty or invalid");
              return _context.abrupt("return", res.status(400).json({
                status: "failed",
                message: "Planned courses list is empty"
              }));
            case 20:
              _my_logger["default"].info("Parsed Courses: ".concat(JSON.stringify(parsedCourses)));
              inserted = [];
              _iterator = _createForOfIteratorHelper(parsedCourses);
              _context.prev = 23;
              _iterator.s();
            case 25:
              if ((_step = _iterator.n()).done) {
                _context.next = 41;
                break;
              }
              courseName = _step.value;
              _context.prev = 27;
              _my_logger["default"].info("\uD83D\uDCE6 Attempting insert: '".concat(courseName, "' for student '").concat(studentEmail, "'"));
              _context.next = 31;
              return _completed_courses_model["default"].setCompletedCourse(studentEmail, courseName, term || "Unknown", "IP");
            case 31:
              _my_logger["default"].info("\u2705 Successfully inserted: '".concat(courseName, "'"));
              inserted.push(courseName);
              _context.next = 39;
              break;
            case 35:
              _context.prev = 35;
              _context.t0 = _context["catch"](27);
              _my_logger["default"].error("\u274C Failed to insert course '".concat(courseName, "' for ").concat(studentEmail, ":"), _context.t0.message);
              console.error("🧨 Stack trace:", _context.t0);
            case 39:
              _context.next = 25;
              break;
            case 41:
              _context.next = 46;
              break;
            case 43:
              _context.prev = 43;
              _context.t1 = _context["catch"](23);
              _iterator.e(_context.t1);
            case 46:
              _context.prev = 46;
              _iterator.f();
              return _context.finish(46);
            case 49:
              _my_logger["default"].info("Completed insertion for ".concat(studentEmail, ":"), inserted);
              return _context.abrupt("return", res.status(200).json({
                status: "success",
                message: "".concat(inserted.length, " courses added to completed list"),
                insertedCourses: inserted
              }));
            case 53:
              _context.prev = 53;
              _context.t2 = _context["catch"](0);
              _my_logger["default"].error("Error in updateCoursesFromAdvising:", _context.t2.message);
              return _context.abrupt("return", res.status(500).json({
                status: "failed",
                message: "Server error"
              }));
            case 57:
            case "end":
              return _context.stop();
          }
        }, _callee, null, [[0, 53], [23, 43, 46, 49], [27, 35]]);
      }));
      function updateCoursesFromAdvising(_x, _x2) {
        return _updateCoursesFromAdvising.apply(this, arguments);
      }
      return updateCoursesFromAdvising;
    }())
  }, {
    key: "getAllAdvisingRecords",
    value: function () {
      var _getAllAdvisingRecords = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(req, res) {
        var records, normalized;
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              _context2.next = 3;
              return _advising_model["default"].getAllRecords();
            case 3:
              records = _context2.sent;
              normalized = records.map(function (r) {
                var _r$_id, _r$_id$toString;
                return {
                  id: ((_r$_id = r._id) === null || _r$_id === void 0 ? void 0 : (_r$_id$toString = _r$_id.toString) === null || _r$_id$toString === void 0 ? void 0 : _r$_id$toString.call(_r$_id)) || r.id,
                  student_name: r.student_name,
                  student_email: r.student_email,
                  term: r.term,
                  status: r.status,
                  planned_courses: r.planned_courses,
                  last_term: r.last_term,
                  last_gpa: r.last_gpa,
                  current_term: r.current_term,
                  // ✅ Include current_term
                  prerequisites: r.prerequisites,
                  // ✅ Include prerequisites
                  date: r.date,
                  feedback: r.feedback
                };
              });
              return _context2.abrupt("return", res.status(200).json(normalized));
            case 8:
              _context2.prev = 8;
              _context2.t0 = _context2["catch"](0);
              _my_logger["default"].error("Error retrieving all advising records:", _context2.t0.message);
              return _context2.abrupt("return", res.status(500).json({
                status: "failed",
                message: "Server Error: could not fetch records"
              }));
            case 12:
            case "end":
              return _context2.stop();
          }
        }, _callee2, null, [[0, 8]]);
      }));
      function getAllAdvisingRecords(_x3, _x4) {
        return _getAllAdvisingRecords.apply(this, arguments);
      }
      return getAllAdvisingRecords;
    }()
    /**
     * GET /api/admin/advising/:id
     * Fetches a single advising record by ID with normalized ID.
     */
  }, {
    key: "getAdvisingRecordById",
    value: (function () {
      var _getAdvisingRecordById = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3(req, res) {
        var _record$_id, _record$_id$toString, id, record, normalized;
        return _regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              _context3.prev = 0;
              id = req.params.id;
              _my_logger["default"].info("Fetching advising record for ID: ".concat(id));
              _context3.next = 5;
              return _advising_model["default"].getRecordById(id);
            case 5:
              record = _context3.sent;
              if (record) {
                _context3.next = 9;
                break;
              }
              _my_logger["default"].warn("No advising record found for ID: ".concat(id));
              return _context3.abrupt("return", res.status(404).json({
                message: "Record not found"
              }));
            case 9:
              normalized = {
                id: ((_record$_id = record._id) === null || _record$_id === void 0 ? void 0 : (_record$_id$toString = _record$_id.toString) === null || _record$_id$toString === void 0 ? void 0 : _record$_id$toString.call(_record$_id)) || record.id,
                student_name: record.student_name,
                student_email: record.student_email,
                term: record.term,
                status: record.status,
                planned_courses: record.planned_courses,
                last_term: record.last_term,
                last_gpa: record.last_gpa,
                current_term: record.current_term,
                // ✅ Include current_term
                prerequisites: record.prerequisites,
                // ✅ Include prerequisites
                date: record.date,
                feedback: record.feedback
              };
              return _context3.abrupt("return", res.status(200).json(normalized));
            case 13:
              _context3.prev = 13;
              _context3.t0 = _context3["catch"](0);
              _my_logger["default"].error("❌ Error in updateCoursesFromAdvising:");
              _my_logger["default"].error("🔍 Full error object:", _context3.t0); // <-- will show structured errors
              console.error("🧨 Stack Trace:", (_context3.t0 === null || _context3.t0 === void 0 ? void 0 : _context3.t0.stack) || _context3.t0); // full developer view
              return _context3.abrupt("return", res.status(500).json({
                status: "failed",
                message: "Server error",
                debug: (_context3.t0 === null || _context3.t0 === void 0 ? void 0 : _context3.t0.message) || String(_context3.t0) // visible in frontend/console
              }));
            case 19:
            case "end":
              return _context3.stop();
          }
        }, _callee3, null, [[0, 13]]);
      }));
      function getAdvisingRecordById(_x5, _x6) {
        return _getAdvisingRecordById.apply(this, arguments);
      }
      return getAdvisingRecordById;
    }() // Removed misplaced try block
    /**
     * PUT /api/admin/advising/:id
     * Updates an advising record's status and sends an email.
     */
    // Existing method to update advising status and send email
    )
  }, {
    key: "updateAdvisingStatus",
    value: function () {
      var _updateAdvisingStatus = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4(req, res) {
        var advisingId, _req$body, status, rejectionReason, feedback, result, advisingRecord, studentEmail, planned_courses, term, insertedCourses, parsedCourses, _iterator2, _step2, courseName;
        return _regeneratorRuntime().wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              _context4.prev = 0;
              advisingId = req.params.id;
              _req$body = req.body, status = _req$body.status, rejectionReason = _req$body.rejectionReason, feedback = _req$body.feedback; // Step 1: Update the advising record status
              _context4.next = 5;
              return _advising_model["default"].updateStatusById(advisingId, status, rejectionReason, feedback);
            case 5:
              result = _context4.sent;
              if (!(result.affectedRows === 0)) {
                _context4.next = 8;
                break;
              }
              return _context4.abrupt("return", res.status(404).json({
                status: "failed",
                message: "Record not found"
              }));
            case 8:
              _context4.next = 10;
              return _advising_model["default"].getRecordById(advisingId);
            case 10:
              advisingRecord = _context4.sent;
              studentEmail = advisingRecord.student_email, planned_courses = advisingRecord.planned_courses, term = advisingRecord.term;
              if (studentEmail) {
                _context4.next = 14;
                break;
              }
              return _context4.abrupt("return", res.status(500).json({
                status: "failed",
                message: "Error retrieving student's email"
              }));
            case 14:
              // Step 3: If Approved, insert planned_courses into completed_courses
              insertedCourses = [];
              if (!(status === "Approved" && planned_courses)) {
                _context4.next = 45;
                break;
              }
              try {
                parsedCourses = Array.isArray(planned_courses) ? planned_courses : JSON.parse(planned_courses);
              } catch (err) {
                parsedCourses = planned_courses.split(",").map(function (c) {
                  return c.trim();
                }).filter(Boolean);
              }
              if (!(Array.isArray(parsedCourses) && parsedCourses.length > 0)) {
                _context4.next = 44;
                break;
              }
              _iterator2 = _createForOfIteratorHelper(parsedCourses);
              _context4.prev = 19;
              _iterator2.s();
            case 21:
              if ((_step2 = _iterator2.n()).done) {
                _context4.next = 34;
                break;
              }
              courseName = _step2.value;
              _context4.prev = 23;
              _context4.next = 26;
              return _completed_courses_model["default"].setCompletedCourse(studentEmail, courseName, term || "Unknown", "IP" // In Progress
              );
            case 26:
              insertedCourses.push(courseName);
              _context4.next = 32;
              break;
            case 29:
              _context4.prev = 29;
              _context4.t0 = _context4["catch"](23);
              _my_logger["default"].error("\u274C Failed to insert completed course '".concat(courseName, "' for ").concat(studentEmail, ":"), _context4.t0.message);
            case 32:
              _context4.next = 21;
              break;
            case 34:
              _context4.next = 39;
              break;
            case 36:
              _context4.prev = 36;
              _context4.t1 = _context4["catch"](19);
              _iterator2.e(_context4.t1);
            case 39:
              _context4.prev = 39;
              _iterator2.f();
              return _context4.finish(39);
            case 42:
              _context4.next = 45;
              break;
            case 44:
              _my_logger["default"].warn("⚠️ Approved status but no valid planned_courses to insert.");
            case 45:
              // Step 4: Send the email to the student
              (0, _email_service.sendAdvisingEmail)(studentEmail, status, feedback)["catch"](function (err) {
                _my_logger["default"].error("📧 Email sending failed:", err.message);
              });

              // Step 5: Return success response
              return _context4.abrupt("return", res.status(200).json({
                status: "success",
                message: "Status updated successfully",
                insertedCourses: insertedCourses
              }));
            case 49:
              _context4.prev = 49;
              _context4.t2 = _context4["catch"](0);
              _my_logger["default"].error("\uD83D\uDCA5 Error updating advising status for ID ".concat(req.params.id, ":"), _context4.t2.message);
              console.error("🧨 Stack trace:", _context4.t2);
              return _context4.abrupt("return", res.status(500).json({
                status: "failed",
                message: "Server Error: Status not updated",
                debug: _context4.t2.message
              }));
            case 54:
            case "end":
              return _context4.stop();
          }
        }, _callee4, null, [[0, 49], [19, 36, 39, 42], [23, 29]]);
      }));
      function updateAdvisingStatus(_x7, _x8) {
        return _updateAdvisingStatus.apply(this, arguments);
      }
      return updateAdvisingStatus;
    }()
    /**
     * PUT /api/admin/advising/record/:id
     * Performs a full update of an advising record's content.
     */
  }, {
    key: "updateAdvisingRecord",
    value: (function () {
      var _updateAdvisingRecord = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5(req, res) {
        var advisingId, _req$body2, date, current_term, last_term, last_gpa, prerequisites, student_name, planned_courses, result;
        return _regeneratorRuntime().wrap(function _callee5$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              _context5.prev = 0;
              advisingId = req.params.id;
              _req$body2 = req.body, date = _req$body2.date, current_term = _req$body2.current_term, last_term = _req$body2.last_term, last_gpa = _req$body2.last_gpa, prerequisites = _req$body2.prerequisites, student_name = _req$body2.student_name, planned_courses = _req$body2.planned_courses;
              _context5.next = 5;
              return _advising_model["default"].updateRecordById(advisingId, {
                date: date,
                current_term: current_term,
                last_term: last_term,
                last_gpa: last_gpa,
                prerequisites: prerequisites,
                student_name: student_name,
                planned_courses: planned_courses
              });
            case 5:
              result = _context5.sent;
              if (!(result.affectedRows === 0)) {
                _context5.next = 8;
                break;
              }
              return _context5.abrupt("return", res.status(404).json({
                status: "failed",
                message: "Record not found"
              }));
            case 8:
              return _context5.abrupt("return", res.status(200).json({
                status: "success",
                message: "Record updated successfully"
              }));
            case 11:
              _context5.prev = 11;
              _context5.t0 = _context5["catch"](0);
              _my_logger["default"].error("Error updating advising record for ID ".concat(req.params.id, ":"), _context5.t0.message);
              return _context5.abrupt("return", res.status(500).json({
                status: "failed",
                message: "Server Error: Record not updated"
              }));
            case 15:
            case "end":
              return _context5.stop();
          }
        }, _callee5, null, [[0, 11]]);
      }));
      function updateAdvisingRecord(_x9, _x10) {
        return _updateAdvisingRecord.apply(this, arguments);
      }
      return updateAdvisingRecord;
    }()
    /**
     * GET /api/admin/students
     * Retrieves a list of all students (non-admin users).
     */
    )
  }, {
    key: "getAllStudents",
    value: (function () {
      var _getAllStudents = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee6(req, res) {
        var students;
        return _regeneratorRuntime().wrap(function _callee6$(_context6) {
          while (1) switch (_context6.prev = _context6.next) {
            case 0:
              _context6.prev = 0;
              _context6.next = 3;
              return _user_model["default"].getAllStudents();
            case 3:
              students = _context6.sent;
              if (!(!students || students.length === 0)) {
                _context6.next = 6;
                break;
              }
              return _context6.abrupt("return", res.status(200).json([]));
            case 6:
              return _context6.abrupt("return", res.status(200).json(students));
            case 9:
              _context6.prev = 9;
              _context6.t0 = _context6["catch"](0);
              _my_logger["default"].error("Error retrieving student list:", _context6.t0.message);
              return _context6.abrupt("return", res.status(500).json({
                status: "failed",
                message: "Server Error: could not fetch student list"
              }));
            case 13:
            case "end":
              return _context6.stop();
          }
        }, _callee6, null, [[0, 9]]);
      }));
      function getAllStudents(_x11, _x12) {
        return _getAllStudents.apply(this, arguments);
      }
      return getAllStudents;
    }())
  }]);
}();
var _default = exports["default"] = AdminAdvisingController;