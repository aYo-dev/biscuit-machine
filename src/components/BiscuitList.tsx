import { List, ListItem, ListItemIcon, ListItemText, Paper, Typography } from "@mui/material";
import { cond, equals } from "ramda";
import styled from 'styled-components';
import { nanoid } from 'nanoid'

import DoughIcon from '@mui/icons-material/Downloading';
import StampIcon from '@mui/icons-material/Approval';
import BakeIcon from '@mui/icons-material/Fireplace';
import BakedIcon from '@mui/icons-material/CheckCircleOutline';

import { BiscuitStates } from "../enums";
import { IBiscuit } from "../interfaces";

interface IConveyorProps {
  biscuits: IBiscuit[],
  title: string,
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

export const BiscuitList = ({biscuits, title}: IConveyorProps) => {
  const getIcon = cond([
    [equals(BiscuitStates.raw),  () => <DoughIcon />],
    [equals(BiscuitStates.stamped), () => <StampIcon />],
    [equals(BiscuitStates.bake), () => <BakeIcon />],
    [equals(BiscuitStates.baked), () => <BakedIcon />],
  ]);

  return (
  <StyledPaper>
    <StyledList subheader={
      <Typography variant="h4" component="h2">{title}</Typography>
    }>
      {biscuits.map((el) => 
        <StyledListItem key={nanoid()} alignItems="flex-start">
          <ListItemText
            primary={el.stamp || '...'}
            secondary={`Created at: ${el.id}`}
          />
          <ListItemIcon>
            {getIcon(el.state)}
          </ListItemIcon>
        </StyledListItem>
      )}
    </StyledList>
  </StyledPaper>)
} 