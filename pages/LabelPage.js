import Head from 'next/head';
// Services
import { Label } from '../services/Label';
// Components
import { LoadingPage } from '../components/LoadinPage';
import Navbar          from '../components/Navbar';
import { LoadingCircle } from '../components/LoadingCircle';
import LabelList from '../components/label/LabelList';
import KnowledgeList from '../components/knowledge/KnowledgeList';
// Icons
import { FaPen, FaTag, FaLongArrowAltDown } from 'react-icons/fa';

export default class LabelPage extends React.Component {

  knowledgeList = React.createRef();

  static getInitialProps = async ({query}) => {
    return { title: query.title }
  }

  state= {
    label: undefined,
    builded: false,
    notFound: false,
    error: false,
    existMore: false,
    creationModalVisibility: false,
    scrollY: 0,
  }

  componentDidMount = async () => {
    await this.build();
  }

  build = async () => {
    const { title } = this.props;
    await Label.findByTitle(title)
    .then(async label => { await this.setState({ label }); })
    .catch(err => {
      err.status && err.status === "empty" ? this.setState({ notFound: true }) : this.setState({ error: true });
    })
    this.setState({ builded: true })
  }

  setCreationModalVisibility = (creationModalVisibility) => {
    this.setState({ creationModalVisibility })
  }

  lets = async () => {
    await this.setState({ scrollY: window.scrollY })
    await this.knowledgeList.current.setCreationModalVisibility();
    window.scrollTo(0,0);
    window.addEventListener('scroll', async (e) => {
      if(document.getElementById("create-knowledge")){
        const creationHeight = document.getElementById("create-knowledge").offsetHeight;
        if(window.scrollY >= this.state.scrollY + creationHeight){
          await this.knowledgeList.current.setCreationModalVisibility(false);
          this.setState({ scrollY: 0 })
        }
      }
    })
  }
  
  goDown = async () => {
    await this.knowledgeList.current.setCreationModalVisibility(false);
    window.scrollTo(0, this.state.scrollY);
  }

  labelPageElement = () => {
    const { builded, label, notFound, error } = this.state;
    const { user, signIn } = this.props;
    if(!builded) return <LoadingCircle />
    else {
      if(notFound){
        return(
          <React.Fragment>
            <div className="label-page-title">
              <p className="ta-center my-5 bold">Aradığın etiket bulunamadı. Bunlara göz atmaya ne dersin?</p>
            </div>
            <LabelList user={user} signIn={signIn} setCreationModalVisibility={this.setCreationModalVisibility} />
          </React.Fragment>
        )
      } else if(error){
        return(
          <React.Fragment>
            <div className="label-page-title">
              <p className="ta-center my-5 bold">Etiket bulunurken hata meydana geldi. Bunlara göz atmaya ne dersin?</p>
            </div>
            <KnowledgeList user={user} signIn={signIn} setCreationModalVisibility={this.setCreationModalVisibility} />
          </React.Fragment>
        )
      } else {
        return(
          <React.Fragment>
            <div className="label-page-title">
              <FaTag className="mr-3" />
              <h2>{label.data().title} ({label.data().count})</h2>
            </div>
            <KnowledgeList ref={this.knowledgeList} user={user} signIn={signIn} labelPage label={label} setCreationModalVisibility={this.setCreationModalVisibility} />
          </React.Fragment>
        )
      }
    }
  }

  render() {
    const { loaded, user, signIn, signOut, title } = this.props;
    const { creationModalVisibility, scrollY } = this.state;
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
            <span id="ust"></span>
            {this.labelPageElement()}
            {!creationModalVisibility && 
              <button className="lets-button" onClick={this.lets}>Anlat<FaPen className="ml-3" /></button>
            }
            {creationModalVisibility && scrollY > 0 &&
              <button className="go-down-button" onClick={this.goDown}>Aşağı Dön<FaLongArrowAltDown className="ml-3" /></button>
            }
          </div>
          :
          <LoadingPage />
        }
      </div>
    )
  }
}
