import { vi } from "vitest";
import RegisterUser from "../../../domains/users/entities/registerUser.js";
import RegisteredUser from "../../../domains/users/entities/registeredUser.js";
import UserRepository from "../../../domains/users/userRepository.js";
import PasswordHash from "../../security/passwordHash.js";
import AddUserUseCase from "../addUserUseCase.js";

describe("add user usecase", () => {
  it("should orchestrating the add user action correctly", async () => {
    // Arrange
    const useCasePayload = {
      username: "dicoding",
      password: "secret",
      fullname: "Dicoding Indonesia",
    };

    const mockRegisteredUser = new RegisteredUser({
      id: "user-123",
      username: useCasePayload.username,
      fullname: useCasePayload.fullname,
    });

    // creating dependency of use case
    const mockUserRepository = new UserRepository();
    const mockPasswordHash = new PasswordHash();

    mockUserRepository.verifyAvailableUsername = vi
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockPasswordHash.hash = vi
      .fn()
      .mockImplementation(() => Promise.resolve("encrypted_password"));
    mockUserRepository.addUser = vi
      .fn()
      .mockImplementation(() => Promise.resolve(mockRegisteredUser));

    const getUserUseCase = new AddUserUseCase({
      userRepository: mockUserRepository,
      passwordHash: mockPasswordHash,
    });

    // Action
    const registeredUser = await getUserUseCase.execute(useCasePayload);

    // Assert
    expect(registeredUser).toStrictEqual(
      new RegisteredUser({
        id: "user-123",
        username: useCasePayload.username,
        fullname: useCasePayload.fullname,
      }),
    );
    expect(mockUserRepository.verifyAvailableUsername).toBeCalledWith(
      useCasePayload.username,
    );
    expect(mockPasswordHash.hash).toBeCalledWith(useCasePayload.password);
    expect(mockUserRepository.addUser).toBeCalledWith(
      new RegisterUser({
        username: useCasePayload.username,
        password: "encrypted_password",
        fullname: useCasePayload.fullname,
      }),
    );
  });
});
