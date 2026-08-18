import React, { useEffect, useState } from "react";
import ScoreTrend from "./ScoreTrend";
import {
  Heart,
  MessageCircle,
  Youtube
} from "lucide-react";

// ======================================================
// 백엔드 API 주소
// ======================================================

const API_BASE_URL = "https://asg-b2.onrender.com";

// ======================================================
// 섹션 제목
// ======================================================

function SectionHead({
  eyebrow,
  title,
  right
}) {
  return (
    <div className="onepage-section-head">
      <div>
        <span>{eyebrow}</span>
        <h2>{title}</h2>
      </div>

      {right && (
        <button>
          {right}
        </button>
      )}
    </div>
  );
}

// ======================================================
// HomePage
// ======================================================

export default function HomePage() {

  // ====================================================
  // YouTube 게시물
  // ====================================================

  const [youtubePosts, setYoutubePosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [postsError, setPostsError] = useState(null);

  const loadYoutubePosts = async () => {
    try {
      setPostsLoading(true);
      setPostsError(null);

      const response = await fetch(
        `${API_BASE_URL}/youtube/community-posts?limit=20`
      );

      if (!response.ok) {
        throw new Error(
          `게시글 요청 실패 (${response.status})`
        );
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(
          result.error ||
          "게시글을 불러오지 못했습니다."
        );
      }

      setYoutubePosts(
        Array.isArray(result.data)
          ? result.data
          : []
      );

    } catch (error) {

      console.error(
        "❌ YouTube 게시글 조회 실패:",
        error
      );

      setPostsError(error.message);
      setYoutubePosts([]);

    } finally {

      setPostsLoading(false);

    }
  };

  useEffect(() => {
    loadYoutubePosts();
  }, []);

  // ====================================================
  // LIVE
  // ====================================================

  const [liveMembers, setLiveMembers] = useState([]);
  const [liveLoading, setLiveLoading] = useState(true);
  const [liveError, setLiveError] = useState(null);

  const loadLiveMembers = async () => {

    try {

      setLiveLoading(true);
      setLiveError(null);

      const response = await fetch(
        `${API_BASE_URL}/youtube/live-members`
      );

      if (!response.ok) {
        throw new Error(
          `LIVE 목록 요청 실패 (${response.status})`
        );
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(
          result.error ||
          "LIVE 목록을 불러오지 못했습니다."
        );
      }

      setLiveMembers(
        Array.isArray(result.data)
          ? result.data
          : []
      );

    } catch (error) {

      console.error(
        "❌ LIVE 멤버 조회 실패:",
        error
      );

      setLiveError(error.message);
      setLiveMembers([]);

    } finally {

      setLiveLoading(false);

    }
  };

  useEffect(() => {
    loadLiveMembers();
  }, []);

  // ====================================================
  // 실제 YouTube 이동 주소
  // ====================================================

  const getLiveUrl = (item) => {

    if (item.live_url) {
      return item.live_url;
    }

    if (item.channel_id) {
      return `https://www.youtube.com/channel/${item.channel_id}/live`;
    }

    return null;
  };

  // ====================================================
  // iframe LIVE 주소
  //
  // 화면 표시용
  // 클릭은 부모 <a> 태그가 처리
  // ====================================================

  const getLiveEmbedUrl = (item) => {

    if (!item.channel_id) {
      return null;
    }

    const origin =
      typeof window !== "undefined"
        ? encodeURIComponent(
            window.location.origin
          )
        : "";

    return (
      `https://www.youtube.com/embed/live_stream` +
      `?channel=${item.channel_id}` +
      `&autoplay=0` +
      `&mute=1` +
      `&controls=0` +
      `&playsinline=1` +
      `&rel=0` +
      `&modestbranding=1` +
      `&disablekb=1` +
      (origin
        ? `&origin=${origin}`
        : "")
    );
  };

  // ====================================================
  // Shorts
  // ====================================================

  const [shorts, setShorts] = useState([]);
  const [shortsLoading, setShortsLoading] = useState(true);
  const [shortsError, setShortsError] = useState(null);

  const loadShorts = async () => {

    try {

      setShortsLoading(true);
      setShortsError(null);

      const response = await fetch(
        `${API_BASE_URL}/youtube/shorts-list?limit=20`
      );

      if (!response.ok) {
        throw new Error(
          `Shorts 목록 요청 실패 (${response.status})`
        );
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(
          result.error ||
          "Shorts 목록을 불러오지 못했습니다."
        );
      }

      setShorts(
        Array.isArray(result.data)
          ? result.data
          : []
      );

    } catch (error) {

      console.error(
        "❌ YouTube Shorts 조회 실패:",
        error
      );

      setShortsError(error.message);
      setShorts([]);

    } finally {

      setShortsLoading(false);

    }
  };

  useEffect(() => {
    loadShorts();
  }, []);

  // ====================================================
  // 다시보기
  // ====================================================

  const [videos, setVideos] = useState([]);
  const [videosLoading, setVideosLoading] = useState(true);
  const [videosError, setVideosError] = useState(null);

  const loadVideos = async () => {

    try {

      setVideosLoading(true);
      setVideosError(null);

      const response = await fetch(
        `${API_BASE_URL}/youtube/videos-list?limit=20`
      );

      if (!response.ok) {
        throw new Error(
          `영상 목록 요청 실패 (${response.status})`
        );
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(
          result.error ||
          "영상 목록을 불러오지 못했습니다."
        );
      }

      setVideos(
        Array.isArray(result.data)
          ? result.data
          : []
      );

    } catch (error) {

      console.error(
        "❌ YouTube 다시보기 조회 실패:",
        error
      );

      setVideosError(error.message);
      setVideos([]);

    } finally {

      setVideosLoading(false);

    }
  };

  useEffect(() => {
    loadVideos();
  }, []);

  // ====================================================
  // 화면
  // ====================================================

  return (

    <main className="onepage-shell">

      {/* ==================================================
          유튜브 게시물
      ================================================== */}

      <section className="onepage-section">

        <SectionHead
          eyebrow="POST"
          title="유튜브 공지"
        />

        {postsLoading && (

          <div className="post-empty">
            유튜브 게시물을 불러오는 중입니다.
          </div>

        )}

        {!postsLoading &&
          postsError && (

            <div className="post-empty">

              <p>
                게시물을 불러오지 못했습니다.
              </p>

              <small>
                {postsError}
              </small>

              <br />

              <button
                type="button"
                onClick={loadYoutubePosts}
              >
                다시 불러오기
              </button>

            </div>

          )}

        {!postsLoading &&
          !postsError &&
          youtubePosts.length > 0 && (

            <div className="notice-row">

              {youtubePosts.map((post) => (

                <a
                  className="notice-mini-card"
                  key={
                    post.post_id ||
                    post.id
                  }
                  href={
                    post.post_url ||
                    undefined
                  }
                  target={
                    post.post_url
                      ? "_blank"
                      : undefined
                  }
                  rel={
                    post.post_url
                      ? "noopener noreferrer"
                      : undefined
                  }
                  style={{
                    textDecoration: "none",
                    color: "inherit"
                  }}
                >

                  <div className="notice-mini-top">

                    <span className="yt-icon">
                      <Youtube size={14} />
                    </span>

                    <strong>
                      {post.member_name || "멤버"}
                    </strong>

                    <small>
                      {post.published_text || ""}
                    </small>

                    <b>
                      NEW
                    </b>

                  </div>

                  <div className="notice-mini-body">

                    <div>

                      <p
                        style={{
                          whiteSpace: "pre-line",
                          textDecoration: "none",
                          color: "inherit"
                        }}
                      >
                        {post.text}
                      </p>

                      <div className="notice-mini-stats">

                        <span>
                          <Heart size={13} />{" "}
                          {post.likes || "0"}
                        </span>

                        <span>
                          <MessageCircle size={13} />{" "}
                          {post.comments || "0"}
                        </span>

                      </div>

                    </div>

                    {post.image && (

                      <img
                        src={post.image}
                        alt={`${post.member_name || ""} 게시물`}
                      />

                    )}

                  </div>

                </a>

              ))}

            </div>

          )}

      </section>

      {/* ==================================================
          LIVE
      ================================================== */}

      <section className="onepage-section">

        <SectionHead
          eyebrow="YOUTUBE LIVE"
          title="LIVE"
          right={
            liveLoading
              ? "확인 중"
              : `방송중 ${liveMembers.length}`
          }
        />

        <p className="section-subline">
          라이브 중인 멤버를 확인해 보세요.
        </p>

        {liveLoading && (

          <div className="live-empty">
            라이브 정보를 불러오는 중입니다.
          </div>

        )}

        {!liveLoading &&
          liveError && (

            <div className="live-empty">

              <p>
                라이브 정보를 불러오지 못했습니다.
              </p>

              <small>
                {liveError}
              </small>

              <br />

              <button
                type="button"
                onClick={loadLiveMembers}
              >
                다시 불러오기
              </button>

            </div>

          )}

        {!liveLoading &&
          !liveError &&
          liveMembers.length === 0 && (

            <div className="live-empty">
              현재 방송 중인 멤버가 없습니다.
            </div>

          )}

        {!liveLoading &&
          !liveError &&
          liveMembers.length > 0 && (

            <div className="live-row">

              {liveMembers.map((item) => {

                const embedUrl =
                  getLiveEmbedUrl(item);

                const liveUrl =
                  getLiveUrl(item);

                return (

                  <a
                    className="live-mini-card"
                    key={
                      item.id ||
                      item.member_id ||
                      item.channel_id
                    }

                    href={
                      liveUrl ||
                      undefined
                    }

                    target={
                      liveUrl
                        ? "_blank"
                        : undefined
                    }

                    rel={
                      liveUrl
                        ? "noopener noreferrer"
                        : undefined
                    }

                    style={{
                      display: "block",
                      textDecoration: "none",
                      color: "inherit",
                      cursor:
                        liveUrl
                          ? "pointer"
                          : "default"
                    }}
                  >

                    {/* ====================================
                        LIVE iframe 화면
                    ==================================== */}

                    <div
                      className="live-mini-thumb"
                      style={{
                        position: "relative",
                        width: "100%",
                        aspectRatio: "16 / 9",
                        overflow: "hidden",
                        background: "#000"
                      }}
                    >

                      {embedUrl ? (

                        <iframe
                          src={embedUrl}
                          title={`${item.name} LIVE`}
                          loading="lazy"
                          tabIndex={-1}
                          aria-hidden="true"
                          referrerPolicy="strict-origin-when-cross-origin"

                          style={{
                            position: "absolute",
                            inset: 0,

                            width: "100%",
                            height: "100%",

                            border: 0,
                            display: "block",

                            /*
                             * 중요
                             *
                             * iframe이 클릭을 먹지 않게 함
                             * 모든 클릭은 부모 <a>가 처리
                             */
                            pointerEvents: "none"
                          }}
                        />

                      ) : (

                        <div
                          className="live-thumb-placeholder"
                          style={{
                            position: "absolute",
                            inset: 0,

                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",

                            pointerEvents: "none"
                          }}
                        >

                          <Youtube size={28} />

                        </div>

                      )}

                      {/* LIVE 표시 */}

                      <span
                        className="live-dot"
                        style={{
                          position: "absolute",

                          top: 8,
                          left: 8,

                          zIndex: 5,

                          pointerEvents: "none"
                        }}
                      >

                        <i />

                        LIVE

                      </span>

                    </div>

                    {/* ====================================
                        멤버 정보
                    ==================================== */}

                    <div
                      className="live-mini-info"
                      style={{
                        /*
                         * 이 부분도 부모 링크가
                         * 클릭을 받게 함
                         */
                        pointerEvents: "none"
                      }}
                    >

                      {item.profile_image ? (

                        <img
                          src={
                            item.profile_image
                          }
                          alt={
                            item.name
                          }
                        />

                      ) : (

                        <div className="member-avatar-fallback">

                          {item.name
                            ?.charAt(0)
                            ?.toUpperCase()}

                        </div>

                      )}

                      <div>

                        <div className="live-name">

                          <Youtube size={12} />

                          <strong>
                            {item.name}
                          </strong>

                        </div>

                        <p>
                          YouTube LIVE
                        </p>

                      </div>

                    </div>

                  </a>

                );

              })}

            </div>

          )}

      </section>

      {/* ==================================================
          쇼츠
      ================================================== */}

      <section className="onepage-section">

        <SectionHead
          eyebrow="SHORTS"
          title="NEW"
        />

        {shortsLoading && (

          <div className="live-empty">
            쇼츠를 불러오는 중입니다.
          </div>

        )}

        {!shortsLoading &&
          shortsError && (

            <div className="live-empty">
              쇼츠를 불러오지 못했습니다.
            </div>

          )}

        {!shortsLoading &&
          !shortsError &&
          shorts.length > 0 && (

            <div className="shorts-row">

              {shorts.map((item) => (

                <a
                  className="short-mini-card"
                  key={item.id}

                  href={
                    item.short_url ||
                    undefined
                  }

                  target={
                    item.short_url
                      ? "_blank"
                      : undefined
                  }

                  rel={
                    item.short_url
                      ? "noopener noreferrer"
                      : undefined
                  }

                  style={{
                    cursor:
                      item.short_url
                        ? "pointer"
                        : "default",

                    textDecoration:
                      "none",

                    color:
                      "inherit"
                  }}
                >

                  <div className="short-mini-thumb">

                    {item.thumbnail ? (

                      <img
                        src={
                          item.thumbnail
                        }
                        alt={
                          item.title ||
                          "YouTube Shorts"
                        }
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block"
                        }}
                      />

                    ) : (

                      <div className="live-thumb-placeholder">
                        <Youtube size={28} />
                      </div>

                    )}

                    <div className="short-mini-overlay" />

                    <span className="new-badge">
                      NEW
                    </span>

                    <div className="short-mini-copy">

                      <p
                        style={{
                          textDecoration:
                            "none",

                          color:
                            "inherit"
                        }}
                      >
                        {item.title}
                      </p>

                    </div>

                  </div>

                </a>

              ))}

            </div>

          )}

      </section>

      {/* ==================================================
          다시보기
      ================================================== */}

      <section className="onepage-section">

        <SectionHead
          eyebrow="REPLAY"
          title="회차 다시보기"
        />

        {videosLoading && (

          <div className="live-empty">
            유튜브 영상을 불러오는 중입니다.
          </div>

        )}

        {!videosLoading &&
          videosError && (

            <div className="live-empty">
              유튜브 영상을 불러오지 못했습니다.
            </div>

          )}

        {!videosLoading &&
          !videosError &&
          videos.length > 0 && (

            <div className="video-row">

              {videos.map((item) => (

                <a
                  className="video-mini-card"
                  key={item.id}

                  href={
                    item.video_url ||
                    undefined
                  }

                  target={
                    item.video_url
                      ? "_blank"
                      : undefined
                  }

                  rel={
                    item.video_url
                      ? "noopener noreferrer"
                      : undefined
                  }
                >

                  <div className="video-mini-thumb">

                    {item.thumbnail ? (

                      <img
                        src={
                          item.thumbnail
                        }
                        alt={
                          item.title ||
                          ""
                        }
                      />

                    ) : (

                      <div className="video-thumb-placeholder">

                        <Youtube size={28} />

                      </div>

                    )}

                  </div>

                  <div className="video-mini-info">

                    <p>
                      {item.title}
                    </p>

                  </div>

                </a>

              ))}

            </div>

          )}

      </section>

    </main>

  );

}
