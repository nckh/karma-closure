const path = require('path');

const provideRegex = /^\s*goog\.(?:provide|module)(?:\.declareNamespace)?\(\s*['"]([^'"]+)['"]\s*\)/gm;
const requireRegex = /^\s*(?:(?:var|let|const)\s*[^=]*\s*=\s*)?goog\.require\(['"]([^'"]*)['"]\)/gm;
const es6ImportRegex = /^\s*import\s{?\s*?[a-zA-Z_$][\w$,\s]*}?\sfrom\s(?:'|")([\w-_./]+)(?:'|")/gm;
const closureScriptRegex = /^\s*goog\.provide\(\s*['"](?:.+?)['"]\s*\)/m;
const closureModuleRegex = /^\s*goog\.module\(\s*['"](?:.+?)['"]\s*\)/m;
const es6ModuleRegex = /^\s*(?:import|export)\s/m;

function getMatches(regex, content) {
  const output = [];
  let match;
  while (match = regex.exec(content)) {
    output.push(match[1]);
  }
  return output;
}

function getProvides(content) {
  return getMatches(provideRegex, content);
}

function getRequires(content) {
  const requires = [
    getClosureRequires(content),
    getEs6Imports(content),
  ];

  return [].concat(...requires);
}

function getClosureRequires(content) {
  return getMatches(requireRegex, content);
}

function getEs6Imports(content) {
  return getMatches(es6ImportRegex, content);
}

function getLoadFlags(content) {
  if (closureScriptRegex.test(content)) {
    return false;
  } else if (closureModuleRegex.test(content)) {
    return {module: 'goog'};
  } else {
    return {module: 'es6'};
  }
}

function getDependencyCommand(content, filePath, prefix) {
  const baseRelativePath = path.join(prefix, path.relative('.', filePath));
  let provides = getProvides(content);
  if (!provides.length) {
    provides = [baseRelativePath];
  }

  const closureRequires = getClosureRequires(content);

  const es6Imports = getEs6Imports(content).map((depPath) => {
    const depAbsPath = path.join(path.dirname(filePath), depPath);
    return path.join(prefix, path.relative('', depAbsPath));
  });

  const requires = [].concat(...closureRequires, ...es6Imports);
  const loadFlags = getLoadFlags(content);

  const pathStr = JSON.stringify(baseRelativePath);
  const providesStr = JSON.stringify(provides);
  const requiresStr = JSON.stringify(requires);
  const loadFlagsStr = JSON.stringify(loadFlags);

  let depCmd = `goog.addDependency(${pathStr}, ${providesStr}, ` +
      `${requiresStr}, ${loadFlagsStr});`;

  depCmd = depCmd.replace(/"/g, '\'');
  return depCmd;
}

module.exports = {
  getProvides, getRequires, getClosureRequires, getEs6Imports, getLoadFlags,
  getDependencyCommand,
};
