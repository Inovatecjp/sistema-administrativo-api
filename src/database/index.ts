import dbConnection from "./dbConnection";

// Op = ...

// cont
const DB = {};

const MAX_PAGE_NUMER = 500;

const isDate = (date: string): boolean => {
	try {
		return !isNaN(Date.parse(date));
	} catch (error: any) {
		return false;
	}
};
