import { Global, Module } from '@nestjs/common';
import { AdminModule } from '../admin/admin.module';
import { InitService } from './init.service';

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [InitService],
  exports: [InitService],
})
export class InitModule {}
