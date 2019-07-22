#!/usr/bin/env node

// eslint-disable-next-line @typescript-eslint/no-var-requires
const yParser = require('yargs-parser');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { join } = require('path');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { existsSync } = require('fs');

function checkVersion() {
  const nodeVersion = process.versions.node;
  const versions = nodeVersion.split('.');
  const major = versions[0];
  const minor = versions[1];
  if (major * 10 + minor * 1 < 65) {
    // eslint-disable-next-line no-console
    console.log(`Node version must >= 6.5, but got ${major}.${minor}`);
    process.exit(1);
  }
}
function getArgv() {
  const argv = yParser(process.argv.slice(2));
  const [url] = argv._;
  return url;
}
function getParams() {
  let config = {
    dataSource: '',
  };
  const path = join(process.cwd(), '.miladyrc.js');
  if (existsSync(path)) {
    try {
      // eslint-disable-next-line  global-require,import/no-dynamic-require
      config = require(path).default;
    } catch (error) {
      console.log(error);
    }
  }
  config.dataSource = getArgv() ? getArgv() : config.dataSource;
  return config;
}
checkVersion();
const milady = require('../lib/index').default;

milady(getParams());
