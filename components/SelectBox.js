// Icons
import { FaAngleDown } from 'react-icons/fa';

export default class SelectBox extends React.Component {
  
  state={
    open: false,
    selected: 'Seçiniz',
  }
  
  open = () => {
    this.setState({ open: !this.state.open })
  }

  select = (option) => {
    this.setState({ selected: option, open: false })
    this.props.select(option);
  }


  render() {
    const { open, selected } = this.state;
    const { options } = this.props
    return (
      <div className="select-box" onClick={this.open}>
        <div className="select-box-head">
          <button>{selected}</button>
          <FaAngleDown className="ml-3 cf-blue" />
        </div>
        {open && 
          <div className="select-box-options">
            {
              options.map((option, index) => {
                return <button key={index} onClick={() => this.select(option)}> {option} </button>
              })
            }
          </div>
        }
      </div>
    )
  }
}
