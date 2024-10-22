import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import LoadingOverlay from "../Components/ui/LoadingOverlay";
import { useEffect, useLayoutEffect } from "react";
import { setUser } from "../store/redux/userAuth";
import { firebaseAuth, firestoreDB } from "../config/firebase.config";
import { getDoc, doc } from "firebase/firestore";

const SplashScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  useEffect(() => {
    checkLoggedUser();
  }, []);

  const checkLoggedUser = async () => {
    try {
      firebaseAuth.onAuthStateChanged(async (userCred) => {
        if (userCred?.uid) {
          const docSnap = await getDoc(
            doc(firestoreDB, "users", userCred?.uid)
          );

          if (docSnap.exists()) {
            const data = docSnap.data();
            dispatch(setUser(data));
            navigation.replace("TabStack", { screen: "HomeScreen" });
          } else {
            navigation.replace("SignUpScreen");
          }
        } else {
          // User is not logged in, navigate to login or another screen
          navigation.replace("StartingScreen");
        }
      });
    } catch (error) {
      console.error("Error checking logged user:", error);
      // Handle error or navigate to an error screen
      navigation.replace("LoginScreen");
    }
  };

  return <LoadingOverlay />;
};

export default SplashScreen;
