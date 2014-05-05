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
     * A simple sorted collection implementation
     * to manage multiple Strings
     * @return {Collection}
     */
    var Collection = function() {
        this.models = [];
        return this;
    };

    /**
     * Add an object to the collection,
     * making sure it is unique
     * @param {Object} model
     * @return {Collection}
     */
    Collection.prototype.add = function(model) {
        var model = this.get(model);
        if (!model) {
            this.models.push(model);
            this.sort();
        }
        return model;
    };

    /**
     * Remove an object from the collection
     * @param {Object} model
     * @return {Collection}
     */
    Collection.prototype.remove = function(model) {
        var modelIndex = this.indexOf(model);
        if (modelIndex > -1) {
            this.models.splice(modelIndex, 1);
            this.sort();
        }
        return this;
    };

    /**
     * Retrieve an object from the collection
     * using its id
     * @param  {String} modelId
     * @return {Object}
     */
    Collection.prototype.get = function(model) {
        var model;
        for (var i = 0, l = this.models.length; i < l; i++) {
            // break if id has been matched or passed
            if (this.models[i] >= model) {
                if (this.models[i] === model) {
                    model = this.models[i];
                }
                break;
            }
        }
        return model;
    };

    /** 
     * Iterate through each object of the collection
     * firing the _callback with the given context
     * @param  {Function} _callback
     * @param  {Object} context
     * @return {Collection}
     */
    Collection.prototype.each = function(_callback, context) {
        context = context || this;
        for (var i = 0, l = this.models.length; i < l; i++) {
            _callback(this.models[i], i).bind(context);
        }
        return this;
    };

    /**
     * Sort the collection, to accelerate get/remove
     * operations
     * @return {Object}
     */
    Collection.prototype.sort = function() {
        this.models.sort(this.comparator);
        return this;
    };

    /**
     * Comparator used to sort the collection
     * @return {Object}
     */
    Collection.prototype.comparator = function(a, b) {
        if (a[0] < b[0]) return -1;
        if (a[0] > b[0]) return 1;
        return 0;
    };

    /** 
     * Returns the index of the passed in model
     * within the collection
     * @param  {String} modelId
     * @return {Object}
     */
    Collection.prototype.indexOf = function(model) {
        var index = -1;
        for (var i = 0, l = this.models.length; i < l; i++) {
            // break if id has been matched or passed
            if (this.models[i] >= model) {
                if (this.models[i] === model) {
                    index = i;
                }
                break;
            }
        }
        return index;
    };

    /**
     * Return the collection size
     * @return {Number}
     */
    Collection.prototype.size = function() {
        return this.models.length;
    };

    /**
     * An entity able to like and dislike items
     * @param {Sibyl} sibylInstance
     * @param {String} userId
     */
    var User = function(sibylInstance, userId) {

        // store a reference to the sibyl Instance
        this.sibyl = sibylInstance;

        // assign a unique id to the user instance
        this.id = userId;

        // create array to store references
        // to items liked and disliked by
        // this user instance
        this.likedItems = new Collection;
        this.dislikedItems = new Collection;
        this.ratedBy = new Collection;

        return this;

    };

    /**
     * Like a given item, if the item hasn't
     * been registered yet it will also registers it
     * @param  {String} itemId
     * @return {User}
     */
    User.prototype.like = function(itemId) {

        var item;

        item = this.sibyl.addItem(itemId);

        // make sure the user doesn't both like and dislike the item
        this.dislikedItems.remove(itemId);
        item.dislikedByUsers.remove(this);

        // register the like
        this.likedItems.add(item);
        item.likedByUsers.add(this);

        return this;

    };

    /**
     * Dislike a given item, if the item hasn't
     * been registered yet it will also registers it
     * @param  {String} itemId
     * @return {User}
     */
    User.prototype.dislike = function(itemId) {

        var item;

        item = this.sibyl.addItem(itemId);

        // make sure the user doesn't both like and dislike the item
        this.likedItems.remove(itemId);
        item.likedByUsersItems.remove(this);

        // register the dislike
        this.dislikedItems.add(item);
        item.dislikedByUsers.add(this);

        return this;

    };

    /**
     * Determine the Jaccard index of similarity
     * between current user instance and an other
     * @param  {User} user
     * @return {Number}
     */
    User.prototype.similarityWith = function(user) {

        var agreements,
            disagreements,
            total;

        // number of likes and dislikes in common
        agreements = _.intersection(this.likedItems, user.likedItems).length;
        agreements += _.intersection(this.dislikedItems, user.dislikedItems).length;

        // number of likes and dislikes not in common
        disagreements = _.intersection(this.likedItems, user.dislikedItems).length;
        disagreements += _.intersection(this.dislikedItems, user.likedItems).length;

        total = _.union(this.dislikedItems, user.dislikedItems, this.likedItems, user.likedItems).length;

        return (agreements - disagreements) / total;

    };

    User.prototype.predictionFor = function(item) {

        var hiveMindSum = 0.0;

        item.likedByUsers.each(function(user) {
            hiveMindSum += this.similarityWith(user);
        }, this);

        item.dislikedByUsers.each(function(user) {
            hiveMindSum -= this.similarityWith(user);
        }, this);

        return hiveMindSum / (item.likedByUsers.size() + item.dislikedByUsers.size());

    };

    /**
     * An entity able to be liked or disliked by users
     * @param {Sibyl} sibylInstance
     * @param {String} userId
     */
    var Item = function(sibylInstance, itemId) {

        // store a reference to the sibyl Instance
        this.sibyl = sibylInstance;

        // assign a unique id to the user instance
        this.id = itemId;

        // create array to store references
        // to users who liked and disliked
        // this item instance
        this.likedByUsers = new Collection;
        this.dislikedByUsers = new Collection;

        return this;

    };

    Sibyl = function() {
        this.items = [];
        this.users = [];
    };

    Sibyl.prototype.addUser = function(userId) {
        var user = new User(this, userId);
        this.users.push(user);
        return user;
    };

    Sibyl.prototype.getUser = function(userId) {
        var user;
        for (var i = 0, l = this.users.length; i < l; i++) {
            if (this.users[i].id === userId) {
                user = this.users[i];
                break;
            }
        }
        return user;
    };

    Sibyl.prototype.addItem = function(itemId) {
        var item = new Item(this, itemId);
        this.items.push(item);
        return item;
    };

    Sibyl.prototype.getItem = function(itemId) {
        var item;
        for (var i = 0, l = this.items.length; i < l; i++) {
            if (this.items[i].id === itemId) {
                item = this.items[i];
                break;
            }
        }
        return item;
    };

    // Current version of the library. Keep in sync with `package.json`.
    Sibyl.VERSION = '0.0.1';

    Sibyl.Collection = Collection;
    Sibyl.Item = Item;
    Sibyl.User = User;

    return Sibyl;

}));
