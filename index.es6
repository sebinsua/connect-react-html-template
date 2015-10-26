/* eslint-disable */
import React from 'react';
import DefaultLayout from './layout';
import { parse as parseUrl } from 'url';
import { renderToString } from 'react-dom/server';
export default ({ headers = {}, doctype = '<!doctype html>', layout = DefaultLayout, props = {} } = {}) => {
  return (request, response, next) => {
    try {
      response.setHeader('content-type', 'text/html; charset=utf-8');
      response.setHeader('cache-control', 'public, max-age=3600');
      for (const header in headers) {
        response.setHeader(header.toLowerCase(), headers[header]);
      }
      response.write(doctype);
      // Send another write, as node buffers up the body until two write operations
      response.write('');
      // JSX expects a captial when rendering a Constructor, but our option isn't;
      const Layout = layout;
      response.write(
        renderToString(
          <Layout
            path={parseUrl(request.url).pathname}
            {...props}
          />
        )
      );
      response.end();
    } catch (error) {
      return next(error);
    }
  };
};
