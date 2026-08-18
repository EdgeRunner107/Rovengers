import React, { useEffect, useState } from "react";



// ======================================================
// 백엔드 API 주소
// ======================================================

const API_BASE_URL = "https://asg-b2.onrender.com";


export default function Shorts() {

  // ====================================================
  // 실제 Shorts 데이터
  // ====================================================

  const [
    shorts,
    setShorts
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
  // Shorts 조회
  //
  // GET /youtube/shorts-list
  // ====================================================

  const loadShorts = async () => {

    try {

      setLoading(true);

      setError(null);


      const response =
        await fetch(
          `${API_BASE_URL}/youtube/shorts-list?limit=100`
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


      setError(
        error.message
      );


      setShorts([]);


    } finally {

      setLoading(false);

    }

  };


  // ====================================================
  // 최초 진입 시 조회
  // ====================================================

  useEffect(() => {

    loadShorts();

  }, []);


  // ====================================================
  // 쇼츠 열기
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


  return (

    <section className="tab-content">

      <div className="section-heading">

        <div>

          <span className="eyebrow">
            LATEST SHORTS
          </span>

          <h1>
            유튜브 쇼츠
          </h1>

          <p>
            세로형 영상 중심으로 빠르게 넘겨볼 수 있게 구성했습니다.
          </p>

        </div>

      </div>


      {/* ==================================================
          로딩
      ================================================== */}

      {loading && (

        <div className="live-empty">

          쇼츠를 불러오는 중입니다.

        </div>

      )}


      {/* ==================================================
          오류
      ================================================== */}

      {!loading &&
        error && (

          <div className="live-empty">

            <p>
              쇼츠를 불러오지 못했습니다.
            </p>

            <small>
              {error}
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


      {/* ==================================================
          쇼츠 없음
      ================================================== */}

      {!loading &&
        !error &&
        shorts.length === 0 && (

          <div className="live-empty">

            등록된 쇼츠가 없습니다.

          </div>

        )}


      {/* ==================================================
          쇼츠 목록
      ================================================== */}

      {!loading &&
        !error &&
        shorts.length > 0 && (

          <div className="shorts-grid">

            {shorts.map(
              (item) => (

                <article
                  className="short-card"
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

                  <div className="short-thumb">


                    {/* ================================
                        자동 생성된 YouTube 썸네일
                    ================================ */}

                    {item.thumbnail && (

                      <img
                        src={
                          item.thumbnail
                        }
                        alt={
                          item.title || ""
                        }
                      />

                    )}


                    <div className="short-overlay" />


                    {/* ================================
                        재생 아이콘
                    ================================ */}

                  


                    {/* ================================
                        쇼츠 정보
                    ================================ */}

                    <div className="short-copy">

                      <h3>
                        {item.title}
                      </h3>

                    </div>

                  </div>

                </article>

              )
            )}

          </div>

        )}

    </section>

  );

}