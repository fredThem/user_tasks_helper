# User Tasks Helper
## Installation

```json
{
  // See https://go.microsoft.com/fwlink/?LinkId=733558
  // for the documentation about the tasks.json format
  "version": "2.0.0",
  "tasks": [
    {...}
    {
      "label": "beta-syntax-generator",
      "type": "shell",
      "command": "node --trace-warnings ../../RELATIVE/PATH/TO/user_tasks_helper/beta-syntax-generator.js ${fileWorkspaceFolder} $(git -C ${fileWorkspaceFolder} rev-parse --abbrev-ref HEAD)",
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
