const app = require("./app");
const dotenv = require("dotenv");
const path = require("path");
const connectDatabase = require("./config/database");

dotenv.config({ path: path.join(__dirname, "config/config.env") });

connectDatabase();

const server = app.listen(process.env.PORT, () => {
  console.log(
    ` my server listeing to ${process.env.PORT} in ${process.env.NODE_ENV}`
  );
});

process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log('Shutting Down Due to unhandledRejection error');
  server.close(() => {
    process.exit(1);
  });
});


process.on('uncaughtException',(err) => {
  console.log(`Error ${err.message}`);
  console.log('Shutting down the server due to unhandled rejection');
  server.close(() => {
    process.exit(1);
  });
});
