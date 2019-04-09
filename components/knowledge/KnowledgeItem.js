import Link from 'next/link';
// Services
import { Knowledge } from '../../services/Knowledge';
import { Report } from '../../services/Report';
// Components
import { LoadingCircle } from '../LoadingCircle';
// Icons
import { FaLongArrowAltLeft, FaLongArrowAltRight, FaLink, FaTags, FaEllipsisH } from 'react-icons/fa';
import { Label } from '../../services/Label';

export default class KnowledgeItem extends React.Component {

  state={
    isExtraVisible      : false,
    deletionStep        : 1,
    deleting            : false,
    deleted             : false,
    deletionError       : false,
    isUpdateOpen        : false,
    updating            : false,
    updated             : false,
    updationError       : false,
    updatedTitle        : this.props.knowledge.dbObject.data().title,
    updatedTitleError   : false,
    updatedSummary      : this.props.knowledge.dbObject.data().summary,
    updatedSummaryError : false,
    updatedSource       : this.props.knowledge.dbObject.data().source,
    updatedSourceError  : false,
    updatedLabels       : [],
    updatedLabelsError  : false,
    updationAnimation   : '',
    reportingOpen       : false,
    reporting           : false,
    reported            : false,
    reportingError      : false,
    reportDescription   : '',
    reportDescriptionError: false,
    url: `${this.props.knowledge.dbObject.data().title.split(" ").join("-")}-${this.props.knowledge.dbObject.id}`,
  }

  componentDidMount = () => {
    this.setUpdatedLabels();
  }

  setUpdatedLabels = () => {
    const updatedLabels = [];
    this.props.knowledge.labels.map(label => {
      updatedLabels.push(label.data().title);
    })
    this.setState({ updatedLabels });
  }

  submitDeletion = async (id) => {
    this.setState({ deleting: true });
    const status = await Knowledge.delete(id);
    if(!status) this.setState({ deletionError: true });
    else {
      const labels = this.props.knowledge.labels;
      labels.map(label => {
        Label.removeKnowledge(label.id, id, label.data().count);
      })
      this.setState({ deleted: true },() => {
        setTimeout(() => this.props.remove(id), 2000)
      });
    }
  }

  closeDeletion = () => {
    this.setState({ deletionStep: 1 });
  }
  openDeletion = () => {
    this.setState({ deletionStep: 2 });
    this.handleExtraVisible();
  }

  handleExtraVisible = () => {
    this.setState({ isExtraVisible: !this.state.isExtraVisible })
  }

  deletionElement = () => {
    const { deletionStep, deleting, deletionError } = this.state;
    if(deletionStep === 2){
      if(deleting) return <div className="knowledge-modal"><LoadingCircle/></div>
      else{
        if(deletionError) return <div className="knowledge-modal"><p>İçerik silinirken bir hata meydana geldi</p></div>
        else{
          return(
            <div className="knowledge-modal">
              <p>İçeriği silmek istediğine emin misin?</p>
              <div className="knowledge-modal-buttons">
                <button onClick={this.closeDeletion}><FaLongArrowAltLeft className="mr-3"/> Vazgeç</button>
                <button onClick={() => this.submitDeletion(this.props.knowledge.dbObject.id)}>Eminim!</button>
              </div>
            </div>
          )
        }
      }
    } else {
        return null;
    }
  }

  submitUpdate = async () => {
    const { updatedTitle, updatedTitleError, updatedSummary, updatedSummaryError, updatedSource, updatedSourceError, updatedLabels } = this.state;
    if(updatedSummary.length < 50){
      this.setState({ updatedSummaryError: "Özet en az 50 karakter uzunluğunda olmalıdır!" })
    } else {
      if( !updatedTitleError && !updatedSummaryError && !updatedSourceError ){
        await this.setState({ updating: true })
        const updatedKnowledge = await Knowledge.update(this.props.knowledge.dbObject.id, updatedTitle, updatedSummary, updatedSource, updatedLabels);
        if(!updatedKnowledge) await this.setState({ updationError: true });
        else{
          await this.updationAnimate();
          this.props.update(updatedKnowledge);
          this.updateLabels();
        }
        this.setState({ updated: true, isUpdateOpen: false, updating: false });
      }
    }
  }

  updateLabels = () => {
    const addedLabels = this.detectAddedLabels();
    const deletedLabels = this.detectDeletedLabels();
    addedLabels.map(label => {
      Label.addKnowledge(label, this.props.knowledge.dbObject.id);
    })
    deletedLabels.map(label => {
      Label.removeKnowledge(label.id, this.props.knowledge.dbObject.id, label.data().count);
    })
  }
  
  detectDeletedLabels = () => {
    const { updatedLabels } = this.state;
    const labels = this.props.knowledge.labels;
    const deletedLabels = [];
    labels.map(label => {
      let deleted = true;
      updatedLabels.map(updatedLabel => {
        if(label.data().title === updatedLabel) deleted = false 
      })
      if(deleted) deletedLabels.push(label)
    })
    return deletedLabels;
  }

  detectAddedLabels = () => {
    const { updatedLabels } = this.state;
    const labels = this.props.knowledge.labels;
    const addedLabels = [];
    updatedLabels.map(updatedLabel => {
      let added = true;      
      labels.map(label => {
        if(label.data().title === updatedLabel) added = false;
      })
      if(added) addedLabels.push(updatedLabel);
    })
    return addedLabels;
  }


  closeUpdate = () => {
    this.setState({ isUpdateOpen: false });
  }
  openUpdate = () => {
    this.setState({ isUpdateOpen: true });
    this.handleExtraVisible();
  }

  updationAnimate = () => {
    this.setState({ updationAnimation: 'updation-animate' }, () => {
      setTimeout(() => this.setState({ updationAnimation: '' }), 1000);
    })
  }

  updateButtons = () => {
    const { isUpdateOpen, updating } = this.state;
    if(isUpdateOpen){
      if(updating){
        return(
          <div className="update-buttons">
            <LoadingCircle />
          </div>
        )
      } else {
        return(
          <div className="update-buttons mt-3">
            <button onClick={this.closeUpdate}><FaLongArrowAltLeft className="mr-3"/> Vazgeç</button>
            <button className="create-button ml-3" onClick={this.submitUpdate}>Güncelle</button>
          </div>
        )
      }
    } else {
      return null
    }
  }

  onChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value }, () => {
      this.setState({ [name+'Error']: (value.length > 0) ? false : 'Bu alan boş bırakılamaz' })
    });
  }

  onLabelInputChange = () => {
    const { value } = event.target;
    const { updatedLabels } = this.state;
    this.setState({ updatedLabels: value.split(','), updatedLabelsError: updatedLabels.length > 5 ? 'Bir anlatıma en fazla 5 etiket eklenebilir.' : false })
  }

  reportedSuccessfully = () => {
    return(
      <div className="knowledge-report-modal">
        <svg id="successAnimation" className="animated" xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 70 70">
          <path id="successAnimationResult" fill="#D8D8D8" d="M35,60 C21.1928813,60 10,48.8071187 10,35 C10,21.1928813 21.1928813,10 35,10 C48.8071187,10 60,21.1928813 60,35 C60,48.8071187 48.8071187,60 35,60 Z M23.6332378,33.2260427 L22.3667622,34.7739573 L34.1433655,44.40936 L47.776114,27.6305926 L46.223886,26.3694074 L33.8566345,41.59064 L23.6332378,33.2260427 Z"/>
          <circle id="successAnimationCircle" cx="35" cy="35" r="24" stroke="#979797" strokeWidth="2" strokeLinecap="round" fill="transparent"/>
          <polyline id="successAnimationCheck" stroke="#979797" strokeWidth="2" points="23 34 34 43 47 27" fill="transparent"/>
        </svg>
        <p className="mx-3">Şikayetiniz için teşekkür ederiz, sizin gibi iyi kullanıcılarımız olduğu sürece sırtımız yere gelmez :)</p>
        <button className="mt-5" onClick={this.closeReporting}>
          Bitir
          <FaLongArrowAltRight className="icon-lg ml-3" />
        </button>
      </div>
    )
  }

  reportingElement = () => {
    const { reportingOpen, reported, reporting, reportingError, reportDescriptionError } = this.state;
    if(reportingOpen){
      if(reporting) return <div className="knowledge-modal"><LoadingCircle/></div> 
      else{
        if(reportingError) return <div className="knowledge-modal"><p>Şikayet edilirken bir hata meydana geldi</p></div>
        else if(reported) {
          return <div className="knowledge-modal">{this.reportedSuccessfully()}</div>
        }
        else{
          return(
            <div className="knowledge-report-modal">
              <p>Şikayet etme sebebiniz nedir?</p>
              { reportDescriptionError && <p className="error-text mt-3">{reportDescriptionError}</p> }
              <textarea name="reportDescription" className="knowledge-report-textarea" onChange={this.onChange} placeholder="Şikayet sebebi" />
              <div className="knowledge-modal-buttons">
                <button onClick={this.closeReporting}><FaLongArrowAltLeft className="mr-3"/> Vazgeç</button>
                <button onClick={this.submitReport}>Şikayet et</button>
              </div>
            </div>
          )
        }
      }
    } else { 
        return null;
    }
  }

  submitReport = async () => {
    if(this.validateReport()){
      this.setState({ reporting: true });
      const description = this.state.reportDescription;
      const reportedItem = this.props.knowledge.dbObject.id;
      const author = this.props.user.id;
      const createdAt = new Date();
      const report = { description, reportedItem, author, createdAt}
      const status = await Report.create(report);
      status ? await this.setState({ reported: true }) : await this.setState({ reportingError: true })
      this.setState({ reporting: false });
    } else {
      this.setState({ reportDescriptionError: "Bu alan boş bırakılamaz." });
    }
  }

  validateReport = () => {
    return this.state.reportDescription.length <= 0 ? false : true
  }

  openReporting = () => {
    this.setState({ reportingOpen: true });
    this.handleExtraVisible()
  }
  
  closeReporting = () => {
    this.setState({ reportingOpen: false })
  }

  extraButtons = () => {
    const { user, knowledge } = this.props;
    if(user && (user.id === knowledge.author.id || user.data().type === 0)){
      return(
        <div className="knowledge-extra">
          <button onClick={this.openDeletion}>Sil</button>
          <button onClick={this.openUpdate}>Düzenle</button>
          <button onClick={this.openReporting}>Şikayet et</button>
        </div>
      )
    } else {
      return(
        <div className="knowledge-extra">
          <button onClick={this.openReporting}>Şikayet et</button>
        </div>
      )
    }
  }


  render() {
    const { user, knowledge, className, page } = this.props;
    const { isExtraVisible, deleted, isUpdateOpen, updationAnimation, updatedTitle, updatedTitleError, 
      updatedSource, updatedSourceError, updatedSummary, updatedSummaryError, updatedLabels, updatedLabelsError
    }  = this.state;
    return (
      <div className={`knowledge ${deleted ? "deletion-animate" : null} ${className} ${updationAnimation}`}>
        {this.deletionElement()}
        {this.reportingElement()}
        <div className="knowledge-header">
          <div className="knowledge-author">
            <img src={knowledge.author.data().photoURL} alt={`aninf ${knowledge.author.displayName}`} />
            <p><span className="bold">{knowledge.author.data().displayName.split(" ")[0]}</span> anlattı:</p>
          </div>
          <button className="p-0" onClick={this.handleExtraVisible}><FaEllipsisH /></button>
          { isExtraVisible && this.extraButtons() }
        </div>
        <div className={`knowledge-body`}>
          {isUpdateOpen ? 
            <div>
              {updatedTitleError && <p className="error-text">{updatedTitleError}</p> }
              <input value={updatedTitle} name="updatedTitle" onChange={this.onChange} />
            </div>
          :
            <h4 className="bold mb-3">{knowledge.dbObject.data().title}</h4>
          }
          {isUpdateOpen ? 
            <div>
              {updatedSummaryError && <p className="error-text">{updatedSummaryError}</p> }
              <textarea value={updatedSummary} name="updatedSummary" onChange={this.onChange}/>
            </div>
          :
            <React.Fragment>
              <p>{knowledge.dbObject.data().summary}</p>
              { !page && <Link href={`/anlatim/${this.state.url}`}><a className="mt-5 p-0 fs-small td-under">Görüntüle <FaLongArrowAltRight className="ml-3" /></a></Link> }
            </React.Fragment>
          }
        </div>
        <div className="knowledge-source">
          <FaLink className="mr-3"/>
          {isUpdateOpen ?
            <div>
              {updatedSourceError && <p className="error-text">{updatedSourceError}</p> }
              <input value={updatedSource} name="updatedSource" onChange={this.onChange} />
            </div>
          :
            <a href={knowledge.dbObject.data().source} className="cf-blue" target="_blank">{knowledge.dbObject.data().source}</a>
          } 
        </div> 
        <div className="labels">
          <FaTags className="mr-3" />
          {isUpdateOpen ? 
            <React.Fragment>
              {this.state.updatedLabels.map((label, index) => {
                return <span key={index} className="label">{label}</span>
              })}
            </React.Fragment>
            : 
            <React.Fragment>
              {knowledge.labels.map((label, index) => {
                return <Link key={index} href={`/etiket/${label.data().title}`}><a key={index} className="label">{label.data().title}</a></Link>
              })}
            </React.Fragment>
          }
        </div>  
        {isUpdateOpen && 
          <div>
            {updatedLabelsError && <p className="error-text">{updatedLabelsError}</p>}
            <input name="label" placeholder="Etiket başlığı" value={updatedLabels.join(',')} onChange={this.onLabelInputChange} className={updatedLabelsError ? "border-red" : ""} placeholder="Etiket başlığı" />
          </div>
        }
        { this.updateButtons() }
      </div>
    )
  }
}
