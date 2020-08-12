import React from "react";
import classNames from "classnames";

const Tabs = ({ tabs, currentTab, switchTab, className, active }) => (
  <div
    id="tab-container-ref"
    className={classNames(`tabs-container ${className || ""}`, { active })}
  >
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
