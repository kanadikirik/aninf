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
          <meta charSet="UTF-8" />
          <meta name="description" content="Burada herkes teknoloji ve yazılım alanında bildiklerini anlatıyor. Anlatmaya hazır mısın?" />
          <meta name="keywords" content="Yazılım, yazılım paylaşımları, yazılım notları, teknoloji, teknoloji paylaşımları, teknoloji haberleri, teknolojik gelişmeler" />
          <meta name="author" content="ook0" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta property="og:title" content="aninf | Bildiklerini anlat" />
          <meta property="og:type" content="article" />
          <meta property="og:url" content="https://aninf.com/" />
          <meta property="og:image" content="http://example.com/static/img/aninf-logo.svg" />
          <meta property="og:description" content="Burada herkes teknoloji ve yazılım alanında bildiklerini anlatıyor. Anlatmaya hazır mısın?" />
          <meta property="og:site_name" content="aninf" />
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