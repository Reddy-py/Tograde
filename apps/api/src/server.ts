import { app } from "./app";
import { config } from "./config";

app.listen(config.port, () => {
  console.log(`Top Grade CRM API listening on port ${config.port}`);
});
