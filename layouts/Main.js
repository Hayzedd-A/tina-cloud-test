import { Component } from "react";
import Head from "next/head";

class Main extends Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    const { children } = this.props;

    return (
      <>
        <Head>
          <title>Best Banana Bread in Lagos v2.0</title>
          <link href="https://cdn.lineicons.com/2.0/LineIcons.css" rel="stylesheet" />
        </Head>

        <div className="app">{children}</div>
      </>
    );
  }
}

export default Main;
