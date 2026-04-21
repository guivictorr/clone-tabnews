import authorization from "models/authorization";
import { InternalServerError } from "infra/errors";

describe("models/authorization.js", () => {
  describe(".can()", () => {
    test("without user", () => {
      expect(() => {
        authorization.can();
      }).toThrow(InternalServerError);
    });
    test("without user.features", () => {
      const createdUser = {
        username: "UserWithoutFeatures",
      };
      expect(() => {
        authorization.can(createdUser);
      }).toThrow(InternalServerError);
    });
    test("with unknown feature", () => {
      const createdUser = {
        features: [],
      };
      expect(() => {
        authorization.can(createdUser, "unknown:feature");
      }).toThrow(InternalServerError);
    });
    test("with valid user and known feature", () => {
      const createdUser = {
        features: ["read:user"],
      };
      expect(authorization.can(createdUser, "read:user")).toBeTruthy();
    });
  });
  describe(".filterOutput()", () => {
    test("without user", () => {
      expect(() => {
        authorization.filterOutput();
      }).toThrow(InternalServerError);
    });
    test("without user.features", () => {
      const createdUser = {
        username: "UserWithoutFeatures",
      };
      expect(() => {
        authorization.filterOutput(createdUser);
      }).toThrow(InternalServerError);
    });
    test("with valid user and known feature and resource", () => {
      const createdUser = {
        id: 1,
        username: "username",
        features: ["read:user"],
        created_at: "",
        updated_at: "",
      };
      const result = authorization.filterOutput(
        createdUser,
        "read:user",
        createdUser,
      );

      expect(result).toEqual(createdUser);
    });
    test("with valid user and known feature but no resource", () => {
      const createdUser = {
        id: 1,
        username: "username",
        features: ["read:user"],
        created_at: "",
        updated_at: "",
      };

      expect(() => {
        authorization.filterOutput(createdUser, "read:user");
      }).toThrow(InternalServerError);
    });
  });
});
