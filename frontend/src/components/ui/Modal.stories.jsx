import React, { useState } from 'react';
import Modal from './Modal';
import { Button, Box, Typography } from '@mui/material';

export default {
  title: 'UI/Modal',
  component: Modal,
};

export const Basic = () => {
  const [open, setOpen] = useState(true);
  return (
    <Box>
      <Button variant="contained" onClick={() => setOpen(true)}>Open Modal</Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Confirm Action"
        actions={[
          { label: 'Cancel', variant: 'outlined', onClick: () => setOpen(false) },
          { label: 'Confirm', variant: 'contained', onClick: () => setOpen(false) },
        ]}
      >
        <Typography>
          This is a reusable modal. It traps focus and closes on ESC or overlay click.
        </Typography>
      </Modal>
    </Box>
  );
};
