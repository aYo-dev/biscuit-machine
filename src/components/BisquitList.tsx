import { List, ListItem, ListItemIcon, ListItemText, ListSubheader, Paper, Typography } from "@mui/material";
import { cond, equals } from "ramda";
import styled from 'styled-components';

import DoughIcon from '@mui/icons-material/Downloading';
import StampIcon from '@mui/icons-material/Approval';
import BakeIcon from '@mui/icons-material/Fireplace';
import BakedIcon from '@mui/icons-material/CheckCircleOutline';

import { BisquiteStates } from "../enums";
import { IBisquite } from "../interfaces";

interface IConveyorProps {
  bisquites: IBisquite[],
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

export const BisquitList = ({bisquites, title}: IConveyorProps) => {
  const getIcon = cond([
    [equals(BisquiteStates.raw),  () => <DoughIcon />],
    [equals(BisquiteStates.stamped), () => <StampIcon />],
    [equals(BisquiteStates.bake), () => <BakeIcon />],
    [equals(BisquiteStates.baked), () => <BakedIcon />],
  ]);

  return (
  <StyledPaper>
    <StyledList subheader={
      <Typography variant="h4" component="h2">{title}</Typography>
    }>
      {bisquites.map((el) => 
        <StyledListItem key={el.id} alignItems="flex-start">
          <ListItemText
            primary={`${el.stamp} - ${el.id}`}
            secondary={el.stamp || '...'}
          />
          <ListItemIcon>
            {getIcon(el.state)}
          </ListItemIcon>
        </StyledListItem>
      )}
    </StyledList>
  </StyledPaper>)
} 