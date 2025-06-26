import { Country } from "../enumerations/country.enum";
import { Currency } from "../enumerations/currency.enum";

export class Company {
    id: string | undefined;
    enterpriseName: string | undefined;
    country: Country | undefined;
    phoneNumber: number | undefined;
    description: string | undefined;
    amount: number | undefined;
    currency: Currency | undefined;

}