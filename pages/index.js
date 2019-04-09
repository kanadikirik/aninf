import Head from 'next/head'
// Components
import { LoadingPage } from '../components/LoadinPage';
import Navbar          from '../components/Navbar';
import HomeHeader      from '../components/headers/HomeHeader';
import LabelList       from '../components/label/LabelList';
import KnowledgeList   from '../components/knowledge/KnowledgeList';

export default class index extends React.Component {
  
  render() {
    const { loaded, user, signIn, signOut } = this.props;
    return (
      <div className="home">
        <Head>
          <title>aninf | Bildiklerini anlat</title>
          <meta charSet="UTF-8" />
          <meta name="description" content="Öğrendiklerini paylaş, paylaştıkça daha çok öğren." />
          <meta name="keywords" content="Yazılım, yazılım paylaşımları, yazılım notları, yazılım bilgileri, yazılım dersleri" />
          <meta name="author" content="ook0" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </Head>
        {
          loaded ? 
          <div className="container">
            <Navbar user={user} signOut={signOut} signIn={signIn} />
            <HomeHeader loaded={loaded} user={user} signIn={signIn} />
            <LabelList Populars />
            <KnowledgeList user={user} signIn={signIn} />
          </div>
          :
          <LoadingPage />
        }
      </div>

    )
  }
}
