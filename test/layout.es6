import Layout from '../layout';
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import chai from 'chai';
import chaiSpies from 'chai-spies';
chai.use(chaiSpies).should();
/* eslint id-length: 0 */
describe('Layout', () => {
  it('is compatible with React.Component', () => {
    Layout.should.be.a('function')
      .and.respondTo('render');
  });

  it('renders a React element', () => {
    React.isValidElement(<Layout title="" path="" />).should.equal(true);
  });

  describe('Rendering', () => {
    const renderer = TestUtils.createRenderer();
    it('renders a standard html structure', () => {
      renderer.render(<Layout title="mypage"/>, {});
      renderer.getRenderOutput().should.deep.equal(
        <html lang="en">
          <head>{[ <title>mypage</title> ]}</head>
          <body>{null}</body>
        </html>
      );
    });

    it('will use the passed in `lang` prop', () => {
      renderer.render(<Layout title="mypage" lang="fr"/>, {});
      renderer.getRenderOutput().should.deep.equal(
        <html lang="fr">
          <head>{[ <title>mypage</title> ]}</head>
          <body>{null}</body>
        </html>
      );
    });

    it('will not render `lang` if prop falsey', () => {
      renderer.render(<Layout title="mypage" lang={false}/>, {});
      renderer.getRenderOutput().should.deep.equal(
        <html>
          <head>{[ <title>mypage</title> ]}</head>
          <body>{null}</body>
        </html>
      );
    });

    it('will use the passed in `manifest` prop', () => {
      renderer.render(<Layout title="mypage" manifest="app.manifest"/>, {});
      renderer.getRenderOutput().should.deep.equal(
        <html lang="en" manifest="app.manifest">
          <head>{[ <title>mypage</title> ]}</head>
          <body>{null}</body>
        </html>
      );
    });

    describe('<head> children', () => {

      it('renders <meta> tags based on `meta` prop', () => {
        renderer.render((
          <Layout
            title="head-tests"
            meta={[
              { charSet: 'utf-8' },
              { httpEquiv: 'status', content: '200' },
              { name: 'description', content: 'Hello World' },
            ]}
          />
        ), {});
        renderer.getRenderOutput().should.deep.equal(
          <html lang="en">
            <head>
              <meta charSet="utf-8"/>
              <meta httpEquiv="status" content="200"/>
              <meta name="description" content="Hello World"/>
              <title>head-tests</title>
            </head>
            <body>{null}</body>
          </html>
        );
      });

      it('renders <style> tags based on `inlineStyles` prop', () => {
        renderer.render((
          <Layout
            title="head-tests"
            inlineStyles={[
              'body{background:blue}',
              { id: 'critical', media: 'print', children: 'foo' },
              { title: 'wut', disabled: true, children: 'bar' },
            ]}
          />
        ), {});
        renderer.getRenderOutput().should.deep.equal(
          <html lang="en">
            <head>
              <title>head-tests</title>
              <style>{'body{background:blue}'}</style>
              <style id="critical" media="print">foo</style>
              <style title="wut" disabled>bar</style>
            </head>
            <body>{null}</body>
          </html>
        );
      });

      it('renders <link rel=stylesheet> tags based on `styles` prop', () => {
        renderer.render((
          <Layout
            title="head-tests"
            styles={[
              'http://my.style.css',
              { id: 'styles', href: '/style.css', media: 'screen' },
            ]}
          />
        ), {});
        renderer.getRenderOutput().should.deep.equal(
          <html lang="en">
            <head>
              <title>head-tests</title>
              <link href="http://my.style.css" rel="stylesheet"/>
              <link
                rel="stylesheet"
                id="styles"
                href="/style.css"
                media="screen"
              />
            </head>
            <body>{null}</body>
          </html>
        );
      });

      it('renders <link rel=stylesheet> tags based on `styles` prop', () => {
        renderer.render((
          <Layout
            title="head-tests"
            links={[
              { rel: 'icon', id: 'foo', href: 'favicon.ico' },
            ]}
          />
        ), {});
        renderer.getRenderOutput().should.deep.equal(
          <html lang="en">
            <head>
              <title>head-tests</title>
              <link rel="icon" id="foo" href="favicon.ico"/>
            </head>
            <body>{null}</body>
          </html>
        );
      });

      it('renders <script> tags based on `inlineScripts` prop', () => {
        renderer.render((
          <Layout
            title="head-tests"
            inlineScripts={[
              'console.log("hey there");',
              { type: 'text/javascript', children: 'var a = 5;' },
              { type: 'text/javascript', children: 'var b = { c: 7 };' },
            ]}
          />
        ), {});
        renderer.getRenderOutput().should.deep.equal(
          <html lang="en">
            <head>
              <title>head-tests</title>
              <script>{'console.log("hey there");'}</script>
              <script type="text/javascript">{'var a = 5;'}</script>
              <script type="text/javascript">{'var b = { c: 7 };'}</script>
            </head>
            <body>{null}</body>
          </html>
        );
      });

      it('renders <script> tags based on `scripts` prop', () => {
        renderer.render((
          <Layout
            title="head-tests"
            scripts={[
              '/script.js',
              { id: 'scriptz', src: '/hackz.js', className: 'wowmuchleet' },
              { defer: true, async: true, src: 'dont-care.js' },
            ]}
          />
        ), {});
        renderer.getRenderOutput().should.deep.equal(
          <html lang="en">
            <head>
              <title>head-tests</title>
              <script defer src="/script.js"/>
              <script
                defer
                id="scriptz"
                src="/hackz.js"
                className="wowmuchleet"
              />
              <script defer async src="dont-care.js"/>
            </head>
            <body>{null}</body>
          </html>
        );
      });

    });

    describe('<body> children', () => {

      it('renders with Handler, given handler property', () => {
        const Handler = chai.spy();
        renderer.render(<Layout title="body-tests" handler={Handler}/>, {});
        renderer.getRenderOutput().should.deep.equal(
          <html lang="en">
            <head>{[ <title>body-tests</title> ]}</head>
            <body><Handler handler={Handler} lang="en" title="body-tests"/></body>
          </html>
        );
      });

      it('passes props through to handler', () => {
        const Handler = chai.spy();
        renderer.render((
          <Layout
            title="body-tests"
            handler={Handler}
            scripts={[ 'foo.js' ]}
          />
        ), {});
        renderer.getRenderOutput().should.deep.equal(
          <html lang="en">
            <head><title>body-tests</title><script defer src="foo.js"/></head>
            <body>
              <Handler
                handler={Handler}
                lang="en"
                title="body-tests"
                scripts={[ 'foo.js' ]}
              />
            </body>
          </html>
        );
      });

      it('renders children, given children property (and no handler)', () => {
        renderer.render((
          <Layout title="body-tests">
            <div><h1>Hello!</h1></div>
          </Layout>
        ), {});
        renderer.getRenderOutput().should.deep.equal(
          <html lang="en">
            <head>{[ <title>body-tests</title> ]}</head>
            <body><div><h1>Hello!</h1></div></body>
          </html>
        );
      });

      it('passes children to Handler, if Handler given', () => {
        const Handler = chai.spy();
        renderer.render((
          <Layout title="body-tests" handler={Handler}>
            <div><h1>Hello!</h1></div>
          </Layout>
        ), {});
        renderer.getRenderOutput().should.deep.equal(
          <html lang="en">
            <head>{[ <title>body-tests</title> ]}</head>
            <body>
              <Handler
                handler={Handler}
                lang="en"
                title="body-tests"
              >
                <div><h1>Hello!</h1></div>
              </Handler>
            </body>
          </html>
        );
      });

    });

  });

});
