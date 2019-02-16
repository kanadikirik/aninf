// Services
import { Knowledge } from '../services/Knowledge';
import { User } from '../services/User';
// Components
import { LoadingCircle } from './LoadingCircle'; 
// Icnos
import { FaAngleDown } from 'react-icons/fa';

export default class AdminReportView extends React.Component {

  state={
    reportAuthor  : false,
    reportedItem  : false,
    detailsOpen   : false,
    detailsLoading: true,
    loadingError  : false,
  }

  handleDetailsOpen = async () => {
    const { reportAuthor, reportedItem, loadingError } = this.state;
    if((!reportAuthor && !reportedItem) || loadingError){
      await this.getReportDetails();
    } 
    this.setState({ detailsOpen: !this.state.detailsOpen });
  }

  getReportDetails = async (id) => {
    await this.getReportAuthor();
    if(this.state.reportAuthor){
      await this.getReportedItem();
      if(!this.state.reportedItem){
        await this.setState({ loadingError: true });
      }
    } else {
      await this.setState({ loadingError: true })
    }
    this.setState({ detailsLoading: false });
  }

  getReportedItem = async () => {
    const reportedItem = await Knowledge.findByID(this.props.report.data().reportedItem);
    await this.setState({ reportedItem })
  }

  getReportAuthor = async () => {
    const reportAuthor = await User.findByID(this.props.report.data().author);
    console.log(reportAuthor)
    await this.setState({ reportAuthor })
  }

  reportDetails = () => {
    const { detailsLoading, loadingError, reportAuthor, reportedItem } = this.state;
    if(detailsLoading){
      return <div className="admin-report-details"><LoadingCircle /></div>
    } else {
      if(loadingError){
        return <p>Detaylar yüklenirken hata meydana geldi</p>
      } else {
        return(
          <div className="admin-report-details">
            <div className="admin-report-author">
              <p className="bold">{reportAuthor.displayName}</p>
              <p>{reportAuthor.email}</p>
              <p>{reportAuthor.id}</p>
            </div>
            <div className="admin-report-knowledge">
              <div className="admin-report-knowledge-author">
                <p className="bold">{reportedItem.title}</p>
                <p className="my-3">{reportedItem.summary}</p>
                <p>{reportedItem.source}</p>
              </div>
              <div className="my-3">
                <p className="bold">{reportedItem.author.displayName}</p>
                <p>{reportedItem.author.email}</p>
                <p>{reportedItem.author.id}</p>
              </div>
            </div>
          </div>
        )
      }
    }
  }

  render() {
    const { report } = this.props;
    const { detailsOpen } = this.state;
    return (
      <div key={report.id} className="admin-report-view">
        <div className="admin-report-view-title">
          <p className="bold">{report.data().description}</p>
          <button onClick={this.handleDetailsOpen}><FaAngleDown /></button>
        </div>
        {
          detailsOpen && this.reportDetails()
        }

      </div>
    )
  }
}
