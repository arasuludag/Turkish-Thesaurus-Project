import { Typography } from "@mui/material";

function Footer() {
  const yearNow = new Date().getFullYear();

  return (
    <footer>
      <Typography variant="caption">
        © {yearNow} Copyright: Aras Uludag
      </Typography>
    </footer>
  );
}
export default Footer;
