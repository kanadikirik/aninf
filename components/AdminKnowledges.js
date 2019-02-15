// Services
import { Knowledge } from "../services/Knowledge";
// Components
import KnowledgeItem from './KnowledgeItem';
import { LoadingCircle } from './LoadingCircle'; 

export default class AdminKnowledges extends React.Component {

  state={
    startAfter  : 0,
    loading     : true,
    loaded      : false,
    knowledges  : [],
    loadingMore : false,
    loadMoreMessage : 'Daha fazla yükle',
  }
  
  
  componentDidMount = async () => {
    const knowledges = await Knowledge.paginate(new Date());
    await this.setState({ knowledges })
    this.setState({ loaded: true, loading: false });
  }

  removeKnowledge = (id) => {
    let { knowledges } = this.state;
    const index = knowledges.findIndex(item => item.id === id);
    knowledges.splice(index, 1);
    this.setState({ knowledges });
  }

  loadMore = async () => {
    this.setState({ loadingMore: true });
    const { knowledges } = this.state;
    const moreKnowledges = await Knowledge.paginate(knowledges[knowledges.length-1].createdAt);
    if(moreKnowledges){
      if(moreKnowledges.length > 0){
        this.setState({ knowledges: [...knowledges, ...moreKnowledges], startAfter: this.state.startAfter+7 })
      } else {
        this.setState({ loadMoreMessage: 'Gösterilecek daha fazla anlatım yok' });
      }
    } else {
        this.setState({ loadMoreMessage: 'Daha fazla anlatım yüklenirken hata meydana geldi. Lütfen tekrar deneyiniz!' });
    }
    this.setState({ loadingMore: false });
  }

  knowledgesList = () => {
    const { knowledges, loading } = this.state;

    if(loading){
      return <div className="admin-knowledges-list"><LoadingCircle /></div>
    } else {
        if(knowledges){
          if(knowledges.length === 0){
            return <div className="admin-knowledges-list"><p>Henüz anlatım yayınlanmadı!</p></div>
          } else {
              return(
                <div id="admin-knowledges-list" className="admin-knowledges-list">
                  {
                    knowledges.map(knowledge => {
                      return (
                              <KnowledgeItem 
                                key       = {knowledge.id} 
                                user      = {this.props.user} 
                                knowledge = {knowledge} 
                                remove    = {this.removeKnowledge} 
                                className = "admin-knowledge"
                              />
                            )
                    })
                  }
                </div>
              )
          }
        } else {
          return <div className="admin-knowledges-list"><p>Hata meydana geldi</p></div>
        }
    }

  }
  
  render() {
    const { loadingMore, loadMoreMessage } = this.state;
    return (
      <div className="admin-knowledges">
        <h2>Anlatılanlar</h2>
        {this.knowledgesList()}
        {loadingMore ? <div><LoadingCircle /></div> : <button className="load-more" onClick={this.loadMore}>{loadMoreMessage}</button>}
      </div>
    )
  }
}
