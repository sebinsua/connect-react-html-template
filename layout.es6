import React, { Component, PropTypes } from 'react';
const cssMedaTypes = [
  'all',
  'aural',
  'braille',
  'handheld',
  'print',
  'projection',
  'screen',
  'tty',
  'TV',
];
const globalAttributes = {
  /* eslint-disable id-length */
  id: PropTypes.string,
  /* eslint-enable id-length */
  accesskey: PropTypes.string,
  class: PropTypes.string,
  contenteditable: PropTypes.boolean,
  contextmenu: PropTypes.string,
  dir: PropTypes.string,
  hidden: PropTypes.boolean,
  lang: PropTypes.string,
  style: PropTypes.string,
  tabindex: PropTypes.string,
  title: PropTypes.string,
  translate: PropTypes.string,
};
export default class Layout extends Component {

  static get propTypes() {
    return {
      path: PropTypes.string,
      lang: PropTypes.oneOfType([ PropTypes.string, PropTypes.boolean ]).isRequired,
      title: PropTypes.string,
      manifest: PropTypes.string,
      meta: PropTypes.arrayOf(
        PropTypes.oneOfType([
          PropTypes.shape({
            ...globalAttributes,
            charSet: PropTypes.string,
          }),
          PropTypes.shape({
            ...globalAttributes,
            httpEquiv: PropTypes.string,
            content: PropTypes.string,
          }),
          PropTypes.shape({
            name: PropTypes.string,
            content: PropTypes.string,
          }),
        ])
      ),
      inlineStyles: PropTypes.arrayOf(
        PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.shape({
            ...globalAttributes,
            type: PropTypes.string,
            media: PropTypes.oneOf(cssMedaTypes),
            scoped: PropTypes.boolean,
            disabled: PropTypes.boolean,
          }),
        ])
      ),
      styles: PropTypes.arrayOf(
        PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.shape({
            ...globalAttributes,
            type: PropTypes.string,
            integrity: PropTypes.string,
            href: PropTypes.string,
            hreflang: PropTypes.string,
            media: PropTypes.oneOf(cssMedaTypes),
          }),
        ])
      ),
      links: PropTypes.arrayOf(
        PropTypes.shape({
          ...globalAttributes,
          type: PropTypes.string,
          integrity: PropTypes.string,
          href: PropTypes.string,
          hreflang: PropTypes.string,
          media: PropTypes.oneOf(cssMedaTypes),
          rel: PropTypes.string,
        })
      ),
      inlineScripts: PropTypes.arrayOf(
        PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.shape({
            ...globalAttributes,
            type: PropTypes.string,
          }),
        ])
      ),
      scripts: PropTypes.arrayOf(
        PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.shape({
            ...globalAttributes,
            type: PropTypes.string,
            text: PropTypes.string,
            integrity: PropTypes.string,
            src: PropTypes.string.isRequired,
            defer: PropTypes.boolean,
            async: PropTypes.boolean,
          }),
        ])
      ),
      children: PropTypes.node,
      handler: PropTypes.func,
    };
  }

  static get defaultProps() {
    return {
      lang: 'en',
    };
  }

  renderArrayOfElements(Element, array) {
    return (array || []).map((children) => {
      let props = children;
      if (typeof props !== 'object') {
        props = { children };
      }
      return (<Element {...props}/>);
    });
  }

  dangerousRenderArrayOfElements(Element, array) {
    return (array || []).map((children) => {
      let props = children;
      if (typeof props !== 'object') {
        props = { children };
      }

      const { children: innerHtml, ...remainingProps } = props;
      return (
        <Element
          {...remainingProps}
          dangerouslySetInnerHTML={{ __html: innerHtml }} // eslint-disable-line
        />
      );
    });
  }

  render() {
    const htmlProps = {};
    if (this.props.lang) {
      htmlProps.lang = this.props.lang;
    }
    if (this.props.manifest) {
      htmlProps.manifest = this.props.manifest;
    }
    const head = [
      ...(this.renderArrayOfElements('meta', this.props.meta)),
      <title>{this.props.title}</title>,
      ...(this.renderArrayOfElements('style', this.props.inlineStyles)),
      ...(this.renderArrayOfElements('link', (this.props.styles || []).map((href) => {
        let props = href;
        if (typeof href === 'string') {
          props = { href };
        }
        return { rel: 'stylesheet', ...props };
      }))),
      ...(this.renderArrayOfElements('link', this.props.links)),
      ...(this.dangerousRenderArrayOfElements('script', this.props.inlineScripts)),
      ...(this.renderArrayOfElements('script', (this.props.scripts || []).map((src) => {
        let props = src;
        if (typeof src === 'string') {
          props = { src };
        }
        return { defer: true, ...props };
      }))),
    ];
    let children = this.props.children || null;
    if (this.props.handler) {
      children = <this.props.handler {...this.props}/>;
    }
    return (
      <html {...htmlProps}>
        <head>{head}</head>
        <body>{children}</body>
      </html>
    );
  }

}
