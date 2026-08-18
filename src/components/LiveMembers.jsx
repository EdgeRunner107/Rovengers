import React, { useEffect, useState } from "react";
import {
  Radio,
  RefreshCw,
  ExternalLink,
  Play
} from "lucide-react";

// ======================================================
// 백엔드 서버 주소
// ======================================================

const API_BASE_URL = "https://asg-b2.onrender.com";

export default function LiveMembers() {
  // ====================================================
  // LIVE 멤버 데이터
  // ====================================================

  const [liveMembers, setLiveMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ====================================================
  // LIVE 멤버 불러오기
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

      setError(error.message);
      setLiveMembers([]);
    } finally {
      setLoading(false);
    }
  };

  // ====================================================
  // 최초 진입 시 LIVE 목록 조회
  // ====================================================

  useEffect(() => {
    loadLiveMembers();
  }, []);

  // ====================================================
  // YouTube LIVE 주소
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
  // YouTube LIVE 새 창 열기
  // ====================================================

  const openLive = (item) => {
    const url = getLiveUrl(item);

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
  // 미리보기 이미지
  //
  // 1순위: 방송 썸네일
  // 2순위: 멤버 프로필
  // ====================================================

  const getPreviewImage = (item) => {
    return (
      item.thumbnail ||
      item.profile_image ||
      null
    );
  };

  // ====================================================
  // 렌더링
  // ====================================================

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
            현재 유튜브에서 방송 중인 멤버입니다.
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

            {liveMembers.map((item) => {
              const previewImage =
                getPreviewImage(item);

              const liveUrl =
                getLiveUrl(item);

              return (
                <article
                  className="gold-card live-card"
                  key={
                    item.id ||
                    item.member_id ||
                    item.channel_id
                  }
                >

                  {/* ======================================
                      LIVE 미리보기
                  ====================================== */}

                  <div
                    className="live-video-wrap"
                    onClick={() => openLive(item)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(event) => {
                      if (
                        event.key === "Enter" ||
                        event.key === " "
                      ) {
                        openLive(item);
                      }
                    }}
                    style={{
                      position: "relative",
                      width: "100%",
                      aspectRatio: "16 / 9",
                      overflow: "hidden",
                      background: "#050505",
                      cursor: liveUrl
                        ? "pointer"
                        : "default"
                    }}
                  >

                    {/* ====================================
                        미리보기 이미지
                    ==================================== */}

                    {previewImage ? (
                      <img
                        src={previewImage}
                        alt={`${item.name} LIVE`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit:
                            item.thumbnail
                              ? "cover"
                              : "cover",
                          display: "block",

                          filter:
                            item.thumbnail
                              ? "none"
                              : "blur(1.5px)",

                          transform:
                            item.thumbnail
                              ? "scale(1)"
                              : "scale(1.05)"
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background:
                            "linear-gradient(135deg, #080808 0%, #1b1010 50%, #080808 100%)"
                        }}
                      >
                        <Radio
                          size={48}
                          style={{
                            opacity: 0.5
                          }}
                        />
                      </div>
                    )}

                    {/* ====================================
                        어두운 오버레이
                    ==================================== */}

                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(to bottom, rgba(0,0,0,.08) 0%, rgba(0,0,0,.12) 45%, rgba(0,0,0,.72) 100%)",
                        pointerEvents: "none"
                      }}
                    />

                    {/* ====================================
                        LIVE 배지
                    ==================================== */}

                    <div
                      className="live-badge"
                      style={{
                        position: "absolute",
                        top: 12,
                        left: 12,
                        zIndex: 3,
                        pointerEvents: "none"
                      }}
                    >
                      LIVE
                    </div>

                    {/* ====================================
                        중앙 재생 버튼
                    ==================================== */}

                    <div
                      style={{
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        transform:
                          "translate(-50%, -50%)",

                        width: 66,
                        height: 66,

                        borderRadius: "50%",

                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",

                        background:
                          "rgba(255, 0, 0, 0.94)",

                        boxShadow:
                          "0 8px 30px rgba(0,0,0,.5)",

                        zIndex: 3,

                        pointerEvents: "none"
                      }}
                    >
                      <Play
                        size={30}
                        fill="white"
                        strokeWidth={0}
                        style={{
                          marginLeft: 4
                        }}
                      />
                    </div>

                    {/* ====================================
                        하단 방송 정보
                    ==================================== */}

                    <div
                      style={{
                        position: "absolute",

                        left: 14,
                        right: 14,
                        bottom: 12,

                        display: "flex",
                        alignItems: "flex-end",
                        justifyContent:
                          "space-between",
                        gap: 10,

                        zIndex: 3,

                        pointerEvents: "none"
                      }}
                    >
                      <div
                        style={{
                          minWidth: 0
                        }}
                      >
                        <strong
                          style={{
                            display: "block",
                            color: "#fff",
                            fontSize: 16,
                            fontWeight: 800,

                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow:
                              "ellipsis",

                            textShadow:
                              "0 2px 8px rgba(0,0,0,.9)"
                          }}
                        >
                          {item.name} LIVE
                        </strong>

                        <span
                          style={{
                            display: "block",
                            marginTop: 3,

                            color:
                              "rgba(255,255,255,.75)",

                            fontSize: 12,

                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow:
                              "ellipsis"
                          }}
                        >
                          현재 YouTube에서 방송 중
                        </span>
                      </div>

                      <span
                        style={{
                          flexShrink: 0,

                          color:
                            "rgba(255,255,255,.9)",

                          fontSize: 11,
                          fontWeight: 700
                        }}
                      >
                        YouTube
                      </span>
                    </div>

                  </div>

                  {/* ======================================
                      멤버 정보
                  ====================================== */}

                  <div className="live-body">

                    {/* ====================================
                        프로필 이미지
                    ==================================== */}

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

                    {/* ====================================
                        이름 / 직급 / 제목
                    ==================================== */}

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

                    {/* ====================================
                        YouTube 이동
                    ==================================== */}

                    <button
                      type="button"
                      onClick={() =>
                        openLive(item)
                      }
                      title="YouTube에서 보기"
                      aria-label={`${item.name} YouTube LIVE 보기`}
                      style={{
                        marginLeft: "auto",
                        flexShrink: 0,

                        width: 38,
                        height: 38,

                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",

                        border:
                          "1px solid rgba(255,255,255,.12)",

                        borderRadius: "50%",

                        background:
                          "rgba(255,255,255,.05)",

                        cursor: "pointer",

                        color: "inherit"
                      }}
                    >
                      <ExternalLink size={18} />
                    </button>

                  </div>

                </article>
              );
            })}

          </div>
        )}

    </section>
  );
}
