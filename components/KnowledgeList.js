// Services
import { Knowledge } from "../services/Knwoledge";
// Components
import { LoadingCircle } from './LoadingCircle';
// Icons
import { FaPen, FaLink, FaTwitter, FaFacebook, FaWhatsapp, FaEllipsisH } from 'react-icons/fa';
import CreateKnowledge from "./CreateKnowledge";

export default class KnowledgeList extends React.Component {
  
  state={
    knowledgesToday: [],
    knowledgesTodayError: false,
    knowledgesTodayLoaded: false,
    creationModalVisibility: false,
  }

  componentDidMount = async () => {
    await this.buildToday();
  }
  
  buildToday = async () => {
    const knowledgesToday = await Knowledge.getToday();
    knowledgesToday ? await this.setState({ knowledgesToday }) : await this.setState({ knowledgesTodayError: true });
    this.setState({ knowledgesTodayLoaded: true });
  }

  setCreationModalVisibility = (value = !this.state.creationModalVisibility) => {
    this.setState({ creationModalVisibility: value });
  }

  todayList = () => {
    const { knowledgesToday, knowledgesTodayError, knowledgesTodayLoaded } = this.state;
    if(knowledgesTodayLoaded){
      if(knowledgesTodayError){
        return "Yüklenirken hata meydana geldi"
      } else {
        if(knowledgesToday.length === 0){
          return "Bugün henüz bir şey anlatılmadı. İlk anlatan sen ol!"
        } else {
          return (knowledgesToday.map(knowledge => {
            return (
              <div key={knowledge.id} className="knowledge">
                  <div className="knowledge-author">
                    <img src={knowledge.author.photoURL} alt={`aninf ${knowledge.author.displayName}`} />
                    <p><span className="bold">{knowledge.author.displayName.split(" ")[0]}</span> anlattı:</p>
                  </div>
                  <div className="knowledge-body">
                    <h4 className="bold mb-3">{knowledge.title}</h4>
                    <p>{knowledge.summary}</p>
                  </div>
                  <div className="knowledge-source">
                    <FaLink className="mr-3"/>
                    <a href={knowledge.source} className="cf-blue">{knowledge.source}</a>
                  </div>
                <div className="knowledge-menu">
                  <button><FaTwitter className="icon-lg cf-twitter" /></button>
                  <button><FaFacebook className="icon-lg cf-facebook" /></button>
                  <button><FaWhatsapp className="icon-lg cf-whatsapp" /></button>
                </div>
              </div>
            )
          })
          )
        }
      }
    } else {
      return <LoadingCircle />
    }
  }
  
  render() {
    const { user } = this.props;
    const { creationModalVisibility } = this.state;
    return (
      <div className="knowledge-list">
        { creationModalVisibility && <CreateKnowledge user={user} setVisibility={this.setCreationModalVisibility} /> }
        <div className="knowledge-list-title">
          <h2><span className="cf-blue">Bugün</span> anlatılanlar</h2>
          <button className="create-button" onClick={() => this.setCreationModalVisibility(true)}>
            Hemen anlat
            <FaPen className="icon-lg ml-3" />
          </button>
        </div>
        {this.todayList()}
      </div>
    )
  }
}
