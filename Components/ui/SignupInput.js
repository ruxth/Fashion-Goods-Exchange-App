import { StyleSheet, Text, TextInput, View } from "react-native";

import { GlobalStyles } from "../../constants/styles";

function SignupInput({ label, style, textInputConfig }) {
  const inputStyles = [styles.input];

  if (textInputConfig && textInputConfig.multiline) {
    inputStyles.push(styles.inputMultiline);
  }

  return (
    <View style={styles.inputContainer}>
      <TextInput style={inputStyles} {...textInputConfig} />
    </View>
  );
}

export default SignupInput;

const styles = StyleSheet.create({
  inputContainer: {
    marginHorizontal: 4,
    marginVertical: 8,
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
