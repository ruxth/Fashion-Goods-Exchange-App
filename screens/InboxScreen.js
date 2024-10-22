import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSelector } from "react-redux";

import Icon from "../Components/Icon";
import LoadingOverlay from "../Components/ui/LoadingOverlay";
import MessageCard from "../Components/ui/MessageCard";
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { firestoreDB } from "../config/firebase.config";
import { useNavigation } from "@react-navigation/native";

const InboxScreen = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [chats, setChats] = useState(null);
  const [messages, setMessages] = useState(null);
  const [chatId, setChatId] = useState(null);
  const [isExchanged, setIsExchanged] = useState(null);

  const user = useSelector((state) => state.setUser.user);

  useEffect(() => {
    const chatQuery = query(
      collection(firestoreDB, "users", user.username, "chats")
    );

    const exchangedQuery = query(
      collection(firestoreDB, "posts"),
      where("id", "==", chatId),
      where("isSold", "==", true)
    );

    const exchangedUnsubscribe = onSnapshot(exchangedQuery, (querySnapshot) => {
      const exchangeMsg = querySnapshot.docs.map((doc) => {
        const exchangedItem = doc.data();
        setIsExchanged(exchangedItem.isSold);
        return exchangedItem;
      });
    });

    const unsubscribe = onSnapshot(chatQuery, (querySnapshot) => {
      const fetchedChat = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        setChatId(data._id);
        return data;
      });
      setChats(fetchedChat);
      setIsLoading(false);
    });

    return exchangedUnsubscribe, unsubscribe;
  }, []);

  useEffect(() => {
    if (!chats) return;

    const filteredChats = chats.filter(
      (room) =>
        room.user.username === user.username ||
        room.post.user.username === user.username
    );

    const unsubscribe = filteredChats.forEach((filteredRoom) => {
      const chatId = filteredRoom._id;
      const msgQuery = query(
        collection(firestoreDB, "chats", chatId, "messages"),
        orderBy("timeStamp", "desc"),
        limit(1)
      );

      const messageListener = onSnapshot(msgQuery, (querySnapshot) => {
        const upMsg = querySnapshot.docs.map((doc) => doc.data())[0]; // Get the first (latest) message
        setMessages((prevMessages) => ({
          ...prevMessages,
          [chatId]: upMsg,
        }));

        console.log(messages);
      });
      return () => messageListener();
    });

    return unsubscribe;
  }, [chats, user.username]);

  return (
    <View style={styles.container}>
      <View style={styles.inboxTop}>
        <Text>Messages</Text>
      </View>
      <ScrollView>
        {isLoading ? (
          <>
            <View>
              <LoadingOverlay />
            </View>
          </>
        ) : (
          <>
            {chats &&
              chats
                .filter(
                  (room) =>
                    room.user.username === user.username ||
                    room.post.user.username === user.username
                )
                .map((filteredRoom) => (
                  <MessageCard
                    key={filteredRoom._id}
                    room={filteredRoom}
                    title={filteredRoom.post.name}
                    imageUrl={filteredRoom.post.itemImage}
                    lastMessage={messages && messages[filteredRoom._id]}
                  />
                ))}
            {chats &&
              chats.filter(
                (room) =>
                  room.user.username === user.username ||
                  room.post.user.username === user.username
              ).length === 0 && (
                <View>
                  <Text style={styles.nopostText}>No messages yet</Text>
                </View>
              )}
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default InboxScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  inboxTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: "#BCD4B3",
    paddingTop: StatusBar.currentHeight || 65,
  },

  nopostText: {
    textAlign: "center",
    paddingTop: 50,
  },
});
