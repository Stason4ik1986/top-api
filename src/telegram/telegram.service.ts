import { Inject, Injectable } from '@nestjs/common';

import { Telegraf } from 'telegraf';
import { TELEGRAM_MODULE_OPTIONS } from './telegram.constants';
import { TelegramOptions } from './telegram.interface';

@Injectable()
export class TelegramService {
  bot: Telegraf;
  options: TelegramOptions;

  constructor(@Inject(TELEGRAM_MODULE_OPTIONS) options: TelegramOptions) {
    this.bot = new Telegraf(options.token);
    this.options = options;
  }

  async sendMessage(message: string, chatId: string = this.options.chatId) {
    this.bot.telegram.sendMessage(chatId, message);
  }
}
