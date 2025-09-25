import { useState } from "react";

const Settings = () => {
  const [primaryColor, setPrimaryColor] = useState(
    localStorage.getItem("primaryColor") || "#000000"
  );
  const [userFont, setUserFont] = useState(
    localStorage.getItem("userFont") || "'Roboto', sans-serif"
  );

  const fonts = [
    { label: "Roboto", value: "'Roboto', sans-serif" },
    { label: "Open Sans", value: "'Open Sans', sans-serif" },
    { label: "Montserrat", value: "'Montserrat', sans-serif" },
    { label: "Inter", value: "'Inter', sans-serif" },
    { label: "Poppins", value: "'Poppins', sans-serif" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("primaryColor", primaryColor);
    localStorage.setItem("userFont", userFont);
    window.location.reload();
  };

  return (
    <form className="page" onSubmit={handleSubmit}>
      <p>Asosiy rang:</p>
      <input
        type="color"
        value={primaryColor}
        onChange={(e) => setPrimaryColor(e.target.value)}
        style={{ height: "40px", width: "200px", borderRadius: "10px" }}
      />

      <p>Asosiy shrift:</p>
      <select
        style={{
          height: "40px",
          width: "200px",
          borderRadius: "10px",
          border: "1px solid #ccc",
        }}
        value={userFont}
        onChange={(e) => setUserFont(e.target.value)}
      >
        {fonts.map((f) => (
          <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>
            {f.label}
          </option>
        ))}
      </select>

      <button
        style={{
          height: "40px",
          width: "200px",
          borderRadius: "10px",
          background: "#1677ff",
          color: "#fff",
          fontSize: "14px",
          fontWeight: "500",
        }}
        type="submit"
      >
        Saqlash
      </button>
    </form>
  );
};

export default Settings;
