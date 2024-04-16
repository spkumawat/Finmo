// src/app.controller.ts
import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { FxRatesService } from '../fx-rates/fx-rates.service';
import { BalancesService } from '../balances/balances.service';

@Controller()
export class AppController {
    constructor(
        private readonly fxRatesService: FxRatesService,
        private readonly balancesService: BalancesService
    ) {}

    @Post('/accounts/topup')
    topUpAccount(@Body() body: { currency: string, amount: number }) {
        return this.balancesService.topUp(body.currency, body.amount);
    }

    @Get('/fx-rates')
    getFxRates(@Query('from') from: string, @Query('to') to: string) {
        const rate = this.fxRatesService.getRate(from, to);
        return rate ? { rate } : { error: 'Rate not available' };
    }

    @Post('/fx-conversion')
    convertCurrency(@Body() body: { fromCurrency: string, toCurrency: string, amount: number }) {
        return this.balancesService.convert(body.fromCurrency, body.toCurrency, body.amount);
    }

    @Get('/accounts/balance')
    getBalances() {
        return this.balancesService.getBalances();
    }
}
