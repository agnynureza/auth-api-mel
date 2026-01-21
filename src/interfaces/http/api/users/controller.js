import AddUserUseCase from "../../../../applications/use_case/addUserUseCase.js";
import DomainErrorTranslator from "../../../../commons/exceptions/domainErrorTranslator.js";

class UsersController {
  constructor(container) {
    this._container = container;
  }

  PostUser = async (req, res) => {
    const addUserUseCase = this._container.getInstance(AddUserUseCase.name);
    const addedUser = await addUserUseCase.execute(req.body);

    res.status(201).json({
      status: "success",
      data: {
        addedUser,
      },
    });
  };
}

export default UsersController;
