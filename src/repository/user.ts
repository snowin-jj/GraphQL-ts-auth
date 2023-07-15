import { AppDataSource } from '../data-source';
import { User } from '../entity/User';

export default AppDataSource.getRepository(User);
