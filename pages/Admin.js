// Components
import Navbar from '../components/Navbar';
import AdminKnowledges from '../components/AdminKnowledges';

export default class Admin extends React.Component {



  render() {
    const { user } = this.props;
    return (
      <div>
        <Navbar user={user} />
        <AdminKnowledges user={user} />
      </div>
    )
  }
}


