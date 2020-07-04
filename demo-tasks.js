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
