const express = require("express");
const router = express.Router();
const {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} = require("firebase/auth");
const authenticateUser = require("../utils/authenticateUser");
const admin = require("../../config/FirebaseConfig");

router.post("/register", authenticateUser, async (req, res) => {
  const auth = getAuth();
  const { email, password, role } = req.body;

  // Check if the user is an administrator
  if (req.user.role !== "admin") {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    await auth.setCustomUserClaims(user.uid, { role });
    res.json(user);
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
    await admin.auth().setCustomUserClaims(userCredential.user.uid, { accessLevel: 4 });
    const token = await userCredential.user.getIdToken();
    res.json({ token });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

module.exports = router;
