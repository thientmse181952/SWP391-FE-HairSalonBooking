import React from "react";
import "./index.scss";

const brandData = [
  {
    id: 1,
    src: "https://firebasestorage.googleapis.com/v0/b/swp391-7123d.appspot.com/o/Homepage%2FPartners%2Fdavines.png?alt=media&token=a527c17c-8f36-4b46-82ca-acdea056798f",
    alt: "Davines",
  },
  {
    id: 2,
    src: "https://firebasestorage.googleapis.com/v0/b/swp391-7123d.appspot.com/o/Homepage%2FPartners%2Fnashi.png?alt=media&token=70e79558-7e79-4fbc-8999-e1741da5a4b9",
    alt: "Nashi Argan",
  },
  {
    id: 3,
    src: "https://firebasestorage.googleapis.com/v0/b/swp391-7123d.appspot.com/o/Homepage%2FPartners%2Fgoldwell.png?alt=media&token=2a20c880-8d17-4508-913f-b425de6581cc",
    alt: "Goldwell",
  },
  {
    id: 4,
    src: "https://firebasestorage.googleapis.com/v0/b/swp391-7123d.appspot.com/o/Homepage%2FPartners%2Fmydentity.png?alt=media&token=2bfbc019-8784-4d6d-95c3-3d4ab26bc56b",
    alt: "mydentity",
  },
  {
    id: 5,
    src: "https://firebasestorage.googleapis.com/v0/b/swp391-7123d.appspot.com/o/Homepage%2FPartners%2Fjoico.png?alt=media&token=6d39dd05-7a09-41d9-9928-c6194bf19de4",
    alt: "Joico",
  },
  {
    id: 6,
    src: "https://firebasestorage.googleapis.com/v0/b/swp391-7123d.appspot.com/o/Homepage%2FPartners%2Floreal.png?alt=media&token=3c20240d-f0e7-4027-b513-157242a1af72",
    alt: "L'Oréal",
  },
  {
    id: 7,
    src: "https://firebasestorage.googleapis.com/v0/b/swp391-7123d.appspot.com/o/Homepage%2FPartners%2Fschwarzkopf.png?alt=media&token=2fb5d26b-9fa1-4546-b0da-4952ca87c423",
    alt: "Schwarzkopf",
  },
  {
    id: 8,
    src: "https://firebasestorage.googleapis.com/v0/b/swp391-7123d.appspot.com/o/Homepage%2FPartners%2Folaplex.png?alt=media&token=439bc210-1dec-439e-8387-16adc25f8eea",
    alt: "Olaplex",
  },
  {
    id: 9,
    src: "https://firebasestorage.googleapis.com/v0/b/swp391-7123d.appspot.com/o/Homepage%2FPartners%2Fgk.png?alt=media&token=b1252527-5737-48d9-8a79-28b2b55fe5cc",
    alt: "GK Hair",
  },
  {
    id: 10,
    src: "https://firebasestorage.googleapis.com/v0/b/swp391-7123d.appspot.com/o/Homepage%2FPartners%2Fmoroccanoil.png?alt=media&token=38618721-d01c-41f0-b32e-bcfbf405a310",
    alt: "Moroccanoil",
  },
];

const Brand: React.FC = () => {
  return (
    <div className="brand-section">
      <img
        src="https://firebasestorage.googleapis.com/v0/b/swp391-7123d.appspot.com/o/Brand%2Fthuong-hieu.png?alt=media&token=9c8f7cb9-bfa4-4e7a-91fc-9fd5709791a7"
        alt="Doi-tac"
      />
      <div className="brand-grid">
        {brandData.map((brand) => (
          <div className="brand-item" key={brand.id}>
            <img src={brand.src} alt={brand.alt} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Brand;
