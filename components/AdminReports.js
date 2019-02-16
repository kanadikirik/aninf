// Services
import { Report } from '../services/Report';
// Components
import { LoadingCircle } from './LoadingCircle'; 
import AdminReportView   from './AdminReportView';

export default class AdminReports extends React.Component {

  state={
    reports         : [],
    reportsError    : false,
    reportsLoading  : true,
    loadingMore     : false,
    loadMoreMessage : 'Daha fazla yükle',
  }

  componentDidMount = async () => {
    const reports = await Report.paginate(0, 5);
    if(!reports) this.setState({ reportsError: true })
    this.setState({ reports, reportsLoading: false });
  }

  loadMore = async () => {
    this.setState({ loadingMore: true });
    const { reports } = this.state;
    const moreReports = await Report.paginate(reports[reports.length-1], 5);
    if(moreReports){
      if(moreReports.length > 0){
        this.setState({ reports: [...reports, ...moreReports], loadMoreMessage: 'Daha fazla göster' })
      } else {
        this.setState({ loadMoreMessage: 'Gösterilecek daha fazla şikayet yok' })
      }
    } else {
      this.setState({ loadMoreMessage: 'Daha fazla şikayet yüklenirken hata meydana geldi!' })
    }
    this.setState({ loadingMore: false });
  }

  reportsList = () => {
    const { reportsLoading, reportsError, reports } = this.state;
    if(reportsLoading){
      return <div className="admin-reports-list"><LoadingCircle /></div>
    } else {
      if(reportsError){
        return <div className="admin-reports-list"><p>Kullanıcılar yüklenirken hata meydana geldi</p></div>
      } else {
          if(reports.length === 0){
            return <div className="admin-reports-list"><p>Kullanıcı bulunamadı</p></div>
          } else {
            return(
              <div className="admin-reports-list">
                {
                  reports.map(report => {
                    return(
                      <AdminReportView report={report} />
                    )
                  })
                }
              </div>
            )
          }
      }
    }
  }
  
  render() {
    const { loadMoreMessage, loadingMore } = this.state;
    return (
      <div className="admin-reports">
        <h2>Şikayetler</h2>
        {this.reportsList()}
        {loadingMore ? <div><LoadingCircle /></div> : <button className="load-more" onClick={this.loadMore}>{loadMoreMessage}</button>}
      </div>
    )
  }
}