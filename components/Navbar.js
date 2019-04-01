import Link from 'next/link';
// Icons
import { FaAngleDown, FaAngleUp, FaSignOutAlt, FaGoogle } from 'react-icons/fa';

export default class Navbar extends React.Component {

  state={
    isMenuOpen: false,
  }

  handleMenuOpen = () => {
    this.setState({ isMenuOpen: !this.state.isMenuOpen })
  }

  menuElement = () => {
    const { isMenuOpen } = this.state;
    const { signOut } = this.props;
    if(isMenuOpen){
      return(
        <div className="navbar-menu">
          <button onClick={signOut}>Çıkış yap <FaSignOutAlt/></button>
        </div>
      )
    } else {
      return null;
    }
  }

  render() {
    const { user, signIn } = this.props;
    const { isMenuOpen } = this.state;    
    return (
      <div className="navbar">
        <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/"><a className="m-0"><h1 className="logo">aninf</h1></a></Link>
          {!user &&
            <button onClick={signIn} className="google-login-button">
              <FaGoogle className="icon mr-2" />
              <span className="fs-small">Oturum aç</span>
            </button>
          }
        </div>
        <div className="navbar-nav">
          { user && 
              <div>
                <button className="navbar-user" onClick={this.handleMenuOpen}>
                  <img src={user.data().photoURL} alt={`aninf ${user.displayName}`} />
                  {isMenuOpen ? <FaAngleUp /> : <FaAngleDown />}
                </button>
                {this.menuElement()}
              </div>
          }
        </div>
      </div>
    )
  }
}
