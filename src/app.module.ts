// src/app.module.ts
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app/app.controller';
import { FxRatesService } from './fx-rates/fx-rates.service';
import { BalancesService } from './balances/balances.service';

@Module({
  imports: [
    HttpModule,
    ScheduleModule.forRoot()  // Initialize the scheduling module for periodic tasks
  ],
  controllers: [AppController],  // Register the controller
  providers: [FxRatesService, BalancesService],  // Register the services
})
export class AppModule {}
