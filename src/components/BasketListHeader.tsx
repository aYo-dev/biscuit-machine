import BasketIcon from '@mui/icons-material/ShoppingBasket';
import CookieIcon from '@mui/icons-material/Cookie';

interface IBasketListHeader {
  amount: number;
}

export const BasketListHeader = ({amount}: IBasketListHeader) => (
  <>
    Basket
    <BasketIcon sx={{ fontSize: 40 }}/>
    {amount}
    <CookieIcon sx={{ fontSize: 40 }}/>
  </>
);