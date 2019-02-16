export default class AdminUserView extends React.Component {
  render() {
    const { user } = this.props;
    return (
      <div key={user.id} className="admin-user-view">
        <img src={user.data().photoURL} />
        <div>
          <p className="bold">{user.data().displayName}</p>
          <p>{user.data().email}</p>
          <p>{user.id}</p>
        </div>
      </div>
    )
  }
}
