import React from "react";
import { Newspaper, Radio, PlaySquare, Youtube, TrendingUp } from "lucide-react";

const tabs = [
  { key: "posts", label: "게시물", Icon: Newspaper },
  { key: "live", label: "라이브", Icon: Radio },
  { key: "shorts", label: "쇼츠", Icon: PlaySquare },
  { key: "videos", label: "영상", Icon: Youtube },
  { key: "scores", label: "점수 추이", Icon: TrendingUp }
];

export default function TabBar({ activeTab, onChange }) {
  return (
    <div className="tabbar-wrap">
      <div className="tabbar">
        {tabs.map(({ key, label, Icon }) => (
          <button
            key={key}
            className={activeTab === key ? "tab active" : "tab"}
            onClick={() => onChange(key)}
          >
            <Icon size={18} />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
