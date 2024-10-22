import { View, Text, StyleSheet } from "react-native";

function Title({ title, style }) {
  return <Text style={[styles.titleText, style]}>{title}</Text>;
}

export default Title;

const styles = StyleSheet.create({
  titleText: {
    fontSize: 22,
    fontWeight: "bold",
  },
});
