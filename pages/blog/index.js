import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { useState } from "react";
import { useRouter } from "next/router";
import Main from "../../layouts/Main";
import CSSTransitionGroup from "react-transition-group/CSSTransitionGroup";
import { RightArrow } from "../../public/static/vectors";
import { HeaderMenu } from "../../components/Header";
import PostItem from "../../components/Blogs/Posts";
import moment from "moment";

const POSTS_DIR = path.join(process.cwd(), "content/posts");

const Blogs = ({ posts }) => {
  const router = useRouter();
  const [isMenuActive, setIsMenuActive] = useState(false);

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
                onClick={() => router.push("/", undefined, { shallow: true })}
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
            <div className="shop-section">
              <div className="section-items">
                {posts.map((post) => (
                  <PostItem
                    key={post.slug}
                    name={post.title}
                    image={post.coverImage || null}
                    date={
                      post.publishedAt
                        ? moment(post.publishedAt).format("LL")
                        : ""
                    }
                    onClick={() => router.push(`/blog/${post.slug}`)}
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

export async function getStaticProps() {
  const files = fs.existsSync(POSTS_DIR)
    ? fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".mdx"))
    : [];

  const posts = files
    .map((filename) => {
      const slug = filename.replace(/\.mdx$/, "");
      const raw = fs.readFileSync(path.join(POSTS_DIR, filename), "utf-8");
      const { data } = matter(raw);
      return {
        slug,
        title: data.title || "",
        description: data.description || "",
        publishedAt: data.publishedAt ? data.publishedAt.toString() : null,
        coverImage: data.coverImage || null,
      };
    })
    .sort((a, b) => {
      if (!a.publishedAt) return 1;
      if (!b.publishedAt) return -1;
      return new Date(b.publishedAt) - new Date(a.publishedAt);
    });

  return { props: { posts }, revalidate: 60 };
}

export default Blogs;
