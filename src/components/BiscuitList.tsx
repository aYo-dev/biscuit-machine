import { ReactNode, useMemo } from "react";
import { List, ListItem, ListItemIcon, ListItemText, Paper, Typography } from "@mui/material";
import { cond, equals, slice } from "ramda";
import styled from 'styled-components';
import { nanoid } from 'nanoid'

import DoughIcon from '@mui/icons-material/Downloading';
import StampIcon from '@mui/icons-material/Approval';
import BakeIcon from '@mui/icons-material/Fireplace';
import BakedIcon from '@mui/icons-material/CheckCircleOutline';

import { BiscuitStates, BmListTypes } from "../enums";
import { IBiscuit } from "../interfaces";

interface IConveyorProps {
  biscuits: IBiscuit[],
  title: string,
  listType: BmListTypes,
  active: boolean,
  children: ReactNode
}

const StyledListItem = styled(ListItem)`
  border-bottom: 1px solid;
`;

const StyledList = styled(List)`
  ${StyledListItem} {
    &:last-child {
      border-bottom: none;
    }
  }
`;

const StyledPaper = styled(Paper)`
  width: 50%;
`;

export const BiscuitList = ({biscuits, title, listType, active, children}: IConveyorProps) => {
  /**
   * return an icon based on the Bisquite state
   */
  const getStateIcon = cond([
    [equals(BiscuitStates.raw),  () => <DoughIcon />],
    [equals(BiscuitStates.stamped), () => <StampIcon />],
    [equals(BiscuitStates.bake), () => <BakeIcon />],
    [equals(BiscuitStates.baked), () => <BakedIcon />],
  ]);

  // We don't want to show the whole list cause it could get too large
  const sized = useMemo(() => biscuits.length > 4 ? slice(0, 4, biscuits) : biscuits, [biscuits]);

  return (
  <StyledPaper>
    <StyledList subheader={
      <Typography variant="h4" component="h2" sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        padding: 1,
      }}>
        {children}
      </Typography>
    }>
      {sized.map((el) => 
        <StyledListItem key={nanoid()} alignItems="flex-start">
          <ListItemText
            primary={el.stamp || '...'}
            secondary={`Created at: ${el.id}`}
          />
          <ListItemIcon>
            {getStateIcon(el.state)}
          </ListItemIcon>
        </StyledListItem>
      )}
    </StyledList>
  </StyledPaper>)
} 