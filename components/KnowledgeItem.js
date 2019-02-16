import React, { Component } from 'react'
// Services
import { Knowledge } from '../services/Knowledge';
// Components
import { LoadingCircle } from './LoadingCircle';
// Icons
import { FaLongArrowAltLeft, FaLongArrowAltRight, FaLink, FaTwitter, FaFacebook, FaWhatsapp, FaEllipsisH } from 'react-icons/fa';
import { Report } from '../services/Report';

export default class KnowledgeItem extends Component {

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
    updatedTitle        : this.props.knowledge.title,
    updatedTitleError   : false,
    updatedSummary      : this.props.knowledge.summary,
    updatedSummaryError : false,
    updatedSource       : this.props.knowledge.source,
    updatedSourceError  : false,
    updationAnimation   : '',
    reportingOpen       : false,
    reporting           : false,
    reported            : false,
    reportingError      : false,
    reportDescription   : '',
  }
  

  submitDeletion = async (id) => {
    this.setState({ deleting: true });
    const status = await Knowledge.delete(id);
    if(!status) this.setState({ deletionError: true });
    else {
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
                <button onClick={() => this.submitDeletion(this.props.knowledge.id)}>Eminim!</button>
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
    const { updatedTitle, updatedTitleError, updatedSummary, updatedSummaryError, updatedSource, updatedSourceError } = this.state;
    if( !updatedTitleError && !updatedSummaryError && !updatedSourceError ){
      await this.setState({ updating: true })
      const status = await Knowledge.update(this.props.knowledge.id, updatedTitle, updatedSummary, updatedSource);
      if(!status) await this.setState({ updationError: true });
      else{
        await this.updationAnimate();
        let { knowledge }   = this.props;
        knowledge.updatedAt = new Date();
        knowledge.title     = updatedTitle;
        knowledge.summary   = updatedSummary;
        knowledge.source    = updatedSource;
        this.props.update(knowledge);
      }
      this.setState({ updated: true, isUpdateOpen: false, updating: false });
    }
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
          <div className="update-buttons">
            <button onClick={this.closeUpdate}><FaLongArrowAltLeft className="mr-3"/> Vazgeç</button>
            <button onClick={this.submitUpdate}>Güncelle</button>
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

  createdSuccessfully = () => {
    return(
      <div className="created-successfully">
        <svg id="successAnimation" className="animated" xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 70 70">
          <path id="successAnimationResult" fill="#D8D8D8" d="M35,60 C21.1928813,60 10,48.8071187 10,35 C10,21.1928813 21.1928813,10 35,10 C48.8071187,10 60,21.1928813 60,35 C60,48.8071187 48.8071187,60 35,60 Z M23.6332378,33.2260427 L22.3667622,34.7739573 L34.1433655,44.40936 L47.776114,27.6305926 L46.223886,26.3694074 L33.8566345,41.59064 L23.6332378,33.2260427 Z"/>
          <circle id="successAnimationCircle" cx="35" cy="35" r="24" stroke="#979797" strokeWidth="2" strokeLinecap="round" fill="transparent"/>
          <polyline id="successAnimationCheck" stroke="#979797" strokeWidth="2" points="23 34 34 43 47 27" fill="transparent"/>
        </svg>
        <p>Şikayetiniz için teşekkür ederiz, sizin gibi iyi kullanıcılarımız olduğu sürece sırtımız yere gelmez :)</p>
        <button className="mt-5" onClick={this.closeReporting}>
          Bitir
          <FaLongArrowAltRight className="icon-lg ml-3" />
        </button>
      </div>
    )
  }

  reportingElement = () => {
    const { reportingOpen, reported, reporting, reportingError } = this.state;
    if(reportingOpen){
      if(reporting) return <div className="knowledge-modal"><LoadingCircle/></div> 
      else{
        if(reportingError) return <div className="knowledge-modal"><p>Şikayet edilirken bir hata meydana geldi</p></div>
        else if(reported) {
          return <div className="knowledge-modal">{this.createdSuccessfully()}</div>
        }
        else{
          return(
            <div className="knowledge-modal">
              <p>Şikayet etme sebebiniz nedir?</p>
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
    this.setState({ reporting: true });
    const description = this.state.reportDescription;
    const reportedItem = this.props.knowledge.id;
    const author = this.props.user.id;
    const createdAt = new Date();
    const report = { description, reportedItem, author, createdAt}
    const status = await Report.create(report);
    status ? await this.setState({ reported: true }) : await this.setState({ reportingError: true })
    this.setState({ reporting: false });
  }

  openReporting = () => {
    this.setState({ reportingOpen: true });
    this.handleExtraVisible()
  }
  
  closeReporting = () => {
    this.setState({ reportingOpen: false })
  }


  render() {
    const { user, knowledge, className } = this.props;
    const { isExtraVisible, deleted, isUpdateOpen, updationAnimation, updatedTitle, updatedTitleError, 
      updatedSource, updatedSourceError, updatedSummary, updatedSummaryError 
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
          {
            isExtraVisible &&
            <div className="knowledge-extra">
              { 
                (user.id === knowledge.author.id || user.type === 0) &&
                <button onClick={this.openDeletion} className="">Sil</button> 
              }
              { 
                (user.id === knowledge.author.id || user.type === 0) &&
                <button onClick={this.openUpdate}>Düzenle</button> 
              }
              <button onClick={this.openReporting}>Şikayet et</button>
            </div>
          }
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
            <p>{knowledge.dbObject.data().summary}</p>
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
            <a href={knowledge.dbObject.data().source} className="cf-blue">{knowledge.dbObject.data().source}</a>
          }
        </div>
        { this.updateButtons() }
        <div className="knowledge-menu">
          <button><FaTwitter className="icon-lg cf-twitter" /></button>
          <button><FaFacebook className="icon-lg cf-facebook" /></button>
          <button><FaWhatsapp className="icon-lg cf-whatsapp" /></button>
        </div>
      </div>
    )
  }
}
