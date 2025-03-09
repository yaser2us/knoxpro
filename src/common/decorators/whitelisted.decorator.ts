import { SetMetadata } from '@nestjs/common';

export const IS_WHITELISTED_KEY = 'isWhitelisted';
export const Whitelist = () => SetMetadata(IS_WHITELISTED_KEY, true);