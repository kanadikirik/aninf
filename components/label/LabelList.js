import Link from 'next/link'
import PropTypes from 'prop-types'
// Services
import { Label } from '../../services/Label';
// Components
import { LoadingCircle } from '../LoadingCircle';

export default class LabelList extends React.Component {

  static propTypes = {
    Populars: PropTypes.bool,
    All: PropTypes.bool,
  }
  
  state={
    labels: [],
    status: 'building',
    loadStatus: 'normal',
    startAfter: 0,
  }

  componentDidMount() {
    this.build();
  }
  
  build = async () => {
    const { Populars, All } = this.props;
    if(Populars){
      await Label.getPopulars()
      .then(labels => {
        this.setState({ labels, status: 'normal' })
      })
      .catch(err => {
        this.setState({ status: 'error' })
      })
    }
  }

  listElement = () => {
    const { status, labels } = this.state;
    if(status === "building"){
      return <LoadingCircle/>
    } else {
      if(status === "error"){
        return <span className="error-text">Etiketler yüklenirken hata meydana geldi!</span>
      } else {
        return(
          labels.map(label => {
            return(
              <Link key={label.id} href={`/etiket/${label.data().title}`}>
                <a className="label">
                  <p>{label.data().title} ({label.data().count})</p>
                </a>
              </Link>
            )
          })
        )
      }
    }
  }

  render() {
    const { Populars } = this.props;

    return (
      <div className="label-list">
        <p className="bold fs-med"><span className="cf-blue">{Populars ? "Popüler" : "Tüm"}</span> etiketler</p>
        <div className="label-list-content">
          { this.listElement() }
        </div>
      </div>
    )
  }
}
