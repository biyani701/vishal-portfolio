import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import {
  Box,
  Container,
  Typography,
  CardContent,
  Stack,
  Paper,
  useTheme
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const PassionText = styled(Typography)(({ theme }) => ({
  fontStyle: 'italic',
  color: theme.palette.text.secondary,
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  maxWidth: 400,margin: '32px auto 0',
  textAlign: 'center'
}));

const Education = () => {
  const theme = useTheme();
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const educationData = [
    {
      degree: "M.Tech, Enery Systems Engineering",
      institution: "Indian Institute of Technology (IIT) Bombay",
      period: "1998–2000",
      description: "Advanced knowledge and innovative solutions for sustainable energy technologies and optimization."
    },
    {
      degree: "B.E., Chemical Engineering",
      institution: "Government Engineering College Raipur",
      period: "1994–1998",
      description: "Foundation in chemical engineering principles, process design, and industrial applications."
    }
  ];

  return (
    <Box
      id="education"
      sx={{
        py: 6,
        backgroundColor: theme.palette.background.default
      }}
    >
      <Container maxWidth="md">
        <Stack direction="row" alignItems="center" spacing={1} mb={4}>
          <SchoolIcon color="primary" sx={{ fontSize: 32 }} />
          <Typography variant="h4" component="h2" fontWeight="bold">
            Education
          </Typography>
        </Stack>

        <Stack spacing={3}>
          {educationData.map((item, index) => (
            <Paper
              key={index}
              elevation={hoveredIndex === index ? 4 : 1}
              sx={{
                borderLeft: '4px solid',
                borderColor: hoveredIndex === index ?
                  theme.palette.primary.main :
                  theme.palette.divider,
                transition: 'all 0.3s ease',
                transform: hoveredIndex === index ?
                  'translateX(4px)' :
                  'none',
                overflow: 'hidden'
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {item.degree}
                </Typography>
                <Typography
                  variant="subtitle1"
                  color="primary"
                  gutterBottom
                >
                  {item.institution}
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    mb: 2
                  }}
                >
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    sx={{ color: theme.palette.text.secondary }}
                  >
                    <CalendarTodayIcon fontSize="small" />
                    <Typography variant="body2">
                      {item.period}
                    </Typography>
                  </Stack>
                </Box>

                {/* <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  sx={{ color: theme.palette.text.secondary, mb: 2 }}
                >
                  <CalendarTodayIcon fontSize="small" />
                  <Typography variant="body2">
                    {item.period}
                  </Typography>
                </Stack> */}
                <PassionText variant="body1">
                  {item.description}
                </PassionText>
              </CardContent>
            </Paper>
          ))}
        </Stack>
      </Container>
    </Box>
  );
};

export default Education;