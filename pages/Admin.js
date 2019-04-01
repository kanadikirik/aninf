import Head from 'next/head'
// Services
import { User } from '../services/User';
// Components
import AdminHeader     from '../components/headers/AdminHeader';
import AdminKnowledges from '../components/admin/AdminKnowledges';
import AdminUsers      from '../components/admin/AdminUsers';
import AdminReports    from '../components/admin/AdminReports';
// Styles
import '../static/css/admin.scss';

export default class Admin extends React.Component {

  componentDidMount = () => {
    User.checkCurrent(user => {
      if(!user){
        window.location.href = '/'
      } else if(user.data().type !== 0) {
        window.location.href = '/'      
      }
    })
  }
  

  render() {
    const { user, signOut } = this.props;
    if(user && user.data().type === 0){
      this.element = 
        <div className="admin">
          <Head>
            <meta name="robots" content="noindex" />
            <title>Admin | aninf</title>
          </Head>
          <AdminHeader user={user} signOut={signOut}/>
          <div className="admin-content">
            <AdminKnowledges user={user} />
            <AdminUsers />
            <AdminReports />
          </div>
        </div>
    } else {
      return null;
    }
    return (
      this.element
    )
  }
}


