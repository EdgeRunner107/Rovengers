import React, {
  useEffect,
  useState
} from "react";

import {
  X,
  Radio
} from "lucide-react";


// ======================================================
// 백엔드 API 주소
// ======================================================

const API_BASE_URL =
  "https://asg-b2.onrender.com";


// ======================================================
// 직급 순서
// ======================================================

const ROLE_ORDER = {

  "대표": 1,
  "부장": 2,
  "차장": 3,
  "과장": 4,
  "팀장": 5,
  "대리": 6,
  "주임": 7,
  "사원": 8,
  "인턴": 9

};


// ======================================================
// 이미지 팝업
// ======================================================

function ImageModal({
  modal,
  onClose
}) {

  useEffect(() => {

    if (!modal) {
      return;
    }


    const handleKeyDown =
      (event) => {

        if (
          event.key === "Escape"
        ) {

          onClose();

        }

      };


    window.addEventListener(
      "keydown",
      handleKeyDown
    );


    const previousOverflow =
      document.body.style.overflow;


    document.body.style.overflow =
      "hidden";


    return () => {

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );


      document.body.style.overflow =
        previousOverflow;

    };

  }, [
    modal,
    onClose
  ]);


  if (!modal) {
    return null;
  }


  return (

    <div
      className="member-image-modal"
      onClick={onClose}
    >

      <div
        className="member-image-modal-content"
        onClick={(event) =>
          event.stopPropagation()
        }
      >

        <div className="member-image-modal-head">

          <div>

            <span>
              {modal.role}
            </span>

            <strong>
              {modal.memberName}
            </strong>

            <b>
              {modal.title}
            </b>

          </div>


          <button
            type="button"
            className="member-image-modal-close"
            onClick={onClose}
            aria-label="닫기"
          >

            <X size={22} />

          </button>

        </div>


        <div className="member-image-modal-body">

          <img
            src={modal.image}
            alt={`${modal.memberName} ${modal.title}`}
          />

        </div>

      </div>

    </div>

  );

}


// ======================================================
// 멤버 카드
// ======================================================

function MemberCard({
  member,
  leader = false,
  onImageOpen
}) {

  // ====================================================
  // 이미지 팝업 열기
  // ====================================================

  const openImage = (
    title,
    image
  ) => {

    if (!image) {
      return;
    }


    onImageOpen({

      title,

      image,

      memberName:
        member.name,

      role:
        member.role

    });

  };


  // ====================================================
  // LIVE 방송 열기
  // ====================================================

  const openLive = () => {

    if (
      !member.is_live ||
      !member.live_url
    ) {

      return;

    }


    window.open(
      member.live_url,
      "_blank",
      "noopener,noreferrer"
    );

  };


  // ====================================================
  // YouTube 채널 주소
  //
  // 배포 환경에서 youtube_url/channel_url이 없어도
  // channel id가 있으면 직접 주소 생성
  // ====================================================

  const getYoutubeChannelUrl = () => {

    if (member.youtube_url) {
      return member.youtube_url;
    }

    if (member.channel_url) {
      return member.channel_url;
    }


    const channelId =
      member.youtube_channel_id ||
      member.channel_id;


    if (channelId) {

      return (
        `https://www.youtube.com/channel/` +
        `${channelId}`
      );

    }


    return null;

  };


  const youtubeChannelUrl =
    getYoutubeChannelUrl();


  return (

    <article
      className={
        leader
          ? (
              member.is_live
                ? "member-card leader-card live-member-card"
                : "member-card leader-card"
            )
          : (
              member.is_live
                ? "member-card live-member-card"
                : "member-card"
            )
      }
      style={{
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        boxSizing: "border-box"
      }}
    >

      {/* ==================================================
          멤버 YouTube 프로필 이미지
      ================================================== */}

      <div
        className={
          member.is_live
            ? "member-photo-wrap member-photo-live"
            : "member-photo-wrap"
        }
        style={{
          position: "relative"
        }}
      >

        {/* ==================================================
            프로필 전체 클릭 링크

            JS onClick이 아니라 실제 a 태그이므로
            Vercel 배포 환경에서도 안정적으로 작동
        ================================================== */}

        {youtubeChannelUrl && (

          <a
            href={
              youtubeChannelUrl
            }
            target="_blank"
            rel="noopener noreferrer"
            title={
              `${member.name} YouTube 채널`
            }
            aria-label={
              `${member.name} YouTube 채널로 이동`
            }
            style={{
              position: "absolute",
              inset: 0,

              zIndex: 2,

              display: "block",

              cursor: "pointer",

              textDecoration: "none"
            }}
          />

        )}


        {member.youtube_profile_image ? (

          <img
            src={
              member.youtube_profile_image
            }
            alt={
              member.name
            }
          />

        ) : (

          <div className="member-photo-placeholder">

            {member.name
              ?.charAt(0)
              ?.toUpperCase()}

          </div>

        )}


        {/* ==================================================
            LIVE 배지
        ================================================== */}

        {member.is_live && (
  <button
    type="button"
    className="member-live-badge"

    style={{
      position: "absolute",
      top: "8px",
      left: "8px",
      zIndex: 3,

      width: "auto",
      height: "24px",

      minWidth: 0,
      minHeight: 0,

      padding: "0 8px",

      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "4px",

      borderRadius: "999px",

      fontSize: "10px",
      fontWeight: 800,
      lineHeight: 1,

      whiteSpace: "nowrap"
    }}

    onClick={(event) => {
      event.stopPropagation();
      openLive();
    }}

    title="라이브 방송 보기"
  >
    <Radio size={10} />

    LIVE
  </button>
)}

      </div>


      {/* ==================================================
          직급 + 이름

          이름 영역 자체를 실제 링크로 변경
      ================================================== */}

      {youtubeChannelUrl ? (

        <a
          className="member-title-row"

          href={
            youtubeChannelUrl
          }

          target="_blank"

          rel="noopener noreferrer"

          title={
            `${member.name} YouTube 채널로 이동`
          }

          style={{
            cursor: "pointer",

            userSelect: "none",

            textDecoration: "none",

            color: "inherit"
          }}
        >

          <span className="role-badge">

            {member.role}

          </span>


          <strong>

            {member.name}

          </strong>

        </a>

      ) : (

        <div
          className="member-title-row"

          style={{
            cursor: "default",

            userSelect: "none"
          }}
        >

          <span className="role-badge">

            {member.role}

          </span>


          <strong>

            {member.name}

          </strong>

        </div>

      )}


      {/* ==================================================
          LIVE 방송 제목
      ================================================== */}

      {member.is_live &&
        member.live_title && (

          <button
            type="button"
            className="member-live-title"
            onClick={openLive}
          >

            <span>
              LIVE NOW
            </span>

            <p>
              {member.live_title}
            </p>

          </button>

        )}


      {/* ==================================================
          프로필 / 공약 / 시그

          대표는 표시하지 않음
      ================================================== */}

      {!leader && (

        <div className="member-actions">


          {/* 프로필 */}

          <button
            type="button"

            disabled={
              !member.member_profile_image
            }

            onClick={() =>
              openImage(
                "프로필",
                member.member_profile_image
              )
            }
          >

            <i className="dot purple" />

            프로필

          </button>


          {/* 공약 */}

          <button
            type="button"

            disabled={
              !member.promise_image
            }

            onClick={() =>
              openImage(
                "공약",
                member.promise_image
              )
            }
          >

            <i className="dot gold" />

            공약

          </button>


          {/* 시그 */}

          <button
            type="button"

            disabled={
              !member.signature_image
            }

            onClick={() =>
              openImage(
                "시그니처",
                member.signature_image
              )
            }
          >

            <i className="dot cyan" />

            시그

          </button>

        </div>

      )}

    </article>

  );

}


// ======================================================
// MemberPage
// ======================================================

export default function MemberPage() {

  // ====================================================
  // 멤버 데이터
  // ====================================================

  const [
    members,
    setMembers
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
  // 이미지 팝업
  // ====================================================

  const [
    modal,
    setModal
  ] = useState(null);


  // ====================================================
  // 모바일 여부
  // 680px 이하 = 1열
  // ====================================================

  const [
    isMobile,
    setIsMobile
  ] = useState(() => {

    if (
      typeof window === "undefined"
    ) {

      return false;

    }


    return (
      window.innerWidth <= 680
    );

  });


  // ====================================================
  // 화면 크기 감지
  // ====================================================

  useEffect(() => {

    const handleResize = () => {

      setIsMobile(
        window.innerWidth <= 680
      );

    };


    handleResize();


    window.addEventListener(
      "resize",
      handleResize
    );


    return () => {

      window.removeEventListener(
        "resize",
        handleResize
      );

    };

  }, []);


  // ====================================================
  // 멤버 API 조회
  // ====================================================

  const loadMembers =
    async () => {

      try {

        setLoading(true);

        setError(null);


        const response =
          await fetch(
            `${API_BASE_URL}/members-page`
          );


        if (!response.ok) {

          throw new Error(
            `멤버 목록 요청 실패 (${response.status})`
          );

        }


        const result =
          await response.json();


        if (!result.success) {

          throw new Error(
            result.error ||
            "멤버 목록을 불러오지 못했습니다."
          );

        }


        // ================================================
        // 직급순 정렬
        // ================================================

        const sortedMembers =
          Array.isArray(result.data)

            ? [...result.data].sort(
                (a, b) => {

                  const roleA =
                    Number(
                      a.role_order
                    ) ||
                    ROLE_ORDER[
                      a.role
                    ] ||
                    99;


                  const roleB =
                    Number(
                      b.role_order
                    ) ||
                    ROLE_ORDER[
                      b.role
                    ] ||
                    99;


                  if (
                    roleA !== roleB
                  ) {

                    return (
                      roleA -
                      roleB
                    );

                  }


                  const sortA =
                    Number(
                      a.sort_order
                    ) || 0;


                  const sortB =
                    Number(
                      b.sort_order
                    ) || 0;


                  if (
                    sortA !== sortB
                  ) {

                    return (
                      sortA -
                      sortB
                    );

                  }


                  return (
                    Number(a.id) -
                    Number(b.id)
                  );

                }
              )

            : [];


        setMembers(
          sortedMembers
        );


      } catch (error) {

        console.error(
          "❌ 멤버 페이지 조회 실패:",
          error
        );


        setError(
          error.message
        );


        setMembers([]);


      } finally {

        setLoading(false);

      }

    };


  // ====================================================
  // 최초 조회
  // ====================================================

  useEffect(() => {

    loadMembers();

  }, []);


  // ====================================================
  // 대표
  // ====================================================

  const leader =
    members.find(
      member =>
        member.role === "대표"
    );


  // ====================================================
  // 대표 제외 멤버
  // ====================================================

  const crewMembers =
    members.filter(
      member =>
        member.role !== "대표"
    );


  // ====================================================
  // 로딩
  // ====================================================

  if (loading) {

    return (

      <main
        className="members-page"

        style={{
          width: "100%",

          maxWidth: "100%",

          boxSizing: "border-box",

          overflowX: "hidden"
        }}
      >

        <div className="members-loading">

          멤버 정보를 불러오는 중입니다.

        </div>

      </main>

    );

  }


  // ====================================================
  // 오류
  // ====================================================

  if (error) {

    return (

      <main
        className="members-page"

        style={{
          width: "100%",

          maxWidth: "100%",

          boxSizing: "border-box",

          overflowX: "hidden"
        }}
      >

        <div className="members-error">

          <strong>

            멤버 정보를 불러오지 못했습니다.

          </strong>


          <p>

            {error}

          </p>


          <button
            type="button"
            onClick={
              loadMembers
            }
          >

            다시 불러오기

          </button>

        </div>

      </main>

    );

  }


  // ====================================================
  // 화면
  // ====================================================

  return (

    <>

      <main
        className="members-page"

        style={{
          width: "100%",

          maxWidth: "100%",

          boxSizing: "border-box",

          overflowX: "hidden"
        }}
      >


        {/* ==================================================
            상단
        ================================================== */}

        <div className="member-top-summary">

          <div />

          <div className="member-count">

          </div>

        </div>


        {/* ==================================================
            대표
        ================================================== */}

        {leader && (

          <section
            className="leader-section"

            style={{
              width: "100%",

              maxWidth: "100%",

              boxSizing: "border-box"
            }}
          >

            <div
              style={{
                width: "100%",

                maxWidth: "300px",

                minWidth: 0,

                margin: "0 auto"
              }}
            >

              <MemberCard
                member={leader}

                leader

                onImageOpen={
                  setModal
                }
              />

            </div>

          </section>

        )}


        {/* ==================================================
            나머지 멤버
        ================================================== */}

        <section
          className="team-section"

          style={{
            width: "100%",

            maxWidth: "100%",

            minWidth: 0,

            boxSizing: "border-box"
          }}
        >

          <div className="team-divider">

            <span />


            <h2>

              ROVENGERS{" "}

              <b>

                {crewMembers.length}명

              </b>

            </h2>


            <span />

          </div>


          {/* ==================================================
              멤버 GRID

              데스크탑 = 4열
              모바일 680px 이하 = 1열
          ================================================== */}

          <div
            className="member-grid"

            style={{
              display: "grid",

              gridTemplateColumns:
                isMobile
                  ? "minmax(0, 1fr)"
                  : "repeat(4, minmax(0, 1fr))",

              gap:
                isMobile
                  ? "14px"
                  : "20px",

              width: "100%",

              maxWidth:
                isMobile
                  ? "100%"
                  : "1180px",

              margin:
                "0 auto",

              minWidth: 0,

              boxSizing:
                "border-box",

              overflow:
                "hidden"
            }}
          >

            {crewMembers.map(
              member => (

                <div
                  key={
                    member.id
                  }

                  style={{
                    width: "100%",

                    maxWidth: "100%",

                    minWidth: 0,

                    boxSizing: "border-box"
                  }}
                >

                  <MemberCard
                    member={
                      member
                    }

                    onImageOpen={
                      setModal
                    }
                  />

                </div>

              )
            )}

          </div>

        </section>


        {/* ==================================================
            멤버 없음
        ================================================== */}

        {members.length === 0 && (

          <div className="members-empty">

            등록된 멤버가 없습니다.

          </div>

        )}

      </main>


      {/* ==================================================
          이미지 팝업
      ================================================== */}

      <ImageModal
        modal={modal}

        onClose={() =>
          setModal(null)
        }
      />

    </>

  );

}
