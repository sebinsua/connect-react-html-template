# connect-react-html-template

This is a connect middleware that can be used to rapidly integrate React into your server. By supplying this middleware with your frontend React application component, it will output HTML wrapped in your app. It can also pass the `path` param along to your app to be used with routers like [react-router-component][].

## Usage

To use, simply connect the middleware to your connect/express server:

```js
import connect from 'connect';
import MyReactApp from 'my-react-app';
import ConnectReactHtmlTemplate from '@economist/connect-react-html-template';
const app = connect()
  .use(ConnectReactHtmlTemplate({
    props: {
      handler: MyReactApp,
    }
  }));
app.listen(8080);
```

### options

#### options.layout

By default, it uses a React Layout component to compose the webpage. If you want to use your own layout component, simply specify one:

```js
import connect from 'connect';
import MyReactApp from 'my-react-app';
import MyReactHTMLLayout from 'my-react-html-layout';
import ConnectReactHtmlTemplate from '@economist/connect-react-html-template';
const app = connect()
  .use(ConnectReactHtmlTemplate({
    layout: MyReactHTMLLayout
    props: {
      myHtmlLayoutProps: 1,
      otherHtmlLayoutProps: 'hello',
      children: MyReactApp,
    }
  }));
app.listen(8080);
```

#### options.doctype

By default, the middleware will prefix `<!doctype html>` to any React layout (as react cannot do this by itself). If you want a different doctype, just specify one:

```js
import connect from 'connect';
import MyReactApp from 'my-react-app';
import ConnectReactHtmlTemplate from '@economist/connect-react-html-template';
const app = connect()
  .use(ConnectReactHtmlTemplate({
    // Welcome to 2003!
    doctype: '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">',
    props: {
      handler: MyReactApp,
    }
  }));
app.listen(8080);
```

#### options.headers

By default, it will automatically send headers of `content-type: text/html; charset=utf8` and `cache-control: public, max-age=3600`. If you don't like either of these, you can override them with the `headers` option. In fact, you can add any headers you want!

```js
import connect from 'connect';
import MyReactApp from 'my-react-app';
import ConnectReactHtmlTemplate from '@economist/connect-react-html-template';
const app = connect()
  .use(ConnectReactHtmlTemplate({
    headers: {
      'content-type': 'application/xml; charset=utf-8',
      'cache-control': 'no-cache, must-revalidate',
      'pragma': 'no-cache',
      'x-served-by': 'tehnodez',
    },
    props: {
      handler: MyReactApp,
    }
  }));
app.listen(8080);
```

### Default Layout

The default layout has a set of props that you can use to make useful stuff happen:

#### Layout Handler

The most important thing about the default layout is its handler. This is your frontend React app. Simply pass the class in via props, and the layout will handle instantiation:

```js
ConnectReactHtmlTemplate({
  props: {
    handler: MyReactComponent,
  }
})
```

Passing in a Handler is useful, because when it is instantiated, it is passed all of
the props that the layout was passed, including the `path` which is generated from
the middleware.

If you don't have a React class/function, but just have some JSX, use `children` to inject it:

```js
ConnectReactHtmlTemplate({
  props: {
    children: <div><h1>Hello world!</h1></div>,
  }
})
```

If you pass `children` _and_ `handler`, then `handler` will receive the children prop, and the layout wont render any children - just the handler:

```js
ConnectReactHtmlTemplate({
  props: {
    handler: MyReactComponent,
    // Default Layout doesnt render this! Just gives it to `handler`.
    children: <div><h1>Hello world!</h1></div>,
  }
})
```

#### props.title

This will, surprise surprise, set the pages title:

```js
ConnectReactHtmlTemplate({
  props: {
    title: 'This is my cool web site! Please sign my guest book',
  }
})
```

#### props.lang

This sets the html lang attribute, for example `<html lang="en">`. It defaults to `'en'`, but if you really need to disable it: pass `false`.

```js
ConnectReactHtmlTemplate({
  props: {
    lang: 'en',
  }
});

// Disable lang prop:
ConnectReactHtmlTemplate({
  props: {
    lang: false,
  }
})
```

#### props.manifest

If you're using an HTML5 Manifest, specify the URL with `manifest`:

```js
ConnectReactHtmlTemplate({
  props: {
    manifest: '/application.manifest',
  }
});
```

#### props.meta

Want to make some meta tags? Props.meta to the rescue!

```js
ConnectReactHtmlTemplate({
  props: {
    meta: [
      { charSet: 'utf-8' },
      { httpEquiv: 'status', content: '200' },
      { name: 'description', content: 'Hello World' },
    ]
  }
});
```

#### props.styles

Got some sick styles to show off to your friends? props.styles!

```js
ConnectReactHtmlTemplate({
  props: {
    styles: [
      'http://my.style.css',
      { id: 'styles', href: '/style.css', media: 'screen' },
    ]
  }
});
```

#### props.inlineStyles

Need some inline styles for that sweet critical path? use `inlineStyles`.

```js
ConnectReactHtmlTemplate({
  props: {
    inlineStyles: [
      'body{background:blue}',
      { id: 'critical', media: 'print', children: 'foo' },
      { title: 'wut', disabled: true, children: 'bar' },
    ]
  }
});
```

#### props.links

Need some custom `<link>` tags, e.g. making apple-touch-icons? `props.links` will do it.

```js
ConnectReactHtmlTemplate({
  props: {
    links: [
      { rel: 'icon', id: 'foo', href: 'favicon.ico' },
    ]
  }
});
```
#### props.scripts

React pages wouldn't be React pages without some JS - put some in there with `props.scripts`.

```js
ConnectReactHtmlTemplate({
  props: {
    scripts: [
      '/script.js',
      { id: 'scriptz', src: '/hackz.js', className: 'wowmuchleet' },
      { defer: true, async: true, src: 'dont-care.js' },
    ]
  }
});
```
