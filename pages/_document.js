import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const isProduction = process.env.NODE_ENV === 'production';
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps, isProduction };
  }

  setGoogleTags() {
    return {
      __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
      
        gtag('config', 'UA-87921346-3');
      `
    };
  }

  render() {
    const { isProduction } = this.props;
    return (
      <html>
        <Head>
          <link rel="shortcut icon" type="image/png" href="/static/img/aninf-icon.ico" />
          <style>{`body { margin: 0 } /* custom! */`}</style>
          {
            isProduction &&
            <React.Fragment>
              <script async src="https://www.googletagmanager.com/gtag/js?id=UA-87921346-3"></script>
              <script dangerouslySetInnerHTML={this.setGoogleTags()} />
            </React.Fragment>
          }
        </Head>
        <body className="custom_class">
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}

export default MyDocument;