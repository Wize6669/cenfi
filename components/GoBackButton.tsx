import { IconButton } from '@mui/material';
import ArrowBack from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/navigation';
import React from 'react';

const GoBackIconButton = () => {
  const router = useRouter();

  const goBack = () => {
    router.back();
  };

  return (
    <IconButton
      className={'dark:border-gray-500 dark:hover:bg-gray-600'}
      sx={{ border: '1px solid #ccc' }}
      onClick={goBack}
    >
      <ArrowBack className={'text-gray-400 dark:text-gray-500'} />
    </IconButton>
  );
};

export default GoBackIconButton;
