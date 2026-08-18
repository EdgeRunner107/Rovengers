import React, {
  useEffect,
  useMemo,
  useState
} from "react";


// ======================================================
// API
// ======================================================

const API_URL =
  "https://asg-b2.onrender.com/supabase-data";


// ======================================================
// 그래프 색상
// ======================================================

const palette = [
  "#8b6cff",
  "#f6c453",
  "#ff8c9f",
  "#8fd4ff",
  "#d59cff",
  "#91e6b7",
  "#ffb15a",
  "#f2e0a2",
  "#ff9de2",
  "#a8b6ff",
  "#80e4e4",
  "#c5a3ff"
];


// ======================================================
// 숫자 표시
// ======================================================

function formatNumber(value) {

  return Number(
    value || 0
  ).toLocaleString(
    "ko-KR"
  );

}


// ======================================================
// Y축 숫자 표시
// ======================================================

function formatAxisNumber(value) {

  const number =
    Number(
      value || 0
    );


  if (
    number >= 100000000
  ) {

    const result =
      number /
      100000000;


    return `${
      Number.isInteger(result)
        ? result
        : result.toFixed(1)
    }억`;

  }


  if (
    number >= 10000
  ) {

    const result =
      number /
      10000;


    return `${
      Number.isInteger(result)
        ? result
        : result.toFixed(0)
    }만`;

  }


  return formatNumber(
    number
  );

}


// ======================================================
// 회차명 표시
// ======================================================

function getRoundLabel(round) {

  const text =
    String(
      round || ""
    ).trim();


  if (
    text.includes(
      "직급전"
    )
  ) {

    return "직급전";

  }


  const match =
    text.match(
      /(\d+)\s*회차/
    );


  if (match) {

    return `${match[1]}회차`;

  }


  return text;

}


// ======================================================
// 회차 정렬
// ======================================================

function getRoundOrder(round) {

  const text =
    String(
      round || ""
    ).trim();


  if (
    text.includes(
      "직급전"
    )
  ) {

    return 0;

  }


  const match =
    text.match(
      /(\d+)\s*회차/
    );


  if (match) {

    return (
      Number(
        match[1]
      ) +
      1
    );

  }


  return 9999;

}


// ======================================================
// 그래프 좌표 생성
//
// 회차마다 120px 고정 간격
// 왼쪽부터 순서대로 배치
// ======================================================

function buildPoints(
  values,
  height,
  maxValue
) {

  const padLeft =
    90;

  const padTop =
    45;

  const padBottom =
    75;

  const pointGap =
    120;


  const innerHeight =
    height -
    padTop -
    padBottom;


  return values.map(
    (
      value,
      index
    ) => {

      const x =
        padLeft +
        index *
        pointGap;


      const y =
        height -
        padBottom -
        (
          Number(
            value || 0
          ) /
          Math.max(
            maxValue,
            1
          )
        ) *
        innerHeight;


      return [
        x,
        y
      ];

    }
  );

}


// ======================================================
// ScoreTrend
// ======================================================

export default function ScoreTrend() {

  // ====================================================
  // 원본 데이터
  // ====================================================

  const [
    donations,
    setDonations
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
  // 멤버 그래프 표시 여부
  // ====================================================

  const [
    enabled,
    setEnabled
  ] = useState({});


  // ====================================================
  // API 조회
  // ====================================================

  const loadData =
    async () => {

      try {

        setLoading(true);

        setError(null);


        const response =
          await fetch(
            API_URL
          );


        if (
          !response.ok
        ) {

          throw new Error(
            `데이터 요청 실패 (${response.status})`
          );

        }


        const result =
          await response.json();


        if (
          !result.success
        ) {

          throw new Error(
            result.error ||
            "데이터를 불러오지 못했습니다."
          );

        }


        setDonations(
          Array.isArray(
            result.data
          )
            ? result.data
            : []
        );


      } catch (error) {

        console.error(
          "데이터 조회 실패:",
          error
        );


        setError(
          error.message
        );


        setDonations([]);


      } finally {

        setLoading(false);

      }

    };


  // ====================================================
  // 최초 조회
  // ====================================================

  useEffect(() => {

    loadData();

  }, []);


  // ====================================================
  // 멤버 목록
  // ====================================================

  const scoreMembers =
    useMemo(() => {

      return [

        ...new Set(

          donations

            .map(
              row =>
                String(
                  row.streamer ||
                  ""
                ).trim()
            )

            .filter(
              Boolean
            )

        )

      ];

    }, [
      donations
    ]);


  // ====================================================
  // 기본 그래프 ON
  // ====================================================

  useEffect(() => {

    setEnabled(
      previous => {

        const next = {
          ...previous
        };


        scoreMembers.forEach(
          member => {

            if (
              next[
                member
              ] ===
              undefined
            ) {

              next[
                member
              ] =
                true;

            }

          }
        );


        return next;

      }
    );

  }, [
    scoreMembers
  ]);


  // ====================================================
  // 회차
  // ====================================================

  const rounds =
    useMemo(() => {

      const unique =
        [

          ...new Set(

            donations

              .map(
                row =>
                  String(
                    row.round ||
                    ""
                  ).trim()
              )

              .filter(
                Boolean
              )

          )

        ];


      return unique.sort(
        (
          a,
          b
        ) => {

          return (
            getRoundOrder(
              a
            ) -
            getRoundOrder(
              b
            )
          );

        }
      );

    }, [
      donations
    ]);


  // ====================================================
  // 회차별 멤버 점수
  // ====================================================

  const scoreTrend =
    useMemo(() => {

      return rounds.map(
        round => {

          const row = {
            round
          };


          scoreMembers.forEach(
            member => {

              row[
                member
              ] =
                0;

            }
          );


          donations.forEach(
            donation => {

              const donationRound =
                String(
                  donation.round ||
                  ""
                ).trim();


              if (
                donationRound !==
                round
              ) {

                return;

              }


              const member =
                String(
                  donation.streamer ||
                  ""
                ).trim();


              if (
                !member
              ) {

                return;

              }


              row[
                member
              ] =
                Number(
                  row[
                    member
                  ] ||
                  0
                ) +
                Number(
                  donation.amount ||
                  0
                );

            }
          );


          return row;

        }
      );

    }, [
      rounds,
      scoreMembers,
      donations
    ]);


  // ====================================================
  // 멤버 총점
  // ====================================================

  const memberTotals =
    useMemo(() => {

      const result = {};


      scoreMembers.forEach(
        member => {

          result[
            member
          ] =
            donations

              .filter(
                row =>
                  String(
                    row.streamer ||
                    ""
                  ).trim() ===
                  member
              )

              .reduce(
                (
                  total,
                  row
                ) =>
                  total +
                  Number(
                    row.amount ||
                    0
                  ),
                0
              );

        }
      );


      return result;

    }, [
      donations,
      scoreMembers
    ]);


  // ====================================================
  // 전체 총점
  // ====================================================

  const totalAmount =
    useMemo(() => {

      return donations.reduce(
        (
          total,
          row
        ) => {

          return (
            total +
            Number(
              row.amount ||
              0
            )
          );

        },
        0
      );

    }, [
      donations
    ]);


  // ====================================================
  // 통합 후원자 순위
  // ====================================================

  const donorRanking =
    useMemo(() => {

      const map =
        new Map();


      donations.forEach(
        row => {

          const nickname =
            String(
              row.nickname ||
              row.user_id ||
              "익명"
            ).trim();


          const amount =
            Number(
              row.amount ||
              0
            );


          if (
            !map.has(
              nickname
            )
          ) {

            map.set(
              nickname,
              {
                nickname,
                amount: 0
              }
            );

          }


          map.get(
            nickname
          ).amount +=
            amount;

        }
      );


      return Array.from(
        map.values()
      ).sort(
        (
          a,
          b
        ) =>
          b.amount -
          a.amount
      );

    }, [
      donations
    ]);


  // ====================================================
  // 그래프 최대값
  // ====================================================

  const maxValue =
    useMemo(() => {

      if (
        !scoreTrend.length ||
        !scoreMembers.length
      ) {

        return 1;

      }


      const values =
        scoreTrend.flatMap(
          row =>
            scoreMembers.map(
              member =>
                Number(
                  row[
                    member
                  ] ||
                  0
                )
            )
        );


      return (
        Math.max(
          ...values,
          1
        ) *
        1.12
      );

    }, [
      scoreTrend,
      scoreMembers
    ]);


  // ====================================================
  // 그래프 크기
  //
  // 회차마다 120px
  // ====================================================

  const pointGap =
    120;


  const padLeft =
    90;


  const padRight =
    100;


  const width =
    Math.max(
      1050,
      padLeft +
      Math.max(
        rounds.length -
        1,
        0
      ) *
      pointGap +
      padRight
    );


  const height =
    460;


  const padTop =
    45;


  const padBottom =
    75;


  // ====================================================
  // 로딩
  // ====================================================

  if (
    loading
  ) {

    return (

      <main className="data-page">

        <div className="score-data-message">

          데이터를 불러오는 중입니다.

        </div>

      </main>

    );

  }


  // ====================================================
  // 오류
  // ====================================================

  if (
    error
  ) {

    return (

      <main className="data-page">

        <div className="score-data-message">

          <strong>
            데이터를 불러오지 못했습니다.
          </strong>


          <p>
            {error}
          </p>


          <button
            type="button"
            onClick={
              loadData
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

    <main className="data-page">


      {/* ==================================================
          상단 제목
      ================================================== */}

      <div className="data-page-title">

        <div>

          <span>
            PERFORMANCE DATA
          </span>


          <h1>
            회차별 멤버 점수
          </h1>


          <p>

            직급전부터 일반 회차까지 멤버별 점수 변화를
            확인할 수 있습니다.

          </p>

        </div>


        <div className="data-total-box">

          <span>
            TOTAL
          </span>


          <strong>

            {formatNumber(
              totalAmount
            )} P

          </strong>

        </div>

      </div>


      {/* ==================================================
          멤버 선택
      ================================================== */}

      <div className="score-summary-grid">

        {scoreMembers.map(
          (
            member,
            index
          ) => {

            const color =
              palette[
                index %
                palette.length
              ];


            return (

              <button
                key={
                  member
                }
                className={
                  enabled[
                    member
                  ]
                    ? "score-chip active"
                    : "score-chip"
                }
                onClick={() =>
                  setEnabled(
                    previous => ({

                      ...previous,

                      [member]:
                        !previous[
                          member
                        ]

                    })
                  )
                }
              >

                <i
                  style={{
                    background:
                      color
                  }}
                />


                <span>

                  {member}

                </span>


                <strong>

                  {formatNumber(
                    memberTotals[
                      member
                    ]
                  )} P

                </strong>

              </button>

            );

          }
        )}

      </div>


      {/* ==================================================
          그래프
      ================================================== */}

      <section className="data-panel">

        <div className="data-panel-head">

          <div>

            <span>
              ROUND TREND
            </span>


            <h2>
              회차별 점수 추이
            </h2>

          </div>


          <small>

            멤버를 눌러 그래프 표시 / 숨김

          </small>

        </div>


        <div className="chart-scroll">

          <svg
            className="score-chart"
            viewBox={
              `0 0 ${width} ${height}`
            }
            style={{
              minWidth:
                `${width}px`
            }}
            role="img"
            aria-label="회차별 멤버 점수 그래프"
          >


            {/* ============================================
                Y축 GRID
            ============================================ */}

            {[0, 1, 2, 3, 4].map(
              index => {

                const ratio =
                  index /
                  4;


                const y =
                  padTop +
                  ratio *
                  (
                    height -
                    padTop -
                    padBottom
                  );


                const value =
                  maxValue *
                  (
                    1 -
                    ratio
                  );


                return (

                  <g
                    key={
                      index
                    }
                  >

                    <line
                      x1={
                        padLeft
                      }
                      y1={
                        y
                      }
                      x2={
                        width -
                        padRight
                      }
                      y2={
                        y
                      }
                      stroke="rgba(255,255,255,.09)"
                      strokeDasharray="5 5"
                    />


                    <text
                      x={
                        padLeft -
                        14
                      }
                      y={
                        y +
                        5
                      }
                      textAnchor="end"
                      fill="#7f8794"
                      fontSize="13"
                    >

                      {formatAxisNumber(
                        value
                      )}

                    </text>

                  </g>

                );

              }
            )}


            {/* ============================================
                X축 회차
            ============================================ */}

            {scoreTrend.map(
              (
                row,
                index
              ) => {

                const x =
                  padLeft +
                  index *
                  pointGap;


                return (

                  <g
                    key={
                      row.round
                    }
                  >

                    <line
                      x1={
                        x
                      }
                      y1={
                        padTop
                      }
                      x2={
                        x
                      }
                      y2={
                        height -
                        padBottom
                      }
                      stroke="rgba(255,255,255,.025)"
                    />


                    <text
                      x={
                        x
                      }
                      y={
                        height -
                        27
                      }
                      textAnchor="middle"
                      fill="#8d95a2"
                      fontSize="13"
                      fontWeight="600"
                    >

                      {getRoundLabel(
                        row.round
                      )}

                    </text>

                  </g>

                );

              }
            )}


            {/* ============================================
                멤버 LINE
            ============================================ */}

            {scoreMembers.map(
              (
                member,
                memberIndex
              ) => {

                if (
                  !enabled[
                    member
                  ]
                ) {

                  return null;

                }


                const color =
                  palette[
                    memberIndex %
                    palette.length
                  ];


                const values =
                  scoreTrend.map(
                    row =>
                      Number(
                        row[
                          member
                        ] ||
                        0
                      )
                  );


                const points =
                  buildPoints(
                    values,
                    height,
                    maxValue
                  );


                const pointsAttribute =
                  points

                    .map(
                      (
                        [
                          x,
                          y
                        ]
                      ) =>
                        `${x},${y}`
                    )

                    .join(
                      " "
                    );


                return (

                  <g
                    key={
                      member
                    }
                  >


                    {/* ====================================
                        연결선
                    ==================================== */}

                    {points.length >
                      1 && (

                      <polyline
                        points={
                          pointsAttribute
                        }
                        fill="none"
                        stroke={
                          color
                        }
                        strokeWidth="3.5"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                      />

                    )}


                    {/* ====================================
                        회차별 점 + 멤버 이름
                    ==================================== */}

                    {points.map(
                      (
                        [
                          x,
                          y
                        ],
                        pointIndex
                      ) => {

                        const value =
                          values[
                            pointIndex
                          ];


                        const round =
                          scoreTrend[
                            pointIndex
                          ]?.round;


                        return (

                          <g
                            key={
                              `${member}-${round}`
                            }
                          >


                            {/* 점 */}

                            <circle
                              cx={
                                x
                              }
                              cy={
                                y
                              }
                              r="5.5"
                              fill="#111722"
                              stroke={
                                color
                              }
                              strokeWidth="3"
                            >

                              <title>

                                {getRoundLabel(
                                  round
                                )}

                                {" · "}

                                {member}

                                {" · "}

                                {formatNumber(
                                  value
                                )} P

                              </title>

                            </circle>


                            {/* ==================================
                                멤버 이름

                                점의 오른쪽에 위치
                                왼쪽 정렬
                            ================================== */}

                            {value >
                              0 && (

                              <text
                                x={
                                  x +
                                  10
                                }
                                y={
                                  y +
                                  4
                                }
                                textAnchor="start"
                                fill={
                                  color
                                }
                                fontSize="11"
                                fontWeight="800"
                                style={{
                                  paintOrder:
                                    "stroke",

                                  stroke:
                                    "#0d131b",

                                  strokeWidth:
                                    "4px",

                                  strokeLinejoin:
                                    "round"
                                }}
                              >

                                {member}

                              </text>

                            )}

                          </g>

                        );

                      }
                    )}

                  </g>

                );

              }
            )}

          </svg>

        </div>

      </section>


      {/* ==================================================
          통합 후원자 순위
      ================================================== */}

      <section className="data-panel donor-panel">

        <div className="data-panel-head">

          <div>

            <span>
              TOTAL DONOR RANKING
            </span>


            <h2>
              통합 후원자 순위
            </h2>

          </div>


          <small>

            총{" "}

            {formatNumber(
              donorRanking.length
            )}

            명

          </small>

        </div>


        <div className="clean-ranking-table">


          {/* ==============================================
              헤더
          ============================================== */}

          <div className="clean-ranking-header">

            <span>
              순위
            </span>

            <span>
              닉네임
            </span>

            <span>
              금액
            </span>

          </div>


          {/* ==============================================
              랭킹
          ============================================== */}

          {donorRanking.map(
            (
              donor,
              index
            ) => (

              <div
                className={
                  index <
                  3

                    ? `clean-ranking-row ranking-top ranking-${index + 1}`

                    : "clean-ranking-row"
                }
                key={
                  donor.nickname
                }
              >

                <span className="ranking-number">

                  {index +
                    1}

                </span>


                <strong className="ranking-name">

                  {donor.nickname}

                </strong>


                <strong className="ranking-amount">

                  {formatNumber(
                    donor.amount
                  )}점

                </strong>

              </div>

            )
          )}

        </div>

      </section>

    </main>

  );

}