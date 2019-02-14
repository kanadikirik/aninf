import React from 'react'
import App, { Container } from 'next/app'
import '../static/css/main.scss'

// Services
import { User } from '../services/User';

export default class MyApp extends App {
  static async getInitialProps({ Component, router, ctx }) {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return { pageProps }
  }

  componentDidMount = () => {
    this.checkCurrentUser();
  }
  
  state={
    loaded: false,
    user: false,
  }

  signIn = async () => {
    const user = await User.signIn();
    if(user) this.setState({ user });
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
        <Component loaded={loaded} user={user} signIn={this.signIn} {...pageProps} />
      </Container>
    )
  }
}