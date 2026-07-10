import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote } from "next-mdx-remote";
import { useState } from "react";
import Link from "next/link";
import Head from "next/head";
import moment from "moment";
import CSSTransitionGroup from "react-transition-group/CSSTransitionGroup";
import { RightArrow } from "../../public/static/vectors";
import { HeaderMenu } from "../../components/Header";

const POSTS_DIR = path.join(process.cwd(), "content/posts");

const PostDetails = ({ frontmatter, mdxSource }) => {
  const [isMenuActive, setIsMenuActive] = useState(false);

  const showMenu = (show) => {
    setIsMenuActive(show);
  };

  return (
    <>
      <Head>
        <title>{frontmatter.title} | Gourmet Twist Blog</title>
        <meta name="description" content={frontmatter.description} />
        <meta property="og:title" content={frontmatter.title} />
        <meta property="og:description" content={frontmatter.description} />
        {frontmatter.coverImage && (
          <meta property="og:image" content={frontmatter.coverImage} />
        )}
        <meta property="og:type" content="article" />
      </Head>

      <div className="blog-details">
        <div className="blog-image">
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
            {frontmatter.coverImage ? (
              <img src={frontmatter.coverImage} alt={frontmatter.title} rel="preload" />
            ) : (
              <img
                src="/static/svgs/image-placeholder.svg"
                alt=""
                rel="preload"
              />
            )}
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
              {isMenuActive && <HeaderMenu showMenu={showMenu} />}
            </CSSTransitionGroup>
          </div>
        </div>

        <div className="blog-info">
          <div className="container">
            {frontmatter.publishedAt && (
              <p>{moment(frontmatter.publishedAt).format("LL")}</p>
            )}
            <div className="body-content" style={{ paddingTop: 30 }}>
              <h1>{frontmatter.title}</h1>
              <div className="blog-body">
                <MDXRemote {...mdxSource} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export async function getStaticPaths() {
  const files = fs.existsSync(POSTS_DIR)
    ? fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".mdx"))
    : [];

  return {
    paths: files.map((filename) => ({
      params: { slug: filename.replace(/\.mdx$/, "") },
    })),
    fallback: "blocking",
  };
}

export async function getStaticProps({ params }) {
  const filepath = path.join(POSTS_DIR, `${params.slug}.mdx`);

  if (!fs.existsSync(filepath)) {
    return { notFound: true };
  }

  const raw = fs.readFileSync(filepath, "utf-8");
  const { data, content } = matter(raw);
  const mdxSource = await serialize(content);

  return {
    props: {
      slug: params.slug,
      frontmatter: {
        title: data.title || "",
        description: data.description || "",
        publishedAt: data.publishedAt ? data.publishedAt.toString() : null,
        coverImage: data.coverImage || null,
      },
      mdxSource,
    },
    revalidate: 60,
  };
}

export default PostDetails;
