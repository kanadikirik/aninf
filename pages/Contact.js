// Components
import Navbar from '../components/Navbar';

export default class Contact extends React.Component {
  render() {
    const { user } = this.props;
    return (
      <div className="contact">
        <Navbar />
        <div className="contact-form">
          <h1>İletişim</h1>
          <div className="contact-form-group">
            <p>Konu</p>
            <input />
          </div>
          <p>Mesaj</p>
          <textarea />
          <p>Mail adresi</p>
          <input />
        </div>
      </div>
    )
  }
}
