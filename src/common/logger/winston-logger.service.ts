import { Injectable, LoggerService } from '@nestjs/common';
import { Logger } from 'winston';

@Injectable()
export class WinstonLoggerService implements LoggerService {
  constructor(private readonly logger: Logger, private readonly context: string) {}
//   private readonly logger = new Logger();

  log(message: any, meta: any = {}) {
    this.logger.info(this.formatMessage(message), { context: this.context, ...this.formatMeta(meta) });
  }

  error(message: any, trace?: string, meta: any = {}) {
    this.logger.error(this.formatMessage(message), { context: this.context, trace, ...this.formatMeta(meta) });
  }

  warn(message: any, meta: any = {}) {
    this.logger.warn(this.formatMessage(message), { context: this.context, ...this.formatMeta(meta) });
  }

  debug(message: any, meta: any = {}) {
    this.logger.debug(this.formatMessage(message), { context: this.context, ...this.formatMeta(meta) });
  }

  verbose(message: any, meta: any = {}) {
    this.logger.verbose(this.formatMessage(message), { context: this.context, ...this.formatMeta(meta) });
  }

  private formatMessage(message: any): string {
    return typeof message === 'string' ? message : JSON.stringify(message, null, 2);
  }

  private formatMeta(meta: any): Record<string, any> {
    return typeof meta === 'object' ? meta : { extra: meta };
  }
}
