// TinaCMS admin — redirects to the static admin bundle built by `tinacms build`
export default function TinaAdmin() {
  return null;
}

export function getServerSideProps() {
  return {
    redirect: {
      destination: "/admin/index.html",
      permanent: false,
    },
  };
}
