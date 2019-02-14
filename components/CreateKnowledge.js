// Services
import { Knowledge } from "../services/Knwoledge";
// Components
import Modal from './Modal';
import { LoadingCircle } from './LoadingCircle';
// Icons
import { FaLongArrowAltLeft, FaLongArrowAltRight } from 'react-icons/fa';

export default class CreateKnowledge extends React.Component {

  state={
    focusedInput  : '',
    title         : '',
    titleError    : '',
    summary       : '',
    summaryError  : '',
    source        : '',
    sourceError   : '',
    creating      : false,
    creatingError : false,
    created       : false,
  }

  onChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  controlEmptiness = () => {
    let status = true;
    const inputs =  { title:{}, summary:{}, source:{} };
    for(const input in inputs){
      const value = this.state[input];
      if(value.length <= 0){
        this.setState({ [input+"Error"]: 'Bu alan boş bırakılamaz' });
        status = false;
      }
    }
    return status;
  }

  create = async () => {
    const emptinessControl = this.controlEmptiness();
    if(emptinessControl){
      await this.setState({ creating: true });
      const { title, summary, source } = this.state;
      const author = this.props.user.id;
      const createdAt = new Date();
      const knowledge = {title, summary, source, createdAt, updatedAt: createdAt, author};
      const status = await Knowledge.create(knowledge);
      status ? await this.setState({ created: true }) : await this.setState({ creatingError: true });
      this.setState({ creating: false });
    }
  }

  creationForm = () => {
    const { titleError, summaryError, sourceError } = this.state;
    return(
      <div className="creation-form">
        <h3 className="mb-3">Bugün ne öğrendin?</h3>
        <span>Başlık</span>
        {titleError && <span className="error-text">{titleError}</span>}
        <input name="title" onChange={this.onChange} className={titleError && "border-red"} placeholder="Öğrendiğin konunun başlığı nedir?" />
        <span>Özet</span>
        {summaryError && <span className="error-text">{summaryError}</span>}
        <textarea name="summary" onChange={this.onChange} className={summaryError && "border-red"} placeholder="Öğrendiğini özetleyebilir misin?" />
        <span>Kaynak</span>
        {sourceError && <span className="error-text">{sourceError}</span>}
        <input name="source" onChange={this.onChange} className={sourceError && "border-red"} placeholder="Bu bilgiyi nereden edindin?" />
        { this.state.creating ?           
            <LoadingCircle className="mt-3" />
          :
            <div className="creation-form-buttons">
              <button onClick={() => this.props.setVisibility(false)}>
                <FaLongArrowAltLeft className="icon-lg mr-3" />
                Vazgeç
              </button>
              <button onClick={this.create}>
                Oluştur
              </button>
            </div>
        }
      </div>
    ) 
  }

  createdSuccessfully = () => {
    return(
      <div className="created-successfully">
        <svg id="successAnimation" className="animated" xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 70 70">
          <path id="successAnimationResult" fill="#D8D8D8" d="M35,60 C21.1928813,60 10,48.8071187 10,35 C10,21.1928813 21.1928813,10 35,10 C48.8071187,10 60,21.1928813 60,35 C60,48.8071187 48.8071187,60 35,60 Z M23.6332378,33.2260427 L22.3667622,34.7739573 L34.1433655,44.40936 L47.776114,27.6305926 L46.223886,26.3694074 L33.8566345,41.59064 L23.6332378,33.2260427 Z"/>
          <circle id="successAnimationCircle" cx="35" cy="35" r="24" stroke="#979797" strokeWidth="2" strokeLinecap="round" fill="transparent"/>
          <polyline id="successAnimationCheck" stroke="#979797" strokeWidth="2" points="23 34 34 43 47 27" fill="transparent"/>
        </svg>
        <p>Binlerce insanın kendini geliştirmesine yardımcı olduğun için teşekkürler.</p>
        <button className="mt-5" onClick={() => this.props.setVisibility(false)}>
          Bitir
          <FaLongArrowAltRight className="icon-lg ml-3" />
        </button>
      </div>
    )
  }

  createdFailure = () => {
    return(
      <div className="created-failure">
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="70" height="70" viewBox="0 0 130.2 130.2">
          <circle class="failure-path circle" fill="none" stroke="#D06079" stroke-width="6" stroke-miterlimit="10" cx="65.1" cy="65.1" r="62.1"/>
          <line class="failure-path line" fill="none" stroke="#D06079" stroke-width="6" stroke-linecap="round" stroke-miterlimit="10" x1="34.4" y1="37.9" x2="95.8" y2="92.3"/>
          <line class="failure-path line" fill="none" stroke="#D06079" stroke-width="6" stroke-linecap="round" stroke-miterlimit="10" x1="95.8" y1="38" x2="34.4" y2="92.2"/>
        </svg>
        <p className="mt-5">Oluşturulma sırasında hata meydana geldi. Ama merak etme <span className="cf-blue">anlattıklarını taslaklara kaydettik</span>.</p>
        <div className="created-failure-buttons">
          <button onClick={() => this.props.setVisibility(false)}>
            Tasklarlara göz at
          </button>
          <button className="mt-3" onClick={() => this.props.setVisibility(false)}>
            Bitir
            <FaLongArrowAltRight className="icon-lg ml-3" />
          </button>
        </div>
      </div>
    )
  }

  render() {
    const { creatingError, created } = this.state;

    if(creatingError){
      this.element = this.createdFailure();
    } else if(created){
      this.element = this.createdSuccessfully();
    } else {
      this.element = this.creationForm();
    }

    return (
      <Modal>
        <div className="create-knowledge">
          {this.element}
        </div>
      </Modal>
    )
  }
}
