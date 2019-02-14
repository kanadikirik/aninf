// Components
import Navbar     from '../components/Navbar';
import HomeHeader from '../components/headers/HomeHeader'
import CreateKnowledge from '../components/CreateKnowledge';
import KnowledgeList from '../components/KnowledgeList'

export default class index extends React.Component {
  
  render() {
    const { loaded, user, signIn } = this.props;
    return (
      <div className="container">
        <Navbar />
        <HomeHeader loaded={loaded} user={user} signIn={signIn} />
        <KnowledgeList user={user} />
      </div>
    )
  }
}
