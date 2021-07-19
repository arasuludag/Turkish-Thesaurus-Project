import React from "react";

function Footer() {
  const yearNow = new Date().getFullYear();

  return (
    <footer style={{ marginTop: "80vh" }}>
      <div>
        <p style={{ textAlign: "center", fontSize: "0.6rem" }}>
          © {yearNow} Copyright: Aras Uludag
        </p>
      </div>
    </footer>
  );
}
export default Footer;
