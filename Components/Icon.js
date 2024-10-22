import { Ionicons } from "@expo/vector-icons";

function Icon({ icon, size = 24, color = "black", onPress }) {
  return <Ionicons name={icon} size={size} color={color} onPress={onPress} />;
}

export default Icon;
