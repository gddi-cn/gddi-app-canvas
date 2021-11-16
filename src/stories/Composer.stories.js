import React from "react";
import { storiesOf } from "@storybook/react";
import { Composer } from "../components/Composer";

const stories = storiesOf("App Test", module);

stories.add("App", () => {
  return <Composer />;
});
