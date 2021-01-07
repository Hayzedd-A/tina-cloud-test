import React, { useRef } from "react";
import classNames from "classnames";

const Tabs = ({ tabs, currentTab, switchTab, className, active, forCategories }) => {
  const tabRef = useRef();

  const scrollIntoView = id => {
    const itemLeft = document.getElementById(id).getBoundingClientRect().left;

    tabRef.current.scroll({
      left: itemLeft,
      behavior: "smooth"
    });
  };

  return (
    <div
      ref={tabRef}
      id="tab-container-ref"
      className={classNames(`${forCategories ? 'containerss' : ''} tabs-container ${className || ""}`, { active })}
    >
      <div style={{display: 'flex', maxWidth: '1000px', margin: 'auto', width: '100%'}}>
        <div style={{display: 'flex', width: '100%'}} className={classNames(`${className || ""}`, { active })}>
          {tabs.map((tab, index) => (
            <span
              id={`tab-${index}`}
              className={classNames("tab-item", { active: currentTab === index })}
              onClick={() => {
                scrollIntoView(`tab-${index}`);
                switchTab(index);
              }}
            >
              {tab}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tabs;
