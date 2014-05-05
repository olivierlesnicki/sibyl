// Set definition can be found at
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set

describe('Sibyl.Set', function() {

    it('returns the number of values in the Set object.', function() {
        var set = new Sibyl.Set;
        expect(set.size).toBeDefined();
        expect(set.size).toEqual(0);
    });

    it('appends a new element with the given value to the Set object.', function() {
        var set = new Sibyl.Set;
        set.add(1);
        expect(set.size).toEqual(1);
        expect(set.has(1)).toBe(true);
    });

    it('returns a boolean asserting whether an element is present with the given value in the Set object or not.', function() {
        var set = new Sibyl.Set;
        set.add(1);
        expect(set.has(1)).toBe(true);
        expect(set.has(2)).toBe(false);
    });

    it('removes the element associated to the value. Set.prototype.has(value) will return false afterwards.', function() {
        var set = new Sibyl.Set;
        set.add(1);
        set.add(2);
        set.add(3);
        set.delete(2);
        expect(set.has(1)).toBe(true);
        expect(set.has(2)).toBe(false);
        expect(set.has(3)).toBe(true);
    });

    it('calls callbackFn once for each value present in the Set object, in sorted order.', function() {
        var c = 0;
        var set = new Sibyl.Set;
        set.add(1);
        set.add(2);
        set.add(3);
        set.forEach(function() {
            c++;
        });
        expect(c).toBe(3);
    });

    it('returns a boolean asserting whether an element is present with the given value in the Set object or not.', function() {
        var set = new Sibyl.Set;
        expect(set.has(1)).toBe(false);
        set.add(1);
        expect(set.has(1)).toBe(true);
    });

    it('returns an array representation of the set.', function() {

        var set = new Sibyl.Set;
        set.add(1);
        set.add(2);
        set.add(3);

        var arr = set.toArray();
        expect(arr[0]).toBe(1);
        expect(arr[1]).toBe(2);
        expect(arr[2]).toBe(3);

    });

    it('does not let duplicates through', function() {

        var set = new Sibyl.Set;

        set.add(1);
        expect(set.size).toBe(1);

        set.add(1);
        expect(set.size).toBe(1);

    });

    it('does not let duplicate object through', function() {

        var set = new Sibyl.Set;
        set.comparator = function(obj) {
            return obj.name;
        }

        set.add({
            name: 'Olivier'
        });

        expect(set.size).toBe(1);

        set.add({
            name: 'Olivier'
        });

        expect(set.size).toBe(1);

    });

    it('returns the intersection of multiple sets', function() {

        var set1 = new Sibyl.Set([1, 2, 3]);
        var set2 = new Sibyl.Set([1, 2]);
        var set3 = new Sibyl.Set([1]);

        var set = Sibyl.Set.intersection(set1, set2, set3);

        expect(set.size).toBe(1);
        expect(set.has(1)).toBe(true);

    });


});
