import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { useSelector } from "react-redux";
import Icon from "../Icon";
import { GlobalStyles } from "../../constants/styles";
import { useNavigation } from "@react-navigation/native";

const ProfileCard = () => {
  const user = useSelector((state) => state.setUser.user);
  const navigation = useNavigation();

  function editProfile() {
    navigation.navigate("EditProfile");
  }

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image />
      </View>
      <View style={styles.textContainer}>
        <Text>{user?.username}</Text>
        <Text>{user?.email}</Text>
        <Icon icon="create-outline" onPress={editProfile} />
      </View>
    </View>
  );
};

export default ProfileCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal: 25,
    paddingVertical: 15,
    alignItems: "center",
    backgroundColor: GlobalStyles.colors.backgroundGreen,
    paddingTop: 55,
  },

  imageContainer: {
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: "black",
  },

  textContainer: {
    flex: 1,
    paddingLeft: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  titleText: {
    fontWeight: "bold",
  },
});
