sibyl
=====

A recommendation engine using likes and dislikes for JavaScript applications. The engine uses the Jaccard similarity coefficient to compare the similarity and diversity of sample sets and largely inspired by [davidcel's article](http://davidcel.is/blog/2012/02/07/collaborative-filtering-with-likes-and-dislikes/);

Install
-------

Sibyl can be installed through npm
```javascript
npm install sibyl
```

It can also be installed through npm
```javascript
bower install sibyl
```

Usage
-----

```javascript

var sibyl = new Sibyl;

// register likes and dislikes

sibyl.recordLike('someone', 'The Matrix');
sibyl.recordLike('someone', 'The Wolf Of Wall Street');
sibyl.recordLike('someone', 'Bad Boys');

sibyl.recordDislike('someoneelse', 'The Matrix');
sibyl.recordDislike('someoneelse', 'The Wolf Of Wall Street');
sibyl.recordDislike('someoneelse', 'Bad Boys');

sibyl.recordLike('me', 'The Matrix');

// obtain some results and predictions

sibyl.getSimilarityBetween('me', 'someone'); // 1/3
sibyl.getSimilarityBetween('me', 'someoneelse'); // -1/3
sibyl.getSimilarityBetween('someone', 'someoneelse'); // -1

sibyl.getPrediction('me', 'The Wolf Of Wall Street'); // 1/3

sibyl.getSuggestion('me'); // ['The Wolf Of Wall Street', 'Bad Boys']

```