const path = require('path');
const fs = require('fs');
const parser = require('./parser.js');

const prefix = '../../../../';
const cachePath = `${__dirname}/cache/`;
const depsPath = `${cachePath}/deps.js`;
const bootstrapPath = `${cachePath}/bootstrap.js`;


function closureFramework(files, emitter) {
  if (!fs.existsSync(cachePath)) {
    fs.mkdirSync(cachePath);
  }

  fs.writeFileSync(depsPath, '');
  fs.writeFileSync(bootstrapPath, '');

  files.push({
    pattern: depsPath,
    included: true,
    served: true,
    watched: false,
    nocache: true,
  });

  files.push({
    pattern: bootstrapPath,
    included: true,
    served: true,
    watched: false,
    nocache: true,
  });
}

closureFramework.$inject = ['config.files', 'emitter'];


function closurePreprocessor(files, logger) {
  const log = logger.create('closure');

  return (content, file, done) => {
    let data = fs.readFileSync(depsPath, 'utf8');

    const baseRelativePath = path.join(prefix, path.relative('.', file.path));

    // Remove any previous dependency declaration for this file
    const reStr = `\\n?\s*goog\.addDependency\\('(${baseRelativePath})'[^;]*;`;
    const re = new RegExp(reStr);

    if (re.test(data)) {
      data = data.replace(re, '');
      log.debug(`Updating in deps.js: ${baseRelativePath}`);
    } else {
      log.debug(`Writing in deps.js: ${baseRelativePath}`);
    }

    // Append new dependency declaration
    const depCmd = parser.getDependencyCommand(content, file.path, prefix);
    data += `\n${depCmd}`;
    fs.writeFileSync(depsPath, data);

    done(content);
  };
}

closurePreprocessor.$inject = ['config.files', 'logger'];


// Delay test initialisation until all modules are available
// https://groups.google.com/forum/#!msg/karma-users/XpEEuvCRdGc/K2Nxj1ACSl4J
function getBootstrapCode(modules) {
  const modulesStr = modules.reduce((acc, value) => {
    return acc += `    '${value}',\n`;
  }, '\n');

  const output = `// Bootstraping test modules
(function() {
  const testModules = [
    ${modulesStr}
  ];
  window.__karma__.loaded = function() {};
  goog.bootstrap(testModules, () => window.__karma__.start());
})();`;

  return output;
}


function closureBootstrapPreprocessor(files, logger) {
  const log = logger.create('closure');
  const testModules = [];


  return (content, file, done) => {
    const provides = parser.getProvides(content);
    const moduleOrNamespace = provides.length ?
        provides[0] :
        path.join(prefix, path.relative('.', file.path));

    // Prevent bootstrapping the same module twice
    if (testModules.indexOf(moduleOrNamespace) == -1) {
      testModules.push(moduleOrNamespace);
      fs.writeFileSync(bootstrapPath, getBootstrapCode(testModules));
      log.debug(`Bootstraping: ${moduleOrNamespace}`);
    }

    done(content);
  };
}

closureBootstrapPreprocessor.$inject = ['config.files', 'logger'];


module.exports = {
  closureFramework, closurePreprocessor, closureBootstrapPreprocessor
};
