import Head from "../components/Head";

const Main = ({ children }) => (
  <>
    <Head />
    <div className="app">{children}</div>
  </>
);

export default Main;
