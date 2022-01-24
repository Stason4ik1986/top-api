import { ConfigService } from '@nestjs/config';

import { TelegramOptions } from 'src/telegram/telegram.interface';


export const getTelegramConfig = async (configService: ConfigService): Promise<TelegramOptions> => {
  const token = configService.get('TELEGRAM_TOKEN');
  if (!token) {
    throw new Error('TELEGRAM_TOKEN is not defined');
  }
  return {
    token,
    chatId: configService.get('CHAT_ID') ?? '',
  };
};
