import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { GlobalStyles } from "../../constants/styles";

const MessageCard = ({
  title,
  onPress,
  room,
  imageUrl,
  lastMessage,
  isExchanged,
}) => {
  const navigation = useNavigation();

  function chatHandler() {
    navigation.navigate("Chat", { room: room });
  }

  if (!lastMessage) {
    return (
      <TouchableOpacity style={styles.container} onPress={chatHandler}>
        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            source={{
              uri: imageUrl,
            }}
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.titleText}>{title}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.container} onPress={chatHandler}>
      <View style={styles.outerExchangedContainer}>
        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            source={{
              uri: imageUrl,
            }}
          />
        </View>
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.titleText}>{title}</Text>
        {lastMessage && lastMessage.message && (
          <View>
            <Text style={styles.message}>{lastMessage.message}</Text>
            <Text style={styles.timeText}>
              {new Date(
                parseInt(lastMessage?.timeStamp?.seconds) * 1000
              ).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              })}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default MessageCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    paddingHorizontal: 25,
    paddingVertical: 15,
    alignItems: "center",
    borderBottomWidth: 0.8,
  },

  outerExchangedContainer: {
    flexDirection: "column",
    alignItems: "center",
  },

  imageContainer: {
    width: 55,
    height: 55,
    borderRadius: 30,
  },

  image: {
    width: "100%",
    height: "100%",
    borderRadius: 30,
  },

  exchangedContainer: {
    backgroundColor: GlobalStyles.colors.backgroundGreen,
    width: 90,
    padding: 5,
    marginVertical: 5,
    borderRadius: 5,
    alignItems: "center",
  },

  exchangedText: {
    fontSize: 11,
  },

  textContainer: {
    paddingLeft: 15,
    flex: 1,
    flexDirection: "column",
  },

  textStyle: {},

  titleText: {
    fontWeight: "bold",
  },

  messageText: {},

  timeText: {
    alignSelf: "flex-end",
  },
});
