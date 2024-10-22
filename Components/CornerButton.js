import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const CornerButton = ({ title, containerStyle, textStyle, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.buttonContainer, containerStyle]}
      onPress={onPress}
    >
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

export default CornerButton;

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: "#77976B",
    paddingVertical: 10,
    paddingLeft: 65,
    borderTopLeftRadius: 25,
    justifyContent: "center",
    width: 170,
    height: 60,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
});
