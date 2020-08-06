import Head from "next/head";

const Main = ({ children }) => (
  <>
    <Head>
      <title>Gourmet Twist App</title>
    </Head>

    <div className="app">{children}</div>
  </>
);

export default Main;
