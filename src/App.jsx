import React, {
  useState
} from "react";

import Header from "./components/Header";
import HomePage from "./components/HomePage";
import MemberPage from "./components/MemberPage";
import SignaturePage from "./components/SignaturePage";
import ScoreTrend from "./components/ScoreTrend";


export default function App() {

  const [
    page,
    setPage
  ] = useState("home");


  // ======================================================
  // 페이지 이동
  // ======================================================

  const navigate = (next) => {

    setPage(next);


    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  };


  return (

    <div className="app">

      {/* ==================================================
          상단 네비게이션
      ================================================== */}

      <Header
        currentPage={page}
        onNavigate={navigate}
      />


      {/* ==================================================
          홈
      ================================================== */}

      {page === "home" && (

        <HomePage />

      )}


      {/* ==================================================
          멤버
      ================================================== */}

      {page === "members" && (

        <MemberPage />

      )}


      {/* ==================================================
          시그니처
      ================================================== */}

      {page === "signature" && (

        <SignaturePage />

      )}


      {/* ==================================================
          데이터
      ================================================== */}

      {page === "data" && (

        <ScoreTrend />

      )}

    </div>

  );

}