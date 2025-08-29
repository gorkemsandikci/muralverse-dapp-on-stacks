import { Box } from "@chakra-ui/react";
import ReactMarkdown from "react-markdown";

export default function StyledMarkdown({ children }: { children: string }) {
  return (
    <Box
      sx={{
        h1: {
          fontSize: "2xl",
          fontWeight: "bold",
          mb: 4,
          mt: 4,
          color: "white",
          textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
          fontFamily: "'Permanent Marker', cursive",
        },
        h2: {
          fontSize: "xl",
          fontWeight: "bold",
          mb: 3,
          mt: 5,
          color: "white",
          textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
          fontFamily: "'Permanent Marker', cursive",
        },
        p: {
          mb: 4,
          color: "rgba(255, 255, 255, 0.9)",
          textShadow: "0.5px 0.5px 1px rgba(0,0,0,0.6)",
        },
        "ul, ol": {
          pl: 6,
          mb: 4,
        },
        li: {
          ml: 4,
          mb: 2,
          color: "rgba(255, 255, 255, 0.8)",
        },
        a: {
          color: "rgba(0, 212, 255, 0.9)",
          textDecoration: "underline",
          textShadow: "0.5px 0.5px 1px rgba(0,0,0,0.6)",
        },
      }}
    >
      <ReactMarkdown>{children}</ReactMarkdown>
    </Box>
  );
}
