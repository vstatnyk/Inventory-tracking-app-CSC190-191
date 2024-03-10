const express = require("express");
const router = express.Router();
const {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} = require("firebase/auth");
const admin = require("../../config/FirebaseConfig");
const authorizeUser = require("../utils/authorizeUser");
const authenticateUser = require("../utils/authenticateUser");
const Account = require("../models/Account");

router.get(
  "/accounts",
  authenticateUser,
  authorizeUser(2),
  async (req, res) => {
    try {
        const listUsersResult = await admin.auth().listUsers();
        const users = await Promise.all(listUsersResult.users.map(async (userRecord) => {
          const account = await Account.findOne({ uid: userRecord.uid }, { _id: 0, uid: 1, department: 1 });
          return {
            uid: userRecord.uid,
            email: userRecord.email,
            customClaims: userRecord.customClaims,
            department: account ? account.department : [],
          };
      }));
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.post(
  "/register",
  authenticateUser,
  authorizeUser(2),
  async (req, res) => {
    const auth = getAuth();
    const { email, password, role, department } = req.body;

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      // create new user document in mongoDB
      const newAccountMDB = new Account({
        uid: userCredential.user.uid,
        department: [department],
    });
    await newAccountMDB.save();

      await admin
        .auth()
        .setCustomUserClaims(userCredential.user.uid, { accessLevel: role });
      res.json(userCredential.user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }    
  }
);

// router passed a firebase id token, and the server will verify the token and return the user's data
router.post("/verify", async (req, res) => {
  const idToken = req.body.idToken;

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    res.json(decodedToken);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  const auth = getAuth();
  const { email, password } = req.body;

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const token = await userCredential.user.getIdToken();
    res.json({ token });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

router.delete(
  "/delete/:uid",
  authenticateUser,
  authorizeUser(2),
  async (req, res) => {
    const { uid } = req.params;

    try {
      await admin.auth().deleteUser(uid);
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.put(
  "/update/:uid",
  authenticateUser,
  authorizeUser(2),
  async (req, res) => {
    const { uid } = req.params;
    const { email, password, role } = req.body;

    try {
      await admin.auth().setCustomUserClaims(uid, { accessLevel: role });
      const userRecord = await admin.auth().updateUser(uid, {
        email,
        password,
      });
      res.json({ message: "User updated successfully", user: userRecord });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;
