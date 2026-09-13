import React from "react";
import {
  Box,
  Typography,
  useMediaQuery,
  useTheme,     
  
} from "@mui/material";

import {Timeline, TimelineItem, TimelineConnector , TimelineContent, TimelineDot, TimelineOppositeContent, TimelineSeparator } from '@mui/lab';
import CreditCardIcon from "@mui/icons-material/CreditCard";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import ShieldIcon from "@mui/icons-material/Shield";
import SendIcon from "@mui/icons-material/Send";
import GppGoodIcon from "@mui/icons-material/GppGood";
import { useLayoutDimensions } from "../../hooks/useLayoutDimensions";
import { motion } from "framer-motion";

const steps = [
  {
    label: "Transaction Initiated",
    description: "Cardholder initiates an online payment (card-not-present).",
    icon: <CreditCardIcon />,
  },
  {
    label: "Authentication Performed",
    description:
      "Issuer’s Access Control Server (ACS) verifies cardholder identity via 3-D Secure (e.g., OTP, biometrics).",
    icon: <VerifiedUserIcon />,
  },
  {
    label: "UCAF Generated",
    description:
      "Authentication result is encoded into the Universal Cardholder Authentication Field (UCAF).",
    icon: <ShieldIcon />,
  },
  {
    label: "Authorization Request Sent",
    description:
      "Merchant sends transaction data along with UCAF to the card network.",
    icon: <SendIcon />,
  },
  {
    label: "Issuer Decision",
    description:
      "Issuer reviews UCAF and other data to approve or decline the transaction.",
    icon: <GppGoodIcon />,
  },
];

export default function ThreeDSFlowStepper() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { getContentHeightWithOffset } = useLayoutDimensions();

  return (
    <Box
      sx={{
        maxWidth: 1000,
        mx: "auto",
        px: { xs: 2, sm: 3 },
        py: 4,
        minHeight: getContentHeightWithOffset(),
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography
        variant="h5"
        sx={{
          mb: 4,
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <ShieldIcon color="primary" /> 3-D Secure Flow with UCAF
      </Typography>

      <Timeline position={isMobile ? "right" : "alternate"}>
        {steps.map((step, index) => (
          <TimelineItem key={index}>
            {!isMobile && (
              <TimelineOppositeContent
                sx={{ m: "auto 0" }}
                align="right"
                variant="body2"
                color="text.secondary"
              >
                {step.label}
              </TimelineOppositeContent>
            )}

            <TimelineSeparator>
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <TimelineDot
                  color="primary"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: theme.palette.mode === "dark" ? "primary.light" : "primary.main",
                  }}
                >
                  {step.icon}
                </TimelineDot>
              </motion.div>
              {index < steps.length - 1 && <TimelineConnector />}
            </TimelineSeparator>

            <TimelineContent sx={{ py: 2, px: 2 }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {isMobile && (
                  <Typography variant="subtitle1" fontWeight="bold">
                    {step.label}
                  </Typography>
                )}
                <Typography variant="body2" color="text.secondary">
                  {step.description}
                </Typography>
              </motion.div>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </Box>
  );
}