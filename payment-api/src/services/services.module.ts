import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConnectionService } from 'src/services/connection/connection.service';
import { RedisService } from 'src/services/redis/redis.service';

@Module({
  imports: [ConfigModule],
  providers: [RedisService, ConnectionService],
  exports: [ConnectionService],
})
export class ServicesModule {}
