interface Pagination {
    pageNumber: number;
    limitNumber: number;
    offset: number;
}

interface PaginationData<T> {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    data: T[];
}

const getPagination = (page: number | string, limit: number | string): Pagination => {
    const pageNumber = page ? Number(page) : 0;
    const limitNumber = limit ? Number(limit) : 10;
    const offset = pageNumber * limitNumber;
    return { pageNumber, limitNumber, offset };
};

const getPaginationData = <T>(data: T[], page: number | string,limitNumber:number, totalCount: number): PaginationData<T> => {
    const currentPage = page ? Number(page) : 0;
    const totalItems = totalCount
    const totalPages = Math.ceil(totalCount/ limitNumber);

    return { currentPage, totalPages,totalItems, data };
};


export default {getPagination, getPaginationData};