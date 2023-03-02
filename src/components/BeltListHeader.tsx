import * as React from "react";
import PrepareIcon from '@mui/icons-material/AutoMode';

interface IBeltListHeader {
  iconClass: string;
}


export const BeltListHeader = ({iconClass}: IBeltListHeader) => (
  <>
    Conveyor belt
    <PrepareIcon className={`prepare-icon ${iconClass}`} sx={{ fontSize: 40 }}/>
  </>
);