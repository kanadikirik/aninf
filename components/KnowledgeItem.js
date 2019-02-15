import React, { Component } from 'react'
// Services
import { Knowledge } from '../services/Knowledge';
// Components
import { LoadingCircle } from './LoadingCircle';
// Icons
import { FaLongArrowAltLeft, FaLink, FaTwitter, FaFacebook, FaWhatsapp, FaEllipsisH } from 'react-icons/fa';

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
    updationAnimation   : ''
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


  render() {
    const { user, knowledge } = this.props;
    const { isExtraVisible, deleted, isUpdateOpen, updationAnimation, updatedTitle, updatedTitleError, 
      updatedSource, updatedSourceError, updatedSummary, updatedSummaryError 
    }  = this.state;
    return (
      <div className={`knowledge ${deleted ? "deletion-animate" : null} ${updationAnimation}`}>
        {this.deletionElement()}
        <div className="knowledge-header">
          <div className="knowledge-author">
            <img src={knowledge.author.photoURL} alt={`aninf ${knowledge.author.displayName}`} />
            <p><span className="bold">{knowledge.author.displayName.split(" ")[0]}</span> anlattı:</p>
          </div>
          <button className="p-0" onClick={this.handleExtraVisible}><FaEllipsisH /></button>
          {
            isExtraVisible &&
            <div className="knowledge-extra">
              { 
                user.id === knowledge.author.id && 
                <button onClick={this.openDeletion} className="">Sil</button> 
              }
              { 
                user.id === knowledge.author.id && 
                <button onClick={this.openUpdate}>Düzenle</button> 
              }
              <button>Şikayet et</button>
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
            <h4 className="bold mb-3">{knowledge.title}</h4>
          }
          {isUpdateOpen ? 
            <div>
              {updatedSummaryError && <p className="error-text">{updatedSummaryError}</p> }
              <textarea value={updatedSummary} name="updatedSummary" onChange={this.onChange}/>
            </div>
          :
            <p>{knowledge.summary}</p>
          }
        </div>
        <div className="knowledge-source">
          <FaLink className="mr-3"/>
          { isUpdateOpen ?
            <div>
              {updatedSourceError && <p className="error-text">{updatedSourceError}</p> }
              <input value={updatedSource} name="updatedSource" onChange={this.onChange} />
            </div>
          :
            <a href={knowledge.source} className="cf-blue">{knowledge.source}</a>
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
