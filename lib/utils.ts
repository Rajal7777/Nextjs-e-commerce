import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertToPlainObject<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

//Format number with decimal places
//padEnd(length, character) adds characters to the end until the string reaches the specified length. used in sensitive number like account no 555*** ***
export function formatNumberWithDecimal(num: number): string {
  const [int, decimal] = num.toString().split(".");
  return decimal ? `${int}.${decimal.padEnd(2, "0")}` : `${int}.00`;
}

//Round number to two decimal places
export function roundDecimal(value: number | string) {
  const num = Number(value);

  if (isNaN(num)) {
    throw new Error("Invalid number");
  }

  return Math.round((num + Number.EPSILON) * 100) / 100;
}

//Foramat currecy
const CURRENCY_FORMATTER = new Intl.NumberFormat('en-Us', {
  currency: 'USD',
  style: 'currency',
  minimumFractionDigits: 2,
})

export function formatCurrency(amount: number | string | null){
  if ( typeof amount === 'number'){
    return CURRENCY_FORMATTER.format(amount)
  }else if( typeof amount === 'string'){
    return CURRENCY_FORMATTER.format(Number(amount));
  }else{
    return NaN;
  }
}