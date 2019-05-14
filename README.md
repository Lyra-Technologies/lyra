<p align="center">
  <img width="50" src="src/assets/lyra_chrome_logo_med.png">
  <h1 align="center">Lyra (alpha) </h1>
</p>

[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/Lyra-Technologies/lyra/issues)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/Lyra-Technologies/lyra/pulls)

<h2>How it works</h2>

Download Lyra from the Chrome Web Store and open the extension on the tab that hosts an Apollo Client application. **Note**: you must have the Apollo Client Devtools installed and activated before using Lyra, as the latter relies on data supplied by the Apollo Client Devtool’s global hook.

Once initialized, the extension injects a script that reads data stored in Apollo cache into the user’s app. Using a Mutation Observer instance, Lyra tracks changes to DOM nodes, triggering a reinjection of the script, which reads new data from the cache, and passes it to the devtool panel using the Chrome message passing API. The extension then displays data as an interactive D3 tree.

<h3>Features:</h3>

- search the cache by key and value (support for multiple search terms) and see highlighted results
- toggle visibility of nodes
- hover on nodes to display values
- view the normalized Apollo Client cache in JSON format

<div align="center">
<img width="600" src="src/assets/search.png">
<br>
<img width="600" src="src/assets/json_view.png">
</div>

<h2>Developers (Chrome):</h2>

1. download the source code, go to `chrome://extensions` and toggle developer mode on (top left corner); click `Load unpacked` and select the `browser` down folder.
2. run `npm run chrome` in the devtools repo. Webpack will watch the files and rebundle them automatically if you make any changes. To see your changes, close the Chrome devtool panel and reopen to see your changes in effect (no need to reload the extension in chrome://extensions, note that you will need to reload if you make changes to the extension manifest).

<h2>Team:</h2>
<a href="https://github.com/luijocroussett">Luis Croussett</a> | 
<a href="https://github.com/kirabird">Karen Huang</a> | 
<a href="https://github.com/gmal1">Nel Malikova</a> | 
<a href="https://github.com/tayvon">Tayvon Wright</a>
