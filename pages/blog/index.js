import { useState } from "react";
import { withRouter } from "next/router";
import Main from "../../layouts/Main";
import CSSTransitionGroup from "react-transition-group/CSSTransitionGroup";
import { RightArrow } from "../../public/static/vectors";
import { HeaderMenu } from "../../components/Header";
import { AuthenticationConsumer } from "../../providers/AuthenticationProvider";
import useFetchContent from "../../hooks/useFetchContent";
import { urlFor } from "../../lib/client";
import PostItem from "../../components/Blogs/Posts";
import ClipLoader from "react-spinners/ClipLoader";
import moment from "moment";

const Blogs = (props) => {
  const query = "*[_type == 'post']";
  const [isMenuActive, setIsMenuActive] = useState(false);
  const { posts, loading } = useFetchContent(query);
  const { router } = props;

  const showMenu = (show) => {
    setIsMenuActive(show);
  };

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
              <div className="title">Blogs</div>
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
                    key={post._id}
                    name={post.title}
                    image={urlFor(post.mainImage)}
                    date={moment(post?.publishedAt).format("MMM Do YY")}
                    onClick={() => router.push(`/blog/${post._id}`)}
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
