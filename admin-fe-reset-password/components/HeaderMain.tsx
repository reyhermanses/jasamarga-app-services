"use client";

import React, { useState } from "react";
import { Burger, Container, Group } from "@mantine/core";
import classes from "./_css/HeaderSimple.module.css";
import { useDisclosure } from "@mantine/hooks";

const HeaderMain = () => {
  return (
    <header className={classes.header}>
      <Container size="md" className={classes.inner}>
        <div>
          <img src="../../assets/img-logo.png" width={200} alt="Your Image" />
        </div>
      </Container>
    </header>
  );
};

export default HeaderMain;
