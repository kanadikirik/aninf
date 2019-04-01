// Services
import { Knowledge } from "../../services/Knowledge";
// Components
import { LoadingCircle } from "../LoadingCircle";
import KnowledgeItem     from "../knowledge/KnowledgeItem";
import SelectBox         from "../SelectBox";
// Icnos
import { FaSearch, FaAngleDown, FaAngleUp } from 'react-icons/fa';
import { User } from "../../services/User";
import AdminUserView from "./AdminUserView";
import { Report } from "../../services/Report";
import AdminReportView from "./AdminReportView";

export default class AdminSearch extends React.Component {
  
  
  knowledgeOptions = [
    'Başlık', 'Özet', 'Kaynak', 'Kullanıcı', 'Seçiniz', 'ID'
  ] 
  userOptions = [
    'İsim', 'Mail', 'Tip', 'Seçiniz', 'ID'
  ]
  reportOptions = [
    'Açıklama', 'Rapor edilen', 'Kullanıcı', 'ID', 'Seçiniz'
  ]

  constructor(props){
    super(props);
    this.selectBox = React.createRef();
  }
  
  state={
    isVisible     : true,
    inputValue    : '',
    contentType   : 'Anlatım',
    filterOptions : [],
    filter        : 'Başlık',
    contents      : [],
    loading       : false,
    visibleContent: false,
  }

  handleVisible = () => {
    this.setState({ isVisible: !this.state.isVisible })
  }

  setVisibleContent = (visibleContent) => {
    this.setState({visibleContent})
  }

  onChangeInputValue = (event) => {
    this.setState({ inputValue: event.target.value });
  }

  search = async () => {
    const { contentType } = this.state;
    await this.setState({ loading: true });
    let contents;
    if(contentType === 'Anlatım'){
      await this.knowledgeSearch(this.state.filter, this.state.inputValue, contents);
    } else if(contentType === 'Kullanıcı'){
      await this.userSearch(this.state.filter, this.state.inputValue, contents);
    } else if(contentType === 'Şikayet'){
      await this.reportSearch(this.state.filter, this.state.inputValue, contents);
    }
    await this.setState({ loading: false });
  }

  knowledgeSearch = async (filter, inputValue, contents) => {
    if(filter === 'Başlık') filter = 'title';
    else if(filter === 'Özet') filter = 'summary';
    else if(filter === 'Kaynak') filter = 'source';
    else if(filter === 'Kullanıcı') filter = 'author';
    if(filter === 'ID'){
      contents = await Knowledge.findByID(inputValue);
      await this.setState({ contents: [contents] })
    } else {
      contents = await Knowledge.filter(filter, inputValue);
      await this.setState({ contents });
    }
    await this.setVisibleContent('knowledges')
  }

  userSearch = async (filter, inputValue, contents) => {
    if(filter === 'İsim') filter = 'displayName'
    else if(filter === 'Mail') filter = 'email'
    else if(filter === 'Tip') filter = 'type'
    if(filter === 'ID'){
      contents = await User.findByID(inputValue);
      await this.setState({ contents: [contents] });
    } else {
      contents = await User.filter(filter, inputValue);
      await this.setState({ contents });
    }
    await this.setVisibleContent('users')
  }

  reportSearch = async (filter, inputValue, contents) => {
    if(filter === 'Açıklama') filter = 'description'
    else if(filter === 'Rapor edilen') filter = 'reportedItem'
    else if(filter === 'Kullanıcı') filter = 'author'
    
    if(filter === 'ID'){
      contents = await Report.findByID(inputValue);
      await this.setState({contents: [contents]});
    } else {
      contents = await Report.filter(filter, inputValue);
      await this.setState({ contents });
    }
    await this.setVisibleContent('reports');
  }
  
  onChangeFilter = async (event) => {
    await this.setState({ filter: event.target.value });
  }
  
  filterSelector = () => {
    const { filterOptions } = this.state;
    return(
      <SelectBox ref={this.selectBox} options={filterOptions} select={this.selectFilter} />
      )
    }

  selectFilter = async (filter) => {
    await this.setState({ filter });
  }
  
  typeSelector = () => {
    return(
      <div>
        <SelectBox options={['Anlatım','Kullanıcı','Şikayet']} select={this.selectType} />
      </div>
    )
  }

  selectType = async (contentType) => {
    this.setState({ contentType })
    this.selectBox.current.select('Seçiniz');
    if(contentType === 'Anlatım'){
      await this.setState({ filterOptions: this.knowledgeOptions })
    } else if(contentType === 'Kullanıcı'){
      await this.setState({ filterOptions: this.userOptions })
    } else if(contentType === 'Şikayet'){
      await this.setState({ filterOptions: this.reportOptions })
    }
  }

  listContents = () => {
    const { isVisible, contents, loading, visibleContent } = this.state;
    if(isVisible){
      if(loading){
        return <LoadingCircle />
      } else {
        if(contents.length > 0){
          if(visibleContent === 'knowledges'){
            return(
              contents.map(content => {
                return <KnowledgeItem key={content.id} knowledge={content} />
              })
            )
          } else if(visibleContent === 'users'){
            return(
              contents.map(content => {
                return <AdminUserView key={content.id} user={content} />
              })
            )
          } else if(visibleContent === 'reports'){
            return(
              contents.map(content => {
                return <AdminReportView key={content.id} report={content} />
              })
            )
          }
        } else {
          return <p>Aramaya uygun sonuç bulunamadı</p>
        }
      }
    } else {
      return null;
    }
  }

  
  render() {
    const { isVisible, filter } = this.state;
    return (
      <div className="admin-search">
        <p className="mb-3 bold">Arama</p>
        <div className="admin-search-box">
          <input name="admin-search" placeholder={filter} onChange={this.onChangeInputValue} />
          {this.typeSelector()}
          {this.filterSelector()}
          <button className="p-0" onClick={this.search}><FaSearch className="icon-lg cf-blue" /></button>
          <button onClick={this.handleVisible}> { isVisible ? <FaAngleUp className="icon-lg cf-blue" /> : <FaAngleDown className="icon-lg cf-blue" /> }</button>
        </div>
        {this.listContents()}
      </div>
    )
  }
}
