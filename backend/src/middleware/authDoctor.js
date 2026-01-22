export default async function authDoctor(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    console.log("AUTH HEADER:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("DECODED TOKEN:", decoded);

    req.doctor = await Doctor.findById(decoded.id);

    console.log("DOCTOR FOUND:", req.doctor);

    if (!req.doctor) {
      return res.status(401).json({ message: "Doctor not found" });
    }

    next();
  } catch (e) {
    console.error("AUTH ERROR:", e);
    return res.status(403).json({ message: "Forbidden" });
  }
}
