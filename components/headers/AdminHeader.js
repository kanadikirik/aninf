// Components
import Navbar from '../Navbar';

export default class AdminHeader extends React.Component {
  render() {
    const { user } = this.props;
    return (
      <div className="admin-header">
        <Navbar user={user} />
      </div>
    )
  }
}
