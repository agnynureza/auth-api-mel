import ClientError from './clientError.js';
 
class InvariantError extends ClientError {
  constructor(message) {
    super(message);
    this.name = 'InvariantError';
  }
}
 
export default InvariantError;