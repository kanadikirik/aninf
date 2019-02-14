export default class Modal extends React.Component {

  render() {
    const { children } = this.props;
    return (
      <div className="modal">
        <div className="modal-content">
            {children}
        </div>
      </div>
    )
  }
}
