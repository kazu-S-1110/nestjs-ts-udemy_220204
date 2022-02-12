import { SetMetadata } from '@nestjs/common';

export const Role = (...statuses: string[]) => {
  return SetMetadata('statuses', statuses);
};
