import React, { Component } from 'react'
// Services
import { Knowledge } from '../services/Knwoledge';
// Components
import { LoadingCircle } from './LoadingCircle';
// Icons
import { FaLongArrowAltLeft, FaLink, FaTwitter, FaFacebook, FaWhatsapp, FaEllipsisH } from 'react-icons/fa';

export default class KnowledgeItem extends Component {

  state={
    isExtraVisible : false,
    deletionStep   : 1,
    deleting       : false,
    deleted        : false,
    deletionError  : false,
  }

  submitDeletion = async (id) => {
    this.setState({ deleting: true });
    const status = await Knowledge.delete(id);
    if(!status) this.setState({ deletionError: true });
    else this.props.remove(id);
    this.setState({ deleted: true });
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
      if(deleting) return <div className="deletion"><LoadingCircle/></div>
      else{
        if(deletionError) return <div className="deletion"><p>İçerik silinirken bir hata meydana geldi</p></div>
        else{
          return(
            <div className="deletion">
              <p>İçeriği silmek istediğine emin misin?</p>
              <div className="deletion-buttons">
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

  render() {
    const { user, knowledge } = this.props;
    const { isExtraVisible }  = this.state;

    return (
      <div key={knowledge.id} className="knowledge">
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
                <button>Düzenle</button> 
              }
              <button>Şikayet et</button>
            </div>
          }
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
  }
}
