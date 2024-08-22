// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';
import express from 'express';
import ReactDOMServer from 'react-dom/server';
import { App } from './App.tsx';

const app = express();
const port = 3333;

const cache: Record<string, { html: string }> = {};

app.get('*', (req, res) => {
  const url = req.url;

  const cachedEntry = cache[url];

  if (cachedEntry) {
    return res.send(cachedEntry.html);
  }

  const appHtml = ReactDOMServer.renderToString(<App url={url} />);
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Simple SSR</title>
    </head>
    <body>
      <div id="root">${appHtml}</div>
    </body>
    </html>
  `;

  cache[url] = {
    html,
  };

  res.send(html);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
