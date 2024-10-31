import React, { useState, useEffect } from "react";
import "./index.scss";
import api from "../../config/axios";

const HairStylistSlider: React.FC = () => {
  const [stylistData, setStylistData] = useState<
    { id: number; name: string; img: string }[]
  >([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false); // Animation state

  useEffect(() => {
    const fetchStylists = async () => {
      try {
        // Fetch dữ liệu stylists và account
        const [stylistResponse, accountResponse] = await Promise.all([
          api.get("/stylist/getAllStylist"),
          api.get("/account"),
        ]);

        const stylistAccounts = accountResponse.data.filter(
          (account: any) => account.role === "STYLIST"
        );

        // Lấy đúng tên stylist từ account
        const stylistsWithNames = stylistResponse.data.map((stylist: any) => {
          const account = stylistAccounts.find((account: any) =>
            account.stylists.some((s: any) => s.id === stylist.id)
          );
          return {
            id: stylist.id,
            name: account ? `Stylist ${account.fullName}` : "Unknown Stylist",
            img: stylist.image,
          };
        });

        setStylistData(stylistsWithNames);
      } catch (error) {
        console.error("Error fetching stylists:", error);
      }
    };

    fetchStylists();
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

  // Chuyển silde tự động (nếu là ảnh cuối, thì quay về ảnh đầu)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === stylistData.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [stylistData]);

  // Xác định vị trí stylist trước và sau
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

  // Kết thúc animation
  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 300);

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
                src={stylistData[leftIndex]?.img}
                alt={stylistData[leftIndex]?.name}
                loading="lazy"
              />
              <h3>{stylistData[leftIndex]?.name}</h3>
            </div>
            <div className={`slider-content active`}>
              <img
                src={stylistData[currentIndex]?.img}
                alt={stylistData[currentIndex]?.name}
                loading="lazy"
              />
              <h3>{stylistData[currentIndex]?.name}</h3>
            </div>
            <div
              className={`slider-content ${
                rightIndex === currentIndex ? "active" : "inactive"
              }`}
              onClick={() => handleImageClick(rightIndex)}
            >
              <img
                src={stylistData[rightIndex]?.img}
                alt={stylistData[rightIndex]?.name}
                loading="lazy"
              />
              <h3>{stylistData[rightIndex]?.name}</h3>
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
