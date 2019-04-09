import Head from 'next/head'
// Services
import { Knowledge } from '../services/Knowledge';
// Components
import { LoadingPage } from '../components/LoadinPage';
import Navbar          from '../components/Navbar';
import KnowledgeList   from '../components/knowledge/KnowledgeList';
import KnowledgeItem from '../components/knowledge/KnowledgeItem';
import { LoadingCircle } from '../components/LoadingCircle';

export default class KnowledgePage extends React.Component {

  static getInitialProps = async ({query}) => {
    const queryTitle = query.id.split("-");
    const id = queryTitle[queryTitle.length - 1];
    const knowledge = await Knowledge.findByID(id);
    let title = "Anlatım Bulunamadı!"
    if(knowledge){
      title = knowledge.dbObject.data().title;
    }
    return { id, title }
  }

  state= {
    knowledge: undefined,
    loading: true,
    notFound: false,
    error: false,
  }

  componentDidMount = async () => {
    this.build()
  }

  build = async () => {
    const { id } = this.props;
    const knowledge = await Knowledge.findByID(id);
    if(knowledge){
      await this.setState({ knowledge })
    } else if(knowledge === null){
      await this.setState({ notFound: true })
    } else if(!knowledge){
      await this.setState({ error: true })
    }
    this.setState({ loading: false })
  }

  update = (knowledge) => {
    this.setState({ knowledge })
  }

  remove = () => {
    setTimeout(_ => window.location.href = "/", 1500);
  }

  knowledgeElement = () => {
    const { loading, knowledge, notFound, error } = this.state;
    const { user, signIn } = this.props;
    if(loading){
      return <LoadingCircle />
    } else {
      if(notFound){
        return <div>
          <p className="ta-center my-5 bold">Aradığın anlatım bulunamadı. Bunlara göz atmaya ne dersin?</p>
          <KnowledgeList user={user} signIn={signIn} />
        </div>
      } else if(error){
        return(
          <React.Fragment>
            <p className="ta-center my-5 bold">Anlatım bulunurken hata meydana geldi. Bunlara göz atmaya ne dersin?</p>
            <KnowledgeList user={user} signIn={signIn} />
          </React.Fragment>
        )
      } else {
        return (
          <React.Fragment>
            <div style={{display: 'flex', alignItems: 'center'}}>
              <KnowledgeItem user={user} knowledge={knowledge} remove={this.remove} update={this.update} page />
            </div>
            <KnowledgeList user={user} signIn={signIn} />
          </React.Fragment>
        )
      }
    }
  }
  
  render() {
    const { loaded, user, signIn, signOut, title } = this.props;
    return (
      <div className="home">
        <Head>
          <title>{title} | aninf</title>
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
            {this.knowledgeElement()}
          </div>
          :
          <LoadingPage />
        }
      </div>

    )
  }
}