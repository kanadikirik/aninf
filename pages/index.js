import Head from 'next/head'
// Components
import { LoadingPage } from '../components/LoadinPage';
import Navbar          from '../components/Navbar';;
import HomeHeader      from '../components/headers/HomeHeader';
import KnowledgeList   from '../components/KnowledgeList';

export default class index extends React.Component {
  
  render() {
    const { loaded, user, signIn, signOut } = this.props;
    return (
      <div className="home">
        <Head>
          <title>aninf | Öğrendiklerini paylaş, paylaştıkça daha çok öğren</title>
          <meta charSet="UTF-8" />
          <meta name="description" content="Öğrendiklerini paylaş, paylaştıkça daha çok öğren." />
          <meta name="keywords" content="Yazılım, yazılım paylaşımları, yazılım notları, yazılım bilgileri, yazılım dersleri" />
          <meta name="author" content="John Doe" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </Head>
        {
          loaded ? 
          <div className="container">
            <Navbar user={user} signOut={signOut} />
            <HomeHeader loaded={loaded} user={user} signIn={signIn} />
            <KnowledgeList user={user} signIn={signIn} />
          </div>
          :
          <LoadingPage />
        }
      </div>

    )
  }
}
