import React, { useState, useEffect } from "react";
import "./index.scss";
import leHieuImg from "../../assets/img/Stylists/le-hieu.jpg";
import huongImg from "../../assets/img/Stylists/huong.png";
import phuongImg from "../../assets/img/Stylists/phuong.png";
import anImg from "../../assets/img/Stylists/an.png";
import auImg from "../../assets/img/Stylists/au.png";
import tuanImg from "../../assets/img/Stylists/tuan.png";
import nhiImg from "../../assets/img/Stylists/nhi.png";

const stylistData = [
  { name: "STYLIST LÊ HIẾU", img: leHieuImg },
  { name: "STYLIST HƯƠNG", img: huongImg },
  { name: "STYLIST PHƯƠNG", img: phuongImg },
  { name: "STYLIST AN", img: anImg },
  { name: "STYLIST ÂU", img: auImg },
  { name: "STYLIST TUẤN", img: tuanImg },
  { name: "STYLIST NHI", img: nhiImg },
];

const preloadImages = (urls: string[]) => {
  urls.forEach((url) => {
    const img = new Image();
    img.src = url;
  });
};

const HairStylistSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false); // Trạng thái animation

  useEffect(() => {
    preloadImages(stylistData.map((stylist) => stylist.img));
  }, []);

  const handlePrev = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentIndex(
        currentIndex === 0 ? stylistData.length - 1 : currentIndex - 1
      );
    }
  };

  const handleNext = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentIndex(
        currentIndex === stylistData.length - 1 ? 0 : currentIndex + 1
      );
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === stylistData.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []); // Mảng phụ thuộc trống để đảm bảo chỉ chạy một lần khi component được mount

  const getIndexes = () => {
    const leftIndex =
      (currentIndex === 0 ? stylistData.length - 1 : currentIndex - 1) %
      stylistData.length;
    const rightIndex = (currentIndex + 1) % stylistData.length;
    return { leftIndex, currentIndex, rightIndex };
  };

  const { leftIndex, rightIndex } = getIndexes();

  const handleImageClick = (index: number) => {
    setCurrentIndex(index);
  };

  // Xử lý animation khi chuyển slide xong
  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 300); // Thời gian animation

      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  return (
    <div className="stylist-slider">
      <div className="left-title">
        <h2>HAIR STYLIST</h2>
        <h2>TẠI KIM HAIR SALON</h2>
      </div>
      <div className="slider-wrapper">
        <div className={`slider-container ${isAnimating ? "animating" : ""}`}>
          <button className="prev-arrow" onClick={handlePrev}>
            ←
          </button>
          <div className="slider-item">
            <div
              className={`slider-content ${
                leftIndex === currentIndex ? "active" : "inactive"
              }`}
              onClick={() => handleImageClick(leftIndex)}
            >
              <img
                src={stylistData[leftIndex].img}
                alt={stylistData[leftIndex].name}
                loading="lazy"
              />
              <h3>{stylistData[leftIndex].name}</h3>
            </div>
            <div className={`slider-content active`}>
              <img
                src={stylistData[currentIndex].img}
                alt={stylistData[currentIndex].name}
                loading="lazy"
              />
              <h3>{stylistData[currentIndex].name}</h3>
            </div>
            <div
              className={`slider-content ${
                rightIndex === currentIndex ? "active" : "inactive"
              }`}
              onClick={() => handleImageClick(rightIndex)}
            >
              <img
                src={stylistData[rightIndex].img}
                alt={stylistData[rightIndex].name}
                loading="lazy"
              />
              <h3>{stylistData[rightIndex].name}</h3>
            </div>
          </div>
          <button className="next-arrow" onClick={handleNext}>
            →
          </button>
        </div>
        <div className="dots">
          {stylistData.map((_, index) => (
            <span
              key={index}
              className={`dot ${index === currentIndex ? "active-dot" : ""}`}
              onClick={() => handleImageClick(index)}
            ></span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HairStylistSlider;
