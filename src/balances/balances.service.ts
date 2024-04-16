// src/balances/balances.service.ts
import { Injectable } from '@nestjs/common';
import { FxRatesService } from '../fx-rates/fx-rates.service';

@Injectable()
export class BalancesService {
    private balanceUSD = 1000;  // Balance in USD

    constructor(private fxRatesService: FxRatesService) {}

    getBalances() {
        const balances = {};
        const currencies = ['USD', 'EUR', 'INR', 'CNY'];
        currencies.forEach(currency => {
            const rate = this.fxRatesService.getRate('USD', currency);
            balances[currency] = rate * this.balanceUSD;
        });
        return balances;
    }

    topUp(currency: string, amount: number) {
        const rate = this.fxRatesService.getRate(currency, 'USD');
        if (rate === null) {
            return { error: `No exchange rate available for ${currency}.` };
        }
        this.balanceUSD += amount * rate;
        return this.getBalances();
    }

    convert(fromCurrency: string, toCurrency: string, amount: number) {
        if (fromCurrency === 'USD' && toCurrency !== 'USD') {
            const rate = this.fxRatesService.getRate(fromCurrency, toCurrency);
            if (rate === null) {
                return { error: `No exchange rate available for ${toCurrency}.` };
            }
            return { amount: amount * rate, currency: toCurrency };
        } else {
            return { error: "Conversions can only be made from USD to another currency." };
        }
    }
}
