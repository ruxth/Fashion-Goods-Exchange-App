import { View, Text, StyleSheet } from "react-native";

function SignUpTitle({ title, style }) {
  return <Text style={[styles.titleText, style]}>{title}</Text>;
}

export default SignUpTitle;

const styles = StyleSheet.create({
  titleText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#394A33",
  },
});
