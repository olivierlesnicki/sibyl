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

    function Set(initialValues) {

        this.size = 0;
        this.values = [];

        if (_.isArray(initialValues)) {
            for (var i = 0, l = initialValues.length; i < l; i++) {
                this.add(initialValues[i]);
            }
        }

        return this;

    }

    /**
     * Compute the intersection between
     * an infinite number of sets
     * @return {Set}
     */
    Set.intersection = function() {
        var set = new Set;
        var sets = arguments;
        sets[0].forEach(function(value) {
            var exists = true;
            for (var i = 1, l = sets.length; i < l; i++) {
                if (!sets[i].has(value)) {
                    exists = false;
                }
            }
            if (exists) {
                set.add(value);
            }
        });
        return set;
    };

    /**
     * Compute the union between
     * an infinite number of sets
     * @return {Set}
     */
    Set.union = function() {
        var set = new Set;
        var sets = arguments;
        for (var i = 1, l = sets.length; i < l; i++) {
            sets[i].forEach(function(value) {
                set.add(value);
            });
        }
        return set;
    };

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
                if (_.isEqual(value, iValue)) {
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

    Sibyl = function() {
        this.users = {};
        this.items = {};
    };

    Sibyl.prototype.recordLike = function(user, item) {

        if (!this.users[user]) {
            this.users[user] = {};
            this.users[user].likes = new Set;
            this.users[user].dislikes = new Set;
        }

        if (!this.items[item]) {
            this.items[item] = {};
            this.items[item].likedBy = new Set;
            this.items[item].dislikedBy = new Set;
        }

        this.users[user].likes.add(item);
        this.users[user].dislikes.delete(item);

        this.items[item].likedBy.add(user);
        this.items[item].dislikedBy.delete(user);

        return this;

    };

    Sibyl.prototype.recordDislike = function(user, item) {

        if (!this.users[user]) {
            this.users[user] = {};
            this.users[user].likes = new Set;
            this.users[user].dislikes = new Set;
        }

        if (!this.items[item]) {
            this.items[item] = {};
            this.items[item].likedBy = new Set;
            this.items[item].dislikedBy = new Set;
        }

        this.users[user].dislikes.add(item);
        this.users[user].likes.delete(item);

        this.items[item].dislikedBy.add(user);
        this.items[item].likedBy.delete(user);

        return this;

    };

    Sibyl.prototype.getSimilarityBetween = function(firstUserId, secondUserId) {

        var agreements,
            disagreements,
            total,
            firstUser,
            secondUser;

        firstUser = this.users[firstUserId];
        secondUser = this.users[secondUserId];

        // number of likes and dislikes in common
        agreements = Set.intersection(firstUser.likes, secondUser.likes).size;
        agreements += Set.intersection(firstUser.dislikes, secondUser.dislikes).size;

        // number of likes and dislikes not in common
        disagreements = Set.intersection(firstUser.likes, secondUser.dislikes).size;
        disagreements += Set.intersection(firstUser.dislikes, secondUser.likes).size;

        total = Set.union(firstUser.likes, firstUser.dislikes, secondUser.likes, secondUser.dislikes).size;

        return (agreements - disagreements) / total;

    };

    Sibyl.prototype.getPrediction = function(userId, itemId) {

        var hiveMindSum,
            ratedBy,
            user,
            item;

        user = this.users[userId];
        item = this.items[itemId];

        hiveMindSum = 0.0;
        ratedBy = item.likedBy.size + item.dislikedBy.size;

        item.likedBy.forEach(function(raterId) {
            hiveMindSum += this.getSimilarityBetween(userId, raterId);
        }, this);

        item.dislikedBy.forEach(function(raterId) {
            hiveMindSum -= this.getSimilarityBetween(userId, raterId);
        }, this);

        return hiveMindSum / ratedBy;

    };

    // Current version of the library. Keep in sync with `package.json`.
    Sibyl.VERSION = '0.0.1';

    Sibyl.Set = Set;

    return Sibyl;

}));
