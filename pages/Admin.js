// Components
import AdminHeader from '../components/headers/AdminHeader';
import AdminKnowledges from '../components/AdminKnowledges';
import AdminUsers from '../components/AdminUsers';
import AdminReports from '../components/AdminReports';
// Styles
import '../static/css/admin.scss';

export default class Admin extends React.Component {

  render() {
    const { user } = this.props;
    return (
      <div className="admin">
        <AdminHeader user={user}/>
        <div className="admin-content">
          <AdminKnowledges user={user} />
          <AdminUsers />
          <AdminReports />
        </div>
      </div>
    )
  }
}


