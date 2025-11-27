import { registerAs } from '@nestjs/config';

import dbConfig from '../../db/config';

export default registerAs('sql', () => (dbConfig));
