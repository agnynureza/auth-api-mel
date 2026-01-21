/* istanbul ignore file */
 
import { createContainer } from 'instances-container';
 
// external agency
import { nanoid } from 'nanoid';
import bcrypt from 'bcrypt';
import pool from './database/postgres/pool.js';
 
// service (repository, helper, manager, etc)
import UserRepository from '../domains/users/userRepository.js';
import UserRepositoryPostgres from './repositories/userRepositoryPostgres.js';
import BcryptPasswordHash from './security/bcryptPasswordHash.js';
 
// use case
import AddUserUseCase from '../applications/use_case/addUserUseCase.js';
import PasswordHash from '../applications/security/passwordHash.js';
 
// creating container
const container = createContainer();
 
// registering services and repository
container.register([
  {
    key: UserRepository.name,
    Class: UserRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: nanoid,
        },
      ],
    },
  },
  {
    key: PasswordHash.name,
    Class: BcryptPasswordHash,
    parameter: {
      dependencies: [
        {
          concrete: bcrypt,
        },
      ],
    },
  },
]);
 
// registering use cases
container.register([
  {
    key: AddUserUseCase.name,
    Class: AddUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'userRepository',
          internal: UserRepository.name,
        },
        {
          name: 'passwordHash',
          internal: PasswordHash.name,
        },
      ],
    },
  },
]);
 
export default container;