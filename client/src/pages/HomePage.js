import React, { useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  Stack,
  useTheme,
  useMediaQuery,
  Paper,
  Fade,
  Zoom,
  Slide
} from '@mui/material';
import {
  School as SchoolIcon,
  Search as SearchIcon,
  Star as StarIcon,
  Group as GroupIcon,
  AccessTime as AccessTimeIcon,
  LocationOn as LocationOnIcon,
  EmojiEvents as EmojiEventsIcon,
  ArrowForward as ArrowForwardIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const FeatureCard = ({ icon, title, description, delay }) => (
  <Fade in timeout={1000} style={{ transitionDelay: `${delay}ms` }}>
    <Card 
      sx={{ 
        height: '100%',
        transition: 'all 0.3s ease-in-out',
        '&:hover': { 
          transform: 'translateY(-8px)',
          boxShadow: '0 12px 24px rgba(0,0,0,0.1)'
        },
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '4px',
          background: 'linear-gradient(90deg, #1976d2, #21CBF3)',
          transform: 'scaleX(0)',
          transformOrigin: 'left',
          transition: 'transform 0.3s ease-in-out'
        },
        '&:hover::before': {
          transform: 'scaleX(1)'
        }
      }}
    >
      <CardContent sx={{ textAlign: 'center', p: 4 }}>
        <Box 
          sx={{ 
            color: 'primary.main',
            mb: 3,
            display: 'inline-block',
            p: 2,
            borderRadius: '50%',
            bgcolor: 'rgba(25, 118, 210, 0.1)',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              transform: 'scale(1.1)'
            }
          }}
        >
          {icon}
        </Box>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
          {description}
        </Typography>
      </CardContent>
    </Card>
  </Fade>
);

const StatCard = ({ number, label, delay }) => (
  <Zoom in timeout={1000} style={{ transitionDelay: `${delay}ms` }}>
    <Paper
      elevation={0}
      sx={{
        p: 4,
        textAlign: 'center',
        background: 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)',
        borderRadius: 3,
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
        }
      }}
    >
      <Typography
        variant="h2"
        component="div"
        sx={{ 
          fontWeight: 700,
          mb: 2,
          background: 'linear-gradient(45deg, #1976d2, #21CBF3)',
          backgroundClip: 'text',
          textFillColor: 'transparent'
        }}
      >
        {number}
      </Typography>
      <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
        {label}
      </Typography>
    </Paper>
  </Zoom>
);

const HomePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const features = [
    {
      icon: <SearchIcon sx={{ fontSize: 40 }} />,
      title: 'Find the Perfect Tutor',
      description: 'Browse through our extensive list of qualified tutors and find the one that matches your learning style.',
      delay: 200
    },
    {
      icon: <AccessTimeIcon sx={{ fontSize: 40 }} />,
      title: 'Flexible Scheduling',
      description: 'Book sessions at your convenience with our easy-to-use scheduling system.',
      delay: 400
    },
    {
      icon: <StarIcon sx={{ fontSize: 40 }} />,
      title: 'Quality Education',
      description: 'Learn from experienced tutors who are passionate about teaching.',
      delay: 600
    },
    {
      icon: <LocationOnIcon sx={{ fontSize: 40 }} />,
      title: 'Learn Anywhere',
      description: 'Access quality education from the comfort of your home or in-person sessions.',
      delay: 800
    }
  ];

  const stats = [
    { number: '1000+', label: 'Active Students', delay: 200 },
    { number: '500+', label: 'Qualified Tutors', delay: 400 },
    { number: '5000+', label: 'Sessions Completed', delay: 600 },
    { number: '4.8/5', label: 'Average Rating', delay: 800 }
  ];

  const benefits = [
    'Personalized Learning Experience',
    'Expert Tutors from Top Universities',
    'Flexible Online & In-Person Sessions',
    'Progress Tracking & Analytics',
    '24/7 Support & Guidance',
    'Affordable Learning Solutions'
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1976d2 0%, #21CBF3 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("/images/pattern.png")',
            opacity: 0.1,
            animation: 'moveBackground 20s linear infinite'
          }
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Slide direction="right" in timeout={1000}>
                <Box>
                  <Typography
                    variant="h1"
                    component="h1"
                    gutterBottom
                    sx={{
                      fontWeight: 800,
                      fontSize: { xs: '2.5rem', md: '4rem' },
                      lineHeight: 1.2,
                      mb: 3
                    }}
                  >
                    Transform Your Learning Journey
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{ mb: 4, opacity: 0.9, fontWeight: 400 }}
                  >
                    Connect with expert tutors and achieve your academic goals with personalized learning experiences
                  </Typography>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <Button
                      component={RouterLink}
                      to="/register"
                      variant="contained"
                      size="large"
                      endIcon={<ArrowForwardIcon />}
                      sx={{
                        bgcolor: 'white',
                        color: 'primary.main',
                        py: 1.5,
                        px: 4,
                        '&:hover': {
                          bgcolor: 'grey.100',
                          transform: 'translateX(5px)'
                        }
                      }}
                    >
                      Get Started
                    </Button>
                    <Button
                      component={RouterLink}
                      to="/search"
                      variant="outlined"
                      size="large"
                      sx={{
                        borderColor: 'white',
                        color: 'white',
                        py: 1.5,
                        px: 4,
                        '&:hover': {
                          borderColor: 'white',
                          bgcolor: 'rgba(255, 255, 255, 0.1)',
                          transform: 'translateX(5px)'
                        }
                      }}
                    >
                      Find Tutors
                    </Button>
                  </Stack>
                </Box>
              </Slide>
            </Grid>
            <Grid item xs={12} md={6}>
              <Zoom in timeout={1000}>
                <Box
                  component="img"
                  src="/images/hero-image.jpg"
                  alt="Online Learning"
                  sx={{
                    width: '100%',
                    maxWidth: 500,
                    display: { xs: 'none', md: 'block' },
                    ml: 'auto',
                    filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.2))',
                    animation: 'float 6s ease-in-out infinite'
                  }}
                />
              </Zoom>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4}>
          {stats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <StatCard {...stat} />
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Features Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 12 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            component="h2"
            align="center"
            gutterBottom
            sx={{ 
              mb: 8,
              fontWeight: 700,
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -10,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 60,
                height: 4,
                background: 'linear-gradient(90deg, #1976d2, #21CBF3)',
                borderRadius: 2
              }
            }}
          >
            Why Choose Us
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <FeatureCard {...feature} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Benefits Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Slide direction="left" in timeout={1000}>
              <Box>
                <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 700 }}>
                  Benefits of Learning with Us
                </Typography>
                <Stack spacing={2}>
                  {benefits.map((benefit, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <CheckCircleIcon color="primary" />
                      <Typography variant="h6">{benefit}</Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Slide>
          </Grid>
          <Grid item xs={12} md={6}>
            <Zoom in timeout={1000}>
              <Box
                component="img"
                src="/images/benefits-image.png"
                alt="Learning Benefits"
                sx={{
                  width: '100%',
                  maxWidth: 500,
                  ml: 'auto',
                  filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.1))'
                }}
              />
            </Zoom>
          </Grid>
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box sx={{ py: 12, bgcolor: 'grey.50' }}>
        <Container maxWidth="lg">
          <Paper
            elevation={0}
            sx={{
              p: { xs: 4, md: 8 },
              textAlign: 'center',
              background: 'linear-gradient(135deg, #1976d2 0%, #21CBF3 100%)',
              color: 'white',
              borderRadius: 4,
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'url("/images/pattern.png")',
                opacity: 0.1
              }
            }}
          >
            <Typography
              variant="h2"
              component="h2"
              gutterBottom
              sx={{ 
                fontWeight: 700,
                position: 'relative',
                zIndex: 1
              }}
            >
              Ready to Start Learning?
            </Typography>
            <Typography
              variant="h5"
              sx={{ 
                mb: 6,
                opacity: 0.9,
                position: 'relative',
                zIndex: 1
              }}
            >
              Join thousands of students who are already learning with us
            </Typography>
            <Button
              component={RouterLink}
              to="/register"
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                py: 1.5,
                px: 6,
                fontSize: '1.1rem',
                '&:hover': {
                  bgcolor: 'grey.100',
                  transform: 'translateX(5px)'
                }
              }}
            >
              Get Started Now
            </Button>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage; 