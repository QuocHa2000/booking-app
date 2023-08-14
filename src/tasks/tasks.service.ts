import { Injectable, Logger } from '@nestjs/common';
import { Cron, Interval, Timeout, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TasksService {
    private readonly logger = new Logger(TasksService.name);

    // @Cron(CronExpression.EVERY_5_SECONDS)
    // handleCron() {
    //     console.log('Called every 5s');
    // }

    // @Interval(10000)
    // handleInterval() {
    //     this.logger.debug('Called every 10 seconds');
    // }

    // @Timeout(5000)
    // handleTimeout() {
    //     this.logger.debug('Called once after 5 seconds');
    // }
}