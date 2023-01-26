import React, { useState } from "react";
import { useRouter } from "next/router";
import useFetchContent from "../../hooks/useFetchContent";
import Link from "next/link";

import { RightArrow } from "../../public/static/vectors";
import CSSTransitionGroup from "react-transition-group/CSSTransitionGroup";
import ClipLoader from "react-spinners/ClipLoader";
import { urlFor } from "../../lib/client";
import moment from "moment";

const PostDetails = () => {
  const router = useRouter();
  const { id } = router.query;

  const queries = `*[_type == 'post' && _id == '${id}'][0]`;
  const [isMenuActive, setIsMenuActive] = useState(false);
  const { posts, loading } = useFetchContent(queries);
  const imageSrc = posts && posts.mainImage ? urlFor(posts.mainImage) : "";
  const showMenu = (show) => {
    setIsMenuActive(show);
  };

  return (
    <div className="blog-details">
      <div className="blog-image">
        {loading ? (
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
        ) : (
          <div
            className="container"
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
            }}
          >
            <img src={imageSrc} alt="" rel="preload" />
            <Link href="/blog">
              <a>
                <span className="back">
                  <RightArrow />
                </span>
              </a>
            </Link>
            <div
              className="header-icon-container hamburger-menu right-menu"
              onClick={() => this.showMenu(true)}
            >
              <span></span>
            </div>
            <CSSTransitionGroup
              transitionName="header-menu-animation"
              transitionEnterTimeout={500}
              transitionLeaveTimeout={300}
            >
              {isMenuActive && <HeaderMenu showMenu={this.showMenu} />}
            </CSSTransitionGroup>
          </div>
        )}
      </div>

      <div className="blog-info">
        <div className="container">
          <p>{moment(posts?.publishedAt).format("MMM Do YY")}</p>
          
          <div className="body-content" style={{ paddingTop: 30 }}>
            <p className="">{posts?.body}</p>
          </div>
        </div>
      </div>

      <div className="blog-body-section sizes-section">
        {/* <p className="">{posts?.body}</p> */}
      </div>
    </div>
  );
};

export const getServerSidePros = async () => {
  
}

export default PostDetails;
