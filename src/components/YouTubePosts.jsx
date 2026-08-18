import React, { useEffect, useState } from "react";
import {
  Heart,
  MessageCircle,
  Youtube,
  ExternalLink
} from "lucide-react";


// ======================================================
// 백엔드 API 주소
// ======================================================

const API_BASE_URL =
  "https://asg-b2.onrender.com";


export default function YouTubePosts() {

  const [
    youtubePosts,
    setYoutubePosts
  ] = useState([]);


  const [
    loading,
    setLoading
  ] = useState(true);


  const [
    error,
    setError
  ] = useState(null);


  // ====================================================
  // 게시글 조회
  //
  // YouTube 직접 조회 X
  // Supabase youtube_posts만 조회
  // ====================================================

  const loadYoutubePosts =
    async () => {

      try {

        setLoading(true);
        setError(null);


        const response =
          await fetch(
            `${API_BASE_URL}/youtube/community-posts?limit=30`
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


        setError(
          error.message
        );


        setYoutubePosts([]);


      } finally {

        setLoading(false);

      }

    };


  // ====================================================
  // 최초 1회 조회
  // ====================================================

  useEffect(() => {

    loadYoutubePosts();

  }, []);


  // ====================================================
  // YouTube 게시글 열기
  // ====================================================

  const openPost =
    (url) => {

      if (!url) {
        return;
      }


      window.open(
        url,
        "_blank",
        "noopener,noreferrer"
      );

    };


  return (

    <section className="tab-content">

      <div className="section-heading">

        <div>

          <span className="eyebrow">
            YOUTUBE COMMUNITY
          </span>

          <h1>
            유튜브 게시물
          </h1>

          <p>
            멤버들의 최신 커뮤니티 게시물을 한눈에 확인하세요.
          </p>

        </div>

      </div>


      {/* ==================================================
          로딩
      ================================================== */}

      {loading && (

        <div className="post-empty">

          게시글을 불러오는 중입니다.

        </div>

      )}


      {/* ==================================================
          오류
      ================================================== */}

      {!loading &&
        error && (

          <div className="post-empty">

            <strong>
              게시글을 불러오지 못했습니다.
            </strong>

            <p>
              {error}
            </p>

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


      {/* ==================================================
          게시글 없음
      ================================================== */}

      {!loading &&
        !error &&
        youtubePosts.length === 0 && (

          <div className="post-empty">

            아직 등록된 유튜브 게시글이 없습니다.

          </div>

        )}


      {/* ==================================================
          게시글 목록
      ================================================== */}

      {!loading &&
        !error &&
        youtubePosts.length > 0 && (

          <div className="post-grid">

            {youtubePosts.map(
              (post) => (

                <article
                  className="gold-card post-card"
                  key={
                    post.post_id ||
                    post.id
                  }
                >

                  {/* ======================================
                      게시글 상단
                  ====================================== */}

                  <div className="post-head">

                    <div className="post-author">

                      <div className="post-avatar">

                        {post.member_name
                          ?.slice(0, 1)}

                      </div>


                      <div>

                        <strong>
                          {post.member_name}
                        </strong>

                        <span>
                          {post.published_text ||
                            ""}
                        </span>

                      </div>

                    </div>


                    <button
                      type="button"
                      className="post-youtube-button"
                      onClick={() =>
                        openPost(
                          post.post_url
                        )
                      }
                      title="YouTube 게시글 열기"
                    >

                      <Youtube
                        size={19}
                        className="youtube-red"
                      />

                      <ExternalLink
                        size={13}
                      />

                    </button>

                  </div>


                  {/* ======================================
                      본문
                  ====================================== */}

                  {post.text && (

                    <p className="post-text">

                      {post.text}

                    </p>

                  )}


                  {/* ======================================
                      이미지
                  ====================================== */}

                  {post.image && (

                    <img
                      className="post-image"
                      src={post.image}
                      alt={`${post.member_name} 게시글`}
                      onClick={() =>
                        openPost(
                          post.post_url
                        )
                      }
                      style={{
                        cursor:
                          post.post_url
                            ? "pointer"
                            : "default"
                      }}
                    />

                  )}


                  {/* ======================================
                      좋아요 / 댓글
                  ====================================== */}

                  <div className="post-actions">

                    <span>

                      <Heart
                        size={16}
                      />

                      {post.likes || "0"}

                    </span>


                    <span>

                      <MessageCircle
                        size={16}
                      />

                      {post.comments || "0"}

                    </span>

                  </div>

                </article>

              )
            )}

          </div>

        )}

    </section>

  );

}