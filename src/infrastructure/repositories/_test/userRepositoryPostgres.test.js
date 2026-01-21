import { afterAll, afterEach } from "vitest";
import UserTableTestHelper from "../../../../tests/usersTableTestHelper.js";
import InvariantError from "../../../commons/exceptions/invariantError.js";
import RegisterUser from "../../../domains/users/entities/registerUser.js";
import RegisteredUser from "../../../domains/users/entities/registeredUser.js";
import pool from "../../database/postgres/pool.js";
import UserRepositoryPostgres from "../userRepositoryPostgres.js";

describe("user respositories postgres", () => {
  afterEach(async () => {
    await UserTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("verify available username function", () => {
    it("should throw invariant error when username not available", async () => {
      // arrange
      await UserTableTestHelper.addUser({ username: 'dicoding' });
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // action & assert
      await expect(
        userRepositoryPostgres.verifyAvailableUsername("dicoding"),
      ).rejects.toThrowError(InvariantError);
    });

    it("should not throw Invariant error when username available", async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        userRepositoryPostgres.verifyAvailableUsername("dicoding"),
      ).resolves.not.toThrowError(InvariantError);
    });
  });

  describe("add user function", () => {
    it("should persist register user", async () => {
      // assert
      const registerUser = new RegisterUser({
        username: "dicoding",
        password: "secret_password",
        fullname: "Dicoding Indonesia",
      });
      const fakeIdGenerator = () => "123"; // stub!
      const userRepositoryPostgres = new UserRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      await userRepositoryPostgres.addUser(registerUser);

      // Assert
      const users = await UserTableTestHelper.findUsersById("user-123");
      expect(users).toHaveLength(1);
    });

    it("should return registered user correctly", async () => {
      // arrange
      const registerUser = new RegisterUser({
        username: "dicoding",
        password: "secret_password",
        fullname: "Dicoding Indonesia",
      });

      const fakeIdGenerator = () => "123"; // stub!
      const userRepositoryPostgres = new UserRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      const registeredUser = await userRepositoryPostgres.addUser(registerUser);

      // Assert
      expect(registeredUser).toStrictEqual(
        new RegisteredUser({
          id: "user-123",
          username: "dicoding",
          fullname: "Dicoding Indonesia",
        }),
      );
    });
  });
});
