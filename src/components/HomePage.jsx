import React, { useEffect, useState } from "react";
import ScoreTrend from "./ScoreTrend";
import {
  Heart,
  MessageCircle,
  Youtube
} from "lucide-react";


// ======================================================
// 백엔드 API 주소
//
// 로컬 개발:
// http://localhost:8888
//
// Render 배포 후에는 이 주소만 변경
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

        <span>
          {eyebrow}
        </span>

        <h2>
          {title}
        </h2>

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
  // 실제 YouTube 게시물
  //
  // mockData 사용하지 않음
  // ====================================================

  const [
    youtubePosts,
    setYoutubePosts
  ] = useState([]);


  const [
    postsLoading,
    setPostsLoading
  ] = useState(true);


  const [
    postsError,
    setPostsError
  ] = useState(null);


  // ====================================================
  // YouTube 게시물 조회
  //
  // GET /youtube/community-posts
  //
  // YouTube 직접 조회 X
  // Supabase youtube_posts만 조회
  // ====================================================

  const loadYoutubePosts = async () => {

    try {

      setPostsLoading(true);

      setPostsError(null);


      const response =
        await fetch(
          `${API_BASE_URL}/youtube/community-posts?limit=20`
        );


      if (!response.ok) {

        throw new Error(
          `게시글 요청 실패 (${response.status})`
        );

      }


      const result =
        await response.json();


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


      setPostsError(
        error.message
      );


      setYoutubePosts([]);


    } finally {

      setPostsLoading(false);

    }

  };


  // ====================================================
  // 홈페이지 최초 진입 시 게시글 조회
  // ====================================================

  useEffect(() => {

    loadYoutubePosts();

  }, []);


  // ====================================================
  // 게시글 클릭
  // ====================================================

  const openYoutubePost = (
    url
  ) => {

    if (!url) {
      return;
    }


    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );

  };


  // ====================================================
  // 실제 LIVE 멤버
  //
  // mockData 사용하지 않음
  // ====================================================

  const [
    liveMembers,
    setLiveMembers
  ] = useState([]);


  const [
    liveLoading,
    setLiveLoading
  ] = useState(true);


  const [
    liveError,
    setLiveError
  ] = useState(null);


  // ====================================================
  // LIVE 멤버 조회
  //
  // GET /youtube/live-members
  // ====================================================

  const loadLiveMembers = async () => {

    try {

      setLiveLoading(true);

      setLiveError(null);


      const response =
        await fetch(
          `${API_BASE_URL}/youtube/live-members`
        );


      if (!response.ok) {

        throw new Error(
          `LIVE 목록 요청 실패 (${response.status})`
        );

      }


      const result =
        await response.json();


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


      setLiveError(
        error.message
      );


      setLiveMembers([]);


    } finally {

      setLiveLoading(false);

    }

  };


  // ====================================================
  // 홈페이지 최초 진입 시 LIVE 상태 조회
  // ====================================================

  useEffect(() => {

    loadLiveMembers();

  }, []);


  // ====================================================
  // LIVE 카드 클릭
  // ====================================================

  const openLive = (
    url
  ) => {

    if (!url) {
      return;
    }


    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );

  };


  // ====================================================
  // 실제 YouTube Shorts
  //
  // mockData 사용하지 않음
  // ====================================================

  const [
    shorts,
    setShorts
  ] = useState([]);


  const [
    shortsLoading,
    setShortsLoading
  ] = useState(true);


  const [
    shortsError,
    setShortsError
  ] = useState(null);


  // ====================================================
  // Shorts 조회
  //
  // GET /youtube/shorts-list
  // ====================================================

  const loadShorts = async () => {

    try {

      setShortsLoading(true);

      setShortsError(null);


      const response =
        await fetch(
          `${API_BASE_URL}/youtube/shorts-list?limit=20`
        );


      if (!response.ok) {

        throw new Error(
          `Shorts 목록 요청 실패 (${response.status})`
        );

      }


      const result =
        await response.json();


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


      setShortsError(
        error.message
      );


      setShorts([]);


    } finally {

      setShortsLoading(false);

    }

  };


  // ====================================================
  // 홈페이지 최초 진입 시 Shorts 조회
  // ====================================================

  useEffect(() => {

    loadShorts();

  }, []);


  // ====================================================
  // Shorts 카드 클릭
  // ====================================================

  const openShort = (
    url
  ) => {

    if (!url) {
      return;
    }


    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );

  };


  // ====================================================
  // 실제 YouTube 다시보기
  //
  // mockData 사용하지 않음
  // ====================================================

  const [
    videos,
    setVideos
  ] = useState([]);


  const [
    videosLoading,
    setVideosLoading
  ] = useState(true);


  const [
    videosError,
    setVideosError
  ] = useState(null);


  // ====================================================
  // YouTube 다시보기 조회
  //
  // GET /youtube/videos-list
  // ====================================================

  const loadVideos = async () => {

    try {

      setVideosLoading(true);

      setVideosError(null);


      const response =
        await fetch(
          `${API_BASE_URL}/youtube/videos-list?limit=20`
        );


      if (!response.ok) {

        throw new Error(
          `영상 목록 요청 실패 (${response.status})`
        );

      }


      const result =
        await response.json();


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


      setVideosError(
        error.message
      );


      setVideos([]);


    } finally {

      setVideosLoading(false);

    }

  };


  // ====================================================
  // 홈페이지 최초 진입 시 다시보기 조회
  // ====================================================

  useEffect(() => {

    loadVideos();

  }, []);


  // ====================================================
  // 다시보기 카드 클릭
  // ====================================================

  const openVideo = (
    url
  ) => {

    if (!url) {
      return;
    }


    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );

  };


  // ====================================================
  // 화면
  // ====================================================

  return (

    <main className="onepage-shell">


      {/* ==================================================
          유튜브 게시물

          ★ 실제 DB API 연결
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
                onClick={
                  loadYoutubePosts
                }
              >
                다시 불러오기
              </button>

            </div>

          )}


        {!postsLoading &&
          !postsError &&
          youtubePosts.length === 0 && (

            <div className="post-empty">

              아직 등록된 유튜브 게시물이 없습니다.

            </div>

          )}


        {!postsLoading &&
          !postsError &&
          youtubePosts.length > 0 && (

            <div className="notice-row">

              {youtubePosts.map(
                (post) => (

                  <article
                    className="notice-mini-card"
                    key={
                      post.post_id ||
                      post.id
                    }
                    onClick={() =>
                      openYoutubePost(
                        post.post_url
                      )
                    }
                    style={{
                      cursor:
                        post.post_url
                          ? "pointer"
                          : "default"
                    }}
                  >

                    <div className="notice-mini-top">

                      <span className="yt-icon">

                        <Youtube
                          size={14}
                        />

                      </span>


                      <strong>

                        {post.member_name ||
                          "멤버"}

                      </strong>


                      <small>

                        {post.published_text ||
                          ""}

                      </small>


                      <b>
                        NEW
                      </b>

                    </div>


                    <div className="notice-mini-body">

                      <div>

                        <p
                          style={{
                            whiteSpace:
                              "pre-line"
                          }}
                        >

                          {post.text}

                        </p>


                        <div className="notice-mini-stats">

                          <span>

                            <Heart
                              size={13}
                            />

                            {" "}

                            {post.likes ||
                              "0"}

                          </span>


                          <span>

                            <MessageCircle
                              size={13}
                            />

                            {" "}

                            {post.comments ||
                              "0"}

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

                  </article>

                )
              )}

            </div>

          )}

      </section>


      {/* ==================================================
          YouTube LIVE

          ★ 실제 DB API 연결
      ================================================== */}

      <section className="onepage-section">

        <SectionHead
          eyebrow="YOUTUBE LIVE "
          title="LIVE "
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
                onClick={
                  loadLiveMembers
                }
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

              {liveMembers.map(
                (item) => (

                  <article
                    className="live-mini-card"
                    key={item.id}
                    onClick={() =>
                      openLive(
                        item.live_url
                      )
                    }
                    style={{
                      cursor:
                        item.live_url
                          ? "pointer"
                          : "default"
                    }}
                  >

                    <div className="live-mini-thumb">

                      {item.thumbnail ? (

                        <img
                          src={
                            item.thumbnail
                          }
                          alt={
                            `${item.name} 라이브`
                          }
                        />

                      ) : (

                        <div className="live-thumb-placeholder">

                          <Youtube
                            size={28}
                          />

                        </div>

                      )}


                      <span className="live-dot">

                        <i />

                        LIVE ·{" "}

                        {Number(
                          item.viewer_count ||
                          0
                        ).toLocaleString(
                          "ko-KR"
                        )}

                      </span>

                    </div>


                    <div className="live-mini-info">

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

                          <Youtube
                            size={12}
                          />

                          <strong>
                            {item.name}
                          </strong>

                        </div>


                        <p>

                          {item.title ||
                            "YouTube LIVE"}

                        </p>

                      </div>

                    </div>

                  </article>

                )
              )}

            </div>

          )}

      </section>


      {/* ==================================================
          유튜브 쇼츠

          ★ 실제 DB API 연결
      ================================================== */}

      <section className="onepage-section">

        <SectionHead
          eyebrow="SHORTS"
          title="NEW "
         
        />


        {shortsLoading && (

          <div className="live-empty">

            쇼츠를 불러오는 중입니다.

          </div>

        )}


        {!shortsLoading &&
          shortsError && (

            <div className="live-empty">

              <p>
                쇼츠를 불러오지 못했습니다.
              </p>

              <small>
                {shortsError}
              </small>

              <br />

              <button
                type="button"
                onClick={
                  loadShorts
                }
              >
                다시 불러오기
              </button>

            </div>

          )}


        {!shortsLoading &&
          !shortsError &&
          shorts.length === 0 && (

            <div className="live-empty">

              등록된 쇼츠가 없습니다.

            </div>

          )}


        {!shortsLoading &&
          !shortsError &&
          shorts.length > 0 && (

            <div className="shorts-row">

              {shorts.map(
                (item) => (

                  <article
                    className="short-mini-card"
                    key={item.id}
                    onClick={() =>
                      openShort(
                        item.short_url
                      )
                    }
                    style={{
                      cursor:
                        item.short_url
                          ? "pointer"
                          : "default"
                    }}
                  >

                    <div className="short-mini-thumb">

                      {item.thumbnail ? (

                        <img
                          src={
                            item.thumbnail
                          }
                          alt={
                            item.title || ""
                          }
                        />

                      ) : (

                        <div className="live-thumb-placeholder">

                          <Youtube
                            size={28}
                          />

                        </div>

                      )}


                      <div className="short-mini-overlay" />


                      <span className="new-badge">
                        NEW
                      </span>


                      <div className="short-mini-copy">

                        <p>
                          {item.title}
                        </p>

                      </div>

                    </div>

                  </article>

                )
              )}

            </div>

          )}

      </section>


      {/* ==================================================
          유튜브 다시보기

          ★ 실제 DB API 연결
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

              <p>
                유튜브 영상을 불러오지 못했습니다.
              </p>

              <small>
                {videosError}
              </small>

              <br />

              <button
                type="button"
                onClick={
                  loadVideos
                }
              >
                다시 불러오기
              </button>

            </div>

          )}


        {!videosLoading &&
          !videosError &&
          videos.length === 0 && (

            <div className="live-empty">

              등록된 유튜브 영상이 없습니다.

            </div>

          )}


        {!videosLoading &&
          !videosError &&
          videos.length > 0 && (

            <div className="video-row">

              {videos.map(
                (item) => (

                  <article
                    className="video-mini-card"
                    key={item.id}
                    onClick={() =>
                      openVideo(
                        item.video_url
                      )
                    }
                    style={{
                      cursor:
                        item.video_url
                          ? "pointer"
                          : "default"
                    }}
                  >

                    <div className="video-mini-thumb">

                      {item.thumbnail ? (

                        <img
                          src={
                            item.thumbnail
                          }
                          alt={
                            item.title || ""
                          }
                        />

                      ) : (

                        <div className="video-thumb-placeholder">

                          <Youtube
                            size={28}
                          />

                        </div>

                      )}

                    </div>


                    <div className="video-mini-info">

                      <p>
                        {item.title}
                      </p>

                    </div>

                  </article>

                )
              )}

            </div>

          )}

      </section>


      {/* ==================================================
          점수 추이

          기존 그대로
      ================================================== */}

   
    </main>

  );

}