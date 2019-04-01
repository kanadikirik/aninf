// Services
import { Knowledge } from "../../services/Knowledge";
// Components
import { LoadingCircle } from '../LoadingCircle';
import CreateKnowledge from "./CreateKnowledge";
import KnowledgeItem from './KnowledgeItem';
import KnowledgesAll from './KnowledgesAll';
// Icons
import { FaPen } from 'react-icons/fa';

export default class KnowledgeList extends React.Component {
  
  state={
    knowledges: [],
    builded: false,
    buildError: false,
    loadingMore: false,
    loadMoreError: false,
    startAfter: 0,
    creationModalVisibility   : false,
  }

  componentDidMount = async () => {
    this.build();
  }
  
  build = async () => {
    const { startAfter } = this.state;
    if(startAfter) this.setState({ loadingMore: true });
    if(startAfter !== false){
      const knowledges = startAfter === 0 ? await Knowledge.get() : await Knowledge.paginate(this.state.startAfter, 6);
      if(knowledges){
        if(knowledges.length > 0 && knowledges.length % 6 === 0){
          await this.setState({ startAfter: knowledges[knowledges.length - 1].dbObject })
          knowledges.splice(knowledges.length - 1, 1);
        } else {
          this.setState({ startAfter: false })
        }
        await this.setState({ knowledges: [...this.state.knowledges, ...knowledges] })
      } else {
        startAfter === 0 ? this.setState({ buildError: true }) : this.setState({ loadMoreError: true });
      }
    }
    this.setState({ builded: true, loadingMore: false })
  }

  remove = (id) => {
    let { knowledges } = this.state;
    const index = knowledges.findIndex(item => item.dbObject.id === id);
    knowledges.splice(index, 1);
    this.setState({ knowledges })
  }

  add = (knowledge) => {
    this.setState({ knowledges: [knowledge, ...this.state.knowledges] })
  }

  update = (knowledge) => {
    let { knowledges } = this.state;
    const index = knowledges.findIndex(item => item.dbObject.id === knowledge.dbObject.id);
    knowledges[index] = knowledge;
    this.setState({ knowledges });
  }

  setCreationModalVisibility = (value = !this.state.creationModalVisibility) => {
    this.setState({ creationModalVisibility: value });
  }

  listElement = () => {
    const { knowledges, builded, buildError } = this.state;
    if(builded){
      if(buildError){
        return <span>Anlatımlar yüklenirken hata meydana geldi!</span>
      } else {
        return (
          knowledges.map(knowledge => {
            return <KnowledgeItem 
                      key       = {knowledge.dbObject.id} 
                      user      = {this.props.user} 
                      knowledge = {knowledge} 
                      remove    = {this.remove}
                      update    = {this.update}
                    />
          })
        )
      }
    } else {
      return <LoadingCircle />
    }
  }

  loadMoreElement = () => {
    const { loadingMore, loadMoreError, startAfter } = this.state;
    if(loadingMore){
      return <LoadingCircle />
    } else {
      if(loadMoreError){
        return <button onClick={this.build} className="bold my-5" >Daha fazla anlatım yüklenirken hata meydana geldi. Lütfen tekrar deneyin.</button>
      } else {
        if(startAfter){
          return <button onClick={this.build} className="bold my-5">Daha fazla yükle</button>
        } else {
          return null;
        }
      }
    }
  }
  
  render() {
    const { user, signIn } = this.props;
    const { creationModalVisibility } = this.state;
    return (
      <div className="knowledge-list">
        <div className="knowledge-list-title">
          <h2><span className="cf-blue">En son</span> anlatılanlar</h2>
          <button className="create-button" onClick={() => this.setCreationModalVisibility(!this.state.creationModalVisibility)}>
            Hemen anlat
            <FaPen className="icon-lg ml-3" />
          </button>
        </div>
        { creationModalVisibility && 
          <CreateKnowledge user={user} signIn={signIn} setVisibility={this.setCreationModalVisibility} add={this.add} /> 
        }
        {this.listElement()}
        {this.loadMoreElement()}
      </div>
    )
  }
}
