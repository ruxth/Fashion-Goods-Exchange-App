import React from "react";
import { Pressable, Text } from "react-native";
import Icon from "./Icon";

const CustomBackButton = ({ onPress }) => {
  return (
    <Pressable onPress={onPress}>
      <Icon icon="chevron-back" size={30} />
    </Pressable>
  );
};

export default CustomBackButton;
