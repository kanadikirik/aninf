// Components
import Navbar from '../Navbar';
import AdminSearch  from '../admin/AdminSearch';

export default class AdminHeader extends React.Component {
  render() {
    const { user, signOut } = this.props;
    return (
      <div className="admin-header">
        <Navbar user={user} signOut={signOut} />
        <div className="admin-header-content">
          <AdminSearch />
        </div>
      </div>
    )
  }
}
