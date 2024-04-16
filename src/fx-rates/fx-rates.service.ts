// src/fx-rates/fx-rates.service.ts
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Interval } from '@nestjs/schedule';

@Injectable()
export class FxRatesService {
    private rates = new Map<string, number>();
    private readonly apiKey = 'W484W2L9UV9XJ49R';  // Use your real API key here

    constructor(private httpService: HttpService) {
        this.initializeRates();
    }

    private async initializeRates() {
        this.rates.set('USD', 1);  // Set USD rate as 1
        await this.fetchRates();  // Initial fetch
    }

    @Interval(30000)
    async fetchRates() {
        const currencies = ['EUR', 'INR', 'CNY'];
        for (const currency of currencies) {
            const url = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${currency}&to_currency=USD&apikey=${this.apiKey}`;
            try {
                const response$ = this.httpService.get(url);
                const result = await firstValueFrom(response$);
                const rate = parseFloat(result.data['Realtime Currency Exchange Rate']['5. Exchange Rate']);
                this.rates.set(currency, 1 / rate);  // Store the inverse for direct USD conversion
            } catch (error) {
                console.error(`Failed to fetch rate for USD to ${currency}:`, error);
            }
        }
    }

    getRate(from: string, to: string) {
        if (from === to) return 1;
        const rateFrom = this.rates.get(from);
        const rateTo = this.rates.get(to);
        return rateFrom && rateTo ? rateTo / rateFrom : null;
    }
}
