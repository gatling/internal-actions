# New action

```
internal-actions/
├── .github/
│   └── workflows/
│       ├── build-<action_name>.yml
│       └── release.yml 
├── <action_name>/
│   ├── src/
│   │   └── index.ts
│   ├── action.yml
│   └── package.json
└── README.md
```

* A directory named from your action
  * containing the `action.yml` (needed by GitHub)
  * containing a `package.json` with a build command
    * `npm ci && npm run build` should create a dist directory containing the bundled version of your action
* A mention in the `README.md` (keep it short, you should have an extensive `README.md` in your own directory)
* Add a workflow `compile-<action_name>.yml`
* Add your `<action_name>` in the list of available inputs in `release.yml`
