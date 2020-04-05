# babel-plugin-loop-optimizer

Optimizes `.forEach`, `.every`, `.find`, `.map`, `.filter`, `.reduce`, `.reduceRight`, `.some` statements to `for` statements
Arrow Expressions and inline functions are also altered to implement functionality directly in the loop, removing the need to craft and then invoke a function.
Returns, for the most part, are changed into a combination of assignments and either continues; or breaks;
Loops are conditonally labeled if required for altering a function.
Also, ternary and logical operations are supported (`logicCheck() ? map : null` or `logicCheck() && map`).  An if statement will be inserted before the loop (`if(logicCheck())`), based on what needs to be evaluated.
Because of this, ternary and logical operations should not have side effects, nor should they be computationally expensive (since they essentially need to be evaluated at least twice).
Unlike the original babel-plugin-loop-optimizer, by default, for loops are evaluted from left-to-right. A comment of `//loop-optimizer: AGGRO` will use the more aggressive `while(iterator--)` methodology.
This hasn't been posted to NPM yet.  I'm not sure what I'll do with this project.  The idea is to use it with JSX, where many renders with `.map` invocations can be optimized, especially for older browsers or node environments.
The `lib_4-5-2020_index.js` is provided, if you want to use it in your project.

#### Example benchmark output, based on Faster.js' benchmark
```bash
$ npm run bench

    array-every small
    ✓ native x 37,315,337 ops/sec ±2.60% (23 runs sampled)
    ✓ loopOptimizer x 38,812,226 ops/sec ±0.21% (23 runs sampled)
loopOptimizer is 4.0% faster (0.001μs) than native

  array-every medium
    ✓ native x 24,623,867 ops/sec ±0.36% (21 runs sampled)
    ✓ loopOptimizer x 25,937,559 ops/sec ±0.42% (22 runs sampled)
loopOptimizer is 5.3% faster (0.002μs) than native

  array-every large
    ✓ native x 22,135,948 ops/sec ±0.48% (22 runs sampled)
    ✓ loopOptimizer x 24,276,020 ops/sec ±0.22% (22 runs sampled)
loopOptimizer is 9.7% faster (0.004μs) than native

  array-filter small
    ✓ native x 24,574,208 ops/sec ±4.23% (23 runs sampled)
    ✓ loopOptimizer x 25,505,463 ops/sec ±5.35% (20 runs sampled)
loopOptimizer is 3.8% faster (0.001μs) than native

  array-filter medium
    ✓ native x 8,401,076 ops/sec ±6.72% (21 runs sampled)
    ✓ loopOptimizer x 9,711,315 ops/sec ±7.62% (22 runs sampled)
loopOptimizer is 15.6% faster (0.016μs) than native

  array-filter large
    ✓ native x 901,668 ops/sec ±3.18% (22 runs sampled)
    ✓ loopOptimizer x 1,119,163 ops/sec ±5.01% (23 runs sampled)
loopOptimizer is 24.1% faster (0.216μs) than native

  array-forEach small
    ✓ native x 17,466,552 ops/sec ±7.12% (20 runs sampled)
    ✓ loopOptimizer x 20,589,787 ops/sec ±5.70% (20 runs sampled)
loopOptimizer is 17.9% faster (0.009μs) than native

  array-forEach medium
    ✓ native x 3,463,584 ops/sec ±7.56% (20 runs sampled)
    ✓ loopOptimizer x 3,705,916 ops/sec ±6.35% (21 runs sampled)
loopOptimizer is 7.0% faster (0.019μs) than native

  array-forEach large
    ✓ native x 278,749 ops/sec ±21.37% (17 runs sampled)
    ✓ loopOptimizer x 315,629 ops/sec ±33.02% (20 runs sampled)
loopOptimizer is 13.2% faster (0.419μs) than native

  array-map small
    ✓ native x 9,420,233 ops/sec ±4.44% (19 runs sampled)
    ✓ loopOptimizer x 33,183,281 ops/sec ±5.57% (22 runs sampled)
loopOptimizer is 252.3% faster (0.076μs) than native

  array-map medium
    ✓ native x 5,013,457 ops/sec ±0.80% (22 runs sampled)
    ✓ loopOptimizer x 12,792,167 ops/sec ±7.30% (21 runs sampled)
loopOptimizer is 155.2% faster (0.121μs) than native

  array-map large
    ✓ native x 925,164 ops/sec ±3.99% (22 runs sampled)
    ✓ loopOptimizer x 1,911,779 ops/sec ±3.35% (22 runs sampled)
loopOptimizer is 106.6% faster (0.558μs) than native

  array-reduce small
    ✓ native x 37,610,932 ops/sec ±0.20% (22 runs sampled)
    ✓ loopOptimizer x 40,082,314 ops/sec ±0.84% (23 runs sampled)
loopOptimizer is 6.6% faster (0.002μs) than native

  array-reduce medium
    ✓ native x 15,253,030 ops/sec ±7.09% (21 runs sampled)
    ✓ loopOptimizer x 18,676,404 ops/sec ±0.14% (18 runs sampled)
loopOptimizer is 22.4% faster (0.012μs) than native

  array-reduce large
    ✓ native x 2,087,176 ops/sec ±0.13% (23 runs sampled)
    ✓ loopOptimizer x 2,115,062 ops/sec ±0.23% (23 runs sampled)
loopOptimizer is 1.3% faster (0.006μs) than native

  array-reduceRight small
    ✓ native x 35,768,410 ops/sec ±5.84% (22 runs sampled)
    ✓ loopOptimizer x 38,743,982 ops/sec ±0.25% (21 runs sampled)
loopOptimizer is 8.3% faster (0.002μs) than native

  array-reduceRight medium
    ✓ native x 16,103,549 ops/sec ±0.26% (22 runs sampled)
    ✓ loopOptimizer x 16,352,026 ops/sec ±0.11% (22 runs sampled)
loopOptimizer is 1.5% faster (0.001μs) than native

  array-reduceRight large
    ✓ native x 384,846 ops/sec ±117.26% (20 runs sampled)
    ✓ loopOptimizer x 2,075,712 ops/sec ±0.37% (20 runs sampled)
loopOptimizer is 439.4% faster (2.117μs) than native

  array-some small
    ✓ native x 37,360,221 ops/sec ±1.88% (22 runs sampled)
    ✓ loopOptimizer x 38,720,416 ops/sec ±0.23% (21 runs sampled)
loopOptimizer is 3.6% faster (0.001μs) than native

  array-some medium
    ✓ native x 23,660,916 ops/sec ±0.57% (21 runs sampled)
    ✓ loopOptimizer x 26,117,993 ops/sec ±0.18% (21 runs sampled)
loopOptimizer is 10.4% faster (0.004μs) than native

  array-some large
    ✓ native x 21,642,697 ops/sec ±0.28% (23 runs sampled)
    ✓ loopOptimizer x 23,952,225 ops/sec ±1.25% (22 runs sampled)
loopOptimizer is 10.7% faster (0.004μs) than native
```

The benchmark example above was run on Node 12, unlike Faster.js which reports findings from Node 8. I believe this project can offer vastly greater performance benefits to older runtime environments (IE, Node 8, etc).
The rest of the README is leftover from the original project, except for the benchmark output. Once again, this project currently is not on NPM, but the lib_4-5-2020_index.js file is provided as a build to use.

## Installation

```sh
$ npm install babel-plugin-loop-optimizer
```

## Usage

### Via `.babelrc` (Recommended)

**.babelrc**

```json
{
  "plugins": ["babel-plugin-loop-optimizer"]
}
```

### Via CLI

```sh
$ babel --plugins loop-optimizer script.js
```

### Via Node API

```js
require('babel').transform('code', {
  plugins: ['loop-optimizer']
});
```

## Bugs?

Now you may say "wait, wait, wait!" This optimizes on things that aren't just arrays! My `map#forEach` is optimized too! To fix this, add a comment that says `// O: KEEP` right before the line on which you use some optimized function. Examples:

```js
var m = new Map();
// loop-optimizer: KEEP
m.forEach(f)
```

or:

```js
var s = new Set();
// loop-optimizer: KEEP
for (var i = 0; i < 5; s.forEach(f)) {
    // ...
}
```

This is required since it is not possible to determine an object's type at compile-time.

Also, if you don't want reverse order, you can disable this (optimization) behavior by adding comment `// loop-optimizer: FORWARD` right before the line on which you use some optimized function. Example:
```js
let ar = [1, 2, 3]
// loop-optimizer: FORWARD
ar.forEach(console.log)
```

## Example

```js
function timesTwo(arr) {
	return arr.map(n => n * 2);
}
```
to:
```js
function timesTwo(arr) {
    let _a = arr;
    let _f = n => n * 2;
    let _r = [];

    for (let _i = _a.length; _i--;)
        _r.push(_f(_a[_i], _i, _a));

    return _r;
}
```

---

If you need any other help, don't hesitate to leave an issue
