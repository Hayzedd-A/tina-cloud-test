import { useState } from "react";
import { withRouter } from "next/router";
import Main from "../../layouts/Main";
import CSSTransitionGroup from "react-transition-group/CSSTransitionGroup";
import { RightArrow } from "../../public/static/vectors";
import { HeaderMenu } from "../../components/Header";
import { AuthenticationConsumer } from "../../providers/AuthenticationProvider";
import useFetchBlogs from "../../hooks/useFetchBlogs";
import PostItem from "../../components/Blogs/Posts";
import ClipLoader from "react-spinners/ClipLoader";
import moment from "moment";

const Blogs = (props) => {
  const url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/blogs?populate=*`;
  const [isMenuActive, setIsMenuActive] = useState(false);
  const { posts, loading } = useFetchBlogs(url);
  const { router } = props;

  const showMenu = (show) => {
    setIsMenuActive(show);
  };

  console.log("STRAPI_URL:", process.env.NEXT_PUBLIC_STRAPI_URL);

  return (
    <div className="shop-container" id="shop-container">
      <Main>
        <div
          className="cart-container login-container"
          style={{ overflow: "visible" }}
        >
          <div className="cart-header login-header">
            <div
              className="container login-header-inner"
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                className="back"
                onClick={() =>
                  router.push(`/`, undefined, {
                    shallow: true,
                  })
                }
              >
                <RightArrow />
              </div>
              <div className="title">Gourmet Twist Blog</div>
              <div
                className="header-icon-container hamburger-menu right-menu"
                style={{ top: "-5px" }}
                onClick={() => showMenu(true)}
              >
                <span></span>
              </div>

              <CSSTransitionGroup
                transitionName="header-menu-animation"
                transitionEnterTimeout={500}
                transitionLeaveTimeout={300}
              >
                {isMenuActive && <HeaderMenu showMenu={showMenu} />}
              </CSSTransitionGroup>
            </div>
          </div>

          <div className="container" style={{ marginTop: 20 }}>
            {loading && (
              <div
                style={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <ClipLoader color={"#000"} loading={true} size={50} />
              </div>
            )}

            <div className="shop-section">
              <div className="section-items">
                {posts.map((post) => (
                  <PostItem
                    key={post.id}
                    name={post.attributes.title}
                    image={`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${post.attributes.image.data.attributes.formats.small.url}`}
                    date={moment(post.attributes.publishedDate).format("LL")}
                    onClick={() => router.push(`/blog/${post.id}`)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Main>
    </div>
  );
};

export default AuthenticationConsumer(withRouter(Blogs));
