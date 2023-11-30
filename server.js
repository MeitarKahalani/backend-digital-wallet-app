const express = require('express');

// setting up express server:

const app = express();

app.use(express.json());

app.use("/api/users", require("./routes/userRoute.js"));
app.use("/api/transactions", require("./routes/transactionRoute.js"));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
