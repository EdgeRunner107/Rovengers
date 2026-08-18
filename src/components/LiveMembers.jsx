import React, { useEffect, useState } from "react";
import { Eye, Radio, RefreshCw } from "lucide-react";

// ======================================================
// 백엔드 서버 주소
//
// 로컬:
// http://localhost:8888
//
// 나중에 Render 배포 후:
// https://xxxx.onrender.com
// ======================================================

const API_BASE_URL = "https://asg-b2.onrender.com";


export default function LiveMembers() {

  // ====================================================
  // LIVE 멤버 데이터
  // ====================================================

  const [liveMembers, setLiveMembers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

s
  // ====================================================
  // LIVE 멤버 불러오기
  //
  // 중요:
  // 이 API는 YouTube API를 직접 호출하지 않고
  // Supabase youtube_live_status만 조회함
  // ====================================================

  const loadLiveMembers = async () => {

    try {

      setLoading(true);
      setError(null);


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


      setError(
        error.message
      );


      setLiveMembers([]);


    } finally {

      setLoading(false);

    }

  };


  // ====================================================
  // 페이지 최초 진입 시 한 번 조회
  // ====================================================

  useEffect(() => {

    loadLiveMembers();

  }, []);


  // ====================================================
  // 시청자 수 표시
  // ====================================================

  const formatViewerCount = (value) => {

    const count = Number(value || 0);

    return count.toLocaleString("ko-KR");

  };


  // ====================================================
  // LIVE 카드 클릭
  //
  // YouTube 방송 새 창
  // ====================================================

  const openLive = (url) => {

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
            LIVE ON AIR
          </span>

          <h1>
            지금 라이브 중인 멤버
          </h1>

          <p>
            현재 유튜브에서 방송 중인 멤버만 노출되는 영역입니다.
          </p>

        </div>


        <div className="live-count">

          <Radio size={17} />

          LIVE {liveMembers.length}

        </div>

      </div>


      {/* ==================================================
          로딩
      ================================================== */}

      {loading && (

        <div className="live-empty">

          <RefreshCw
            size={22}
            className="spin"
          />

          <span>
            라이브 방송을 확인하고 있습니다.
          </span>

        </div>

      )}


      {/* ==================================================
          오류
      ================================================== */}

      {!loading && error && (

        <div className="live-empty">

          <Radio size={22} />

          <strong>
            라이브 목록을 불러오지 못했습니다.
          </strong>

          <span>
            {error}
          </span>

          <button
            type="button"
            onClick={loadLiveMembers}
          >
            다시 불러오기
          </button>

        </div>

      )}


      {/* ==================================================
          현재 LIVE 없음
      ================================================== */}

      {!loading &&
        !error &&
        liveMembers.length === 0 && (

          <div className="live-empty">

            <Radio size={22} />

            <strong>
              현재 방송 중인 멤버가 없습니다.
            </strong>

            <span>
              방송이 시작되면 이곳에 자동으로 표시됩니다.
            </span>

          </div>

        )}


      {/* ==================================================
          LIVE 목록
      ================================================== */}

      {!loading &&
        !error &&
        liveMembers.length > 0 && (

          <div className="live-grid">

            {liveMembers.map((item) => (

              <article
                className="gold-card live-card"
                key={item.id}
                onClick={() =>
                  openLive(
                    item.live_url
                  )
                }
                style={{
                  cursor: item.live_url
                    ? "pointer"
                    : "default"
                }}
              >

                {/* ========================================
                    방송 썸네일
                ======================================== */}

                <div className="live-thumb-wrap">

                  {item.thumbnail ? (

                    <img
                      src={item.thumbnail}
                      alt={`${item.name} 라이브`}
                    />

                  ) : (

                    <div className="live-thumb-placeholder">

                      <Radio size={32} />

                    </div>

                  )}


                  {/* LIVE 표시 */}

                  <div className="live-badge">
                    LIVE
                  </div>


                  {/* 시청자 수 */}

                  <div className="viewer-badge">

                    <Eye size={14} />

                    {formatViewerCount(
                      item.viewer_count
                    )}

                  </div>

                </div>


                {/* ========================================
                    멤버 / 방송 제목
                ======================================== */}

                <div className="live-body">


                  {/* 프로필 이미지 */}

                  {item.profile_image ? (

                    <img
                      className="member-avatar"
                      src={item.profile_image}
                      alt={item.name}
                    />

                  ) : (

                    <div className="member-avatar member-avatar-fallback">

                      {item.name
                        ?.charAt(0)
                        ?.toUpperCase()}

                    </div>

                  )}


                  <div className="live-info">

                    <div className="live-member-row">

                      <strong>
                        {item.name}
                      </strong>


                      {item.role && (

                        <span className="live-member-role">
                          {item.role}
                        </span>

                      )}

                    </div>


                    <h3>
                      {item.title ||
                        "YouTube LIVE"}
                    </h3>

                  </div>

                </div>

              </article>

            ))}

          </div>

        )}

    </section>

  );

}