module.exports = {
  apps: [
    {
      name: "api",
      script: "./build/core/api.js",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "indexer",
      script: "./build/core/indexer.js",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
