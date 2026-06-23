import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { int } from "zod";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}


//convert prisma object into a regular JS object
//here T is the type that will be defined later unknown for now
//convertToPlainObject("hello")  ->  then T type will be T = string
/*
convertToPlainObject({
    name: "John",
    age: 25
})
    T = {
    name: string;
    age: number;
}
value: T here the value of T will be whatever the type of <T>
*/

export function convertToPlainObject<T>(value: T): T {
    return JSON.parse(JSON.stringify(value));
}

//Format number with decimal places
//padEnd(length, character) adds characters to the end until the string reaches the specified length. used in sensitive number like account no 555*** ***

export function formatNumberWithDecimal(num: number): string {
    const [int, decimal] = num.toString().split('.');
    return decimal ? `${int}.${decimal.padEnd(2, '0')}` : `${int}.00`

}