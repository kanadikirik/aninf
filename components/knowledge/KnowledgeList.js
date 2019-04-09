// Services
import { Knowledge } from "../../services/Knowledge";
// Components
import { LoadingCircle } from '../LoadingCircle';
import CreateKnowledge from "./CreateKnowledge";
import KnowledgeItem from './KnowledgeItem';
// Icons
import { FaPen } from 'react-icons/fa';

export default class KnowledgeList extends React.Component {
  
  state={
    knowledges: [],
    builded: false,
    buildError: false,
    loadingMore: false,
    loadMoreError: false,
    startAt: 0,
    creationModalVisibility : false,
  }

  componentDidMount = async () => {
    this.build();
  }
  
  build = async () => {
    const { labelPage, label } = this.props;
    const { knowledges, startAt } = this.state;
    if(startAt) this.setState({ loadingMore: true });
    let query;
    if(labelPage) query = Knowledge.findByLabel(label.data().title, startAt);
    else query = Knowledge.getAll(startAt);
    await query
    .then(async response => {
      await this.setState({ 
        knowledges: [...knowledges, ...response.knowledges],
        startAt: response.startAt,
      })
    })
    .catch(err => {
      knowledges.length >= 10 ? this.setState({ loadMoreError: true }) : this.setState({ error: true })
    })
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
    this.props.labelPage && this.props.setCreationModalVisibility(value);
  }

  listElement = () => {
    const { knowledges, builded, buildError } = this.state;
    if(builded){
      if(buildError){
        return <span>Anlatımlar yüklenirken hata meydana geldi!</span>
      } else {
        return (
          knowledges.map((knowledge, index) => {
            return <KnowledgeItem 
                      key       = {knowledge.dbObject.id + index} 
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
    const { loadingMore, loadMoreError, startAt } = this.state;
    if(loadingMore){
      return <LoadingCircle />
    } else {
      if(loadMoreError){
        return <button onClick={this.build} className="bold my-5" >Daha fazla anlatım yüklenirken hata meydana geldi. Lütfen tekrar deneyin.</button>
      } else {
        if(startAt){
          return <button onClick={this.build} className="bold my-5">Daha fazla yükle</button>
        } else {
          return null;
        }
      }
    }
  }
  
  render() {
    const { user, signIn, label, labelPage } = this.props;
    const { creationModalVisibility } = this.state;
    return (
      <div className="knowledge-list">
          { !labelPage && 
            <div className="knowledge-list-title">
              <h2><span className="cf-blue">En son</span> anlatılanlar</h2>
              <button className="create-button" onClick={() => this.setCreationModalVisibility(!this.state.creationModalVisibility)}>
                Hemen anlat
                <FaPen className="icon-lg ml-3" />
              </button>
            </div>
          }
        { creationModalVisibility && 
          <CreateKnowledge user={user} signIn={signIn} setVisibility={this.setCreationModalVisibility} add={this.add} label={this.props.label} /> 
        }
        {this.listElement()}
        {this.loadMoreElement()}
      </div>
    )
  }
}
