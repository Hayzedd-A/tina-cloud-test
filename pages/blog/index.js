import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Main from "../../layouts/Main";
import CSSTransitionGroup from "react-transition-group/CSSTransitionGroup";
import { RightArrow } from "../../public/static/vectors";
import { HeaderMenu } from "../../components/Header";
import moment from "moment";

const POSTS_DIR = path.join(process.cwd(), "content/posts");

const Blogs = ({ posts }) => {
  const router = useRouter();
  const [isMenuActive, setIsMenuActive] = useState(false);

  return (
    <Main>
      <Head>
        <title>Blog | Gourmet Twist</title>
        <meta name="description" content="Stories, guides, and everything banana bread from Gourmet Twist Lagos." />
      </Head>

      <div className="blog-page">
        {/* header strip */}
        <div className="cart-header login-header" style={{ marginBottom: 0 }}>
          <div
            className="container login-header-inner"
            style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <div className="back" onClick={() => router.push("/", undefined, { shallow: true })}>
              <RightArrow />
            </div>
            <div className="title">Blog</div>
            <div
              className="header-icon-container hamburger-menu right-menu"
              style={{ top: "-5px" }}
              onClick={() => setIsMenuActive(true)}
            >
              <span></span>
            </div>
            <CSSTransitionGroup
              transitionName="header-menu-animation"
              transitionEnterTimeout={500}
              transitionLeaveTimeout={300}
            >
              {isMenuActive && <HeaderMenu showMenu={setIsMenuActive} />}
            </CSSTransitionGroup>
          </div>
        </div>

        <div className="container" style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px 80px" }}>
          <h1 className="blog-page-title">From the kitchen</h1>
          <p className="blog-page-sub">Stories, guides, and everything banana bread.</p>

          {posts.length === 0 ? (
            <p className="blog-empty">No posts yet — check back soon.</p>
          ) : (
            <div className="blog-grid">
              {posts.map((post) => (
                <div
                  key={post.slug}
                  className="blog-card"
                  onClick={() => router.push(`/blog/${post.slug}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && router.push(`/blog/${post.slug}`)}
                >
                  <div className="blog-card__img-wrap">
                    {post.coverImage ? (
                      <img src={post.coverImage} alt={post.title} className="blog-card__img" loading="lazy" />
                    ) : (
                      <div className="blog-card__img-wrap" style={{ background: "rgba(242,193,49,0.1)" }} />
                    )}
                  </div>
                  <div className="blog-card__body">
                    {post.publishedAt && (
                      <span className="blog-card__date">{moment(post.publishedAt).format("LL")}</span>
                    )}
                    <p className="blog-card__title">{post.title}</p>
                    {post.description && (
                      <p className="blog-card__desc">{post.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Main>
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
