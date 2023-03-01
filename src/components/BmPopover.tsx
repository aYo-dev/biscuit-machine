import { useState } from "react";
import { AppBar, Popover, Typography } from "@mui/material"

interface IHeaderProps {
  text: string;
  handlePopoverClose: () => void;
  open: boolean;
  anchorEl: HTMLElement | null;
}

export const BmPopover = ({text, open, handlePopoverClose, anchorEl}: IHeaderProps) => {
  return (
    <Popover
      id="mouse-over-popover"
      sx={{
        pointerEvents: 'none',
      }}
      open={open}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      onClose={handlePopoverClose}
      disableRestoreFocus
    ><Typography sx={{ p: 1 }}>{text}</Typography></Popover>
  )
}