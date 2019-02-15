// Services
import { Knowledge } from "../services/Knwoledge";
// Components
import { LoadingCircle } from './LoadingCircle';
import CreateKnowledge from "./CreateKnowledge";
import KnowledgeItem from './KnowledgeItem';
// Icons
import { FaPen } from 'react-icons/fa';

export default class KnowledgeList extends React.Component {
  
  state={
    knowledgesToday         : [],
    knowledgesTodayError    : false,
    knowledgesTodayLoaded   : false,
    creationModalVisibility : false,
  }

  componentDidMount = async () => {
    await this.buildToday();
  }
  
  buildToday = async () => {
    const knowledgesToday = await Knowledge.getToday();
    knowledgesToday ? await this.setState({ knowledgesToday }) : await this.setState({ knowledgesTodayError: true });
    this.setState({ knowledgesTodayLoaded: true });
  }

  removeTodayKnowledge = (id) => {
    let { knowledgesToday } = this.state;
    const index = knowledgesToday.findIndex(item => item.id === id);
    knowledgesToday.splice(index, 1);
    this.setState({ knowledgesToday });
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
              <KnowledgeItem key={knowledge.id} user={this.props.user} knowledge={knowledge} remove={this.removeTodayKnowledge} />
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
