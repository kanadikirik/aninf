import Link from 'next/link';

export default class Navbar extends React.Component {

  render() {
    return (
      <div className="navbar">
        <h1 className="logo">aninf</h1>
        <div>
          <Link href="/"><a>Ana sayfa</a></Link>
          <Link href="/ekip"><a>Ekip</a></Link>
        </div>
      </div>
    )
  }
}
