import React, { useState } from "react";
import { useRouter } from "next/router";
import useFetchBlog from "../../hooks/useFetchBlogs";
import Link from "next/link";
import { HeaderMenu } from "../../components/Header";

import { RightArrow } from "../../public/static/vectors";
import CSSTransitionGroup from "react-transition-group/CSSTransitionGroup";
import ClipLoader from "react-spinners/ClipLoader";
import moment from "moment";

const PostDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/blogs/${id}?populate=*`;

  const [isMenuActive, setIsMenuActive] = useState(false);
  const { posts, loading } = useFetchBlog(url);
  let imageSrc;

  if (posts && posts.attributes) {
    const { formats } = posts.attributes.image.data.attributes;
    imageSrc = `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${formats.small.url}`;
  }

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
              onClick={() => showMenu(true)}
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
          <p>{moment(posts?.attributes?.publishedDate).format("LL")}</p>

          <div className="body-content" style={{ paddingTop: 30 }}>
            <h1 className="">{posts?.attributes?.title}</h1>
            <p className="">{posts?.attributes?.text}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetails;
