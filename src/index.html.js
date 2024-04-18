function generateHTML({env, jspath, csspath} = {}) {
  if (!env) {
    env = 'development';
  }

  if (!jspath) {
    jspath = 'index.js';
  }

  if (!csspath) {
    csspath = '/index.css';
  }

  return `\
<!doctype html>
<html lang="en">
    <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width,initial-scale=1"/>
        <title>playground</title>${
          env === 'development'
            ? `
        <script>
            new EventSource('/esbuild').addEventListener('change', () => {
                location.reload();
            });
        </script>`
            : ''
        }
        <link rel="stylesheet" type="text/css" href="${csspath[0]}"/>
        <link rel="stylesheet" type="text/css" href="${csspath[1]}"/>
    </head>
    <body>
        <noscript>You need to enable JavaScript to run this app.</noscript>
        <div id="app" class="app"></div>
        <script src="${jspath}"></script>
    </body>
</html>
`;
}

module.exports = {generateHTML};
exports.default = {generateHTML};
