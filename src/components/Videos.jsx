import React, { useEffect, useState } from "react";


// ======================================================
// 백엔드 API 주소
// ======================================================

const API_BASE_URL =
  "https://asg-b2.onrender.com";


export default function Videos() {

  // ====================================================
  // 실제 YouTube 영상 데이터
  // ====================================================

  const [
    videos,
    setVideos
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
  // YouTube 영상 조회
  //
  // GET /youtube/videos-list
  // ====================================================

  const loadVideos = async () => {

    try {

      setLoading(true);

      setError(null);


      const response =
        await fetch(
          `${API_BASE_URL}/youtube/videos-list?limit=100`
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
        "❌ YouTube 영상 조회 실패:",
        error
      );


      setError(
        error.message
      );


      setVideos([]);


    } finally {

      setLoading(false);

    }

  };


  // ====================================================
  // 최초 진입 시 영상 조회
  // ====================================================

  useEffect(() => {

    loadVideos();

  }, []);


  // ====================================================
  // YouTube 영상 열기
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


  return (

    <section className="tab-content">


      {/* ==================================================
          제목
      ================================================== */}

      <div className="section-heading">

        <div>

          <span className="eyebrow">
            YOUTUBE VIDEOS
          </span>

          <h1>
            유튜브 영상
          </h1>

          <p>
            하이라이트, 브이로그, 시그니처 모음 등 일반 영상을 보여줍니다.
          </p>

        </div>

      </div>


      {/* ==================================================
          로딩
      ================================================== */}

      {loading && (

        <div className="live-empty">

          유튜브 영상을 불러오는 중입니다.

        </div>

      )}


      {/* ==================================================
          오류
      ================================================== */}

      {!loading &&
        error && (

          <div className="live-empty">

            <p>
              유튜브 영상을 불러오지 못했습니다.
            </p>

            <small>
              {error}
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


      {/* ==================================================
          영상 없음
      ================================================== */}

      {!loading &&
        !error &&
        videos.length === 0 && (

          <div className="live-empty">

            등록된 유튜브 영상이 없습니다.

          </div>

        )}


      {/* ==================================================
          영상 목록
      ================================================== */}

      {!loading &&
        !error &&
        videos.length > 0 && (

          <div className="video-grid">

            {videos.map(
              (item) => (

                <article
                  className="video-card"
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


                  {/* ======================================
                      YouTube 썸네일
                  ====================================== */}

                  <div className="video-thumb">

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

                        썸네일 없음

                      </div>

                    )}

                  </div>


                  {/* ======================================
                      영상 정보
                  ====================================== */}

                  <div className="video-body">

                    <h3>
                      {item.title}
                    </h3>

                  </div>

                </article>

              )
            )}

          </div>

        )}

    </section>

  );

}