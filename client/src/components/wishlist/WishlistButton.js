import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';

const WishlistButton = ({ isInWishlist, onToggle, disabled }) => {
  const { enqueueSnackbar } = useSnackbar();

  const handleClick = () => {
    if (disabled) {
      enqueueSnackbar('Please log in to add tutors to your wishlist', {
        variant: 'warning',
      });
      return;
    }

    onToggle();
    enqueueSnackbar(
      isInWishlist
        ? 'Tutor removed from wishlist'
        : 'Tutor added to wishlist',
      {
        variant: 'success',
      }
    );
  };

  return (
    <Tooltip title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}>
      <IconButton
        onClick={handleClick}
        color={isInWishlist ? 'error' : 'default'}
        disabled={disabled}
      >
        {isInWishlist ? <FavoriteIcon /> : <FavoriteBorderIcon />}
      </IconButton>
    </Tooltip>
  );
};

export default WishlistButton; 