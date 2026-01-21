/* istanbul ignore file */
import { Pool } from 'pg';
import config from '../../../commons/config.js';
 
const pool = new Pool(config.database);
 
export default pool;