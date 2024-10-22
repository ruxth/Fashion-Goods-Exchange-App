import { StyleSheet, Text, TextInput, View } from "react-native";

import { GlobalStyles } from "../constants/styles";

function Input({ label, style, textInputConfig }) {
  const inputStyles = [styles.input];

  if (textInputConfig && textInputConfig.multiline) {
    inputStyles.push(styles.inputMultiline);
  }

  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput style={inputStyles} {...textInputConfig} />
    </View>
  );
}

export default Input;

const styles = StyleSheet.create({
  inputContainer: {
    marginHorizontal: 4,
    marginVertical: 8,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  input: {
    backgroundColor: GlobalStyles.colors.inputGrey,
    padding: 10,
    borderRadius: 10,
  },

  inputMultiline: {
    minHeight: 100,
    textAlignVertical: "top",
  },
});
