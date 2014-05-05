(function(root, factory) {

    // Set up Sibyl appropriately for the environment

    if (typeof define === 'function' && define.amd) {
        // Start with AMD

        define(['underscore'], function(_) {
            // Export global even in AMD case in case this script is loaded with
            // others that may still expect a global Sibyl.
            root.Sibyl = factory(root, exports);
        });

    } else if (typeof exports !== 'undefined') {
        // Next for Node.js or CommonJS

        var _ = require('underscore');
        factory(root, exports, _);

    } else {
        // Finally, as a browser global
        root.Sibyl = factory(root, {}, root._);
    }

}(this, function(root, Sibyl, _) {


    /**
     * The Set object lets you store unique values of any type,
     * whether primitive values or object references.
     * @param {Array} initialKeys
     */

    function Set(initialKeys) {
        this.size = 0;
        this.values = [];
    }

    /**
     * Appends a new element with the given value
     * to the Set object.
     * @param {Object} value
     * @return {this}
     */
    Set.prototype.add = function(value) {
        if (!this.has(value)) {
            this.values.push(value);
            this.size++;
            this.sort();
        }
        return this;
    };

    /**
     * Removes all elements from the Set object.
     * @return {this}
     */
    Set.prototype.clear = function() {
        this.values = [];
        this.size = 0;
        return this;
    };

    /**
     * Removes the element associated to the value.
     * Set.prototype.has(value) will return false afterwards.
     * @param  {Object} value
     * @return {this}
     */
    Set.prototype.delete = function(value)  {
        var index = this.indexOf(value);
        if (index > -1) {
            this.values.splice(index, 1);
            this.size--;
            this.sort();
        }
        return this;
    };

    /**
     * Check if the key exists within the set
     * @param  {String}  key
     * @return {Boolean}
     */
    Set.prototype.has = function(value) {
        return this.indexOf(value) !== -1;
    };

    /**
     * Perform a fast and sorted lookup
     * for the given key
     * @param  {String} key
     * @return {Number}
     */
    Set.prototype.indexOf = function(value) {
        var index = -1;
        this.forEach(function(iValue, i) {
            if (this.comparator(iValue) >= this.comparator(value)) {
                if (value === iValue) {
                    index = i;
                }
                return false; // return false to break
            }
        }, this);
        return index;
    };

    /**
     * Perform a fast and sorted lookup
     * for the given key
     * @param  {String} key
     * @return {Number}
     */
    Set.prototype.forEach = function(callbackFn, thisArg) {
        for (var i = 0, l = this.values.length; i < l; i++) {
            if (callbackFn.call(thisArg, this.values[i], i) === false) {
                break;
            }
        }
    };


    /**
     * Sort the values of the set
     * to optimise querying
     * @return {this}
     */
    Set.prototype.sort = function() {
        var that = this;
        this.values.sort(function(a, b) {
            var ca = that.comparator(a);
            var cb = that.comparator(b);
            if (a < b) return -1;
            if (a > b) return 1;
            return 0;
        });
        return this;
    };

    /**
     * Comparator used to filter and sort
     * the values of the set
     * @param  {Object} value
     * @return {Object}
     */
    Set.prototype.comparator = function(value) {
        return value;
    };

    /**
     * Return an array of the values
     * making up the set
     * @return {Array}
     */
    Set.prototype.toArray = function() {
        return this.values;
    };

    // Current version of the library. Keep in sync with `package.json`.
    Sibyl.VERSION = '0.0.1';

    Sibyl.Set = Set;

    return Sibyl;

}));