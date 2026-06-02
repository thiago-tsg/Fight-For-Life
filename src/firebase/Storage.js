import { getStorage } from "firebase/storage";
import { app } from "./FirebaseConfig";

export const storage = getStorage(app);