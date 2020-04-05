const benchmark = require('benchmark');
const path = require('path');
const fs = require('fs');
const commandLineArgs = require('command-line-args');
const transform = require('@babel/core').transform;

const fasterjs = require('../lib').default;
const utils = require('./utils');

const options = commandLineArgs([{
	name: 'benchmarks',
	alias: 'b',
	type: String,
	multiple: true,
	description: 'The benchmarks to run. If not supplied, all benchmarks will be run.',
}, {
	name: 'timeout',
	alias: 't',
	type: Number,
	description: 'The max time allowed per test.',
}]);

benchmark.options.maxTime = options.timeout || 3;
benchmark.options.onAbort = event => console.error(event.currentTarget.error);

function wrap(source) {
	return (new Function('utils', source)).bind(null, utils);
}

function runBenchmarks(title, nativeSource, compiledSource) {
	const suite = new benchmark.Suite();

	suite.add('native', wrap(nativeSource));
	suite.add('loopOptimizer', wrap(compiledSource));

	suite.on('start', () => console.log('  ' + title));
	suite.on('cycle', event => console.log("    ✓ " + event.target));
	suite.on('complete', function() {
		let slowest = this.filter('slowest')[0];
		let fastest = this.filter('fastest')[0];
		if(fastest.hz < slowest.hz) { // bug fix...
			console.log("Report of slowest and fastest was erroneous...");
			const t = fastest;
			fastest = slowest;
			slowest = t;
		}
		const microsecDelta = ((1000000 / slowest.hz) - (1000000 / fastest.hz)).toFixed(3);
		const percentFaster = (100 * (fastest.hz - slowest.hz) / slowest.hz).toFixed(1);
		console.log(fastest.name + ' is ' + percentFaster + '% faster (' + microsecDelta + 'μs) than ' + slowest.name + '\n');
	});

	suite.run();
}

const nativeDir = path.join(__dirname, 'src');

const fileNames = fs.readdirSync(nativeDir)
	.filter(file => file[0] !== '.')
	.map(f => f.replace('.js', ''))
	.filter(f => !options.benchmarks || options.benchmarks.includes(f));

const nativeSources = fileNames.map(f => fs.readFileSync(path.join(nativeDir, f + '.js'), 'utf8'));
const compiledSources = nativeSources.map(s => transform(s, { babelrc: false, plugins: [fasterjs] }).code);

fileNames.forEach((f, i) => {
	[
		{ name: 'small', ARRAY_SIZE: "'small'" },
		{ name: 'medium', ARRAY_SIZE: "'medium'" },
		{ name: 'large', ARRAY_SIZE: "'large'" },
	].forEach(options => {
		let nativeSource = nativeSources[i];
		let compiledSource = compiledSources[i];

		for (const key in options) {
			if (key !== 'name') {
				nativeSource = nativeSource.replace(key, options[key]);
				compiledSource = compiledSource.replace(key, options[key]);
			}
		}
		runBenchmarks(fileNames[i] + ' ' + options.name, nativeSource, compiledSource);
	});
});
