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

router.get("/accounts", authenticateUser, authorizeUser(2), async (req, res) => {
  try {
    const listUsersResult = await admin.auth().listUsers();
    const users = listUsersResult.users.map((userRecord) => ({
      uid: userRecord.uid,
      email: userRecord.email,
      customClaims: userRecord.customClaims,
    }));
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/register", authenticateUser, authorizeUser(2), async (req, res) => {
  const auth = getAuth();
  const { email, password, role } = req.body;

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    await admin.auth().setCustomUserClaims(userCredential.user.uid, { accessLevel: role });
    res.json(userCredential.user);
  } catch (error) {
    res.status(400).json({ error: error.message });
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

router.delete("/delete/:uid", authenticateUser, authorizeUser(2), async (req, res) => {
  const { uid } = req.params;

  try {
    await admin.auth().deleteUser(uid);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/update/:uid", authenticateUser, authorizeUser(2), async (req, res) => {
  const { uid } = req.params;
  const { email, password, role } = req.body;

  try {
    const userRecord = await admin.auth().updateUser(uid, {
      email,
      password,
      role,
    });
    res.json({ message: "User updated successfully", user: userRecord });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
