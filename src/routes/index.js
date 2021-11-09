import express from "express";

import test from "#routes/test";

const router = express.Router();

// ^Healthcheck
router.get("/healthcheck", (_, res) => res.status(204).send());

// ^Favicon handler
router.get("/favicon.ico", (_, res) => res.status(404).send());

// ^Test route
router.use("/test", test);

// ^Other routes
//
//

export default router;
