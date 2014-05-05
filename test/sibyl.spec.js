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

    it('handles multiple users likes and dislikes', function() {

        var sibyl = new Sibyl;

        sibyl.recordLike('someone', 'The Matrix');
        sibyl.recordLike('someone', 'The Wolf Of Wall Street');
        sibyl.recordLike('someone', 'Bad Boys');

        sibyl.recordDislike('someoneelse', 'The Matrix');
        sibyl.recordDislike('someoneelse', 'The Wolf Of Wall Street');
        sibyl.recordDislike('someoneelse', 'Bad Boys');

        sibyl.recordLike('me', 'The Matrix');

        expect(sibyl.getSimilarityBetween('me', 'someone')).toBe(1 / 3);
        expect(sibyl.getSimilarityBetween('me', 'someoneelse')).toBe(-1 / 3);
        expect(sibyl.getSimilarityBetween('someone', 'someoneelse')).toBe(-1);

        expect(sibyl.getPrediction('me', 'The Wolf Of Wall Street')).toBe(1 / 3);

        expect(sibyl.getSuggestion('me')[0]).toBe('The Wolf Of Wall Street');

    })


});
