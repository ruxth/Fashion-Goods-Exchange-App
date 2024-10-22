import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { SelectList } from "react-native-dropdown-select-list";

function Dropdown({ data, setSelected, label, placeholder, onSelect }) {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <SelectList
        data={data}
        setSelected={setSelected}
        placeholder={placeholder}
        onSelect={onSelect}
      />
    </View>
  );
}

export default Dropdown;

const styles = StyleSheet.create({
  inputContainer: {
    marginHorizontal: 4,
    marginVertical: 8,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 4,
  },
});
