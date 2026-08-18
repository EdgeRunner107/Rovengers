
import React from "react";
import { House, Users, Database, Music2 } from "lucide-react";

const navItems = [
  { key: "home", label: "홈", icon: House },
  { key: "members", label: "멤버", icon: Users },
  { key: "data", label: "데이터", icon: Database },
  { key: "signature", label: "시그니처", icon: Music2 }
];

export default function Header({ currentPage, onNavigate }) {
  return (
    <header className="header">
      <div className="header-inner nav-header-inner">
        <button className="brand-group compact-brand brand-button" onClick={() => onNavigate("home")}>
          <img src="/rovengers-logo.png" className="brand-logo" alt="Rovengers" />
          <div>
            <div className="brand-name">ROVENGERS</div>
            
          </div>
        </button>

        <nav className="main-nav">
          {navItems.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              className={currentPage === key ? "main-nav-link active" : "main-nav-link"}
              onClick={() => onNavigate(key)}
            >
              <Icon size={17} strokeWidth={2.4} />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
