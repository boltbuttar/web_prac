import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
} from '@mui/icons-material';

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const footerLinks = {
    company: [
      { text: 'About Us', path: '/about' },
      { text: 'Careers', path: '/careers' },
      { text: 'Contact', path: '/contact' },
      { text: 'Blog', path: '/blog' },
    ],
    support: [
      { text: 'Help Center', path: '/help' },
      { text: 'Safety', path: '/safety' },
      { text: 'Terms of Service', path: '/terms' },
      { text: 'Privacy Policy', path: '/privacy' },
    ],
    resources: [
      { text: 'For Students', path: '/student-resources' },
      { text: 'For Tutors', path: '/tutor-resources' },
      { text: 'Pricing', path: '/pricing' },
      { text: 'FAQ', path: '/faq' },
    ],
  };

  const socialLinks = [
    { icon: <FacebookIcon />, url: 'https://facebook.com' },
    { icon: <TwitterIcon />, url: 'https://twitter.com' },
    { icon: <InstagramIcon />, url: 'https://instagram.com' },
    { icon: <LinkedInIcon />, url: 'https://linkedin.com' },
  ];

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        py: 6,
        mt: 'auto',
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" color="primary" gutterBottom>
              EduConnect Pakistan
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Connecting students with expert tutors for personalized learning experiences.
            </Typography>
            <Box sx={{ mt: 2 }}>
              {socialLinks.map((social, index) => (
                <IconButton
                  key={index}
                  component="a"
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ mr: 1 }}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Box>
          </Grid>

          {/* Footer Links */}
          <Grid item xs={12} sm={4} md={2}>
            <Typography variant="subtitle1" gutterBottom>
              Company
            </Typography>
            {footerLinks.company.map((link) => (
              <Link
                key={link.text}
                component={RouterLink}
                to={link.path}
                color="text.secondary"
                sx={{
                  display: 'block',
                  mb: 1,
                  textDecoration: 'none',
                  '&:hover': {
                    color: 'primary.main',
                  },
                }}
              >
                {link.text}
              </Link>
            ))}
          </Grid>

          <Grid item xs={12} sm={4} md={2}>
            <Typography variant="subtitle1" gutterBottom>
              Support
            </Typography>
            {footerLinks.support.map((link) => (
              <Link
                key={link.text}
                component={RouterLink}
                to={link.path}
                color="text.secondary"
                sx={{
                  display: 'block',
                  mb: 1,
                  textDecoration: 'none',
                  '&:hover': {
                    color: 'primary.main',
                  },
                }}
              >
                {link.text}
              </Link>
            ))}
          </Grid>

          <Grid item xs={12} sm={4} md={2}>
            <Typography variant="subtitle1" gutterBottom>
              Resources
            </Typography>
            {footerLinks.resources.map((link) => (
              <Link
                key={link.text}
                component={RouterLink}
                to={link.path}
                color="text.secondary"
                sx={{
                  display: 'block',
                  mb: 1,
                  textDecoration: 'none',
                  '&:hover': {
                    color: 'primary.main',
                  },
                }}
              >
                {link.text}
              </Link>
            ))}
          </Grid>
        </Grid>

        {/* Copyright */}
        <Box
          sx={{
            mt: 4,
            pt: 2,
            borderTop: '1px solid',
            borderColor: 'divider',
            textAlign: isMobile ? 'center' : 'left',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} EduConnect Pakistan. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 