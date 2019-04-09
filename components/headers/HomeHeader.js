// Components
import { LoadingCircle } from '../LoadingCircle';
import LoggedHomeHeader from './LoggedHomeHeader';
// Icons
import { FaGoogle } from 'react-icons/fa';

export default class HomeHeader extends React.Component {

  headerElement = () => {
    const { loaded, user, signIn } = this.props;
    if(loaded){
      if(user){
        return <LoggedHomeHeader user={user} />
      } else {
        return(
          <div className="home-header">
            <img src="/static/img/aninf-logo.svg" alt="aninf paylaşmaya hazır mısın?" />
            <h2>Burada herkes <span className="cf-blue">teknoloji</span> ve <span className="cf-blue">yazılım</span> alanında bildiklerini anlatıyor.</h2>
            <h2 className="mt-1">Anlatmaya hazır mısın?</h2>
            <button onClick={signIn} className="google-login-button mt-5">
              <FaGoogle className="icon mr-2" />
              Google ile oturum aç
            </button>
          </div>
        )
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