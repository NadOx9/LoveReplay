module.exports = (req, res) => {
  console.log("✅ API function hit");
  res.status(200).json({ status: "ok", message: "API is working!" });
};
