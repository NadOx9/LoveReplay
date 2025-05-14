export default async function handler(req, res) {
  try {
    res.status(200).json({ message: "API test OK ✅" });
  } catch (err) {
    res.status(500).json({ error: "Server crashed", details: err.message });
  }
}
