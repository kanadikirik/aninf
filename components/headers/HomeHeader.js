// Components
import { LoadingCircle } from '../LoadingCircle';
// Icons
import { FaGoogle } from 'react-icons/fa';

export default class HomeHeader extends React.Component {

  headerElement = () => {
    const { loaded, user, signIn } = this.props;
    if(loaded){
      if(user){
        return null;
      } else {
        <div className="home-header">
          <div className="home-header-text">
            <h2>Burada herkes <span className="cf-blue">bugün ne öğrendiğini</span> anlatıyor.</h2>
            <h2>Anlatmaya hazır mısın?</h2>
            <div className="login-buttons">
              <button onClick={signIn} className="google-login-button">
                <FaGoogle className="icon mr-2" />
                Google ile oturum aç
              </button>
            </div>
          </div>
          <img src="/static/img/header-img2.svg" alt="aninf paylaşmaya hazır mısın?" />
        </div>
      }
    } else {
      return <LoadingCircle /> 
    }
  }

  render() {
    return (
      this.headerElement()
    )
  }
}