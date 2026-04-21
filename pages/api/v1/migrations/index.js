import { createRouter } from "next-connect";
import controller from "infra/controller";
import migrator from "models/migrator";
import authorization from "models/authorization";

const router = createRouter();

router.use(controller.injectAnonymousOrUser);
router.get(controller.canRequest("read:migration"), getHandler);
router.post(controller.canRequest("create:migration"), postHandler);

export default router.handler(controller.errorHandlers);

async function postHandler(request, response) {
  const migratedMigrations = await migrator.runPendingMigrations();
  const statusCode = migratedMigrations.length > 0 ? 201 : 200;
  const userTryingToPost = request.context.user;

  const secureOutputValues = authorization.filterOutput(
    userTryingToPost,
    "read:migration",
    migratedMigrations,
  );

  return response.status(statusCode).json(secureOutputValues);
}
async function getHandler(request, response) {
  const pendingMigrations = await migrator.listPendingMigrations();
  const userTryingToGet = request.context.user;

  const secureOutputValues = authorization.filterOutput(
    userTryingToGet,
    "read:migration",
    pendingMigrations,
  );

  return response.status(200).json(secureOutputValues);
}
