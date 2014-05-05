describe('Sibyl', function() {

    it('records like actions.', function() {
        var s = new Sibyl;
        expect(s.recordLike).toBeDefined();
        s.recordLike('olivier', 1);
    });

    it('records dislike actions.', function() {
        var s = new Sibyl;
        expect(s.recordDislike).toBeDefined();
        s.recordDislike('olivier', 1);
    });

    it('evaluates similarities between users', function() {

        var s = new Sibyl;

        s.recordLike('olivier', 1);
        s.recordLike('audrey', 1);

        expect(s.getSimilarityBetween('olivier', 'audrey')).toBe(1);

        s.recordLike('audrey', 2);

        expect(s.getSimilarityBetween('olivier', 'audrey')).toBe(0.5);

        s.recordLike('audrey', 3);

        expect(s.getSimilarityBetween('olivier', 'audrey')).toBe(1 / 3);

        s.recordDislike('audrey', 1);

        expect(s.getSimilarityBetween('olivier', 'audrey')).toBe(-1 / 3);


    });


    it('predicts how likely a user is going to like an item', function() {

        var s = new Sibyl;

        s.recordLike('olivier', 1);
        s.recordLike('audrey', 1);
        s.recordLike('audrey', 2);

        expect(s.getPrediction('olivier', 2)).toBe(.5);

        s.recordLike('olivier', 3);
        s.recordLike('audrey', 3);

        expect(s.getPrediction('olivier', 2)).toBe(2 / 3);

        s.recordLike('olivier', 4);
        s.recordLike('audrey', 4);

        expect(s.getPrediction('olivier', 2)).toBe(3 / 4);

        s.recordDislike('audrey', 4);

        expect(s.getPrediction('olivier', 2)).toBe(1 / 4);


    });


});
