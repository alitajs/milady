#!/usr/bin/env node

// eslint-disable-next-line @typescript-eslint/no-var-requires
const yParser = require('yargs-parser');

const argv = yParser(process.argv.slice(2));
const [url] = argv._;
const nodeVersion = process.versions.node;
const versions = nodeVersion.split('.');
const major = versions[0];
const minor = versions[1];

if (major * 10 + minor * 1 < 65) {
  // eslint-disable-next-line no-console
  console.log(`Node version must >= 6.5, but got ${major}.${minor}`);
  process.exit(1);
}

const codegen = require('../lib/index').default;

codegen(url, argv);
