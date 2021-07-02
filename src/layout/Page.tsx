import React from 'react';
import {
  Container, ContainerProps, Grid, GridProps, Toolbar,
} from '@material-ui/core';
import AppBar from './AppBar';

export type PageProps = {
  maxWidth?: ContainerProps['maxWidth'],
  contentJustify?: GridProps['justify'],
};

const Page: React.FC<PageProps> = ({
  maxWidth,
  contentJustify,
  children,
}) => (
  <>
    <Grid
      container
      direction="column"
      justify={contentJustify}
      style={{
        minHeight: '100%',
      }}
    >
      <Grid item>
        <AppBar />
      </Grid>
      <Grid item>
        <Container maxWidth={maxWidth}>
          {children}
        </Container>
      </Grid>
      <Grid item>
        <Toolbar />
      </Grid>
    </Grid>
  </>
);

export default Page;
