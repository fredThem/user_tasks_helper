# User Tasks Helper

This is an embryonic beta project.

The goal is to make a library of Visual Studio code Tasks automate jobs tasks, like linting, building, packaging, testing, or deploying, inside and outside the inner software development loop (edit, compile, test, and debug).

## Installation

### [User|Workspace] Tasks

```sh
npm install -g user_task_helpers
```

Link a global task to tasks this

```json
{
  // See https://go.microsoft.com/fwlink/?LinkId=733558
  // for the documentation about the tasks.json format

// <RELATIVE-PATH-TO> : Point task command to global package install.
// TODO: convert to script

  "version": "2.0.0",
  "tasks": [
    {...}
    {
      "label": "beta-syntax-generator",
      "type": "shell",
      "command": "node --trace-warnings ../../<RELATIVE-PATH-TO-GLOBAL>/node_modules/user_task_helpers/beta-syntax-generator.js
 ${fileWorkspaceFolder} $(git -C ${fileWorkspaceFolder} rev-parse --abbrev-ref HEAD)",
      "presentation": {
        "reveal": "always",
        "focus": true,
        "clear": true
      },
      "problemMatcher": ["$tsc"]
    },
    {...}
  ]
}
```

---

## Documentation

- Check out the VS Code documentation: [Integrate with External Tools via Tasks](https://code.visualstudio.com/docs/editor/tasks).
- Schema for tasks.json: [Appendix](https://code.visualstudio.com/docs/editor/tasks-appendix)

## Contributing Guide

### Tasks scope

- Be generic enough to be defined at [User|Workspace|Project] level.
- Run _scripts_ in [user_task_helpers/package.json] and pass arguments.
- Engage in descriptive and interactive menus.
- Link to Task specific usage documentation.
- Affect only tracked files (git) and can be reverted.
- Process state should be terminated when task is finished or rerunned.
- Use verbose logs and debug output.

---

> 🏗 You can improve it by sending pull requests to [this repository](https://github.com/fredThem/user_tasks_helper).
