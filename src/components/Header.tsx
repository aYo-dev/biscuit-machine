import { AppBar, Typography } from "@mui/material"

interface IHeaderProps {
  title: string;
}

export const Header = ({title}: IHeaderProps) => {
  return (
    <AppBar position="static" sx={{marginBottom: 2, padding: 1}}>
        <Typography variant="h3" component="h1">{title}</Typography>
    </AppBar>
  )
}