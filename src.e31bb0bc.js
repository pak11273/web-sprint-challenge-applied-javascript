// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../node_modules/regenerator-runtime/runtime.js":[function(require,module,exports) {
var define;
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }
  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function(obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunction.displayName = define(
    GeneratorFunctionPrototype,
    toStringTagSymbol,
    "GeneratorFunction"
  );

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      define(prototype, method, function(arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  define(Gp, toStringTagSymbol, "Generator");

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
  typeof module === "object" ? module.exports : {}
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  Function("r", "regeneratorRuntime = r")(runtime);
}

},{}],"components/card.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cardAppender = exports.Card = void 0;
// get localStorage
var topicLS = localStorage.getItem("topic");

var Card = function Card(article) {
  // grab topic from localStorage
  // TASK 5
  // ---------------------
  // Implement this function, which should return the markup you see below.
  // It takes as its only argument an "article" object with `headline`, `authorPhoto` and `authorName` properties.
  // The tags used, the hierarchy of elements and their attributes must match the provided markup exactly!
  // The text inside elements will be set using their `textContent` property (NOT `innerText`).
  // Add a listener for click events so that when a user clicks on a card, the headline of the article is logged to the console.
  //
  // <div class="card">
  //   <div class="headline">{ headline }</div>
  //   <div class="author">
  //     <div class="img-container">
  //       <img src={ authorPhoto }>
  //     </div>
  //     <span>By { authorName }</span>
  //   </div>
  // </div>
  //
  var cardEl = document.createElement("div");
  var headlineEl = document.createElement("div");
  var authorContainerEl = document.createElement("div");
  var imgContainerEl = document.createElement("div");
  var imgEl = document.createElement("img");
  var nameEl = document.createElement("span");
  cardEl.appendChild(headlineEl);
  cardEl.appendChild(authorContainerEl);
  authorContainerEl.appendChild(imgContainerEl);
  authorContainerEl.appendChild(nameEl);
  imgContainerEl.appendChild(imgEl);
  cardEl.classList.add("card");
  headlineEl.classList.add("headline");
  authorContainerEl.classList.add("author");
  imgContainerEl.classList.add("img-container");
  headlineEl.textContent = article.headline;
  imgEl.setAttribute("src", article.authorPhoto);
  nameEl.textContent = article.authorName;
  return cardEl;
};

exports.Card = Card;

var cardAppender = function cardAppender(selector) {
  // TASK 6
  // ---------------------
  // Implement this function that takes a css selector as its only argument.
  // It should obtain articles from this endpoint: `https://lambda-times-api.herokuapp.com/articles`
  // However, the articles do not come organized in a single, neat array. Inspect the response closely!
  // Create a card from each and every article object in the response, using the Card component.
  // Append each card to the element in the DOM that matches the selector passed to the function.
  //
  fetch("https://lambda-times-api.herokuapp.com/articles").then(function (r) {
    return r.json();
  }).then(function (r) {
    var topics = r.articles;
    console.log(topics);

    if (topicLS) {
      topics = [topics[topicLS]];
    }

    selector = document.querySelector(selector);

    for (var prop in topics) {
      if (!topics.hasOwnProperty(prop)) {
        continue;
      }

      var articles = topics[prop];

      for (var i = 0; i < articles.length; i++) {
        var card = Card(articles[i]);
        selector.appendChild(card);
      }
    }
  }).catch(function (e) {
    return console.log(e);
  });
};

exports.cardAppender = cardAppender;
},{}],"components/header.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.headerAppender = exports.Header = void 0;
// rest local storage
localStorage.removeItem("topic");

var Header = function Header(title, date, temp) {
  // TASK 1
  // ---------------------
  // Implement this function taking `title`, `date` and `temp` as its 3 args and returning the markup below.
  // The tags used, the hierarchy of elements and their attributes must match the provided markup exactly!
  // The text inside elements will be set using their `textContent` property (NOT `innerText`).
  //
  //  <div class="header">
  //    <span class="date">{ date }</span>
  //    <h1>{ title }</h1>
  //    <span class="temp">{ temp }</span>
  //  </div>
  //
  var headerEl = document.createElement("div");
  var dateEl = document.createElement("span");
  var titleEl = document.createElement("h1");
  var tempEl = document.createElement("span");
  headerEl.appendChild(dateEl);
  headerEl.appendChild(titleEl);
  headerEl.appendChild(tempEl);
  headerEl.classList.add("header");
  dateEl.classList.add("date");
  tempEl.classList.add("temp");
  dateEl.textContent = date;
  titleEl.textContent = title;
  tempEl.classList.add = temp;
  return headerEl;
};

exports.Header = Header;

var headerAppender = function headerAppender(selector) {
  // TASK 2
  // ---------------------
  // Implement this function taking a css selector as its only argument.
  // It should create a header using the Header component above, passing arguments of your choosing.
  // It should append the header to the element in the DOM that matches the given selector.
  //
  var header = Header("Lambda", "1/12/2021", "temp");
  selector = document.querySelector(selector);
  selector.appendChild(header);
};

exports.headerAppender = headerAppender;
},{}],"components/tabs.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tabsAppender = exports.Tabs = void 0;

var Tabs = function Tabs(topics) {
  // TASK 3
  // ---------------------
  // Implement this function which takes an array of strings ("topics") as its only argument.
  // As an example, if the topics passed are ['javascript', 'bootstrap', 'technology']
  // then the function returns the markup below.
  // The tags used, the hierarchy of elements and their attributes must match the provided markup!
  // The text inside elements will be set using their `textContent` property (NOT `innerText`).
  //
  // <div class="topics">
  //   <div class="tab">javascript</div>
  //   <div class="tab">bootstrap</div>
  //   <div class="tab">technology</div>
  // </div>
  //
  var topicsEl = document.createElement("div");
  topicsEl.classList.add("topics");
  topics.forEach(function (topic) {
    var topicEl = document.createElement("div");
    topicEl.classList.add("tab");
    topicEl.textContent = topic;
    topicEl.addEventListener("click", function () {
      window.localStorage.setItem("topic", topic);
      location.reload();
    });
    topicsEl.appendChild(topicEl);
  });
  return topicsEl;
};

exports.Tabs = Tabs;

var tabsAppender = function tabsAppender(selector) {
  // TASK 4
  // ---------------------
  // Implement this function which takes a css selector as its only argument.
  // It should obtain topics from this endpoint: `https://lambda-times-api.herokuapp.com/topics`
  // Find the array of topics inside the response, and create the tabs using the Tabs component.
  // Append the tabs to the element in the DOM that matches the selector passed to the function.
  //
  fetch("https://lambda-times-api.herokuapp.com/topics").then(function (r) {
    return r.json();
  }).then(function (r) {
    var topics = r.topics;
    var tabs = Tabs(topics);
    selector = document.querySelector(selector);
    selector.appendChild(tabs);
  }).catch(function (e) {
    return console.log(e);
  });
};

exports.tabsAppender = tabsAppender;
},{}],"../node_modules/node-fetch/browser.js":[function(require,module,exports) {

"use strict"; // ref: https://github.com/tc39/proposal-global

var getGlobal = function () {
  // the only reliable means to get the global object is
  // `Function('return this')()`
  // However, this causes CSP violations in Chrome apps.
  if (typeof self !== 'undefined') {
    return self;
  }

  if (typeof window !== 'undefined') {
    return window;
  }

  if (typeof global !== 'undefined') {
    return global;
  }

  throw new Error('unable to locate global object');
};

var global = getGlobal();
module.exports = exports = global.fetch; // Needed for TypeScript and Webpack.

if (global.fetch) {
  exports.default = global.fetch.bind(global);
}

exports.Headers = global.Headers;
exports.Request = global.Request;
exports.Response = global.Response;
},{}],"../node_modules/msw/lib/esm/fetch-deps.js":[function(require,module,exports) {
var global = arguments[3];
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.a = set;
exports.c = createCommonjsModule;
exports.e = jsonParse;
exports.i = isNodeProcess;
exports.s = exports.l = exports.j = exports.f = exports.d = exports.b = void 0;
var statuses = {
  "100": "Continue",
  "101": "Switching Protocols",
  "102": "Processing",
  "103": "Early Hints",
  "200": "OK",
  "201": "Created",
  "202": "Accepted",
  "203": "Non-Authoritative Information",
  "204": "No Content",
  "205": "Reset Content",
  "206": "Partial Content",
  "207": "Multi-Status",
  "208": "Already Reported",
  "226": "IM Used",
  "300": "Multiple Choices",
  "301": "Moved Permanently",
  "302": "Found",
  "303": "See Other",
  "304": "Not Modified",
  "305": "Use Proxy",
  "307": "Temporary Redirect",
  "308": "Permanent Redirect",
  "400": "Bad Request",
  "401": "Unauthorized",
  "402": "Payment Required",
  "403": "Forbidden",
  "404": "Not Found",
  "405": "Method Not Allowed",
  "406": "Not Acceptable",
  "407": "Proxy Authentication Required",
  "408": "Request Timeout",
  "409": "Conflict",
  "410": "Gone",
  "411": "Length Required",
  "412": "Precondition Failed",
  "413": "Payload Too Large",
  "414": "URI Too Long",
  "415": "Unsupported Media Type",
  "416": "Range Not Satisfiable",
  "417": "Expectation Failed",
  "418": "I'm a Teapot",
  "421": "Misdirected Request",
  "422": "Unprocessable Entity",
  "423": "Locked",
  "424": "Failed Dependency",
  "425": "Too Early",
  "426": "Upgrade Required",
  "428": "Precondition Required",
  "429": "Too Many Requests",
  "431": "Request Header Fields Too Large",
  "451": "Unavailable For Legal Reasons",
  "500": "Internal Server Error",
  "501": "Not Implemented",
  "502": "Bad Gateway",
  "503": "Service Unavailable",
  "504": "Gateway Timeout",
  "505": "HTTP Version Not Supported",
  "506": "Variant Also Negotiates",
  "507": "Insufficient Storage",
  "508": "Loop Detected",
  "509": "Bandwidth Limit Exceeded",
  "510": "Not Extended",
  "511": "Network Authentication Required"
};
/**
 * Sets a response status code and text.
 * @example
 * res(ctx.status(301))
 * res(ctx.status(400, 'Custom status text'))
 * @see {@link https://mswjs.io/docs/api/context/status `ctx.status()`}
 */

const status = (statusCode, statusText) => {
  return res => {
    res.status = statusCode;
    res.statusText = statusText || statuses[String(statusCode)];
    return res;
  };
};

exports.s = status;
var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};
exports.b = commonjsGlobal;

function createCommonjsModule(fn, basedir, module) {
  return module = {
    path: basedir,
    exports: {},
    require: function (path, base) {
      return commonjsRequire(path, base === undefined || base === null ? module.path : base);
    }
  }, fn(module, module.exports), module.exports;
}

function commonjsRequire() {
  throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
}

var Headers_1 = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var HEADERS_INVALID_CHARACTERS = /[^a-z0-9\-#$%&'*+.^_`|~]/i;

  var Headers =
  /** @class */
  function () {
    function Headers(headers) {
      var _this = this;

      this.map = {};

      if ((headers === null || headers === void 0 ? void 0 : headers.constructor.name) === 'Headers') {
        headers.forEach(function (value, name) {
          _this.append(name, value);
        }, this);
      } else if (Array.isArray(headers)) {
        headers.forEach(function (_a) {
          var name = _a[0],
              value = _a[1];

          _this.append(name, Array.isArray(value) ? value.join(', ') : value);
        });
      } else if (headers) {
        Object.getOwnPropertyNames(headers).forEach(function (name) {
          _this.append(name, headers[name]);
        });
      }
    }
    /**
     * Sets a new value for an existing header inside a `Headers` object, or adds the header if it does not already exist.
     */


    Headers.prototype.set = function (name, value) {
      this.map[this.normalizeName(name)] = this.normalizeValue(value);
    };
    /**
     * Appends a new value onto an existing header inside a `Headers` object, or adds the header if it does not already exist.
     */


    Headers.prototype.append = function (name, value) {
      name = this.normalizeName(name);
      value = this.normalizeValue(value);
      this.map[name] = this.has(name) ? this.map[name] + ", " + value : value;
    };
    /**
     * Deletes a header from the `Headers` object.
     */


    Headers.prototype.delete = function (name) {
      delete this.map[this.normalizeName(name)];
      return this;
    };
    /**
     * Returns a `ByteString` sequence of all the values of a header with a given name.
     */


    Headers.prototype.get = function (name) {
      return this.map[this.normalizeName(name)] || null;
    };
    /**
     * Returns the map of all headers in a `Headers` object.
     */


    Headers.prototype.getAllHeaders = function () {
      return this.map;
    };
    /**
     * Returns a boolean stating whether a `Headers` object contains a certain header.
     */


    Headers.prototype.has = function (name) {
      return this.map.hasOwnProperty(this.normalizeName(name));
    };

    Headers.prototype.forEach = function (callback, thisArg) {
      for (var name_1 in this.map) {
        if (this.map.hasOwnProperty(name_1)) {
          callback.call(thisArg, this.map[name_1], name_1, this);
        }
      }
    };

    Headers.prototype.normalizeName = function (name) {
      if (typeof name !== 'string') {
        name = String(name);
      }

      if (HEADERS_INVALID_CHARACTERS.test(name) || name.trim() === '') {
        throw new TypeError('Invalid character in header field name');
      }

      return name.toLowerCase();
    };

    Headers.prototype.normalizeValue = function (value) {
      if (typeof value !== 'string') {
        value = String(value);
      }

      return value;
    };

    return Headers;
  }();

  exports.Headers = Headers;
});
var headersToList_1 = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function headersToList(headers) {
    var headersList = [];
    headers.forEach(function (value, name) {
      var resolvedValue = value.includes(',') ? value.split(',').map(function (v) {
        return v.trim();
      }) : value;
      headersList.push([name, resolvedValue]);
    });
    return headersList;
  }

  exports.headersToList = headersToList;
});
var headersToObject_1 = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  }); // List of headers that cannot have multiple values,
  // while potentially having a comma in their single value.

  var singleValueHeaders = ['user-agent'];
  /**
   * Converts a given `Headers` instance into a plain object.
   * Respects headers with multiple values.
   */

  function headersToObject(headers) {
    var headersObject = {};
    headers.forEach(function (value, name) {
      var isMultiValue = !singleValueHeaders.includes(name.toLowerCase()) && value.includes(',');
      headersObject[name] = isMultiValue ? value.split(',').map(function (s) {
        return s.trim();
      }) : value;
    });
    return headersObject;
  }

  exports.headersToObject = headersToObject;
});
var stringToHeaders_1 = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  /**
   * Converts a string representation of headers (i.e. from XMLHttpRequest)
   * to a new `Headers` instance.
   */

  function stringToHeaders(str) {
    var lines = str.trim().split(/[\r\n]+/);
    return lines.reduce(function (headers, line) {
      var parts = line.split(': ');
      var name = parts.shift();
      var value = parts.join(': ');
      headers.append(name, value);
      return headers;
    }, new Headers());
  }

  exports.stringToHeaders = stringToHeaders;
});
var listToHeaders_1 = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function listToHeaders(list) {
    var headers = new Headers();
    list.forEach(function (_a) {
      var name = _a[0],
          value = _a[1];
      var values = [].concat(value);
      values.forEach(function (value) {
        headers.append(name, value);
      });
    });
    return headers;
  }

  exports.listToHeaders = listToHeaders;
});
var reduceHeadersObject_1 = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  /**
   * Reduces given headers object instnace.
   */

  function reduceHeadersObject(headers, reducer, initialState) {
    return Object.keys(headers).reduce(function (nextHeaders, name) {
      return reducer(nextHeaders, name, headers[name]);
    }, initialState);
  }

  exports.reduceHeadersObject = reduceHeadersObject;
});
var objectToHeaders_1 = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  /**
   * Converts a given headers object to a new `Headers` instance.
   */

  function objectToHeaders(obj) {
    return reduceHeadersObject_1.reduceHeadersObject(obj, function (headers, name, value) {
      var values = [].concat(value);
      values.forEach(function (value) {
        headers.append(name, value);
      });
      return headers;
    }, new Headers());
  }

  exports.objectToHeaders = objectToHeaders;
});
var flattenHeadersList_1 = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function flattenHeadersList(list) {
    return list.map(function (_a) {
      var name = _a[0],
          values = _a[1];
      return [name, [].concat(values).join('; ')];
    });
  }

  exports.flattenHeadersList = flattenHeadersList;
});
var flattenHeadersObject_1 = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function flattenHeadersObject(obj) {
    return reduceHeadersObject_1.reduceHeadersObject(obj, function (headers, name, value) {
      headers[name] = [].concat(value).join('; ');
      return headers;
    }, {});
  }

  exports.flattenHeadersObject = flattenHeadersObject;
});
var lib = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Headers = Headers_1.Headers;
  exports.headersToList = headersToList_1.headersToList;
  exports.headersToObject = headersToObject_1.headersToObject;
  exports.stringToHeaders = stringToHeaders_1.stringToHeaders;
  exports.listToHeaders = listToHeaders_1.listToHeaders;
  exports.objectToHeaders = objectToHeaders_1.objectToHeaders;
  exports.reduceHeadersObject = reduceHeadersObject_1.reduceHeadersObject;
  exports.flattenHeadersList = flattenHeadersList_1.flattenHeadersList;
  exports.flattenHeadersObject = flattenHeadersObject_1.flattenHeadersObject;
});
/**
 * Sets one or multiple response headers.
 * @see {@link https://mswjs.io/docs/api/context/set `ctx.set()`}
 */

exports.l = lib;

function set(...args) {
  return res => {
    const [name, value] = args;

    if (typeof name === 'string') {
      res.headers.append(name, value);
    } else {
      const headers = lib.objectToHeaders(name);
      headers.forEach((value, name) => {
        res.headers.append(name, value);
      });
    }

    return res;
  };
}
/**
 * Parses a given string into a JSON.
 * Does not throw an exception on an invalid JSON string.
 */


function jsonParse(str) {
  try {
    return JSON.parse(str);
  } catch (error) {
    return undefined;
  }
}
/**
 * Sets the given value as the JSON body of the response.
 * Appends a `Content-Type: application/json` header on the
 * mocked response.
 * @example
 * res(ctx.json('Some string'))
 * res(ctx.json({ key: 'value' }))
 * res(ctx.json([1, '2', false, { ok: true }]))
 * @see {@link https://mswjs.io/docs/api/context/json `ctx.json()`}
 */


const json = body => {
  return res => {
    res.headers.set('Content-Type', 'application/json');
    res.body = JSON.stringify(body);
    return res;
  };
};
/**
 * Returns a boolean indicating if the current process is running in NodeJS environment.
 * @see https://github.com/mswjs/msw/pull/255
 */


exports.j = json;

function isNodeProcess() {
  // Check browser environment.
  if (typeof global !== 'object') {
    return false;
  } // Check nodejs or React Native environment.


  if (Object.prototype.toString.call(global.process) === '[object process]' || navigator.product === 'ReactNative') {
    return true;
  }
}

const MIN_SERVER_RESPONSE_TIME = 100;
const MAX_SERVER_RESPONSE_TIME = 400;
const NODE_SERVER_RESPONSE_TIME = 5;

const getRandomServerResponseTime = () => {
  if (isNodeProcess()) {
    return NODE_SERVER_RESPONSE_TIME;
  }

  return Math.floor(Math.random() * (MAX_SERVER_RESPONSE_TIME - MIN_SERVER_RESPONSE_TIME) + MIN_SERVER_RESPONSE_TIME);
};
/**
 * Delays the response by the given duration (ms).
 * @example
 * res(ctx.delay()) // realistic server response time
 * res(ctx.delay(1200))
 * @see {@link https://mswjs.io/docs/api/context/delay `ctx.delay()`}
 */


const delay = durationMs => {
  return res => {
    res.delay = durationMs !== null && durationMs !== void 0 ? durationMs : getRandomServerResponseTime();
    return res;
  };
};

exports.d = delay;
const useFetch = isNodeProcess() ? require('node-fetch') : window.fetch;

const augmentRequestInit = requestInit => {
  const headers = new lib.Headers(requestInit.headers);
  headers.set('x-msw-bypass', 'true');
  return Object.assign(Object.assign({}, requestInit), {
    headers: headers.getAllHeaders()
  });
};

const createFetchRequestParameters = input => {
  const {
    body,
    method
  } = input;
  const requestParameters = Object.assign(Object.assign({}, input), {
    body: undefined
  });

  if (['GET', 'HEAD'].includes(method)) {
    return requestParameters;
  }

  requestParameters.body = typeof body === 'object' ? JSON.stringify(body) : body;
  return requestParameters;
};
/**
 * Performs a bypassed request inside a request handler.
 * @example
 * const originalResponse = await ctx.fetch(req)
 * @see {@link https://mswjs.io/docs/api/context/fetch `ctx.fetch()`}
 */


const fetch = (input, requestInit = {}) => {
  // Keep the default `window.fetch()` call signature
  if (typeof input === 'string') {
    return useFetch(input, augmentRequestInit(requestInit));
  }

  const requestParameters = createFetchRequestParameters(input);
  const compliantRequest = augmentRequestInit(requestParameters);
  return useFetch(input.url.href, compliantRequest);
};

exports.f = fetch;
},{"node-fetch":"../node_modules/node-fetch/browser.js"}],"../node_modules/msw/lib/esm/xml-deps.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.x = exports.t = exports.p = exports.c = exports.b = void 0;

/*!
 * cookie
 * Copyright(c) 2012-2014 Roman Shtylman
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */

/**
 * Module exports.
 * @public
 */
var parse_1 = parse;
exports.p = parse_1;
var serialize_1 = serialize;
/**
 * Module variables.
 * @private
 */

var decode = decodeURIComponent;
var encode = encodeURIComponent;
var pairSplitRegExp = /; */;
/**
 * RegExp to match field-content in RFC 7230 sec 3.2
 *
 * field-content = field-vchar [ 1*( SP / HTAB ) field-vchar ]
 * field-vchar   = VCHAR / obs-text
 * obs-text      = %x80-FF
 */

var fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
/**
 * Parse a cookie header.
 *
 * Parse the given cookie header string into an object
 * The object has the various cookies as keys(names) => values
 *
 * @param {string} str
 * @param {object} [options]
 * @return {object}
 * @public
 */

function parse(str, options) {
  if (typeof str !== 'string') {
    throw new TypeError('argument str must be a string');
  }

  var obj = {};
  var opt = options || {};
  var pairs = str.split(pairSplitRegExp);
  var dec = opt.decode || decode;

  for (var i = 0; i < pairs.length; i++) {
    var pair = pairs[i];
    var eq_idx = pair.indexOf('='); // skip things that don't look like key=value

    if (eq_idx < 0) {
      continue;
    }

    var key = pair.substr(0, eq_idx).trim();
    var val = pair.substr(++eq_idx, pair.length).trim(); // quoted values

    if ('"' == val[0]) {
      val = val.slice(1, -1);
    } // only assign once


    if (undefined == obj[key]) {
      obj[key] = tryDecode(val, dec);
    }
  }

  return obj;
}
/**
 * Serialize data into a cookie header.
 *
 * Serialize the a name value pair into a cookie string suitable for
 * http headers. An optional options object specified cookie parameters.
 *
 * serialize('foo', 'bar', { httpOnly: true })
 *   => "foo=bar; httpOnly"
 *
 * @param {string} name
 * @param {string} val
 * @param {object} [options]
 * @return {string}
 * @public
 */


function serialize(name, val, options) {
  var opt = options || {};
  var enc = opt.encode || encode;

  if (typeof enc !== 'function') {
    throw new TypeError('option encode is invalid');
  }

  if (!fieldContentRegExp.test(name)) {
    throw new TypeError('argument name is invalid');
  }

  var value = enc(val);

  if (value && !fieldContentRegExp.test(value)) {
    throw new TypeError('argument val is invalid');
  }

  var str = name + '=' + value;

  if (null != opt.maxAge) {
    var maxAge = opt.maxAge - 0;

    if (isNaN(maxAge) || !isFinite(maxAge)) {
      throw new TypeError('option maxAge is invalid');
    }

    str += '; Max-Age=' + Math.floor(maxAge);
  }

  if (opt.domain) {
    if (!fieldContentRegExp.test(opt.domain)) {
      throw new TypeError('option domain is invalid');
    }

    str += '; Domain=' + opt.domain;
  }

  if (opt.path) {
    if (!fieldContentRegExp.test(opt.path)) {
      throw new TypeError('option path is invalid');
    }

    str += '; Path=' + opt.path;
  }

  if (opt.expires) {
    if (typeof opt.expires.toUTCString !== 'function') {
      throw new TypeError('option expires is invalid');
    }

    str += '; Expires=' + opt.expires.toUTCString();
  }

  if (opt.httpOnly) {
    str += '; HttpOnly';
  }

  if (opt.secure) {
    str += '; Secure';
  }

  if (opt.sameSite) {
    var sameSite = typeof opt.sameSite === 'string' ? opt.sameSite.toLowerCase() : opt.sameSite;

    switch (sameSite) {
      case true:
        str += '; SameSite=Strict';
        break;

      case 'lax':
        str += '; SameSite=Lax';
        break;

      case 'strict':
        str += '; SameSite=Strict';
        break;

      case 'none':
        str += '; SameSite=None';
        break;

      default:
        throw new TypeError('option sameSite is invalid');
    }
  }

  return str;
}
/**
 * Try decoding a string using a decoding function.
 *
 * @param {string} str
 * @param {function} decode
 * @private
 */


function tryDecode(str, decode) {
  try {
    return decode(str);
  } catch (e) {
    return str;
  }
}
/**
 * Sets a given cookie on the mocked response.
 * @example res(ctx.cookie('name', 'value'))
 */


const cookie = (name, value, options) => {
  return res => {
    const serializedCookie = serialize_1(name, value, options);
    res.headers.set('Set-Cookie', serializedCookie);

    if (typeof document !== 'undefined') {
      document.cookie = serializedCookie;
    }

    return res;
  };
};
/**
 * Sets a raw response body. Does not append any `Content-Type` headers.
 * @example
 * res(ctx.body('Successful response'))
 * res(ctx.body(JSON.stringify({ key: 'value' })))
 * @see {@link https://mswjs.io/docs/api/context/body `ctx.body()`}
 */


exports.c = cookie;

const body = value => {
  return res => {
    res.body = value;
    return res;
  };
};
/**
 * Sets a textual response body. Appends a `Content-Type: text/plain`
 * header on the mocked response.
 * @example res(ctx.text('Successful response'))
 * @see {@link https://mswjs.io/docs/api/context/text `ctx.text()`}
 */


exports.b = body;

const text = body => {
  return res => {
    res.headers.set('Content-Type', 'text/plain');
    res.body = body;
    return res;
  };
};
/**
 * Sets an XML response body. Appends a `Content-Type: text/xml` header
 * on the mocked response.
 * @example
 * res(ctx.xml('<node key="value">Content</node>'))
 * @see {@link https://mswjs.io/docs/api/context/xml `ctx.xml()`}
 */


exports.t = text;

const xml = body => {
  return res => {
    res.headers.set('Content-Type', 'text/xml');
    res.body = body;
    return res;
  };
};

exports.x = xml;
},{}],"../node_modules/msw/lib/esm/errors-deps.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.m = mergeRight;
exports.e = exports.d = void 0;

var _fetchDeps = require("./fetch-deps.js");

/**
 * Determines if the given value is an object.
 */
function isObject(value) {
  return value != null && typeof value === 'object' && !Array.isArray(value);
}
/**
 * Deeply merges two given objects with the right one
 * having a priority during property assignment.
 */


function mergeRight(left, right) {
  return Object.entries(right).reduce((result, [key, rightValue]) => {
    const leftValue = result[key];

    if (Array.isArray(leftValue) && Array.isArray(rightValue)) {
      result[key] = leftValue.concat(rightValue);
      return result;
    }

    if (isObject(leftValue) && isObject(rightValue)) {
      result[key] = mergeRight(leftValue, rightValue);
      return result;
    }

    result[key] = rightValue;
    return result;
  }, Object.assign({}, left));
}
/**
 * Sets a given payload as a GraphQL response body.
 * @example
 * res(ctx.data({ user: { firstName: 'John' }}))
 * @see {@link https://mswjs.io/docs/api/context/data `ctx.data()`}
 */


const data = payload => {
  return res => {
    const prevBody = (0, _fetchDeps.e)(res.body) || {};
    const nextBody = mergeRight(prevBody, {
      data: payload
    });
    return (0, _fetchDeps.j)(nextBody)(res);
  };
};
/**
 * Sets a given list of GraphQL errors on the mocked response.
 * @example res(ctx.errors([{ message: 'Unauthorized' }]))
 * @see {@link https://mswjs.io/docs/api/context/errors}
 */


exports.d = data;

const errors = errorsList => {
  return res => {
    if (errorsList == null) {
      return res;
    }

    const prevBody = (0, _fetchDeps.e)(res.body) || {};
    const nextBody = mergeRight(prevBody, {
      errors: errorsList
    });
    return (0, _fetchDeps.j)(nextBody)(res);
  };
};

exports.e = errors;
},{"./fetch-deps.js":"../node_modules/msw/lib/esm/fetch-deps.js"}],"../node_modules/msw/lib/esm/index-deps.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.i = void 0;

var _fetchDeps = require("./fetch-deps.js");

var _xmlDeps = require("./xml-deps.js");

var _errorsDeps = require("./errors-deps.js");

var index = /*#__PURE__*/Object.freeze({
  __proto__: null,
  status: _fetchDeps.s,
  set: _fetchDeps.a,
  cookie: _xmlDeps.c,
  body: _xmlDeps.b,
  data: _errorsDeps.d,
  delay: _fetchDeps.d,
  errors: _errorsDeps.e,
  fetch: _fetchDeps.f,
  json: _fetchDeps.j,
  text: _xmlDeps.t,
  xml: _xmlDeps.x
});
exports.i = index;
},{"./fetch-deps.js":"../node_modules/msw/lib/esm/fetch-deps.js","./xml-deps.js":"../node_modules/msw/lib/esm/xml-deps.js","./errors-deps.js":"../node_modules/msw/lib/esm/errors-deps.js"}],"../node_modules/msw/lib/esm/getCallFrame-deps.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.a = getCallFrame;
exports.b = prepareRequest;
exports.c = prepareResponse;
exports.d = getTimestamp;
exports.e = getStatusCodeColor;
exports.g = getUrlByMask;
exports.m = matchRequestUrl;
exports.p = parseBody;

var _fetchDeps = require("./fetch-deps.js");

/**
 * Parses a given request/response body based on the `Content-Type` header.
 */
function parseBody(body, headers) {
  var _a;

  if (body) {
    // If the intercepted request's body has a JSON Content-Type
    // parse it into an object, otherwise leave as-is.
    const hasJsonContent = (_a = headers === null || headers === void 0 ? void 0 : headers.get('content-type')) === null || _a === void 0 ? void 0 : _a.includes('json');

    if (hasJsonContent && typeof body !== 'object') {
      return (0, _fetchDeps.e)(body) || body;
    }

    return body;
  } // Return whatever falsey body value is given.


  return body;
}
/**
 * Formats a mocked request for introspection in browser's console.
 */


function prepareRequest(req) {
  return Object.assign(Object.assign({}, req), {
    headers: req.headers.getAllHeaders()
  });
}
/**
 * Formats a mocked response for introspection in browser's console.
 */


function prepareResponse(res) {
  const responseHeaders = _fetchDeps.l.listToHeaders(res.headers);

  return Object.assign(Object.assign({}, res), {
    // Parse a response JSON body for preview in the logs
    body: parseBody(res.body, responseHeaders)
  });
}

function getTimestamp() {
  const now = new Date();
  return [now.getHours(), now.getMinutes(), now.getSeconds()].map(String).map(chunk => chunk.slice(0, 2)).map(chunk => chunk.padStart(2, '0')).join(':');
}
/**
 * Returns a HEX color for a given response status code number.
 */


function getStatusCodeColor(status) {
  if (status < 300) {
    return '#69AB32';
  }

  if (status < 400) {
    return '#F0BB4B';
  }

  return '#E95F5D';
}
/**
 * Converts a string path to a Regular Expression.
 * Transforms path parameters into named RegExp groups.
 */


const pathToRegExp = path => {
  const pattern = path // Escape literal dots
  .replace(/\./g, '\\.') // Escape literal slashes
  .replace(/\//g, '/') // Escape literal question marks
  .replace(/\?/g, '\\?') // Ignore trailing slashes
  .replace(/\/+$/, '') // Replace wildcard with any zero-to-any character sequence
  .replace(/\*+/g, '.*') // Replace parameters with named capturing groups
  .replace(/:([^\d|^\/][a-zA-Z0-9_]*(?=(?:\/|\\.)|$))/g, (_, paramName) => `(?<${paramName}>[^\/]+?)`) // Allow optional trailing slash
  .concat('(\\/|$)');
  return new RegExp(pattern, 'gi');
};
/**
 * Matches a given url against a path.
 */


const match = (path, url) => {
  const expression = path instanceof RegExp ? path : pathToRegExp(path);
  const match = expression.exec(url) || false; // Matches in strict mode: match string should equal to input (url)
  // Otherwise loose matches will be considered truthy:
  // match('/messages/:id', '/messages/123/users') // true

  const matches = path instanceof RegExp ? !!match : !!match && match[0] === match.input;
  return {
    matches,
    params: match && matches ? match.groups || null : null
  };
};

var getCleanUrl_1 = (0, _fetchDeps.c)(function (module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.getCleanUrl = void 0;
  /**
   * Removes query parameters and hashes from a given URL.
   */

  function getCleanUrl(url, isAbsolute) {
    if (isAbsolute === void 0) {
      isAbsolute = true;
    }

    return [isAbsolute && url.origin, url.pathname].filter(Boolean).join('');
  }

  exports.getCleanUrl = getCleanUrl;
});
/**
 * Returns an absolute URL based on the given relative URL, if possible.
 * Ignores regular expressions.
 */

const getAbsoluteUrl = mask => {
  // Global `location` object doesn't exist in Node.
  // Relative request predicate URL cannot become absolute.
  const hasLocation = typeof location !== 'undefined';
  return typeof mask === 'string' && mask.startsWith('/') ? `${hasLocation ? location.origin : ''}${mask}` : mask;
};
/**
 * Converts a given request handler mask into a URL, if given a valid URL string.
 */


function getUrlByMask(mask) {
  /**
   * If a string mask contains an asterisk (wildcard), return it as-is.
   * Converting a URL-like path string into an actual URL is misleading.
   * @see https://github.com/mswjs/msw/issues/357
   */
  if (mask instanceof RegExp || mask.includes('*')) {
    return mask;
  }

  try {
    // Attempt to create a URL instance out of the mask string.
    // Resolve mask to an absolute URL, because even a valid relative URL
    // cannot be converted into the URL instance (required absolute URL only).
    return new URL(getAbsoluteUrl(mask));
  } catch (error) {
    // Otherwise, the mask is a path string.
    return mask;
  }
}

function getCleanMask(resolvedMask) {
  return resolvedMask instanceof URL ? getCleanUrl_1.getCleanUrl(resolvedMask) : resolvedMask instanceof RegExp ? resolvedMask : getAbsoluteUrl(resolvedMask);
}
/**
 * Returns the result of matching given request URL
 * against a mask.
 */


function matchRequestUrl(url, mask) {
  const resolvedMask = getUrlByMask(mask);
  const cleanMask = getCleanMask(resolvedMask);
  const cleanRequestUrl = getCleanUrl_1.getCleanUrl(url);
  return match(cleanMask, cleanRequestUrl);
}
/**
 * Return the stack trace frame of a function's invocation.
 */


function getCallFrame() {
  try {
    const inspectionError = new Error();
    inspectionError.name = 'Inspection Error';
    throw inspectionError;
  } catch (error) {
    const frames = error.stack.split('\n'); // Get the first frame that doesn't reference the library's internal trace.
    // Assume that frame is the invocation frame.

    const declarationFrame = frames.slice(1).find(frame => {
      return !/(node_modules)?\/lib\/(umd|esm)\//.test(frame);
    });

    if (!declarationFrame) {
      return;
    } // Extract file reference from the stack frame.


    const [, declarationPath] = declarationFrame.match(/\((.+?)\)$/) || [];
    return declarationPath;
  }
}
},{"./fetch-deps.js":"../node_modules/msw/lib/esm/fetch-deps.js"}],"../node_modules/msw/lib/esm/rest-deps.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.i = isStringEqual;
exports.r = exports.g = exports.a = exports.R = void 0;

var _fetchDeps = require("./fetch-deps.js");

var _xmlDeps = require("./xml-deps.js");

var _getCallFrameDeps = require("./getCallFrame-deps.js");

var punycode = (0, _fetchDeps.c)(function (module, exports) {
  (function (root) {
    /** Detect free variables */
    var freeExports = exports && !exports.nodeType && exports;
    var freeModule = module && !module.nodeType && module;
    var freeGlobal = typeof _fetchDeps.b == 'object' && _fetchDeps.b;

    if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal || freeGlobal.self === freeGlobal) {
      root = freeGlobal;
    }
    /**
     * The `punycode` object.
     * @name punycode
     * @type Object
     */


    var punycode,

    /** Highest positive signed 32-bit float value */
    maxInt = 2147483647,
        // aka. 0x7FFFFFFF or 2^31-1

    /** Bootstring parameters */
    base = 36,
        tMin = 1,
        tMax = 26,
        skew = 38,
        damp = 700,
        initialBias = 72,
        initialN = 128,
        // 0x80
    delimiter = '-',
        // '\x2D'

    /** Regular expressions */
    regexPunycode = /^xn--/,
        regexNonASCII = /[^\x20-\x7E]/,
        // unprintable ASCII chars + non-ASCII chars
    regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g,
        // RFC 3490 separators

    /** Error messages */
    errors = {
      'overflow': 'Overflow: input needs wider integers to process',
      'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
      'invalid-input': 'Invalid input'
    },

    /** Convenience shortcuts */
    baseMinusTMin = base - tMin,
        floor = Math.floor,
        stringFromCharCode = String.fromCharCode,

    /** Temporary variable */
    key;
    /*--------------------------------------------------------------------------*/

    /**
     * A generic error utility function.
     * @private
     * @param {String} type The error type.
     * @returns {Error} Throws a `RangeError` with the applicable error message.
     */

    function error(type) {
      throw RangeError(errors[type]);
    }
    /**
     * A generic `Array#map` utility function.
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} callback The function that gets called for every array
     * item.
     * @returns {Array} A new array of values returned by the callback function.
     */


    function map(array, fn) {
      var length = array.length;
      var result = [];

      while (length--) {
        result[length] = fn(array[length]);
      }

      return result;
    }
    /**
     * A simple `Array#map`-like wrapper to work with domain name strings or email
     * addresses.
     * @private
     * @param {String} domain The domain name or email address.
     * @param {Function} callback The function that gets called for every
     * character.
     * @returns {Array} A new string of characters returned by the callback
     * function.
     */


    function mapDomain(string, fn) {
      var parts = string.split('@');
      var result = '';

      if (parts.length > 1) {
        // In email addresses, only the domain name should be punycoded. Leave
        // the local part (i.e. everything up to `@`) intact.
        result = parts[0] + '@';
        string = parts[1];
      } // Avoid `split(regex)` for IE8 compatibility. See #17.


      string = string.replace(regexSeparators, '\x2E');
      var labels = string.split('.');
      var encoded = map(labels, fn).join('.');
      return result + encoded;
    }
    /**
     * Creates an array containing the numeric code points of each Unicode
     * character in the string. While JavaScript uses UCS-2 internally,
     * this function will convert a pair of surrogate halves (each of which
     * UCS-2 exposes as separate characters) into a single code point,
     * matching UTF-16.
     * @see `punycode.ucs2.encode`
     * @see <https://mathiasbynens.be/notes/javascript-encoding>
     * @memberOf punycode.ucs2
     * @name decode
     * @param {String} string The Unicode input string (UCS-2).
     * @returns {Array} The new array of code points.
     */


    function ucs2decode(string) {
      var output = [],
          counter = 0,
          length = string.length,
          value,
          extra;

      while (counter < length) {
        value = string.charCodeAt(counter++);

        if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
          // high surrogate, and there is a next character
          extra = string.charCodeAt(counter++);

          if ((extra & 0xFC00) == 0xDC00) {
            // low surrogate
            output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
          } else {
            // unmatched surrogate; only append this code unit, in case the next
            // code unit is the high surrogate of a surrogate pair
            output.push(value);
            counter--;
          }
        } else {
          output.push(value);
        }
      }

      return output;
    }
    /**
     * Creates a string based on an array of numeric code points.
     * @see `punycode.ucs2.decode`
     * @memberOf punycode.ucs2
     * @name encode
     * @param {Array} codePoints The array of numeric code points.
     * @returns {String} The new Unicode string (UCS-2).
     */


    function ucs2encode(array) {
      return map(array, function (value) {
        var output = '';

        if (value > 0xFFFF) {
          value -= 0x10000;
          output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
          value = 0xDC00 | value & 0x3FF;
        }

        output += stringFromCharCode(value);
        return output;
      }).join('');
    }
    /**
     * Converts a basic code point into a digit/integer.
     * @see `digitToBasic()`
     * @private
     * @param {Number} codePoint The basic numeric code point value.
     * @returns {Number} The numeric value of a basic code point (for use in
     * representing integers) in the range `0` to `base - 1`, or `base` if
     * the code point does not represent a value.
     */


    function basicToDigit(codePoint) {
      if (codePoint - 48 < 10) {
        return codePoint - 22;
      }

      if (codePoint - 65 < 26) {
        return codePoint - 65;
      }

      if (codePoint - 97 < 26) {
        return codePoint - 97;
      }

      return base;
    }
    /**
     * Converts a digit/integer into a basic code point.
     * @see `basicToDigit()`
     * @private
     * @param {Number} digit The numeric value of a basic code point.
     * @returns {Number} The basic code point whose value (when used for
     * representing integers) is `digit`, which needs to be in the range
     * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
     * used; else, the lowercase form is used. The behavior is undefined
     * if `flag` is non-zero and `digit` has no uppercase form.
     */


    function digitToBasic(digit, flag) {
      //  0..25 map to ASCII a..z or A..Z
      // 26..35 map to ASCII 0..9
      return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
    }
    /**
     * Bias adaptation function as per section 3.4 of RFC 3492.
     * http://tools.ietf.org/html/rfc3492#section-3.4
     * @private
     */


    function adapt(delta, numPoints, firstTime) {
      var k = 0;
      delta = firstTime ? floor(delta / damp) : delta >> 1;
      delta += floor(delta / numPoints);

      for (;
      /* no initialization */
      delta > baseMinusTMin * tMax >> 1; k += base) {
        delta = floor(delta / baseMinusTMin);
      }

      return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
    }
    /**
     * Converts a Punycode string of ASCII-only symbols to a string of Unicode
     * symbols.
     * @memberOf punycode
     * @param {String} input The Punycode string of ASCII-only symbols.
     * @returns {String} The resulting string of Unicode symbols.
     */


    function decode(input) {
      // Don't use UCS-2
      var output = [],
          inputLength = input.length,
          out,
          i = 0,
          n = initialN,
          bias = initialBias,
          basic,
          j,
          index,
          oldi,
          w,
          k,
          digit,
          t,

      /** Cached calculation results */
      baseMinusT; // Handle the basic code points: let `basic` be the number of input code
      // points before the last delimiter, or `0` if there is none, then copy
      // the first basic code points to the output.

      basic = input.lastIndexOf(delimiter);

      if (basic < 0) {
        basic = 0;
      }

      for (j = 0; j < basic; ++j) {
        // if it's not a basic code point
        if (input.charCodeAt(j) >= 0x80) {
          error('not-basic');
        }

        output.push(input.charCodeAt(j));
      } // Main decoding loop: start just after the last delimiter if any basic code
      // points were copied; start at the beginning otherwise.


      for (index = basic > 0 ? basic + 1 : 0; index < inputLength;)
      /* no final expression */
      {
        // `index` is the index of the next character to be consumed.
        // Decode a generalized variable-length integer into `delta`,
        // which gets added to `i`. The overflow checking is easier
        // if we increase `i` as we go, then subtract off its starting
        // value at the end to obtain `delta`.
        for (oldi = i, w = 1, k = base;;
        /* no condition */
        k += base) {
          if (index >= inputLength) {
            error('invalid-input');
          }

          digit = basicToDigit(input.charCodeAt(index++));

          if (digit >= base || digit > floor((maxInt - i) / w)) {
            error('overflow');
          }

          i += digit * w;
          t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;

          if (digit < t) {
            break;
          }

          baseMinusT = base - t;

          if (w > floor(maxInt / baseMinusT)) {
            error('overflow');
          }

          w *= baseMinusT;
        }

        out = output.length + 1;
        bias = adapt(i - oldi, out, oldi == 0); // `i` was supposed to wrap around from `out` to `0`,
        // incrementing `n` each time, so we'll fix that now:

        if (floor(i / out) > maxInt - n) {
          error('overflow');
        }

        n += floor(i / out);
        i %= out; // Insert `n` at position `i` of the output

        output.splice(i++, 0, n);
      }

      return ucs2encode(output);
    }
    /**
     * Converts a string of Unicode symbols (e.g. a domain name label) to a
     * Punycode string of ASCII-only symbols.
     * @memberOf punycode
     * @param {String} input The string of Unicode symbols.
     * @returns {String} The resulting Punycode string of ASCII-only symbols.
     */


    function encode(input) {
      var n,
          delta,
          handledCPCount,
          basicLength,
          bias,
          j,
          m,
          q,
          k,
          t,
          currentValue,
          output = [],

      /** `inputLength` will hold the number of code points in `input`. */
      inputLength,

      /** Cached calculation results */
      handledCPCountPlusOne,
          baseMinusT,
          qMinusT; // Convert the input in UCS-2 to Unicode

      input = ucs2decode(input); // Cache the length

      inputLength = input.length; // Initialize the state

      n = initialN;
      delta = 0;
      bias = initialBias; // Handle the basic code points

      for (j = 0; j < inputLength; ++j) {
        currentValue = input[j];

        if (currentValue < 0x80) {
          output.push(stringFromCharCode(currentValue));
        }
      }

      handledCPCount = basicLength = output.length; // `handledCPCount` is the number of code points that have been handled;
      // `basicLength` is the number of basic code points.
      // Finish the basic string - if it is not empty - with a delimiter

      if (basicLength) {
        output.push(delimiter);
      } // Main encoding loop:


      while (handledCPCount < inputLength) {
        // All non-basic code points < n have been handled already. Find the next
        // larger one:
        for (m = maxInt, j = 0; j < inputLength; ++j) {
          currentValue = input[j];

          if (currentValue >= n && currentValue < m) {
            m = currentValue;
          }
        } // Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
        // but guard against overflow


        handledCPCountPlusOne = handledCPCount + 1;

        if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
          error('overflow');
        }

        delta += (m - n) * handledCPCountPlusOne;
        n = m;

        for (j = 0; j < inputLength; ++j) {
          currentValue = input[j];

          if (currentValue < n && ++delta > maxInt) {
            error('overflow');
          }

          if (currentValue == n) {
            // Represent delta as a generalized variable-length integer
            for (q = delta, k = base;;
            /* no condition */
            k += base) {
              t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;

              if (q < t) {
                break;
              }

              qMinusT = q - t;
              baseMinusT = base - t;
              output.push(stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0)));
              q = floor(qMinusT / baseMinusT);
            }

            output.push(stringFromCharCode(digitToBasic(q, 0)));
            bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
            delta = 0;
            ++handledCPCount;
          }
        }

        ++delta;
        ++n;
      }

      return output.join('');
    }
    /**
     * Converts a Punycode string representing a domain name or an email address
     * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
     * it doesn't matter if you call it on a string that has already been
     * converted to Unicode.
     * @memberOf punycode
     * @param {String} input The Punycoded domain name or email address to
     * convert to Unicode.
     * @returns {String} The Unicode representation of the given Punycode
     * string.
     */


    function toUnicode(input) {
      return mapDomain(input, function (string) {
        return regexPunycode.test(string) ? decode(string.slice(4).toLowerCase()) : string;
      });
    }
    /**
     * Converts a Unicode string representing a domain name or an email address to
     * Punycode. Only the non-ASCII parts of the domain name will be converted,
     * i.e. it doesn't matter if you call it with a domain that's already in
     * ASCII.
     * @memberOf punycode
     * @param {String} input The domain name or email address to convert, as a
     * Unicode string.
     * @returns {String} The Punycode representation of the given domain name or
     * email address.
     */


    function toASCII(input) {
      return mapDomain(input, function (string) {
        return regexNonASCII.test(string) ? 'xn--' + encode(string) : string;
      });
    }
    /*--------------------------------------------------------------------------*/

    /** Define the public API */


    punycode = {
      /**
       * A string representing the current Punycode.js version number.
       * @memberOf punycode
       * @type String
       */
      'version': '1.3.2',

      /**
       * An object of methods to convert from JavaScript's internal character
       * representation (UCS-2) to Unicode code points, and back.
       * @see <https://mathiasbynens.be/notes/javascript-encoding>
       * @memberOf punycode
       * @type Object
       */
      'ucs2': {
        'decode': ucs2decode,
        'encode': ucs2encode
      },
      'decode': decode,
      'encode': encode,
      'toASCII': toASCII,
      'toUnicode': toUnicode
    };
    /** Expose `punycode` */
    // Some AMD build optimizers, like r.js, check for specific condition patterns
    // like the following:

    if (freeExports && freeModule) {
      if (module.exports == freeExports) {
        // in Node.js or RingoJS v0.8.0+
        freeModule.exports = punycode;
      } else {
        // in Narwhal or RingoJS v0.7.0-
        for (key in punycode) {
          punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
        }
      }
    } else {
      // in Rhino or a web browser
      root.punycode = punycode;
    }
  })(_fetchDeps.b);
});
var util = {
  isString: function (arg) {
    return typeof arg === 'string';
  },
  isObject: function (arg) {
    return typeof arg === 'object' && arg !== null;
  },
  isNull: function (arg) {
    return arg === null;
  },
  isNullOrUndefined: function (arg) {
    return arg == null;
  }
}; // Copyright Joyent, Inc. and other Node contributors.
// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

var decode = function (qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);
  var maxKeys = 1000;

  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length; // maxKeys <= 0 means that we should not limit keys count

  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr,
        vstr,
        k,
        v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (Array.isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
}; // Copyright Joyent, Inc. and other Node contributors.


var stringifyPrimitive = function (v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

var encode = function (obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';

  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return Object.keys(obj).map(function (k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;

      if (Array.isArray(obj[k])) {
        return obj[k].map(function (v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);
  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq + encodeURIComponent(stringifyPrimitive(obj));
};

var querystring = (0, _fetchDeps.c)(function (module, exports) {
  exports.decode = exports.parse = decode;
  exports.encode = exports.stringify = encode;
});
var format = urlFormat;

function Url() {
  this.protocol = null;
  this.slashes = null;
  this.auth = null;
  this.host = null;
  this.port = null;
  this.hostname = null;
  this.hash = null;
  this.search = null;
  this.query = null;
  this.pathname = null;
  this.path = null;
  this.href = null;
} // Reference: RFC 3986, RFC 1808, RFC 2396
// define these here so at least they only have to be
// compiled once on the first module load.


var protocolPattern = /^([a-z0-9.+-]+:)/i,
    portPattern = /:[0-9]*$/,
    // Special case for a simple path URL
simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,
    // RFC 2396: characters reserved for delimiting URLs.
// We actually just auto-escape these.
delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],
    // RFC 2396: characters not allowed for various reasons.
unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),
    // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
autoEscape = ['\''].concat(unwise),
    // Characters that are never ever allowed in a hostname.
// Note that any invalid chars are also handled, but these
// are the ones that are *expected* to be seen, so we fast-path
// them.
nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
    hostEndingChars = ['/', '?', '#'],
    hostnameMaxLen = 255,
    hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/,
    hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
    // protocols that can allow "unsafe" and "unwise" chars.
unsafeProtocol = {
  'javascript': true,
  'javascript:': true
},
    // protocols that never have a hostname.
hostlessProtocol = {
  'javascript': true,
  'javascript:': true
},
    // protocols that always contain a // bit.
slashedProtocol = {
  'http': true,
  'https': true,
  'ftp': true,
  'gopher': true,
  'file': true,
  'http:': true,
  'https:': true,
  'ftp:': true,
  'gopher:': true,
  'file:': true
};

function urlParse(url, parseQueryString, slashesDenoteHost) {
  if (url && util.isObject(url) && url instanceof Url) return url;
  var u = new Url();
  u.parse(url, parseQueryString, slashesDenoteHost);
  return u;
}

Url.prototype.parse = function (url, parseQueryString, slashesDenoteHost) {
  if (!util.isString(url)) {
    throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
  } // Copy chrome, IE, opera backslash-handling behavior.
  // Back slashes before the query string get converted to forward slashes
  // See: https://code.google.com/p/chromium/issues/detail?id=25916


  var queryIndex = url.indexOf('?'),
      splitter = queryIndex !== -1 && queryIndex < url.indexOf('#') ? '?' : '#',
      uSplit = url.split(splitter),
      slashRegex = /\\/g;
  uSplit[0] = uSplit[0].replace(slashRegex, '/');
  url = uSplit.join(splitter);
  var rest = url; // trim before proceeding.
  // This is to support parse stuff like "  http://foo.com  \n"

  rest = rest.trim();

  if (!slashesDenoteHost && url.split('#').length === 1) {
    // Try fast path regexp
    var simplePath = simplePathPattern.exec(rest);

    if (simplePath) {
      this.path = rest;
      this.href = rest;
      this.pathname = simplePath[1];

      if (simplePath[2]) {
        this.search = simplePath[2];

        if (parseQueryString) {
          this.query = querystring.parse(this.search.substr(1));
        } else {
          this.query = this.search.substr(1);
        }
      } else if (parseQueryString) {
        this.search = '';
        this.query = {};
      }

      return this;
    }
  }

  var proto = protocolPattern.exec(rest);

  if (proto) {
    proto = proto[0];
    var lowerProto = proto.toLowerCase();
    this.protocol = lowerProto;
    rest = rest.substr(proto.length);
  } // figure out if it's got a host
  // user@server is *always* interpreted as a hostname, and url
  // resolution will treat //foo/bar as host=foo,path=bar because that's
  // how the browser resolves relative URLs.


  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
    var slashes = rest.substr(0, 2) === '//';

    if (slashes && !(proto && hostlessProtocol[proto])) {
      rest = rest.substr(2);
      this.slashes = true;
    }
  }

  if (!hostlessProtocol[proto] && (slashes || proto && !slashedProtocol[proto])) {
    // there's a hostname.
    // the first instance of /, ?, ;, or # ends the host.
    //
    // If there is an @ in the hostname, then non-host chars *are* allowed
    // to the left of the last @ sign, unless some host-ending character
    // comes *before* the @-sign.
    // URLs are obnoxious.
    //
    // ex:
    // http://a@b@c/ => user:a@b host:c
    // http://a@b?@c => user:a host:c path:/?@c
    // v0.12 TODO(isaacs): This is not quite how Chrome does things.
    // Review our test case against browsers more comprehensively.
    // find the first instance of any hostEndingChars
    var hostEnd = -1;

    for (var i = 0; i < hostEndingChars.length; i++) {
      var hec = rest.indexOf(hostEndingChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd)) hostEnd = hec;
    } // at this point, either we have an explicit point where the
    // auth portion cannot go past, or the last @ char is the decider.


    var auth, atSign;

    if (hostEnd === -1) {
      // atSign can be anywhere.
      atSign = rest.lastIndexOf('@');
    } else {
      // atSign must be in auth portion.
      // http://a@b/c@d => host:b auth:a path:/c@d
      atSign = rest.lastIndexOf('@', hostEnd);
    } // Now we have a portion which is definitely the auth.
    // Pull that off.


    if (atSign !== -1) {
      auth = rest.slice(0, atSign);
      rest = rest.slice(atSign + 1);
      this.auth = decodeURIComponent(auth);
    } // the host is the remaining to the left of the first non-host char


    hostEnd = -1;

    for (var i = 0; i < nonHostChars.length; i++) {
      var hec = rest.indexOf(nonHostChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd)) hostEnd = hec;
    } // if we still have not hit it, then the entire thing is a host.


    if (hostEnd === -1) hostEnd = rest.length;
    this.host = rest.slice(0, hostEnd);
    rest = rest.slice(hostEnd); // pull out port.

    this.parseHost(); // we've indicated that there is a hostname,
    // so even if it's empty, it has to be present.

    this.hostname = this.hostname || ''; // if hostname begins with [ and ends with ]
    // assume that it's an IPv6 address.

    var ipv6Hostname = this.hostname[0] === '[' && this.hostname[this.hostname.length - 1] === ']'; // validate a little.

    if (!ipv6Hostname) {
      var hostparts = this.hostname.split(/\./);

      for (var i = 0, l = hostparts.length; i < l; i++) {
        var part = hostparts[i];
        if (!part) continue;

        if (!part.match(hostnamePartPattern)) {
          var newpart = '';

          for (var j = 0, k = part.length; j < k; j++) {
            if (part.charCodeAt(j) > 127) {
              // we replace non-ASCII char with a temporary placeholder
              // we need this to make sure size of hostname is not
              // broken by replacing non-ASCII by nothing
              newpart += 'x';
            } else {
              newpart += part[j];
            }
          } // we test again with ASCII char only


          if (!newpart.match(hostnamePartPattern)) {
            var validParts = hostparts.slice(0, i);
            var notHost = hostparts.slice(i + 1);
            var bit = part.match(hostnamePartStart);

            if (bit) {
              validParts.push(bit[1]);
              notHost.unshift(bit[2]);
            }

            if (notHost.length) {
              rest = '/' + notHost.join('.') + rest;
            }

            this.hostname = validParts.join('.');
            break;
          }
        }
      }
    }

    if (this.hostname.length > hostnameMaxLen) {
      this.hostname = '';
    } else {
      // hostnames are always lower case.
      this.hostname = this.hostname.toLowerCase();
    }

    if (!ipv6Hostname) {
      // IDNA Support: Returns a punycoded representation of "domain".
      // It only converts parts of the domain name that
      // have non-ASCII characters, i.e. it doesn't matter if
      // you call it with a domain that already is ASCII-only.
      this.hostname = punycode.toASCII(this.hostname);
    }

    var p = this.port ? ':' + this.port : '';
    var h = this.hostname || '';
    this.host = h + p;
    this.href += this.host; // strip [ and ] from the hostname
    // the host field still retains them, though

    if (ipv6Hostname) {
      this.hostname = this.hostname.substr(1, this.hostname.length - 2);

      if (rest[0] !== '/') {
        rest = '/' + rest;
      }
    }
  } // now rest is set to the post-host stuff.
  // chop off any delim chars.


  if (!unsafeProtocol[lowerProto]) {
    // First, make 100% sure that any "autoEscape" chars get
    // escaped, even if encodeURIComponent doesn't think they
    // need to be.
    for (var i = 0, l = autoEscape.length; i < l; i++) {
      var ae = autoEscape[i];
      if (rest.indexOf(ae) === -1) continue;
      var esc = encodeURIComponent(ae);

      if (esc === ae) {
        esc = escape(ae);
      }

      rest = rest.split(ae).join(esc);
    }
  } // chop off from the tail first.


  var hash = rest.indexOf('#');

  if (hash !== -1) {
    // got a fragment string.
    this.hash = rest.substr(hash);
    rest = rest.slice(0, hash);
  }

  var qm = rest.indexOf('?');

  if (qm !== -1) {
    this.search = rest.substr(qm);
    this.query = rest.substr(qm + 1);

    if (parseQueryString) {
      this.query = querystring.parse(this.query);
    }

    rest = rest.slice(0, qm);
  } else if (parseQueryString) {
    // no query string, but parseQueryString still requested
    this.search = '';
    this.query = {};
  }

  if (rest) this.pathname = rest;

  if (slashedProtocol[lowerProto] && this.hostname && !this.pathname) {
    this.pathname = '/';
  } //to support http.request


  if (this.pathname || this.search) {
    var p = this.pathname || '';
    var s = this.search || '';
    this.path = p + s;
  } // finally, reconstruct the href based on what has been validated.


  this.href = this.format();
  return this;
}; // format a parsed object into a url string


function urlFormat(obj) {
  // ensure it's an object, and not a string url.
  // If it's an obj, this is a no-op.
  // this way, you can call url_format() on strings
  // to clean up potentially wonky urls.
  if (util.isString(obj)) obj = urlParse(obj);
  if (!(obj instanceof Url)) return Url.prototype.format.call(obj);
  return obj.format();
}

Url.prototype.format = function () {
  var auth = this.auth || '';

  if (auth) {
    auth = encodeURIComponent(auth);
    auth = auth.replace(/%3A/i, ':');
    auth += '@';
  }

  var protocol = this.protocol || '',
      pathname = this.pathname || '',
      hash = this.hash || '',
      host = false,
      query = '';

  if (this.host) {
    host = auth + this.host;
  } else if (this.hostname) {
    host = auth + (this.hostname.indexOf(':') === -1 ? this.hostname : '[' + this.hostname + ']');

    if (this.port) {
      host += ':' + this.port;
    }
  }

  if (this.query && util.isObject(this.query) && Object.keys(this.query).length) {
    query = querystring.stringify(this.query);
  }

  var search = this.search || query && '?' + query || '';
  if (protocol && protocol.substr(-1) !== ':') protocol += ':'; // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
  // unless they had them to begin with.

  if (this.slashes || (!protocol || slashedProtocol[protocol]) && host !== false) {
    host = '//' + (host || '');
    if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
  } else if (!host) {
    host = '';
  }

  if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
  if (search && search.charAt(0) !== '?') search = '?' + search;
  pathname = pathname.replace(/[?#]/g, function (match) {
    return encodeURIComponent(match);
  });
  search = search.replace('#', '%23');
  return protocol + host + pathname + search + hash;
};

Url.prototype.resolve = function (relative) {
  return this.resolveObject(urlParse(relative, false, true)).format();
};

Url.prototype.resolveObject = function (relative) {
  if (util.isString(relative)) {
    var rel = new Url();
    rel.parse(relative, false, true);
    relative = rel;
  }

  var result = new Url();
  var tkeys = Object.keys(this);

  for (var tk = 0; tk < tkeys.length; tk++) {
    var tkey = tkeys[tk];
    result[tkey] = this[tkey];
  } // hash is always overridden, no matter what.
  // even href="" will remove it.


  result.hash = relative.hash; // if the relative url is empty, then there's nothing left to do here.

  if (relative.href === '') {
    result.href = result.format();
    return result;
  } // hrefs like //foo/bar always cut to the protocol.


  if (relative.slashes && !relative.protocol) {
    // take everything except the protocol from relative
    var rkeys = Object.keys(relative);

    for (var rk = 0; rk < rkeys.length; rk++) {
      var rkey = rkeys[rk];
      if (rkey !== 'protocol') result[rkey] = relative[rkey];
    } //urlParse appends trailing / to urls like http://www.example.com


    if (slashedProtocol[result.protocol] && result.hostname && !result.pathname) {
      result.path = result.pathname = '/';
    }

    result.href = result.format();
    return result;
  }

  if (relative.protocol && relative.protocol !== result.protocol) {
    // if it's a known url protocol, then changing
    // the protocol does weird things
    // first, if it's not file:, then we MUST have a host,
    // and if there was a path
    // to begin with, then we MUST have a path.
    // if it is file:, then the host is dropped,
    // because that's known to be hostless.
    // anything else is assumed to be absolute.
    if (!slashedProtocol[relative.protocol]) {
      var keys = Object.keys(relative);

      for (var v = 0; v < keys.length; v++) {
        var k = keys[v];
        result[k] = relative[k];
      }

      result.href = result.format();
      return result;
    }

    result.protocol = relative.protocol;

    if (!relative.host && !hostlessProtocol[relative.protocol]) {
      var relPath = (relative.pathname || '').split('/');

      while (relPath.length && !(relative.host = relPath.shift()));

      if (!relative.host) relative.host = '';
      if (!relative.hostname) relative.hostname = '';
      if (relPath[0] !== '') relPath.unshift('');
      if (relPath.length < 2) relPath.unshift('');
      result.pathname = relPath.join('/');
    } else {
      result.pathname = relative.pathname;
    }

    result.search = relative.search;
    result.query = relative.query;
    result.host = relative.host || '';
    result.auth = relative.auth;
    result.hostname = relative.hostname || relative.host;
    result.port = relative.port; // to support http.request

    if (result.pathname || result.search) {
      var p = result.pathname || '';
      var s = result.search || '';
      result.path = p + s;
    }

    result.slashes = result.slashes || relative.slashes;
    result.href = result.format();
    return result;
  }

  var isSourceAbs = result.pathname && result.pathname.charAt(0) === '/',
      isRelAbs = relative.host || relative.pathname && relative.pathname.charAt(0) === '/',
      mustEndAbs = isRelAbs || isSourceAbs || result.host && relative.pathname,
      removeAllDots = mustEndAbs,
      srcPath = result.pathname && result.pathname.split('/') || [],
      relPath = relative.pathname && relative.pathname.split('/') || [],
      psychotic = result.protocol && !slashedProtocol[result.protocol]; // if the url is a non-slashed url, then relative
  // links like ../.. should be able
  // to crawl up to the hostname, as well.  This is strange.
  // result.protocol has already been set by now.
  // Later on, put the first path part into the host field.

  if (psychotic) {
    result.hostname = '';
    result.port = null;

    if (result.host) {
      if (srcPath[0] === '') srcPath[0] = result.host;else srcPath.unshift(result.host);
    }

    result.host = '';

    if (relative.protocol) {
      relative.hostname = null;
      relative.port = null;

      if (relative.host) {
        if (relPath[0] === '') relPath[0] = relative.host;else relPath.unshift(relative.host);
      }

      relative.host = null;
    }

    mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
  }

  if (isRelAbs) {
    // it's absolute.
    result.host = relative.host || relative.host === '' ? relative.host : result.host;
    result.hostname = relative.hostname || relative.hostname === '' ? relative.hostname : result.hostname;
    result.search = relative.search;
    result.query = relative.query;
    srcPath = relPath; // fall through to the dot-handling below.
  } else if (relPath.length) {
    // it's relative
    // throw away the existing file, and take the new path instead.
    if (!srcPath) srcPath = [];
    srcPath.pop();
    srcPath = srcPath.concat(relPath);
    result.search = relative.search;
    result.query = relative.query;
  } else if (!util.isNullOrUndefined(relative.search)) {
    // just pull out the search.
    // like href='?foo'.
    // Put this after the other two cases because it simplifies the booleans
    if (psychotic) {
      result.hostname = result.host = srcPath.shift(); //occationaly the auth can get stuck only in host
      //this especially happens in cases like
      //url.resolveObject('mailto:local1@domain1', 'local2@domain2')

      var authInHost = result.host && result.host.indexOf('@') > 0 ? result.host.split('@') : false;

      if (authInHost) {
        result.auth = authInHost.shift();
        result.host = result.hostname = authInHost.shift();
      }
    }

    result.search = relative.search;
    result.query = relative.query; //to support http.request

    if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
      result.path = (result.pathname ? result.pathname : '') + (result.search ? result.search : '');
    }

    result.href = result.format();
    return result;
  }

  if (!srcPath.length) {
    // no path at all.  easy.
    // we've already handled the other stuff above.
    result.pathname = null; //to support http.request

    if (result.search) {
      result.path = '/' + result.search;
    } else {
      result.path = null;
    }

    result.href = result.format();
    return result;
  } // if a url ENDs in . or .., then it must get a trailing slash.
  // however, if it ends in anything else non-slashy,
  // then it must NOT get a trailing slash.


  var last = srcPath.slice(-1)[0];
  var hasTrailingSlash = (result.host || relative.host || srcPath.length > 1) && (last === '.' || last === '..') || last === ''; // strip single dots, resolve double dots to parent dir
  // if the path tries to go above the root, `up` ends up > 0

  var up = 0;

  for (var i = srcPath.length; i >= 0; i--) {
    last = srcPath[i];

    if (last === '.') {
      srcPath.splice(i, 1);
    } else if (last === '..') {
      srcPath.splice(i, 1);
      up++;
    } else if (up) {
      srcPath.splice(i, 1);
      up--;
    }
  } // if the path is allowed to go above the root, restore leading ..s


  if (!mustEndAbs && !removeAllDots) {
    for (; up--; up) {
      srcPath.unshift('..');
    }
  }

  if (mustEndAbs && srcPath[0] !== '' && (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
    srcPath.unshift('');
  }

  if (hasTrailingSlash && srcPath.join('/').substr(-1) !== '/') {
    srcPath.push('');
  }

  var isAbsolute = srcPath[0] === '' || srcPath[0] && srcPath[0].charAt(0) === '/'; // put the host back

  if (psychotic) {
    result.hostname = result.host = isAbsolute ? '' : srcPath.length ? srcPath.shift() : ''; //occationaly the auth can get stuck only in host
    //this especially happens in cases like
    //url.resolveObject('mailto:local1@domain1', 'local2@domain2')

    var authInHost = result.host && result.host.indexOf('@') > 0 ? result.host.split('@') : false;

    if (authInHost) {
      result.auth = authInHost.shift();
      result.host = result.hostname = authInHost.shift();
    }
  }

  mustEndAbs = mustEndAbs || result.host && srcPath.length;

  if (mustEndAbs && !isAbsolute) {
    srcPath.unshift('');
  }

  if (!srcPath.length) {
    result.pathname = null;
    result.path = null;
  } else {
    result.pathname = srcPath.join('/');
  } //to support request.http


  if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
    result.path = (result.pathname ? result.pathname : '') + (result.search ? result.search : '');
  }

  result.auth = relative.auth || result.auth;
  result.slashes = result.slashes || relative.slashes;
  result.href = result.format();
  return result;
};

Url.prototype.parseHost = function () {
  var host = this.host;
  var port = portPattern.exec(host);

  if (port) {
    port = port[0];

    if (port !== ':') {
      this.port = port.substr(1);
    }

    host = host.substr(0, host.length - port.length);
  }

  if (host) this.hostname = host;
};
/**
 * Returns a relative URL if the given request URL is relative to the current origin.
 * Otherwise returns an absolute URL.
 */


const getPublicUrlFromRequest = request => {
  return request.referrer.startsWith(request.url.origin) ? request.url.pathname : format({
    protocol: request.url.protocol,
    host: request.url.host,
    pathname: request.url.pathname
  });
};
/**
 * Performs a case-insensitive comparison of two given strings.
 */


exports.g = getPublicUrlFromRequest;

function isStringEqual(actual, expected) {
  return actual.toLowerCase() === expected.toLowerCase();
}

var RESTMethods;
exports.R = RESTMethods;

(function (RESTMethods) {
  RESTMethods["HEAD"] = "HEAD";
  RESTMethods["GET"] = "GET";
  RESTMethods["POST"] = "POST";
  RESTMethods["PUT"] = "PUT";
  RESTMethods["PATCH"] = "PATCH";
  RESTMethods["OPTIONS"] = "OPTIONS";
  RESTMethods["DELETE"] = "DELETE";
})(RESTMethods || (exports.R = RESTMethods = {}));

const restContext = {
  set: _fetchDeps.a,
  status: _fetchDeps.s,
  cookie: _xmlDeps.c,
  body: _xmlDeps.b,
  text: _xmlDeps.t,
  json: _fetchDeps.j,
  xml: _xmlDeps.x,
  delay: _fetchDeps.d,
  fetch: _fetchDeps.f
};
exports.a = restContext;

const createRestHandler = method => {
  return (mask, resolver) => {
    const resolvedMask = (0, _getCallFrameDeps.g)(mask);
    const callFrame = (0, _getCallFrameDeps.a)();
    return {
      parse(req) {
        // Match the request during parsing to prevent matching it twice
        // in order to get the request URL parameters.
        const match = (0, _getCallFrameDeps.m)(req.url, mask);
        return {
          match
        };
      },

      predicate(req, parsedRequest) {
        return isStringEqual(method, req.method) && parsedRequest.match.matches;
      },

      getPublicRequest(req, parsedRequest) {
        // Get request path parameters based on the given mask
        const params = mask && parsedRequest.match.params || {};
        return Object.assign(Object.assign({}, req), {
          params
        });
      },

      resolver,

      defineContext() {
        return restContext;
      },

      log(req, res, handler) {
        // Warn on request handler URL containing query parameters.
        if (resolvedMask instanceof URL && resolvedMask.search !== '') {
          const queryParams = [];
          resolvedMask.searchParams.forEach((_, paramName) => queryParams.push(paramName));
          console.warn(`\
[MSW] Found a redundant usage of query parameters in the request handler URL for "${method} ${mask}". Please match against a path instead, and access query parameters in the response resolver function:

rest.${method.toLowerCase()}("${resolvedMask.pathname}", (req, res, ctx) => {
  const query = req.url.searchParams
${queryParams.map(paramName => `\
  const ${paramName} = query.get("${paramName}")`).join('\n')}
})\
`);
        }

        const publicUrl = getPublicUrlFromRequest(req);
        const loggedRequest = (0, _getCallFrameDeps.b)(req);
        const loggedResponse = (0, _getCallFrameDeps.c)(res);
        console.groupCollapsed('[MSW] %s %s %s (%c%s%c)', (0, _getCallFrameDeps.d)(), req.method, publicUrl, `color:${(0, _getCallFrameDeps.e)(res.status)}`, res.status, 'color:inherit');
        console.log('Request', loggedRequest);
        console.log('Handler:', {
          mask,
          resolver: handler.resolver
        });
        console.log('Response', loggedResponse);
        console.groupEnd();
      },

      getMetaInfo() {
        return {
          type: 'rest',
          header: `[rest] ${method} ${mask.toString()}`,
          mask,
          callFrame
        };
      }

    };
  };
};

const rest = {
  /**
   * Captures a HEAD request by a given path.
   * @example
   * rest.head('/numbers', (req, res, ctx) => {
   *   return res(ctx.status(302))
   * })
   * @see {@link https://mswjs.io/docs/api/rest `rest`}
   */
  head: createRestHandler(RESTMethods.HEAD),

  /**
   * Captures a GET request by a given path.
   * @example
   * rest.get('/numbers', (req, res, ctx) => {
   *   return res(ctx.json([1, 2, 3]))
   * })
   * @see {@link https://mswjs.io/docs/api/rest `rest`}
   */
  get: createRestHandler(RESTMethods.GET),

  /**
   * Captures a POST request by a given path.
   * @example
   * rest.post('/numbers', (req, res, ctx) => {
   *   return res(ctx.text('success'))
   * })
   * @see {@link https://mswjs.io/docs/api/rest `rest`}
   */
  post: createRestHandler(RESTMethods.POST),

  /**
   * Captures a PUT request by a given path.
   * @example
   * rest.put('/numbers', (req, res, ctx) => {
   *   const { numbers } = req.body
   *   return res(ctx.json(numbers))
   * })
   * @see {@link https://mswjs.io/docs/api/rest `rest`}
   */
  put: createRestHandler(RESTMethods.PUT),

  /**
   * Captures a DELETE request by a given path.
   * @example
   * rest.delete('/numbers', (req, res, ctx) => {
   *   const index = req.url.searchParams.get('index')
   *   prevNumbers.splice(index, 1)
   *   return res(ctx.json(nextNumbers))
   * })
   * @see {@link https://mswjs.io/docs/api/rest `rest`}
   */
  delete: createRestHandler(RESTMethods.DELETE),

  /**
   * Captures a PATCH request by a given path.
   * @example
   * rest.patch('/numbers', (req, res, ctx) => {
   *   const { numbers } = req.body
   *   const nextNumbers = prevNumbers.concat(number)
   *   return res(ctx.json(nextNumbers))
   * })
   * @see {@link https://mswjs.io/docs/api/rest `rest`}
   */
  patch: createRestHandler(RESTMethods.PATCH),

  /**
   * Captures an OPTIONS request by a given path.
   * @example
   * rest.options('/numbers', (req, res, ctx) => {
   *   return res(ctx.set('Allow', 'GET,HEAD,POST'))
   * })
   * @see {@link https://mswjs.io/docs/api/rest `rest`}
   */
  options: createRestHandler(RESTMethods.OPTIONS)
};
exports.r = rest;
},{"./fetch-deps.js":"../node_modules/msw/lib/esm/fetch-deps.js","./xml-deps.js":"../node_modules/msw/lib/esm/xml-deps.js","./getCallFrame-deps.js":"../node_modules/msw/lib/esm/getCallFrame-deps.js"}],"../node_modules/msw/lib/esm/graphql.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.graphqlContext = exports.graphql = void 0;

var _fetchDeps = require("./fetch-deps.js");

var _errorsDeps = require("./errors-deps.js");

var _getCallFrameDeps = require("./getCallFrame-deps.js");

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}
/**
 * Return true if `value` is object-like. A value is object-like if it's not
 * `null` and has a `typeof` result of "object".
 */


function isObjectLike(value) {
  return _typeof(value) == 'object' && value !== null;
} // In ES2015 (or a polyfilled) environment, this will be Symbol.iterator


var SYMBOL_TO_STRING_TAG = typeof Symbol === 'function' && Symbol.toStringTag != null ? Symbol.toStringTag : '@@toStringTag';
/**
 * Represents a location in a Source.
 */

/**
 * Takes a Source and a UTF-8 character offset, and returns the corresponding
 * line and column as a SourceLocation.
 */

function getLocation(source, position) {
  var lineRegexp = /\r\n|[\n\r]/g;
  var line = 1;
  var column = position + 1;
  var match;

  while ((match = lineRegexp.exec(source.body)) && match.index < position) {
    line += 1;
    column = position + 1 - (match.index + match[0].length);
  }

  return {
    line: line,
    column: column
  };
}
/**
 * Render a helpful description of the location in the GraphQL Source document.
 */


function printLocation(location) {
  return printSourceLocation(location.source, getLocation(location.source, location.start));
}
/**
 * Render a helpful description of the location in the GraphQL Source document.
 */


function printSourceLocation(source, sourceLocation) {
  var firstLineColumnOffset = source.locationOffset.column - 1;
  var body = whitespace(firstLineColumnOffset) + source.body;
  var lineIndex = sourceLocation.line - 1;
  var lineOffset = source.locationOffset.line - 1;
  var lineNum = sourceLocation.line + lineOffset;
  var columnOffset = sourceLocation.line === 1 ? firstLineColumnOffset : 0;
  var columnNum = sourceLocation.column + columnOffset;
  var locationStr = "".concat(source.name, ":").concat(lineNum, ":").concat(columnNum, "\n");
  var lines = body.split(/\r\n|[\n\r]/g);
  var locationLine = lines[lineIndex]; // Special case for minified documents

  if (locationLine.length > 120) {
    var subLineIndex = Math.floor(columnNum / 80);
    var subLineColumnNum = columnNum % 80;
    var subLines = [];

    for (var i = 0; i < locationLine.length; i += 80) {
      subLines.push(locationLine.slice(i, i + 80));
    }

    return locationStr + printPrefixedLines([["".concat(lineNum), subLines[0]]].concat(subLines.slice(1, subLineIndex + 1).map(function (subLine) {
      return ['', subLine];
    }), [[' ', whitespace(subLineColumnNum - 1) + '^'], ['', subLines[subLineIndex + 1]]]));
  }

  return locationStr + printPrefixedLines([// Lines specified like this: ["prefix", "string"],
  ["".concat(lineNum - 1), lines[lineIndex - 1]], ["".concat(lineNum), locationLine], ['', whitespace(columnNum - 1) + '^'], ["".concat(lineNum + 1), lines[lineIndex + 1]]]);
}

function printPrefixedLines(lines) {
  var existingLines = lines.filter(function (_ref) {
    var _ = _ref[0],
        line = _ref[1];
    return line !== undefined;
  });
  var padLen = Math.max.apply(Math, existingLines.map(function (_ref2) {
    var prefix = _ref2[0];
    return prefix.length;
  }));
  return existingLines.map(function (_ref3) {
    var prefix = _ref3[0],
        line = _ref3[1];
    return leftPad(padLen, prefix) + (line ? ' | ' + line : ' |');
  }).join('\n');
}

function whitespace(len) {
  return Array(len + 1).join(' ');
}

function leftPad(len, str) {
  return whitespace(len - str.length) + str;
}

function _typeof$1(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof$1 = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof$1 = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof$1(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();

  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived),
        result;

    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;

      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }

    return _possibleConstructorReturn(this, result);
  };
}

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof$1(call) === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _wrapNativeSuper(Class) {
  var _cache = typeof Map === "function" ? new Map() : undefined;

  _wrapNativeSuper = function _wrapNativeSuper(Class) {
    if (Class === null || !_isNativeFunction(Class)) return Class;

    if (typeof Class !== "function") {
      throw new TypeError("Super expression must either be null or a function");
    }

    if (typeof _cache !== "undefined") {
      if (_cache.has(Class)) return _cache.get(Class);

      _cache.set(Class, Wrapper);
    }

    function Wrapper() {
      return _construct(Class, arguments, _getPrototypeOf(this).constructor);
    }

    Wrapper.prototype = Object.create(Class.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    return _setPrototypeOf(Wrapper, Class);
  };

  return _wrapNativeSuper(Class);
}

function _construct(Parent, args, Class) {
  if (_isNativeReflectConstruct()) {
    _construct = Reflect.construct;
  } else {
    _construct = function _construct(Parent, args, Class) {
      var a = [null];
      a.push.apply(a, args);
      var Constructor = Function.bind.apply(Parent, a);
      var instance = new Constructor();
      if (Class) _setPrototypeOf(instance, Class.prototype);
      return instance;
    };
  }

  return _construct.apply(null, arguments);
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _isNativeFunction(fn) {
  return Function.toString.call(fn).indexOf("[native code]") !== -1;
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}
/**
 * A GraphQLError describes an Error found during the parse, validate, or
 * execute phases of performing a GraphQL operation. In addition to a message
 * and stack trace, it also includes information about the locations in a
 * GraphQL document and/or execution result that correspond to the Error.
 */


var GraphQLError = /*#__PURE__*/function (_Error) {
  _inherits(GraphQLError, _Error);

  var _super = _createSuper(GraphQLError);
  /**
   * A message describing the Error for debugging purposes.
   *
   * Enumerable, and appears in the result of JSON.stringify().
   *
   * Note: should be treated as readonly, despite invariant usage.
   */

  /**
   * An array of { line, column } locations within the source GraphQL document
   * which correspond to this error.
   *
   * Errors during validation often contain multiple locations, for example to
   * point out two things with the same name. Errors during execution include a
   * single location, the field which produced the error.
   *
   * Enumerable, and appears in the result of JSON.stringify().
   */

  /**
   * An array describing the JSON-path into the execution response which
   * corresponds to this error. Only included for errors during execution.
   *
   * Enumerable, and appears in the result of JSON.stringify().
   */

  /**
   * An array of GraphQL AST Nodes corresponding to this error.
   */

  /**
   * The source GraphQL document for the first location of this error.
   *
   * Note that if this Error represents more than one node, the source may not
   * represent nodes after the first node.
   */

  /**
   * An array of character offsets within the source GraphQL document
   * which correspond to this error.
   */

  /**
   * The original error thrown from a field resolver during execution.
   */

  /**
   * Extension fields to add to the formatted error.
   */


  function GraphQLError(message, nodes, source, positions, path, originalError, extensions) {
    var _locations2, _source2, _positions2, _extensions2;

    var _this;

    _classCallCheck(this, GraphQLError);

    _this = _super.call(this, message); // Compute list of blame nodes.

    var _nodes = Array.isArray(nodes) ? nodes.length !== 0 ? nodes : undefined : nodes ? [nodes] : undefined; // Compute locations in the source for the given nodes/positions.


    var _source = source;

    if (!_source && _nodes) {
      var _nodes$0$loc;

      _source = (_nodes$0$loc = _nodes[0].loc) === null || _nodes$0$loc === void 0 ? void 0 : _nodes$0$loc.source;
    }

    var _positions = positions;

    if (!_positions && _nodes) {
      _positions = _nodes.reduce(function (list, node) {
        if (node.loc) {
          list.push(node.loc.start);
        }

        return list;
      }, []);
    }

    if (_positions && _positions.length === 0) {
      _positions = undefined;
    }

    var _locations;

    if (positions && source) {
      _locations = positions.map(function (pos) {
        return getLocation(source, pos);
      });
    } else if (_nodes) {
      _locations = _nodes.reduce(function (list, node) {
        if (node.loc) {
          list.push(getLocation(node.loc.source, node.loc.start));
        }

        return list;
      }, []);
    }

    var _extensions = extensions;

    if (_extensions == null && originalError != null) {
      var originalExtensions = originalError.extensions;

      if (isObjectLike(originalExtensions)) {
        _extensions = originalExtensions;
      }
    }

    Object.defineProperties(_assertThisInitialized(_this), {
      name: {
        value: 'GraphQLError'
      },
      message: {
        value: message,
        // By being enumerable, JSON.stringify will include `message` in the
        // resulting output. This ensures that the simplest possible GraphQL
        // service adheres to the spec.
        enumerable: true,
        writable: true
      },
      locations: {
        // Coercing falsy values to undefined ensures they will not be included
        // in JSON.stringify() when not provided.
        value: (_locations2 = _locations) !== null && _locations2 !== void 0 ? _locations2 : undefined,
        // By being enumerable, JSON.stringify will include `locations` in the
        // resulting output. This ensures that the simplest possible GraphQL
        // service adheres to the spec.
        enumerable: _locations != null
      },
      path: {
        // Coercing falsy values to undefined ensures they will not be included
        // in JSON.stringify() when not provided.
        value: path !== null && path !== void 0 ? path : undefined,
        // By being enumerable, JSON.stringify will include `path` in the
        // resulting output. This ensures that the simplest possible GraphQL
        // service adheres to the spec.
        enumerable: path != null
      },
      nodes: {
        value: _nodes !== null && _nodes !== void 0 ? _nodes : undefined
      },
      source: {
        value: (_source2 = _source) !== null && _source2 !== void 0 ? _source2 : undefined
      },
      positions: {
        value: (_positions2 = _positions) !== null && _positions2 !== void 0 ? _positions2 : undefined
      },
      originalError: {
        value: originalError
      },
      extensions: {
        // Coercing falsy values to undefined ensures they will not be included
        // in JSON.stringify() when not provided.
        value: (_extensions2 = _extensions) !== null && _extensions2 !== void 0 ? _extensions2 : undefined,
        // By being enumerable, JSON.stringify will include `path` in the
        // resulting output. This ensures that the simplest possible GraphQL
        // service adheres to the spec.
        enumerable: _extensions != null
      }
    }); // Include (non-enumerable) stack trace.

    if (originalError === null || originalError === void 0 ? void 0 : originalError.stack) {
      Object.defineProperty(_assertThisInitialized(_this), 'stack', {
        value: originalError.stack,
        writable: true,
        configurable: true
      });
      return _possibleConstructorReturn(_this);
    } // istanbul ignore next (See: 'https://github.com/graphql/graphql-js/issues/2317')


    if (Error.captureStackTrace) {
      Error.captureStackTrace(_assertThisInitialized(_this), GraphQLError);
    } else {
      Object.defineProperty(_assertThisInitialized(_this), 'stack', {
        value: Error().stack,
        writable: true,
        configurable: true
      });
    }

    return _this;
  }

  _createClass(GraphQLError, [{
    key: "toString",
    value: function toString() {
      return printError(this);
    } // FIXME: workaround to not break chai comparisons, should be remove in v16
    // $FlowFixMe[unsupported-syntax] Flow doesn't support computed properties yet

  }, {
    key: SYMBOL_TO_STRING_TAG,
    get: function get() {
      return 'Object';
    }
  }]);

  return GraphQLError;
}( /*#__PURE__*/_wrapNativeSuper(Error));
/**
 * Prints a GraphQLError to a string, representing useful location information
 * about the error's position in the source.
 */


function printError(error) {
  var output = error.message;

  if (error.nodes) {
    for (var _i2 = 0, _error$nodes2 = error.nodes; _i2 < _error$nodes2.length; _i2++) {
      var node = _error$nodes2[_i2];

      if (node.loc) {
        output += '\n\n' + printLocation(node.loc);
      }
    }
  } else if (error.source && error.locations) {
    for (var _i4 = 0, _error$locations2 = error.locations; _i4 < _error$locations2.length; _i4++) {
      var location = _error$locations2[_i4];
      output += '\n\n' + printSourceLocation(error.source, location);
    }
  }

  return output;
}
/**
 * Produces a GraphQLError representing a syntax error, containing useful
 * descriptive information about the syntax error's position in the source.
 */


function syntaxError(source, position, description) {
  return new GraphQLError("Syntax Error: ".concat(description), undefined, source, [position]);
}
/**
 * The set of allowed kind values for AST nodes.
 */


var Kind = Object.freeze({
  // Name
  NAME: 'Name',
  // Document
  DOCUMENT: 'Document',
  OPERATION_DEFINITION: 'OperationDefinition',
  VARIABLE_DEFINITION: 'VariableDefinition',
  SELECTION_SET: 'SelectionSet',
  FIELD: 'Field',
  ARGUMENT: 'Argument',
  // Fragments
  FRAGMENT_SPREAD: 'FragmentSpread',
  INLINE_FRAGMENT: 'InlineFragment',
  FRAGMENT_DEFINITION: 'FragmentDefinition',
  // Values
  VARIABLE: 'Variable',
  INT: 'IntValue',
  FLOAT: 'FloatValue',
  STRING: 'StringValue',
  BOOLEAN: 'BooleanValue',
  NULL: 'NullValue',
  ENUM: 'EnumValue',
  LIST: 'ListValue',
  OBJECT: 'ObjectValue',
  OBJECT_FIELD: 'ObjectField',
  // Directives
  DIRECTIVE: 'Directive',
  // Types
  NAMED_TYPE: 'NamedType',
  LIST_TYPE: 'ListType',
  NON_NULL_TYPE: 'NonNullType',
  // Type System Definitions
  SCHEMA_DEFINITION: 'SchemaDefinition',
  OPERATION_TYPE_DEFINITION: 'OperationTypeDefinition',
  // Type Definitions
  SCALAR_TYPE_DEFINITION: 'ScalarTypeDefinition',
  OBJECT_TYPE_DEFINITION: 'ObjectTypeDefinition',
  FIELD_DEFINITION: 'FieldDefinition',
  INPUT_VALUE_DEFINITION: 'InputValueDefinition',
  INTERFACE_TYPE_DEFINITION: 'InterfaceTypeDefinition',
  UNION_TYPE_DEFINITION: 'UnionTypeDefinition',
  ENUM_TYPE_DEFINITION: 'EnumTypeDefinition',
  ENUM_VALUE_DEFINITION: 'EnumValueDefinition',
  INPUT_OBJECT_TYPE_DEFINITION: 'InputObjectTypeDefinition',
  // Directive Definitions
  DIRECTIVE_DEFINITION: 'DirectiveDefinition',
  // Type System Extensions
  SCHEMA_EXTENSION: 'SchemaExtension',
  // Type Extensions
  SCALAR_TYPE_EXTENSION: 'ScalarTypeExtension',
  OBJECT_TYPE_EXTENSION: 'ObjectTypeExtension',
  INTERFACE_TYPE_EXTENSION: 'InterfaceTypeExtension',
  UNION_TYPE_EXTENSION: 'UnionTypeExtension',
  ENUM_TYPE_EXTENSION: 'EnumTypeExtension',
  INPUT_OBJECT_TYPE_EXTENSION: 'InputObjectTypeExtension'
});
/**
 * The enum type representing the possible kind values of AST nodes.
 */

function invariant(condition, message) {
  var booleanCondition = Boolean(condition); // istanbul ignore else (See transformation done in './resources/inlineInvariant.js')

  if (!booleanCondition) {
    throw new Error(message != null ? message : 'Unexpected invariant triggered.');
  }
} // istanbul ignore next (See: 'https://github.com/graphql/graphql-js/issues/2317')


var nodejsCustomInspectSymbol = typeof Symbol === 'function' && typeof Symbol.for === 'function' ? Symbol.for('nodejs.util.inspect.custom') : undefined;
/**
 * The `defineInspect()` function defines `inspect()` prototype method as alias of `toJSON`
 */

function defineInspect(classObject) {
  var fn = classObject.prototype.toJSON;
  typeof fn === 'function' || invariant(0);
  classObject.prototype.inspect = fn; // istanbul ignore else (See: 'https://github.com/graphql/graphql-js/issues/2317')

  if (nodejsCustomInspectSymbol) {
    classObject.prototype[nodejsCustomInspectSymbol] = fn;
  }
}
/**
 * Contains a range of UTF-8 character offsets and token references that
 * identify the region of the source from which the AST derived.
 */


var Location = /*#__PURE__*/function () {
  /**
   * The character offset at which this Node begins.
   */

  /**
   * The character offset at which this Node ends.
   */

  /**
   * The Token at which this Node begins.
   */

  /**
   * The Token at which this Node ends.
   */

  /**
   * The Source document the AST represents.
   */
  function Location(startToken, endToken, source) {
    this.start = startToken.start;
    this.end = endToken.end;
    this.startToken = startToken;
    this.endToken = endToken;
    this.source = source;
  }

  var _proto = Location.prototype;

  _proto.toJSON = function toJSON() {
    return {
      start: this.start,
      end: this.end
    };
  };

  return Location;
}(); // Print a simplified form when appearing in `inspect` and `util.inspect`.


defineInspect(Location);
/**
 * Represents a range of characters represented by a lexical token
 * within a Source.
 */

var Token = /*#__PURE__*/function () {
  /**
   * The kind of Token.
   */

  /**
   * The character offset at which this Node begins.
   */

  /**
   * The character offset at which this Node ends.
   */

  /**
   * The 1-indexed line number on which this Token appears.
   */

  /**
   * The 1-indexed column number at which this Token begins.
   */

  /**
   * For non-punctuation tokens, represents the interpreted value of the token.
   */

  /**
   * Tokens exist as nodes in a double-linked-list amongst all tokens
   * including ignored tokens. <SOF> is always the first node and <EOF>
   * the last.
   */
  function Token(kind, start, end, line, column, prev, value) {
    this.kind = kind;
    this.start = start;
    this.end = end;
    this.line = line;
    this.column = column;
    this.value = value;
    this.prev = prev;
    this.next = null;
  }

  var _proto2 = Token.prototype;

  _proto2.toJSON = function toJSON() {
    return {
      kind: this.kind,
      value: this.value,
      line: this.line,
      column: this.column
    };
  };

  return Token;
}(); // Print a simplified form when appearing in `inspect` and `util.inspect`.


defineInspect(Token);
/**
 * The list of all possible AST node types.
 */

/**
 * An exported enum describing the different kinds of tokens that the
 * lexer emits.
 */

var TokenKind = Object.freeze({
  SOF: '<SOF>',
  EOF: '<EOF>',
  BANG: '!',
  DOLLAR: '$',
  AMP: '&',
  PAREN_L: '(',
  PAREN_R: ')',
  SPREAD: '...',
  COLON: ':',
  EQUALS: '=',
  AT: '@',
  BRACKET_L: '[',
  BRACKET_R: ']',
  BRACE_L: '{',
  PIPE: '|',
  BRACE_R: '}',
  NAME: 'Name',
  INT: 'Int',
  FLOAT: 'Float',
  STRING: 'String',
  BLOCK_STRING: 'BlockString',
  COMMENT: 'Comment'
});
/**
 * The enum type representing the token kinds values.
 */

function _typeof$2(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof$2 = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof$2 = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof$2(obj);
}

var MAX_ARRAY_LENGTH = 10;
var MAX_RECURSIVE_DEPTH = 2;
/**
 * Used to print values in error messages.
 */

function inspect(value) {
  return formatValue(value, []);
}

function formatValue(value, seenValues) {
  switch (_typeof$2(value)) {
    case 'string':
      return JSON.stringify(value);

    case 'function':
      return value.name ? "[function ".concat(value.name, "]") : '[function]';

    case 'object':
      if (value === null) {
        return 'null';
      }

      return formatObjectValue(value, seenValues);

    default:
      return String(value);
  }
}

function formatObjectValue(value, previouslySeenValues) {
  if (previouslySeenValues.indexOf(value) !== -1) {
    return '[Circular]';
  }

  var seenValues = [].concat(previouslySeenValues, [value]);
  var customInspectFn = getCustomFn(value);

  if (customInspectFn !== undefined) {
    var customValue = customInspectFn.call(value); // check for infinite recursion

    if (customValue !== value) {
      return typeof customValue === 'string' ? customValue : formatValue(customValue, seenValues);
    }
  } else if (Array.isArray(value)) {
    return formatArray(value, seenValues);
  }

  return formatObject(value, seenValues);
}

function formatObject(object, seenValues) {
  var keys = Object.keys(object);

  if (keys.length === 0) {
    return '{}';
  }

  if (seenValues.length > MAX_RECURSIVE_DEPTH) {
    return '[' + getObjectTag(object) + ']';
  }

  var properties = keys.map(function (key) {
    var value = formatValue(object[key], seenValues);
    return key + ': ' + value;
  });
  return '{ ' + properties.join(', ') + ' }';
}

function formatArray(array, seenValues) {
  if (array.length === 0) {
    return '[]';
  }

  if (seenValues.length > MAX_RECURSIVE_DEPTH) {
    return '[Array]';
  }

  var len = Math.min(MAX_ARRAY_LENGTH, array.length);
  var remaining = array.length - len;
  var items = [];

  for (var i = 0; i < len; ++i) {
    items.push(formatValue(array[i], seenValues));
  }

  if (remaining === 1) {
    items.push('... 1 more item');
  } else if (remaining > 1) {
    items.push("... ".concat(remaining, " more items"));
  }

  return '[' + items.join(', ') + ']';
}

function getCustomFn(object) {
  var customInspectFn = object[String(nodejsCustomInspectSymbol)];

  if (typeof customInspectFn === 'function') {
    return customInspectFn;
  }

  if (typeof object.inspect === 'function') {
    return object.inspect;
  }
}

function getObjectTag(object) {
  var tag = Object.prototype.toString.call(object).replace(/^\[object /, '').replace(/]$/, '');

  if (tag === 'Object' && typeof object.constructor === 'function') {
    var name = object.constructor.name;

    if (typeof name === 'string' && name !== '') {
      return name;
    }
  }

  return tag;
}

function devAssert(condition, message) {
  var booleanCondition = Boolean(condition); // istanbul ignore else (See transformation done in './resources/inlineInvariant.js')

  if (!booleanCondition) {
    throw new Error(message);
  }
}
/**
 * A replacement for instanceof which includes an error warning when multi-realm
 * constructors are detected.
 */
// See: https://expressjs.com/en/advanced/best-practice-performance.html#set-node_env-to-production
// See: https://webpack.js.org/guides/production/


var instanceOf = "development" === 'production' ? // istanbul ignore next (See: 'https://github.com/graphql/graphql-js/issues/2317')
// eslint-disable-next-line no-shadow
function instanceOf(value, constructor) {
  return value instanceof constructor;
} : // eslint-disable-next-line no-shadow
function instanceOf(value, constructor) {
  if (value instanceof constructor) {
    return true;
  }

  if (value) {
    var valueClass = value.constructor;
    var className = constructor.name;

    if (className && valueClass && valueClass.name === className) {
      throw new Error("Cannot use ".concat(className, " \"").concat(value, "\" from another module or realm.\n\nEnsure that there is only one instance of \"graphql\" in the node_modules\ndirectory. If different versions of \"graphql\" are the dependencies of other\nrelied on modules, use \"resolutions\" to ensure only one version is installed.\n\nhttps://yarnpkg.com/en/docs/selective-version-resolutions\n\nDuplicate \"graphql\" modules cannot be used at the same time since different\nversions may have different capabilities and behavior. The data from one\nversion used in the function from another could produce confusing and\nspurious results."));
    }
  }

  return false;
};

function _defineProperties$1(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass$1(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties$1(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties$1(Constructor, staticProps);
  return Constructor;
}
/**
 * A representation of source input to GraphQL. The `name` and `locationOffset` parameters are
 * optional, but they are useful for clients who store GraphQL documents in source files.
 * For example, if the GraphQL input starts at line 40 in a file named `Foo.graphql`, it might
 * be useful for `name` to be `"Foo.graphql"` and location to be `{ line: 40, column: 1 }`.
 * The `line` and `column` properties in `locationOffset` are 1-indexed.
 */


var Source = /*#__PURE__*/function () {
  function Source(body) {
    var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'GraphQL request';
    var locationOffset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
      line: 1,
      column: 1
    };
    typeof body === 'string' || devAssert(0, "Body must be a string. Received: ".concat(inspect(body), "."));
    this.body = body;
    this.name = name;
    this.locationOffset = locationOffset;
    this.locationOffset.line > 0 || devAssert(0, 'line in locationOffset is 1-indexed and must be positive.');
    this.locationOffset.column > 0 || devAssert(0, 'column in locationOffset is 1-indexed and must be positive.');
  } // $FlowFixMe[unsupported-syntax] Flow doesn't support computed properties yet


  _createClass$1(Source, [{
    key: SYMBOL_TO_STRING_TAG,
    get: function get() {
      return 'Source';
    }
  }]);

  return Source;
}();
/**
 * Test if the given value is a Source object.
 *
 * @internal
 */
// eslint-disable-next-line no-redeclare


function isSource(source) {
  return instanceOf(source, Source);
}
/**
 * The set of allowed directive location values.
 */


var DirectiveLocation = Object.freeze({
  // Request Definitions
  QUERY: 'QUERY',
  MUTATION: 'MUTATION',
  SUBSCRIPTION: 'SUBSCRIPTION',
  FIELD: 'FIELD',
  FRAGMENT_DEFINITION: 'FRAGMENT_DEFINITION',
  FRAGMENT_SPREAD: 'FRAGMENT_SPREAD',
  INLINE_FRAGMENT: 'INLINE_FRAGMENT',
  VARIABLE_DEFINITION: 'VARIABLE_DEFINITION',
  // Type System Definitions
  SCHEMA: 'SCHEMA',
  SCALAR: 'SCALAR',
  OBJECT: 'OBJECT',
  FIELD_DEFINITION: 'FIELD_DEFINITION',
  ARGUMENT_DEFINITION: 'ARGUMENT_DEFINITION',
  INTERFACE: 'INTERFACE',
  UNION: 'UNION',
  ENUM: 'ENUM',
  ENUM_VALUE: 'ENUM_VALUE',
  INPUT_OBJECT: 'INPUT_OBJECT',
  INPUT_FIELD_DEFINITION: 'INPUT_FIELD_DEFINITION'
});
/**
 * The enum type representing the directive location values.
 */

/**
 * Produces the value of a block string from its parsed raw value, similar to
 * CoffeeScript's block string, Python's docstring trim or Ruby's strip_heredoc.
 *
 * This implements the GraphQL spec's BlockStringValue() static algorithm.
 *
 * @internal
 */

function dedentBlockStringValue(rawString) {
  // Expand a block string's raw value into independent lines.
  var lines = rawString.split(/\r\n|[\n\r]/g); // Remove common indentation from all lines but first.

  var commonIndent = getBlockStringIndentation(rawString);

  if (commonIndent !== 0) {
    for (var i = 1; i < lines.length; i++) {
      lines[i] = lines[i].slice(commonIndent);
    }
  } // Remove leading and trailing blank lines.


  var startLine = 0;

  while (startLine < lines.length && isBlank(lines[startLine])) {
    ++startLine;
  }

  var endLine = lines.length;

  while (endLine > startLine && isBlank(lines[endLine - 1])) {
    --endLine;
  } // Return a string of the lines joined with U+000A.


  return lines.slice(startLine, endLine).join('\n');
}

function isBlank(str) {
  for (var i = 0; i < str.length; ++i) {
    if (str[i] !== ' ' && str[i] !== '\t') {
      return false;
    }
  }

  return true;
}
/**
 * @internal
 */


function getBlockStringIndentation(value) {
  var _commonIndent;

  var isFirstLine = true;
  var isEmptyLine = true;
  var indent = 0;
  var commonIndent = null;

  for (var i = 0; i < value.length; ++i) {
    switch (value.charCodeAt(i)) {
      case 13:
        //  \r
        if (value.charCodeAt(i + 1) === 10) {
          ++i; // skip \r\n as one symbol
        }

      // falls through

      case 10:
        //  \n
        isFirstLine = false;
        isEmptyLine = true;
        indent = 0;
        break;

      case 9: //   \t

      case 32:
        //  <space>
        ++indent;
        break;

      default:
        if (isEmptyLine && !isFirstLine && (commonIndent === null || indent < commonIndent)) {
          commonIndent = indent;
        }

        isEmptyLine = false;
    }
  }

  return (_commonIndent = commonIndent) !== null && _commonIndent !== void 0 ? _commonIndent : 0;
}
/**
 * Given a Source object, creates a Lexer for that source.
 * A Lexer is a stateful stream generator in that every time
 * it is advanced, it returns the next token in the Source. Assuming the
 * source lexes, the final Token emitted by the lexer will be of kind
 * EOF, after which the lexer will repeatedly return the same EOF token
 * whenever called.
 */


var Lexer = /*#__PURE__*/function () {
  /**
   * The previously focused non-ignored token.
   */

  /**
   * The currently focused non-ignored token.
   */

  /**
   * The (1-indexed) line containing the current token.
   */

  /**
   * The character offset at which the current line begins.
   */
  function Lexer(source) {
    var startOfFileToken = new Token(TokenKind.SOF, 0, 0, 0, 0, null);
    this.source = source;
    this.lastToken = startOfFileToken;
    this.token = startOfFileToken;
    this.line = 1;
    this.lineStart = 0;
  }
  /**
   * Advances the token stream to the next non-ignored token.
   */


  var _proto = Lexer.prototype;

  _proto.advance = function advance() {
    this.lastToken = this.token;
    var token = this.token = this.lookahead();
    return token;
  }
  /**
   * Looks ahead and returns the next non-ignored token, but does not change
   * the state of Lexer.
   */
  ;

  _proto.lookahead = function lookahead() {
    var token = this.token;

    if (token.kind !== TokenKind.EOF) {
      do {
        var _token$next; // Note: next is only mutable during parsing, so we cast to allow this.


        token = (_token$next = token.next) !== null && _token$next !== void 0 ? _token$next : token.next = readToken(this, token);
      } while (token.kind === TokenKind.COMMENT);
    }

    return token;
  };

  return Lexer;
}();
/**
 * @internal
 */


function isPunctuatorTokenKind(kind) {
  return kind === TokenKind.BANG || kind === TokenKind.DOLLAR || kind === TokenKind.AMP || kind === TokenKind.PAREN_L || kind === TokenKind.PAREN_R || kind === TokenKind.SPREAD || kind === TokenKind.COLON || kind === TokenKind.EQUALS || kind === TokenKind.AT || kind === TokenKind.BRACKET_L || kind === TokenKind.BRACKET_R || kind === TokenKind.BRACE_L || kind === TokenKind.PIPE || kind === TokenKind.BRACE_R;
}

function printCharCode(code) {
  return (// NaN/undefined represents access beyond the end of the file.
    isNaN(code) ? TokenKind.EOF : // Trust JSON for ASCII.
    code < 0x007f ? JSON.stringify(String.fromCharCode(code)) : // Otherwise print the escaped form.
    "\"\\u".concat(('00' + code.toString(16).toUpperCase()).slice(-4), "\"")
  );
}
/**
 * Gets the next token from the source starting at the given position.
 *
 * This skips over whitespace until it finds the next lexable token, then lexes
 * punctuators immediately or calls the appropriate helper function for more
 * complicated tokens.
 */


function readToken(lexer, prev) {
  var source = lexer.source;
  var body = source.body;
  var bodyLength = body.length;
  var pos = prev.end;

  while (pos < bodyLength) {
    var code = body.charCodeAt(pos);
    var _line = lexer.line;

    var _col = 1 + pos - lexer.lineStart; // SourceCharacter


    switch (code) {
      case 0xfeff: // <BOM>

      case 9: //   \t

      case 32: //  <space>

      case 44:
        //  ,
        ++pos;
        continue;

      case 10:
        //  \n
        ++pos;
        ++lexer.line;
        lexer.lineStart = pos;
        continue;

      case 13:
        //  \r
        if (body.charCodeAt(pos + 1) === 10) {
          pos += 2;
        } else {
          ++pos;
        }

        ++lexer.line;
        lexer.lineStart = pos;
        continue;

      case 33:
        //  !
        return new Token(TokenKind.BANG, pos, pos + 1, _line, _col, prev);

      case 35:
        //  #
        return readComment(source, pos, _line, _col, prev);

      case 36:
        //  $
        return new Token(TokenKind.DOLLAR, pos, pos + 1, _line, _col, prev);

      case 38:
        //  &
        return new Token(TokenKind.AMP, pos, pos + 1, _line, _col, prev);

      case 40:
        //  (
        return new Token(TokenKind.PAREN_L, pos, pos + 1, _line, _col, prev);

      case 41:
        //  )
        return new Token(TokenKind.PAREN_R, pos, pos + 1, _line, _col, prev);

      case 46:
        //  .
        if (body.charCodeAt(pos + 1) === 46 && body.charCodeAt(pos + 2) === 46) {
          return new Token(TokenKind.SPREAD, pos, pos + 3, _line, _col, prev);
        }

        break;

      case 58:
        //  :
        return new Token(TokenKind.COLON, pos, pos + 1, _line, _col, prev);

      case 61:
        //  =
        return new Token(TokenKind.EQUALS, pos, pos + 1, _line, _col, prev);

      case 64:
        //  @
        return new Token(TokenKind.AT, pos, pos + 1, _line, _col, prev);

      case 91:
        //  [
        return new Token(TokenKind.BRACKET_L, pos, pos + 1, _line, _col, prev);

      case 93:
        //  ]
        return new Token(TokenKind.BRACKET_R, pos, pos + 1, _line, _col, prev);

      case 123:
        // {
        return new Token(TokenKind.BRACE_L, pos, pos + 1, _line, _col, prev);

      case 124:
        // |
        return new Token(TokenKind.PIPE, pos, pos + 1, _line, _col, prev);

      case 125:
        // }
        return new Token(TokenKind.BRACE_R, pos, pos + 1, _line, _col, prev);

      case 34:
        //  "
        if (body.charCodeAt(pos + 1) === 34 && body.charCodeAt(pos + 2) === 34) {
          return readBlockString(source, pos, _line, _col, prev, lexer);
        }

        return readString(source, pos, _line, _col, prev);

      case 45: //  -

      case 48: //  0

      case 49: //  1

      case 50: //  2

      case 51: //  3

      case 52: //  4

      case 53: //  5

      case 54: //  6

      case 55: //  7

      case 56: //  8

      case 57:
        //  9
        return readNumber(source, pos, code, _line, _col, prev);

      case 65: //  A

      case 66: //  B

      case 67: //  C

      case 68: //  D

      case 69: //  E

      case 70: //  F

      case 71: //  G

      case 72: //  H

      case 73: //  I

      case 74: //  J

      case 75: //  K

      case 76: //  L

      case 77: //  M

      case 78: //  N

      case 79: //  O

      case 80: //  P

      case 81: //  Q

      case 82: //  R

      case 83: //  S

      case 84: //  T

      case 85: //  U

      case 86: //  V

      case 87: //  W

      case 88: //  X

      case 89: //  Y

      case 90: //  Z

      case 95: //  _

      case 97: //  a

      case 98: //  b

      case 99: //  c

      case 100: // d

      case 101: // e

      case 102: // f

      case 103: // g

      case 104: // h

      case 105: // i

      case 106: // j

      case 107: // k

      case 108: // l

      case 109: // m

      case 110: // n

      case 111: // o

      case 112: // p

      case 113: // q

      case 114: // r

      case 115: // s

      case 116: // t

      case 117: // u

      case 118: // v

      case 119: // w

      case 120: // x

      case 121: // y

      case 122:
        // z
        return readName(source, pos, _line, _col, prev);
    }

    throw syntaxError(source, pos, unexpectedCharacterMessage(code));
  }

  var line = lexer.line;
  var col = 1 + pos - lexer.lineStart;
  return new Token(TokenKind.EOF, bodyLength, bodyLength, line, col, prev);
}
/**
 * Report a message that an unexpected character was encountered.
 */


function unexpectedCharacterMessage(code) {
  if (code < 0x0020 && code !== 0x0009 && code !== 0x000a && code !== 0x000d) {
    return "Cannot contain the invalid character ".concat(printCharCode(code), ".");
  }

  if (code === 39) {
    // '
    return 'Unexpected single quote character (\'), did you mean to use a double quote (")?';
  }

  return "Cannot parse the unexpected character ".concat(printCharCode(code), ".");
}
/**
 * Reads a comment token from the source file.
 *
 * #[\u0009\u0020-\uFFFF]*
 */


function readComment(source, start, line, col, prev) {
  var body = source.body;
  var code;
  var position = start;

  do {
    code = body.charCodeAt(++position);
  } while (!isNaN(code) && ( // SourceCharacter but not LineTerminator
  code > 0x001f || code === 0x0009));

  return new Token(TokenKind.COMMENT, start, position, line, col, prev, body.slice(start + 1, position));
}
/**
 * Reads a number token from the source file, either a float
 * or an int depending on whether a decimal point appears.
 *
 * Int:   -?(0|[1-9][0-9]*)
 * Float: -?(0|[1-9][0-9]*)(\.[0-9]+)?((E|e)(+|-)?[0-9]+)?
 */


function readNumber(source, start, firstCode, line, col, prev) {
  var body = source.body;
  var code = firstCode;
  var position = start;
  var isFloat = false;

  if (code === 45) {
    // -
    code = body.charCodeAt(++position);
  }

  if (code === 48) {
    // 0
    code = body.charCodeAt(++position);

    if (code >= 48 && code <= 57) {
      throw syntaxError(source, position, "Invalid number, unexpected digit after 0: ".concat(printCharCode(code), "."));
    }
  } else {
    position = readDigits(source, position, code);
    code = body.charCodeAt(position);
  }

  if (code === 46) {
    // .
    isFloat = true;
    code = body.charCodeAt(++position);
    position = readDigits(source, position, code);
    code = body.charCodeAt(position);
  }

  if (code === 69 || code === 101) {
    // E e
    isFloat = true;
    code = body.charCodeAt(++position);

    if (code === 43 || code === 45) {
      // + -
      code = body.charCodeAt(++position);
    }

    position = readDigits(source, position, code);
    code = body.charCodeAt(position);
  } // Numbers cannot be followed by . or NameStart


  if (code === 46 || isNameStart(code)) {
    throw syntaxError(source, position, "Invalid number, expected digit but got: ".concat(printCharCode(code), "."));
  }

  return new Token(isFloat ? TokenKind.FLOAT : TokenKind.INT, start, position, line, col, prev, body.slice(start, position));
}
/**
 * Returns the new position in the source after reading digits.
 */


function readDigits(source, start, firstCode) {
  var body = source.body;
  var position = start;
  var code = firstCode;

  if (code >= 48 && code <= 57) {
    // 0 - 9
    do {
      code = body.charCodeAt(++position);
    } while (code >= 48 && code <= 57); // 0 - 9


    return position;
  }

  throw syntaxError(source, position, "Invalid number, expected digit but got: ".concat(printCharCode(code), "."));
}
/**
 * Reads a string token from the source file.
 *
 * "([^"\\\u000A\u000D]|(\\(u[0-9a-fA-F]{4}|["\\/bfnrt])))*"
 */


function readString(source, start, line, col, prev) {
  var body = source.body;
  var position = start + 1;
  var chunkStart = position;
  var code = 0;
  var value = '';

  while (position < body.length && !isNaN(code = body.charCodeAt(position)) && // not LineTerminator
  code !== 0x000a && code !== 0x000d) {
    // Closing Quote (")
    if (code === 34) {
      value += body.slice(chunkStart, position);
      return new Token(TokenKind.STRING, start, position + 1, line, col, prev, value);
    } // SourceCharacter


    if (code < 0x0020 && code !== 0x0009) {
      throw syntaxError(source, position, "Invalid character within String: ".concat(printCharCode(code), "."));
    }

    ++position;

    if (code === 92) {
      // \
      value += body.slice(chunkStart, position - 1);
      code = body.charCodeAt(position);

      switch (code) {
        case 34:
          value += '"';
          break;

        case 47:
          value += '/';
          break;

        case 92:
          value += '\\';
          break;

        case 98:
          value += '\b';
          break;

        case 102:
          value += '\f';
          break;

        case 110:
          value += '\n';
          break;

        case 114:
          value += '\r';
          break;

        case 116:
          value += '\t';
          break;

        case 117:
          {
            // uXXXX
            var charCode = uniCharCode(body.charCodeAt(position + 1), body.charCodeAt(position + 2), body.charCodeAt(position + 3), body.charCodeAt(position + 4));

            if (charCode < 0) {
              var invalidSequence = body.slice(position + 1, position + 5);
              throw syntaxError(source, position, "Invalid character escape sequence: \\u".concat(invalidSequence, "."));
            }

            value += String.fromCharCode(charCode);
            position += 4;
            break;
          }

        default:
          throw syntaxError(source, position, "Invalid character escape sequence: \\".concat(String.fromCharCode(code), "."));
      }

      ++position;
      chunkStart = position;
    }
  }

  throw syntaxError(source, position, 'Unterminated string.');
}
/**
 * Reads a block string token from the source file.
 *
 * """("?"?(\\"""|\\(?!=""")|[^"\\]))*"""
 */


function readBlockString(source, start, line, col, prev, lexer) {
  var body = source.body;
  var position = start + 3;
  var chunkStart = position;
  var code = 0;
  var rawValue = '';

  while (position < body.length && !isNaN(code = body.charCodeAt(position))) {
    // Closing Triple-Quote (""")
    if (code === 34 && body.charCodeAt(position + 1) === 34 && body.charCodeAt(position + 2) === 34) {
      rawValue += body.slice(chunkStart, position);
      return new Token(TokenKind.BLOCK_STRING, start, position + 3, line, col, prev, dedentBlockStringValue(rawValue));
    } // SourceCharacter


    if (code < 0x0020 && code !== 0x0009 && code !== 0x000a && code !== 0x000d) {
      throw syntaxError(source, position, "Invalid character within String: ".concat(printCharCode(code), "."));
    }

    if (code === 10) {
      // new line
      ++position;
      ++lexer.line;
      lexer.lineStart = position;
    } else if (code === 13) {
      // carriage return
      if (body.charCodeAt(position + 1) === 10) {
        position += 2;
      } else {
        ++position;
      }

      ++lexer.line;
      lexer.lineStart = position;
    } else if ( // Escape Triple-Quote (\""")
    code === 92 && body.charCodeAt(position + 1) === 34 && body.charCodeAt(position + 2) === 34 && body.charCodeAt(position + 3) === 34) {
      rawValue += body.slice(chunkStart, position) + '"""';
      position += 4;
      chunkStart = position;
    } else {
      ++position;
    }
  }

  throw syntaxError(source, position, 'Unterminated string.');
}
/**
 * Converts four hexadecimal chars to the integer that the
 * string represents. For example, uniCharCode('0','0','0','f')
 * will return 15, and uniCharCode('0','0','f','f') returns 255.
 *
 * Returns a negative number on error, if a char was invalid.
 *
 * This is implemented by noting that char2hex() returns -1 on error,
 * which means the result of ORing the char2hex() will also be negative.
 */


function uniCharCode(a, b, c, d) {
  return char2hex(a) << 12 | char2hex(b) << 8 | char2hex(c) << 4 | char2hex(d);
}
/**
 * Converts a hex character to its integer value.
 * '0' becomes 0, '9' becomes 9
 * 'A' becomes 10, 'F' becomes 15
 * 'a' becomes 10, 'f' becomes 15
 *
 * Returns -1 on error.
 */


function char2hex(a) {
  return a >= 48 && a <= 57 ? a - 48 // 0-9
  : a >= 65 && a <= 70 ? a - 55 // A-F
  : a >= 97 && a <= 102 ? a - 87 // a-f
  : -1;
}
/**
 * Reads an alphanumeric + underscore name from the source.
 *
 * [_A-Za-z][_0-9A-Za-z]*
 */


function readName(source, start, line, col, prev) {
  var body = source.body;
  var bodyLength = body.length;
  var position = start + 1;
  var code = 0;

  while (position !== bodyLength && !isNaN(code = body.charCodeAt(position)) && (code === 95 || // _
  code >= 48 && code <= 57 || // 0-9
  code >= 65 && code <= 90 || // A-Z
  code >= 97 && code <= 122) // a-z
  ) {
    ++position;
  }

  return new Token(TokenKind.NAME, start, position, line, col, prev, body.slice(start, position));
} // _ A-Z a-z


function isNameStart(code) {
  return code === 95 || code >= 65 && code <= 90 || code >= 97 && code <= 122;
}
/**
 * Configuration options to control parser behavior
 */

/**
 * Given a GraphQL source, parses it into a Document.
 * Throws GraphQLError if a syntax error is encountered.
 */


function parse(source, options) {
  var parser = new Parser(source, options);
  return parser.parseDocument();
}
/**
 * This class is exported only to assist people in implementing their own parsers
 * without duplicating too much code and should be used only as last resort for cases
 * such as experimental syntax or if certain features could not be contributed upstream.
 *
 * It is still part of the internal API and is versioned, so any changes to it are never
 * considered breaking changes. If you still need to support multiple versions of the
 * library, please use the `versionInfo` variable for version detection.
 *
 * @internal
 */


var Parser = /*#__PURE__*/function () {
  function Parser(source, options) {
    var sourceObj = isSource(source) ? source : new Source(source);
    this._lexer = new Lexer(sourceObj);
    this._options = options;
  }
  /**
   * Converts a name lex token into a name parse node.
   */


  var _proto = Parser.prototype;

  _proto.parseName = function parseName() {
    var token = this.expectToken(TokenKind.NAME);
    return {
      kind: Kind.NAME,
      value: token.value,
      loc: this.loc(token)
    };
  } // Implements the parsing rules in the Document section.

  /**
   * Document : Definition+
   */
  ;

  _proto.parseDocument = function parseDocument() {
    var start = this._lexer.token;
    return {
      kind: Kind.DOCUMENT,
      definitions: this.many(TokenKind.SOF, this.parseDefinition, TokenKind.EOF),
      loc: this.loc(start)
    };
  }
  /**
   * Definition :
   *   - ExecutableDefinition
   *   - TypeSystemDefinition
   *   - TypeSystemExtension
   *
   * ExecutableDefinition :
   *   - OperationDefinition
   *   - FragmentDefinition
   */
  ;

  _proto.parseDefinition = function parseDefinition() {
    if (this.peek(TokenKind.NAME)) {
      switch (this._lexer.token.value) {
        case 'query':
        case 'mutation':
        case 'subscription':
          return this.parseOperationDefinition();

        case 'fragment':
          return this.parseFragmentDefinition();

        case 'schema':
        case 'scalar':
        case 'type':
        case 'interface':
        case 'union':
        case 'enum':
        case 'input':
        case 'directive':
          return this.parseTypeSystemDefinition();

        case 'extend':
          return this.parseTypeSystemExtension();
      }
    } else if (this.peek(TokenKind.BRACE_L)) {
      return this.parseOperationDefinition();
    } else if (this.peekDescription()) {
      return this.parseTypeSystemDefinition();
    }

    throw this.unexpected();
  } // Implements the parsing rules in the Operations section.

  /**
   * OperationDefinition :
   *  - SelectionSet
   *  - OperationType Name? VariableDefinitions? Directives? SelectionSet
   */
  ;

  _proto.parseOperationDefinition = function parseOperationDefinition() {
    var start = this._lexer.token;

    if (this.peek(TokenKind.BRACE_L)) {
      return {
        kind: Kind.OPERATION_DEFINITION,
        operation: 'query',
        name: undefined,
        variableDefinitions: [],
        directives: [],
        selectionSet: this.parseSelectionSet(),
        loc: this.loc(start)
      };
    }

    var operation = this.parseOperationType();
    var name;

    if (this.peek(TokenKind.NAME)) {
      name = this.parseName();
    }

    return {
      kind: Kind.OPERATION_DEFINITION,
      operation: operation,
      name: name,
      variableDefinitions: this.parseVariableDefinitions(),
      directives: this.parseDirectives(false),
      selectionSet: this.parseSelectionSet(),
      loc: this.loc(start)
    };
  }
  /**
   * OperationType : one of query mutation subscription
   */
  ;

  _proto.parseOperationType = function parseOperationType() {
    var operationToken = this.expectToken(TokenKind.NAME);

    switch (operationToken.value) {
      case 'query':
        return 'query';

      case 'mutation':
        return 'mutation';

      case 'subscription':
        return 'subscription';
    }

    throw this.unexpected(operationToken);
  }
  /**
   * VariableDefinitions : ( VariableDefinition+ )
   */
  ;

  _proto.parseVariableDefinitions = function parseVariableDefinitions() {
    return this.optionalMany(TokenKind.PAREN_L, this.parseVariableDefinition, TokenKind.PAREN_R);
  }
  /**
   * VariableDefinition : Variable : Type DefaultValue? Directives[Const]?
   */
  ;

  _proto.parseVariableDefinition = function parseVariableDefinition() {
    var start = this._lexer.token;
    return {
      kind: Kind.VARIABLE_DEFINITION,
      variable: this.parseVariable(),
      type: (this.expectToken(TokenKind.COLON), this.parseTypeReference()),
      defaultValue: this.expectOptionalToken(TokenKind.EQUALS) ? this.parseValueLiteral(true) : undefined,
      directives: this.parseDirectives(true),
      loc: this.loc(start)
    };
  }
  /**
   * Variable : $ Name
   */
  ;

  _proto.parseVariable = function parseVariable() {
    var start = this._lexer.token;
    this.expectToken(TokenKind.DOLLAR);
    return {
      kind: Kind.VARIABLE,
      name: this.parseName(),
      loc: this.loc(start)
    };
  }
  /**
   * SelectionSet : { Selection+ }
   */
  ;

  _proto.parseSelectionSet = function parseSelectionSet() {
    var start = this._lexer.token;
    return {
      kind: Kind.SELECTION_SET,
      selections: this.many(TokenKind.BRACE_L, this.parseSelection, TokenKind.BRACE_R),
      loc: this.loc(start)
    };
  }
  /**
   * Selection :
   *   - Field
   *   - FragmentSpread
   *   - InlineFragment
   */
  ;

  _proto.parseSelection = function parseSelection() {
    return this.peek(TokenKind.SPREAD) ? this.parseFragment() : this.parseField();
  }
  /**
   * Field : Alias? Name Arguments? Directives? SelectionSet?
   *
   * Alias : Name :
   */
  ;

  _proto.parseField = function parseField() {
    var start = this._lexer.token;
    var nameOrAlias = this.parseName();
    var alias;
    var name;

    if (this.expectOptionalToken(TokenKind.COLON)) {
      alias = nameOrAlias;
      name = this.parseName();
    } else {
      name = nameOrAlias;
    }

    return {
      kind: Kind.FIELD,
      alias: alias,
      name: name,
      arguments: this.parseArguments(false),
      directives: this.parseDirectives(false),
      selectionSet: this.peek(TokenKind.BRACE_L) ? this.parseSelectionSet() : undefined,
      loc: this.loc(start)
    };
  }
  /**
   * Arguments[Const] : ( Argument[?Const]+ )
   */
  ;

  _proto.parseArguments = function parseArguments(isConst) {
    var item = isConst ? this.parseConstArgument : this.parseArgument;
    return this.optionalMany(TokenKind.PAREN_L, item, TokenKind.PAREN_R);
  }
  /**
   * Argument[Const] : Name : Value[?Const]
   */
  ;

  _proto.parseArgument = function parseArgument() {
    var start = this._lexer.token;
    var name = this.parseName();
    this.expectToken(TokenKind.COLON);
    return {
      kind: Kind.ARGUMENT,
      name: name,
      value: this.parseValueLiteral(false),
      loc: this.loc(start)
    };
  };

  _proto.parseConstArgument = function parseConstArgument() {
    var start = this._lexer.token;
    return {
      kind: Kind.ARGUMENT,
      name: this.parseName(),
      value: (this.expectToken(TokenKind.COLON), this.parseValueLiteral(true)),
      loc: this.loc(start)
    };
  } // Implements the parsing rules in the Fragments section.

  /**
   * Corresponds to both FragmentSpread and InlineFragment in the spec.
   *
   * FragmentSpread : ... FragmentName Directives?
   *
   * InlineFragment : ... TypeCondition? Directives? SelectionSet
   */
  ;

  _proto.parseFragment = function parseFragment() {
    var start = this._lexer.token;
    this.expectToken(TokenKind.SPREAD);
    var hasTypeCondition = this.expectOptionalKeyword('on');

    if (!hasTypeCondition && this.peek(TokenKind.NAME)) {
      return {
        kind: Kind.FRAGMENT_SPREAD,
        name: this.parseFragmentName(),
        directives: this.parseDirectives(false),
        loc: this.loc(start)
      };
    }

    return {
      kind: Kind.INLINE_FRAGMENT,
      typeCondition: hasTypeCondition ? this.parseNamedType() : undefined,
      directives: this.parseDirectives(false),
      selectionSet: this.parseSelectionSet(),
      loc: this.loc(start)
    };
  }
  /**
   * FragmentDefinition :
   *   - fragment FragmentName on TypeCondition Directives? SelectionSet
   *
   * TypeCondition : NamedType
   */
  ;

  _proto.parseFragmentDefinition = function parseFragmentDefinition() {
    var _this$_options;

    var start = this._lexer.token;
    this.expectKeyword('fragment'); // Experimental support for defining variables within fragments changes
    // the grammar of FragmentDefinition:
    //   - fragment FragmentName VariableDefinitions? on TypeCondition Directives? SelectionSet

    if (((_this$_options = this._options) === null || _this$_options === void 0 ? void 0 : _this$_options.experimentalFragmentVariables) === true) {
      return {
        kind: Kind.FRAGMENT_DEFINITION,
        name: this.parseFragmentName(),
        variableDefinitions: this.parseVariableDefinitions(),
        typeCondition: (this.expectKeyword('on'), this.parseNamedType()),
        directives: this.parseDirectives(false),
        selectionSet: this.parseSelectionSet(),
        loc: this.loc(start)
      };
    }

    return {
      kind: Kind.FRAGMENT_DEFINITION,
      name: this.parseFragmentName(),
      typeCondition: (this.expectKeyword('on'), this.parseNamedType()),
      directives: this.parseDirectives(false),
      selectionSet: this.parseSelectionSet(),
      loc: this.loc(start)
    };
  }
  /**
   * FragmentName : Name but not `on`
   */
  ;

  _proto.parseFragmentName = function parseFragmentName() {
    if (this._lexer.token.value === 'on') {
      throw this.unexpected();
    }

    return this.parseName();
  } // Implements the parsing rules in the Values section.

  /**
   * Value[Const] :
   *   - [~Const] Variable
   *   - IntValue
   *   - FloatValue
   *   - StringValue
   *   - BooleanValue
   *   - NullValue
   *   - EnumValue
   *   - ListValue[?Const]
   *   - ObjectValue[?Const]
   *
   * BooleanValue : one of `true` `false`
   *
   * NullValue : `null`
   *
   * EnumValue : Name but not `true`, `false` or `null`
   */
  ;

  _proto.parseValueLiteral = function parseValueLiteral(isConst) {
    var token = this._lexer.token;

    switch (token.kind) {
      case TokenKind.BRACKET_L:
        return this.parseList(isConst);

      case TokenKind.BRACE_L:
        return this.parseObject(isConst);

      case TokenKind.INT:
        this._lexer.advance();

        return {
          kind: Kind.INT,
          value: token.value,
          loc: this.loc(token)
        };

      case TokenKind.FLOAT:
        this._lexer.advance();

        return {
          kind: Kind.FLOAT,
          value: token.value,
          loc: this.loc(token)
        };

      case TokenKind.STRING:
      case TokenKind.BLOCK_STRING:
        return this.parseStringLiteral();

      case TokenKind.NAME:
        this._lexer.advance();

        switch (token.value) {
          case 'true':
            return {
              kind: Kind.BOOLEAN,
              value: true,
              loc: this.loc(token)
            };

          case 'false':
            return {
              kind: Kind.BOOLEAN,
              value: false,
              loc: this.loc(token)
            };

          case 'null':
            return {
              kind: Kind.NULL,
              loc: this.loc(token)
            };

          default:
            return {
              kind: Kind.ENUM,
              value: token.value,
              loc: this.loc(token)
            };
        }

      case TokenKind.DOLLAR:
        if (!isConst) {
          return this.parseVariable();
        }

        break;
    }

    throw this.unexpected();
  };

  _proto.parseStringLiteral = function parseStringLiteral() {
    var token = this._lexer.token;

    this._lexer.advance();

    return {
      kind: Kind.STRING,
      value: token.value,
      block: token.kind === TokenKind.BLOCK_STRING,
      loc: this.loc(token)
    };
  }
  /**
   * ListValue[Const] :
   *   - [ ]
   *   - [ Value[?Const]+ ]
   */
  ;

  _proto.parseList = function parseList(isConst) {
    var _this = this;

    var start = this._lexer.token;

    var item = function item() {
      return _this.parseValueLiteral(isConst);
    };

    return {
      kind: Kind.LIST,
      values: this.any(TokenKind.BRACKET_L, item, TokenKind.BRACKET_R),
      loc: this.loc(start)
    };
  }
  /**
   * ObjectValue[Const] :
   *   - { }
   *   - { ObjectField[?Const]+ }
   */
  ;

  _proto.parseObject = function parseObject(isConst) {
    var _this2 = this;

    var start = this._lexer.token;

    var item = function item() {
      return _this2.parseObjectField(isConst);
    };

    return {
      kind: Kind.OBJECT,
      fields: this.any(TokenKind.BRACE_L, item, TokenKind.BRACE_R),
      loc: this.loc(start)
    };
  }
  /**
   * ObjectField[Const] : Name : Value[?Const]
   */
  ;

  _proto.parseObjectField = function parseObjectField(isConst) {
    var start = this._lexer.token;
    var name = this.parseName();
    this.expectToken(TokenKind.COLON);
    return {
      kind: Kind.OBJECT_FIELD,
      name: name,
      value: this.parseValueLiteral(isConst),
      loc: this.loc(start)
    };
  } // Implements the parsing rules in the Directives section.

  /**
   * Directives[Const] : Directive[?Const]+
   */
  ;

  _proto.parseDirectives = function parseDirectives(isConst) {
    var directives = [];

    while (this.peek(TokenKind.AT)) {
      directives.push(this.parseDirective(isConst));
    }

    return directives;
  }
  /**
   * Directive[Const] : @ Name Arguments[?Const]?
   */
  ;

  _proto.parseDirective = function parseDirective(isConst) {
    var start = this._lexer.token;
    this.expectToken(TokenKind.AT);
    return {
      kind: Kind.DIRECTIVE,
      name: this.parseName(),
      arguments: this.parseArguments(isConst),
      loc: this.loc(start)
    };
  } // Implements the parsing rules in the Types section.

  /**
   * Type :
   *   - NamedType
   *   - ListType
   *   - NonNullType
   */
  ;

  _proto.parseTypeReference = function parseTypeReference() {
    var start = this._lexer.token;
    var type;

    if (this.expectOptionalToken(TokenKind.BRACKET_L)) {
      type = this.parseTypeReference();
      this.expectToken(TokenKind.BRACKET_R);
      type = {
        kind: Kind.LIST_TYPE,
        type: type,
        loc: this.loc(start)
      };
    } else {
      type = this.parseNamedType();
    }

    if (this.expectOptionalToken(TokenKind.BANG)) {
      return {
        kind: Kind.NON_NULL_TYPE,
        type: type,
        loc: this.loc(start)
      };
    }

    return type;
  }
  /**
   * NamedType : Name
   */
  ;

  _proto.parseNamedType = function parseNamedType() {
    var start = this._lexer.token;
    return {
      kind: Kind.NAMED_TYPE,
      name: this.parseName(),
      loc: this.loc(start)
    };
  } // Implements the parsing rules in the Type Definition section.

  /**
   * TypeSystemDefinition :
   *   - SchemaDefinition
   *   - TypeDefinition
   *   - DirectiveDefinition
   *
   * TypeDefinition :
   *   - ScalarTypeDefinition
   *   - ObjectTypeDefinition
   *   - InterfaceTypeDefinition
   *   - UnionTypeDefinition
   *   - EnumTypeDefinition
   *   - InputObjectTypeDefinition
   */
  ;

  _proto.parseTypeSystemDefinition = function parseTypeSystemDefinition() {
    // Many definitions begin with a description and require a lookahead.
    var keywordToken = this.peekDescription() ? this._lexer.lookahead() : this._lexer.token;

    if (keywordToken.kind === TokenKind.NAME) {
      switch (keywordToken.value) {
        case 'schema':
          return this.parseSchemaDefinition();

        case 'scalar':
          return this.parseScalarTypeDefinition();

        case 'type':
          return this.parseObjectTypeDefinition();

        case 'interface':
          return this.parseInterfaceTypeDefinition();

        case 'union':
          return this.parseUnionTypeDefinition();

        case 'enum':
          return this.parseEnumTypeDefinition();

        case 'input':
          return this.parseInputObjectTypeDefinition();

        case 'directive':
          return this.parseDirectiveDefinition();
      }
    }

    throw this.unexpected(keywordToken);
  };

  _proto.peekDescription = function peekDescription() {
    return this.peek(TokenKind.STRING) || this.peek(TokenKind.BLOCK_STRING);
  }
  /**
   * Description : StringValue
   */
  ;

  _proto.parseDescription = function parseDescription() {
    if (this.peekDescription()) {
      return this.parseStringLiteral();
    }
  }
  /**
   * SchemaDefinition : Description? schema Directives[Const]? { OperationTypeDefinition+ }
   */
  ;

  _proto.parseSchemaDefinition = function parseSchemaDefinition() {
    var start = this._lexer.token;
    var description = this.parseDescription();
    this.expectKeyword('schema');
    var directives = this.parseDirectives(true);
    var operationTypes = this.many(TokenKind.BRACE_L, this.parseOperationTypeDefinition, TokenKind.BRACE_R);
    return {
      kind: Kind.SCHEMA_DEFINITION,
      description: description,
      directives: directives,
      operationTypes: operationTypes,
      loc: this.loc(start)
    };
  }
  /**
   * OperationTypeDefinition : OperationType : NamedType
   */
  ;

  _proto.parseOperationTypeDefinition = function parseOperationTypeDefinition() {
    var start = this._lexer.token;
    var operation = this.parseOperationType();
    this.expectToken(TokenKind.COLON);
    var type = this.parseNamedType();
    return {
      kind: Kind.OPERATION_TYPE_DEFINITION,
      operation: operation,
      type: type,
      loc: this.loc(start)
    };
  }
  /**
   * ScalarTypeDefinition : Description? scalar Name Directives[Const]?
   */
  ;

  _proto.parseScalarTypeDefinition = function parseScalarTypeDefinition() {
    var start = this._lexer.token;
    var description = this.parseDescription();
    this.expectKeyword('scalar');
    var name = this.parseName();
    var directives = this.parseDirectives(true);
    return {
      kind: Kind.SCALAR_TYPE_DEFINITION,
      description: description,
      name: name,
      directives: directives,
      loc: this.loc(start)
    };
  }
  /**
   * ObjectTypeDefinition :
   *   Description?
   *   type Name ImplementsInterfaces? Directives[Const]? FieldsDefinition?
   */
  ;

  _proto.parseObjectTypeDefinition = function parseObjectTypeDefinition() {
    var start = this._lexer.token;
    var description = this.parseDescription();
    this.expectKeyword('type');
    var name = this.parseName();
    var interfaces = this.parseImplementsInterfaces();
    var directives = this.parseDirectives(true);
    var fields = this.parseFieldsDefinition();
    return {
      kind: Kind.OBJECT_TYPE_DEFINITION,
      description: description,
      name: name,
      interfaces: interfaces,
      directives: directives,
      fields: fields,
      loc: this.loc(start)
    };
  }
  /**
   * ImplementsInterfaces :
   *   - implements `&`? NamedType
   *   - ImplementsInterfaces & NamedType
   */
  ;

  _proto.parseImplementsInterfaces = function parseImplementsInterfaces() {
    var _this$_options2;

    if (!this.expectOptionalKeyword('implements')) {
      return [];
    }

    if (((_this$_options2 = this._options) === null || _this$_options2 === void 0 ? void 0 : _this$_options2.allowLegacySDLImplementsInterfaces) === true) {
      var types = []; // Optional leading ampersand

      this.expectOptionalToken(TokenKind.AMP);

      do {
        types.push(this.parseNamedType());
      } while (this.expectOptionalToken(TokenKind.AMP) || this.peek(TokenKind.NAME));

      return types;
    }

    return this.delimitedMany(TokenKind.AMP, this.parseNamedType);
  }
  /**
   * FieldsDefinition : { FieldDefinition+ }
   */
  ;

  _proto.parseFieldsDefinition = function parseFieldsDefinition() {
    var _this$_options3; // Legacy support for the SDL?


    if (((_this$_options3 = this._options) === null || _this$_options3 === void 0 ? void 0 : _this$_options3.allowLegacySDLEmptyFields) === true && this.peek(TokenKind.BRACE_L) && this._lexer.lookahead().kind === TokenKind.BRACE_R) {
      this._lexer.advance();

      this._lexer.advance();

      return [];
    }

    return this.optionalMany(TokenKind.BRACE_L, this.parseFieldDefinition, TokenKind.BRACE_R);
  }
  /**
   * FieldDefinition :
   *   - Description? Name ArgumentsDefinition? : Type Directives[Const]?
   */
  ;

  _proto.parseFieldDefinition = function parseFieldDefinition() {
    var start = this._lexer.token;
    var description = this.parseDescription();
    var name = this.parseName();
    var args = this.parseArgumentDefs();
    this.expectToken(TokenKind.COLON);
    var type = this.parseTypeReference();
    var directives = this.parseDirectives(true);
    return {
      kind: Kind.FIELD_DEFINITION,
      description: description,
      name: name,
      arguments: args,
      type: type,
      directives: directives,
      loc: this.loc(start)
    };
  }
  /**
   * ArgumentsDefinition : ( InputValueDefinition+ )
   */
  ;

  _proto.parseArgumentDefs = function parseArgumentDefs() {
    return this.optionalMany(TokenKind.PAREN_L, this.parseInputValueDef, TokenKind.PAREN_R);
  }
  /**
   * InputValueDefinition :
   *   - Description? Name : Type DefaultValue? Directives[Const]?
   */
  ;

  _proto.parseInputValueDef = function parseInputValueDef() {
    var start = this._lexer.token;
    var description = this.parseDescription();
    var name = this.parseName();
    this.expectToken(TokenKind.COLON);
    var type = this.parseTypeReference();
    var defaultValue;

    if (this.expectOptionalToken(TokenKind.EQUALS)) {
      defaultValue = this.parseValueLiteral(true);
    }

    var directives = this.parseDirectives(true);
    return {
      kind: Kind.INPUT_VALUE_DEFINITION,
      description: description,
      name: name,
      type: type,
      defaultValue: defaultValue,
      directives: directives,
      loc: this.loc(start)
    };
  }
  /**
   * InterfaceTypeDefinition :
   *   - Description? interface Name Directives[Const]? FieldsDefinition?
   */
  ;

  _proto.parseInterfaceTypeDefinition = function parseInterfaceTypeDefinition() {
    var start = this._lexer.token;
    var description = this.parseDescription();
    this.expectKeyword('interface');
    var name = this.parseName();
    var interfaces = this.parseImplementsInterfaces();
    var directives = this.parseDirectives(true);
    var fields = this.parseFieldsDefinition();
    return {
      kind: Kind.INTERFACE_TYPE_DEFINITION,
      description: description,
      name: name,
      interfaces: interfaces,
      directives: directives,
      fields: fields,
      loc: this.loc(start)
    };
  }
  /**
   * UnionTypeDefinition :
   *   - Description? union Name Directives[Const]? UnionMemberTypes?
   */
  ;

  _proto.parseUnionTypeDefinition = function parseUnionTypeDefinition() {
    var start = this._lexer.token;
    var description = this.parseDescription();
    this.expectKeyword('union');
    var name = this.parseName();
    var directives = this.parseDirectives(true);
    var types = this.parseUnionMemberTypes();
    return {
      kind: Kind.UNION_TYPE_DEFINITION,
      description: description,
      name: name,
      directives: directives,
      types: types,
      loc: this.loc(start)
    };
  }
  /**
   * UnionMemberTypes :
   *   - = `|`? NamedType
   *   - UnionMemberTypes | NamedType
   */
  ;

  _proto.parseUnionMemberTypes = function parseUnionMemberTypes() {
    return this.expectOptionalToken(TokenKind.EQUALS) ? this.delimitedMany(TokenKind.PIPE, this.parseNamedType) : [];
  }
  /**
   * EnumTypeDefinition :
   *   - Description? enum Name Directives[Const]? EnumValuesDefinition?
   */
  ;

  _proto.parseEnumTypeDefinition = function parseEnumTypeDefinition() {
    var start = this._lexer.token;
    var description = this.parseDescription();
    this.expectKeyword('enum');
    var name = this.parseName();
    var directives = this.parseDirectives(true);
    var values = this.parseEnumValuesDefinition();
    return {
      kind: Kind.ENUM_TYPE_DEFINITION,
      description: description,
      name: name,
      directives: directives,
      values: values,
      loc: this.loc(start)
    };
  }
  /**
   * EnumValuesDefinition : { EnumValueDefinition+ }
   */
  ;

  _proto.parseEnumValuesDefinition = function parseEnumValuesDefinition() {
    return this.optionalMany(TokenKind.BRACE_L, this.parseEnumValueDefinition, TokenKind.BRACE_R);
  }
  /**
   * EnumValueDefinition : Description? EnumValue Directives[Const]?
   *
   * EnumValue : Name
   */
  ;

  _proto.parseEnumValueDefinition = function parseEnumValueDefinition() {
    var start = this._lexer.token;
    var description = this.parseDescription();
    var name = this.parseName();
    var directives = this.parseDirectives(true);
    return {
      kind: Kind.ENUM_VALUE_DEFINITION,
      description: description,
      name: name,
      directives: directives,
      loc: this.loc(start)
    };
  }
  /**
   * InputObjectTypeDefinition :
   *   - Description? input Name Directives[Const]? InputFieldsDefinition?
   */
  ;

  _proto.parseInputObjectTypeDefinition = function parseInputObjectTypeDefinition() {
    var start = this._lexer.token;
    var description = this.parseDescription();
    this.expectKeyword('input');
    var name = this.parseName();
    var directives = this.parseDirectives(true);
    var fields = this.parseInputFieldsDefinition();
    return {
      kind: Kind.INPUT_OBJECT_TYPE_DEFINITION,
      description: description,
      name: name,
      directives: directives,
      fields: fields,
      loc: this.loc(start)
    };
  }
  /**
   * InputFieldsDefinition : { InputValueDefinition+ }
   */
  ;

  _proto.parseInputFieldsDefinition = function parseInputFieldsDefinition() {
    return this.optionalMany(TokenKind.BRACE_L, this.parseInputValueDef, TokenKind.BRACE_R);
  }
  /**
   * TypeSystemExtension :
   *   - SchemaExtension
   *   - TypeExtension
   *
   * TypeExtension :
   *   - ScalarTypeExtension
   *   - ObjectTypeExtension
   *   - InterfaceTypeExtension
   *   - UnionTypeExtension
   *   - EnumTypeExtension
   *   - InputObjectTypeDefinition
   */
  ;

  _proto.parseTypeSystemExtension = function parseTypeSystemExtension() {
    var keywordToken = this._lexer.lookahead();

    if (keywordToken.kind === TokenKind.NAME) {
      switch (keywordToken.value) {
        case 'schema':
          return this.parseSchemaExtension();

        case 'scalar':
          return this.parseScalarTypeExtension();

        case 'type':
          return this.parseObjectTypeExtension();

        case 'interface':
          return this.parseInterfaceTypeExtension();

        case 'union':
          return this.parseUnionTypeExtension();

        case 'enum':
          return this.parseEnumTypeExtension();

        case 'input':
          return this.parseInputObjectTypeExtension();
      }
    }

    throw this.unexpected(keywordToken);
  }
  /**
   * SchemaExtension :
   *  - extend schema Directives[Const]? { OperationTypeDefinition+ }
   *  - extend schema Directives[Const]
   */
  ;

  _proto.parseSchemaExtension = function parseSchemaExtension() {
    var start = this._lexer.token;
    this.expectKeyword('extend');
    this.expectKeyword('schema');
    var directives = this.parseDirectives(true);
    var operationTypes = this.optionalMany(TokenKind.BRACE_L, this.parseOperationTypeDefinition, TokenKind.BRACE_R);

    if (directives.length === 0 && operationTypes.length === 0) {
      throw this.unexpected();
    }

    return {
      kind: Kind.SCHEMA_EXTENSION,
      directives: directives,
      operationTypes: operationTypes,
      loc: this.loc(start)
    };
  }
  /**
   * ScalarTypeExtension :
   *   - extend scalar Name Directives[Const]
   */
  ;

  _proto.parseScalarTypeExtension = function parseScalarTypeExtension() {
    var start = this._lexer.token;
    this.expectKeyword('extend');
    this.expectKeyword('scalar');
    var name = this.parseName();
    var directives = this.parseDirectives(true);

    if (directives.length === 0) {
      throw this.unexpected();
    }

    return {
      kind: Kind.SCALAR_TYPE_EXTENSION,
      name: name,
      directives: directives,
      loc: this.loc(start)
    };
  }
  /**
   * ObjectTypeExtension :
   *  - extend type Name ImplementsInterfaces? Directives[Const]? FieldsDefinition
   *  - extend type Name ImplementsInterfaces? Directives[Const]
   *  - extend type Name ImplementsInterfaces
   */
  ;

  _proto.parseObjectTypeExtension = function parseObjectTypeExtension() {
    var start = this._lexer.token;
    this.expectKeyword('extend');
    this.expectKeyword('type');
    var name = this.parseName();
    var interfaces = this.parseImplementsInterfaces();
    var directives = this.parseDirectives(true);
    var fields = this.parseFieldsDefinition();

    if (interfaces.length === 0 && directives.length === 0 && fields.length === 0) {
      throw this.unexpected();
    }

    return {
      kind: Kind.OBJECT_TYPE_EXTENSION,
      name: name,
      interfaces: interfaces,
      directives: directives,
      fields: fields,
      loc: this.loc(start)
    };
  }
  /**
   * InterfaceTypeExtension :
   *  - extend interface Name ImplementsInterfaces? Directives[Const]? FieldsDefinition
   *  - extend interface Name ImplementsInterfaces? Directives[Const]
   *  - extend interface Name ImplementsInterfaces
   */
  ;

  _proto.parseInterfaceTypeExtension = function parseInterfaceTypeExtension() {
    var start = this._lexer.token;
    this.expectKeyword('extend');
    this.expectKeyword('interface');
    var name = this.parseName();
    var interfaces = this.parseImplementsInterfaces();
    var directives = this.parseDirectives(true);
    var fields = this.parseFieldsDefinition();

    if (interfaces.length === 0 && directives.length === 0 && fields.length === 0) {
      throw this.unexpected();
    }

    return {
      kind: Kind.INTERFACE_TYPE_EXTENSION,
      name: name,
      interfaces: interfaces,
      directives: directives,
      fields: fields,
      loc: this.loc(start)
    };
  }
  /**
   * UnionTypeExtension :
   *   - extend union Name Directives[Const]? UnionMemberTypes
   *   - extend union Name Directives[Const]
   */
  ;

  _proto.parseUnionTypeExtension = function parseUnionTypeExtension() {
    var start = this._lexer.token;
    this.expectKeyword('extend');
    this.expectKeyword('union');
    var name = this.parseName();
    var directives = this.parseDirectives(true);
    var types = this.parseUnionMemberTypes();

    if (directives.length === 0 && types.length === 0) {
      throw this.unexpected();
    }

    return {
      kind: Kind.UNION_TYPE_EXTENSION,
      name: name,
      directives: directives,
      types: types,
      loc: this.loc(start)
    };
  }
  /**
   * EnumTypeExtension :
   *   - extend enum Name Directives[Const]? EnumValuesDefinition
   *   - extend enum Name Directives[Const]
   */
  ;

  _proto.parseEnumTypeExtension = function parseEnumTypeExtension() {
    var start = this._lexer.token;
    this.expectKeyword('extend');
    this.expectKeyword('enum');
    var name = this.parseName();
    var directives = this.parseDirectives(true);
    var values = this.parseEnumValuesDefinition();

    if (directives.length === 0 && values.length === 0) {
      throw this.unexpected();
    }

    return {
      kind: Kind.ENUM_TYPE_EXTENSION,
      name: name,
      directives: directives,
      values: values,
      loc: this.loc(start)
    };
  }
  /**
   * InputObjectTypeExtension :
   *   - extend input Name Directives[Const]? InputFieldsDefinition
   *   - extend input Name Directives[Const]
   */
  ;

  _proto.parseInputObjectTypeExtension = function parseInputObjectTypeExtension() {
    var start = this._lexer.token;
    this.expectKeyword('extend');
    this.expectKeyword('input');
    var name = this.parseName();
    var directives = this.parseDirectives(true);
    var fields = this.parseInputFieldsDefinition();

    if (directives.length === 0 && fields.length === 0) {
      throw this.unexpected();
    }

    return {
      kind: Kind.INPUT_OBJECT_TYPE_EXTENSION,
      name: name,
      directives: directives,
      fields: fields,
      loc: this.loc(start)
    };
  }
  /**
   * DirectiveDefinition :
   *   - Description? directive @ Name ArgumentsDefinition? `repeatable`? on DirectiveLocations
   */
  ;

  _proto.parseDirectiveDefinition = function parseDirectiveDefinition() {
    var start = this._lexer.token;
    var description = this.parseDescription();
    this.expectKeyword('directive');
    this.expectToken(TokenKind.AT);
    var name = this.parseName();
    var args = this.parseArgumentDefs();
    var repeatable = this.expectOptionalKeyword('repeatable');
    this.expectKeyword('on');
    var locations = this.parseDirectiveLocations();
    return {
      kind: Kind.DIRECTIVE_DEFINITION,
      description: description,
      name: name,
      arguments: args,
      repeatable: repeatable,
      locations: locations,
      loc: this.loc(start)
    };
  }
  /**
   * DirectiveLocations :
   *   - `|`? DirectiveLocation
   *   - DirectiveLocations | DirectiveLocation
   */
  ;

  _proto.parseDirectiveLocations = function parseDirectiveLocations() {
    return this.delimitedMany(TokenKind.PIPE, this.parseDirectiveLocation);
  }
  /*
   * DirectiveLocation :
   *   - ExecutableDirectiveLocation
   *   - TypeSystemDirectiveLocation
   *
   * ExecutableDirectiveLocation : one of
   *   `QUERY`
   *   `MUTATION`
   *   `SUBSCRIPTION`
   *   `FIELD`
   *   `FRAGMENT_DEFINITION`
   *   `FRAGMENT_SPREAD`
   *   `INLINE_FRAGMENT`
   *
   * TypeSystemDirectiveLocation : one of
   *   `SCHEMA`
   *   `SCALAR`
   *   `OBJECT`
   *   `FIELD_DEFINITION`
   *   `ARGUMENT_DEFINITION`
   *   `INTERFACE`
   *   `UNION`
   *   `ENUM`
   *   `ENUM_VALUE`
   *   `INPUT_OBJECT`
   *   `INPUT_FIELD_DEFINITION`
   */
  ;

  _proto.parseDirectiveLocation = function parseDirectiveLocation() {
    var start = this._lexer.token;
    var name = this.parseName();

    if (DirectiveLocation[name.value] !== undefined) {
      return name;
    }

    throw this.unexpected(start);
  } // Core parsing utility functions

  /**
   * Returns a location object, used to identify the place in the source that created a given parsed object.
   */
  ;

  _proto.loc = function loc(startToken) {
    var _this$_options4;

    if (((_this$_options4 = this._options) === null || _this$_options4 === void 0 ? void 0 : _this$_options4.noLocation) !== true) {
      return new Location(startToken, this._lexer.lastToken, this._lexer.source);
    }
  }
  /**
   * Determines if the next token is of a given kind
   */
  ;

  _proto.peek = function peek(kind) {
    return this._lexer.token.kind === kind;
  }
  /**
   * If the next token is of the given kind, return that token after advancing the lexer.
   * Otherwise, do not change the parser state and throw an error.
   */
  ;

  _proto.expectToken = function expectToken(kind) {
    var token = this._lexer.token;

    if (token.kind === kind) {
      this._lexer.advance();

      return token;
    }

    throw syntaxError(this._lexer.source, token.start, "Expected ".concat(getTokenKindDesc(kind), ", found ").concat(getTokenDesc(token), "."));
  }
  /**
   * If the next token is of the given kind, return that token after advancing the lexer.
   * Otherwise, do not change the parser state and return undefined.
   */
  ;

  _proto.expectOptionalToken = function expectOptionalToken(kind) {
    var token = this._lexer.token;

    if (token.kind === kind) {
      this._lexer.advance();

      return token;
    }

    return undefined;
  }
  /**
   * If the next token is a given keyword, advance the lexer.
   * Otherwise, do not change the parser state and throw an error.
   */
  ;

  _proto.expectKeyword = function expectKeyword(value) {
    var token = this._lexer.token;

    if (token.kind === TokenKind.NAME && token.value === value) {
      this._lexer.advance();
    } else {
      throw syntaxError(this._lexer.source, token.start, "Expected \"".concat(value, "\", found ").concat(getTokenDesc(token), "."));
    }
  }
  /**
   * If the next token is a given keyword, return "true" after advancing the lexer.
   * Otherwise, do not change the parser state and return "false".
   */
  ;

  _proto.expectOptionalKeyword = function expectOptionalKeyword(value) {
    var token = this._lexer.token;

    if (token.kind === TokenKind.NAME && token.value === value) {
      this._lexer.advance();

      return true;
    }

    return false;
  }
  /**
   * Helper function for creating an error when an unexpected lexed token is encountered.
   */
  ;

  _proto.unexpected = function unexpected(atToken) {
    var token = atToken !== null && atToken !== void 0 ? atToken : this._lexer.token;
    return syntaxError(this._lexer.source, token.start, "Unexpected ".concat(getTokenDesc(token), "."));
  }
  /**
   * Returns a possibly empty list of parse nodes, determined by the parseFn.
   * This list begins with a lex token of openKind and ends with a lex token of closeKind.
   * Advances the parser to the next lex token after the closing token.
   */
  ;

  _proto.any = function any(openKind, parseFn, closeKind) {
    this.expectToken(openKind);
    var nodes = [];

    while (!this.expectOptionalToken(closeKind)) {
      nodes.push(parseFn.call(this));
    }

    return nodes;
  }
  /**
   * Returns a list of parse nodes, determined by the parseFn.
   * It can be empty only if open token is missing otherwise it will always return non-empty list
   * that begins with a lex token of openKind and ends with a lex token of closeKind.
   * Advances the parser to the next lex token after the closing token.
   */
  ;

  _proto.optionalMany = function optionalMany(openKind, parseFn, closeKind) {
    if (this.expectOptionalToken(openKind)) {
      var nodes = [];

      do {
        nodes.push(parseFn.call(this));
      } while (!this.expectOptionalToken(closeKind));

      return nodes;
    }

    return [];
  }
  /**
   * Returns a non-empty list of parse nodes, determined by the parseFn.
   * This list begins with a lex token of openKind and ends with a lex token of closeKind.
   * Advances the parser to the next lex token after the closing token.
   */
  ;

  _proto.many = function many(openKind, parseFn, closeKind) {
    this.expectToken(openKind);
    var nodes = [];

    do {
      nodes.push(parseFn.call(this));
    } while (!this.expectOptionalToken(closeKind));

    return nodes;
  }
  /**
   * Returns a non-empty list of parse nodes, determined by the parseFn.
   * This list may begin with a lex token of delimiterKind followed by items separated by lex tokens of tokenKind.
   * Advances the parser to the next lex token after last item in the list.
   */
  ;

  _proto.delimitedMany = function delimitedMany(delimiterKind, parseFn) {
    this.expectOptionalToken(delimiterKind);
    var nodes = [];

    do {
      nodes.push(parseFn.call(this));
    } while (this.expectOptionalToken(delimiterKind));

    return nodes;
  };

  return Parser;
}();
/**
 * A helper function to describe a token as a string for debugging.
 */


function getTokenDesc(token) {
  var value = token.value;
  return getTokenKindDesc(token.kind) + (value != null ? " \"".concat(value, "\"") : '');
}
/**
 * A helper function to describe a token kind as a string for debugging.
 */


function getTokenKindDesc(kind) {
  return isPunctuatorTokenKind(kind) ? "\"".concat(kind, "\"") : kind;
}

const graphqlContext = {
  set: _fetchDeps.a,
  status: _fetchDeps.s,
  delay: _fetchDeps.d,
  fetch: _fetchDeps.f,
  data: _errorsDeps.d,
  errors: _errorsDeps.e
};
exports.graphqlContext = graphqlContext;

function parseQuery(query, definitionOperation = 'query') {
  var _a;

  const ast = parse(query);
  const operationDef = ast.definitions.find(def => {
    return def.kind === 'OperationDefinition' && (definitionOperation === 'all' || def.operation === definitionOperation);
  });
  return {
    operationType: operationDef === null || operationDef === void 0 ? void 0 : operationDef.operation,
    operationName: (_a = operationDef === null || operationDef === void 0 ? void 0 : operationDef.name) === null || _a === void 0 ? void 0 : _a.value
  };
}

function graphQLRequestHandler(expectedOperationType, expectedOperationName, mask, resolver) {
  const callFrame = (0, _getCallFrameDeps.a)();
  return {
    resolver,

    parse(req) {
      var _a; // According to the GraphQL specification, a GraphQL request can be issued
      // using both "GET" and "POST" methods.


      switch (req.method) {
        case 'GET':
          {
            const query = req.url.searchParams.get('query');
            const variablesString = req.url.searchParams.get('variables') || '';

            if (!query) {
              return null;
            }

            const variables = variablesString ? (0, _fetchDeps.e)(variablesString) : {};
            const {
              operationType,
              operationName
            } = parseQuery(query, expectedOperationType);
            return {
              operationType,
              operationName,
              variables
            };
          }

        case 'POST':
          {
            if (!((_a = req.body) === null || _a === void 0 ? void 0 : _a.query)) {
              return null;
            }

            const {
              query,
              variables
            } = req.body;
            const {
              operationType,
              operationName
            } = parseQuery(query, expectedOperationType);
            return {
              operationType,
              operationName,
              variables
            };
          }

        default:
          return null;
      }
    },

    getPublicRequest(req, parsed) {
      return Object.assign(Object.assign({}, req), {
        variables: parsed.variables || {}
      });
    },

    predicate(req, parsed) {
      if (!parsed || !parsed.operationName) {
        return false;
      } // Match the request URL against a given mask,
      // in case of an endpoint-specific request handler.


      const hasMatchingMask = (0, _getCallFrameDeps.m)(req.url, mask);
      const isMatchingOperation = expectedOperationName instanceof RegExp ? expectedOperationName.test(parsed.operationName) : expectedOperationName === parsed.operationName;
      return hasMatchingMask.matches && isMatchingOperation;
    },

    defineContext() {
      return graphqlContext;
    },

    log(req, res, handler, parsed) {
      const {
        operationType,
        operationName
      } = parsed;
      const loggedRequest = (0, _getCallFrameDeps.b)(req);
      const loggedResponse = (0, _getCallFrameDeps.c)(res);
      console.groupCollapsed('[MSW] %s %s (%c%s%c)', (0, _getCallFrameDeps.d)(), operationName, `color:${(0, _getCallFrameDeps.e)(res.status)}`, res.status, 'color:inherit');
      console.log('Request:', loggedRequest);
      console.log('Handler:', {
        operationType,
        operationName: expectedOperationName,
        predicate: handler.predicate
      });
      console.log('Response:', loggedResponse);
      console.groupEnd();
    },

    getMetaInfo() {
      const header = expectedOperationType === 'all' ? `[graphql] ${expectedOperationType} (origin: ${mask.toString()})` : `[graphql] ${expectedOperationType} ${expectedOperationName} (origin: ${mask.toString()})`;
      return {
        type: 'graphql',
        header,
        mask,
        callFrame
      };
    }

  };
}

const createGraphQLScopedHandler = (expectedOperationType, mask) => {
  return (expectedOperationName, resolver) => {
    return graphQLRequestHandler(expectedOperationType, expectedOperationName, mask, resolver);
  };
};

const createGraphQLOperationHandler = mask => {
  return resolver => {
    return graphQLRequestHandler('all', new RegExp('.*'), mask, resolver);
  };
};

const graphqlStandardHandlers = {
  /**
   * Captures any GraphQL operation, regardless of its name, under the current scope.
   * @example
   * graphql.operation((req, res, ctx) => {
   *   return res(ctx.data({ name: 'John' }))
   * })
   * @see {@link https://mswjs.io/docs/api/graphql/operation `graphql.operation()`}
   */
  operation: createGraphQLOperationHandler('*'),

  /**
   * Captures a GraphQL query by a given name.
   * @example
   * graphql.query('GetUser', (req, res, ctx) => {
   *   return res(ctx.data({ user: { name: 'John' } }))
   * })
   * @see {@link https://mswjs.io/docs/api/graphql/query `graphql.query()`}
   */
  query: createGraphQLScopedHandler('query', '*'),

  /**
   * Captures a GraphQL mutation by a given name.
   * @example
   * graphql.mutation('SavePost', (req, res, ctx) => {
   *   return res(ctx.data({ post: { id: 'abc-123' } }))
   * })
   * @see {@link https://mswjs.io/docs/api/graphql/mutation `graphql.mutation()`}
   */
  mutation: createGraphQLScopedHandler('mutation', '*')
};
/**
 * Creates a GraphQL mocking API scoped to the given endpoint.
 * @param uri Endpoint URL, or path.
 * @example
 * const api = graphql.link('https://api.site.com/graphql)
 * api.query('GetUser', resolver)
 * @see {@link https://mswjs.io/docs/api/graphql/link `graphql.link()`}
 */

function createGraphQLLink(uri) {
  return {
    operation: createGraphQLOperationHandler(uri),
    query: createGraphQLScopedHandler('query', uri),
    mutation: createGraphQLScopedHandler('mutation', uri)
  };
}

const graphql = Object.assign(Object.assign({}, graphqlStandardHandlers), {
  link: createGraphQLLink
});
exports.graphql = graphql;
},{"./fetch-deps.js":"../node_modules/msw/lib/esm/fetch-deps.js","./errors-deps.js":"../node_modules/msw/lib/esm/errors-deps.js","./getCallFrame-deps.js":"../node_modules/msw/lib/esm/getCallFrame-deps.js"}],"../node_modules/msw/lib/esm/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.compose = compose;
exports.createResponseComposition = createResponseComposition;
exports.setupWorker = setupWorker;
Object.defineProperty(exports, "context", {
  enumerable: true,
  get: function () {
    return _indexDeps.i;
  }
});
Object.defineProperty(exports, "RESTMethods", {
  enumerable: true,
  get: function () {
    return _restDeps.R;
  }
});
Object.defineProperty(exports, "rest", {
  enumerable: true,
  get: function () {
    return _restDeps.r;
  }
});
Object.defineProperty(exports, "restContext", {
  enumerable: true,
  get: function () {
    return _restDeps.a;
  }
});
Object.defineProperty(exports, "matchRequestUrl", {
  enumerable: true,
  get: function () {
    return _getCallFrameDeps.m;
  }
});
Object.defineProperty(exports, "graphql", {
  enumerable: true,
  get: function () {
    return _graphql.graphql;
  }
});
Object.defineProperty(exports, "graphqlContext", {
  enumerable: true,
  get: function () {
    return _graphql.graphqlContext;
  }
});
exports.response = exports.defaultResponse = exports.defaultContext = void 0;

var _fetchDeps = require("./fetch-deps.js");

var _xmlDeps = require("./xml-deps.js");

var _errorsDeps = require("./errors-deps.js");

var _indexDeps = require("./index-deps.js");

var _restDeps = require("./rest-deps.js");

var _getCallFrameDeps = require("./getCallFrame-deps.js");

var _graphql = require("./graphql.js");

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
function __awaiter(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}

var until = (0, _fetchDeps.c)(function (module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  /**
   * Gracefully handles a given Promise factory.
   * @example
   * cosnt [error, data] = await until(() => asyncAction())
   */

  exports.until = async promise => {
    try {
      const data = await promise().catch(error => {
        throw error;
      });
      return [null, data];
    } catch (error) {
      return [error, null];
    }
  };
});
var lib = (0, _fetchDeps.c)(function (module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.until = until.until;
});
/**
 * Attempts to resolve a Service Worker instance from a given registration,
 * regardless of its state (active, installing, waiting).
 */

const getWorkerByRegistration = (registration, absoluteWorkerUrl, findWorker) => {
  const allStates = [registration.active, registration.installing, registration.waiting];
  const existingStates = allStates.filter(Boolean);
  const mockWorker = existingStates.find(worker => {
    return findWorker(worker.scriptURL, absoluteWorkerUrl);
  });
  return mockWorker || null;
};
/**
 * Returns an absolute Service Worker URL based on the given
 * relative URL (known during the registration).
 */


function getAbsoluteWorkerUrl(relativeUrl) {
  return new URL(relativeUrl, location.origin).href;
}
/**
 * Returns an active Service Worker instance.
 * When not found, registers a new Service Worker.
 */


const getWorkerInstance = (url, options = {}, findWorker) => __awaiter(void 0, void 0, void 0, function* () {
  // Resolve the absolute Service Worker URL.
  const absoluteWorkerUrl = getAbsoluteWorkerUrl(url);
  const [, mockRegistrations] = yield lib.until(() => __awaiter(void 0, void 0, void 0, function* () {
    const registrations = yield navigator.serviceWorker.getRegistrations();
    return registrations.filter(registration => {
      return getWorkerByRegistration(registration, absoluteWorkerUrl, findWorker);
    });
  }));

  if (!navigator.serviceWorker.controller && mockRegistrations.length > 0) {
    // Reload the page when it has associated workers, but no active controller.
    // The absence of a controller can mean either:
    // - page has no Service Worker associated with it
    // - page has been hard-reloaded and its workers won't be used until the next reload.
    // Since we've checked that there are registrations associated with this page,
    // at this point we are sure it's hard reload that falls into this clause.
    location.reload();
  }

  const [existingRegistration] = mockRegistrations;

  if (existingRegistration) {
    // When the Service Worker is registered, update it and return the reference.
    return existingRegistration.update().then(() => {
      return [getWorkerByRegistration(existingRegistration, absoluteWorkerUrl, findWorker), existingRegistration];
    });
  } // When the Service Worker wasn't found, register it anew and return the reference.


  const [error, instance] = yield lib.until(() => __awaiter(void 0, void 0, void 0, function* () {
    const registration = yield navigator.serviceWorker.register(url, options);
    return [// Compare existing worker registration by its worker URL,
    // to prevent irrelevant workers to resolve here (such as Codesandbox worker).
    getWorkerByRegistration(registration, absoluteWorkerUrl, findWorker), registration];
  })); // Handle Service Worker registration errors.

  if (error) {
    const isWorkerMissing = error.message.includes('(404)'); // Produce a custom error message when given a non-existing Service Worker url.
    // Suggest developers to check their setup.

    if (isWorkerMissing) {
      const scopeUrl = new URL((options === null || options === void 0 ? void 0 : options.scope) || '/', location.href);
      console.error(`\
[MSW] Failed to register a Service Worker for scope ('${scopeUrl.href}') with script ('${absoluteWorkerUrl}'): Service Worker script does not exist at the given path.

Did you forget to run "npx msw init <PUBLIC_DIR>"?

Learn more about creating the Service Worker script: https://mswjs.io/docs/cli/init`);
      return null;
    } // Fallback error message for any other registration errors.


    console.error(`[MSW] Failed to register a Service Worker:\n\n${error.message}`);
    return null;
  }

  return instance;
});

const activateMocking = (context, options) => __awaiter(void 0, void 0, void 0, function* () {
  var _a;

  (_a = context.worker) === null || _a === void 0 ? void 0 : _a.postMessage('MOCK_ACTIVATE');
  return context.events.once('MOCKING_ENABLED').then(() => {
    if (!(options === null || options === void 0 ? void 0 : options.quiet)) {
      console.groupCollapsed('%c[MSW] Mocking enabled.', 'color:orangered;font-weight:bold;');
      console.log('%cDocumentation: %chttps://mswjs.io/docs', 'font-weight:bold', 'font-weight:normal');
      console.log('Found an issue? https://github.com/mswjs/msw/issues');
      console.groupEnd();
    }
  });
});
/**
 * Creates a communication channel between the client
 * and the Service Worker associated with the given event.
 */


const createBroadcastChannel = event => {
  const port = event.ports[0];
  return {
    /**
     * Sends a text message to the connected Service Worker.
     */
    send(message) {
      if (port) {
        port.postMessage(message);
      }
    }

  };
};

const defaultContext = {
  status: _fetchDeps.s,
  set: _fetchDeps.a,
  delay: _fetchDeps.d,
  fetch: _fetchDeps.f
};
/**
 * Composes a given list of functions into a new function that
 * executes from right to left.
 */

exports.defaultContext = defaultContext;

function compose(...fns) {
  return (...args) => {
    return fns.reduceRight((leftFn, rightFn) => {
      return leftFn instanceof Promise ? Promise.resolve(leftFn).then(rightFn) : rightFn(leftFn);
    }, args[0]);
  };
}

class NetworkError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NetworkError';
  }

}

const defaultResponse = {
  status: 200,
  statusText: 'OK',
  body: null,
  delay: 0,
  once: false
};
exports.defaultResponse = defaultResponse;
const defaultResponseTransformers = [];

function createResponseComposition(responseOverrides, defaultTransformers = defaultResponseTransformers) {
  return (...transformers) => __awaiter(this, void 0, void 0, function* () {
    const initialResponse = Object.assign({}, defaultResponse, {
      headers: new _fetchDeps.l.Headers({
        'x-powered-by': 'msw'
      })
    }, responseOverrides);
    const resolvedTransformers = [...defaultTransformers, ...transformers].filter(Boolean);
    const resolvedResponse = resolvedTransformers.length > 0 ? compose(...resolvedTransformers)(initialResponse) : initialResponse;
    return resolvedResponse;
  });
}

const response = Object.assign(createResponseComposition(), {
  once: createResponseComposition({
    once: true
  }),

  networkError(message) {
    throw new NetworkError(message);
  }

});
/**
 * Returns a mocked response for a given request using following request handlers.
 */

exports.response = response;

const getResponse = (req, handlers) => __awaiter(void 0, void 0, void 0, function* () {
  const relevantHandlers = handlers.filter(requestHandler => {
    // Skip a handler if it has been already used for a one-time response.
    return !requestHandler.shouldSkip;
  }).map(requestHandler => {
    // Parse the captured request to get additional information.
    // Make the predicate function accept all the necessary information
    // to decide on the interception.
    const parsedRequest = requestHandler.parse ? requestHandler.parse(req) : null;
    return [requestHandler, parsedRequest];
  }).filter(([requestHandler, parsedRequest]) => {
    return requestHandler.predicate(req, parsedRequest);
  });

  if (relevantHandlers.length == 0) {
    // Handle a scenario when a request has no relevant request handlers.
    // In that case it would be bypassed (performed as-is).
    return {
      handler: null,
      response: null
    };
  }

  const {
    requestHandler,
    parsedRequest,
    mockedResponse,
    publicRequest
  } = yield relevantHandlers.reduce((asyncAcc, [requestHandler, parsedRequest]) => __awaiter(void 0, void 0, void 0, function* () {
    // Now the reduce function is async so we need to await if response was found
    const acc = yield asyncAcc; // If a first not empty response was found we'll stop evaluating other requests

    if (acc.requestHandler) {
      return acc;
    }

    const {
      getPublicRequest,
      defineContext,
      resolver
    } = requestHandler;
    const publicRequest = getPublicRequest ? getPublicRequest(req, parsedRequest) : req;
    const context = defineContext ? defineContext(publicRequest) : defaultContext;
    const mockedResponse = yield resolver(publicRequest, response, context);

    if (!mockedResponse) {
      return acc;
    }

    if (mockedResponse && mockedResponse.once) {
      // When responded with a one-time response, match the relevant request handler
      // as skipped, so it cannot affect the captured requests anymore.
      requestHandler.shouldSkip = true;
    }

    return {
      requestHandler,
      parsedRequest,
      mockedResponse,
      publicRequest
    };
  }), Promise.resolve({
    mockedResponse: null
  })); // Although reducing a list of relevant request handlers, it's possible
  // that in the end there will be no handler associted with the request
  // (i.e. if relevant handlers are fall-through).

  if (!requestHandler) {
    return {
      handler: null,
      response: null
    };
  }

  return {
    handler: requestHandler,
    response: mockedResponse,
    publicRequest,
    parsedRequest
  };
});

function onUnhandledRequest(request, handler = 'bypass') {
  if (typeof handler === 'function') {
    handler(request);
    return;
  }

  const publicUrl = (0, _restDeps.g)(request);
  const message = `captured a ${request.method} ${request.url} request without a corresponding request handler.

  If you wish to intercept this request, consider creating a request handler for it:

  rest.${request.method.toLowerCase()}('${publicUrl}', (req, res, ctx) => {
    return res(ctx.text('body'))
  })`;

  switch (handler) {
    case 'error':
      {
        throw new Error(`[MSW] Error: ${message}`);
      }

    case 'warn':
      {
        console.warn(`[MSW] Warning: ${message}`);
      }

    default:
      return;
  }
}

function getAllCookies() {
  return (0, _xmlDeps.p)(document.cookie);
}
/**
 * Returns relevant document cookies based on the request `credentials` option.
 */


function getRequestCookies(req) {
  switch (req.credentials) {
    case 'same-origin':
      {
        // Return document cookies only when requested a resource
        // from the same origin as the current document.
        return location.origin === req.url.origin ? getAllCookies() : {};
      }

    case 'include':
      {
        // Return all document cookies.
        return getAllCookies();
      }

    default:
      {
        return {};
      }
  }
}

const handleRequestWith = (context, options) => {
  return event => __awaiter(void 0, void 0, void 0, function* () {
    const channel = createBroadcastChannel(event);

    try {
      const message = JSON.parse(event.data, function (key, value) {
        if (key === 'url') {
          return new URL(value);
        } // Serialize headers


        if (key === 'headers') {
          return new _fetchDeps.l.Headers(value);
        } // Prevent empty fields from presering an empty value.
        // It's invalid to perform a GET request with { body: "" }


        if ( // Check if we are parsing deeper in `event.data.payload`,
        // because this custom JSON parser is invoked for each depth level.
        this.method && (0, _restDeps.i)(this.method, 'GET') && key === 'body' && value === '') {
          return undefined;
        }

        return value;
      });
      const {
        type,
        payload: req
      } = message; // Ignore irrelevant worker message types

      if (type !== 'REQUEST') {
        return null;
      } // Parse the request's body based on the "Content-Type" header.


      req.body = (0, _getCallFrameDeps.p)(req.body, req.headers); // Set document cookies on the request.

      req.cookies = getRequestCookies(req);
      const {
        response,
        handler,
        publicRequest,
        parsedRequest
      } = yield getResponse(req, context.requestHandlers); // Handle a scenario when there is no request handler
      // found for a given request.

      if (!handler) {
        onUnhandledRequest(req, options.onUnhandledRequest);
        return channel.send({
          type: 'MOCK_NOT_FOUND'
        });
      } // Handle a scenario when there is a request handler,
      // but it doesn't return any mocked response.


      if (!response) {
        console.warn('[MSW] Expected a mocking resolver function to return a mocked response Object, but got: %s. Original response is going to be used instead.', response);
        return channel.send({
          type: 'MOCK_NOT_FOUND'
        });
      }

      const responseWithSerializedHeaders = Object.assign(Object.assign({}, response), {
        headers: _fetchDeps.l.headersToList(response.headers)
      });

      if (!options.quiet) {
        setTimeout(() => {
          handler.log(publicRequest, responseWithSerializedHeaders, handler, parsedRequest);
        }, response.delay);
      }

      channel.send({
        type: 'MOCK_SUCCESS',
        payload: responseWithSerializedHeaders
      });
    } catch (error) {
      if (error instanceof NetworkError) {
        // Treat emulated network error differently,
        // as it is an intended exception in a request handler.
        return channel.send({
          type: 'NETWORK_ERROR',
          payload: {
            name: error.name,
            message: error.message
          }
        });
      } // Treat all the other exceptions in a request handler
      // as unintended, alerting that there is a problem needs fixing.


      channel.send({
        type: 'INTERNAL_ERROR',
        payload: {
          status: 500,
          body: JSON.stringify({
            errorType: error.constructor.name,
            message: error.message,
            location: error.stack
          })
        }
      });
    }
  });
};

function requestIntegrityCheck(context, serviceWorker) {
  return __awaiter(this, void 0, void 0, function* () {
    // Signal Service Worker to report back its integrity
    serviceWorker.postMessage('INTEGRITY_CHECK_REQUEST');
    const {
      payload: actualChecksum
    } = yield context.events.once('INTEGRITY_CHECK_RESPONSE'); // Compare the response from the Service Worker and the
    // global variable set by webpack upon build.

    if (actualChecksum !== "65d33ca82955e1c5928aed19d1bdf3f9") {
      throw new Error(`Currently active Service Worker (${actualChecksum}) is behind the latest published one (${"65d33ca82955e1c5928aed19d1bdf3f9"}).`);
    }

    return serviceWorker;
  });
}
/**
 * Intercepts and defers any requests on the page
 * until the Service Worker instance is ready.
 * Must only be used in a browser.
 */


function deferNetworkRequestsUntil(predicatePromise) {
  // Defer any `XMLHttpRequest` requests until the Service Worker is ready.
  const originalXhrSend = window.XMLHttpRequest.prototype.send;

  window.XMLHttpRequest.prototype.send = function (...args) {
    // Keep this function synchronous to comply with `XMLHttpRequest.prototype.send`,
    // because that method is always synchronous.
    lib.until(() => predicatePromise).then(() => {
      window.XMLHttpRequest.prototype.send = originalXhrSend;
      this.send(...args);
    });
  }; // Defer any `fetch` requests until the Service Worker is ready.


  const originalFetch = window.fetch;

  window.fetch = (...args) => __awaiter(this, void 0, void 0, function* () {
    yield lib.until(() => predicatePromise);
    window.fetch = originalFetch;
    return window.fetch(...args);
  });
}

const DEFAULT_START_OPTIONS = {
  serviceWorker: {
    url: '/mockServiceWorker.js',
    options: null
  },
  quiet: false,
  waitUntilReady: true,
  onUnhandledRequest: 'bypass',
  findWorker: (scriptURL, mockServiceWorkerUrl) => scriptURL === mockServiceWorkerUrl
};

const createStart = context => {
  /**
   * Registers and activates the mock Service Worker.
   */
  return function start(options) {
    const resolvedOptions = (0, _errorsDeps.m)(DEFAULT_START_OPTIONS, options || {});

    const startWorkerInstance = () => __awaiter(this, void 0, void 0, function* () {
      if (!('serviceWorker' in navigator)) {
        console.error(`[MSW] Failed to register a Service Worker: this browser does not support Service Workers (see https://caniuse.com/serviceworkers), or your application is running on an insecure host (consider using HTTPS for custom hostnames).`);
        return null;
      } // Remove all previously existing event listeners.
      // This way none of the listeners persists between Fast refresh
      // of the application's code.


      context.events.removeAllListeners();
      context.events.addListener(navigator.serviceWorker, 'message', handleRequestWith(context, resolvedOptions));
      const [, instance] = yield lib.until(() => getWorkerInstance(resolvedOptions.serviceWorker.url, resolvedOptions.serviceWorker.options, resolvedOptions.findWorker));

      if (!instance) {
        return null;
      }

      const [worker, registration] = instance;

      if (!worker) {
        if (options === null || options === void 0 ? void 0 : options.findWorker) {
          console.error(`\
[MSW] Failed to locate the Service Worker registration using a custom "findWorker" predicate.

Please ensure that the custom predicate properly locates the Service Worker registration at "${resolvedOptions.serviceWorker.url}".
More details: https://mswjs.io/docs/api/setup-worker/start#findworker
`);
        } else {
          console.error(`\
[MSW] Failed to locate the Service Worker registration.

This most likely means that the worker script URL "${resolvedOptions.serviceWorker.url}" cannot resolve against the actual public hostname (${location.host}). This may happen if your application runs behind a proxy, or has a dynamic hostname.

Please consider using a custom "serviceWorker.url" option to point to the actual worker script location, or a custom "findWorker" option to resolve the Service Worker registration manually. More details: https://mswjs.io/docs/api/setup-worker/start`);
        }

        return null;
      }

      context.worker = worker;
      context.registration = registration;
      context.events.addListener(window, 'beforeunload', () => {
        if (worker.state !== 'redundant') {
          // Notify the Service Worker that this client has closed.
          // Internally, it's similar to disabling the mocking, only
          // client close event has a handler that self-terminates
          // the Service Worker when there are no open clients.
          worker.postMessage('CLIENT_CLOSED');
        } // Make sure we're always clearing the interval - there are reports that not doing this can
        // cause memory leaks in headless browser environments.


        window.clearInterval(context.keepAliveInterval);
      }); // Check if the active Service Worker is the latest published one

      const [integrityError] = yield lib.until(() => requestIntegrityCheck(context, worker));

      if (integrityError) {
        console.error(`\
[MSW] Detected outdated Service Worker: ${integrityError.message}

The mocking is still enabled, but it's highly recommended that you update your Service Worker by running:

$ npx msw init <PUBLIC_DIR>

This is necessary to ensure that the Service Worker is in sync with the library to guarantee its stability.
If this message still persists after updating, please report an issue: https://github.com/open-draft/msw/issues\
      `);
      } // Signal the Service Worker to enable requests interception


      const [activationError] = yield lib.until(() => activateMocking(context, options));

      if (activationError) {
        console.error('Failed to enable mocking', activationError);
        return null;
      }

      context.keepAliveInterval = window.setInterval(() => worker.postMessage('KEEPALIVE_REQUEST'), 5000);
      return registration;
    });

    const workerRegistration = startWorkerInstance(); // Defer any network requests until the Service Worker instance is ready.
    // This prevents a race condition between the Service Worker registration
    // and application's runtime requests (i.e. requests on mount).

    if (resolvedOptions.waitUntilReady) {
      deferNetworkRequestsUntil(workerRegistration);
    }

    return workerRegistration;
  };
};

const createStop = context => {
  /**
   * Signal the Service Worker to disable mocking for this client.
   * Use this an an explicit way to stop the mocking, while preserving
   * the worker-client relation. Does not affect the worker's lifecycle.
   */
  return function stop() {
    var _a;

    (_a = context.worker) === null || _a === void 0 ? void 0 : _a.postMessage('MOCK_DEACTIVATE');
    context.events.removeAllListeners();
    window.clearInterval(context.keepAliveInterval);
  };
};

function use(currentHandlers, ...handlers) {
  currentHandlers.unshift(...handlers);
}

function restoreHandlers(handlers) {
  handlers.forEach(handler => {
    if ('shouldSkip' in handler) {
      handler.shouldSkip = false;
    }
  });
}

function resetHandlers(initialHandlers, ...nextHandlers) {
  return nextHandlers.length > 0 ? [...nextHandlers] : [...initialHandlers];
} // Declare the list of event handlers on the module's scope
// so it persists between Fash refreshes of the application's code.


let listeners = [];
/**
 * Creates a new mock Service Worker registration
 * with the given request handlers.
 * @param {RequestHandler[]} requestHandlers List of request handlers
 * @see {@link https://mswjs.io/docs/api/setup-worker `setupWorker`}
 */

function setupWorker(...requestHandlers) {
  requestHandlers.forEach(handler => {
    if (Array.isArray(handler)) throw new Error(`[MSW] Failed to call "setupWorker" given an Array of request handlers (setupWorker([a, b])), expected to receive each handler individually: setupWorker(a, b).`);
  });
  const context = {
    worker: null,
    registration: null,
    requestHandlers: [...requestHandlers],
    events: {
      addListener(target, event, callback) {
        target.addEventListener(event, callback);
        listeners.push({
          event,
          target,
          callback
        });
        return () => {
          target.removeEventListener(event, callback);
        };
      },

      removeAllListeners() {
        for (const {
          target,
          event,
          callback
        } of listeners) {
          target.removeEventListener(event, callback);
        }

        listeners = [];
      },

      once(type) {
        const bindings = [];
        return new Promise((resolve, reject) => {
          const handleIncomingMessage = event => {
            try {
              const message = JSON.parse(event.data);

              if (message.type === type) {
                resolve(message);
              }
            } catch (error) {
              reject(error);
            }
          };

          bindings.push(context.events.addListener(navigator.serviceWorker, 'message', handleIncomingMessage), context.events.addListener(navigator.serviceWorker, 'messageerror', reject));
        }).finally(() => {
          bindings.forEach(unbind => unbind());
        });
      }

    }
  }; // Error when attempting to run this function in a NodeJS environment.

  if ((0, _fetchDeps.i)()) {
    throw new Error('[MSW] Failed to execute `setupWorker` in a non-browser environment. Consider using `setupServer` for NodeJS environment instead.');
  }

  return {
    start: createStart(context),
    stop: createStop(context),

    use(...handlers) {
      use(context.requestHandlers, ...handlers);
    },

    restoreHandlers() {
      restoreHandlers(context.requestHandlers);
    },

    resetHandlers(...nextHandlers) {
      context.requestHandlers = resetHandlers(requestHandlers, ...nextHandlers);
    },

    printHandlers() {
      context.requestHandlers.forEach(handler => {
        const meta = handler.getMetaInfo();
        console.groupCollapsed(meta.header);
        console.log(`Declaration: ${meta.callFrame}`);
        console.log('Resolver: %s', handler.resolver);

        if (['rest'].includes(meta.type)) {
          console.log('Match:', `https://mswjs.io/repl?path=${meta.mask}`);
        }

        console.groupEnd();
      });
    }

  };
}
},{"./fetch-deps.js":"../node_modules/msw/lib/esm/fetch-deps.js","./xml-deps.js":"../node_modules/msw/lib/esm/xml-deps.js","./errors-deps.js":"../node_modules/msw/lib/esm/errors-deps.js","./index-deps.js":"../node_modules/msw/lib/esm/index-deps.js","./rest-deps.js":"../node_modules/msw/lib/esm/rest-deps.js","./getCallFrame-deps.js":"../node_modules/msw/lib/esm/getCallFrame-deps.js","./graphql.js":"../node_modules/msw/lib/esm/graphql.js"}],"mocks/data.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.articles = exports.topics = void 0;
// DO NOT MAKE CHANGES TO THIS FILE
// DO NOT MAKE CHANGES TO THIS FILE
// DO NOT MAKE CHANGES TO THIS FILE
var topics = {
  "topics": ["javascript", "bootstrap", "technology", "jquery", "node.js"]
};
exports.topics = topics;
var articles = {
  "articles": {
    "javascript": [{
      "id": "1e4d8724-5973-4b5b-84d9-a30a3c5adb70",
      "headline": "ES8: The Next Step in the Evolution of Javascript and What it Means For Your Projects",
      "authorPhoto": "https://tk-assets.lambdaschool.com/08d1372e-e393-47f1-ac44-fcb7d0baf0e2_sir.jpg",
      "authorName": "SIR RUFF'N'STUFF"
    }, {
      "id": "553e2401-c95d-4029-89b8-fc6bdb60ae5e",
      "headline": "Type Coercion: Why Does NaN !== NaN? and Other Strange Occurrences",
      "authorPhoto": "https://tk-assets.lambdaschool.com/a9471235-ed71-4b11-ae15-5a4fa1151d30_bones.jpg",
      "authorName": "BONES R. LIFE"
    }, {
      "id": "9c2ed89e-7150-4cd6-a5c2-4a4f3d6932c8",
      "headline": "When to Rest, When to Spread: Why There Are Two Meanings Behind '...'",
      "authorPhoto": "https://tk-assets.lambdaschool.com/44260ce3-c8f0-4db8-bc1d-9877662fdf96_puppers.jpg",
      "authorName": "PUPPER S. DOGGO"
    }, {
      "id": "b3af02ec-5733-4a14-8876-5db708d20051",
      "headline": "Typescript: Ten Things you Should Know Before Building Your Next Angular Application",
      "authorPhoto": "https://tk-assets.lambdaschool.com/08d1372e-e393-47f1-ac44-fcb7d0baf0e2_sir.jpg",
      "authorName": "SIR RUFF'N'STUFF"
    }],
    "bootstrap": [{
      "id": "5efa1378-c91f-49eb-9955-02e477c95920",
      "headline": "Bootstrap 5: Get a Sneak Peak at all the New Features",
      "authorPhoto": "https://tk-assets.lambdaschool.com/1891c758-b3f4-4ec7-9d88-590bf7c7ceb2_fido.jpg",
      "authorName": "FIDO WALKSALOT"
    }, {
      "id": "d03affc6-b06e-4b4a-9909-3981c7cb8389",
      "headline": "UI Frameworks: A Comparison, Which Made Our List? (Hint: Bootstrap is on it)",
      "authorPhoto": "https://tk-assets.lambdaschool.com/247dd20f-7e32-479b-a861-c3bbe85b5f0c_max.jpg",
      "authorName": "MAX GOODBOYE"
    }, {
      "id": "a85f88d3-0845-426d-9f02-930daa5c9b34",
      "headline": "The Hottest New Bootstrap 4 Components Every Developer Needs to Know About",
      "authorPhoto": "https://tk-assets.lambdaschool.com/247dd20f-7e32-479b-a861-c3bbe85b5f0c_max.jpg",
      "authorName": "MAX GOODBOYE"
    }],
    "technology": [{
      "id": "be3dc9bd-52a0-4874-97d8-99223b937da9",
      "headline": "AI: What Are the Ethical Ramifications of the Future?",
      "authorPhoto": "https://tk-assets.lambdaschool.com/247dd20f-7e32-479b-a861-c3bbe85b5f0c_max.jpg",
      "authorName": "MAX GOODBOYE"
    }, {
      "id": "1749a430-f470-4c23-be75-fe736a5409c2",
      "headline": "AR or VR: How We Will See the World Through a Digital Lense",
      "authorPhoto": "https://tk-assets.lambdaschool.com/247dd20f-7e32-479b-a861-c3bbe85b5f0c_max.jpg",
      "authorName": "MAX GOODBOYE"
    }, {
      "id": "3a80aa8b-644a-4382-a544-f1f68cb35cb5",
      "headline": "Quantum Computing: Where we Are Now, and Where We Will Be Very Soon",
      "authorPhoto": "https://tk-assets.lambdaschool.com/247dd20f-7e32-479b-a861-c3bbe85b5f0c_max.jpg",
      "authorName": "MAX GOODBOYE"
    }],
    "jquery": [{
      "id": "6945439f-363a-49b2-93b5-d50c97a717b7",
      "headline": "History of Javascript Libraries: from jQuery to React",
      "authorPhoto": "https://tk-assets.lambdaschool.com/44260ce3-c8f0-4db8-bc1d-9877662fdf96_puppers.jpg",
      "authorName": "PUPPER S. DOGGO"
    }, {
      "id": "43410bfb-e9cd-4a56-9022-315003b727e1",
      "headline": "jQuery Animations: When and Where to Use Them, and Not CSS",
      "authorPhoto": "https://tk-assets.lambdaschool.com/1891c758-b3f4-4ec7-9d88-590bf7c7ceb2_fido.jpg",
      "authorName": "FIDO WALKSALOT"
    }, {
      "id": "68fd787a-f5bc-4563-bbba-c11dd5818927",
      "headline": "Why I Use jQuery in Every Application I Create and Why You Should Too",
      "authorPhoto": "https://tk-assets.lambdaschool.com/1891c758-b3f4-4ec7-9d88-590bf7c7ceb2_fido.jpg",
      "authorName": "FIDO WALKSALOT"
    }],
    "node": [{
      "id": "75e89d6c-e4f4-411b-8855-bef0b8ed3508",
      "headline": "Node.js in 2018: Which Framework? Express, Sails, Hapi?",
      "authorPhoto": "https://tk-assets.lambdaschool.com/08d1372e-e393-47f1-ac44-fcb7d0baf0e2_sir.jpg",
      "authorName": "SIR RUFF'N'STUF"
    }, {
      "id": "04468917-d408-4e2d-804f-143474f11d29",
      "headline": "MongoDB: NoSQL vs. SQL, the Debate Continues..",
      "authorPhoto": "https://tk-assets.lambdaschool.com/a9471235-ed71-4b11-ae15-5a4fa1151d30_bones.jpg",
      "authorName": "BONES R. LIFE"
    }]
  }
};
exports.articles = articles;
},{}],"mocks/handlers.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handlers = void 0;

var _msw = require("msw");

var _data = require("./data");

// DO NOT MAKE CHANGES TO THIS FILE
// DO NOT MAKE CHANGES TO THIS FILE
// DO NOT MAKE CHANGES TO THIS FILE
function getTopics(req, res, ctx) {
  return res(ctx.status(200), ctx.json(_data.topics));
}

function getArticles(req, res, ctx) {
  return res(ctx.status(200), ctx.json(_data.articles));
}

var handlers = [_msw.rest.get('https://lambda-times-api.herokuapp.com/articles', getArticles), _msw.rest.get('https://lambda-times-api.herokuapp.com/topics', getTopics)];
exports.handlers = handlers;
},{"msw":"../node_modules/msw/lib/esm/index.js","./data":"mocks/data.js"}],"mocks/browser.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.worker = void 0;

var _msw = require("msw");

var _handlers = require("./handlers");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var worker = _msw.setupWorker.apply(void 0, _toConsumableArray(_handlers.handlers));

exports.worker = worker;
},{"msw":"../node_modules/msw/lib/esm/index.js","./handlers":"mocks/handlers.js"}],"index.js":[function(require,module,exports) {
"use strict";

require("regenerator-runtime");

var _card = require("./components/card");

var _header = require("./components/header");

var _tabs = require("./components/tabs");

var _browser = require("./mocks/browser");

// DO NOT MAKE CHANGES TO THIS FILE
// DO NOT MAKE CHANGES TO THIS FILE
// DO NOT MAKE CHANGES TO THIS FILE
_browser.worker.start();

(0, _header.headerAppender)('.header-container');
(0, _tabs.tabsAppender)('.tabs-container');
(0, _card.cardAppender)('.cards-container');
},{"regenerator-runtime":"../node_modules/regenerator-runtime/runtime.js","./components/card":"components/card.js","./components/header":"components/header.js","./components/tabs":"components/tabs.js","./mocks/browser":"mocks/browser.js"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "63478" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/src.e31bb0bc.js.map