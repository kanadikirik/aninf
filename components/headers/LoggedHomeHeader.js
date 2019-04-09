export default class LoggedHomeHeader extends React.Component {
  render() {
    const { user } = this.props;
    return (
      <div className="logged-home-header">
        <div className="logged-home-header-title">
          <div className="logged-home-header-title-text">
            <img src="/static/img/aninf-logo.svg" />
            <p>Hey {user.data().displayName.split(" ")[0]} bak ne diyeceğim, <span className="bold">iyi ki buradasın!</span></p>
          </div>
        </div>
      </div>
    )
  }
}
