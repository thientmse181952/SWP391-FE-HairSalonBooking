import React, { useEffect, useState } from "react";
import { ArrowUpOutlined } from "@ant-design/icons"; // Sử dụng icon mũi tên
import "./index.scss"; // Import file CSS

const ScrollToTop: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div>
      {visible && (
        <div className="scroll-to-top" onClick={scrollToTop}>
          <ArrowUpOutlined />
        </div>
      )}
    </div>
  );
};

export default ScrollToTop;
