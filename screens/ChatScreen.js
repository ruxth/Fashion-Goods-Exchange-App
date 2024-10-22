import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import React, { useLayoutEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

import CustomBackButton from "../Components/CustomBackButton";
import Icon from "../Components/Icon";
import { GlobalStyles } from "../constants/styles";
import { useNavigation } from "@react-navigation/native";
import LoadingOverlay from "../Components/ui/LoadingOverlay";
import {
  collection,
  serverTimestamp,
  doc,
  addDoc,
  orderBy,
  onSnapshot,
  query,
} from "firebase/firestore";
import { firestoreDB } from "../config/firebase.config";

const ChatScreen = ({ route }) => {
  const user = useSelector((state) => state.setUser.user);

  const navigation = useNavigation();
  const { room } = route.params;
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(null);

  const sendMessage = async () => {
    const timeStamp = serverTimestamp();
    const id = `${Date.now()}`;

    const _doc = {
      _id: id,
      roomId: room._id,
      timeStamp: timeStamp,
      message: message,
      user: user,
    };

    setMessage("");
    await addDoc(
      collection(doc(firestoreDB, "chats", room._id), "messages"),
      _doc
    )
      .then(() => {})
      .catch((err) => alert(err));
  };

  useLayoutEffect(() => {
    const msgQuery = query(
      collection(firestoreDB, "chats", room?._id, "messages"),
      orderBy("timeStamp", "asc")
    );

    const unsubscribe = onSnapshot(msgQuery, (querySnap) => {
      const upMsg = querySnap.docs.map((doc) => doc.data());
      setMessages(upMsg);
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <View style={styles.backButton}>
          <CustomBackButton onPress={() => navigation.goBack()} />
        </View>
        <View style={styles.profileContainer}>
          <View style={styles.imageContainer}>
            <Image
              style={styles.image}
              source={{ uri: room?.post?.user?.profilePic }}
            />
          </View>
          <Text style={styles.text}>{room?.post?.user?.username}</Text>
        </View>
      </View>
      <View style={styles.productContainer}>
        <View style={styles.productImageContainer}>
          <Image style={styles.image} source={{ uri: room?.post?.itemImage }} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.titleText}>Title: {room?.post?.name}</Text>
          <Text style={styles.text}>Condition: {room?.post?.condition}</Text>
        </View>
      </View>
      <KeyboardAvoidingView style={styles.chatContainer}>
        <>
          <ScrollView>
            {isLoading ? (
              <>
                <LoadingOverlay />
              </>
            ) : (
              <>
                {messages?.map((msg, i) =>
                  msg.user.providerData.email === user.providerData.email ? (
                    <>
                      <View key={i} style={styles.chatsContainer}>
                        <View style={styles.senderTextContainer}>
                          <Text>{msg.message}</Text>
                        </View>
                        <View style={styles.timeStamp}>
                          {msg?.timeStamp?.seconds && (
                            <Text style={styles.timeStampText}>
                              {new Date(
                                parseInt(msg?.timeStamp?.seconds) * 1000
                              ).toLocaleTimeString("en-US", {
                                hour: "numeric",
                                minute: "numeric",
                                hour12: true,
                              })}
                            </Text>
                          )}
                        </View>
                      </View>
                    </>
                  ) : (
                    <>
                      <View key={i} style={styles.chatsContainer}>
                        <View style={styles.receiverTextContainer}>
                          <Text>{msg.message}</Text>
                        </View>
                        <View style={styles.receiverTimeStamp}>
                          {msg?.timeStamp?.seconds && (
                            <Text style={styles.timeStampText}>
                              {new Date(
                                parseInt(msg?.timeStamp?.seconds) * 1000
                              ).toLocaleTimeString("en-US", {
                                hour: "numeric",
                                minute: "numeric",
                                hour12: true,
                              })}
                            </Text>
                          )}
                        </View>
                      </View>
                    </>
                  )
                )}
              </>
            )}
          </ScrollView>
          <View style={styles.bottomContainer}>
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Write Something..."
                value={message}
                onChangeText={setMessage}
              />
            </View>
            <Icon icon="send" size={28} onPress={sendMessage} />
          </View>
        </>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },

  topContainer: {
    flexDirection: "row",
    height: 120,
    backgroundColor: GlobalStyles.colors.backgroundGreen,
  },

  backButton: {
    paddingHorizontal: 15,
    paddingTop: 70,
  },

  profileContainer: {
    flexDirection: "row",
    marginTop: 50,
    alignItems: "center",
  },

  imageContainer: {
    width: 50,
    height: 50,
    borderRadius: 30,
    marginRight: 15,
  },

  image: {
    width: "100%",
    height: "100%",
    borderRadius: 30,
  },

  productContainer: {
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
  },

  productImageContainer: {
    width: 60,
    height: 60,
  },

  textContainer: {
    paddingLeft: 15,
  },

  titleText: {
    fontSize: 16,
    fontWeight: "bold",
  },

  text: {
    fontSize: 16,
    fontWeight: "bold",
  },

  chatContainer: {
    flex: 1,
  },

  bottomContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 22,
    position: "absolute",
    bottom: 10,
  },

  chatsContainer: {
    marginVertical: 5,
    marginHorizontal: 10,
  },

  senderTextContainer: {
    backgroundColor: GlobalStyles.colors.inputGrey,
    padding: 10,
    borderRadius: 10,
    alignSelf: "flex-end",
  },

  timeStamp: {
    alignSelf: "flex-end",
  },

  receiverTimeStamp: {
    alignSelf: "flex-start",
  },

  timeStampText: {
    fontSize: 11,
  },

  receiverTextContainer: {
    backgroundColor: GlobalStyles.colors.backgroundGreen,
    padding: 10,
    borderRadius: 10,
    alignSelf: "flex-start",
  },

  searchContainer: {
    alignItems: "center",
    backgroundColor: GlobalStyles.colors.inputGrey,
    borderRadius: 10,
    marginRight: 15,
  },

  searchInput: {
    height: 40,
    width: 320,
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
});
