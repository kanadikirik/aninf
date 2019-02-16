import Link from 'next/link';
// Icons
import { FaAngleDown, FaAngleUp, FaSignOutAlt, FaPen, FaArchive } from 'react-icons/fa';

export default class Navbar extends React.Component {

  state={
    isMenuOpen: false,
  }

  handleMenuOpen = () => {
    this.setState({ isMenuOpen: !this.state.isMenuOpen })
  }

  menuElement = () => {
    const { isMenuOpen } = this.state;
    if(isMenuOpen){
      return(
        <div className="navbar-menu">
          <button >Anlattıklarım <FaArchive/></button>
          <button>Hemen anlat <FaPen/></button>
          <button>Çıkış yap <FaSignOutAlt/></button>
        </div>
      )
    } else {
      return null;
    }
  }

  render() {
    const { user } = this.props;
    const { isMenuOpen } = this.state;    
    return (
      <div className="navbar">
        <Link href="/"><a className="m-0"><h1 className="logo">aninf</h1></a></Link>
        <div className="navbar-nav">
          <Link href="/"><a>Ana sayfa</a></Link>
          <Link href="/iletisim"><a>İletişim</a></Link>
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
