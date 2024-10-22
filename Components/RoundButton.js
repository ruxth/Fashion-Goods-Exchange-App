import { useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { AuthContext } from "../store/auth-context";

const RoundButton = ({ title, containerStyle, textStyle, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.buttonContainer, containerStyle]}
      onPress={onPress}
    >
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

export default RoundButton;

const styles = StyleSheet.create({
  buttonContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 150,
    marginBottom: 15,
  },
  buttonText: {
    fontSize: 16,
  },
});
