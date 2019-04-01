import React from 'react'
import App, { Container } from 'next/app'
import '../static/css/main.scss'
// Services
import { User } from '../services/User';
import { Knowledge } from '../services/Knowledge';

export default class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return { pageProps }
  }

  componentDidMount = () => {
    this.checkCurrentUser();
    Knowledge.try();
    // for(let i=0; i<50; i++){
    //   Knowledge.create({
    //     author: '5M9ikiFkblc4OtfaUwqhk63iPht1',
    //     createdAt: Date.now(),
    //     source: 'Lorem Ipsum, dizgi ve baskı endüstrisinde kullanılan mıgır metinlerdir.',
    //     summary:"Lorem Ipsum, dizgi ve baskı endüstrisinde kullanılan mıgır metinlerdir. Lorem Ipsum, adı bilinmeyen bir matbaacının bir hurufat numune kitabı oluşturmak üzere bir yazı galerisini alarak karıştırdığı 1500'lerden beri endüstri standardı sahte metinler olarak kullanılmıştır. Beşyüz yıl boyunca varlığını sürdürmekle kalmamış, aynı zamanda pek değişmeden elektronik dizgiye de sıçramıştır. 1960'larda Lorem Ipsum pasajları da içeren Letraset yapraklarının yayınlanması ile ve yakın zamanda Aldus PageMaker gibi Lorem Ipsum sürümleri içeren masaüstü yayıncılık yazılımları ile popüler olmuştur. Lorem Ipsum, dizgi ve baskı endüstrisinde kullanılan mıgır metinlerdir. Lorem Ipsum, adı bilinmeyen bir matbaacının bir hurufat numune kitabı oluşturmak üzere bir yazı galerisini alarak karıştırdığı 1500'lerden beri endüstri standardı sahte metinler olarak kullanılmıştır. Beşyüz yıl boyunca varlığını sürdürmekle kalmamış, aynı zamanda pek değişmeden elektronik dizgiye de sıçramıştır. 1960'larda Lorem Ipsum pasajları da içeren Letraset yapraklarının yayınlanması ile ve yakın zamanda Aldus PageMaker gibi Lorem Ipsum sürümleri içeren masaüstü yayıncılık yazılımları ile popüler olmuştur.",
    //     title: 'Lorem Ipsum, dizgi ve baskı endüstrisinde kullanılan mıgır metinlerdir.',
    //     updatedAt: Date.now(),
    //   })
    // }
  }
  
  state={
    loaded: false,
    user: false,
  }

  signIn = async () => {
    const user = await User.signIn();
    if(user) this.setState({ user });
  }

  signOut = async () => {
    const user = await User.signOut()
    if(user) this.setState({ user: false })
  }

  checkCurrentUser = async () => {
    User.checkCurrent(async user => {
      if(user) await this.setState({ user });
      this.setState({ loaded: true });
    })
  }

  render () {
    const { Component, pageProps } = this.props
    const { loaded, user } = this.state;
    return (
      <Container>
        <Component loaded={loaded} user={user} signIn={this.signIn} signOut={this.signOut} {...pageProps} />
      </Container>
    )
  }
}