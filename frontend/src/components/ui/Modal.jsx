import React, { useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Box, IconButton, Typography, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// Minimal accessible modal primitive
// Props: open, onClose, title, children, actions (array of {label,onClick,variant}), size ('sm'|'md'|'lg')
// Focus trap, ESC to close, aria-modal semantics, body scroll lock
export default function Modal({
  open,
  onClose,
  title,
  children,
  actions = [],
  size = 'md',
  initialFocusRef,
}) {
  const overlayRef = useRef(null);
  const dialogRef = useRef(null);
  const lastFocusedRef = useRef(null);

  // Lock scroll
  useEffect(() => {
    if (!open) return;
    lastFocusedRef.current = document.activeElement;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
      if (lastFocusedRef.current && lastFocusedRef.current.focus) {
        lastFocusedRef.current.focus();
      }
    };
  }, [open]);

  // Focus first focusable element
  useEffect(() => {
    if (!open) return;
    const node = dialogRef.current;
    if (!node) return;
    const focusTarget = initialFocusRef?.current || node.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    focusTarget?.focus();
  }, [open, initialFocusRef]);

  // Close on ESC
  const onKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose?.();
      }
      // Basic focus trap
      if (e.key === 'Tab') {
        const node = dialogRef.current;
        if (!node) return;
        const focusables = node.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const list = Array.from(focusables);
        if (list.length === 0) return;
        const first = list[0];
        const last = list[list.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [onClose]
  );

  if (!open) return null;

  const maxWidth = {
    sm: 420,
    md: 640,
    lg: 840,
  }[size] || 640;

  return createPortal(
    <Box
      ref={overlayRef}
      onMouseDown={(e) => {
        // Only close when clicking the overlay, not the content
        if (e.target === overlayRef.current) onClose?.();
      }}
      onKeyDown={onKeyDown}
      role="presentation"
      sx={{
        position: 'fixed', inset: 0, zIndex: (t) => t.zIndex.modal,
        backgroundColor: 'rgba(0,0,0,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        p: 2,
      }}
    >
      <Box
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        onMouseDown={(e) => e.stopPropagation()}
        sx={{
          width: '100%', maxWidth,
          bgcolor: 'background.paper', color: 'text.primary',
          borderRadius: 2, boxShadow: 24,
          outline: 'none',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography id="modal-title" variant="h6" sx={{ fontWeight: 700 }}>
            {title}
          </Typography>
          <IconButton aria-label="Close" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ p: 2 }}>
          {children}
        </Box>
        {actions?.length > 0 && (
          <Box sx={{ p: 2, pt: 0, display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            {actions.map((action, idx) => (
              <Button key={idx} onClick={action.onClick} variant={action.variant || 'contained'} color={action.color || 'primary'}>
                {action.label}
              </Button>
            ))}
          </Box>
        )}
      </Box>
    </Box>,
    document.body
  );
}
