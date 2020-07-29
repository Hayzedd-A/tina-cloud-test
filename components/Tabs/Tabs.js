import React from "react";
import classNames from "classnames";

const Tabs = ({ tabs, currentTab, switchTab, className }) => (
  <div className={`tabs-container ${className || ""}`}>
    {tabs.map((tab, index) => (
      <span
        key={`tab-${index}`}
        className={classNames("tab-item", { active: currentTab === index })}
        onClick={() => switchTab(index)}
      >
        {tab}
      </span>
    ))}
  </div>
);

export default Tabs;
