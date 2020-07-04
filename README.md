# Multipush

Synchronize files across repositories.

## What is Multipush?

1. synchronize config files like editorconfig, issue templates, linter options etc.
1. synchronize a specific field in your JSON or YAML files
1. synchronize sections of text files like docs, readme or license

## How to use

Multipush can run locally as a one-off job or you can run it continuously in your CI or GitHub Actions.

### Define tasks

Create a JavaScript file where you define **projects** and **tasks**. File must export a plain Object like so:

```js
// multipush-tasks.js
const projects = [
  {
    target: 'JackuB/goof', // See Targets & Connectors section in docs
    // Optional `properties` field for custom rules
    properties: {
      lang: 'java',
    },
  },
  {
    target: 'JackuB/java-goof',
    properties: {
      lang: 'js',
    },
  },
];

const tasks = [
  {
    name: 'Synchronize contributing guidelines',
    projects,
    files: {
      '.github/CONTRIBUTING.md': 'Contributing guidelines', // You can read a file with fs
    },
  },
  {
    name: 'Use same .prettierrc.json for JS projects',
    projects: projects.filter((p) => p.properties.lang === 'js'),
    files: {
      '.prettierrc.json': '{"singleQuote": true}',
    },
  },
];

// You need to export the task object
module.exports = tasks;
```

Then run multipush with `npx` or a script:

```
npx multipush multipush-tasks.js
```

## Todo:

- [ ] dry run option
- [ ] add library for option parsing
- [ ] custom commit branch
- [ ] remove dependency on `gh`
- [ ] option to (not) open a PR
- [ ] option to modify commit message
- [ ] create a demo (console.log) connector and document contributing them connectors
- [ ] get a markdown templating working
- [ ] get a logo/visual for readme

### Possible targets:

- [x] https://github.com/JackuB/goof
- [ ] JackuB/goof (default to github)
- [ ] https://github.com/JackuB/goof.git
- [ ] handle unknown or unreachable target
