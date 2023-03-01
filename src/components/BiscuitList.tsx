import { List, ListItem, ListItemIcon, ListItemText, Paper, Typography } from "@mui/material";
import { cond, equals, slice } from "ramda";
import styled from 'styled-components';
import { nanoid } from 'nanoid'

import DoughIcon from '@mui/icons-material/Downloading';
import StampIcon from '@mui/icons-material/Approval';
import BakeIcon from '@mui/icons-material/Fireplace';
import BakedIcon from '@mui/icons-material/CheckCircleOutline';
import PrepareIcon from '@mui/icons-material/AutoMode';
import BasketIcon from '@mui/icons-material/ShoppingBasket';
import CookieIcon from '@mui/icons-material/Cookie';

import { BiscuitStates } from "../enums";
import { IBiscuit } from "../interfaces";
import { useMemo } from "react";

interface IConveyorProps {
  biscuits: IBiscuit[],
  title: string,
  listType: 'basket' | 'belt', //TODO: replace with Enum
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

const isBasket = equals('basket');

export const BiscuitList = ({biscuits, title, listType}: IConveyorProps) => {
  /**
   * return an icon based on the Bisquite state
   */
  const getStateIcon = cond([
    [equals(BiscuitStates.raw),  () => <DoughIcon />],
    [equals(BiscuitStates.stamped), () => <StampIcon />],
    [equals(BiscuitStates.bake), () => <BakeIcon />],
    [equals(BiscuitStates.baked), () => <BakedIcon />],
  ]);

  /**
   * return an icon based on the List type
   */
  const getListIcon = cond([
    [isBasket,  () => <BasketIcon sx={{ fontSize: 40 }}/>],
    [equals('belt'), () => <PrepareIcon sx={{ fontSize: 40,
      animation: "spin 2s linear infinite",
      "@keyframes spin": {
        "0%": {
          transform: "rotate(0eg)",
        },
        "100%": {
          transform: "rotate(360deg)",
        },
      },
    }}/>],
  ]);

  // We don't want to show the whole list cause it could get too large
  const sized = useMemo(() => biscuits.length > 5 ? slice(0, 4, biscuits) : biscuits, [biscuits]);
  // We want to show only the amouth of backed bisquites
  const bakedBisquites = useMemo(() => isBasket(listType) ?  biscuits.length : '', [listType, biscuits]);

  return (
  <StyledPaper>
    <StyledList subheader={
      <Typography variant="h4" component="h2" sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        padding: 1,
      }}>
        {title}
        {getListIcon(listType)}
        <span>
          {bakedBisquites}
          <CookieIcon sx={{ fontSize: 40 }}/>
        </span>
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