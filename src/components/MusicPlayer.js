import { useState, useRef, useEffect } from "react";
import {
  Box,
  IconButton,
  Typography,
  Select,
  MenuItem,
  Collapse,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import Draggable from "react-draggable";

const tracks = {
  "Best Song Ever! (❁´◡`❁)": "https://res.cloudinary.com/dedlpzbla/video/upload/v1746206768/never_give_up_dbqlyy.mp3",
  "Lofi Beats (〃￣︶￣)人(￣︶￣〃)": "https://res.cloudinary.com/dedlpzbla/video/upload/v1746207610/lofi_rdqrkd.mp3",
  "Ambient Rain |~^///^^///^^///^~|": "https://res.cloudinary.com/dedlpzbla/video/upload/v1746208595/rain_qein7k.mp3",
  "Nature Sounds ﹏𓃗﹏𓃗﹏": "https://res.cloudinary.com/dedlpzbla/video/upload/v1746208587/forest_sswwok.mp3",
  "Hans the goat Zimmerman ( ⓛ ω ⓛ *)":"https://res.cloudinary.com/dedlpzbla/video/upload/v1746208712/corn_chivzy.mp3"
};
export default function MusicPlayer() {
  const theme = useTheme();
  const audioRef = useRef(null);
  const [currentTrack, setCurrentTrack] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (audioRef.current && currentTrack) {
      audioRef.current.src = currentTrack;
      audioRef.current.play();
    }
  }, [currentTrack]);

  const playerBox = (
    <Box
      sx={{
        backgroundColor: theme.palette.background.paper,
        borderTop: `2px solid ${theme.palette.divider}`,
        color: theme.palette.text.primary,
        width: isMobile ? "100vw" : "260px",
        borderRadius: isMobile ? 0 : 2,
        boxShadow: isMobile ? 3 : 5,
        p: 1,
      }}
      className="handle"
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 1,
          py: 0.5,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography variant="subtitle2" fontSize="0.8rem">
          Select a Tune
        </Typography>
        <IconButton size="small" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <ExpandMore /> : <ExpandLess />}
        </IconButton>
      </Box>

      <Collapse in={!collapsed}>
        <Box sx={{ px: 1.5, py: 1 }}>
          <Select
            value={currentTrack}
            onChange={(e) => setCurrentTrack(e.target.value)}
            displayEmpty
            fullWidth
            size="small"
            sx={{ fontSize: "0.75rem" }}
          >
            <MenuItem value="" sx={{ fontSize: "0.75rem" }}>
              None
            </MenuItem>
            {Object.entries(tracks).map(([label, url]) => (
              <MenuItem key={label} value={url} sx={{ fontSize: "0.75rem" }}>
                {label}
              </MenuItem>
            ))}
          </Select>
          <audio controls ref={audioRef} style={{ marginTop: 8, width: "100%" }} />
        </Box>
      </Collapse>
    </Box>
  );

  if (isMobile) {
    return (
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100vw",
          zIndex: 1300,
        }}
      >
        {playerBox}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 1300,
      }}
    >
      <Draggable bounds="parent" handle=".handle">
        <Box
          sx={{
            position: "absolute",
            bottom: 16,
            right: 16,
            pointerEvents: "auto",
            cursor: "move",
          }}
        >
          {playerBox}
        </Box>
      </Draggable>
    </Box>
  );
}