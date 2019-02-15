import Link from 'next/link';
// Icons
import { FaAngleDown } from 'react-icons/fa';

export default class Navbar extends React.Component {

  render() {
    const { user } = this.props;
    return (
      <div className="navbar">
        <Link href="/"><a className="m-0"><h1 className="logo">aninf</h1></a></Link>
        <div className="navbar-nav">
          <Link href="/"><a>Ana sayfa</a></Link>
          <Link href="/ekip"><a>Ekip</a></Link>
          { user && 
              <button className="navbar-user">
                <img src={user.photoURL} alt={`aninf ${user.displayName}`} />
                <FaAngleDown />
              </button>
          }
        </div>
      </div>
    )
  }
}
