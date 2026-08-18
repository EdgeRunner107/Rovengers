import React, {
  useEffect,
  useMemo,
  useState
} from "react";

import {
  Search,
  Star,
  Users,
  Grid2X2,
  X
} from "lucide-react";


// ======================================================
// API 주소
// ======================================================

const API_BASE_URL =
  "https://asg-b2.onrender.com";


// ======================================================
// 금액 필터
//
// 숫자는 "만원" 단위로 표시
// ======================================================

const ranges = [

  {
    key: "all",
    label: "전체"
  },

  {
    key: "new",
    label: "신규"
  },

  {
    key: "group",
    label: "단체"
  },

  {
    key: "under10",
    label: "▼ 10만원"
  },

  {
    key: "10-50",
    label: "10~50만원"
  },

  {
    key: "50-100",
    label: "50~100만원"
  },

  {
    key: "100-200",
    label: "100~200만원"
  },

  {
    key: "over200",
    label: "200만원 ▲"
  }

];


// ======================================================
// 시그니처 이미지 팝업
// ======================================================

function SignatureModal({
  item,
  onClose
}) {

  useEffect(() => {

    if (!item) {
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
    item,
    onClose
  ]);


  if (!item) {
    return null;
  }


  return (

    <div
      className="signature-image-modal"
      onClick={onClose}
    >

      <div
        className="signature-image-modal-content"
        onClick={(event) =>
          event.stopPropagation()
        }
      >

        {/* ==============================================
            팝업 상단
        ============================================== */}

        <div className="signature-image-modal-head">

          <div>

            <span>

              {Number(
                item.amount || 0
              ).toLocaleString(
                "ko-KR"
              )}

            </span>


            <strong>

              {item.name}

            </strong>

          </div>


          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
          >

            <X size={22} />

          </button>

        </div>


        {/* ==============================================
            이미지
        ============================================== */}

        <div className="signature-image-modal-body">

          <img
            src={
              item.image_url
            }
            alt={
              item.name
            }
          />

        </div>

      </div>

    </div>

  );

}


// ======================================================
// SignaturePage
// ======================================================

export default function SignaturePage() {

  // ====================================================
  // 실제 API 데이터
  // ====================================================

  const [
    signatureItems,
    setSignatureItems
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
  // 필터
  // ====================================================

  const [
    filter,
    setFilter
  ] = useState(
    "all"
  );


  const [
    query,
    setQuery
  ] = useState(
    ""
  );


  // ====================================================
  // 이미지 팝업
  // ====================================================

  const [
    selectedSignature,
    setSelectedSignature
  ] = useState(null);


  // ====================================================
  // 시그니처 API 조회
  //
  // GET /signatures
  // ====================================================

  const loadSignatures =
    async () => {

      try {

        setLoading(true);

        setError(null);


        const response =
          await fetch(
            `${API_BASE_URL}/signatures?limit=1000`
          );


        if (!response.ok) {

          throw new Error(
            `시그니처 요청 실패 (${response.status})`
          );

        }


        const result =
          await response.json();


        if (!result.success) {

          throw new Error(
            result.error ||
            "시그니처를 불러오지 못했습니다."
          );

        }


        const items =
          Array.isArray(
            result.data
          )
            ? result.data
            : [];


        // ================================================
        // 금액 오름차순 정렬
        // ================================================

        const sorted =
          [...items].sort(
            (a, b) => {

              const amountA =
                Number(
                  a.amount || 0
                );


              const amountB =
                Number(
                  b.amount || 0
                );


              if (
                amountA !== amountB
              ) {

                return (
                  amountA -
                  amountB
                );

              }


              return (
                Number(a.id) -
                Number(b.id)
              );

            }
          );


        setSignatureItems(
          sorted
        );


      } catch (error) {

        console.error(
          "❌ 시그니처 조회 실패:",
          error
        );


        setError(
          error.message
        );


        setSignatureItems([]);


      } finally {

        setLoading(false);

      }

    };


  // ====================================================
  // 최초 조회
  // ====================================================

  useEffect(() => {

    loadSignatures();

  }, []);


  // ====================================================
  // 검색 + 금액 필터
  // ====================================================

  const filtered =
    useMemo(() => {

      return signatureItems.filter(
        (item) => {

          // ==============================================
          // 검색
          // ==============================================

          const name =
            String(
              item.name || ""
            );


          const search =
            query
              .trim()
              .toLowerCase();


          const matchText =
            name
              .toLowerCase()
              .includes(
                search
              );


          if (!matchText) {

            return false;

          }


          // ==============================================
          // 금액
          // ==============================================

          const amount =
            Number(
              item.amount || 0
            );


          // ==============================================
          // 전체
          // ==============================================

          if (
            filter === "all"
          ) {

            return true;

          }


          // ==============================================
          // 신규
          //
          // 현재는 모든 시그니처를 신규 취급
          // ==============================================

          if (
            filter === "new"
          ) {

            return true;

          }


          // ==============================================
          // 단체
          //
          // 아직 DB 구분값이 없으므로
          // 현재는 결과 없음
          // ==============================================

          if (
            filter === "group"
          ) {

            return false;

          }


          // ==============================================
          // 10만원 이하
          // ==============================================

          if (
            filter === "under10"
          ) {

            return (
              amount <=
              100000
            );

          }


          // ==============================================
          // 10만원 이상 ~ 50만원 이하
          // ==============================================

          if (
            filter === "10-50"
          ) {

            return (
              amount >=
                100000 &&

              amount <=
                500000
            );

          }


          // ==============================================
          // 50만원 이상 ~ 100만원 이하
          // ==============================================

          if (
            filter === "50-100"
          ) {

            return (
              amount >=
                500000 &&

              amount <=
                1000000
            );

          }


          // ==============================================
          // 100만원 이상 ~ 200만원 이하
          // ==============================================

          if (
            filter === "100-200"
          ) {

            return (
              amount >=
                1000000 &&

              amount <=
                2000000
            );

          }


          // ==============================================
          // 200만원 이상
          // ==============================================

          if (
            filter === "over200"
          ) {

            return (
              amount >=
              2000000
            );

          }


          return true;

        }
      );

    }, [
      signatureItems,
      filter,
      query
    ]);


  return (

    <>

      <main className="signature-page">


        {/* ==================================================
            상단 툴바
        ================================================== */}

        <div className="signature-toolbar">


          {/* ==================================================
              필터
          ================================================== */}

          <div className="signature-filter-row">

            {ranges.map(
              (item) => {

                const Icon =

                  item.key === "all"

                    ? Grid2X2

                    : item.key === "new"

                      ? Star

                      : item.key === "group"

                        ? Users

                        : null;


                return (

                  <button
                    key={
                      item.key
                    }
                    className={
                      filter ===
                      item.key

                        ? "sig-filter active"

                        : "sig-filter"
                    }
                    onClick={() =>
                      setFilter(
                        item.key
                      )
                    }
                  >

                    {Icon && (

                      <Icon
                        size={14}
                        fill={
                          item.key === "new"
                            ? "currentColor"
                            : "none"
                        }
                      />

                    )}


                    {item.label}

                  </button>

                );

              }
            )}

          </div>


          {/* ==================================================
              검색
          ================================================== */}

          <label className="signature-search">

            <Search
              size={18}
            />


            <input
              value={query}
              onChange={(event) =>
                setQuery(
                  event.target.value
                )
              }
              placeholder={
                `시그니처 검색 (${signatureItems.length}곡)`
              }
            />

          </label>

        </div>


        {/* ==================================================
            로딩
        ================================================== */}

        {loading && (

          <div className="signature-empty">

            시그니처를 불러오는 중입니다.

          </div>

        )}


        {/* ==================================================
            오류
        ================================================== */}

        {!loading &&
          error && (

            <div className="signature-empty">

              <strong>

                시그니처를 불러오지 못했습니다.

              </strong>


              <p>

                {error}

              </p>


              <button
                type="button"
                onClick={
                  loadSignatures
                }
              >

                다시 불러오기

              </button>

            </div>

          )}


        {/* ==================================================
            검색 결과 없음
        ================================================== */}

        {!loading &&
          !error &&
          filtered.length === 0 && (

            <div className="signature-empty">

              조건에 맞는 시그니처가 없습니다.

            </div>

          )}


        {/* ==================================================
            시그니처 갤러리
        ================================================== */}

        {!loading &&
          !error &&
          filtered.length > 0 && (

            <div className="signature-gallery">

              {filtered.map(
                (item) => (

                  <article
                    className="signature-gallery-card"
                    key={
                      item.id
                    }
                    onClick={() =>
                      setSelectedSignature(
                        item
                      )
                    }
                    style={{
                      cursor:
                        "pointer"
                    }}
                  >

                    {/* ======================================
                        이미지
                    ====================================== */}

                    <div className="signature-gallery-thumb">

                      <img
                        src={
                          item.image_url
                        }
                        alt={
                          item.name
                        }
                        loading="lazy"
                      />


                      {/* ====================================
                          이미지 위 금액
                      ==================================== */}

                      <div className="signature-price-big">

                        {Number(
                          item.amount || 0
                        ).toLocaleString(
                          "ko-KR"
                        )}

                      </div>

                    </div>


                    {/* ======================================
                        하단 정보
                    ====================================== */}

                    <div className="signature-gallery-info">

                      <span>

                        {Number(
                          item.amount || 0
                        ).toLocaleString(
                          "ko-KR"
                        )}

                      </span>


                      <strong>

                        {item.name}

                      </strong>

                    </div>

                  </article>

                )
              )}

            </div>

          )}

      </main>


      {/* ==================================================
          이미지 팝업
      ================================================== */}

      <SignatureModal
        item={
          selectedSignature
        }
        onClose={() =>
          setSelectedSignature(
            null
          )
        }
      />

    </>

  );

}