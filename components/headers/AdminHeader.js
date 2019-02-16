// Components
import Navbar from '../Navbar';
import AdminSearch     from '../AdminSearch';

export default class AdminHeader extends React.Component {
  render() {
    const { user } = this.props;
    return (
      <div className="admin-header">
        <Navbar user={user} />
        <div className="admin-header-content">
          <AdminSearch />
        </div>
      </div>
    )
  }
}
