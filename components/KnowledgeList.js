// Services
import { Knowledge } from "../services/Knowledge";
// Components
import { LoadingCircle } from './LoadingCircle';
import CreateKnowledge from "./CreateKnowledge";
import KnowledgeItem from './KnowledgeItem';
// Icons
import { FaPen } from 'react-icons/fa';

export default class KnowledgeList extends React.Component {
  
  state={
    knowledgesToday           : [],
    knowledgesTodayError      : false,
    knowledgesTodayLoaded     : false,
    knowledgesThisWeek        : [],
    knowledgesThisWeekError   : false,
    knowledgesThisWeekLoaded  : false,
    creationModalVisibility   : false,
  }

  componentDidMount = async () => {
    await this.buildToday();
    await this.buildThisWeek();
  }
  
  buildToday = async () => {
    const knowledgesToday = await Knowledge.getToday();
    knowledgesToday ? await this.setState({ knowledgesToday }) : await this.setState({ knowledgesTodayError: true });
    this.setState({ knowledgesTodayLoaded: true });
  }

  removeTodayKnowledge = (id) => {
    let { knowledgesToday } = this.state;
    const index = knowledgesToday.findIndex(item => item.dbObject.id === id);
    knowledgesToday.splice(index, 1);
    this.setState({ knowledgesToday });
  }

  addTodayKnowledge = (knowledge) => {
    let { knowledgesToday } = this.state;
    this.setState({ knowledgesToday: [knowledge, ...knowledgesToday] });
  }

  updateTodayKnowledge = (knowledge) => {
    let { knowledgesToday } = this.state;
    const index = knowledgesToday.findIndex(item => item.dbObject.id === knowledge.dbObject.id);
    knowledgesToday[index] = knowledge;
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
          return <h3 className="bold ta-center">Bugün henüz bir şey anlatılmadı. <span className="cf-blue">İlk anlatan sen ol!</span></h3>
        } else {
          return (knowledgesToday.map(knowledge => {
            return (
              <KnowledgeItem key={knowledge.dbObject.id} user={this.props.user} knowledge={knowledge} remove={this.removeTodayKnowledge} update={this.updateTodayKnowledge} />
            )
          })
          )
        }
      }
    } else {
      return <LoadingCircle />
    }
  }

  buildThisWeek = async () => {
    const knowledgesThisWeek = await Knowledge.getThisWeek(0);
    knowledgesThisWeek ? await this.setState({ knowledgesThisWeek }) : await this.setState({ knowledgesThisWeekError: true });
    this.setState({ knowledgesThisWeekLoaded: true });
  }

  removeThisWeekKnowledge = (id) => {
    let { knowledgesThisWeek } = this.state;
    const index = knowledgesThisWeek.findIndex(item => item.dbObject.id === id);
    knowledgesThisWeek.splice(index, 1);
    this.setState({ knowledgesThisWeek });
  }

  updateThisWeekKnowledge = (knowledge) => {
    let { knowledgesThisWeek } = this.state;
    const index = knowledgesThisWeek.findIndex(item => item.dbObject.id === knowledge.dbObject.id);
    knowledgesThisWeek[index] = knowledge;
    this.setState({ knowledgesThisWeek });
  }

  thisWeekList = () => {
    const { knowledgesThisWeek, knowledgesThisWeekError, knowledgesThisWeekLoaded } = this.state;
    if(knowledgesThisWeekLoaded){
      if(knowledgesThisWeekError){
        return "Yüklenirken hata meydana geldi"
      } else {
        if(knowledgesThisWeek.length === 0){
          return <h3 className="bold">Bu hafta anlatılan bir şey yok gibi gözüküyor. <span className="cf-blue">İlk anlatan sen ol!</span></h3>
        } else {
          return (knowledgesThisWeek.map(knowledge => {
            return (
              <KnowledgeItem key={knowledge.dbObject.id} user={this.props.user} knowledge={knowledge} remove={this.removeThisWeekKnowledge} update={this.updateThisWeekKnowledge} />
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
    const { user, signIn } = this.props;
    const { creationModalVisibility } = this.state;
    return (
      <div className="knowledge-list">
        <div className="knowledge-list-title">
          <h2><span className="cf-blue">Bugün</span> anlatılanlar</h2>
          <button className="create-button" onClick={() => this.setCreationModalVisibility(!this.state.creationModalVisibility)}>
            Hemen anlat
            <FaPen className="icon-lg ml-3" />
          </button>
        </div>
        { creationModalVisibility && <CreateKnowledge user={user} signIn={signIn} setVisibility={this.setCreationModalVisibility} add={this.addTodayKnowledge} /> }
        {this.todayList()}
        <h2 className="my-5"><span className="cf-blue">Bu hafta</span> anlatılanlar</h2>        
        {this.thisWeekList()}
      </div>
    )
  }
}
