console.log('jdasdjkljkkl')
var chalk = require('chalk')
console.log('1')
var semver = require('semver')
console.log('2')
var packageConfig = require('../package.json')
console.log('3')
var shell = require('shelljs')
console.log('4')
function exec (cmd) {
  return require('child_process').execSync(cmd).toString().trim()
}

var versionRequirements = [
  {
    name: 'node',
    currentVersion: semver.clean(process.version),
    versionRequirement: packageConfig.engines.node
  },
]
console.log('5')
if (shell.which('npm')) {
  // versionRequirements.push({
  //   name: 'npm',
  //   currentVersion: exec('npm --version'),
  //   versionRequirement: packageConfig.engines.npm
  // })
}
console.log('6')

module.exports = function () {
  console.log('8989989')
  console.log(versionRequirements)
  var warnings = []
  for (var i = 0; i < versionRequirements.length; i++) {
    var mod = versionRequirements[i]
    if (!semver.satisfies(mod.currentVersion, mod.versionRequirement)) {
      warnings.push(mod.name + ': ' +
        chalk.red(mod.currentVersion) + ' should be ' +
        chalk.green(mod.versionRequirement)
      )
    }
  }

  if (warnings.length) {
    console.log('')
    console.log(chalk.yellow('To use this template, you must update following to modules:'))
    console.log()
    for (var i = 0; i < warnings.length; i++) {
      var warning = warnings[i]
      console.log('  ' + warning)
    }
    console.log()
    process.exit(1)
  }
}
