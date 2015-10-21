import middleware from '../';
import Layout from '../layout';
import connect from 'connect';
import chai from 'chai';
import chaiHttp from 'chai-http';
import chaiSpies from 'chai-spies';
import server from 'react-dom/server';
import React from 'react';
const httpStatusOk = 200;
chai.use(chaiHttp).use(chaiSpies).should();
/* eslint-disable arrow-parens */

describe('React HTML Template Middleware', () => {
  const originalRenderToString = server.renderToString;
  let app = null;
  let request = null;
  let response = null;
  beforeEach(async () => {
    app = connect().use(middleware());
    server.renderToString = chai.spy(() => '');
    request = chai.request(app);
    response = await request.get('/').buffer();
  });

  afterEach(() => {
    server.renderToString = originalRenderToString;
  });

  it('renders the default doctype', () => {
    response.should.have.property('text', '<!doctype html>');
  });

  it('appends the result of renderToString to doctype', async () => {
    server.renderToString = chai.spy(() => '<html>foobar</html>');
    response = await request.get('/');
    response.should.have.status(httpStatusOk);
    response.should.have.property('text', '<!doctype html><html>foobar</html>');
  });

  it('renders a default content-type', () => {
    response.should.have.header('content-type', 'text/html; charset=utf-8');
  });

  it('renders default caching headers', () => {
    response.should.have.header('cache-control', 'public, max-age=3600');
  });

  describe('configured with custom headers', () => {
    beforeEach(async () => {
      app = connect().use(middleware({
        headers: {
          'content-type': 'application/xml',
          'pragma': 'no-cache',
          'foobar': 'blooblux',
        },
      }));
      chai.spy.on(server, 'renderToString');
      request = chai.request(app);
      response = await request.get('/');
    });

    it('sends the additional headers in the response', () => {
      response.should.have.header('pragma', 'no-cache');
    });

    it('overrides default headers', () => {
      response.should.have.header('content-type', 'application/xml');
    });

    it('sends any header (even non-registered)', () => {
      response.should.have.header('foobar', 'blooblux');
    });

  });

  describe('configured with custom doctype', () => {
    beforeEach(async () => {
      app = connect().use(middleware({
        doctype: '<!foobar>',
      }));
      request = chai.request(app);
      response = await request.get('/');
    });

    it('renders the default doctype', () => {
      response.should.have.property('text', '<!foobar>');
    });

    it('appends the result of renderToString to doctype', async () => {
      server.renderToString = chai.spy(() => '<html>foobar</html>');
      response = await request.get('/');
      response.should.have.status(httpStatusOk);
      response.should.have.property('text', '<!foobar><html>foobar</html>');
    });

  });

  describe('configured with custom layout', () => {

    beforeEach(async () => {
      app = connect().use(middleware({
        layout: chai.spy(() => (<html/>)),
      }));
      server.renderToString = server.renderToStaticMarkup;
      request = chai.request(app);
      response = await request.get('/').buffer();
    });

    it('renders the given layout', () => {
      response.should.have.property('text', '<!doctype html><html></html>');
    });

    it('gives Layout component the pathname', async () => {
      app = connect().use(middleware({
        layout: chai.spy((props) => (<html>{props.path}</html>)),
        props: {
          foo: 'bar',
          baz: 'bing',
        },
      }));
      response = await chai.request(app).get('/foo/bar/baz').buffer();
      response.should.have.property('text', '<!doctype html><html>/foo/bar/baz</html>');
    });

    it('gives Layout all props', async () => {
      app = connect().use(middleware({
        layout: chai.spy((props) => (<html>{JSON.stringify(props)}</html>)),
        props: {
          foo: 'bar',
          baz: 'bing',
        },
      }));
      response = await chai.request(app).get('/biz').buffer();
      const html = server.renderToStaticMarkup(
        <html>{JSON.stringify({ path: '/biz', foo: 'bar', baz: 'bing' })}</html>
      );
      response.should.have.property('text', `<!doctype html>${html}`);
    });

  });

  describe('default Layout option', () => {

    it('defaults to the included Layout component', () => {
      server.renderToString.should.have.been.called.exactly(1);
      /* eslint-disable no-underscore-dangle */
      const spyFirstCallArgs = server.renderToString.__spy.calls[0];
      /* eslint-enable no-underscore-dangle */
      spyFirstCallArgs[0].should.have.property('type', Layout);
      spyFirstCallArgs[0].should.have.deep.property('props.path', '/');
    });

  });

});
