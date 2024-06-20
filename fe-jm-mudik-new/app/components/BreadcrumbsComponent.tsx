import * as React from 'react';
import { emphasize, styled } from '@mui/material/styles';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Chip from '@mui/material/Chip';
import HomeIcon from '@mui/icons-material/Home';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Stack, Typography } from '@mui/material';
import Card from '@mui/material/Card';

const StyledBreadcrumb = styled(Chip)(({ theme }) => {
  const backgroundColor =
    theme.palette.mode === 'light'
      ? theme.palette.grey[100]
      : theme.palette.grey[800];
  return {
    backgroundColor,
    height: theme.spacing(3),
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,
    '&:hover, &:focus': {
      backgroundColor: emphasize(backgroundColor, 0.06),
    },
    '&:active': {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(backgroundColor, 0.12),
    },
  };
}) as typeof Chip; // TypeScript only: need a type cast here because https://github.com/Microsoft/TypeScript/issues/26591

function handleClick(event: React.MouseEvent<Element, MouseEvent>) {
  event.preventDefault();
  console.info('You clicked a breadcrumb.');
}

export default function CustomizedBreadcrumbs() {
  const cardRef = React.useRef(null);
  const [isSticky, setIsSticky] = React.useState(false);

   const handleScroll = () => {
    if (cardRef.current) {
      const scrollTop = window.scrollY;
      const cardTop = (cardRef.current as HTMLElement)?.getBoundingClientRect().top;

  
      if (scrollTop > cardTop) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    }
  };

  React.useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  return (
    <div role="presentation" onClick={handleClick}>
      <Card>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
          sx={{p:"10px"}}
        >
          {/* <Item>Item 1</Item> */}
          <Typography style={{ color: "#636B74", fontSize: "20px" }}>
            Home
          </Typography>
          {/* <Item>Item 2</Item> */}
          <Breadcrumbs aria-label="breadcrumb">
            <StyledBreadcrumb
              component="a"
              href="#"
              label="Home"
              icon={<HomeIcon fontSize="small" />}
            />
            <StyledBreadcrumb component="a" href="#" label="Catalog" />
              <StyledBreadcrumb
                label="Accessories"
                deleteIcon={<ExpandMoreIcon />}
                onDelete={handleClick}
              />
          </Breadcrumbs>
        </Stack>
      </Card>
    </div>
  );
}