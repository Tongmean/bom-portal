// components/LoadingSpin.jsx

import { Spin } from "antd";

const LoadingSpin = ({ loading, percent }) => {

  // Hide component when not loading
  if (!loading && percent === 0) return null;

  return (
    <div
      style={{
        // Cover the entire screen
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",

        // Center everything
        display: "flex",
        justifyContent: "center",
        alignItems: "center",

        // Dark transparent background
        background: "rgba(0,0,0,0.35)",

        // Always on top
        zIndex: 9999,
      }}
    >
      <div
        style={{
          width: 260,
          padding: 30,
          borderRadius: 12,
          background: "#fff",
          textAlign: "center",
          boxShadow: "0 4px 20px rgba(0,0,0,.2)",
        }}
      >
        {/* Loading Spinner */}
        <Spin size="large" />

        {/* Percentage */}
        <div
          style={{
            marginTop: 20,
            fontSize: 18,
            fontWeight: 600,
          }}
        >
          Loading... {percent}%
        </div>
      </div>
    </div>
  );
};

export default LoadingSpin;