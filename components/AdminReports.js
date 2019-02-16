// Services
import { Report } from '../services/Report';
// Components
import { LoadingCircle } from './LoadingCircle'; 

export default class AdminReports extends React.Component {

  state={
    reports: [],
    reportsError    : false,
    reportsLoading  : true,
    loadingMore : false,
    loadMoreMessage : 'Daha fazla yükle',
  }

  componentDidMount = async () => {
    const reports = await Report.paginate(0, 2);
    if(!reports) this.setState({ reportsError: true })
    this.setState({ reports, reportsLoading: false });
  }

  loadMore = async () => {
    this.setState({ loadingMore: true });
    const { reports } = this.state;
    const morereports = await Report.paginate(reports[reports.length-1], 2);
    if(morereports){
      if(morereports.length > 0){
        this.setState({ reports: [...reports, ...morereports], loadMoreMessage: 'Daha fazla göster' })
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
                      <div key={report.id} className="admin-report-view">
                        <p>{report.data().description}</p>
                      </div>
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