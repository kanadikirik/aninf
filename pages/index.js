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
